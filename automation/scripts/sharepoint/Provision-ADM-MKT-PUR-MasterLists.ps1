<#
.SYNOPSIS
    Provisions ADM, MKT, and PUR SharePoint parent/extension lists from the
    master source-analysis registers.

.DESCRIPTION
    Source of truth:
      - analysis/source_analysis/10_master_app_sources/master_app_source_coverage.csv
      - analysis/source_analysis/10_master_app_sources/master_field_dictionary.csv
      - analysis/source_analysis/10_master_app_sources/MASTER_SHAREPOINT_DESIGN_REGISTER.md

    The script is idempotent: it creates missing lists/fields and skips existing
    objects. Existing field type mismatches are reported, not overwritten.

    Design:
      - Parent list per department: MainDB_ADM, MainDB_MKT, MainDB_PUR.
      - Form-specific extension list per FormCode to avoid parent-list column
        limits and preserve source field names.
      - Fields are form-code-prefixed camelCase internal names, max 32 chars.

.EXAMPLE
    .\scripts\sharepoint\Provision-ADM-MKT-PUR-MasterLists.ps1 -WhatIf
    .\scripts\sharepoint\Provision-ADM-MKT-PUR-MasterLists.ps1
#>

param(
    [string[]]$Departments = @("ADM", "MKT", "PUR"),
    [int[]]$MasterIndexes = @(),
    [string[]]$ArtifactPaths = @(),
    [switch]$WhatIf,
    [switch]$SkipConnect,
    [string]$OutputDirectory = "analysis/sharepoint-provisioning"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$sourceRoot = Join-Path $repoRoot "source_analysis\10_master_app_sources"
$coveragePath = Join-Path $sourceRoot "master_app_source_coverage.csv"
$fieldDictionaryPath = Join-Path $sourceRoot "master_field_dictionary.csv"
$designRegisterPath = Join-Path $sourceRoot "MASTER_SHAREPOINT_DESIGN_REGISTER.md"
$envConfigPath = Join-Path $repoRoot "ioicodeapp\config\environment-config.ps1"

if (Test-Path $envConfigPath) { . $envConfigPath }

$tenantId = if (Get-Variable -Name IOI_TENANT_ID -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_TENANT_ID } else { "" }
$clientId = if (Get-Variable -Name IOI_PNP_CLIENT_ID -Scope Script -ErrorAction SilentlyContinue) { $script:IOI_PNP_CLIENT_ID } else { "" }

$siteByDepartment = @{
    ADM = "https://ioioi.sharepoint.com/sites/ioi-portal-admin"
    MKT = "https://ioioi.sharepoint.com/sites/ioi-portal-mkt"
    PUR = "https://ioioi.sharepoint.com/sites/ioi-portal-pur"
}

$parentListByDepartment = @{
    ADM = "MainDB_ADM"
    MKT = "MainDB_MKT"
    PUR = "MainDB_PUR"
}

function ConvertTo-SafeToken {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) { return "Field" }

    $parts = @([regex]::Matches($Value, "[A-Za-z0-9]+") | ForEach-Object { $_.Value })
    if (-not $parts -or $parts.Count -eq 0) { return "Field" }

    $token = ($parts | ForEach-Object {
        if ($_.Length -eq 1) { $_.ToUpperInvariant() }
        else { $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1) }
    }) -join ""

    if ([string]::IsNullOrWhiteSpace($token)) { return "Field" }
    return $token
}

function Get-ShortHash {
    param([string]$Value)
    $md5 = [System.Security.Cryptography.MD5]::Create()
    try {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
        $hash = $md5.ComputeHash($bytes)
        return ([System.BitConverter]::ToString($hash) -replace "-", "").Substring(0, 6).ToLowerInvariant()
    } finally {
        $md5.Dispose()
    }
}

