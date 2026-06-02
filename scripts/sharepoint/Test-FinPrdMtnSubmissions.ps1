<#
.SYNOPSIS
  Verifies FIN, PRD, and MTN MainDB SharePoint submission readiness.

.DESCRIPTION
  By default this script connects to the three department sites, validates the
  target lists and required fields, and prints the test payload coverage.

  Pass -CreateTestItems to create one test row per promoted form, read it back,
  and compare key fields. Pass -Cleanup to remove those test rows after a
  successful readback.

.EXAMPLE
  pwsh ./scripts/sharepoint/Test-FinPrdMtnSubmissions.ps1 -DeviceLogin

.EXAMPLE
  pwsh ./scripts/sharepoint/Test-FinPrdMtnSubmissions.ps1 -DeviceLogin -CreateTestItems -Cleanup
#>

[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [string]$ClientId = "21898567-7d8f-4634-846d-fd4cf7b185db",
  [string]$TenantId = "ioioi.onmicrosoft.com",
  [switch]$OSLogin,
  [switch]$DeviceLogin,
  [switch]$Interactive,
  [switch]$CreateTestItems,
  [switch]$Cleanup,
  [string]$ReportPath
)

$ErrorActionPreference = "Stop"

Import-Module PnP.PowerShell -ErrorAction Stop

$runId = Get-Date -Format "yyyyMMdd-HHmmss"
$now = (Get-Date).ToUniversalTime().ToString("o")
$testerEmail = "alimigration@ioioi.onmicrosoft.com"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
if (-not $ReportPath) {
  $ReportPath = Join-Path $repoRoot "audit\sharepoint-verification\fin-prd-mtn-submission-$runId.json"
}

