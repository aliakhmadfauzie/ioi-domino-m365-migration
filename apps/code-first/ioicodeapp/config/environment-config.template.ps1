<#
.SYNOPSIS
    Centralized environment configuration for IOI Domino → M365 migration.

    COPY THIS FILE to environment-config.ps1 and fill in your values.
    environment-config.ps1 is in .gitignore — your secrets stay local.

.NOTES
    How to use in PowerShell scripts:
        # At the top of your script:
        $configPath = Join-Path $PSScriptRoot "..\config\environment-config.ps1"
        if (Test-Path $configPath) { . $configPath }

        # Then reference: $script:IOI_TENANT_ID, $script:IOI_SHAREPOINT_IT_URL, etc.
#>

# =============================================================================
# AZURE AD / ENTRA ID
# =============================================================================

# Azure AD Tenant ID (Directory ID)
$script:IOI_TENANT_ID = "c6f6218b-5ff2-48b5-9114-f89da23caadb"

# Entra ID App Registration for PnP.PowerShell automation
# Create one at https://entra.microsoft.com/ -> App registrations -> New registration
# Required API permissions: SharePoint -> Sites.FullControl.All
$script:IOI_PNP_CLIENT_ID = "21898567-7d8f-4634-846d-fd4cf7b185db"

# =============================================================================
# POWER PLATFORM
# =============================================================================

# Power Platform environment ID (from power.config.json or Power Apps admin)
$script:IOI_PP_ENVIRONMENT_ID = "3ab52b84-ef8c-ef0d-8117-ae5b0ae39504"

# Power Apps App ID (from power.config.json)
$script:IOI_PP_APP_ID = "26fddd33-46a8-43ae-a1f2-e90fa3b003bf"

# PAC CLI auth profile index (from 'pac auth list')
$script:IOI_PAC_AUTH_INDEX = 2

# =============================================================================
# SHAREPOINT SITE COLLECTIONS
# =============================================================================

# IT Portal (primary — MainDB_IT, MainDB_IT_JHR, extension lists)
$script:IOI_SHAREPOINT_IT_URL = "https://ioioi.sharepoint.com/sites/ioi-portal-it"

# HR Portal
$script:IOI_SHAREPOINT_HR_URL = "https://ioioi.sharepoint.com/sites/ioi-portal-hr"

# STR Portal
$script:IOI_SHAREPOINT_STR_URL = "https://ioioi.sharepoint.com/sites/ioi-portal-str"

# QA Portal
$script:IOI_SHAREPOINT_QA_URL = "https://ioioi.sharepoint.com/sites/ioi-portal-qa"

# FIN Portal
$script:IOI_SHAREPOINT_FIN_URL = "https://ioioi.sharepoint.com/sites/ioi-portal-fin"

# PRD Portal
$script:IOI_SHAREPOINT_PRD_URL = "https://ioioi.sharepoint.com/sites/ioi-portal-prd"

# SHE Portal
$script:IOI_SHAREPOINT_SHE_URL = "https://ioioi.sharepoint.com/sites/ioi-portal-she"

# Admin Sites (shared config lists)
$script:IOI_SHAREPOINT_ADMIN_URL = "https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites"

# Legacy MainDB_IT site (for some scripts)
$script:IOI_SHAREPOINT_LEGACY_IT_URL = "https://ioioi.sharepoint.com/sites/MainDB_IT"

# =============================================================================
# SHAREPOINT LIST NAMES
# =============================================================================

# Main lists
$script:IOI_LIST_MAIN_IT_PRAI  = "MainDB_IT"
$script:IOI_LIST_MAIN_IT_JOHOR = "MainDB_IT_JHR"

# Extension lists (IT)
$script:IOI_LIST_EXT_ACCESS  = "MainDB_IT_Ext_Access"
$script:IOI_LIST_EXT_ASSETS  = "MainDB_IT_Ext_Assets"
$script:IOI_LIST_EXT_SUPPORT = "MainDB_IT_Ext_Support"
$script:IOI_LIST_EXT_SAP     = "MainDB_IT_Ext_SAP"
$script:IOI_LIST_EXT_DOCS    = "MainDB_IT_Ext_Docs"
$script:IOI_LIST_EXT_INFRA   = "MainDB_IT_Ext_Infra"
$script:IOI_LIST_EXT_POLICY  = "MainDB_IT_Ext_Policy"

# Config lists (IT)
$script:IOI_LIST_CONFIG_COMPANIES        = "Config_Companies"
$script:IOI_LIST_CONFIG_DEPARTMENTS      = "Config_Departments"
$script:IOI_LIST_CONFIG_APPROVER_MATRIX  = "Config_ApproverMatrix"
$script:IOI_LIST_CONFIG_EMPLOYEE_DIR     = "Config_EmployeeDirectory"
$script:IOI_LIST_USER_ROLES_IT           = "User_Roles_IT"
$script:IOI_LIST_IT_ROUTING_MATRIX       = "IT_RoutingMatrix"
$script:IOI_LIST_APPROVAL_RECORDS        = "ApprovalRecords"
$script:IOI_LIST_WORKFLOW_AUDIT_LOG      = "WorkflowAuditLog"
$script:IOI_LIST_IT_FORMS                = "ITForms"

