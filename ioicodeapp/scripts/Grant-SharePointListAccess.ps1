<#
.SYNOPSIS
    Grants a user or SharePoint group access to a SharePoint list using PnP.

.DESCRIPTION
    Connects to a SharePoint site, optionally breaks permission inheritance on
    the target list, and grants a role such as Read, Contribute, Edit, or Full Control.

    By default, existing list permissions are preserved when inheritance is broken.
    Pass -ClearExistingListPermissions if the list should start with no copied
    permissions before granting the new principal.

.PARAMETER SiteUrl
    SharePoint site URL.

.PARAMETER ListName
    Target list title or internal name.

.PARAMETER Principal
    User email/login name or SharePoint group name. Can be supplied multiple times.

.PARAMETER PrincipalFile
    Text file containing one user email/login name or SharePoint group name per line.
    Blank lines and lines starting with # are ignored.

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

.PARAMETER WhatIf
    Preview the permission change without writing to SharePoint.

.EXAMPLE
    .\Grant-SharePointListAccess.ps1 `
      -SiteUrl "https://ioioi.sharepoint.com/sites/ioi-portal-it" `
      -ListName "MainDB_IT" `
      -Principal "user@ioigroup.com" `
      -Role "Contribute" `
      -BreakInheritance

.EXAMPLE
    .\Grant-SharePointListAccess.ps1 `
      -SiteUrl "https://ioioi.sharepoint.com/sites/ioi-portal-it" `
      -ListName "maindb_it_ext_support" `
      -Principal "IT Approvers" `
      -PrincipalType Group `
      -Role "Edit" `
      -BreakInheritance

.EXAMPLE
    .\Grant-SharePointListAccess.ps1 `
      -SiteUrl "https://ioioi.sharepoint.com/sites/ioi-portal-it" `
      -ListName "MainDB_IT" `
      -PrincipalFile ".\scripts\sharepoint-list-access-users.txt" `
      -Role "Contribute" `
      -BreakInheritance

.REQUIREMENTS
    Preferred:
      Install-Module PnP.PowerShell -Scope CurrentUser

    Legacy fallback used only with -UseWebLogin:
      Install-Module SharePointPnPPowerShellOnline -Scope CurrentUser
#>

[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $true)]
    [string]$ListName,

    [string[]]$Principal = @(),

    [string]$PrincipalFile,

    [ValidateSet("User", "Group")]
    [string]$PrincipalType = "User",

    [string]$Role = "Contribute",

    [switch]$BreakInheritance,

    [switch]$ClearExistingListPermissions,

    [switch]$UseWebLogin
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
        [string]$Mode
    )

    Write-Host "Connecting to $Url ..." -ForegroundColor Cyan
    if ($Mode -eq "Legacy") {
        Connect-PnPOnline -Url $Url -UseWebLogin
    } else {
        Connect-PnPOnline -Url $Url -Interactive
    }
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

$moduleMode = Import-PnPModule -Legacy:$UseWebLogin
Connect-ToSite -Url $SiteUrl -Mode $moduleMode

$list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
if (-not $list) {
    throw "List '$ListName' was not found on $SiteUrl."
}

Get-PnPProperty -ClientObject $list -Property HasUniqueRoleAssignments | Out-Null

Write-Host "Target list: $($list.Title)" -ForegroundColor Cyan
Write-Host "Principals:  $($Principal.Count) $PrincipalType item(s)" -ForegroundColor Cyan
Write-Host "Role:        $Role" -ForegroundColor Cyan

if ($BreakInheritance -and -not $list.HasUniqueRoleAssignments) {
    $copyRoleAssignments = -not $ClearExistingListPermissions
    $action = if ($copyRoleAssignments) {
        "break inheritance and copy existing permissions"
    } else {
        "break inheritance and clear existing copied permissions"
    }

    if ($PSCmdlet.ShouldProcess($ListName, $action)) {
        Write-Host "Breaking permission inheritance on list..." -ForegroundColor Yellow
        Set-PnPList `
            -Identity $ListName `
            -BreakRoleInheritance `
            -CopyRoleAssignments:$copyRoleAssignments `
            -ClearSubscopes:$false
    }
} elseif ($BreakInheritance) {
    Write-Host "List already has unique permissions; inheritance is already broken." -ForegroundColor DarkGray
}

foreach ($entry in $Principal) {
    if ($PSCmdlet.ShouldProcess($ListName, "grant '$Role' to $PrincipalType '$entry'")) {
        Write-Host "Granting '$Role' to $PrincipalType '$entry'..." -ForegroundColor Cyan
        if ($PrincipalType -eq "Group") {
            Set-PnPListPermission -Identity $ListName -Group $entry -AddRole $Role
        } else {
            Set-PnPListPermission -Identity $ListName -User $entry -AddRole $Role
        }
    }
}

Write-Host "Done. Granted '$Role' on '$($list.Title)' to $($Principal.Count) $PrincipalType item(s)." -ForegroundColor Green
