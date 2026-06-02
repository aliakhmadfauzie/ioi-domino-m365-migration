# Add-ITSSR-Columns.ps1
# Adds missing ITSSR columns to MainDB_IT_Ext_Support list
# CS state (iTSSRCS) already exists — only need 3 new columns

param(
    [string]$SiteUrl = "https://ioioi.sharepoint.com/sites/ioi-portal-it"
)

Write-Host "Connecting to $SiteUrl ..." -ForegroundColor Cyan
Connect-PnPOnline -Url $SiteUrl -Interactive

$listName = "MainDB_IT_Ext_Support"

Write-Host "`nAdding ITSSR columns to $listName ..." -ForegroundColor Yellow

# 1. ITSSR_PendingDate — when IT marked as pending
Add-PnPField -List $listName -DisplayName "ITSSR Pending Date" -InternalName "ITSSR_PendingDate" `
    -Type DateTime -Group "ITSSR Columns" -AddToDefaultView

# 2. ITSSR_OU — Organizational Unit (PanCen, Penang, etc.)
Add-PnPField -List $listName -DisplayName "ITSSR OU" -InternalName "ITSSR_OU" `
    -Type Choice -Group "ITSSR Columns" -AddToDefaultView -Choices @("PanCen","Penang","ACM","Other")`

# 3. ITSSR_Type2 — Secondary request type (NEW REQUEST DESKTOP/LAPTOP, etc.)
Add-PnPField -List $listName -DisplayName "ITSSR Type2" -InternalName "ITSSR_Type2" `
    -Type Choice -Group "ITSSR Columns" -AddToDefaultView -Choices @("NEW REQUEST DESKTOP/LAPTOP","Software Installation","Hardware Upgrade","Other")

Write-Host "`nITSSR column provisioning complete." -ForegroundColor Green
Write-Host "Added: ITSSR_PendingDate (DateTime), ITSSR_OU (Choice), ITSSR_Type2 (Choice)" -ForegroundColor Green