$targets = @(
  @{
    Key = "FIN"
    SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-fin"
    List = "MainDB_FIN"
    FormCodes = @("CAR", "CMF_A", "INSUCLAI", "RSES", "VENDREGIFINA", "EARF")
    RequiredFields = @("Title", "Status", "Department", "FormCode")
    BuildPayload = {
      param($code)
      @{
        Title = "VERIFY-FIN-$code-$runId"
        Status = "Submitted"
        Department = "FIN"
        FormCode = $code
        EntitySite = "Prai"
        SubmittedOn = $now
        Requestor_Email = $testerEmail
        Requestor_DisplayName = "Migration Verification"
        RequestedBy = "Migration Verification"
        RequestTitle = "Verification $code"
        Description = "Automated FIN verification payload for $code"
        Amount = 123.45
        BusinessArea = "Finance"
        DocumentType = $code
        WorkflowAction = "Submit"
      }
    }
    VerifyFields = @("Title", "Status", "Department", "FormCode", "RequestTitle", "Description")
  },
  @{
    Key = "PRD"
    SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-prd"
    List = "MainDB_PRD"
    FormCodes = @("TPM", "BHTADDI", "FILTCLOTREPL", "OPRPCCPFILT", "STOCALLOMEMO", "STORTANKCLEA", "WEIGSCALVERI", "EQUIPREINSP", "SAPMATEMAST", "CCP1FILTINSP", "STORTANKVERI")
    RequiredFields = @("Title", "Status", "Department", "FormCode", "FormID")
    BuildPayload = {
      param($code)
      $title = "VERIFY-PRD-$code-$runId"
      @{
        Title = $title
        Status = "Submitted"
        Department = "PRD"
        FormCode = $code
        FormID = $title
        EntitySite = "Prai"
        SubmittedOn = $now
        Requestor_Email = $testerEmail
        Requestor_DisplayName = "Migration Verification"
        RequestedBy = "Migration Verification"
        RequestTitle = "Verification $code"
        Description = "Automated PRD verification payload for $code"
        BusinessArea = "Production"
        ProductionDate = $now
        ShiftInfo = "Day"
        ProductCode = "VERIFY"
        SystemCode = "VERIFY-$code"
        InspectionDate = $now
        InspectedBy = "Migration Verification"
        WorkflowAction = "Submit"
      }
    }
    VerifyFields = @("Title", "Status", "Department", "FormCode", "FormID", "RequestTitle", "Description")
  },
  @{
    Key = "MTN"
    SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-mtn"
    List = "MainDB_MTN"
    FormCodes = @("FAILANALREPO", "MAINPLAN", "MTNEMERCHAN", "EQUIPREINSP", "PLANMAINDOCU")
    RequiredFields = @("Title", "FormCode")
    BuildPayload = {
      param($code)
      $title = "VERIFY-MTN-$code-$runId"
      $payload = @{
        Title = $title
        FormCode = $code
        CurrentStatus = "Submitted"
        Status = "Submitted"
        Department = "MTN"
        EntitySite = "Prai"
        SubmittedBy = $testerEmail
        SubmittedDate = $now
        SubmittedOn = $now
        EquipmentID = "EQ-VERIFY"
        EquipmentName = "Verification Equipment"
        Remarks = "Automated MTN verification payload for $code"
        WorkflowStage = 1
      }
      switch ($code) {
        "FAILANALREPO" {
          $payload.fAREquipmentID = "EQ-VERIFY"
          $payload.fARFailureDate = $now
          $payload.fARFailureMode = "Other"
          $payload.fARImpact = "Production"
          $payload.fARCategory = "Breakdown"
          $payload.fARSymptoms = "Verification symptom"
          $payload.fARRootCause = "Verification root cause"
          $payload.fARCorrectiveAction = "Verification corrective action"
        }
        "MAINPLAN" {
          $payload.mPPlanNo = $title
          $payload.mPEquipmentID = "EQ-VERIFY"
          $payload.mPIntervalType = "Monthly"
          $payload.mPWorkType = "Inspection"
          $payload.mPStatus = "Scheduled"
        }
        "PLANMAINDOCU" {
          $payload.pMDocumentNo = $title
          $payload.pMTitle = "Verification PM document"
          $payload.pMType = "Activity Report"
          $payload.pMEquipmentID = "EQ-VERIFY"
        }
        "MTNEMERCHAN" {
          $payload.mECChangeNo = $title
          $payload.mECDate = $now
          $payload.mECEquipmentID = "EQ-VERIFY"
          $payload.mECChangeDescription = "Verification emergency change"
          $payload.mECRiskAssessment = "High"
        }
        "EQUIPREINSP" {
          $payload.ePIEquipmentID = "EQ-VERIFY"
          $payload.ePIEquipmentName = "Verification Equipment"
          $payload.ePIInspectionDate = $now
          $payload.ePIInspector = "Migration Verification"
          $payload.ePIItem = "Verification checklist"
          $payload.ePIResult = "Pass"
        }
      }
      $payload
    }
    VerifyFields = @("Title", "FormCode", "CurrentStatus", "Department", "EntitySite")
  }
)

function Connect-TargetSite {
  param([string]$SiteUrl)
  if ($OSLogin) {
    Connect-PnPOnline -Url $SiteUrl -OSLogin -ClientId $ClientId -Tenant $TenantId
  } elseif ($DeviceLogin) {
    Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ClientId $ClientId -Tenant $TenantId
  } elseif ($Interactive) {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -Tenant $TenantId
  } else {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -Tenant $TenantId
  }
}

function Get-ComparableValue {
  param($Value)
  if ($null -eq $Value) { return "" }
  if ($Value -is [string]) { return $Value }
  if ($Value.PSObject.Properties.Name -contains "LookupValue") { return [string]$Value.LookupValue }
  if ($Value.PSObject.Properties.Name -contains "Value") { return [string]$Value.Value }
  if ($Value.PSObject.Properties.Name -contains "Label") { return [string]$Value.Label }
  return [string]$Value
}

function Assert-FieldsExist {
  param($Target)
  $fields = Get-PnPField -List $Target.List | Select-Object -ExpandProperty InternalName
  $missing = @($Target.RequiredFields | Where-Object { $_ -notin $fields })
  if ($missing.Count -gt 0) {
    throw "$($Target.List) missing required fields: $($missing -join ', ')"
  }
}