function New-InternalName {
    param(
        [string]$FormCode,
        [string]$SourceField,
        [hashtable]$UsedNames
    )

    $prefixRaw = (ConvertTo-SafeToken $FormCode)
    $prefix = $prefixRaw.Substring(0, 1).ToLowerInvariant() + $prefixRaw.Substring(1)
    $fieldToken = ConvertTo-SafeToken $SourceField
    $candidate = "$prefix$fieldToken"

    if ($candidate.Length -gt 32) {
        $hash = Get-ShortHash "$FormCode|$SourceField"
        $candidate = $candidate.Substring(0, [Math]::Min(25, $candidate.Length)) + $hash
    }

    $candidate = $candidate -replace "[^A-Za-z0-9_]", ""
    if ([string]::IsNullOrWhiteSpace($candidate)) { $candidate = "field$(Get-ShortHash "$FormCode|$SourceField")" }
    if ($candidate[0] -match "[0-9]") { $candidate = "f$candidate" }

    $base = $candidate
    $i = 2
    while ($UsedNames.ContainsKey($candidate)) {
        $suffix = [string]$i
        $maxBase = 32 - $suffix.Length
        $candidate = $base.Substring(0, [Math]::Min($maxBase, $base.Length)) + $suffix
        $i++
    }

    $UsedNames[$candidate] = $true
    return $candidate
}

function Split-SourceFields {
    param([string]$SourceField)

    if ([string]::IsNullOrWhiteSpace($SourceField)) { return @() }

    $tokens = @($SourceField -split ";" |
        ForEach-Object { $_.Trim() } |
        Where-Object { -not [string]::IsNullOrWhiteSpace($_) -and $_ -ne "-" })

    if (-not $tokens -or $tokens.Count -eq 0) { return @($SourceField.Trim()) }
    return @($tokens)
}

function ConvertTo-PnPFieldType {
    param([string]$RecommendedType)

    switch -Regex ($RecommendedType) {
        "Multiline" { return "Note" }
        "^Date" { return "DateTime" }
        "Number" { return "Number" }
        "^Currency" { return "Currency" }
        "^Boolean|Yes/No" { return "Boolean" }
        "^Choice" { return "Choice" }
        default { return "Text" }
    }
}

function Ensure-PnPModule {
    if ($WhatIf) { return }
    if (-not (Get-Module -ListAvailable -Name PnP.PowerShell)) {
        throw "PnP.PowerShell is not installed. Install it with: Install-Module PnP.PowerShell -Scope CurrentUser"
    }
    Import-Module PnP.PowerShell -ErrorAction Stop
}

function Connect-TargetSite {
    param([string]$SiteUrl)

    if ($WhatIf -or $SkipConnect) { return }

    $current = $null
    try {
        $current = Get-PnPConnection -ErrorAction Stop
    } catch {
        $current = $null
    }
    if ($current -and $current.Url -eq $SiteUrl) { return }

    Write-Host "Connecting to $SiteUrl" -ForegroundColor Cyan
    if ($clientId -and $tenantId) {
        Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -Tenant $tenantId -ErrorAction Stop
    } elseif ($clientId) {
        Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $clientId -ErrorAction Stop
    } else {
        Connect-PnPOnline -Url $SiteUrl -Interactive -ErrorAction Stop
    }
}

