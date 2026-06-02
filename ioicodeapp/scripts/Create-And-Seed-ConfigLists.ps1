param([string]$SiteUrl = "https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites",[string]$ClientId = "21898567-7d8f-4634-846d-fd4cf7b185db")
Connect-PnPOnline -Url $SiteUrl -Interactive -ClientId $ClientId

# Create lists
foreach ($list in @("Config_Companies","Config_Departments","Config_ApproverMatrix")) {
    $exists = Get-PnPList -Identity $list -ErrorAction SilentlyContinue
    if (-not $exists) {
        New-PnPList -Title $list -Template GenericList -OnQuickLaunch | Out-Null
        Write-Host "[created] $list" -ForegroundColor Green
    } else { Write-Host "[exists] $list" -ForegroundColor DarkGray }
}

# Add fields
$fields = @{
    Config_Companies = @(
        @{N="CompanyCode";D="Company Code";T="Text";R=$true},
        @{N="CompanyName";D="Company Name";T="Text";R=$true},
        @{N="IsActive";D="Is Active";T="Boolean"},
        @{N="Site";D="Site";T="Choice";C=@("Prai","Johor","Kuala Lumpur","All Sites")},
        @{N="IsPanCen";D="PanCen Company";T="Boolean"}
    )
    Config_Departments = @(
        @{N="DepartmentCode";D="Department Code";T="Text";R=$true},
        @{N="DepartmentName";D="Department Name";T="Text";R=$true},
        @{N="IsActive";D="Is Active";T="Boolean"},
        @{N="Module";D="Module";T="Choice";C=@("M1","M2","M3","M4","M5","M6","M7","HR","QA","QC","Other")},
        @{N="HODEmail";D="HOD Email";T="Text"}
    )
    Config_ApproverMatrix = @(
        @{N="FormCode";D="Form Code";T="Choice";R=$true;C=@("EAF","NIR","RS","SFAR","UR","ITSSR","PRF","HI","IAL1","IAL2","IAL3","IAL4","IAL5","SAPAMR","SAPCA","SAPCR","SAPSLCF","SAPSOF","SAPSOF2","SAPTR","SAPDRP","IOIP","ITI","ITP","ITP2","ITSC","DCALOG","SVRREC")},
        @{N="StageOrder";D="Stage Order";T="Number";R=$true},
        @{N="StageName";D="Stage Name";T="Text";R=$true},
        @{N="ApproverRole";D="Approver Role";T="Choice";R=$true;C=@("Requester","HOD","DivisionDirector","COO","ITManager","ITPIC","ITAdmin","NotesAdmin","ITHardware","BPO","ProjectManager","ABAPDeveloper","FunctionalOwner","ISG","FolderOwner","ED","Finance","ITStaff","ITVerifier","ITSuperior","System")},
        @{N="ConditionField";D="Condition Field";T="Text"},
        @{N="ConditionValue";D="Condition Value";T="Text"},
        @{N="IsActive";D="Is Active";T="Boolean"}
    )
}
foreach ($list in $fields.Keys) {
    foreach ($f in $fields[$list]) {
        $p = @{List=$list;InternalName=$f.N;DisplayName=$f.D;Type=$f.T}
        if ($f.R) { $p.Required = $true }
        if ($f.C) { $p.Choices = $f.C }
        Add-PnPField @p -ErrorAction SilentlyContinue | Out-Null
    }
    Write-Host "[fields] $list" -ForegroundColor Green
}

# Seed companies
$list = Get-PnPList -Identity "Config_Companies"
$companies = @(
    @("IOICORP","IOI Corporation Berhad","All Sites","No","Yes"),
    @("IOIOLEO","IOI Oleochemical Industries Berhad","Prai","No","Yes"),
    @("ACIDCHEM","IOI Acidchem Sdn Bhd","Prai","No","Yes"),
    @("PCEO","IOI Pan-Century Oleochemicals Sdn Bhd","Johor","Yes","Yes"),
    @("PCOC","IOI Pan-Century Edible Oils Sdn Bhd","Johor","Yes","Yes"),
    @("LCAP","Loders Croklaan Asia Pacific Sdn Bhd","Prai","No","Yes"),
    @("BIOENERGY","IOI Bio-Energy Sdn Bhd","Prai","No","Yes"),
    @("BLC","Bunge Loders Croklaan","All Sites","No","Yes"),
    @("IOIEO","IOI Edible Oils Sdn Bhd","Prai","No","Yes"),
    @("PCS","Pan-Century Surfactants Sdn Bhd","Johor","Yes","Yes"),
    @("CONTRACTOR","Contractor","All Sites","No","Yes"),
    @("VENDOR","Vendor/Third Party","All Sites","No","Yes")
)
foreach ($c in $companies) {
    $exists = Get-PnPListItem -List $list -Query "<View><Query><Where><Eq><FieldRef Name='CompanyCode'/><Value Type='Text'>$($c[0])</Value></Eq></Where></Query></View>"
    if (-not $exists) {
        Add-PnPListItem -List $list -Values @{Title=$c[1];CompanyCode=$c[0];CompanyName=$c[1];Site=$c[2];IsPanCen=$c[3];IsActive=$c[4]} | Out-Null
        Write-Host "[seed] $($c[0])" -ForegroundColor Green
    }
}

# Seed departments
$list = Get-PnPList -Identity "Config_Departments"
$departments = @(
    @("IT","Information Technology","M1"),@("HR","Human Resources","HR"),
    @("FIN","Finance","M7"),@("ACCT","Accounts","M7"),
    @("PROD","Production","M3"),@("QA","Quality Assurance","QA"),
    @("QC","Quality Control","QC"),@("WH","Warehouse","M5"),
    @("LOG","Logistics","M5"),@("ENG","Engineering","M3"),
    @("MNT","Maintenance","M3"),@("ADMIN","Administration","M7"),
    @("MKTG","Marketing","M7"),@("SALES","Sales","M7"),
    @("PROC","Procurement","M5"),@("HSE","Health, Safety & Environment","M7"),
    @("PLANT_OPS","Plant Operations","M3"),@("RND","Research & Development","QA"),
    @("MGMT","Management","M7"),@("SEC","Security","M7"),
    @("TRANS","Transport","M5"),@("STORE","Store","M5"),
    @("TRAINING","Training","HR")
)
foreach ($d in $departments) {
    $exists = Get-PnPListItem -List $list -Query "<View><Query><Where><Eq><FieldRef Name='DepartmentCode'/><Value Type='Text'>$($d[0])</Value></Eq></Where></Query></View>"
    if (-not $exists) {
        Add-PnPListItem -List $list -Values @{Title=$d[1];DepartmentCode=$d[0];DepartmentName=$d[1];Module=$d[2];IsActive="Yes"} | Out-Null
        Write-Host "[seed] $($d[0])" -ForegroundColor Green
    }
}

$cCount = (Get-PnPListItem -List "Config_Companies").Count
$dCount = (Get-PnPListItem -List "Config_Departments").Count
Write-Host "`nDONE: Config_Companies=$cCount items, Config_Departments=$dCount items" -ForegroundColor Cyan