function Get-MasterFormCodes {
  param([string]$Owner)
  $registerPath = Join-Path $repoRoot "source_analysis\10_master_app_sources\MASTER_SHAREPOINT_DESIGN_REGISTER.md"
  if (-not (Test-Path $registerPath)) {
    throw "Master SharePoint design register not found: $registerPath"
  }

  $codes = New-Object System.Collections.Generic.List[string]
  Get-Content $registerPath | ForEach-Object {
    $cells = $_.Split("|") | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    if ($cells.Count -lt 8) { return }
    if ($cells[2] -ne $Owner) { return }
    if ($cells[5] -eq "FormCode") { return }
    if (-not $codes.Contains($cells[5])) {
      $codes.Add($cells[5]) | Out-Null
    }
  }

  return @($codes)
}

function Compare-CodeSet {
  param(
    [string[]]$Expected,
    [string[]]$Actual
  )
  $missing = @($Expected | Where-Object { $_ -notin $Actual })
  $extra = @($Actual | Where-Object { $_ -notin $Expected })
  return [ordered]@{
    Expected = $Expected
    Actual = $Actual
    Missing = $missing
    Extra = $extra
    Passed = ($missing.Count -eq 0 -and $extra.Count -eq 0)
  }
}

function Write-VerificationReport {
  $reportDirectory = Split-Path -Parent $ReportPath
  if ($reportDirectory -and -not (Test-Path $reportDirectory)) {
    New-Item -ItemType Directory -Path $reportDirectory -Force | Out-Null
  }

  $mode = "dry-run"
  if ($CreateTestItems) {
    $mode = "create-readback"
  }

  $createdForReport = @()
  foreach ($entry in $created) {
    $createdForReport += [ordered]@{
      Department = $entry.Target.Key
      SiteUrl = $entry.Target.SiteUrl
      List = $entry.Target.List
      Id = $entry.Id
      Title = $entry.Title
    }
  }

  $targetsForReport = @()
  foreach ($entry in $targetReports) {
    $targetsForReport += $entry
  }

  $cleanupForReport = @()
  foreach ($entry in $cleanupReports) {
    $cleanupForReport += $entry
  }

  $failuresForReport = @()
  foreach ($entry in $failures) {
    $failuresForReport += $entry
  }

  $passed = $failures.Count -eq 0

  $report = [ordered]@{
    RunId = $runId
    GeneratedOnUtc = (Get-Date).ToUniversalTime().ToString("o")
    Mode = $mode
    CleanupRequested = [bool]$Cleanup
    TesterEmail = $testerEmail
    MasterRegister = "source_analysis/10_master_app_sources/MASTER_SHAREPOINT_DESIGN_REGISTER.md"
    Targets = $targetsForReport
    CreatedItems = $createdForReport
    Cleanup = $cleanupForReport
    Failures = $failuresForReport
    Passed = $passed
  }

  $report | ConvertTo-Json -Depth 10 | Set-Content -Path $ReportPath -Encoding UTF8
  Write-Host "Report written: $ReportPath"
}

$created = New-Object System.Collections.Generic.List[object]
$failures = New-Object System.Collections.Generic.List[string]
$targetReports = New-Object System.Collections.Generic.List[object]
$cleanupReports = New-Object System.Collections.Generic.List[object]