function Ensure-List {
    param(
        [string]$ListName,
        [string]$Description
    )

    if ($WhatIf) {
        return [pscustomobject]@{ Status = "WhatIf"; Id = ""; Title = $ListName }
    }

    $list = Get-PnPList -Identity $ListName -ErrorAction SilentlyContinue
    if (-not $list) {
        $list = New-PnPList -Title $ListName -Template GenericList -Url $ListName -OnQuickLaunch:$false -ErrorAction Stop
        $status = "Created"
    } else {
        $status = "Existing"
    }

    Set-PnPList -Identity $ListName -EnableVersioning $true -MajorVersions 50 -ErrorAction SilentlyContinue | Out-Null

    if ($Description) {
        try {
            $list.Description = $Description
            $list.Update()
            Invoke-PnPQuery
        } catch {
            Write-Host "  [warn] Could not update description for ${ListName}: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }

    return [pscustomobject]@{ Status = $status; Id = [string]$list.Id; Title = $ListName }
}

function Get-ExistingFieldKind {
    param($Field)

    if (-not $Field) { return "" }
    if ($Field.TypeAsString) { return [string]$Field.TypeAsString }
    return [string]$Field.TypeDisplayName
}

function Ensure-Field {
    param(
        [string]$ListName,
        [string]$InternalName,
        [string]$DisplayName,
        [string]$Type,
        [bool]$Required = $false,
        [string]$LookupList = "",
        [string]$LookupField = "ID"
    )

    if ($InternalName -eq "Title") { return "BuiltIn" }

    if ($WhatIf) { return "WhatIf" }

    $existing = Get-PnPField -List $ListName -Identity $InternalName -ErrorAction SilentlyContinue
    if ($existing) {
        $existingKind = Get-ExistingFieldKind $existing
        return "Existing:$existingKind"
    }

    if ($Type -eq "Lookup") {
        $target = Get-PnPList -Identity $LookupList -ErrorAction SilentlyContinue
        if (-not $target) { return "MissingLookupTarget:$LookupList" }
        $requiredValue = if ($Required) { "TRUE" } else { "FALSE" }
        $fieldId = [guid]::NewGuid().ToString("B")
        $fieldXml = "<Field ID='$fieldId' Type='Lookup' DisplayName='$([System.Security.SecurityElement]::Escape($DisplayName))' StaticName='$InternalName' Name='$InternalName' List='$($target.Id)' ShowField='$LookupField' Required='$requiredValue' />"
        Add-PnPFieldFromXml -List $ListName -FieldXml $fieldXml | Out-Null
        return "Created"
    }

    $requiredValue = if ($Required) { "TRUE" } else { "FALSE" }
    $fieldId = [guid]::NewGuid().ToString("B")
    $safeDisplayName = [System.Security.SecurityElement]::Escape($DisplayName)
    $extraAttributes = ""
    if ($Type -eq "DateTime") { $extraAttributes = " Format='DateOnly'" }
    if ($Type -eq "Note") { $extraAttributes = " NumLines='6' RichText='FALSE'" }
    if ($Type -eq "Choice") {
        # Default choices for status/category fields — can be customized post-provisioning
        $fieldXml = @"
<Field ID='$fieldId' Type='Choice' DisplayName='$safeDisplayName' StaticName='$InternalName' Name='$InternalName' Required='$requiredValue' Format='Dropdown'>
    <CHOICES>
        <CHOICE>Pending</CHOICE>
        <CHOICE>Active</CHOICE>
        <CHOICE>Completed</CHOICE>
        <CHOICE>Cancelled</CHOICE>
    </CHOICES>
</Field>
"@
        Add-PnPFieldFromXml -List $ListName -FieldXml $fieldXml | Out-Null
        return "Created"
    }
    $fieldXml = "<Field ID='$fieldId' Type='$Type' DisplayName='$safeDisplayName' StaticName='$InternalName' Name='$InternalName' Required='$requiredValue'$extraAttributes />"
    Add-PnPFieldFromXml -List $ListName -FieldXml $fieldXml | Out-Null
    return "Created"
}

function Ensure-ViewForFormCode {
    param(
        [string]$ListName,
        [string]$FormCode
    )

    if ($WhatIf) { return "WhatIf" }

    $viewName = "Form_$FormCode"
    $existing = Get-PnPView -List $ListName -Identity $viewName -ErrorAction SilentlyContinue
    if ($existing) { return "Existing" }

    $query = "<Where><Eq><FieldRef Name='FormCode'/><Value Type='Text'>$FormCode</Value></Eq></Where>"
    Add-PnPView -List $ListName -Title $viewName -Fields @("Title", "FormCode", "StatusKey", "SourceSite") -Query $query | Out-Null
    return "Created"
}

function Get-ChildListName {
    param(
        [string]$Department,
        [string]$FormCode,
        [string]$DesignRegisterText
    )

    $pattern = "\|\s*\d+\s*\|[^|]*\|\s*$Department\s*\|[^|]*\|[^|]*\|\s*$FormCode\s*\|\s*([^|]+?)\s*\|"
    $match = [regex]::Match($DesignRegisterText, $pattern)
    if ($match.Success) {
        $candidate = $match.Groups[1].Value.Trim()
        if ($candidate -and $candidate -ne "-") { return $candidate }
    }

    return "MainDB_${Department}_Ext_${FormCode}"
}

function ConvertTo-NormalizedArtifactPath {
    param([string]$Path)
    if ([string]::IsNullOrWhiteSpace($Path)) { return "" }
    $normalized = $Path -replace "\\", "/"
    $root = ($repoRoot.Path -replace "\\", "/").TrimEnd("/")
    if ($normalized.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
        $normalized = $normalized.Substring($root.Length).TrimStart("/")
    }
    return $normalized
}

function New-FieldSpecsForForm {
    param([object[]]$FieldRows)

    $used = @{}
    $specs = New-Object System.Collections.Generic.List[object]

    foreach ($row in $FieldRows | Sort-Object {[int]$_.field_sequence}) {
        $sourceTokens = @(Split-SourceFields $row.source_field)
        foreach ($sourceToken in $sourceTokens) {
            $internal = New-InternalName -FormCode $row.form_code -SourceField $sourceToken -UsedNames $used
            $display = if ($sourceTokens.Count -gt 1) { "$($row.label) - $sourceToken" } else { $row.label }
            if ([string]::IsNullOrWhiteSpace($display)) { $display = $sourceToken }
            $type = ConvertTo-PnPFieldType $row.recommended_type

            $specs.Add([pscustomobject]@{
                InternalName          = $internal
                DisplayName           = $display
                SourceField           = $sourceToken
                RawSourceField        = $row.source_field
                Type                  = $type
                RecommendedType       = $row.recommended_type
                MasterIndex           = $row.master_index
                FormCode              = $row.form_code
                Label                 = $row.label
                Confidence            = $row.confidence
            })
        }
    }

    return $specs.ToArray()
}

Ensure-PnPModule
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null

$coverage = Import-Csv $coveragePath
$fieldDictionary = Import-Csv $fieldDictionaryPath
$designRegisterText = Get-Content $designRegisterPath -Raw
$hasScopeFilter = ($MasterIndexes.Count -gt 0 -or $ArtifactPaths.Count -gt 0)

$runAudit = New-Object System.Collections.Generic.List[object]
$fieldAudit = New-Object System.Collections.Generic.List[object]

foreach ($department in $Departments) {
    if (-not $siteByDepartment.ContainsKey($department)) {
        throw "No target site configured for department $department"
    }
    if (-not $parentListByDepartment.ContainsKey($department)) {
        throw "No parent list configured for department $department"
    }

    $siteUrl = $siteByDepartment[$department]
    $parentList = $parentListByDepartment[$department]
    $apps = @($coverage | Where-Object { $_.owner -eq $department })
    if ($MasterIndexes.Count -gt 0) {
        $masterIndexSet = @{}
        foreach ($idx in $MasterIndexes) { $masterIndexSet[[string]$idx] = $true }
        $apps = @($apps | Where-Object { $masterIndexSet.ContainsKey([string]$_.master_index) })
    }
    if ($ArtifactPaths.Count -gt 0) {
        $artifactSet = @{}
        foreach ($artifactPath in $ArtifactPaths) {
            $artifactSet[(ConvertTo-NormalizedArtifactPath $artifactPath)] = $true
        }
        $apps = @($apps | Where-Object { $artifactSet.ContainsKey((ConvertTo-NormalizedArtifactPath $_.artifact_path)) })
    }

    $selectedMasterIndexes = @($apps | ForEach-Object { $_.master_index } | Sort-Object -Unique)
    $selectedMasterIndexSet = @{}
    foreach ($idx in $selectedMasterIndexes) { $selectedMasterIndexSet[[string]$idx] = $true }

    $departmentFields = @($fieldDictionary | Where-Object {
        $_.owner -eq $department -and (
            (-not $hasScopeFilter) -or $selectedMasterIndexSet.ContainsKey([string]$_.master_index)
        )
    })
    $formCodes = @($departmentFields | ForEach-Object { $_.form_code } | Sort-Object -Unique)

    if ($formCodes.Count -eq 0) {
        Write-Host "`n=== $department skipped: no matching master rows ===" -ForegroundColor Yellow
        continue
    }

    Write-Host "`n=== $department -> $siteUrl ===" -ForegroundColor Cyan
    Connect-TargetSite -SiteUrl $siteUrl

    $parentDescription = "Parent list for $department forms. Provisioned from master source-analysis registers; form data stored in form-specific extension lists."
    $parentResult = Ensure-List -ListName $parentList -Description $parentDescription

    $parentFields = @(
        [pscustomobject]@{ InternalName = "FormCode"; DisplayName = "Form Code"; Type = "Text"; Required = $true }
        [pscustomobject]@{ InternalName = "StatusKey"; DisplayName = "Status Key"; Type = "Text"; Required = $false }
        [pscustomobject]@{ InternalName = "SourceSite"; DisplayName = "Source Site"; Type = "Text"; Required = $false }
        [pscustomobject]@{ InternalName = "SourceMasterIndex"; DisplayName = "Source Master Index"; Type = "Number"; Required = $false }
        [pscustomobject]@{ InternalName = "AppName"; DisplayName = "App Name"; Type = "Text"; Required = $false }
        [pscustomobject]@{ InternalName = "RequestTitle"; DisplayName = "Request Title"; Type = "Text"; Required = $false }
        [pscustomobject]@{ InternalName = "RequestorEmail"; DisplayName = "Requestor Email"; Type = "Text"; Required = $false }
        [pscustomobject]@{ InternalName = "SubmittedOn"; DisplayName = "Submitted On"; Type = "DateTime"; Required = $false }
        [pscustomobject]@{ InternalName = "CurrentAction"; DisplayName = "Current Action"; Type = "Text"; Required = $false }
        [pscustomobject]@{ InternalName = "Remarks"; DisplayName = "Remarks"; Type = "Note"; Required = $false }
    )

    foreach ($field in $parentFields) {
        $fieldResult = Ensure-Field -ListName $parentList -InternalName $field.InternalName -DisplayName $field.DisplayName -Type $field.Type -Required $field.Required
        $fieldAudit.Add([pscustomobject]@{
            Department = $department; SiteUrl = $siteUrl; ListName = $parentList; FormCode = "";
            InternalName = $field.InternalName; DisplayName = $field.DisplayName; Type = $field.Type;
            SourceField = ""; RecommendedType = "System"; Result = $fieldResult
        })
    }

    foreach ($formCode in $formCodes) {
        $formRows = @($departmentFields | Where-Object { $_.form_code -eq $formCode })
        $appRows = @($apps | Where-Object { $_.master_index -in @($formRows.master_index | Sort-Object -Unique) })
        $childList = Get-ChildListName -Department $department -FormCode $formCode -DesignRegisterText $designRegisterText
        $description = "$department $formCode form-specific storage. Source master indexes: $((@($formRows.master_index | Sort-Object -Unique)) -join ', ')."

        Write-Host "  $formCode -> $childList ($($formRows.Count) source rows)" -ForegroundColor Gray
        $childResult = Ensure-List -ListName $childList -Description $description

        $baseChildFields = @(
            [pscustomobject]@{ InternalName = "ParentID"; DisplayName = "Parent ID"; Type = "Lookup"; Required = $false; LookupList = $parentList }
            [pscustomobject]@{ InternalName = "ParentItemID"; DisplayName = "Parent Item ID"; Type = "Number"; Required = $false; LookupList = "" }
            [pscustomobject]@{ InternalName = "ParentFormCode"; DisplayName = "Parent Form Code"; Type = "Text"; Required = $true; LookupList = "" }
            [pscustomobject]@{ InternalName = "SourceSite"; DisplayName = "Source Site"; Type = "Text"; Required = $false; LookupList = "" }
            [pscustomobject]@{ InternalName = "SourceMasterIndex"; DisplayName = "Source Master Index"; Type = "Number"; Required = $false; LookupList = "" }
            [pscustomobject]@{ InternalName = "RowNumber"; DisplayName = "Row Number"; Type = "Number"; Required = $false; LookupList = "" }
        )

        $created = 0
        $existing = 0
        $issues = New-Object System.Collections.Generic.List[string]

        foreach ($field in $baseChildFields) {
            $lookupList = if ($field.PSObject.Properties.Name -contains "LookupList") { $field.LookupList } else { "" }
            $fieldResult = Ensure-Field -ListName $childList -InternalName $field.InternalName -DisplayName $field.DisplayName -Type $field.Type -Required $field.Required -LookupList $lookupList
            if ($fieldResult -eq "Created") { $created++ }
            elseif ($fieldResult -match "^(Existing|BuiltIn|WhatIf)") { $existing++ }
            else { $issues.Add("$($field.InternalName):$fieldResult") }
            $fieldAudit.Add([pscustomobject]@{
                Department = $department; SiteUrl = $siteUrl; ListName = $childList; FormCode = $formCode;
                InternalName = $field.InternalName; DisplayName = $field.DisplayName; Type = $field.Type;
                SourceField = ""; RecommendedType = "System"; Result = $fieldResult
            })
        }

        $fieldSpecs = New-FieldSpecsForForm -FieldRows $formRows
        foreach ($spec in $fieldSpecs) {
            $fieldResult = Ensure-Field -ListName $childList -InternalName $spec.InternalName -DisplayName $spec.DisplayName -Type $spec.Type
            if ($fieldResult -eq "Created") { $created++ }
            elseif ($fieldResult -match "^(Existing|BuiltIn|WhatIf)") { $existing++ }
            else { $issues.Add("$($spec.InternalName):$fieldResult") }

            $fieldAudit.Add([pscustomobject]@{
                Department = $department
                SiteUrl = $siteUrl
                ListName = $childList
                FormCode = $formCode
                InternalName = $spec.InternalName
                DisplayName = $spec.DisplayName
                Type = $spec.Type
                SourceField = $spec.SourceField
                RecommendedType = $spec.RecommendedType
                Result = $fieldResult
            })
        }

        $viewResult = Ensure-ViewForFormCode -ListName $parentList -FormCode $formCode
        $runAudit.Add([pscustomobject]@{
            Department = $department
            SiteUrl = $siteUrl
            ParentList = $parentList
            ParentListStatus = $parentResult.Status
            FormCode = $formCode
            ExtensionList = $childList
            ExtensionListStatus = $childResult.Status
            SourceRows = $formRows.Count
            FieldsPlanned = $fieldSpecs.Count + $baseChildFields.Count
            FieldsCreated = $created
            FieldsExistingOrPlanned = $existing
            ViewStatus = $viewResult
            Issues = ($issues -join "; ")
        })
    }
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$auditCsv = Join-Path $OutputDirectory "adm-mkt-pur-provisioning-$timestamp.csv"
$auditJson = Join-Path $OutputDirectory "adm-mkt-pur-provisioning-$timestamp.json"
$fieldsCsv = Join-Path $OutputDirectory "adm-mkt-pur-field-audit-$timestamp.csv"
$fieldsJson = Join-Path $OutputDirectory "adm-mkt-pur-field-audit-$timestamp.json"
$latestJson = Join-Path $OutputDirectory "adm-mkt-pur-provisioning.latest.json"

$runAudit | Export-Csv -NoTypeInformation -Path $auditCsv
$runAudit | ConvertTo-Json -Depth 8 | Set-Content -Path $auditJson
$runAudit | ConvertTo-Json -Depth 8 | Set-Content -Path $latestJson
$fieldAudit | Export-Csv -NoTypeInformation -Path $fieldsCsv
$fieldAudit | ConvertTo-Json -Depth 8 | Set-Content -Path $fieldsJson

Write-Host "`nProvisioning audit written:" -ForegroundColor Green
Write-Host "  $auditCsv"
Write-Host "  $auditJson"
Write-Host "  $fieldsCsv"
Write-Host "  $fieldsJson"
if ($WhatIf) { Write-Host "WhatIf completed. No SharePoint changes were made." -ForegroundColor Yellow }
