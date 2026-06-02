# HR Migration List Provisioning

This folder contains the first-pass SharePoint list creation artifacts for the Penang HR Domino apps:

- EEN - Employee Exit Notification
- EPDU - Employee Personal Detail Update
- EPHR - Employee Personal Health Records
- ESF - Employee Survey
- FTCR - Fixed Term Contract Requisition
- FWWPD - Foreign Workers Work Permit
- FWWPE - Foreign Worker Work Period Extension
- GDSN - Gift-Donation-Sponsorship Requisition
- HEALTHINFO - Health Info
- HRAPR - HR Applications Problem Reporting

The current app already has `MainDB_HR`, `approvalhistory_hr`, `attachmentindex_hr`, `auditlog_hr`, `opslog_hr`, and routing/config lists. These definitions add the missing extension lists and the first child lists required by `FWWPD`.

Run a dry preview:

```powershell
.\New-HRMigrationLists.ps1 -WhatIf -DeviceLogin
```

Create/update the lists:

```powershell
.\New-HRMigrationLists.ps1 -DeviceLogin
```

The script is idempotent. It creates missing lists/columns and leaves existing lists in place.