try {
  foreach ($target in $targets) {
    Write-Host "== $($target.Key) $($target.List) ==" -ForegroundColor Cyan
    $masterCodes = Get-MasterFormCodes -Owner $target.Key
    $codeComparison = Compare-CodeSet -Expected $masterCodes -Actual $target.FormCodes
    if (-not $codeComparison.Passed) {
      $failures.Add("$($target.Key) form-code coverage does not match master register. Missing: $($codeComparison.Missing -join ', '); Extra: $($codeComparison.Extra -join ', ')") | Out-Null
    }

    $targetReport = [ordered]@{
      Department = $target.Key
      SiteUrl = $target.SiteUrl
      List = $target.List
      MasterCodeComparison = $codeComparison
      RequiredFields = $target.RequiredFields
      ListCheck = $null
      Payloads = New-Object System.Collections.Generic.List[object]
      ReadbackComparisons = New-Object System.Collections.Generic.List[object]
    }
    $targetReports.Add($targetReport) | Out-Null

    Connect-TargetSite -SiteUrl $target.SiteUrl
    try {
      $list = Get-PnPList -Identity $target.List
      Assert-FieldsExist -Target $target
      $targetReport.ListCheck = [ordered]@{
        Passed = $true
        Title = $list.Title
        Id = [string]$list.Id
        ItemCountBefore = $list.ItemCount
      }
      Write-Host "List OK: $($list.Title) ($($list.Id)); existing items: $($list.ItemCount)"
      Write-Host "Promoted forms covered: $($target.FormCodes -join ', ')"

      foreach ($code in $target.FormCodes) {
        $payload = & $target.BuildPayload $code
        $targetReport.Payloads.Add([ordered]@{
          FormCode = $code
          Title = $payload.Title
          FieldNames = @($payload.Keys)
        }) | Out-Null

        if (-not $CreateTestItems) {
          Write-Host "DRY-RUN $($target.Key) $code -> $($payload.Title)"
          continue
        }

        if ($PSCmdlet.ShouldProcess("$($target.List)/$code", "create verification item")) {
          $item = Add-PnPListItem -List $target.List -Values $payload
          $created.Add([pscustomobject]@{ Target = $target; Id = $item.Id; Title = $payload.Title }) | Out-Null
          $readback = Get-PnPListItem -List $target.List -Identity $item.Id

          foreach ($field in $target.VerifyFields) {
            $expected = Get-ComparableValue $payload[$field]
            $actual = Get-ComparableValue $readback.FieldValues[$field]
            $passed = $expected -eq $actual
            $targetReport.ReadbackComparisons.Add([ordered]@{
              FormCode = $code
              ItemId = $item.Id
              Field = $field
              Expected = $expected
              Actual = $actual
              Passed = $passed
            }) | Out-Null

            if (-not $passed) {
              $failures.Add("$($target.Key) $code ID $($item.Id) field $field expected '$expected' actual '$actual'") | Out-Null
            }
          }

          Write-Host "CREATED+READ $($target.Key) $code ID=$($item.Id)"
        }
      }
    } catch {
      $targetReport.ListCheck = [ordered]@{
        Passed = $false
        Error = $_.Exception.Message
      }
      throw
    } finally {
      Disconnect-PnPOnline -ErrorAction SilentlyContinue
    }
  }

  if ($Cleanup -and $created.Count -gt 0) {
    foreach ($entry in $created) {
      Connect-TargetSite -SiteUrl $entry.Target.SiteUrl
      try {
        if ($PSCmdlet.ShouldProcess("$($entry.Target.List) item $($entry.Id)", "delete verification item")) {
          Remove-PnPListItem -List $entry.Target.List -Identity $entry.Id -Force
          $cleanupReports.Add([ordered]@{
            Department = $entry.Target.Key
            List = $entry.Target.List
            Id = $entry.Id
            Title = $entry.Title
            Passed = $true
          }) | Out-Null
          Write-Host "CLEANED $($entry.Target.Key) ID=$($entry.Id)"
        }
      } catch {
        $cleanupReports.Add([ordered]@{
          Department = $entry.Target.Key
          List = $entry.Target.List
          Id = $entry.Id
          Title = $entry.Title
          Passed = $false
          Error = $_.Exception.Message
        }) | Out-Null
        throw
      } finally {
        Disconnect-PnPOnline -ErrorAction SilentlyContinue
      }
    }
  }

  if ($failures.Count -gt 0) {
    Write-Error "Verification failed:`n$($failures -join "`n")"
    exit 1
  }

  if ($CreateTestItems) {
    Write-Host "Verification passed for $($created.Count) created/readback items." -ForegroundColor Green
  } else {
    Write-Host "Dry run complete. Re-run with -CreateTestItems to create/read back verification rows." -ForegroundColor Green
  }
} catch {
  $failures.Add($_.Exception.Message) | Out-Null
  throw
} finally {
  Write-VerificationReport
}
