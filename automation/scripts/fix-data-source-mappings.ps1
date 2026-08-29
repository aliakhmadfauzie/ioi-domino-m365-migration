# Fix remaining IT entries in data-source-mapping.ts
# Run from repo root: .\scripts\fix-data-source-mappings.ps1

$file = "c:\Users\AL_AAF\Project\ioi_Docs\ioicodeapp\powerapps-mirror\apps\ioi-platform\src\types\data-source-mapping.ts"
$content = Get-Content $file -Raw

# Replace remaining IT department 'in-memory' + 'mock' entries with 'sharepoint' + 'connected'
# All IT forms use MainDB_IT via generated MainDBITService

$replacements = @(
    @{ old = "sourceType: 'in-memory',`r`n    connectionStatus: 'mock',`r`n    tableName: 'MainDB_IT',`r`n    tableDisplayName: 'Main IT Database (Prai)',`r`n    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',`r`n    columns: [`r`n      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true },"; new = "sourceType: 'sharepoint',`r`n    connectionStatus: 'connected',`r`n    tableName: 'MainDB_IT',`r`n    tableDisplayName: 'Main IT Database (Prai)',`r`n    siteUrl: 'https://ioioi.sharepoint.com/sites/ioi-portal-it',`r`n    columns: [`r`n      { name: 'Id', displayName: 'ID', type: 'number', direction: 'read', required: true }," }
)

foreach ($rep in $replacements) {
    $content = $content -replace [regex]::Escape($rep.old), $rep.new
}

# Also fix service references from SharePointSubmissionService to MainDBITService
$content = $content -replace "name: 'SharePointSubmissionService',
      path: 'services/sharepoint-submission-service.ts',
      methods: .*?\],`r?\n      hooks: .*?\],", "name: 'MainDBITService',
      path: 'generated/services/main-dbit-service.ts',
      methods: ['create', 'update', 'get', 'getAll'],
      hooks: ['useMainDBITList', 'useCreateMainDBIT', 'useUpdateMainDBIT'],"

Set-Content $file $content
Write-Host "Fixed remaining data source mappings. Run 'npx tsc --noEmit' to verify."
