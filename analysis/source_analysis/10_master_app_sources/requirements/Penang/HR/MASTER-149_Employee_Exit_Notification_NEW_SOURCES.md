# Master App PDF Source - Employee Exit Notification (NEW)

> Master row: 149 | Site: Penang | Owner: HR | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 149 | Clearly Found |
| Site | Penang | Clearly Found |
| Application Name | Employee Exit Notification (NEW) | Clearly Found |
| Owner | HR | Clearly Found |
| Department | HR \| Critical App \| PHBSVR | Source inventory |
| Form List | Employee Exit Notification (NEW) | Source inventory |
| Blueprint Department | HR | Source inventory |
| Blueprint Code | EEN | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | planned_blueprint_pdf_pending | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/005_oleObject211.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.450 | Embedded metadata fallback needs review | 8 | 6690 | 75 | 20 | EMPLOYEE EXIT |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/013_oleObject219.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 3 | 1325 | 45 | 9 | HR APPLICATIONS PROBLEM |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/001_oleObject207.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 3 | 1226 | 37 | 13 | IOI OLEOCHEMICAL INDUSTRIES |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/006_oleObject212.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 3 | 2318 | 35 | 10 | EMPLOYEE PERSONAL |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/009_oleObject215.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 4 | 2072 | 40 | 16 | Foreign Worker Work Period Ex |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/010_oleObject216.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 5 | 3382 | 19 | 7 | FOREIGN WORKERS WORK |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/020_oleObject226.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 2 | 840 | 18 | 3 | OUTSOURCE WORKER |
| source/Project Iventories/extracted-embedded-pdfs/Penang/HR/021_oleObject227.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.950 | Embedded metadata fallback needs review | 11 | 5689 | 42 | 13 | PERFORMANCE APPRAISAL FORM - |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Employee Exit | Inferred from PDF text | Needs Human Confirmation |
| 2 | Notification | Inferred from PDF text | Needs Human Confirmation |
| 3 | HR SECTION | Inferred from PDF text | Needs Human Confirmation |
| 4 | Section | Inferred from PDF text | Needs Human Confirmation |
| 5 | Actual Last Working Day | Inferred from PDF text | Needs Human Confirmation |
| 6 | Approve Reject | Inferred from PDF text | Needs Human Confirmation |
| 7 | Exit Interview | Inferred from PDF text | Needs Human Confirmation |
| 8 | HEAD OF DEPARTMENT / DIVISION APPROVAL | Inferred from PDF text | Needs Human Confirmation |
| 9 | IT SECTION | Inferred from PDF text | Needs Human Confirmation |
| 10 | System | Inferred from PDF text | Needs Human Confirmation |
| 11 | Human Resources Use | Inferred from PDF text | Needs Human Confirmation |
| 12 | Returned Items | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Company | Site | Text | 1 | Parsed from PDF text |
| 2 | Category | Category | Choice/Text | 1 | Parsed from PDF text |
| 3 | Type | Type | Choice/Text | 1 | Parsed from PDF text |
| 4 | Renewal Status | ContractStatus | Choice/Text | 1 | Parsed from PDF text |
| 5 | Name & Email | EmpName | Person/Text | 1 | Parsed from PDF text |
| 6 | Employee No. | EmpNum | Number/Text | 1 | Parsed from PDF text |
| 7 | Position | Position | Text | 1 | Parsed from PDF text |
| 8 | Section | EmpDept | Text | 1 | Parsed from PDF text |
| 9 | Hardcopy? | ExitInterview | Text | 1 | Parsed from PDF text |
| 10 | Last Working Date | LastWorkingDay | Date/Text | 1 | Parsed from PDF text |
| 11 | Last Service Date | LastServiceDay | Date/Text | 1 | Parsed from PDF text |
| 12 | Superior | HOD | Person/Text | 1 | Parsed from PDF text |
| 13 | Department/Division Head | DivHead | Text | 1 | Parsed from PDF text |
| 14 | Remarks | HRComment | Multiline Text | 1 | Parsed from PDF text |
| 15 | Date Submitted | SubmitDate | Date/Text | 1 | Parsed from PDF text |
| 16 | Justification | Justification | Multiline Text | 1 | Parsed from PDF text |
| 17 | Actual Last Working Day | ActualLWD | Text | 1 | Parsed from PDF text |
| 18 | Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 19 | Name | EDName | Person/Text | 1 | Parsed from PDF text |
| 20 | Date | EDDate | Date/Text | 1 | Parsed from PDF text |
| 21 | Remarks | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 22 | Remarks | HODRemarks | Person/Text | 1 | Parsed from PDF text |
| 23 | Approved By | HODName | Person/Text | 1 | Parsed from PDF text |
| 24 | Approved Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 25 | RETURNED ITEMS | CompanyProperties | Text | 1 | Parsed from PDF text |
| 26 | Reason (if not returned) | Reason | Multiline Text | 1 | Parsed from PDF text |
| 27 | Remarks | Remarks2 | Multiline Text | 1 | Parsed from PDF text |
| 28 | Performed By | PerformedBy2 | Text | 1 | Parsed from PDF text |
| 29 | Performed Date | PerformedDate2 | Date/Text | 1 | Parsed from PDF text |
| 30 | Status | WDStatus | Choice/Text | 1 | Parsed from PDF text |
| 31 | Reason | WDReason | Multiline Text | 1 | Parsed from PDF text |
| 32 | Performed By | WDBy | Text | 1 | Parsed from PDF text |
| 33 | Performed Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Current Action | CA | Text | 1 | Parsed from PDF text |
| 35 | HR Section - Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 36 | Div. Head - Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 37 | ED Section - Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 38 | HR Section - Editor 4 | Editor4 | Text | 1 | Parsed from PDF text |
| 39 | HR Section - Editor 5 | Editor5 | Text | 1 | Parsed from PDF text |
| 40 | Withdraw Section - Editor 6 | Editor6 | Text | 1 | Parsed from PDF text |
| 41 | IT Section | ITEditor | Text | 1 | Parsed from PDF text |
| 42 | HOD Section | HODEditor | Person/Text | 1 | Parsed from PDF text |
| 43 | HR Editor | HREditor | Text | 1 | Parsed from PDF text |
| 44 | E&I Editor | EIEditor | Text | 1 | Parsed from PDF text |
| 45 | ACM IT | ACMIT | Text | 1 | Parsed from PDF text |
| 46 | PCN IT | PCNIT | Text | 1 | Parsed from PDF text |
| 47 | IT | AllIT | Text | 1 | Parsed from PDF text |
| 48 | HR | AllHR | Text | 1 | Parsed from PDF text |
| 49 | HR - Exec | HR1 | Text | 1 | Parsed from PDF text |
| 50 | HR - Non Exec | HR2 | Text | 1 | Parsed from PDF text |
| 51 | HR HOD | HRHOD | Person/Text | 1 | Parsed from PDF text |
| 52 | HR PIC | HRPIC | Person/Text | 1 | Parsed from PDF text |
| 53 | IT Admin | IT | Text | 1 | Parsed from PDF text |
| 54 | Finance | FIN | Text | 1 | Parsed from PDF text |
| 55 | E&I | EI | Text | 1 | Parsed from PDF text |
| 56 | Security | BCC | Text | 1 | Parsed from PDF text |
| 57 | ED | ED | Text | 1 | Parsed from PDF text |
| 58 | Running Number | INO | Text | 1 | Parsed from PDF text |
| 59 | Reminder date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 60 | Reminder CC | RemCC | Text | 1 | Parsed from PDF text |
| 61 | Hide Extend button | Hide | Text | 1 | Parsed from PDF text |
| 62 | Hide Interview | HideInt | Text | 1 | Parsed from PDF text |
| 63 | Hide Handover | HideHand | Text | 1 | Parsed from PDF text |
| 64 | Type | TypeCheck | Choice/Text | 1 | Parsed from PDF text |
| 65 | Type (handover Checklist) | TypeCheck2 | Choice/Text | 1 | Parsed from PDF text |
| 66 | All Done (IT) | AllDone | Text | 1 | Parsed from PDF text |
| 67 | All Done (HR) | AllDone2 | Text | 1 | Parsed from PDF text |
| 68 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 69 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 70 | IT Incomplete | N_1; N_2; N_3; N_4 | Text | 1 | Parsed from PDF text |
| 71 | IT All Incomplete | INC | Text | 1 | Parsed from PDF text |
| 72 | HR Incomplete | H_1; H_2; H_3; H_4 | Text | 1 | Parsed from PDF text |
| 73 | HR All Incomplete | INC2 | Text | 1 | Parsed from PDF text |
| 74 | All Systems | AllSys | Text | 1 | Parsed from PDF text |
| 75 | Remarks | Remtext | Multiline Text | 1 | Parsed from PDF text |
| 76 | Sent Date | DateCreated | Date/Text | 1 | Parsed from PDF text |
| 77 | Case No. | DisplayCaseNo | Number/Text | 1 | Parsed from PDF text |
| 78 | To GHR Personnel | SendTo | Date/Text | 1 | Parsed from PDF text |
| 79 | Reported By | ReportedBy | Text | 1 | Parsed from PDF text |
| 80 | Department | Dept | Text | 1 | Parsed from PDF text |
| 81 | Employee No. | EmpNo | Number/Text | 1 | Parsed from PDF text |
| 82 | Extension No. | ExtNo | Number/Text | 1 | Parsed from PDF text |
| 83 | Modules | Module | Text | 1 | Parsed from PDF text |
| 84 | Modules | Module2 | Text | 1 | Parsed from PDF text |
| 85 | Problem Description | ProblemDesc | Multiline Text | 1 | Parsed from PDF text |
| 86 | Attachment | Attach | Text | 1 | Parsed from PDF text |
| 87 | CC | CC | Text | 1 | Parsed from PDF text |
| 88 | Carried out by | ISGName | Person/Text | 1 | Parsed from PDF text |
| 89 | Solution | Solution | Text | 1 | Parsed from PDF text |
| 90 | Case Status | CaseStatus | Choice/Text | 1 | Parsed from PDF text |
| 91 | Date Started | StartDate | Date/Text | 1 | Parsed from PDF text |
| 92 | Date Completed | DateClosed | Date/Text | 1 | Parsed from PDF text |
| 93 | Description/Remarks | ISGRemarks | Multiline Text | 1 | Parsed from PDF text |
| 94 | Attachment | Attachment2 | Text | 1 | Parsed from PDF text |
| 95 | Carried out by | ISGName_1 | Person/Text | 1 | Parsed from PDF text |
| 96 | Status | CaseStatus_1 | Choice/Text | 1 | Parsed from PDF text |
| 97 | Date | DateReject | Date/Text | 1 | Parsed from PDF text |
| 98 | Remarks | ISRemarks | Multiline Text | 1 | Parsed from PDF text |
| 99 | Date Accepted | DateAccept | Date/Text | 1 | Parsed from PDF text |
| 100 | Comment | Comment | Multiline Text | 1 | Parsed from PDF text |
| 101 | KIV/ARCHIVED by | KIVBy | Text | 1 | Parsed from PDF text |
| 102 | Status | KIVStatus | Choice/Text | 1 | Parsed from PDF text |
| 103 | Date | KIVDate | Date/Text | 1 | Parsed from PDF text |
| 104 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 105 | Requestor | Requestor | Person/Text | 1 | Parsed from PDF text |
| 106 | AuthorsList | AuthorsList | Text | 1 | Parsed from PDF text |
| 107 | IT Admin | ISG | Text | 1 | Parsed from PDF text |
| 108 | HR (PIC) | PIC | Person/Text | 1 | Parsed from PDF text |
| 109 | HR (BOSS) | GHR | Text | 1 | Parsed from PDF text |
| 110 | HR (LMS) | GHR2 | Text | 1 | Parsed from PDF text |
| 111 | AE1 | AEditor1 | Text | 1 | Parsed from PDF text |
| 112 | AE3 | AEditor3 | Text | 1 | Parsed from PDF text |
| 113 | Mailing List | MailingList | Text | 1 | Parsed from PDF text |
| 114 | Last Modified by | LastModifiedBy | Text | 1 | Parsed from PDF text |
| 115 | Expire Date | AutoClosedDate | Date/Text | 1 | Parsed from PDF text |
| 116 | Modified by | ModifiedBy | Text | 1 | Parsed from PDF text |
| 117 | Modiefied on | DateModified | Date/Text | 1 | Parsed from PDF text |
| 118 | Division | Division | Text | 1 | Parsed from PDF text |
| 119 | Name | PIC | Person/Text | 1 | Parsed from PDF text |
| 120 | Area of Responsibility | Responsibility | Text | 1 | Parsed from PDF text |
| 121 | Name | PIC_1 | Person/Text | 1 | Parsed from PDF text |
| 122 | Position | Position_1 | Text | 1 | Parsed from PDF text |
| 123 | Area of Responsibility | Responsibility_1 | Text | 1 | Parsed from PDF text |
| 124 | Name | PIC_2 | Person/Text | 1 | Parsed from PDF text |
| 125 | Position | Position_2 | Text | 1 | Parsed from PDF text |
| 126 | Area of Responsibility | Responsibility_2 | Text | 1 | Parsed from PDF text |
| 127 | Name | PIC_3 | Person/Text | 1 | Parsed from PDF text |
| 128 | Position | Position_3 | Text | 1 | Parsed from PDF text |
| 129 | Area of Responsibility | Responsibility_3 | Text | 1 | Parsed from PDF text |
| 130 | Name | SubmittedBy | Person/Text | 1 | Parsed from PDF text |
| 131 | Date | SubmitDate | Date/Text | 1 | Parsed from PDF text |
| 132 | Remark | Remark | Multiline Text | 1 | Parsed from PDF text |
| 133 | Revision Required | Revision | Text | 1 | Parsed from PDF text |
| 134 | Updated by | Updatedby | Date/Text | 1 | Parsed from PDF text |
| 135 | Date | Updateddt | Date/Text | 1 | Parsed from PDF text |
| 136 | Remarks | StaRem | Multiline Text | 1 | Parsed from PDF text |
| 137 | Name | HODName | Person/Text | 1 | Parsed from PDF text |
| 138 | Position | HODPost | Person/Text | 1 | Parsed from PDF text |
| 139 | Date | HODDate | Date/Text | 1 | Parsed from PDF text |
| 140 | Created by | DocAuthor | Text | 1 | Parsed from PDF text |
| 141 | on | CDate | Date/Text | 1 | Parsed from PDF text |
| 142 | Current Status | CurrentAction | Choice/Text | 1 | Parsed from PDF text |
| 143 | 1. HR Section | Editor1 | Text | 1 | Parsed from PDF text |
| 144 | 2. HOD Section | Editor2 | Person/Text | 1 | Parsed from PDF text |
| 145 | 3. HOD/HOS | Editor3 | Person/Text | 1 | Parsed from PDF text |
| 146 | HR | HR | Text | 1 | Parsed from PDF text |
| 147 | HR Admin | HRAdmin | Text | 1 | Parsed from PDF text |
| 148 | IT | IT | Text | 1 | Parsed from PDF text |
| 149 | Modification Date | ModifiedDate | Date/Text | 1 | Parsed from PDF text |
| 150 | Company | Company | Text | 1 | Parsed from PDF text |
| 151 | Name | EmpName | Person/Text | 1 | Parsed from PDF text |
| 152 | NRIC No. (Old) | NRIC_O | Number/Text | 1 | Parsed from PDF text |
| 153 | NRIC No. (New) | NRIC_N | Number/Text | 1 | Parsed from PDF text |
| 154 | Marital Status | Marital | Choice/Text | 1 | Parsed from PDF text |
| 155 | Disabilities | Disabilities | Text | 1 | Parsed from PDF text |
| 156 | Permanent Address | Address1 | Text | 1 | Parsed from PDF text |
| 157 | Poscode | Poscode1 | Text | 1 | Parsed from PDF text |
| 158 | Tel No. | TelNo1 | Number/Text | 1 | Parsed from PDF text |
| 159 | Correspondence Address | Address2 | Text | 1 | Parsed from PDF text |
| 160 | Postcode | Poscode2 | Text | 1 | Parsed from PDF text |
| 161 | Tel No. | TelNo2 | Number/Text | 1 | Parsed from PDF text |
| 162 | EPF No. | EPF | Number/Text | 1 | Parsed from PDF text |
| 163 | SOCSO No. | SOCSO | Number/Text | 1 | Parsed from PDF text |
| 164 | Income Tax No. | ITAX | Number/Text | 1 | Parsed from PDF text |
| 165 | Name | SpName | Person/Text | 1 | Parsed from PDF text |
| 166 | NRIC No. (New) | SpNRIC_N | Number/Text | 1 | Parsed from PDF text |
| 167 | Working | SpWork | Text | 1 | Parsed from PDF text |
| 168 | Occupation(Optional) | SpOccupation | Text | 1 | Parsed from PDF text |
| 169 | Company | SpComp | Text | 1 | Parsed from PDF text |
| 170 | Contact Tel. No. | TelNo | Number/Text | 1 | Parsed from PDF text |
| 171 | Submitted by | Submittedby | Text | 1 | Parsed from PDF text |
| 172 | Submitted on | Submittedon | Text | 1 | Parsed from PDF text |
| 173 | Status | HRAction | Choice/Text | 1 | Parsed from PDF text |
| 174 | Accepted by | Acceptedby | Text | 1 | Parsed from PDF text |
| 175 | Accepted on | Acceptedon | Text | 1 | Parsed from PDF text |
| 176 | HR 1 | HR_1 | Text | 1 | Parsed from PDF text |
| 177 | HR 2 | HR_2 | Text | 1 | Parsed from PDF text |
| 178 | HR 3 | HR_3 | Text | 1 | Parsed from PDF text |
| 179 | Issue No | IssueNo | Text | 1 | Parsed from PDF text |
| 180 | Superior | SendTo | Date/Text | 1 | Parsed from PDF text |
| 181 | Head of Section (Optional) | HOS | Text | 1 | Parsed from PDF text |
| 182 | Head of Department | HOD | Person/Text | 1 | Parsed from PDF text |
| 183 | Name | Name | Person/Text | 1 | Parsed from PDF text |
| 184 | Passport No. | PassportNo | Number/Text | 1 | Parsed from PDF text |
| 185 | Department | Department | Text | 1 | Parsed from PDF text |
| 186 | Work Permit Expiry Date | WPExpDate | Date/Text | 1 | Parsed from PDF text |
| 187 | Contract Period | DateF | Date/Text | 1 | Parsed from PDF text |
| 188 | Contract Year | Year; Year | Text | 1 | Parsed from PDF text |
| 189 | Remark | ReplyRemark | Multiline Text | 1 | Parsed from PDF text |
| 190 | Name | ReplyName | Person/Text | 1 | Parsed from PDF text |
| 191 | Date | ReplyDate | Date/Text | 1 | Parsed from PDF text |
| 192 | Status | HOSStatus | Choice/Text | 1 | Parsed from PDF text |
| 193 | Name | HOSName | Person/Text | 1 | Parsed from PDF text |
| 194 | Date | HOSDate | Date/Text | 1 | Parsed from PDF text |
| 195 | Remark | HOSRemark | Multiline Text | 1 | Parsed from PDF text |
| 196 | Contract Status | ContStatus | Choice/Text | 1 | Parsed from PDF text |
| 197 | Status | HODStatus | Person/Text | 1 | Parsed from PDF text |
| 198 | Remark | HODRemark | Person/Text | 1 | Parsed from PDF text |
| 199 | Status | HRHODStatus | Person/Text | 1 | Parsed from PDF text |
| 200 | Name | HRHODName | Person/Text | 1 | Parsed from PDF text |
| 201 | Date | HRHODDate | Date/Text | 1 | Parsed from PDF text |
| 202 | Remark | HRHODRemark | Person/Text | 1 | Parsed from PDF text |
| 203 | Flight Departure Date | DepartDate | Date/Text | 1 | Parsed from PDF text |
| 204 | Departure Time | DepartTime | Text | 1 | Parsed from PDF text |
| 205 | Attachment | Att | Text | 1 | Parsed from PDF text |
| 206 | Transportation Details | Att2 | Text | 1 | Parsed from PDF text |
| 207 | Date of Submission | SubDate | Date/Text | 1 | Parsed from PDF text |
| 208 | Date | WDDate | Date/Text | 1 | Parsed from PDF text |
| 209 | Withdrawn by | WDBy | Text | 1 | Parsed from PDF text |
| 210 | Remarks | WDRem | Multiline Text | 1 | Parsed from PDF text |
| 211 | Check-Out-Memo | COMemo | Text | 1 | Parsed from PDF text |
| 212 | Hostel Address | Hostel | Text | 1 | Parsed from PDF text |
| 213 | Date of Birth | DOB | Date/Text | 1 | Parsed from PDF text |
| 214 | Date of Commencement | DOC | Date/Text | 1 | Parsed from PDF text |
| 215 | New Passport No. | PassportNoNew | Number/Text | 1 | Parsed from PDF text |
| 216 | New Upload Passport | PassportNew | Text | 1 | Parsed from PDF text |
| 217 | Old Passport No. | PassportNoOld | Number/Text | 1 | Parsed from PDF text |
| 218 | Old Upload Passport | PassportOld | Text | 1 | Parsed from PDF text |
| 219 | Nationality | Nationality | Text | 1 | Parsed from PDF text |
| 220 | Contract Period | ContractPeriod; ContractPeriod_1 | Text | 1 | Parsed from PDF text |
| 221 | Work Permit No. | WorkPermitNo | Number/Text | 1 | Parsed from PDF text |
| 222 | Upload Permit to Work | Permit | Text | 1 | Parsed from PDF text |
| 223 | FOMEMA Worker Code | WorkerCode | Text | 1 | Parsed from PDF text |
| 224 | SOCSO No. | SocsoNo | Number/Text | 1 | Parsed from PDF text |
| 225 | Date Joined | DOJ | Date/Text | 1 | Parsed from PDF text |
| 226 | New Passport No. | PassportNo | Number/Text | 1 | Parsed from PDF text |
| 227 | Upload New Passport | Passport | Text | 1 | Parsed from PDF text |
| 228 | Old Passport No. | PassportNo2 | Number/Text | 1 | Parsed from PDF text |
| 229 | Upload Old Passport | Passport2 | Text | 1 | Parsed from PDF text |
| 230 | Upload Permit to Work | WorkPermit | Text | 1 | Parsed from PDF text |
| 231 | Work Permit Employed as | WPEmployed | Text | 1 | Parsed from PDF text |
| 232 | Work Permit Employer | WPEmployer | Text | 1 | Parsed from PDF text |
| 233 | Remarks/Attachment | Remarks | Multiline Text | 1 | Parsed from PDF text |
| 234 | Resignation Date | ResignDate | Date/Text | 1 | Parsed from PDF text |
| 235 | Reason Withhold | Reason | Multiline Text | 1 | Parsed from PDF text |
| 236 | Employee No. | EmNo; SELECT | Number/Text | 1 | Parsed from PDF text |
| 237 | Employee Name | EmName | Person/Text | 1 | Parsed from PDF text |
| 238 | Company | EmComp | Text | 1 | Parsed from PDF text |
| 239 | Designation | EmDesg | Text | 1 | Parsed from PDF text |
| 240 | Division | EmDiv | Text | 1 | Parsed from PDF text |
| 241 | Department/Section | EmDept | Text | 1 | Parsed from PDF text |
| 242 | Date Joined | EmDateJoin | Date/Text | 1 | Parsed from PDF text |
| 243 | current position | EmComYear | Text | 1 | Parsed from PDF text |
| 244 | Appraiser Email | AppBy | Text | 1 | Parsed from PDF text |
| 245 | (Optional) | AppBy2 | Text | 1 | Parsed from PDF text |
| 246 | HOD | HOD | Person/Text | 1 | Parsed from PDF text |
| 247 | Div. Head | DivHead | Text | 1 | Parsed from PDF text |
| 248 | Employee Email | EmpEmail | Text | 1 | Parsed from PDF text |
| 249 | SECTION 7 | OVERALL | Text | 1 | Parsed from PDF text |
| 250 | SECTION 9 | COMMENTS | Multiline Text | 1 | Parsed from PDF text |
| 251 | Employee ’s Comment | EmpComments | Multiline Text | 1 | Parsed from PDF text |
| 252 | Date | EmpDate | Date/Text | 1 | Parsed from PDF text |
| 253 | Appraiser ’s Comment | AppComments | Multiline Text | 1 | Parsed from PDF text |
| 254 | Name | AppName | Person/Text | 1 | Parsed from PDF text |
| 255 | Date | AppDate | Date/Text | 1 | Parsed from PDF text |
| 256 | Appraiser II ’s Comment | AppComments2 | Multiline Text | 1 | Parsed from PDF text |
| 257 | Name | AppName2 | Person/Text | 1 | Parsed from PDF text |
| 258 | Date | AppDate2 | Date/Text | 1 | Parsed from PDF text |
| 259 | Dept. Head ’s Comments | HODComments | Person/Text | 1 | Parsed from PDF text |
| 260 | Total Score | Total_1; Band_1 | Number/Text | 1 | Parsed from PDF text |
| 261 | Div. Head ’s Comments | HODComments2 | Person/Text | 1 | Parsed from PDF text |
| 262 | Total Score | Total_2; Band_2 | Number/Text | 1 | Parsed from PDF text |
| 263 | Name | HODName2 | Person/Text | 1 | Parsed from PDF text |
| 264 | Date | HODDate2 | Date/Text | 1 | Parsed from PDF text |
| 265 | Director Review | EDComments | Multiline Text | 1 | Parsed from PDF text |
| 266 | Final Score | Total_4; Band_4 | Number/Text | 1 | Parsed from PDF text |
| 267 | HR HOD Review | HRComments | Person/Text | 1 | Parsed from PDF text |
| 268 | Attachment | HRAttachment | Text | 1 | Parsed from PDF text |
| 269 | Total Score | Total_3; Band_3 | Number/Text | 1 | Parsed from PDF text |
| 270 | Name | HRName | Person/Text | 1 | Parsed from PDF text |
| 271 | Date | HRDate | Date/Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | status (27), hod (19), submitted (11), approved (7), currentaction (6), rejected (5), review (4), approve (3) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_HR`
FormCode: `EEN`
Child-list recommendation: `MainDB_HR_Ext_EEN_Rows` candidate for repeating row fields

Use the single-main-list pattern from DEC-2026-001. Parsed fields are evidence candidates only; final SharePoint internal names and choices require confirmation against Domino XML/DXL or business review.

## 7. Power Apps Build Specification

| Screen/Component | Requirement | Confidence |
| --- | --- | --- |
| List | Filter by site/owner/FormCode and status | Inferred |
| New/Edit | Render parsed PDF fields grouped by inferred sections | Inferred |
| Detail | Read-only view with audit/workflow metadata | Inferred |
| Approval Actions | Show only if workflow state confirms approval is required | Needs Human Confirmation |
| Child Rows | Use editable gallery only if child-list recommendation is confirmed | Needs Human Confirmation |

## 8. Human Confirmation Questions

| # | Question | Severity |
| --- | --- | --- |
| MASTER-149-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-149-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-149-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 8 |
| Parsed Field Count | 271 |
| Workflow Signal Count | 91 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
