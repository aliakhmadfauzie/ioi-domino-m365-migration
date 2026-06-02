# Master App PDF Source - Pancen - IQMS-LTM

> Master row: 91 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 91 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - IQMS-LTM | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| QC \| PCNSVR | Source inventory |
| Form List | Pancen - IQMS-LTM | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IQMSLTM | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/018_oleObject122.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 4 | 2591 | 33 | 13 | Page 1 of 4 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/035_oleObject139.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 10 | 6555 | 41 | 13 | Laboratory Test Method |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/027_oleObject190.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 20 | 18979 | 345 | 96 | MASTERLIST OF LAB EQUIPMENTS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/034_oleObject197.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 10 | 6555 | 41 | 13 | Laboratory Test Method |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/058_oleObject162.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 1 | 494 | 9 | 2 | Improvement Info |

## 3. Form Sections

| # | Section | Evidence | Confidence |
| --- | --- | --- | --- |
| 1 | Section No. : | Inferred from PDF text | Needs Human Confirmation |
| 2 | Approvals | Inferred from PDF text | Needs Human Confirmation |
| 3 | Submitted for approval on | Inferred from PDF text | Needs Human Confirmation |
| 4 | : K1 - K2 - K3 - K4 - K5 - K6 - K7 - K8 - K9 - K10 - K11 - K12 | Inferred from PDF text | Needs Human Confirmation |
| 5 | Completed Approval list : TotalCount | Inferred from PDF text | Needs Human Confirmation |
| 6 | Endorsement | Inferred from PDF text | Needs Human Confirmation |
| 7 | Section No. | Inferred from PDF text | Needs Human Confirmation |
| 8 | Approval : | Inferred from PDF text | Needs Human Confirmation |
| 9 | Verification : | Inferred from PDF text | Needs Human Confirmation |
| 10 | Record Of Issues | Inferred from PDF text | Needs Human Confirmation |
| 11 | Ino_1 | Inferred from PDF text | Needs Human Confirmation |
| 12 | Jus_1 | Inferred from PDF text | Needs Human Confirmation |

## 4. Field Extraction

