IT Form Development System - Task Execution Guide							
Generated: 2026-05-17							
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
📋 DOCUMENT PURPOSE							
This document provides structured instructions for an AI agent to execute form development tasks.							
Each task is clearly defined with action type, target location, specific requirements, and data sources.							
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
🎯 SYSTEM ARCHITECTURE OVERVIEW							
							
COMPONENT	CODE	DESCRIPTION	FORMS INCLUDED				
Module 1	M1	User & Access Management	EAF, NIR, Reset Password, Share Folder, User ID Req				
Module 2	M2	IT Support	Server Reboot Log, Data Center Access Log, IT Event, Server Records, Data Restoration, IT Daily Report, IT SSR, PRF				
Module 3	M3	Hardware Management	Hardware Inventory				
Module 4	M4	SAP System	SAP Auth Matrix Review, SAP Transport Request, SAP Config Access, SAP Change Request, SAP Disaster Recovery, Storage Location Creation, SAP UAT Sign Off				
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
🔧 ACTION TYPE DEFINITIONS (How to Interpret Each Task)							
							
ACTION TYPE	MEANING	AI AGENT SHOULD	EXAMPLE				
ADD	Create a NEW field that does not currently exist in the form	"1. Navigate to the specified form
2. Locate the section (if specified)
3. Create a new field with the given name
4. Apply data source if Reference List provided"	Add 'Company' dropdown using Config_Companies list				
REMOVE	DELETE an existing field from the form entirely	"1. Navigate to the specified form
2. Find the field by name
3. Remove/delete the field
4. Ensure no orphan references remain"	Remove 'Request ID' field from form				
UPDATE	MODIFY an existing field's data source, options, or behaviour	"1. Navigate to the specified form
2. Locate the existing field
3. Update the dropdown values or data source
4. Verify new values are applied"	Update department dropdown with latest list				
MODIFY	CHANGE field properties like label, position, visibility rules, or behaviour	"1. Navigate to the specified form
2. Find the existing field
3. Apply the specified changes (rename, reposition, add conditions)
4. Test the modification"	Change field label from 'Contact Number' to 'Extension Number'				
FIX BUG	RESOLVE an error or malfunction preventing form operation	"1. Identify the error type from the error details
2. Debug the root cause
3. Implement the fix
4. Test submission works correctly"	Fix UnauthorizedAccessException on form submit				
AUTO-GENERATE	Configure a field to automatically populate its value	"1. Navigate to the specified form
2. Find or create the field
3. Set up auto-generation logic (e.g., date, sequence number)
4. Test the auto-population"	Auto-generate 'Record Number' as Year-Month-Sequence				
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
⚡ PRIORITY EXECUTION ORDER							
							
PRIORITY	URGENCY	DESCRIPTION	ACTION REQUIRED				
HIGH	🔴 CRITICAL - Execute First	Blocks users from completing tasks. Usually submit errors or form failures.	Stop other work. Fix immediately. Test thoroughly before moving on.				
MEDIUM	🟡 NORMAL - Standard Queue	Feature additions, field updates, workflow improvements.	Process in order. Complete all requirements before marking done.				
LOW	🟢 WHEN AVAILABLE	Cosmetic changes, removing unused fields, minor improvements.	Complete after HIGH and MEDIUM tasks. Can be batched.				
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
📚 DATA SOURCES - Reference Lists for Dropdown Fields							
							
When a task specifies a 'Reference List', use values from that SharePoint/Config list.							
							
REFERENCE LIST NAME	USED IN FORMS	CONTAINS	HOW TO USE				
Config_Companies	EAF, NIR, Share Folder, User ID Req	Master list of all company codes (ACM, ECM, PCEO, PCOC, PGA, PJY, POM, SCM, etc.)	Populate company dropdown fields with these values				
Config_Departments	NIR, Share Folder, Reset Password	Master list of all departments (Administration, Finance, HR, IT, Logistics, etc.)	Populate department dropdown fields with these values				
IT_M1_RS_SystemsList	Reset Password	List of applications/systems (SAP, ESKER, VPN, BANK, DOMAIN ID, etc.)	Use for Application Type dropdown in Reset Password				
IT_M1_RS_SAP_Client	Reset Password	SAP client environments (IEP Live, IEQ Testing, IED Development)	Show when 'SAP S4/HANA' is selected as application				
IT_M1_RS_Banks	Reset Password	Bank options (AmBank, Maybank, SMBC, CitiBank, UOB, etc.)	Show when 'BANK' is selected as application				
IT_M1_SFAR_Servers	Share Folder	Server options for file sharing (IOIPCNSHARE, ACIDCHEM, NAS, etc.)	Use for Server Name dropdown in Share Folder form				
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
📝 TASK INSTRUCTION FORMAT - How to Read Each Task							
							
Each task follows this structure. Parse these fields to understand what to do:							
							
FIELD	PURPOSE	EXAMPLE VALUE	AGENT ACTION				
Task ID	Unique identifier for tracking	TASK-001	Reference this when reporting progress or issues				
Module	Which system module the form belongs to	User & Access Management (M1)	Navigate to the correct module section				
Form Name	The specific form to modify	EAF, NIR, Reset Password	Open this form's code/configuration				
Section	Location within the form (if specified)	Section 1 (Initiator)	Find this section before making changes				
Field/Issue	What field to work on or what issue exists	company list, Error to submit	This is the target of your action				
Action Required	Description of what needs to be done	Add actual company list	Follow this instruction precisely				
Action Type	Category of change	ADD, REMOVE, UPDATE, MODIFY, FIX BUG, AUTO-GENERATE	Determines your approach (see Action Types section)				
Priority	Execution urgency	HIGH, MEDIUM, LOW	Process HIGH tasks first				
Reference List	Data source for dropdown values	Config_Companies	Pull values from this SharePoint list				
Dropdown Values	Explicit values if no reference list	New | Modify | Delete	Use these exact values for the dropdown				
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
📋 COMPLETE TASK LIST - AI-READABLE FORMAT							
							
