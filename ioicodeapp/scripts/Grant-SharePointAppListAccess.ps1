<#
.SYNOPSIS
    Grants access to every SharePoint list used by the IOI platform app.

.DESCRIPTION
    Reads a CSV of SharePoint lists and a text file of principals, groups lists
    by site URL, connects once per site, optionally breaks list inheritance, and
    grants the requested SharePoint role to every principal on every list.

.PARAMETER ListsCsv
    CSV with SiteUrl, ListName, and ListId columns.

.PARAMETER PrincipalFile
    Text file containing one user email/login name or SharePoint group name per line.

.PARAMETER Principal
    Optional extra user email/login name or SharePoint group name. Can be supplied multiple times.

.PARAMETER PrincipalType
    User or Group.

.PARAMETER Role
    SharePoint permission level to grant. Examples: Read, Contribute, Edit, Full Control.

.PARAMETER BreakInheritance
    Break list permission inheritance before granting access.

.PARAMETER ClearExistingListPermissions
    When breaking inheritance, do not copy parent permissions.

.PARAMETER UseWebLogin
    Use legacy SharePointPnPPowerShellOnline -UseWebLogin connection.
    Default uses PnP.PowerShell -Interactive.

.PARAMETER ClientId
    Entra ID app registration client id for PnP.PowerShell interactive login.

.PARAMETER DeviceLogin
    Use PnP.PowerShell device-code login. This is useful when browser interactive
    login is not visible from the terminal.

.PARAMETER StopOnError
    Stop at the first list/principal error. Default behavior continues and reports failures.

.EXAMPLE
    .\scripts\Grant-SharePointAppListAccess.ps1 `
      -PrincipalFile ".\scripts\sharepoint-list-access-users.txt" `
      -Role "Contribute" `
      -BreakInheritance

.EXAMPLE
    .\scripts\Grant-SharePointAppListAccess.ps1 `
      -PrincipalFile ".\scripts\sharepoint-list-access-users.txt" `
      -Role "Read" `
      -WhatIf
#>

[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$ListsCsv = ".\scripts\sharepoint-app-lists.csv",

    [string]$PrincipalFile = ".\scripts\sharepoint-list-access-users.txt",

    [string[]]$Principal = @(),

    [ValidateSet("User", "Group")]
    [string]$PrincipalType = "User",

    [string]$Role = "Contribute",

    [switch]$BreakInheritance,

    [switch]$ClearExistingListPermissions,

    [switch]$UseWebLogin,

    [string]$ClientId,

    [switch]$DeviceLogin,

    [switch]$StopOnError
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Import-PnPModule {
    param([switch]$Legacy)

    if ($Legacy) {
        Import-Module SharePointPnPPowerShellOnline -ErrorAction Stop
        return "Legacy"
    }

    Import-Module PnP.PowerShell -ErrorAction Stop
    return "Modern"
}

function Connect-ToSite {
    param(
        [string]$Url,
        [string]$Mode,
        [string]$ClientId,
        [switch]$DeviceLogin
    )

    Write-Host "`nConnecting to $Url ..." -ForegroundColor Cyan
    if ($Mode -eq "Legacy") {
        Connect-PnPOnline -Url $Url -UseWebLogin
    } elseif ($DeviceLogin -and $ClientId) {
        Connect-PnPOnline -Url $Url -DeviceLogin -ClientId $ClientId
    } elseif ($DeviceLogin) {
        Connect-PnPOnline -Url $Url -DeviceLogin
    } elseif ($ClientId) {
        Connect-PnPOnline -Url $Url -Interactive -ClientId $ClientId
    } else {
        Connect-PnPOnline -Url $Url -Interactive
    }
}

if (-not (Test-Path -LiteralPath $ListsCsv)) {
    throw "ListsCsv '$ListsCsv' was not found."
}

if ($PrincipalFile) {
    if (-not (Test-Path -LiteralPath $PrincipalFile)) {
        throw "PrincipalFile '$PrincipalFile' was not found."
    }

    $filePrincipals = Get-Content -LiteralPath $PrincipalFile |
        ForEach-Object { $_.Trim() } |
        Where-Object { $_ -and -not $_.StartsWith("#") }

    $Principal = @($Principal) + @($filePrincipals)
}

$Principal = @($Principal | ForEach-Object { $_.Trim() } | Where-Object { $_ } | Select-Object -Unique)
if ($Principal.Count -eq 0) {
    throw "Provide at least one -Principal or a -PrincipalFile with at least one entry."
}

$lists = Import-Csv -LiteralPath $ListsCsv |
    Where-Object { $_.SiteUrl -and ($_.ListId -or $_.ListName) } |
    Sort-Object SiteUrl, ListId, ListName -Unique

if ($lists.Count -eq 0) {
    throw "No lists were found in '$ListsCsv'."
}

$moduleMode = Import-PnPModule -Legacy:$UseWebLogin
$failures = New-Object System.Collections.Generic.List[object]
$grantCount = 0

Write-Host "Lists:      $($lists.Count)" -ForegroundColor Cyan
Write-Host "Principals: $($Principal.Count) $PrincipalType item(s)" -ForegroundColor Cyan
Write-Host "Role:       $Role" -ForegroundColor Cyan

foreach ($siteGroup in ($lists | Group-Object SiteUrl)) {
    Connect-ToSite -Url $siteGroup.Name -Mode $moduleMode -ClientId $ClientId -DeviceLogin:$DeviceLogin

    foreach ($row in $siteGroup.Group) {
        $identity = if ($row.ListId) { $row.ListId } else { $row.ListName }
        $label = "$($row.ListName) [$identity]"

        try {
            $list = Get-PnPList -Identity $identity -ErrorAction Stop
            Get-PnPProperty -ClientObject $list -Property HasUniqueRoleAssignments | Out-Null

            if ($BreakInheritance -and -not $list.HasUniqueRoleAssignments) {
                $copyRoleAssignments = -not $ClearExistingListPermissions
                $action = if ($copyRoleAssignments) {
                    "break inheritance and copy existing permissions"
                } else {
                    "break inheritance and clear existing copied permissions"
                }

                if ($PSCmdlet.ShouldProcess($label, $action)) {
                    Write-Host "Breaking inheritance: $label" -ForegroundColor Yellow
                    Set-PnPList `
                        -Identity $identity `
                        -BreakRoleInheritance `
                        -CopyRoleAssignments:$copyRoleAssignments `
                        -ClearSubscopes:$false
                }
            }

            foreach ($entry in $Principal) {
                if ($PSCmdlet.ShouldProcess($label, "grant '$Role' to $PrincipalType '$entry'")) {
                    Write-Host "Granting '$Role' on $($row.ListName) to $entry" -ForegroundColor Cyan
                    if ($PrincipalType -eq "Group") {
                        Set-PnPListPermission -Identity $identity -Group $entry -AddRole $Role
                    } else {
                        Set-PnPListPermission -Identity $identity -User $entry -AddRole $Role
                    }
                    $grantCount++
                }
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
}

Write-Host "`nCompleted. Grants attempted/applied: $grantCount" -ForegroundColor Green

if ($failures.Count -gt 0) {
    Write-Warning "$($failures.Count) list operation(s) failed."
    $failures | Format-Table -AutoSize
    exit 1
}
