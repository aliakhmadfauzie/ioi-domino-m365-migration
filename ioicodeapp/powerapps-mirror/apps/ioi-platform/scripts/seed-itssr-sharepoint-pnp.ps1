param(
  [switch]$Execute,
  [int]$Count = 13,
  [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it",
  [string]$MainListName = "MainDB_IT",
  [string]$ExtSupportListName = "MainDB_IT_Ext_Support",
  [string]$TenantId = $env:AZURE_TENANT_ID,
  [string]$ClientId = $env:AZURE_CLIENT_ID,
  [string]$ClientSecret = $env:AZURE_CLIENT_SECRET,
  [switch]$DeviceLogin,
  [switch]$OSLogin
)

$ErrorActionPreference = "Stop"

Import-Module PnP.PowerShell -ErrorAction Stop

$samples = @(
  @{
    RequestorEmail = "alimigration@ioioi.onmicrosoft.com"
    RequestorName = "Ali Migration"
    Site = "Kuala Lumpur"
    ServiceType = "Software"
    Application = "HCL NOTES"
    AssignedToEmail = "ravimadhu@ioioleo.com"
    SecondaryPicEmail = "qayyim@ioioleo.com"
    ProblemCategory = "Access / Authority"
    SupportMethod = "Remote"
    Subject = "MKC5 Connects Authority query"
    Description = "User query from MKC5 Connects Authority. Please validate access/routing and advise the correct authority flow."
  },
  @{
    RequestorEmail = "ravimadhu@ioioleo.com"
    RequestorName = "Ravi Madhu"
    Site = "Kuala Lumpur"
    ServiceType = "Email"
    Application = "HCL NOTES"
    AssignedToEmail = "ravimadhu@ioioleo.com"
    SecondaryPicEmail = "qayyim@ioioleo.com"
    ProblemCategory = "Mail / HCL Notes"
    SupportMethod = "Remote"
    Subject = "HCL Notes mailbox routing verification"
    Description = "Seed ticket to confirm Email/HCL Notes routing keeps Ravi as primary PIC and Qayyim as backup PIC."
  },
  @{
    RequestorEmail = "qayyim@ioioleo.com"
    RequestorName = "Qayyim"
    Site = "Kuala Lumpur"
    ServiceType = "Software"
    Application = "HCL NOTES"
    AssignedToEmail = "ravimadhu@ioioleo.com"
    SecondaryPicEmail = "qayyim@ioioleo.com"
    ProblemCategory = "Application Support"
    SupportMethod = "Remote"
    Subject = "HCL Notes authority confirmation"
    Description = "Seed ticket involving Qayyim for ITSSR support flow validation. Primary PIC remains Ravi based on HCL Notes routing."
  },
  @{
    RequestorEmail = "alimigration@ioioi.onmicrosoft.com"
    RequestorName = "Ali Migration"
    Site = "Penang"
    ServiceType = "Hardware"
    Application = "Laptop / Desktop"
    AssignedToEmail = "dannylee@ioioleo.com"
    SecondaryPicEmail = "kelly@ioioleo.com"
    ProblemCategory = "Hardware"
    SupportMethod = "Onsite"
    Subject = "Laptop docking station intermittently disconnects"
    Description = "Penang hardware sample to validate location-based routing to Danny Lee with Kelly as backup."
  },
  @{
    RequestorEmail = "ravimadhu@ioioleo.com"
    RequestorName = "Ravi Madhu"
    Site = "Johor"
    ServiceType = "Hardware"
    Application = "Printer"
    AssignedToEmail = "fadzli@ioioleo.com"
    SecondaryPicEmail = "cindychew@ioioleo.com"
    ProblemCategory = "Peripheral"
    SupportMethod = "Onsite"
    Subject = "Johor printer queue stuck"
    Description = "Johor hardware sample to validate site routing to Fadzli and backup routing to Cindy Chew."
  },
  @{
    RequestorEmail = "qayyim@ioioleo.com"
    RequestorName = "Qayyim"
    Site = "Penang"
    ServiceType = "Network"
    Application = "WiFi / LAN"
    AssignedToEmail = "ecsaw@ioioleo.com"
    SecondaryPicEmail = "taung@ioioleo.com"
    ProblemCategory = "Network Connectivity"
    SupportMethod = "Onsite"
    Subject = "Penang meeting room WiFi unstable"
    Description = "Network sample for Penang routing to EC Saw with T. Aung as backup."
  },
  @{
    RequestorEmail = "alimigration@ioioi.onmicrosoft.com"
    RequestorName = "Ali Migration"
    Site = "Johor"
    ServiceType = "Network"
    Application = "VPN"
    AssignedToEmail = "prakash@ioioleo.com"
    SecondaryPicEmail = ""
    ProblemCategory = "VPN / Remote Access"
    SupportMethod = "Remote"
    Subject = "VPN login succeeds but internal apps timeout"
    Description = "Johor network sample to validate location-based routing to Prakash."
  },
  @{
    RequestorEmail = "ravimadhu@ioioleo.com"
    RequestorName = "Ravi Madhu"
    Site = "Kuala Lumpur"
    ServiceType = "SAP"
    Application = "SAP S4/HANA"
    AssignedToEmail = "kllit@ioioleo.com"
    SecondaryPicEmail = ""
    ProblemCategory = "SAP Access"
    SupportMethod = "Remote"
    Subject = "SAP role missing after user transfer"
    Description = "SAP sample to validate type-level routing to KL IT Support."
  },
  @{
    RequestorEmail = "qayyim@ioioleo.com"
    RequestorName = "Qayyim"
    Site = "Kuala Lumpur"
    ServiceType = "Bank"
    Application = "BANK"
    AssignedToEmail = "kllit@ioioleo.com"
    SecondaryPicEmail = ""
    ProblemCategory = "Banking System"
    SupportMethod = "Remote"
    Subject = "Bank token reset request"
    Description = "Bank system sample to validate bank routing to KL IT Support."
  },
  @{
    RequestorEmail = "alimigration@ioioi.onmicrosoft.com"
    RequestorName = "Ali Migration"
    Site = "Johor"
    ServiceType = "Software"
    Application = "SALES PORTAL"
    AssignedToEmail = "cindychew@ioioleo.com"
    SecondaryPicEmail = "annaooi@ioioleo.com"
    ProblemCategory = "Application Support"
    SupportMethod = "Remote"
    Subject = "Sales portal customer lookup returns blank"
    Description = "Sales Portal sample to validate application-specific routing to Cindy Chew and Anna Ooi."
  },
  @{
    RequestorEmail = "ravimadhu@ioioleo.com"
    RequestorName = "Ravi Madhu"
    Site = "Kuala Lumpur"
    ServiceType = "Software"
    Application = "ESKER AP AUTOMATION"
    AssignedToEmail = "wstan@ioioleo.com"
    SecondaryPicEmail = "kllit@ioioleo.com"
    ProblemCategory = "Application Support"
    SupportMethod = "Remote"
    Subject = "Esker invoice validation stuck"
    Description = "Esker sample to validate application-specific routing to W. Stan with KL IT Support as backup."
  },
  @{
    RequestorEmail = "qayyim@ioioleo.com"
    RequestorName = "Qayyim"
    Site = "Penang"
    ServiceType = "Software"
    Application = "WEIGHING SYSTEM"
    AssignedToEmail = "kelly@ioioleo.com"
    SecondaryPicEmail = "dannylee@ioioleo.com"
    ProblemCategory = "Weighing System"
    SupportMethod = "Onsite"
    Subject = "Weighbridge transaction not syncing"
    Description = "Penang weighing system sample to validate location-dependent software routing to Kelly and Danny Lee."
  },
  @{
    RequestorEmail = "alimigration@ioioi.onmicrosoft.com"
    RequestorName = "Ali Migration"
    Site = "Kuala Lumpur"
    ServiceType = "Other"
    Application = "General IT"
    AssignedToEmail = "kllit@ioioleo.com"
    SecondaryPicEmail = ""
    ProblemCategory = "General IT Support"
    SupportMethod = "Remote"
    Subject = "General IT advisory request"
    Description = "Fallback ITSSR sample to validate Other routing to KL IT Support."
  }
)

$picNames = @{
  "ravimadhu@ioioleo.com" = "Ravi Madhu"
  "qayyim@ioioleo.com" = "Qayyim"
  "kllit@ioioleo.com" = "KL IT Support"
  "dannylee@ioioleo.com" = "Danny Lee"
  "kelly@ioioleo.com" = "Kelly"
  "fadzli@ioioleo.com" = "Fadzli"
  "cindychew@ioioleo.com" = "Cindy Chew"
  "ecsaw@ioioleo.com" = "EC Saw"
  "taung@ioioleo.com" = "T. Aung"
  "prakash@ioioleo.com" = "Prakash"
  "wstan@ioioleo.com" = "W. Stan"
  "annaooi@ioioleo.com" = "Anna Ooi"
}

function New-ITSSRTicketNumber {
  param([int]$Index)
  return "ITSSR-{0}-{1}" -f (Get-Date -Format "yyyyMMdd-HHmmss"), (($Index + 1).ToString("00"))
}

function New-SeedPayload {
  param(
    [hashtable]$Sample,
    [int]$Index
  )

  $ticketNo = New-ITSSRTicketNumber -Index $Index
  $assignedToEmail = $Sample["AssignedToEmail"]
  $secondaryPicEmail = $Sample["SecondaryPicEmail"]
  $assignedName = $picNames[$assignedToEmail]
  if (-not $assignedName) { $assignedName = $assignedToEmail }
  $secondaryName = $picNames[$secondaryPicEmail]
  if (-not $secondaryName) { $secondaryName = $secondaryPicEmail }

  $remarksLines = @(
    "Subject: $($Sample["Subject"])"
    "Requestor: $($Sample["RequestorName"]) <$($Sample["RequestorEmail"])>"
    "Application: $($Sample["Application"])"
    "Primary PIC: $assignedName <$assignedToEmail>"
  )
  if ($secondaryPicEmail) {
    $remarksLines += "Secondary PIC: $secondaryName <$secondaryPicEmail>"
  }
  $remarksLines += $Sample["Description"]
  $remarks = $remarksLines -join "`n"

  return @{
    TicketNo = $ticketNo
    Main = @{
      Title = $ticketNo
      FormCode = "ITSSR"
      CurrentStatus = "Submitted"
      Status = "Submitted"
      WorkflowStage = 1
      SubmittedDate = (Get-Date).ToUniversalTime().AddSeconds($Index).ToString("o")
      Site = $Sample["Site"]
      EnvironmentTag = "Production"
      Requestor_Email = $Sample["RequestorEmail"]
      IsLocked = $false
      Remarks = $remarks
    }
    Ext = @{
      Title = $ticketNo
      ParentFormCode = "ITSSR"
      ParentSite = $Sample["Site"]
      ITSSR_CaseNo = $ticketNo
      ITSSR_ServiceType = $Sample["ServiceType"]
      ITSSR_ProblemDescription = $Sample["Description"]
      ITSSR_ReportedBy_Email = $Sample["RequestorEmail"]
      ITSSR_AssignedTo_Email = $assignedToEmail
      ITSSR_ProblemCategory = $Sample["ProblemCategory"]
      ITSSR_SupportMethod = $Sample["SupportMethod"]
    }
  }
}

function Connect-SeedPnP {
  if ($OSLogin) {
    Connect-PnPOnline -Url $SiteUrl -OSLogin -ClientId $ClientId -Tenant $TenantId
    return
  }

  if ($DeviceLogin) {
    Connect-PnPOnline -Url $SiteUrl -DeviceLogin -ClientId $ClientId -Tenant $TenantId
    return
  }

  if ($ClientId -and $ClientSecret -and -not $TenantId) {
    Connect-PnPOnline -Url $SiteUrl -ClientId $ClientId -ClientSecret $ClientSecret
    return
  }

  if ($ClientId -and $ClientSecret -and $TenantId) {
    Write-Warning "PnP.PowerShell 3.x does not support Entra app-only client-secret auth. Use -DeviceLogin/-OSLogin, ACS app-only without -TenantId, or certificate auth."
  }

  if ($ClientId -and $TenantId) {
    Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId -Tenant $TenantId
    return
  }

  Connect-PnPOnline -Url $SiteUrl -Interactive
}

$takeCount = [Math]::Min($Count, $samples.Count)
[object[]]$selectedSamples = for ($i = 0; $i -lt $takeCount; $i++) {
  $samples[$i]
}
[object[]]$payloads = for ($i = 0; $i -lt $selectedSamples.Count; $i++) {
  New-SeedPayload -Sample $selectedSamples[$i] -Index $i
}

Write-Host ("{0} ITSSR PnP SharePoint seed for {1} record(s)." -f ($(if ($Execute) { "Executing" } else { "Dry run" })), $payloads.Count)
Write-Host "Site: $SiteUrl"
Write-Host "Lists: $MainListName, $ExtSupportListName"

if (-not $Execute) {
  Write-Host ""
  Write-Host "No records were written. Re-run with -Execute to create these items."
  $payloads | ConvertTo-Json -Depth 8
  exit 0
}

Connect-SeedPnP

try {
  foreach ($payload in $payloads) {
    Write-Host "Creating $($payload.TicketNo) in $MainListName..."
    $parentItem = Add-PnPListItem -List $MainListName -Values $payload.Main

    $extValues = @{} + $payload.Ext
    $extValues["ParentID"] = $parentItem.Id

    Write-Host "Creating extension row in $ExtSupportListName for parent $($parentItem.Id)..."
    try {
      $extItem = Add-PnPListItem -List $ExtSupportListName -Values $extValues
    } catch {
      if ($_.Exception.Message -notmatch "ParentID|lookup") { throw }
      $extValues.Remove("ParentID")
      $extValues["ParentIDLookupId"] = $parentItem.Id
      $extItem = Add-PnPListItem -List $ExtSupportListName -Values $extValues
    }

    Write-Host "Created $($payload.TicketNo): MainDB_IT item $($parentItem.Id), EXT item $($extItem.Id)"
  }
} finally {
  Disconnect-PnPOnline -ErrorAction SilentlyContinue
}