Parse each row below. Execute tasks in order of Priority (HIGH → MEDIUM → LOW).							
							
TASK_ID	PRIORITY	ACTION_TYPE	MODULE	FORM	SECTION	TARGET_FIELD	AI_INSTRUCTION
TASK-001	MEDIUM	ADD	User & Access Management (M1)	EAF	Section 1 (Initiator)	company list	[ADD] Go to 'EAF' → 'Section 1 (Initiator)'. Create field 'company list'. add actual company list Use 'Config_Companies' list.
TASK-002	MEDIUM	MODIFY	User & Access Management (M1)	EAF	General	user id	[MODIFY] Go to 'EAF'. Change field 'user id'. Allow to enter manually
TASK-003	LOW	REMOVE	User & Access Management (M1)	EAF	General	system name	[REMOVE] Go to 'EAF'. Delete field 'system name'. Remove system name
TASK-004	MEDIUM	MODIFY	User & Access Management (M1)	EAF	General	dropdown name selection	[MODIFY] Go to 'EAF'. Change field 'dropdown name selection'. unable to select department hod and cc
TASK-005	MEDIUM	ADD	User & Access Management (M1)	EAF	General	missing value in field	[ADD] Go to 'EAF'. Create field 'missing value in field'. when go back to previous page, the target user is gone
TASK-006	HIGH	FIX BUG	User & Access Management (M1)	EAF	General	Error to submit - Invoke error	"[FIX] In 'EAF', resolve: Error to submit - Invoke error. {
  ""odata.error"": {
    ""code"": ""-2147024891, System.UnauthorizedAccessException"",
    ""message"": {
      ""lang"": ""en-US"",
      ""value"": ""Attempted "
TASK-007	MEDIUM	ADD	User & Access Management (M1)	NIR	Section 1 (Initiator)	type of request	[ADD] Go to 'NIR' → 'Section 1 (Initiator)'. Create field 'type of request'. Add in 'Rename' and 'Delete' options.
TASK-008	MEDIUM	MODIFY	User & Access Management (M1)	NIR	General	company	[MODIFY] Go to 'NIR'. Change field 'company'. list down actual company list Ref: 'Config_Companies'.
TASK-009	MEDIUM	UPDATE	User & Access Management (M1)	NIR	General	department	[UPDATE] Go to 'NIR'. Update field 'department'. update with the latest list, and the list is not in order Use 'Config_Departments' list.
TASK-010	MEDIUM	ADD	User & Access Management (M1)	NIR	General	missing one field	[ADD] Go to 'NIR'. Create field 'missing one field'. Add executive or non-executive selection.
TASK-011	MEDIUM	MODIFY	User & Access Management (M1)	NIR	General	approval workflow	[MODIFY] Go to 'NIR'. Change field 'approval workflow'. the display box of approval workflow is different
TASK-012	HIGH	FIX BUG	User & Access Management (M1)	NIR	General	Error to submit - Invoke error	"[FIX] In 'NIR', resolve: Error to submit - Invoke error. {
  ""odata.error"": {
    ""code"": ""-2147024891, System.UnauthorizedAccessException"",
    ""message"": {
      ""lang"": ""en-US"",
      ""value"": ""Attempted "
TASK-013	LOW	REMOVE	User & Access Management (M1)	Reset Password	Section 1 (Initiator)	request id & form code	[REMOVE] Go to 'Reset Password' → 'Section 1 (Initiator)'. Delete field 'request id & form code'. remove
TASK-014	MEDIUM	MODIFY	User & Access Management (M1)	Reset Password	General	user name/emp name	[MODIFY] Go to 'Reset Password'. Change field 'user name/emp name'. Allow to enter the full name manually.
TASK-015	MEDIUM	ADD	User & Access Management (M1)	Reset Password	General	designation field	[ADD] Go to 'Reset Password'. Create field 'designation field'. Add in 'Designation' field.
TASK-016	MEDIUM	ADD	User & Access Management (M1)	Reset Password	General	company field	[ADD] Go to 'Reset Password'. Create field 'company field'. Add in 'Company' field.
TASK-017	MEDIUM	MODIFY	User & Access Management (M1)	Reset Password	General	contact number	[MODIFY] Go to 'Reset Password'. Change field 'contact number'. Change wording to 'Extension Number'.
TASK-018	MEDIUM	UPDATE	User & Access Management (M1)	Reset Password	General	Application type	[UPDATE] Go to 'Reset Password'. Update field 'Application type'. Replace with the system field Use 'IT_M1_RS_SystemsList' list.
TASK-019	MEDIUM	UPDATE	User & Access Management (M1)	Reset Password	General	department	[UPDATE] Go to 'Reset Password'. Update field 'department'. Replace with dropdown selection.
TASK-020	MEDIUM	MODIFY	User & Access Management (M1)	Reset Password	General	system & reset	[MODIFY] Go to 'Reset Password'. Change field 'system & reset'. Application type must come first then the reset type
TASK-021	MEDIUM	MODIFY	User & Access Management (M1)	Reset Password	General	client field selection	[MODIFY] Go to 'Reset Password'. Change field 'client field selection'. if application "SAP S4/HANA"" selected, there will another field 'client' display Ref: 'IT_M1_RS_SAP_Client'.
TASK-022	MEDIUM	MODIFY	User & Access Management (M1)	Reset Password	General	client name field	[MODIFY] Go to 'Reset Password'. Change field 'client name field'. will pop out if client field select "IEP (Live System)"
TASK-023	MEDIUM	MODIFY	User & Access Management (M1)	Reset Password	General	bank field	[MODIFY] Go to 'Reset Password'. Change field 'bank field'. will pop out if application select 'BANK' Ref: 'IT_M1_RS_Banks'.
TASK-024	MEDIUM	UPDATE	User & Access Management (M1)	Reset Password	General	justification field	[UPDATE] Go to 'Reset Password'. Update field 'justification field'. replace with the 'reason for reset' field
TASK-025	MEDIUM	MODIFY	User & Access Management (M1)	Reset Password	General	system login id	[MODIFY] Go to 'Reset Password'. Change field 'system login id'. maybe the user id field? in domino database this field is at the bottom, not top
TASK-026	MEDIUM	ADD	User & Access Management (M1)	Reset Password	General	reset type "Unlock ID"	[ADD] Go to 'Reset Password'. Create field 'reset type "Unlock ID"'. Add in 'Unlock ID and Reset Password' & 'Unlock ID without resetting the password' selection. Values: Only applicable for application SAP, Solman and ESKER ["SAP S4/HANA", "SOLMAN", "ESKER"]
TASK-027	LOW	REMOVE	User & Access Management (M1)	Reset Password	General	approval chain	[REMOVE] Go to 'Reset Password'. Delete field 'approval chain'. Remove approval.
TASK-028	HIGH	FIX BUG	User & Access Management (M1)	Reset Password	General	Error to submit - Invoke error	"[FIX] In 'Reset Password', resolve: Error to submit - Invoke error. {
  ""odata.error"": {
    ""code"": ""-2147024891, System.UnauthorizedAccessException"",
    ""message"": {
      ""lang"": ""en-US"",
      ""value"": ""Attempted "
TASK-029	MEDIUM	MODIFY	User & Access Management (M1)	Share Folder	Section 1 (Initiator)	company	[MODIFY] Go to 'Share Folder' → 'Section 1 (Initiator)'. Change field 'company'. refer the correct list Ref: 'Config_Companies'.
TASK-030	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	type of folder	[ADD] Go to 'Share Folder'. Create field 'type of folder'. missing, selection between 'New' or 'Existing' folder
TASK-031	MEDIUM	UPDATE	User & Access Management (M1)	Share Folder	General	department dropdown	[UPDATE] Go to 'Share Folder'. Update field 'department dropdown'. Replace with dropdown selection. Use 'Config_Departments' list.
TASK-032	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	server name	[ADD] Go to 'Share Folder'. Create field 'server name'. missing Use 'IT_M1_SFAR_Servers' list.
TASK-033	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	hod approval	[ADD] Go to 'Share Folder'. Create field 'hod approval'. missing
TASK-034	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	cc field	[ADD] Go to 'Share Folder'. Create field 'cc field'. missing
TASK-035	LOW	REMOVE	User & Access Management (M1)	Share Folder	General	access duration	[REMOVE] Go to 'Share Folder'. Delete field 'access duration'. remove
TASK-036	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	extension field	[ADD] Go to 'Share Folder'. Create field 'extension field'. missing - need to add
TASK-037	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	grant access to	[ADD] Go to 'Share Folder'. Create field 'grant access to'. missing
TASK-038	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	hod approval	[ADD] Go to 'Share Folder'. Create field 'hod approval'. missing, supposedly after owner approval
TASK-039	LOW	ADD	User & Access Management (M1)	Share Folder	General	request type	[ADD] Go to 'Share Folder'. Create field 'request type'. missing: "Grant Access", "Remove Access", "Delete Folder"
TASK-040	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	access to field	[ADD] Go to 'Share Folder'. Create field 'access to field'. missing, this field is for to fill in all users windows id that need to access that share folder, it hidden if request type select 'Delete Folder'
TASK-041	MEDIUM	MODIFY	User & Access Management (M1)	Share Folder	General	access to name field	[MODIFY] Go to 'Share Folder'. Change field 'access to name field'. similar like above, but this field required all users full name
TASK-042	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	permission field	[ADD] Go to 'Share Folder'. Create field 'permission field'. missing, either "Read Only" or "Write/Read"
TASK-043	MEDIUM	ADD	User & Access Management (M1)	Share Folder	General	remark field	[ADD] Go to 'Share Folder'. Create field 'remark field'. missing, original db has that field
TASK-044	MEDIUM	MODIFY	User & Access Management (M1)	Share Folder	General	it verifier section (after user request)	[MODIFY] Go to 'Share Folder'. Change field 'it verifier section (after user request)'. this section only for folder under server 'ioipcnshare' and it is a new request, if existing folder or any other server that pcnshare, then no need this section
TASK-045	HIGH	FIX BUG	User & Access Management (M1)	Share Folder	General	Error to submit - Invoke error	"[FIX] In 'Share Folder', resolve: Error to submit - Invoke error. {
  ""odata.error"": {
    ""code"": ""-2147024891, System.UnauthorizedAccessException"",
    ""message"": {
      ""lang"": ""en-US"",
      ""value"": ""Attempted "
TASK-046	MEDIUM	ADD	User & Access Management (M1)	User ID Req	Section 1 (Initiator)	request type	[ADD] Go to 'User ID Req' → 'Section 1 (Initiator)'. Create field 'request type'. Add in 'Request Type' Values: New ID | Existing ID | Reactivate | Deactivate
TASK-047	LOW	REMOVE	User & Access Management (M1)	User ID Req	General	request id and form code	[REMOVE] Go to 'User ID Req'. Delete field 'request id and form code'. remove
TASK-048	MEDIUM	AUTO-GENERATE	User & Access Management (M1)	User ID Req	General	date created	[AUTO-GEN] In 'User ID Req', auto-populate 'date created'. auto generated
TASK-049	LOW	REMOVE	User & Access Management (M1)	User ID Req	General	ic number	[REMOVE] Go to 'User ID Req'. Delete field 'ic number'. remove
TASK-050	LOW	REMOVE	User & Access Management (M1)	User ID Req	General	joining date	[REMOVE] Go to 'User ID Req'. Delete field 'joining date'. remove
TASK-051	LOW	REMOVE	User & Access Management (M1)	User ID Req	General	reporting to	[REMOVE] Go to 'User ID Req'. Delete field 'reporting to'. remove
TASK-052	MEDIUM	MODIFY	User & Access Management (M1)	User ID Req	General	company	[MODIFY] Go to 'User ID Req'. Change field 'company'. tick box(can multiple selection
TASK-053	MEDIUM	UPDATE	User & Access Management (M1)	User ID Req	General	application list	[UPDATE] Go to 'User ID Req'. Update field 'application list'. need to update actual application list
TASK-054	MEDIUM	ADD	User & Access Management (M1)	User ID Req	General	extension	[ADD] Go to 'User ID Req'. Create field 'extension'. missing
TASK-055	MEDIUM	MODIFY	User & Access Management (M1)	User ID Req	General	employee card field	[MODIFY] Go to 'User ID Req'. Change field 'employee card field'. if application "DOOR ACCESS" is selected
TASK-056	MEDIUM	MODIFY	User & Access Management (M1)	User ID Req	General	door selection	[MODIFY] Go to 'User ID Req'. Change field 'door selection'. if application "DOOR ACCESS" is selected
TASK-057	MEDIUM	ADD	IT Support (M2)	Server Reboot Log	General	server uptime	[ADD] Go to 'Server Reboot Log'. Create field 'server uptime'. need to add
TASK-058	LOW	REMOVE	IT Support (M2)	Server Reboot Log	General	approval chain	[REMOVE] Go to 'Server Reboot Log'. Delete field 'approval chain'. remove
TASK-059	MEDIUM	MODIFY	IT Support (M2)	Data Center Access Log	General	location	[MODIFY] Go to 'Data Center Access Log'. Change field 'location'. move up
TASK-060	MEDIUM	MODIFY	IT Support (M2)	Data Center Access Log	General	server room	[MODIFY] Go to 'Data Center Access Log'. Change field 'server room'. not exist
TASK-061	LOW	REMOVE	IT Support (M2)	Data Center Access Log	General	visitor type	[REMOVE] Go to 'Data Center Access Log'. Delete field 'visitor type'. remove - no need
TASK-062	LOW	REMOVE	IT Support (M2)	Data Center Access Log	General	exit information section	[REMOVE] Go to 'Data Center Access Log'. Delete field 'exit information section'. remove - no need
TASK-063	MEDIUM	MODIFY	IT Support (M2)	Data Center Access Log	General	*need to discuss further	[MODIFY] Go to 'Data Center Access Log'. Change field '*need to discuss further'. 
TASK-064	MEDIUM	UPDATE	IT Support (M2)	IT Event	General	event type	[UPDATE] Go to 'IT Event'. Update field 'event type'. update actual event type
TASK-065	MEDIUM	MODIFY	IT Support (M2)	IT Event	General	workflow progress	[MODIFY] Go to 'IT Event'. Change field 'workflow progress'. no approver in it
TASK-066	LOW	REMOVE	IT Support (M2)	IT Event	General	approval chain	[REMOVE] Go to 'IT Event'. Delete field 'approval chain'. remove - no need
TASK-067	MEDIUM	ADD	IT Support (M2)	Server Records	General	summary	[ADD] Go to 'Server Records'. Create field 'summary'. missing
TASK-068	MEDIUM	ADD	IT Support (M2)	Server Records	General	background	[ADD] Go to 'Server Records'. Create field 'background'. missing
TASK-069	MEDIUM	ADD	IT Support (M2)	Server Records	General	analysis	[ADD] Go to 'Server Records'. Create field 'analysis'. missing
TASK-070	MEDIUM	ADD	IT Support (M2)	Server Records	General	root cause description	[ADD] Go to 'Server Records'. Create field 'root cause description'. missing
TASK-071	MEDIUM	ADD	IT Support (M2)	Server Records	General	corrective actions	[ADD] Go to 'Server Records'. Create field 'corrective actions'. missing
TASK-072	MEDIUM	ADD	IT Support (M2)	Server Records	General	preventive actions	[ADD] Go to 'Server Records'. Create field 'preventive actions'. missing
TASK-073	MEDIUM	MODIFY	IT Support (M2)	Data Restoration	General	flow	[MODIFY] Go to 'Data Restoration'. Change field 'flow'. after submission, go to backup admin section
TASK-074	MEDIUM	UPDATE	IT Support (M2)	IT Daily Report	General	category	[UPDATE] Go to 'IT Daily Report'. Update field 'category'. need to update the actual list
TASK-075	MEDIUM	MODIFY	IT Support (M2)	IT Daily Report	General	type & company	[MODIFY] Go to 'IT Daily Report'. Change field 'type & company'. selection, not manually type
TASK-076	LOW	REMOVE	IT Support (M2)	IT Daily Report	General	At the top of the form 'Draft > Review > Approve'	[REMOVE] Go to 'IT Daily Report'. Delete field 'At the top of the form 'Draft > Review > Approve''. remove this part
TASK-077	MEDIUM	UPDATE	IT Support (M2)	IT SSR	General	company list	[UPDATE] Go to 'IT SSR'. Update field 'company list'. update actual company list
TASK-078	MEDIUM	AUTO-GENERATE	IT Support (M2)	IT SSR	General	To an CC	[AUTO-GEN] In 'IT SSR', auto-populate 'To an CC'. can automate the notification to IT?
TASK-079	MEDIUM	AUTO-GENERATE	IT Support (M2)	IT SSR	General	Reported by or Requestor	[AUTO-GEN] In 'IT SSR', auto-populate 'Reported by or Requestor'. only one, also it must be automate
TASK-080	LOW	REMOVE	IT Support (M2)	IT SSR	General	Service Type	[REMOVE] Go to 'IT SSR'. Delete field 'Service Type'. only hardware and software, the rest remove
TASK-081	MEDIUM	UPDATE	IT Support (M2)	IT SSR	General	bank module	[UPDATE] Go to 'IT SSR'. Update field 'bank module'. bank no need sap module, need to update
TASK-082	MEDIUM	MODIFY	IT Support (M2)	IT SSR	General	Service type	[MODIFY] Go to 'IT SSR'. Change field 'Service type'. need to put at the top section
TASK-083	MEDIUM	ADD	IT Support (M2)	PRF	General	system list	[ADD] Go to 'PRF'. Create field 'system list'. missing
TASK-084	MEDIUM	MODIFY	IT Support (M2)	PRF	General	does this involve SAP field	[MODIFY] Go to 'PRF'. Change field 'does this involve SAP field'. this one not manually selected
TASK-085	MEDIUM	ADD	IT Support (M2)	PRF	General	objective	[ADD] Go to 'PRF'. Create field 'objective'. missing
TASK-086	MEDIUM	ADD	IT Support (M2)	PRF	General	justification	[ADD] Go to 'PRF'. Create field 'justification'. missing
TASK-087	MEDIUM	MODIFY	IT Support (M2)	PRF	General	*need to discuss further	[MODIFY] Go to 'PRF'. Change field '*need to discuss further'. 
TASK-088	HIGH	MODIFY	Hardware Management (M3)	Hardware Inventory	General	*cannot create the asset form.	[MODIFY] Go to 'Hardware Inventory'. Change field '*cannot create the asset form.'. 
TASK-089	MEDIUM	AUTO-GENERATE	SAP System(M4)	SAP Authorisation Matrix Review	Section 1 (Initiator)	Record Number	[AUTO-GEN] In 'SAP Authorisation Matrix Review' → 'Section 1 (Initiator)', auto-populate 'Record Number'. *Auto generated Format: Year-Month-Number
TASK-090	MEDIUM	ADD	SAP System(M4)	SAP Authorisation Matrix Review	General	Module	[ADD] Go to 'SAP Authorisation Matrix Review'. Create field 'Module'. *Need to add this field, selection value Values: CO | FI-AA | FI-AP | FI-AR | FI-GL | MM-Logistics | MM-Purchasing | MM-Store | MM-Warehouse | PM | P
TASK-091	MEDIUM	ADD	SAP System(M4)	SAP Authorisation Matrix Review	General	Plant	[ADD] Go to 'SAP Authorisation Matrix Review'. Create field 'Plant'. *Need to add this field, selection value Values: 1100 - IOI | 1200 - ACM | ACM | 1201 - AES | AES | 1202 - AEC | AEC | 1203 - ASN | ASN | 1300 - AUS 
TASK-092	MEDIUM	ADD	SAP System(M4)	SAP Authorisation Matrix Review	General	Authorisation Type	[ADD] Go to 'SAP Authorisation Matrix Review'. Create field 'Authorisation Type'. *Need to add this field, selection value Values: User Roles & T-Code assignment | Authorisation Objects
TASK-093	MEDIUM	ADD	SAP System(M4)	SAP Authorisation Matrix Review	General	Attachment	[ADD] Go to 'SAP Authorisation Matrix Review'. Create field 'Attachment'. *Need to add this field to attach attachment
TASK-094	MEDIUM	MODIFY	SAP System(M4)	SAP Authorisation Matrix Review	General	Remarks	[MODIFY] Go to 'SAP Authorisation Matrix Review'. Change field 'Remarks'. *Similar to Justification
TASK-095	MEDIUM	ADD	SAP System(M4)	SAP Authorisation Matrix Review	General	CC	[ADD] Go to 'SAP Authorisation Matrix Review'. Create field 'CC'. *Need to add this field, to cc other team member
TASK-096	MEDIUM	ADD	SAP System(M4)	SAP Authorisation Matrix Review	General	To be verified by	[ADD] Go to 'SAP Authorisation Matrix Review'. Create field 'To be verified by'. *Need to add this field, to manually select PIC for next flow (verification)
TASK-097	MEDIUM	ADD	SAP System(M4)	SAP Authorisation Matrix Review	General	To be approved by BPO/HOD	[ADD] Go to 'SAP Authorisation Matrix Review'. Create field 'To be approved by BPO/HOD'. *Need to add this field, to manually select PIC for next flow (approval)
TASK-098	LOW	REMOVE	SAP System(M4)	SAP Authorisation Matrix Review	General	Remove others field	[REMOVE] Go to 'SAP Authorisation Matrix Review'. Delete field 'Remove others field'. *Delete other fields that not mentioned
TASK-099	HIGH	FIX BUG	SAP System(M4)	SAP Authorisation Matrix Review	General	Error to submit - Invoke error	"[FIX] In 'SAP Authorisation Matrix Review', resolve: Error to submit - Invoke error. {
  ""odata.error"": {
    ""code"": ""-2147024891, System.UnauthorizedAccessException"",
    ""message"": {
      ""lang"": ""en-US"",
      ""value"": ""Attempted "
TASK-100	MEDIUM	AUTO-GENERATE	SAP System(M4)	SAP Transport Request	Section 1 (Initiator)	Request Number	[AUTO-GEN] In 'SAP Transport Request' → 'Section 1 (Initiator)', auto-populate 'Request Number'. *Auto generated Format: Year-Month-Number
TASK-101	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Module	[ADD] Go to 'SAP Transport Request'. Create field 'Module'. *Need to add this field, multiple selection - can choose more than one Values: BASIS | Controlling | Financials | Logistics/Weighbridge | Materials Management | Plant Maintenance 
TASK-102	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	TR Category	[ADD] Go to 'SAP Transport Request'. Create field 'TR Category'. *Need to add this field, multiple selection - can choose one Values: Authorisation | Development | Config | Master Data | SAP Notes | BRF+ | Others
TASK-103	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Development Type	[ADD] Go to 'SAP Transport Request'. Create field 'Development Type'. *Need to add this field, multiple selection - can choose one Values: New | Modify
TASK-104	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Phase	[ADD] Go to 'SAP Transport Request'. Create field 'Phase'. *Need to add this field, multiple selection - can choose more than one Values: 1st phase | 2nd phase | 3rd phase | 4th phase | 5th phase
TASK-105	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Client	[ADD] Go to 'SAP Transport Request'. Create field 'Client'. *Need to add this field, multiple selection - can choose one,  Values: IED to IEQ | IED to IEQ to IEP | SAC IEQ to SAC IEP
TASK-106	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Issue Number [CR/SSR/PRF/SAP Notes Number/UR/Emp Exit/AMS incident]	[ADD] Go to 'SAP Transport Request'. Create field 'Issue Number [CR/SSR/PRF/SAP Notes Number/UR/Emp Exit/AMS incident]'. *Need to add this field, manually key in.
TASK-107	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Transport Number/Package	[ADD] Go to 'SAP Transport Request'. Create field 'Transport Number/Package'. *Need to add this field, manually key in.
TASK-108	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Dependencies	[ADD] Go to 'SAP Transport Request'. Create field 'Dependencies'. *Need to add this field, manually key in.
TASK-109	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	SAP Tcode	[ADD] Go to 'SAP Transport Request'. Create field 'SAP Tcode'. *Need to add this field, manually key in.
TASK-110	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Report Name/Program Name/ Fiori Apps	[ADD] Go to 'SAP Transport Request'. Create field 'Report Name/Program Name/ Fiori Apps'. *Need to add this field, manually key in.
TASK-111	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Changes done	[ADD] Go to 'SAP Transport Request'. Create field 'Changes done'. *Need to add this field, manually key in.
TASK-112	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Remarks	[ADD] Go to 'SAP Transport Request'. Create field 'Remarks'. *Need to add this field, manually key in.
TASK-113	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Attachment	[ADD] Go to 'SAP Transport Request'. Create field 'Attachment'. *Need to add this field, can attach file.
TASK-114	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	Key User	[ADD] Go to 'SAP Transport Request'. Create field 'Key User'. *Need to add this field, manually key in.
TASK-115	MEDIUM	ADD	SAP System(M4)	SAP Transport Request	General	CCFuncOwner	[ADD] Go to 'SAP Transport Request'. Create field 'CCFuncOwner'. *Need to add this field, select user
TASK-116	MEDIUM	AUTO-GENERATE	SAP System(M4)	SAP Configuration Access	Section 1 (Initiator)	Form Num	[AUTO-GEN] In 'SAP Configuration Access' → 'Section 1 (Initiator)', auto-populate 'Form Num'. *Auto generated Format: Year-Month-Number
TASK-117	MEDIUM	ADD	SAP System(M4)	SAP Configuration Access	General	Module	[ADD] Go to 'SAP Configuration Access'. Create field 'Module'. *Need to add this field, tick box, can select more than one Values: BASIS | BI | Controlling | Financials | Logistics/Weighbridge | Materials Management | Plant Mainten
TASK-118	MEDIUM	ADD	SAP System(M4)	SAP Configuration Access	General	Client	[ADD] Go to 'SAP Configuration Access'. Create field 'Client'. *Need to add this field, can select only one Values: IEQ | IEP | IEP-DR | IBQ | IBP
TASK-119	MEDIUM	ADD	SAP System(M4)	SAP Configuration Access	General	Client Number	[ADD] Go to 'SAP Configuration Access'. Create field 'Client Number'. *Need to add this field, manually key in.
TASK-120	MEDIUM	ADD	SAP System(M4)	SAP Configuration Access	General	CR/Issue Log/SSR/PRF/SAP Notes Number	[ADD] Go to 'SAP Configuration Access'. Create field 'CR/Issue Log/SSR/PRF/SAP Notes Number'. *Need to add this field, manually key in.
TASK-121	MEDIUM	ADD	SAP System(M4)	SAP Configuration Access	General	Purpose	[ADD] Go to 'SAP Configuration Access'. Create field 'Purpose'. *Need to add this field, manually key in.
TASK-122	MEDIUM	ADD	SAP System(M4)	SAP Configuration Access	General	Changes to be done	[ADD] Go to 'SAP Configuration Access'. Create field 'Changes to be done'. *Need to add this field, manually key in.
TASK-123	MEDIUM	ADD	SAP System(M4)	SAP Configuration Access	General	Attachment	[ADD] Go to 'SAP Configuration Access'. Create field 'Attachment'. *Need to add this field, can attach file.
TASK-124	MEDIUM	ADD	SAP System(M4)	SAP Configuration Access	General	CC main/backup Functional Owner	[ADD] Go to 'SAP Configuration Access'. Create field 'CC main/backup Functional Owner'. *Need to add this field, select user
TASK-125	MEDIUM	MODIFY	SAP System(M4)	SAP Configuration Access	General	Requested By	[MODIFY] Go to 'SAP Configuration Access'. Change field 'Requested By'. *Computed when submission
TASK-126	MEDIUM	MODIFY	SAP System(M4)	SAP Configuration Access	General	Date submitted	[MODIFY] Go to 'SAP Configuration Access'. Change field 'Date submitted'. *Computed when submission
TASK-127	MEDIUM	AUTO-GENERATE	SAP System(M4)	SAP & WB Change Request Form	Section 1 (Initiator)	Change Request No.	[AUTO-GEN] In 'SAP & WB Change Request Form' → 'Section 1 (Initiator)', auto-populate 'Change Request No.'. *Auto generated Format: Year-Month-Number
TASK-128	MEDIUM	ADD	SAP System(M4)	SAP & WB Change Request Form	General	Project Phase	[ADD] Go to 'SAP & WB Change Request Form'. Create field 'Project Phase'. *Need to add this field, can select one only Values: Go Live & Support | Implementation Phase
TASK-129	MEDIUM	ADD	SAP System(M4)	SAP & WB Change Request Form	General	Division	[ADD] Go to 'SAP & WB Change Request Form'. Create field 'Division'. *Need to add this field, can select more than one  Values: IOI - 1100 | ACM - 1200 | AES - 1201 | AEC - 1202 | ASN - 1203 | AUS - 1300 | POM - 1500 | BIO - 150
TASK-130	MEDIUM	ADD	SAP System(M4)	SAP & WB Change Request Form	General	System	[ADD] Go to 'SAP & WB Change Request Form'. Create field 'System'. *Need to add this field, can select one only Values: ESKER AP AUTOMATION | SAC | SAP SUCCESSFACTOR | SAP S/4HANA | WEIGHBRIDGE | 
TASK-131	MEDIUM	MODIFY	SAP System(M4)	SAP & WB Change Request Form	General	Module	[MODIFY] Go to 'SAP & WB Change Request Form'. Change field 'Module'. *There are 4 rows, and each row has tick box list, can select more than one for each row
TASK-132	MEDIUM	MODIFY	SAP System(M4)	SAP & WB Change Request Form	General	Purpose	[MODIFY] Go to 'SAP & WB Change Request Form'. Change field 'Purpose'. *There are 2 rows, and each row has tick box list, can select one only for each row
TASK-133	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	Section 1 (Initiator)	Created	[ADD] Go to 'SAP Disaster Recovery (DRP)' → 'Section 1 (Initiator)'. Create field 'Created'. *Need to add this field, value auto generated when submission
TASK-134	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Modified	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Modified'. *Need to add this field, value auto generated when modified
TASK-135	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Distibuted	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Distibuted'. *Need to add this field, value auto generated when distributed
TASK-136	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Subject	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Subject'. *Need to add this field, manually key in.
TASK-137	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Category	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Category'. *Need to add this field, automated shows "DRP Procedure"
TASK-138	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Effective Date	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Effective Date'. *Need to add this field, manually key in.
TASK-139	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Revision	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Revision'. *Need to add this field, manually key in.
TASK-140	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Department	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Department'. *Need to add this field, manually key in.
TASK-141	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Team	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Team'. *Need to add this field, can select one only Values: Inbound Team | Outbound Team | Maintenance Team | Risk Management Team | ISG | HR Team
TASK-142	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Team Leader of	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Team Leader of'. *Need to add this field, can select one only Values: Inbound | Outbound
TASK-143	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Head of Department	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Head of Department'. *Need to add this field, select user
TASK-144	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Body	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Body'. *Need to add this field, can attach file.
TASK-145	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Comments	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Comments'. *Need to add this field, manually key in.
TASK-146	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Verified by	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Verified by'. *Need to add this field, value auto generated when submission
TASK-147	MEDIUM	ADD	SAP System(M4)	SAP Disaster Recovery (DRP)	General	Date Verified	[ADD] Go to 'SAP Disaster Recovery (DRP)'. Create field 'Date Verified'. *Need to add this field, value auto generated when submission
TASK-148	MEDIUM	AUTO-GENERATE	SAP System(M4)	Storage Location Creation	Section 1 (Initiator)	Requestor No.	[AUTO-GEN] In 'Storage Location Creation' → 'Section 1 (Initiator)', auto-populate 'Requestor No.'. *Auto generated Format: Year-Month-Number
TASK-149	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Request By	[ADD] Go to 'Storage Location Creation'. Create field 'Request By'. *Need to add this field, value auto generated when submission
TASK-150	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Date Submitted	[ADD] Go to 'Storage Location Creation'. Create field 'Date Submitted'. *Need to add this field, value auto generated when submission
TASK-151	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Designation	[ADD] Go to 'Storage Location Creation'. Create field 'Designation'. *Need to add this field, manually key in.
TASK-152	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Department	[ADD] Go to 'Storage Location Creation'. Create field 'Department'. *Need to add this field, manually select from the list.
TASK-153	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Phone No./Extension	[ADD] Go to 'Storage Location Creation'. Create field 'Phone No./Extension'. *Need to add this field, manually key in.
TASK-154	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Department/ Section Head	[ADD] Go to 'Storage Location Creation'. Create field 'Department/ Section Head'. *Need to add this field, select user
TASK-155	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Plant Code	[ADD] Go to 'Storage Location Creation'. Create field 'Plant Code'. *Need to add this field, manually key in.
TASK-156	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Storage Location Code	[ADD] Go to 'Storage Location Creation'. Create field 'Storage Location Code'. *Need to add this field, manually key in.
TASK-157	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Extebded to Material Code (Eg: 10000400, 13000013)	[ADD] Go to 'Storage Location Creation'. Create field 'Extebded to Material Code (Eg: 10000400, 13000013)'. *Need to add this field, manually key in.
TASK-158	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Tank included for adjustment during Ullage StockTake	[ADD] Go to 'Storage Location Creation'. Create field 'Tank included for adjustment during Ullage StockTake'. *Need to add this field, manually key in.
TASK-159	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Remarks	[ADD] Go to 'Storage Location Creation'. Create field 'Remarks'. *Need to add this field, manually key in.
TASK-160	MEDIUM	ADD	SAP System(M4)	Storage Location Creation	General	Attachment	[ADD] Go to 'Storage Location Creation'. Create field 'Attachment'. *Need to add this field, can attach file.
TASK-161	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	Section 1 (Initiator)	Client	[ADD] Go to 'SAP Integrated UAT Sign Off' → 'Section 1 (Initiator)'. Create field 'Client'. *Need to add this field, can select one only Values: IEQ | IED | IEP | IBD | IBQ | IBP
TASK-162	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	Client number	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field 'Client number'. *Need to add this field, manually key in.
TASK-163	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	Plant	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field 'Plant'. *Need to add this field, can select more than one Values: 1100 - IOI Plant | 1200 - ACM Plant | ACM | 1201 - AES Plant | AES | 1202 - AEC Plant | A | 1203 - A
TASK-164	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	Module	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field 'Module'. *Need to add this field, can select one only Values: CO | FI-AA | FI-AP | FI-AR | FI-GL | MM-Logistics | MM-Purchasing | MM-Store | MM-Warehouse | PM | P
TASK-165	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	Reference (SSR/PRF)	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field 'Reference (SSR/PRF)'. *Need to add this field, manually key in.
TASK-166	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	Attachment	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field 'Attachment'. *Need to add this field, can attach file.
TASK-167	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	TR Number Reference (link)	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field 'TR Number Reference (link)'. *Need to add this field, manually key in.
TASK-168	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	SAP Remarks	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field 'SAP Remarks'. *Need to add this field, manually key in.
TASK-169	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	CC	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field 'CC'. *Need to add this field, manually key in select user to be recipients.
TASK-170	MEDIUM	ADD	SAP System(M4)	SAP Integrated UAT Sign Off	General	1st Key User	[ADD] Go to 'SAP Integrated UAT Sign Off'. Create field '1st Key User'. *Need to add this field, manually key in select user to be recipients.
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
📊 TASK EXECUTION SUMMARY							
							
CATEGORY	COUNT	DESCRIPTION					
Total Tasks	170	All tasks to be executed					
HIGH Priority	6	Critical bugs blocking users - Execute FIRST					
MEDIUM Priority	148	Feature additions and updates - Normal queue					
LOW Priority	16	Field removals and cleanup - Execute LAST					
							
BY ACTION TYPE:							
ADD	100	Create new fields					
MODIFY	32	Change existing field properties					
REMOVE	15	Delete fields					
UPDATE	10	Update field data/options					
AUTO-GENERATE	8	Configure auto-population					
FIX BUG	5	Resolve errors					
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
🚀 AI AGENT QUICK START GUIDE							
							
STEP	ACTION	DETAILS					
1	Read this document	Understand the task structure and action types					
2	Filter by Priority	Execute HIGH priority tasks first (submit errors)					
3	Parse AI_INSTRUCTION	Each task has a clear instruction in column H					
4	Check DATA_SOURCE	If specified, fetch dropdown values from that list					
5	Check DROPDOWN_VALUES	If specified, use those exact values					
6	Track completion	Update status after completing each task					
							
CONDITIONAL FIELD RULES:							
Form	Condition	Action					
Reset Password	Application = 'SAP S4/HANA'	Show SAP Client dropdown field					
Reset Password	SAP Client = 'IEP (Live System)'	Show SAP Client Name text field					
Reset Password	Application = 'BANK'	Show Bank dropdown field					
Share Folder	Server = 'IOIPCNSHARE'	Show IT Verification section					
User ID Req	Application includes 'DOOR ACCESS'	Show Door Access selection options					
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							
							
🔑 MACHINE-READABLE REFERENCE (For AI Parsing)							
							
KEY	VALUES	DESCRIPTION					
ACTION_TYPES	ADD | REMOVE | UPDATE | MODIFY | FIX BUG | AUTO-GENERATE	Valid action type identifiers					
PRIORITY_LEVELS	HIGH | MEDIUM | LOW	Execution priority order					
MODULE_CODES	M1 | M2 | M3 | M4	System module identifiers					
M1_FORMS	EAF | NIR | Reset Password | Share Folder | User ID Req	User & Access Management forms					
M2_FORMS	Server Reboot Log | Data Center Access Log | IT Event | Server Records | Data Restoration | IT Daily Report | IT SSR | PRF	IT Support forms					
M3_FORMS	Hardware Inventory	Hardware Management forms					
M4_FORMS	SAP Authorisation Matrix Review | SAP Transport Request | SAP Configuration Access | SAP & WB Change Request Form | SAP Disaster Recovery | Storage Location Creation | SAP Integrated UAT Sign Off	SAP System forms					
CONFIG_LISTS	Config_Companies | Config_Departments | IT_M1_RS_SystemsList | IT_M1_RS_SAP_Client | IT_M1_RS_Banks | IT_M1_SFAR_Servers	SharePoint reference lists					
							
FORM FILE PATHS (Reference):							
FORM	FILE_PATH						
EAF	pages/it/forms/eaf/new.tsx						
NIR	pages/it/forms/nir/new.tsx						
Reset Password	pages/it/forms/rs/index.tsx						
Share Folder	pages/it/forms/sfar/index.tsx						
User ID Req	pages/it/forms/ur/index.tsx						
SAP Auth Matrix	pages/it/forms/sapamr/new.tsx						
SAP Transport	pages/it/forms/saptr/new.tsx						
SAP Config Access	pages/it/forms/sapca/new.tsx						
SAP Change Request	pages/it/forms/sapcr/new.tsx						
SAP Disaster Recovery	pages/it/forms/sapdrp/new.tsx						
							
═══════════════════════════════════════════════════════════════════════════════════════════════════════							