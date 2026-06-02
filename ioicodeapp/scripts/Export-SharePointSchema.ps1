<#
.SYNOPSIS
    Generates Power Apps SDK Schema.json files for MainDB_LOG and MainDB_MTN.
    Queries SharePoint list fields and builds the schema in the required format.

.DESCRIPTION
    The schema files in .power/schemas/sharepointonline/*.Schema.json are used by
    the Power Apps SDK to resolve column metadata. They are auto-generated when
    a list is added as a data source in Power Apps Studio, but this script
    creates them directly from the SharePoint list schema via PnP PowerShell.

.PARAMETER SiteUrl
    SharePoint site URL.

.PARAMETER ListName
    List internal name (e.g., MainDB_LOG, MainDB_MTN).

.PARAMETER OutputDir
    Output directory for the Schema.json file.

.PARAMETER WhatIf
    Preview without writing.

.EXAMPLE
    .\Export-SharePointSchema.ps1 -SiteUrl "https://ioioi.sharepoint.com/sites/ioi-portal-log" -ListName "MainDB_LOG"

    .\Export-SharePointSchema.ps1 -SiteUrl "https://ioioi.sharepoint.com/sites/ioi-portal-mtn" -ListName "MainDB_MTN"
#>

param(
    [string]$SiteUrl,
    [string]$ListName,
    [string]$OutputDir = (Join-Path $PSScriptRoot "..\powerapps-mirror\apps\ioi-platform\.power\schemas\sharepointonline"),
    [switch]$WhatIf
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# Map SharePoint field type to JSON schema type
$TypeMap = @{
    'Text'               = @{ type = 'string' }
    'Note'               = @{ type = 'string' }
    'Choice'             = @{ type = 'string' }
    'DateTime'           = @{ type = 'string'; format = 'date-time' }
    'Number'             = @{ type = 'number' }
    'Boolean'            = @{ type = 'boolean' }
    'Counter'            = @{ type = 'integer'; format = 'int64' }
    'Integer'            = @{ type = 'integer'; format = 'int64' }
    'Currency'           = @{ type = 'number' }
    'Lookup'             = @{ type = 'integer'; format = 'int64' }
    'User'               = @{ type = 'object' }
    'Attachments'        = @{ type = 'array' }
    'Computed'           = @{ type = 'string' }
}

function ConvertTo-SchemaField {
    param($Field, $ListId)

    $internalName = $Field.InternalName
    $displayName  = $Field.Title
    $spType       = $Field.TypeDisplayName
    $required     = $Field.Required
    $readOnly     = $Field.ReadOnlyField

    # Map to JSON type
    $jsonType = 'string'
    $format   = $null
    $maxLength = $null

    switch ($spType) {
        'Single line of text' { $jsonType = 'string'; $maxLength = 255 }
        'Multiple lines of text' { $jsonType = 'string' }
        'Choice' { $jsonType = 'string' }
        'Date and Time' { $jsonType = 'string'; $format = 'date-time' }
        'Number' { $jsonType = 'number' }
        'Currency' { $jsonType = 'number' }
        'Yes/No' { $jsonType = 'boolean' }
        'Counter' { $jsonType = 'integer'; $format = 'int64' }
        'Integer' { $jsonType = 'integer'; $format = 'int64' }
        'Lookup' { $jsonType = 'object' }
        'Person or Group' { $jsonType = 'object' }
        default { $jsonType = 'string' }
    }

    $permission = if ($readOnly) { 'read-only' } else { 'read-write' }

    $prop = @{
        title           = $displayName
        type            = $jsonType
        'x-ms-permission' = $permission
    }

    if ($format) { $prop.format = $format }
    if ($maxLength) { $prop.maxLength = $maxLength }

    # Sort/filter capabilities for non-system fields
    if ($internalName -notmatch '^\{') {
        $prop.'x-ms-sort' = 'asc,desc'
        $prop.'x-ms-capabilities' = @{ filterFunctions = @('eq','startswith') }
    }

    # ID field
    if ($internalName -eq 'ID') {
        $prop.'x-ms-keyType' = 'primary'
        $prop.'x-ms-keyOrder' = 1
        $prop.description = 'List item id. Use this value for specifying the item to act on in other list related actions.'
    }

    # Title field
    if ($internalName -eq 'Title') {
        $prop.description = 'Human-readable record identifier'
    }

    # Modified/Created
    if ($internalName -in @('Modified','Created')) {
        $prop.description = if ($internalName -eq 'Modified') { 'When this item was last changed.' } else { 'When this item was created.' }
        $prop.format = 'date-time'
        $prop.'x-ms-capabilities' = @{ filterFunctions = @('eq','gt','ge','lt','le','ne') }
    }

    # Author/Editor
    if ($internalName -in @('Author','Editor')) {
        $prop.description = if ($internalName -eq 'Author') { 'The user who created this item.' } else { 'The user who last changed this item.' }
        $prop.type = 'object'
        $prop.properties = @{
            '@odata.type' = @{ title = '@odata.type'; 'x-ms-visibility' = 'internal'; type = 'string'; 'x-ms-permission' = 'read-only' }
            'Claims' = @{ title = 'Claims'; type = 'string'; 'x-ms-permission' = 'read-only' }
            'DisplayName' = @{ title = 'DisplayName'; type = 'string'; 'x-ms-permission' = 'read-only' }
            'Email' = @{ title = 'Email'; type = 'string'; format = 'email'; 'x-ms-permission' = 'read-only' }
            'Picture' = @{ title = 'Picture'; type = 'string'; format = 'uri'; 'x-ms-permission' = 'read-only' }
            'Department' = @{ title = 'Department'; type = 'string'; 'x-ms-permission' = 'read-only' }
            'JobTitle' = @{ title = 'JobTitle'; type = 'string'; 'x-ms-permission' = 'read-only' }
        }
        $prop.'x-ms-displayFormat' = @{
            titleProperty = 'DisplayName'
            subtitleProperty = 'Email'
            thumbnailProperty = 'Picture'
        }
    }

    # System fields
    if ($internalName -match '^\{') {
        $prop.'x-ms-sort' = 'none'
        $prop.'x-ms-permission' = 'read-only'
        if ($internalName -eq '{HasAttachments}') { $prop.type = 'boolean' }
        if ($internalName -eq '{IsFolder}') { $prop.type = 'boolean' }
    }

    return $prop
}

# --- Main ---
Write-Host "Exporting schema for $ListName from $SiteUrl" -ForegroundColor Cyan

# Get list info
$list = Get-PnPList -Identity $ListName -ErrorAction Stop
$listId = $list.Id.ToString()

# Get fields
$allFields = Get-PnPField -List $ListName -ErrorAction Stop

# Get field grouping - sort system fields last
$systemInternalNames = @('ID','Title','Modified','Created','Author','Editor',
    '{Identifier}','{IsFolder}','{Thumbnail}','{Link}','{Name}',
    '{FilenameWithExtension}','{Path}','{FullPath}','{ModerationStatus}',
    '{ModerationComment}','{ContentType}','{HasAttachments}','{Attachments}',
    '{VersionNumber}','{TriggerWindowStartToken}','{TriggerWindowEndToken}',
    'ComplianceAssetId','OData__ColorTag')

$orderedFields = $allFields | Where-Object { $_.InternalName -notin $systemInternalNames -and $_.InternalName -notmatch '^OData_' -and $_.InternalName -ne 'ComplianceAssetId' -and $_.InternalName -ne '_ColorTag' }
$systemFields = $allFields | Where-Object { $_.InternalName -in $systemInternalNames -or $_.InternalName -match '^OData_' -or $_.InternalName -eq 'ComplianceAssetId' }

# Build schema properties
$properties = [ordered]@{}
$displayOrder = @()

foreach ($field in $orderedFields) {
    $internalName = $field.InternalName
    $displayOrder += $internalName
    $properties[$internalName] = ConvertTo-SchemaField -Field $field -ListId $listId
}

# Add system fields
foreach ($field in $systemFields) {
    $internalName = $field.InternalName
    if ($internalName -match '^OData_' -or $internalName -eq 'ComplianceAssetId') { continue }
    $displayOrder += $internalName
    $properties[$internalName] = ConvertTo-SchemaField -Field $field -ListId $listId
}

# Build the Schema.json
$schema = @{
    name = $listId
    title = $list.Title
    'x-ms-permission' = 'read-write'
    'x-ms-capabilities' = @{
        sortRestrictions = @{
            sortable = $true
            unsortableProperties = @(
                '{Identifier}','{IsFolder}','{Thumbnail}','{Link}','{Name}',
                '{FilenameWithExtension}','{Path}','{FullPath}',
                '{ModerationStatus}','{ModerationComment}','{ContentType}',
                '{HasAttachments}','{Attachments}','{VersionNumber}',
                '{TriggerWindowStartToken}','{TriggerWindowEndToken}'
            )
        }
        filterRestrictions = @{
            filterable = $true
            nonFilterableProperties = @(
                '{Identifier}','{IsFolder}','{Thumbnail}','{Link}','{Name}',
                '{FilenameWithExtension}','{Path}','{FullPath}',
                '{ModerationStatus}','{ModerationComment}','{ContentType}',
                '{HasAttachments}','{Attachments}','{VersionNumber}',
                '{TriggerWindowStartToken}','{TriggerWindowEndToken}'
            )
        }
        isOnlyServerPagable = $true
        filterFunctionSupport = @('and','or','eq','startswith','gt','ge','lt','le','ne')
        serverPagingOptions = @('top','skiptoken')
        odataVersion = 3
    }
    schema = @{
        type = 'array'
        items = @{
            type = 'object'
            required = @('Title')
            properties = $properties
            'x-ms-displayFormat' = @{
                propertiesDisplayOrder = $displayOrder
                propertiesCompactDisplayOrder = @('Title')
                propertiesTabularDisplayOrder = @('Title')
            }
        }
    }
    webUrl = "$SiteUrl/Lists/$ListName/AllItems.aspx"
}

# Output
$outputPath = Join-Path $OutputDir "$($ListName.ToLowerInvariant()).Schema.json"
$schemaJson = $schema | ConvertTo-Json -Depth 100

if (-not $WhatIf) {
    # Ensure output directory exists
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }
    $schemaJson | Out-File -FilePath $outputPath -Encoding utf8
    Write-Host "  [created] $outputPath" -ForegroundColor Green
} else {
    Write-Host "  [whatif] Would create: $outputPath" -ForegroundColor Yellow
}

Write-Host "  Fields: $($properties.Count)" -ForegroundColor Cyan
