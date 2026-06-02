param(
  [Parameter(Mandatory = $true)]
  [string]$BundlePath,

  [string]$MirrorRoot = "powerapps-mirror",

  [string[]]$ExcludePrefix = @()
)

$ErrorActionPreference = "Stop"

$resolvedBundle = Resolve-Path -LiteralPath $BundlePath
$resolvedMirror = Resolve-Path -LiteralPath $MirrorRoot
$bundleText = Get-Content -LiteralPath $resolvedBundle -Raw

$pattern = '(?ms)^--- FILE: (?<path>.+?) ---\r?\n(?<body>.*?)(?:\r?\n)?--- END FILE ---'
$matches = [regex]::Matches($bundleText, $pattern)

if ($matches.Count -eq 0) {
  throw "No bundle file blocks found in $resolvedBundle"
}

$written = New-Object System.Collections.Generic.List[string]
$skipped = New-Object System.Collections.Generic.List[string]

foreach ($match in $matches) {
  $relativePath = $match.Groups["path"].Value.Trim()
  if ([string]::IsNullOrWhiteSpace($relativePath)) {
    throw "Encountered an empty FILE path."
  }

  if ([System.IO.Path]::IsPathRooted($relativePath) -or $relativePath.Contains("..")) {
    throw "Unsafe bundle path blocked: $relativePath"
  }

  $normalizedRelativePath = $relativePath -replace '\\', '/'
  $shouldSkip = $false
  foreach ($prefix in $ExcludePrefix) {
    $normalizedPrefix = ($prefix -replace '\\', '/').TrimEnd('/') + '/'
    if ($normalizedRelativePath.StartsWith($normalizedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
      $shouldSkip = $true
      break
    }
  }

  if ($shouldSkip) {
    $skipped.Add($relativePath)
    continue
  }

  $destination = Join-Path $resolvedMirror $relativePath
  $destinationFull = [System.IO.Path]::GetFullPath($destination)
  $mirrorFull = [System.IO.Path]::GetFullPath($resolvedMirror)

  if (-not $destinationFull.StartsWith($mirrorFull, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Bundle path escapes mirror root: $relativePath"
  }

  $destinationDir = Split-Path -Parent $destinationFull
  New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null

  $body = $match.Groups["body"].Value
  $body = $body -replace "`r`n", "`n"
  [System.IO.File]::WriteAllText($destinationFull, $body, [System.Text.UTF8Encoding]::new($false))
  $written.Add($relativePath)
}

$log = [ordered]@{
  importedAt = (Get-Date).ToString("s")
  bundlePath = $resolvedBundle.Path
  mirrorRoot = $resolvedMirror.Path
  fileCount = $written.Count
  skippedCount = $skipped.Count
  files = $written
  skippedFiles = $skipped
}

$bundleName = [System.IO.Path]::GetFileNameWithoutExtension($resolvedBundle.Path)
$safeBundleName = $bundleName -replace '[^A-Za-z0-9._-]', '-'
$logPath = Join-Path $resolvedMirror "import-log-$safeBundleName.json"
$log | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $logPath -Encoding utf8

Write-Host "Imported $($written.Count) files into $($resolvedMirror.Path)"
if ($skipped.Count -gt 0) {
  Write-Host "Skipped $($skipped.Count) files by prefix exclusion"
}
Write-Host "Import log: $logPath"
