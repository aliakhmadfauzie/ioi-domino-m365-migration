<#
.SYNOPSIS
    Grants all app list access by using one SharePoint group per site.

.DESCRIPTION
    This is faster and cleaner than granting every user directly to every list.
    For each site in sharepoint-app-lists.csv, the script:

      1. Connects to the site.
      2. Creates or reuses a SharePoint group.
      3. Adds all principals from the user file to the group.
      4. Breaks list inheritance if requested.
      5. Grants the group the requested role on every configured app list.

.EXAMPLE
    .\scripts\Grant-SharePointAppAccessViaSiteGroups.ps1 `
      -PrincipalFile ".\scripts\sharepoint-list-access-users.txt" `
      -Role "Contribute" `
      -BreakInheritance `
      -ClientId "21898567-7d8f-4634-846d-fd4cf7b185db" `
      -DeviceLogin
#>

[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$ListsCsv = ".\scripts\sharepoint-app-lists.csv",

    [string]$PrincipalFile = ".\scripts\sharepoint-list-access-users.txt",

    [string[]]$Principal = @(),

    [string]$GroupName = "IOI Platform App Users",

    [string]$Role = "Contribute",

    [switch]$BreakInheritance,

    [switch]$ClearExistingListPermissions,

    [string]$ClientId,

    [switch]$DeviceLogin,

    [switch]$PersistLogin,

    [switch]$StopOnError
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$InformationPreference = "Continue"

function Connect-ToSite {
    param([string]$Url)

    Write-Host "`nConnecting to $Url ..." -ForegroundColor Cyan
    $params = @{
        Url = $Url
    }
    if ($ClientId) {
        $params.ClientId = $ClientId
    }
    if ($DeviceLogin) {
        $params.DeviceLogin = $true
    } else {
        $params.Interactive = $true
    }
    if ($PersistLogin) {
        $params.PersistLogin = $true
    }

    Connect-PnPOnline @params
}

if (-not (Test-Path -LiteralPath $ListsCsv)) {
    throw "ListsCsv '$ListsCsv' was not found."
}
if (-not (Test-Path -LiteralPath $PrincipalFile)) {
    throw "PrincipalFile '$PrincipalFile' was not found."
}

$Principal = @($Principal) + @(
    Get-Content -LiteralPath $PrincipalFile |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ -and -not $_.StartsWith("#") }
)
$Principal = @($Principal | ForEach-Object { $_.Trim() } | Where-Object { $_ } | Select-Object -Unique)
if ($Principal.Count -eq 0) {
    throw "No principals found."
}

$lists = Import-Csv -LiteralPath $ListsCsv |
    Where-Object { $_.SiteUrl -and ($_.ListId -or $_.ListName) } |
    Sort-Object SiteUrl, ListId, ListName -Unique
if ($lists.Count -eq 0) {
    throw "No lists found in '$ListsCsv'."
}

Import-Module PnP.PowerShell -ErrorAction Stop

$failures = New-Object System.Collections.Generic.List[object]
$memberAdds = 0
$listGrants = 0

Write-Host "Sites:      $(($lists | Group-Object SiteUrl).Count)" -ForegroundColor Cyan
Write-Host "Lists:      $($lists.Count)" -ForegroundColor Cyan
Write-Host "Users:      $($Principal.Count)" -ForegroundColor Cyan
Write-Host "Group:      $GroupName" -ForegroundColor Cyan
Write-Host "Role:       $Role" -ForegroundColor Cyan

foreach ($siteGroup in ($lists | Group-Object SiteUrl)) {
    try {
        Connect-ToSite -Url $siteGroup.Name

        $spGroup = Get-PnPGroup -Identity $GroupName -ErrorAction SilentlyContinue
        if (-not $spGroup) {
            if ($PSCmdlet.ShouldProcess($siteGroup.Name, "create SharePoint group '$GroupName'")) {
                Write-Host "Creating group '$GroupName'..." -ForegroundColor Yellow
                $spGroup = New-PnPGroup -Title $GroupName -Description "Users granted access to IOI Platform app lists."
            }
        } else {
            Write-Host "Using existing group '$GroupName'." -ForegroundColor DarkGray
        }

        foreach ($entry in $Principal) {
            try {
                if ($PSCmdlet.ShouldProcess($GroupName, "add member '$entry'")) {
                    Add-PnPGroupMember -Group $GroupName -LoginName $entry -ErrorAction Stop
                    $memberAdds++
                }
            } catch {
                $message = $_.Exception.Message
                if ($message -match "already exists|already a member|User cannot be found") {
                    Write-Warning "Member add note for ${entry}: $message"
                } else {
                    throw
                }
            }
        }

        foreach ($row in $siteGroup.Group) {
            $identity = if ($row.ListId) { $row.ListId } else { $row.ListName }
            $label = "$($row.ListName) [$identity]"

            try {
                $list = Get-PnPList -Identity $identity -ErrorAction Stop
                Get-PnPProperty -ClientObject $list -Property HasUniqueRoleAssignments | Out-Null

                if ($BreakInheritance -and -not $list.HasUniqueRoleAssignments) {
                    $copyRoleAssignments = -not $ClearExistingListPermissions
                    if ($PSCmdlet.ShouldProcess($label, "break inheritance")) {
                        Write-Host "Breaking inheritance: $($row.ListName)" -ForegroundColor Yellow
                        Set-PnPList `
                            -Identity $identity `
                            -BreakRoleInheritance `
                            -CopyRoleAssignments:$copyRoleAssignments `
                            -ClearSubscopes:$false
                    }
                }

                if ($PSCmdlet.ShouldProcess($label, "grant '$Role' to group '$GroupName'")) {
                    Write-Host "Granting '$Role' on $($row.ListName) to group '$GroupName'..." -ForegroundColor Cyan
                    Set-PnPListPermission -Identity $identity -Group $GroupName -AddRole $Role -ErrorAction Stop
                    $listGrants++
                }
            } catch {
                $failure = [pscustomobject]@{
                    SiteUrl = $siteGroup.Name
                    ListName = $row.ListName
                    ListId = $row.ListId
                    Error = $_.Exception.Message
                }
                $failures.Add($failure)
                Write-Warning "Failed on ${label}: $($_.Exception.Message)"
                if ($StopOnError) {
                    throw
                }
            }
        }
    } catch {
        $failure = [pscustomobject]@{
            SiteUrl = $siteGroup.Name
            ListName = "<site>"
            ListId = ""
            Error = $_.Exception.Message
        }
        $failures.Add($failure)
        Write-Warning "Failed site $($siteGroup.Name): $($_.Exception.Message)"
        if ($StopOnError) {
            throw
        }
    }
}

Write-Host "`nCompleted." -ForegroundColor Green
Write-Host "Member add operations attempted/applied: $memberAdds" -ForegroundColor Green
Write-Host "List group grants attempted/applied:      $listGrants" -ForegroundColor Green

if ($failures.Count -gt 0) {
    Write-Warning "$($failures.Count) operation(s) failed."
    $failures | Format-Table -AutoSize
    exit 1
}

