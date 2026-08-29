<#
.SYNOPSIS
    Creates SharePoint groups and members from the Domino mail-group workbook.

.DESCRIPTION
    Reads the "SharePoint Groups" worksheet from the Domino migration workbook.
    For each nonblank row, the script creates or reuses a SharePoint group,
    updates its description, and adds valid email principals from the member
    email column.

    Use -ValidateOnly first to inspect the workbook without connecting to
    SharePoint or changing anything.

.EXAMPLE
    .\scripts\Create-SharePointGroupsFromDominoWorkbook.ps1 -ValidateOnly

.EXAMPLE
    .\scripts\Create-SharePointGroupsFromDominoWorkbook.ps1 `
      -SiteUrl "https://ioioi.sharepoint.com/sites/example" `
      -DeviceLogin `
      -PersistLogin `
      -WhatIf

.EXAMPLE
    .\scripts\Create-SharePointGroupsFromDominoWorkbook.ps1 `
      -SiteUrl "https://ioioi.sharepoint.com/sites/example" `
      -DeviceLogin `
      -PersistLogin
#>

[CmdletBinding(SupportsShouldProcess = $true)]
param(
    [string]$WorkbookPath = "C:\Users\aliak\Downloads\Domino Mail Groups (2).xlsx",

    [string]$WorksheetName = "SharePoint Groups",

    [string]$SiteUrl,

    [string]$ClientId = "21898567-7d8f-4634-846d-fd4cf7b185db",

    [switch]$DeviceLogin,

    [switch]$PersistLogin,

    [string]$Owner,

    [string]$Role,

    [string]$InvalidMemberReport = ".\scripts\domino-sharepoint-groups-invalid-members.csv",

    [switch]$ValidateOnly,

    [switch]$StopOnError
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$InformationPreference = "Continue"

function Get-CellText {
    param([object]$Value)

    if ($null -eq $Value) {
        return ""
    }

    return ([string]$Value).Trim()
}

function Get-WorkbookGroups {
    param(
        [string]$Path,
        [string]$Sheet
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Workbook '$Path' was not found."
    }

    Import-Module ImportExcel -ErrorAction Stop

    $rows = Import-Excel -Path $Path -WorksheetName $Sheet
    if (-not $rows) {
        throw "Worksheet '$Sheet' has no rows."
    }

    $emailPattern = "^[^@\s;]+@[^@\s;]+\.[^@\s;]+$"
    $groups = New-Object System.Collections.Generic.List[object]
    $invalidMembers = New-Object System.Collections.Generic.List[object]

    foreach ($row in $rows) {
        $groupName = Get-CellText $row."Group Name"
        if (-not $groupName) {
            continue
        }

        $description = Get-CellText $row."Group Description"
        $rawMemberCount = Get-CellText $row."Member Count"
        $memberNames = Get-CellText $row."Member Names"
        $rawEmails = Get-CellText $row."Member Emails (semicolon separated)"

        $seenInGroup = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
        $validEmails = New-Object System.Collections.Generic.List[string]

        foreach ($email in ($rawEmails -split ";")) {
            $cleanEmail = $email.Trim()
            if (-not $cleanEmail) {
                continue
            }

            if ($cleanEmail -eq "#N/A" -or $cleanEmail -notmatch $emailPattern) {
                $invalidMembers.Add([pscustomobject]@{
                    GroupName = $groupName
                    Value = $cleanEmail
                    Reason = "Not a valid email address"
                })
                continue
            }

            if ($seenInGroup.Add($cleanEmail)) {
                $validEmails.Add($cleanEmail)
            }
        }

        $groups.Add([pscustomobject]@{
            Name = $groupName
            Description = $description
            WorkbookMemberCount = $rawMemberCount
            MemberNames = $memberNames
            Members = @($validEmails.ToArray())
        })
    }

    $duplicateGroups = @(
        $groups |
            Group-Object Name |
            Where-Object { $_.Count -gt 1 } |
            ForEach-Object { $_.Name }
    )
    if ($duplicateGroups.Count -gt 0) {
        throw "Duplicate group names found: $($duplicateGroups -join ', ')"
    }

    return [pscustomobject]@{
        Groups = @($groups.ToArray())
        InvalidMembers = @($invalidMembers.ToArray())
    }
}

function Connect-ToSharePointSite {
    param([string]$Url)

    Import-Module PnP.PowerShell -ErrorAction Stop

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

    Write-Host "Connecting to $Url ..." -ForegroundColor Cyan
    Connect-PnPOnline @params
}

function Write-ValidationSummary {
    param([object]$WorkbookData)

    $memberAssignments = 0
    $uniqueMembers = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    foreach ($group in $WorkbookData.Groups) {
        $memberAssignments += $group.Members.Count
        foreach ($member in $group.Members) {
            [void]$uniqueMembers.Add($member)
        }
    }

    Write-Host "Workbook:             $WorkbookPath" -ForegroundColor Cyan
    Write-Host "Worksheet:            $WorksheetName" -ForegroundColor Cyan
    Write-Host "Groups:               $($WorkbookData.Groups.Count)" -ForegroundColor Cyan
    Write-Host "Valid member entries: $memberAssignments" -ForegroundColor Cyan
    Write-Host "Unique members:       $($uniqueMembers.Count)" -ForegroundColor Cyan
    Write-Host "Skipped members:      $($WorkbookData.InvalidMembers.Count)" -ForegroundColor Cyan

    if ($WorkbookData.InvalidMembers.Count -gt 0) {
        $reportPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($InvalidMemberReport)
        $reportDir = Split-Path -Parent $reportPath
        if ($reportDir -and -not (Test-Path -LiteralPath $reportDir)) {
            New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
        }
        $WorkbookData.InvalidMembers | Export-Csv -LiteralPath $reportPath -NoTypeInformation
        Write-Warning "Skipped member report written to $reportPath"
    }
}

$workbookData = Get-WorkbookGroups -Path $WorkbookPath -Sheet $WorksheetName
Write-ValidationSummary -WorkbookData $workbookData

if ($ValidateOnly) {
    Write-Host "Validation only: no SharePoint changes were made." -ForegroundColor Green
    return
}

if (-not $SiteUrl) {
    throw "SiteUrl is required unless -ValidateOnly is used."
}

Connect-ToSharePointSite -Url $SiteUrl

$createdGroups = 0
$updatedGroups = 0
$memberAdds = 0
$roleGrants = 0
$failures = New-Object System.Collections.Generic.List[object]

foreach ($group in $workbookData.Groups) {
    try {
        $spGroup = Get-PnPGroup -Identity $group.Name -ErrorAction SilentlyContinue

        if (-not $spGroup) {
            if ($PSCmdlet.ShouldProcess($SiteUrl, "create SharePoint group '$($group.Name)'")) {
                $newGroupParams = @{
                    Title = $group.Name
                    Description = $group.Description
                }
                if ($Owner) {
                    $newGroupParams.Owner = $Owner
                }
                New-PnPGroup @newGroupParams | Out-Null
                $createdGroups++
            }
        } else {
            if ($PSCmdlet.ShouldProcess($group.Name, "update SharePoint group description")) {
                $setGroupParams = @{
                    Identity = $group.Name
                    Description = $group.Description
                }
                if ($Owner) {
                    $setGroupParams.Owner = $Owner
                }
                Set-PnPGroup @setGroupParams | Out-Null
                $updatedGroups++
            }
        }

        if ($Role) {
            if ($PSCmdlet.ShouldProcess($group.Name, "grant site role '$Role'")) {
                Set-PnPGroupPermissions -Identity $group.Name -AddRole $Role -ErrorAction Stop
                $roleGrants++
            }
        }

        foreach ($member in $group.Members) {
            try {
                if ($PSCmdlet.ShouldProcess($group.Name, "add member '$member'")) {
                    Add-PnPGroupMember -Group $group.Name -EmailAddress $member -ErrorAction Stop
                    $memberAdds++
                }
            } catch {
                $message = $_.Exception.Message
                if ($message -match "already exists|already a member") {
                    Write-Warning "Member already present in '$($group.Name)': $member"
                } else {
                    throw
                }
            }
        }
    } catch {
        $failures.Add([pscustomobject]@{
            GroupName = $group.Name
            Error = $_.Exception.Message
        })
        Write-Warning "Failed group '$($group.Name)': $($_.Exception.Message)"
        if ($StopOnError) {
            throw
        }
    }
}

Write-Host "`nCompleted." -ForegroundColor Green
Write-Host "Groups created:        $createdGroups" -ForegroundColor Green
Write-Host "Groups updated:        $updatedGroups" -ForegroundColor Green
Write-Host "Member add operations: $memberAdds" -ForegroundColor Green
Write-Host "Site role grants:      $roleGrants" -ForegroundColor Green
Write-Host "Failures:              $($failures.Count)" -ForegroundColor Green

if ($failures.Count -gt 0) {
    $failures | Format-Table -AutoSize
    exit 1
}