| # | Label | Domino/PDF Field | Recommended Type | Page | Confidence |
| --- | --- | --- | --- | --- | --- |
| 1 | Required Approvals list | TotalList | Number/Text | 1 | Parsed from PDF text |
| 2 | Pending for App | K1; K2; K3; K4 | Text | 1 | Parsed from PDF text |
| 3 | All Pending Approvers | AllPdgApp | Person/Text | 1 | Parsed from PDF text |
| 4 | Completed Approval list | TotalCount | Number/Text | 1 | Parsed from PDF text |
| 5 | Get Total App Req | GetTotal | Number/Text | 1 | Parsed from PDF text |
| 6 | Get Total App Done | GetApp | Number/Text | 1 | Parsed from PDF text |
| 7 | All Approved | AllApproved | Person/Text | 1 | Parsed from PDF text |
| 8 | Pending App - QMR | PdgApp | Text | 1 | Parsed from PDF text |
| 9 | Notified Status | SentStatus | Choice/Text | 1 | Parsed from PDF text |
| 10 | Rejected status | RejectStatus | Choice/Text | 1 | Parsed from PDF text |
| 11 | Status | FinalStatus | Choice/Text | 1 | Parsed from PDF text |
| 12 | Current Status | Status | Choice/Text | 1 | Parsed from PDF text |
| 13 | Allow Editing by | Editors | Text | 1 | Parsed from PDF text |
| 14 | Authors | Authors | Text | 1 | Parsed from PDF text |
| 15 | Approval | Author_APP | Text | 1 | Parsed from PDF text |
| 16 | Verification | Author_Ver | Text | 1 | Parsed from PDF text |
| 17 | Dept. Head | Author_DH | Text | 1 | Parsed from PDF text |
| 18 | Readers | Readers | Text | 1 | Parsed from PDF text |
| 19 | Obsolete Date | ObsoleteDate | Date/Text | 1 | Parsed from PDF text |
| 20 | Sendto | Sendto | Date/Text | 1 | Parsed from PDF text |
| 21 | Editors_1 | Editors_1 | Text | 1 | Parsed from PDF text |
| 22 | Authors_1 | Authors_1 | Text | 1 | Parsed from PDF text |
| 23 | Reader_1 | reader_1 | Text | 1 | Parsed from PDF text |
| 24 | QA | QA | Text | 1 | Parsed from PDF text |
| 25 | QA | QA1 | Text | 1 | Parsed from PDF text |
| 26 | ISG Admin | ISG | Text | 1 | Parsed from PDF text |
| 27 | MailingList for rejections | RejMail | Text | 1 | Parsed from PDF text |
| 28 | Server Name | Editors_Server | Person/Text | 1 | Parsed from PDF text |
| 29 | QAAdmin | QAAdmin | Text | 1 | Parsed from PDF text |
| 30 | ISAdmin | ISAdmin | Text | 1 | Parsed from PDF text |
| 31 | Quality Council Email add | QualityCManagers | Text | 1 | Parsed from PDF text |
| 32 | Author | DocAuthor | Text | 1 | Parsed from PDF text |
| 33 | Created | CDate | Date/Text | 1 | Parsed from PDF text |
| 34 | Document No. | DocNo | Number/Text | 1 | Parsed from PDF text |
| 35 | Issue No. | IssuNo | Number/Text | 1 | Parsed from PDF text |
| 36 | Date Issued | DateIssue | Date/Text | 1 | Parsed from PDF text |
| 37 | Document Title | TitleDoc | Text | 1 | Parsed from PDF text |
| 38 | Document Category | Cat | Choice/Text | 1 | Parsed from PDF text |
| 39 | Document Type | DocType | Choice/Text | 1 | Parsed from PDF text |
| 40 | Document Type | Type; DocTitle | Choice/Text | 1 | Parsed from PDF text |
| 41 | Department | Dept | Text | 1 | Parsed from PDF text |
| 42 | Number | No | Text | 1 | Parsed from PDF text |
| 43 | Business Area | Comp | Text | 1 | Parsed from PDF text |
| 44 | System | Sys | Text | 1 | Parsed from PDF text |
| 45 | Issue No. | IssueNum | Number/Text | 1 | Parsed from PDF text |
| 46 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 47 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 48 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 49 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 50 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 51 | Company name | CompName | Person/Text | 1 | Parsed from PDF text |
| 52 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 53 | Company | Company | Text | 1 | Parsed from PDF text |
| 54 | Calibration | Calibration | Text | 1 | Parsed from PDF text |
| 55 | Instrument Type | InsType | Choice/Text | 1 | Parsed from PDF text |
| 56 | External Calibration | ExtCal | Text | 1 | Parsed from PDF text |
| 57 | Frequency | Frequency_1 | Text | 1 | Parsed from PDF text |
| 58 | Internal Verification | IntStand | Text | 1 | Parsed from PDF text |
| 59 | Frequency | Frequency_2 | Text | 1 | Parsed from PDF text |
| 60 | Preventive Maintenance | PrevMant | Text | 1 | Parsed from PDF text |
| 61 | Frequency | Frequency_3 | Text | 1 | Parsed from PDF text |
| 62 | Instrument Tag | InstTag | Text | 1 | Parsed from PDF text |
| 63 | Brand/Manufacturer | BrandMant | Text | 1 | Parsed from PDF text |
| 64 | Model | Model | Text | 1 | Parsed from PDF text |
| 65 | Serial No | SerialNo | Text | 1 | Parsed from PDF text |
| 66 | Type | TypeOfIn | Choice/Text | 1 | Parsed from PDF text |
| 67 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 68 | Date received | DateRecv | Date/Text | 1 | Parsed from PDF text |
| 69 | Location | Location | Text | 1 | Parsed from PDF text |
| 70 | Measuring Range | MeasuringRange | Text | 1 | Parsed from PDF text |
| 71 | Tolerance | Tolerance | Text | 1 | Parsed from PDF text |
| 72 | Justification/ Remark | JustRem | Multiline Text | 1 | Parsed from PDF text |
| 73 | Attachments | Attch | Text | 1 | Parsed from PDF text |
| 74 | STANDARD NAME | STDName | Person/Text | 1 | Parsed from PDF text |
| 75 | STANDARD LOT # | STDLot | Text | 1 | Parsed from PDF text |
| 76 | DATE | STDExpDate | Date/Text | 1 | Parsed from PDF text |
| 77 | PREPARED BY | STDPreBy | Person/Text | 1 | Parsed from PDF text |
| 78 | Calibrated by (External calibration) | CalBy_1 | Number/Text | 1 | Parsed from PDF text |
| 79 | Date | RV_1 | Date/Text | 1 | Parsed from PDF text |
| 80 | INSTRUMENT TAG # | TagNo_1 | Text | 1 | Parsed from PDF text |
| 81 | STANDARD NAME | STDName_1 | Person/Text | 1 | Parsed from PDF text |
| 82 | STANDARD LOT # | STDLot_1 | Text | 1 | Parsed from PDF text |
| 83 | STANDARD EXP. DATE | STDExpDate_1 | Date/Text | 1 | Parsed from PDF text |
| 84 | BY | STDPreBy_1 | Text | 1 | Parsed from PDF text |
| 85 | Calibrated by (External calibration) | CalBy_2 | Number/Text | 1 | Parsed from PDF text |
| 86 | Date | RV_2 | Date/Text | 1 | Parsed from PDF text |
| 87 | INSTRUMENT TAG # | TagNo_2 | Text | 1 | Parsed from PDF text |
| 88 | Date | RV_3 | Date/Text | 1 | Parsed from PDF text |
| 89 | STANDARD LOT # | STDLot_2 | Text | 1 | Parsed from PDF text |
| 90 | STANDARD EXP. DATE | STDExpDate_2 | Date/Text | 1 | Parsed from PDF text |
| 91 | BY | STDPreBy_2 | Text | 1 | Parsed from PDF text |
| 92 | Calibrated by (External calibration) | CalBy_3 | Number/Text | 1 | Parsed from PDF text |
| 93 | INSTRUMENT TAG # | TagNo_3 | Text | 1 | Parsed from PDF text |
| 94 | STANDARD NAME | STDName_3 | Person/Text | 1 | Parsed from PDF text |
| 95 | STANDARD LOT # | STDLot_3 | Text | 1 | Parsed from PDF text |
| 96 | STANDARD EXP. DATE | STDExpDate_3 | Date/Text | 1 | Parsed from PDF text |
| 97 | BY | STDPreBy_3 | Text | 1 | Parsed from PDF text |
| 98 | Calibrated by (External calibration) | CalBy_4 | Number/Text | 1 | Parsed from PDF text |
| 99 | Date | RV_4 | Date/Text | 1 | Parsed from PDF text |
| 100 | INSTRUMENT TAG # | TagNo_4 | Text | 1 | Parsed from PDF text |
| 101 | STANDARD NAME | STDName_4 | Person/Text | 1 | Parsed from PDF text |
| 102 | STANDARD LOT # | STDLot_4 | Text | 1 | Parsed from PDF text |
| 103 | STANDARD EXP. DATE | STDExpDate_4 | Date/Text | 1 | Parsed from PDF text |
| 104 | STANDARD PREPARED | STDPreBy_4 | Person/Text | 1 | Parsed from PDF text |
| 105 | Date | RV_5 | Date/Text | 1 | Parsed from PDF text |
| 106 | Calibrated by (External calibration) | CalBy_5 | Number/Text | 1 | Parsed from PDF text |
| 107 | INSTRUMENT TAG # | TagNo_5 | Text | 1 | Parsed from PDF text |
| 108 | STANDARD NAME | STDName_5 | Person/Text | 1 | Parsed from PDF text |
| 109 | STANDARD LOT # | STDLot_5 | Text | 1 | Parsed from PDF text |
| 110 | STANDARD EXP. DATE | STDExpDate_5 | Date/Text | 1 | Parsed from PDF text |
| 111 | BY | STDPreBy_5 | Text | 1 | Parsed from PDF text |
| 112 | Calibrated by (External calibration) | CalBy_6 | Number/Text | 1 | Parsed from PDF text |
| 113 | Date | RV_6 | Date/Text | 1 | Parsed from PDF text |
| 114 | INSTRUMENT TAG # | TagNo_6 | Text | 1 | Parsed from PDF text |
| 115 | STANDARD NAME | STDName_6 | Person/Text | 1 | Parsed from PDF text |
| 116 | STANDARD LOT # | STDLot_6 | Text | 1 | Parsed from PDF text |
| 117 | STANDARD EXP. DATE | STDExpDate_6 | Date/Text | 1 | Parsed from PDF text |
| 118 | BY | STDPreBy_6 | Text | 1 | Parsed from PDF text |
| 119 | Date | RV_7 | Date/Text | 1 | Parsed from PDF text |
| 120 | Calibrated by (External calibration) | CalBy_7 | Number/Text | 1 | Parsed from PDF text |
| 121 | INSTRUMENT TAG # | TagNo_7 | Text | 1 | Parsed from PDF text |
| 122 | STANDARD NAME | STDName_7 | Person/Text | 1 | Parsed from PDF text |
| 123 | STANDARD LOT # | STDLot_7 | Text | 1 | Parsed from PDF text |
| 124 | STANDARD EXP. DATE | STDExpDate_7 | Date/Text | 1 | Parsed from PDF text |
| 125 | BY | STDPreBy_7 | Text | 1 | Parsed from PDF text |
| 126 | Calibrated by (External calibration) | CalBy_8 | Number/Text | 1 | Parsed from PDF text |
| 127 | Date | RV_8 | Date/Text | 1 | Parsed from PDF text |
| 128 | INSTRUMENT TAG # | TagNo_8 | Text | 1 | Parsed from PDF text |
| 129 | STANDARD NAME | STDName_8 | Person/Text | 1 | Parsed from PDF text |
| 130 | STANDARD LOT # | STDLot_8 | Text | 1 | Parsed from PDF text |
| 131 | STANDARD EXP. DATE | STDExpDate_8 | Date/Text | 1 | Parsed from PDF text |
| 132 | BY | STDPreBy_8 | Text | 1 | Parsed from PDF text |
| 133 | Calibrated by (External calibration) | CalBy_9 | Number/Text | 1 | Parsed from PDF text |
| 134 | Date | RV_9 | Date/Text | 1 | Parsed from PDF text |
| 135 | Oth_10 | TagNo_9 | Text | 1 | Parsed from PDF text |
| 136 | STANDARD NAME | STDName_9 | Person/Text | 1 | Parsed from PDF text |
| 137 | STANDARD LOT # | STDLot_9 | Text | 1 | Parsed from PDF text |
| 138 | STANDARD EXP. DATE | STDExpDate_9 | Date/Text | 1 | Parsed from PDF text |
| 139 | BY | STDPreBy_9 | Text | 1 | Parsed from PDF text |
| 140 | Calibrated by (External calibration) | CalBy_10 | Number/Text | 1 | Parsed from PDF text |
| 141 | Date | RV_10 | Date/Text | 1 | Parsed from PDF text |
| 142 | INSTRUMENT TAG # | TagNo_10 | Text | 1 | Parsed from PDF text |
| 143 | STANDARD NAME | STDName_10 | Person/Text | 1 | Parsed from PDF text |
| 144 | STANDARD LOT # | STDLot_10 | Text | 1 | Parsed from PDF text |
| 145 | STANDARD EXP. DATE | STDExpDate_10 | Date/Text | 1 | Parsed from PDF text |
| 146 | BY | STDPreBy_10 | Text | 1 | Parsed from PDF text |
| 147 | Calibrated by (External calibration) | CalBy_11 | Number/Text | 1 | Parsed from PDF text |
| 148 | Date | RV21 | Date/Text | 1 | Parsed from PDF text |
| 149 | INSTRUMENT TAG # | TagNo_11 | Text | 1 | Parsed from PDF text |
| 150 | STANDARD NAME | STDName_11 | Person/Text | 1 | Parsed from PDF text |
| 151 | STANDARD LOT # | STDLot_11 | Text | 1 | Parsed from PDF text |
| 152 | Date | RV22 | Date/Text | 1 | Parsed from PDF text |
| 153 | BY | STDPreBy_11 | Text | 1 | Parsed from PDF text |
| 154 | Calibrated by (External calibration) | CalBy_12 | Number/Text | 1 | Parsed from PDF text |
| 155 | INSTRUMENT TAG # | TagNo_12 | Text | 1 | Parsed from PDF text |
| 156 | STANDARD NAME | STDName_12 | Person/Text | 1 | Parsed from PDF text |
| 157 | STANDARD LOT # | STDLot_12 | Text | 1 | Parsed from PDF text |
| 158 | STANDARD EXP. DATE | STDExpDate_12 | Date/Text | 1 | Parsed from PDF text |
| 159 | BY | STDPreBy_12 | Text | 1 | Parsed from PDF text |
| 160 | Calibrated by (External calibration) | CalBy_13 | Number/Text | 1 | Parsed from PDF text |
| 161 | Date | RV23 | Date/Text | 1 | Parsed from PDF text |
| 162 | INSTRUMENT TAG # | TagNo_13 | Text | 1 | Parsed from PDF text |
| 163 | STANDARD NAME | STDName_13 | Person/Text | 1 | Parsed from PDF text |
| 164 | STANDARD LOT # | STDLot_13 | Text | 1 | Parsed from PDF text |
| 165 | STANDARD EXP. DATE | STDExpDate_13 | Date/Text | 1 | Parsed from PDF text |
| 166 | BY | STDPreBy_13 | Text | 1 | Parsed from PDF text |
| 167 | Date | RV24 | Date/Text | 1 | Parsed from PDF text |
| 168 | Calibrated by (External calibration) | CalBy_14 | Number/Text | 1 | Parsed from PDF text |
| 169 | INSTRUMENT TAG # | TagNo_14 | Text | 1 | Parsed from PDF text |
| 170 | STANDARD NAME | STDName_14 | Person/Text | 1 | Parsed from PDF text |
| 171 | STANDARD LOT # | STDLot_14 | Text | 1 | Parsed from PDF text |
| 172 | STANDARD EXP. DATE | STDExpDate_14 | Date/Text | 1 | Parsed from PDF text |
| 173 | BY | STDPreBy_14 | Text | 1 | Parsed from PDF text |
| 174 | Calibrated by (External calibration) | CalBy15 | Number/Text | 1 | Parsed from PDF text |
| 175 | Date | RV25 | Date/Text | 1 | Parsed from PDF text |
| 176 | INSTRUMENT TAG # | TagNo_16 | Text | 1 | Parsed from PDF text |
| 177 | STANDARD NAME | STDName_16 | Person/Text | 1 | Parsed from PDF text |
| 178 | STANDARD LOT # | STDLot_16 | Text | 1 | Parsed from PDF text |
| 179 | STANDARD EXP. DATE | STDExpDate_16 | Date/Text | 1 | Parsed from PDF text |
| 180 | BY | STDPreBy_16 | Text | 1 | Parsed from PDF text |
| 181 | Calibrated by (External calibration) | CalBy16 | Number/Text | 1 | Parsed from PDF text |
| 182 | Date | RV26 | Date/Text | 1 | Parsed from PDF text |
| 183 | INSTRUMENT TAG # | TagNo_17 | Text | 1 | Parsed from PDF text |
| 184 | STANDARD NAME | STDName_17 | Person/Text | 1 | Parsed from PDF text |
| 185 | STANDARD LOT # | STDLot_17 | Text | 1 | Parsed from PDF text |
| 186 | STANDARD EXP. DATE | STDExpDate_17 | Date/Text | 1 | Parsed from PDF text |
| 187 | BY | STDPreBy_17 | Text | 1 | Parsed from PDF text |
| 188 | Calibrated by (External calibration) | CalBy17 | Number/Text | 1 | Parsed from PDF text |
| 189 | Date | RV27 | Date/Text | 1 | Parsed from PDF text |
| 190 | INSTRUMENT TAG # | TagNo_18 | Text | 1 | Parsed from PDF text |
| 191 | STANDARD NAME | STDName_18 | Person/Text | 1 | Parsed from PDF text |
| 192 | STANDARD LOT # | STDLot_18 | Text | 1 | Parsed from PDF text |
| 193 | STANDARD EXP. DATE | STDExpDate_18 | Date/Text | 1 | Parsed from PDF text |
| 194 | BY | STDPreBy_18 | Text | 1 | Parsed from PDF text |
| 195 | Calibrated by (External calibration) | CalBy18 | Number/Text | 1 | Parsed from PDF text |
| 196 | Date | RV28 | Date/Text | 1 | Parsed from PDF text |
| 197 | INSTRUMENT TAG # | TagNo_19 | Text | 1 | Parsed from PDF text |
| 198 | STANDARD NAME | STDName_19 | Person/Text | 1 | Parsed from PDF text |
| 199 | Date | RV29 | Date/Text | 1 | Parsed from PDF text |
| 200 | STANDARD EXP. DATE | STDExpDate_19 | Date/Text | 1 | Parsed from PDF text |
| 201 | BY | STDPreBy_19 | Text | 1 | Parsed from PDF text |
| 202 | Calibrated by (External calibration) | CalBy19 | Number/Text | 1 | Parsed from PDF text |
| 203 | INSTRUMENT TAG # | TagNo_20 | Text | 1 | Parsed from PDF text |
| 204 | STANDARD NAME | STDName_20 | Person/Text | 1 | Parsed from PDF text |
| 205 | STANDARD LOT # | STDLot_20 | Text | 1 | Parsed from PDF text |
| 206 | STANDARD EXP. DATE | STDExpDate_20 | Date/Text | 1 | Parsed from PDF text |
| 207 | BY | STDPreBy_20 | Text | 1 | Parsed from PDF text |
| 208 | Calibrated by (External calibration) | CalBy20 | Number/Text | 1 | Parsed from PDF text |
| 209 | Date | RV30 | Date/Text | 1 | Parsed from PDF text |
| 210 | INSTRUMENT TAG # | TagNo_21 | Text | 1 | Parsed from PDF text |
| 211 | STANDARD NAME | STDName_21 | Person/Text | 1 | Parsed from PDF text |
| 212 | STANDARD LOT # | STDLot_21 | Text | 1 | Parsed from PDF text |
| 213 | STANDARD EXP. DATE | STDExpDate_21 | Date/Text | 1 | Parsed from PDF text |
| 214 | BY | STDPreBy_21 | Text | 1 | Parsed from PDF text |
| 215 | Date | RV31 | Date/Text | 1 | Parsed from PDF text |
| 216 | Calibrated by (External calibration) | CalBy21 | Number/Text | 1 | Parsed from PDF text |
| 217 | INSTRUMENT TAG # | TagNo_22 | Text | 1 | Parsed from PDF text |
| 218 | STANDARD NAME | STDName_22 | Person/Text | 1 | Parsed from PDF text |
| 219 | STANDARD LOT # | STDLot_22 | Text | 1 | Parsed from PDF text |
| 220 | STANDARD EXP. DATE | STDExpDate_22 | Date/Text | 1 | Parsed from PDF text |
| 221 | BY | STDPreBy_22 | Text | 1 | Parsed from PDF text |
| 222 | Calibrated by (External calibration) | CalBy22 | Number/Text | 1 | Parsed from PDF text |
| 223 | Date | RV32 | Date/Text | 1 | Parsed from PDF text |
| 224 | INSTRUMENT TAG # | TagNo_23 | Text | 1 | Parsed from PDF text |
| 225 | STANDARD NAME | STDName_23 | Person/Text | 1 | Parsed from PDF text |
| 226 | STANDARD LOT # | STDLot_23 | Text | 1 | Parsed from PDF text |
| 227 | STANDARD EXP. DATE | STDExpDate_23 | Date/Text | 1 | Parsed from PDF text |
| 228 | BY | STDPreBy_23 | Text | 1 | Parsed from PDF text |
| 229 | Calibrated by (External calibration) | CalBy23 | Number/Text | 1 | Parsed from PDF text |
| 230 | Date | RV33 | Date/Text | 1 | Parsed from PDF text |
| 231 | INSTRUMENT TAG # | TagNo_24 | Text | 1 | Parsed from PDF text |
| 232 | STANDARD NAME | STDName_24 | Person/Text | 1 | Parsed from PDF text |
| 233 | STANDARD LOT # | STDLot_24 | Text | 1 | Parsed from PDF text |
| 234 | STANDARD EXP. DATE | STDExpDate_24 | Date/Text | 1 | Parsed from PDF text |
| 235 | BY | STDPreBy_24 | Text | 1 | Parsed from PDF text |
| 236 | Calibrated by (External calibration) | CalBy24 | Number/Text | 1 | Parsed from PDF text |
| 237 | Date | RV34 | Date/Text | 1 | Parsed from PDF text |
| 238 | INSTRUMENT TAG # | TagNo_25 | Text | 1 | Parsed from PDF text |
| 239 | STANDARD NAME | STDName_25 | Person/Text | 1 | Parsed from PDF text |
| 240 | STANDARD LOT # | STDLot_25 | Text | 1 | Parsed from PDF text |
| 241 | STANDARD EXP. DATE | STDExpDate_25 | Date/Text | 1 | Parsed from PDF text |
| 242 | BY | STDPreBy_25 | Text | 1 | Parsed from PDF text |
| 243 | Calibrated by (External calibration) | CalBy25 | Number/Text | 1 | Parsed from PDF text |
| 244 | Date | RV35 | Date/Text | 1 | Parsed from PDF text |
| 245 | INSTRUMENT TAG # | TagNo_26 | Text | 1 | Parsed from PDF text |
| 246 | STANDARD NAME | STDName_26 | Person/Text | 1 | Parsed from PDF text |
| 247 | Date | RV36 | Date/Text | 1 | Parsed from PDF text |
| 248 | STANDARD LOT # | STDLot_26 | Text | 1 | Parsed from PDF text |
| 249 | STANDARD EXP. DATE | STDExpDate_26 | Date/Text | 1 | Parsed from PDF text |
| 250 | BY | STDPreBy_26 | Text | 1 | Parsed from PDF text |
| 251 | Calibrated by (External calibration) | CalBy26 | Number/Text | 1 | Parsed from PDF text |
| 252 | INSTRUMENT TAG # | TagNo_27 | Text | 1 | Parsed from PDF text |
| 253 | STANDARD NAME | STDName_27 | Person/Text | 1 | Parsed from PDF text |
| 254 | STANDARD LOT # | STDLot_27 | Text | 1 | Parsed from PDF text |
| 255 | STANDARD EXP. DATE | STDExpDate_27 | Date/Text | 1 | Parsed from PDF text |
| 256 | BY | STDPreBy_27 | Text | 1 | Parsed from PDF text |
| 257 | Calibrated by (External calibration) | CalBy27 | Number/Text | 1 | Parsed from PDF text |
| 258 | Date | RV37 | Date/Text | 1 | Parsed from PDF text |
| 259 | INSTRUMENT TAG # | TagNo_28 | Text | 1 | Parsed from PDF text |
| 260 | STANDARD NAME | STDName_28 | Person/Text | 1 | Parsed from PDF text |
| 261 | STANDARD LOT # | STDLot_28 | Text | 1 | Parsed from PDF text |
| 262 | STANDARD EXP. DATE | STDExpDate_28 | Date/Text | 1 | Parsed from PDF text |
| 263 | BY | STDPreBy_28 | Text | 1 | Parsed from PDF text |
| 264 | Date | RV38 | Date/Text | 1 | Parsed from PDF text |
| 265 | Calibrated by (External calibration) | CalBy28 | Number/Text | 1 | Parsed from PDF text |
| 266 | INSTRUMENT TAG # | TagNo_29 | Text | 1 | Parsed from PDF text |
| 267 | STANDARD NAME | STDName_29 | Person/Text | 1 | Parsed from PDF text |
| 268 | STANDARD LOT # | STDLot_29 | Text | 1 | Parsed from PDF text |
| 269 | STANDARD EXP. DATE | STDExpDate_29 | Date/Text | 1 | Parsed from PDF text |
| 270 | BY | STDPreBy_29 | Text | 1 | Parsed from PDF text |
| 271 | Calibrated by (External calibration) | CalBy29 | Number/Text | 1 | Parsed from PDF text |
| 272 | Date | RV39 | Date/Text | 1 | Parsed from PDF text |
| 273 | INSTRUMENT TAG # | TagNo_30 | Text | 1 | Parsed from PDF text |
| 274 | STANDARD NAME | STDName_30 | Person/Text | 1 | Parsed from PDF text |
| 275 | STANDARD LOT # | STDLot_30 | Text | 1 | Parsed from PDF text |
| 276 | STANDARD EXP. DATE | STDExpDate_30 | Date/Text | 1 | Parsed from PDF text |
| 277 | BY | STDPreBy_30 | Text | 1 | Parsed from PDF text |
| 278 | Calibrated by (External calibration) | CalBy30 | Number/Text | 1 | Parsed from PDF text |
| 279 | Date | RV40 | Date/Text | 1 | Parsed from PDF text |
| 280 | INSTRUMENT TAG # | TagNo_31 | Text | 1 | Parsed from PDF text |
| 281 | STANDARD NAME | STDName_31 | Person/Text | 1 | Parsed from PDF text |
| 282 | STANDARD LOT # | STDLot_31 | Text | 1 | Parsed from PDF text |
| 283 | STANDARD EXP. DATE | STDExpDate_31 | Date/Text | 1 | Parsed from PDF text |
| 284 | BY | STDPreBy_31 | Text | 1 | Parsed from PDF text |
| 285 | Calibrated by (External calibration) | CalBy31 | Number/Text | 1 | Parsed from PDF text |
| 286 | Date | RV41 | Date/Text | 1 | Parsed from PDF text |
| 287 | INSTRUMENT TAG # | TagNo_32 | Text | 1 | Parsed from PDF text |
| 288 | STANDARD NAME | STDName_32 | Person/Text | 1 | Parsed from PDF text |
| 289 | STANDARD LOT # | STDLot_32 | Text | 1 | Parsed from PDF text |
| 290 | STANDARD EXP. DATE | STDExpDate_32 | Date/Text | 1 | Parsed from PDF text |
| 291 | BY | STDPreBy_32 | Text | 1 | Parsed from PDF text |
| 292 | Calibrated by (External calibration) | CalBy32 | Number/Text | 1 | Parsed from PDF text |
| 293 | Date | RV42 | Date/Text | 1 | Parsed from PDF text |
| 294 | INSTRUMENT TAG # | TagNo_33 | Text | 1 | Parsed from PDF text |
| 295 | STANDARD NAME | STDName_33 | Person/Text | 1 | Parsed from PDF text |
| 296 | STANDARD LOT # | STDLot_33 | Text | 1 | Parsed from PDF text |
| 297 | STANDARD EXP. DATE | STDExpDate_33 | Date/Text | 1 | Parsed from PDF text |
| 298 | BY | STDPreBy_33 | Text | 1 | Parsed from PDF text |
| 299 | Calibrated by (External calibration) | CalBy33 | Number/Text | 1 | Parsed from PDF text |
| 300 | Date | RV43 | Date/Text | 1 | Parsed from PDF text |
| 301 | INSTRUMENT TAG # | TagNo_34 | Text | 1 | Parsed from PDF text |
| 302 | STANDARD NAME | STDName_34 | Person/Text | 1 | Parsed from PDF text |
| 303 | STANDARD LOT # | STDLot_34 | Text | 1 | Parsed from PDF text |
| 304 | STANDARD EXP. DATE | STDExpDate_34 | Date/Text | 1 | Parsed from PDF text |
| 305 | BY | STDPreBy_34 | Text | 1 | Parsed from PDF text |
| 306 | Calibrated by (External calibration) | CalBy34 | Number/Text | 1 | Parsed from PDF text |
| 307 | Date | RV44 | Date/Text | 1 | Parsed from PDF text |
| 308 | INSTRUMENT TAG # | TagNo_35 | Text | 1 | Parsed from PDF text |
| 309 | STANDARD NAME | STDName_35 | Person/Text | 1 | Parsed from PDF text |
| 310 | STANDARD LOT # | STDLot_35 | Text | 1 | Parsed from PDF text |
| 311 | STANDARD EXP. DATE | STDExpDate_35 | Date/Text | 1 | Parsed from PDF text |
| 312 | BY | STDPreBy_35 | Text | 1 | Parsed from PDF text |
| 313 | Calibrated by (External calibration) | CalBy35 | Number/Text | 1 | Parsed from PDF text |
| 314 | Date | RV45 | Date/Text | 1 | Parsed from PDF text |
| 315 | INSTRUMENT TAG # | TagNo_36 | Text | 1 | Parsed from PDF text |
| 316 | STANDARD NAME | STDName_36 | Person/Text | 1 | Parsed from PDF text |
| 317 | STANDARD LOT # | STDLot_36 | Text | 1 | Parsed from PDF text |
| 318 | STANDARD EXP. DATE | STDExpDate_36 | Date/Text | 1 | Parsed from PDF text |
| 319 | BY | STDPreBy_36 | Text | 1 | Parsed from PDF text |
| 320 | Date | RV46 | Date/Text | 1 | Parsed from PDF text |
| 321 | Calibrated by (External calibration) | CalBy36 | Number/Text | 1 | Parsed from PDF text |
| 322 | INSTRUMENT TAG # | TagNo_37 | Text | 1 | Parsed from PDF text |
| 323 | STANDARD NAME | STDName_37 | Person/Text | 1 | Parsed from PDF text |
| 324 | STANDARD LOT # | STDLot_37 | Text | 1 | Parsed from PDF text |
| 325 | STANDARD EXP. DATE | STDExpDate_37 | Date/Text | 1 | Parsed from PDF text |
| 326 | BY | STDPreBy_37 | Text | 1 | Parsed from PDF text |
| 327 | Calibrated by (External calibration) | CalBy37 | Number/Text | 1 | Parsed from PDF text |
| 328 | Date | RV47 | Date/Text | 1 | Parsed from PDF text |
| 329 | INSTRUMENT TAG # | TagNo_38 | Text | 1 | Parsed from PDF text |
| 330 | STANDARD NAME | STDName_38 | Person/Text | 1 | Parsed from PDF text |
| 331 | STANDARD LOT # | STDLot_38 | Text | 1 | Parsed from PDF text |
| 332 | STANDARD EXP. DATE | STDExpDate_38 | Date/Text | 1 | Parsed from PDF text |
| 333 | BY | STDPreBy_38 | Text | 1 | Parsed from PDF text |
| 334 | Calibrated by (External calibration) | CalBy38 | Number/Text | 1 | Parsed from PDF text |
| 335 | Date | RV48 | Date/Text | 1 | Parsed from PDF text |
| 336 | INSTRUMENT TAG # | TagNo_39 | Text | 1 | Parsed from PDF text |
| 337 | STANDARD NAME | STDName_39 | Person/Text | 1 | Parsed from PDF text |
| 338 | STANDARD LOT # | STDLot_39 | Text | 1 | Parsed from PDF text |
| 339 | STANDARD EXP. DATE | STDExpDate_39 | Date/Text | 1 | Parsed from PDF text |
| 340 | BY | STDPreBy_39 | Text | 1 | Parsed from PDF text |
| 341 | Date | RV49 | Date/Text | 1 | Parsed from PDF text |
| 342 | Calibrated by (External calibration) | CalBy39 | Number/Text | 1 | Parsed from PDF text |
| 343 | INSTRUMENT TAG # | TagNo_40 | Text | 1 | Parsed from PDF text |
| 344 | STANDARD NAME | STDName_40 | Person/Text | 1 | Parsed from PDF text |
| 345 | STANDARD LOT # | STDLot_40 | Text | 1 | Parsed from PDF text |
| 346 | STANDARD EXP. DATE | STDExpDate_40 | Date/Text | 1 | Parsed from PDF text |
| 347 | BY | STDPreBy_40 | Text | 1 | Parsed from PDF text |
| 348 | Calibrated by (External calibration) | CalBy40 | Number/Text | 1 | Parsed from PDF text |
| 349 | Date | RV50 | Date/Text | 1 | Parsed from PDF text |
| 350 | INSTRUMENT TAG # | TagNo_41 | Text | 1 | Parsed from PDF text |
| 351 | STANDARD NAME | STDName_41 | Person/Text | 1 | Parsed from PDF text |
| 352 | STANDARD LOT # | STDLot_41 | Text | 1 | Parsed from PDF text |
| 353 | STANDARD EXP. DATE | STDExpDate_41 | Date/Text | 1 | Parsed from PDF text |
| 354 | BY | STDPreBy_41 | Text | 1 | Parsed from PDF text |
| 355 | Calibrated by (External calibration) | CalBy41 | Number/Text | 1 | Parsed from PDF text |
| 356 | Date | RV51 | Date/Text | 1 | Parsed from PDF text |
| 357 | INSTRUMENT TAG # | TagNo_42 | Text | 1 | Parsed from PDF text |
| 358 | STANDARD NAME | STDName_42 | Person/Text | 1 | Parsed from PDF text |
| 359 | STANDARD LOT # | STDLot_42 | Text | 1 | Parsed from PDF text |
| 360 | STANDARD EXP. DATE | STDExpDate_42 | Date/Text | 1 | Parsed from PDF text |
| 361 | BY | STDPreBy_42 | Text | 1 | Parsed from PDF text |
| 362 | Date | RV52 | Date/Text | 1 | Parsed from PDF text |
| 363 | Calibrated by (External calibration) | CalBy42 | Number/Text | 1 | Parsed from PDF text |
| 364 | INSTRUMENT TAG # | TagNo_43 | Text | 1 | Parsed from PDF text |
| 365 | STANDARD NAME | STDName_43 | Person/Text | 1 | Parsed from PDF text |
| 366 | STANDARD LOT # | STDLot_43 | Text | 1 | Parsed from PDF text |
| 367 | STANDARD EXP. DATE | STDExpDate_43 | Date/Text | 1 | Parsed from PDF text |
| 368 | BY | STDPreBy_43 | Text | 1 | Parsed from PDF text |
| 369 | Calibrated by (External calibration) | CalBy43 | Number/Text | 1 | Parsed from PDF text |
| 370 | Date | RV53 | Date/Text | 1 | Parsed from PDF text |
| 371 | INSTRUMENT TAG # | TagNo_44 | Text | 1 | Parsed from PDF text |
| 372 | STANDARD NAME | STDName_44 | Person/Text | 1 | Parsed from PDF text |
| 373 | STANDARD LOT # | STDLot_44 | Text | 1 | Parsed from PDF text |
| 374 | STANDARD EXP. DATE | STDExpDate_44 | Date/Text | 1 | Parsed from PDF text |
| 375 | BY | STDPreBy_44 | Text | 1 | Parsed from PDF text |
| 376 | Calibrated by (External calibration) | CalBy44 | Number/Text | 1 | Parsed from PDF text |
| 377 | Date | RV54 | Date/Text | 1 | Parsed from PDF text |
| 378 | INSTRUMENT TAG # | TagNo_45 | Text | 1 | Parsed from PDF text |
| 379 | STANDARD NAME | STDName_45 | Person/Text | 1 | Parsed from PDF text |
| 380 | STANDARD LOT # | STDLot_45 | Text | 1 | Parsed from PDF text |
| 381 | STANDARD EXP. DATE | STDExpDate_45 | Date/Text | 1 | Parsed from PDF text |
| 382 | Date | RV55 | Date/Text | 1 | Parsed from PDF text |
| 383 | BY | STDPreBy_45 | Text | 1 | Parsed from PDF text |
| 384 | Calibrated by (External calibration) | CalBy45 | Number/Text | 1 | Parsed from PDF text |
| 385 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 386 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 387 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 388 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 389 | DB Admin | DBA | Text | 1 | Parsed from PDF text |
| 390 | QC List | QCList | Text | 1 | Parsed from PDF text |
| 391 | QC manager | QCHOD | Person/Text | 1 | Parsed from PDF text |
| 392 | Next Cal Date | NextCal | Date/Text | 1 | Parsed from PDF text |
| 393 | Reminder To | RemTo | Text | 1 | Parsed from PDF text |
| 394 | Reviewer | SendTo | Date/Text | 1 | Parsed from PDF text |
| 395 | IT | IT | Text | 1 | Parsed from PDF text |
| 396 | Status List | StatusList | Choice/Text | 1 | Parsed from PDF text |
| 397 | Source of Improvement | Masterlist | Text | 1 | Parsed from PDF text |
| 398 | Title of the Improvement | DisplayTitle | Text | 1 | Parsed from PDF text |
| 399 | CC | CC | Text | 1 | Parsed from PDF text |
| 400 | CurrentAction | CurrentAction | Text | 1 | Parsed from PDF text |
| 401 | Editor for Request section | AEditor1 | Text | 1 | Parsed from PDF text |
| 402 | QA Default Mailing List | DefMail | Text | 1 | Parsed from PDF text |
| 403 | PCN Quality Council | QualityCouncil | Text | 1 | Parsed from PDF text |
| 404 | Default CC List | Defcc | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | reviewed (48), verified (45), status (16), approval (9), review (4), submitted (3), approved (3), rejected (3) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `IQMSLTM`
Child-list recommendation: `MainDB_QA_Ext_IQMSLTM_Rows` candidate for repeating row fields

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
| MASTER-091-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-091-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-091-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 5 |
| Parsed Field Count | 404 |
| Workflow Signal Count | 137 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
