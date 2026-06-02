param(
    [string]$ConfigPath = (Join-Path $PSScriptRoot "config.json"),
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Read-JsonFile {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Missing JSON file: $Path"
    }
    Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json
}

function Resolve-TaskPath {
    param(
        [string]$BasePath,
        [string]$Path
    )
    if ([System.IO.Path]::IsPathRooted($Path)) {
        return $Path
    }
    return (Join-Path $BasePath $Path)
}

function Get-MatchedFiles {
    param(
        [string]$Root,
        [object]$Source
    )

    $sourcePath = Resolve-TaskPath -BasePath $Root -Path $Source.path
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        Write-Warning "Source path not found: $sourcePath"
        return @()
    }

    if ($Source.kind -eq "file") {
        return @(Get-Item -LiteralPath $sourcePath)
    }

    $patterns = @($Source.include)
    if ($patterns.Count -eq 0 -or [string]::IsNullOrWhiteSpace($patterns[0])) {
        $patterns = @("*")
    }

    $files = New-Object System.Collections.Generic.List[object]
    foreach ($pattern in $patterns) {
        Get-ChildItem -LiteralPath $sourcePath -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue |
            ForEach-Object { [void]$files.Add($_) }
    }

    $unique = $files | Sort-Object FullName -Unique
    if ($Source.maxFiles) {
        $unique = $unique | Select-Object -First ([int]$Source.maxFiles)
    }
    return @($unique)
}

function Read-SourceText {
    param(
        [System.IO.FileInfo]$File,
        [int]$MaxBytesPerFile
    )

    $bytes = [System.IO.File]::ReadAllBytes($File.FullName)
    if ($bytes.Length -gt $MaxBytesPerFile) {
        $bytes = $bytes[0..($MaxBytesPerFile - 1)]
        $suffix = "`n`n[Truncated at $MaxBytesPerFile bytes]"
    }
    else {
        $suffix = ""
    }

    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    return $text + $suffix
}

function Get-ResponseText {
    param([object]$Response)

    if ($Response.output_text) {
        return [string]$Response.output_text
    }

    $parts = New-Object System.Collections.Generic.List[string]
    foreach ($item in @($Response.output)) {
        foreach ($content in @($item.content)) {
            if ($content.text) {
                [void]$parts.Add([string]$content.text)
            }
        }
    }
    return ($parts -join "`n")
}

$config = Read-JsonFile -Path $ConfigPath
$taskRoot = Split-Path -Parent $ConfigPath
$repoRoot = $config.repoRoot
$promptPath = Resolve-TaskPath -BasePath $taskRoot -Path $config.promptFile
$sourcesPath = Resolve-TaskPath -BasePath $taskRoot -Path $config.sourcesFile
$outputDir = Resolve-TaskPath -BasePath $taskRoot -Path $config.outputDirectory
$logDir = Resolve-TaskPath -BasePath $taskRoot -Path $config.logDirectory

New-Item -ItemType Directory -Force -Path $outputDir, $logDir | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$logPath = Join-Path $logDir "audit-$timestamp.log"
$outputPath = Join-Path $outputDir "sharepoint-integration-audit-$timestamp.md"
$requestPath = Join-Path $logDir "request-$timestamp.md"

Start-Transcript -Path $logPath | Out-Null
try {
    $prompt = Get-Content -LiteralPath $promptPath -Raw
    $sourceManifest = Read-JsonFile -Path $sourcesPath

    $sourceBlocks = New-Object System.Collections.Generic.List[string]
    $totalBytes = 0
    foreach ($source in @($sourceManifest.sources)) {
        if ($source.enabled -eq $false) {
            continue
        }

        $files = Get-MatchedFiles -Root $repoRoot -Source $source
        foreach ($file in $files) {
            if ($totalBytes -ge [int]$config.maxSourceBytes) {
                break
            }

            $text = Read-SourceText -File $file -MaxBytesPerFile ([int]$config.maxBytesPerFile)
            $relativePath = [System.IO.Path]::GetRelativePath($repoRoot, $file.FullName)
            $block = @"
## Source: $($source.name)
Path: $relativePath

````text
$text
````
"@
            [void]$sourceBlocks.Add($block)
            $totalBytes += [System.Text.Encoding]::UTF8.GetByteCount($block)
        }
    }

    $requestText = @"
$prompt

---

# Current Run Context

- Repo root: $repoRoot
- Run timestamp: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz")
- Mode: Read-only audit. Do not modify files. Produce findings and proposed fixes only.
- Manual approval required for changes: $($config.requireManualApprovalForChanges)

# Sources Provided To This Run

$($sourceBlocks -join "`n`n")
"@

    Set-Content -LiteralPath $requestPath -Value $requestText -Encoding UTF8

    if ($DryRun) {
        Set-Content -LiteralPath $outputPath -Value "Dry run complete. Request written to $requestPath" -Encoding UTF8
        Write-Host "Dry run complete: $requestPath"
        return
    }

    $apiKey = $env:OPENAI_API_KEY
    if ([string]::IsNullOrWhiteSpace($apiKey)) {
        throw "OPENAI_API_KEY is not set. Set it for the user account that runs the scheduled task."
    }

    $body = @{
        model = $config.model
        input = @(
            @{
                role = "user"
                content = $requestText
            }
        )
    } | ConvertTo-Json -Depth 20

    $response = Invoke-RestMethod `
        -Uri "https://api.openai.com/v1/responses" `
        -Method Post `
        -Headers @{
            "Authorization" = "Bearer $apiKey"
            "Content-Type" = "application/json"
        } `
        -Body $body

    $resultText = Get-ResponseText -Response $response
    if ([string]::IsNullOrWhiteSpace($resultText)) {
        $resultText = ($response | ConvertTo-Json -Depth 20)
    }

    Set-Content -LiteralPath $outputPath -Value $resultText -Encoding UTF8
    Write-Host "Audit written: $outputPath"
}
finally {
    Stop-Transcript | Out-Null
}
