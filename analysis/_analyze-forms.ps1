# Domino DXL/XML Analysis Script
# Run this in PowerShell 7 to analyze all forms

$penangPath = "C:\Users\AL_AAF\Project\ioi_Docs\source\pdf\XML_IT_Penang"
$johorPath = "C:\Users\AL_AAF\Project\ioi_Docs\source\pdf\XML_IT_Johor"
$outDir = "C:\Users\AL_AAF\Project\ioi_Docs\analysis"

function Analyze-Form {
    param($Path)
    $content = Get-Content $Path -Raw
    $dbTitle = ""; $formName = ""
    if ($content -match "title='([^']+)'") { $dbTitle = $matches[1] }
    if ($content -match "<form name='([^']+)'") { $formName = $matches[1] }
    
    $allFields = @(); $editable = @(); $computed = @()
    [regex]::Matches($content, "<field type='([^']+)' kind='([^']+)' name='([^']+)'") | ForEach-Object {
        $fn=$_.Groups[3].Value; $ft=$_.Groups[1].Value; $fk=$_.Groups[2].Value
        if ($fn -notmatch '^\$' -and $fn -notmatch '^\d+$') {
            $allFields += [PSCustomObject]@{Name=$fn;Type=$ft;Kind=$fk}
            if ($fk -eq 'editable') { $editable += $fn }
            elseif ($fk -in @('computed','computedwhencomposed','computedfordisplay')) { $computed += $fn }
        }
    }
    
    $agents = @()
    [regex]::Matches($content, "<agent name='([^']+)'") | ForEach-Object {
        $a=$_.Groups[1].Value; if ($a -notmatch '^\$' -and $a -notmatch '^_') { $agents += $a }
    }
    
    $views = @()
    [regex]::Matches($content, "<view name='([^']+)'") | ForEach-Object {
        $v=$_.Groups[1].Value; if ($v -notmatch '^\$' -and $v -notmatch '^_') { $views += $v }
    }
    
    $hasWorkflow = if ($content -match "CurrentAction|currentaction|Send for Approval|Approved by") { $true } else { $false }
    
    [PSCustomObject]@{
        File = [System.IO.Path]::GetFileName($Path)
        FormName = $formName
        DBTitle = $dbTitle
        Site = if ($Path -match "Penang") { "Penang" } else { "Johor" }
        TotalFields = ($allFields | Select-Object Name -Unique).Count
        EditableFields = ($editable | Select-Object -Unique).Count
        ComputedFields = ($computed | Select-Object -Unique).Count
        Agents = ($agents | Select-Object -Unique) -join ", "
        AgentCount = ($agents | Select-Object -Unique).Count
        Views = ($views | Select-Object -Unique) -join ", "
        ViewCount = ($views | Select-Object -Unique).Count
        HasWorkflow = $hasWorkflow
    }
}

$allForms = @()
Get-ChildItem "$penangPath\*.xml" | ForEach-Object { $allForms += Analyze-Form $_.FullName }
Get-ChildItem "$johorPath\*.xml" | ForEach-Object { $allForms += Analyze-Form $_.FullName }

# Export CSV
$allForms | Export-Csv "$outDir\domino-field-inventory.csv" -NoTypeInformation

# Export JSON
$allForms | ConvertTo-Json -Depth 3 | Set-Content "$outDir\domino-field-inventory.json"

# Summary
$allForms | Sort-Object Site, FormName | Format-Table FormName, DBTitle, Site, TotalFields, EditableFields, AgentCount, ViewCount, HasWorkflow -AutoSize

Write-Output "`nTotal forms analyzed: $($allForms.Count)"
Write-Output "Penang: $(($allForms | Where-Object Site -eq 'Penang').Count)"
Write-Output "Johor: $(($allForms | Where-Object Site -eq 'Johor').Count)"
Write-Output "`nCSV: $outDir\domino-field-inventory.csv"
Write-Output "JSON: $outDir\domino-field-inventory.json"