# Main department lists
$script:IOI_LIST_MAIN_HR  = "MainDB_HR"
$script:IOI_LIST_MAIN_FIN = "MainDB_FIN"
$script:IOI_LIST_MAIN_PRD = "MainDB_PRD"
$script:IOI_LIST_MAIN_QA  = "MainDB_QA"
$script:IOI_LIST_MAIN_SHE = "MainDB_SHE"
$script:IOI_LIST_MAIN_STR = "MainDB_STR"

# =============================================================================
# CONNECTION REFERENCE / DATA SOURCE GUIDS (from power.config.json)
# =============================================================================
# These are populated when lists are added as data sources in Power Apps Studio.
# The template version uses placeholder zeros.

$script:IOI_DS_MAIN_IT           = "b1de9795-563e-48c3-99a3-1430234dc6e2"
$script:IOI_DS_MAIN_IT_JHR       = "00000000-0000-0000-0000-000000000000"  # TODO: Replace after adding as data source
$script:IOI_DS_EXT_ACCESS        = "c6bd4df6-b45f-436b-b8d3-0e38dc6049e3"
$script:IOI_DS_EXT_ASSETS        = "be6bfd37-3fc4-4ec5-8791-ac5890d0bf3d"
$script:IOI_DS_EXT_SUPPORT       = "37a03d3f-7403-4302-97fc-0d816de938ba"
$script:IOI_DS_EXT_SAP           = "b5b40011-cd99-46f9-91c0-bf8d3a7646de"
$script:IOI_DS_EXT_POLICY        = "00000000-0000-0000-0000-000000000000"  # TODO: Replace after adding as data source
$script:IOI_DS_APPROVAL_RECORDS  = "10498092-de2c-48ca-ab68-5549466fc73f"
$script:IOI_DS_WORKFLOW_AUDIT    = "11a51395-0efb-4052-b7e7-7a26b459cdc6"
$script:IOI_DS_IT_FORMS          = "f338f907-c873-4614-a36a-2d49616b8276"

# =============================================================================
# DOMINO LEGACY
# =============================================================================

# Domino server names (for reference during migration)
$script:IOI_DOMINO_SERVER_JOHOR = "ITSOI01/JOHOR/IOIGroup"
$script:IOI_DOMINO_SERVER_PENANG = "ITSOI02/PENANG/IOIGroup"

# =============================================================================
# HELPER FUNCTION
# =============================================================================

function Get-IOIConfig {
    <#
    .SYNOPSIS
        Returns all IOI environment configuration as a hashtable for easy use.
    .EXAMPLE
        $cfg = Get-IOIConfig
        Connect-PnPOnline -Url $cfg.SharePointITUrl -Interactive -ClientId $cfg.PnPClientId
    #>
    return @{
        TenantId         = $script:IOI_TENANT_ID
        PnPClientId      = $script:IOI_PNP_CLIENT_ID

        PPEnvironmentId  = $script:IOI_PP_ENVIRONMENT_ID
        PPAppId          = $script:IOI_PP_APP_ID
        PacAuthIndex     = $script:IOI_PAC_AUTH_INDEX

        SharePointITUrl      = $script:IOI_SHAREPOINT_IT_URL
        SharePointHRUrl      = $script:IOI_SHAREPOINT_HR_URL
        SharePointSTRUrl     = $script:IOI_SHAREPOINT_STR_URL
        SharePointQAUrl      = $script:IOI_SHAREPOINT_QA_URL
        SharePointFINUrl     = $script:IOI_SHAREPOINT_FIN_URL
        SharePointPRDUUrl    = $script:IOI_SHAREPOINT_PRD_URL
        SharePointSHEUrl     = $script:IOI_SHAREPOINT_SHE_URL
        SharePointAdminUrl   = $script:IOI_SHAREPOINT_ADMIN_URL
        SharePointLegacyITUrl = $script:IOI_SHAREPOINT_LEGACY_IT_URL

        ListMainITPrai   = $script:IOI_LIST_MAIN_IT_PRAI
        ListMainITJohor  = $script:IOI_LIST_MAIN_IT_JOHOR
        ListExtAccess    = $script:IOI_LIST_EXT_ACCESS
        ListExtAssets    = $script:IOI_LIST_EXT_ASSETS
        ListExtSupport   = $script:IOI_LIST_EXT_SUPPORT
        ListExtSAP       = $script:IOI_LIST_EXT_SAP
        ListExtDocs      = $script:IOI_LIST_EXT_DOCS
        ListExtInfra     = $script:IOI_LIST_EXT_INFRA
        ListExtPolicy    = $script:IOI_LIST_EXT_POLICY
        ListMainHR       = $script:IOI_LIST_MAIN_HR
        ListMainFIN      = $script:IOI_LIST_MAIN_FIN
        ListMainPRD      = $script:IOI_LIST_MAIN_PRD
        ListMainQA       = $script:IOI_LIST_MAIN_QA
        ListMainSHE      = $script:IOI_LIST_MAIN_SHE
        ListMainSTR      = $script:IOI_LIST_MAIN_STR
    }
}
