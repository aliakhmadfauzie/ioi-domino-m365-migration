<#
.SYNOPSIS
    Resolves ITSSR SharePoint access groups from Domino DXL plus mail-group workbook.

.DESCRIPTION
    Extracts the Domino groups and roles referenced by the ITSSR DXL file, then
    resolves their members from the Domino mail-group workbook. The output is a
    group summary CSV plus a flat member CSV that can be used to create the
    corresponding SharePoint groups.
#>

[CmdletBinding()]
param(
    [string]$DxlPath = "C:\Users\aliak\Downloads\OneDrive_1_5-26-2026\ITSSR_all_dxl.xml",

    [string]$WorkbookPath = "C:\Users\aliak\Downloads\Domino Mail Groups (2).xlsx",

    [string]$SummaryCsv = ".\scripts\itssr-sharepoint-groups-from-dxl.csv",

    [string]$MembersCsv = ".\scripts\itssr-sharepoint-group-members-from-dxl.csv"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-Text {
    param([object]$Value)

    if ($null -eq $Value) {
        return ""
    }

    return ([string]$Value).Trim()
}

function Add-Reference {
    param(
        [hashtable]$References,
        [string]$Name,
        [string]$Source,
        [string]$AccessPurpose
    )

    $cleanName = Get-Text $Name
    if (-not $cleanName) {
        return
    }

    if (-not $References.ContainsKey($cleanName)) {
        $References[$cleanName] = [ordered]@{
            Name = $cleanName
            Sources = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
            AccessPurposes = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
        }
    }

    [void]$References[$cleanName].Sources.Add($Source)
    [void]$References[$cleanName].AccessPurposes.Add($AccessPurpose)
}

function Get-GroupMembersFromWorkbook {
    param(
        [string]$GroupName,
        [array]$SharePointRows,
        [array]$DominoRows,
        [array]$DbRows
    )

    $emailPattern = "^[^@\s;]+@[^@\s;]+\.[^@\s;]+$"
    $members = [System.Collections.Generic.List[object]]::new()
    $seen = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    $source = ""
    $description = ""

    $sp = @($SharePointRows | Where-Object { (Get-Text $_."Group Name") -eq $GroupName } | Select-Object -First 1)
    if ($sp.Count -gt 0) {
        $source = "SharePoint Groups"
        $description = Get-Text $sp[0]."Group Description"
        foreach ($email in ((Get-Text $sp[0]."Member Emails (semicolon separated)") -split ";")) {
            $cleanEmail = Get-Text $email
            if ($cleanEmail -match $emailPattern -and $seen.Add($cleanEmail)) {
                $members.Add([pscustomobject]@{
                    Email = $cleanEmail
                    MemberName = ""
                    SourceSheet = $source
                })
            }
        }
    }

    if ($members.Count -eq 0) {
        $matches = @($DominoRows | Where-Object { (Get-Text $_."Group Name") -eq $GroupName })
        if ($matches.Count -gt 0) {
            $source = "Mail Groups (Domino)"
            foreach ($row in $matches) {
                $cleanEmail = Get-Text $row.Members
                if ($cleanEmail -eq "Not Found") {
                    $cleanEmail = Get-Text $row."Internet Email Add"
                }
                if ($cleanEmail -match $emailPattern -and $seen.Add($cleanEmail)) {
                    $members.Add([pscustomobject]@{
                        Email = $cleanEmail
                        MemberName = Get-Text $row.Member
                        SourceSheet = $source
                    })
                }
            }
        }
    }

    if ($members.Count -eq 0) {
        $matches = @($DbRows | Where-Object { (Get-Text $_.GroupName) -eq $GroupName })
        if ($matches.Count -gt 0) {
            $source = "Mail Groups (DB)"
            $description = Get-Text $matches[0]."Group Description"
            foreach ($row in $matches) {
                $cleanEmail = Get-Text $row."Email Address"
                if ($cleanEmail -match $emailPattern -and $seen.Add($cleanEmail)) {
                    $members.Add([pscustomobject]@{
                        Email = $cleanEmail
                        MemberName = Get-Text $row.Member
                        SourceSheet = $source
                    })
                }
            }
        }
    }

    return [pscustomobject]@{
        Members = @($members.ToArray())
        SourceSheet = $source
        Description = $description
    }
}

if (-not (Test-Path -LiteralPath $DxlPath)) {
    throw "DXL file '$DxlPath' was not found."
}
if (-not (Test-Path -LiteralPath $WorkbookPath)) {
    throw "Workbook '$WorkbookPath' was not found."
}

Import-Module ImportExcel -ErrorAction Stop

$dxl = Get-Content -LiteralPath $DxlPath -Raw
$references = @{}

foreach ($match in [regex]::Matches($dxl, '<item\s+name=[''"]\$Readers[''"][\s\S]*?</item>')) {
    foreach ($textMatch in [regex]::Matches($match.Value, '<text\s*>([\s\S]*?)</text>')) {
        $name = [System.Net.WebUtility]::HtmlDecode($textMatch.Groups[1].Value)
        if ($name -match '^\[(.+)\]$') {
            $name = $Matches[1]
        }
        Add-Reference -References $references -Name $name -Source '$Readers' -AccessPurpose "Document/view reader"
    }
}

foreach ($match in [regex]::Matches($dxl, '"\(\$VIMGroups\)"\s*;\s*"([^"]+)"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
    Add-Reference -References $references -Name $match.Groups[1].Value -Source '@DbLookup $VIMGroups' -AccessPurpose "Workflow lookup group"
}

foreach ($match in [regex]::Matches($dxl, '@UserRoles[\s\S]{0,120}?\[([A-Za-z0-9_ -]+)\]', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
    $role = $match.Groups[1].Value
    Add-Reference -References $references -Name $role -Source "Domino role [$role]" -AccessPurpose "Domino role / admin visibility"
}

$systemPrincipals = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
foreach ($systemName in @("LocalDomainServers", "OtherDomainServers")) {
    [void]$systemPrincipals.Add($systemName)
}

$sharePointRows = @(Import-Excel -Path $WorkbookPath -WorksheetName "SharePoint Groups")
$dominoRows = @(Import-Excel -Path $WorkbookPath -WorksheetName "Mail Groups (Domino)")
$dbRows = @(Import-Excel -Path $WorkbookPath -WorksheetName "Mail Groups (DB)")

$summary = [System.Collections.Generic.List[object]]::new()
$memberRows = [System.Collections.Generic.List[object]]::new()

foreach ($entry in ($references.Values | Sort-Object Name)) {
    $name = $entry.Name
    $isSystem = $systemPrincipals.Contains($name)
    $resolved = Get-GroupMembersFromWorkbook `
        -GroupName $name `
        -SharePointRows $sharePointRows `
        -DominoRows $dominoRows `
        -DbRows $dbRows

    $recommendation = if ($isSystem) {
        "Skip - Domino server/system group"
    } elseif ($resolved.Members.Count -gt 0) {
        "Create SharePoint group"
    } else {
        "Needs manual mapping"
    }

    $sharePointGroupName = if ($isSystem) { "" } else { "ITSSR - $name" }
    $summary.Add([pscustomobject]@{
        DominoPrincipal = $name
        SharePointGroupName = $sharePointGroupName
        Recommendation = $recommendation
        MemberCount = $resolved.Members.Count
        MemberSource = $resolved.SourceSheet
        AccessPurpose = (@($entry.AccessPurposes) -join "; ")
        DxlSource = (@($entry.Sources) -join "; ")
        Description = $resolved.Description
    })

    foreach ($member in $resolved.Members) {
        $memberRows.Add([pscustomobject]@{
            DominoPrincipal = $name
            SharePointGroupName = $sharePointGroupName
            Email = $member.Email
            MemberName = $member.MemberName
            SourceSheet = $member.SourceSheet
        })
    }
}

foreach ($path in @($SummaryCsv, $MembersCsv)) {
    $resolvedPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($path)
    $dir = Split-Path -Parent $resolvedPath
    if ($dir -and -not (Test-Path -LiteralPath $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

$summary | Export-Csv -LiteralPath $SummaryCsv -NoTypeInformation
$memberRows | Export-Csv -LiteralPath $MembersCsv -NoTypeInformation

Write-Host "Resolved DXL principals: $($summary.Count)" -ForegroundColor Cyan
Write-Host "Groups to create:        $(($summary | Where-Object Recommendation -eq 'Create SharePoint group').Count)" -ForegroundColor Cyan
Write-Host "Needs manual mapping:    $(@($summary | Where-Object Recommendation -eq 'Needs manual mapping').Count)" -ForegroundColor Cyan
Write-Host "Skipped system groups:   $(@($summary | Where-Object Recommendation -like 'Skip*').Count)" -ForegroundColor Cyan
Write-Host "Member assignments:      $($memberRows.Count)" -ForegroundColor Cyan
Write-Host "Summary CSV:             $SummaryCsv" -ForegroundColor Green
Write-Host "Members CSV:             $MembersCsv" -ForegroundColor Green
