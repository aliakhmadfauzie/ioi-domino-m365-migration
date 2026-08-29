# Master App PDF Source - Pancen - IQMS-PQP

> Master row: 93 | Site: Johor | Owner: QA | Generated: 2026-06-02
> Classification: Extracted - Needs Review

## 1. Basic Information

| Attribute | Value | Confidence |
| --- | --- | --- |
| Master Index | 93 | Clearly Found |
| Site | Johor | Clearly Found |
| Application Name | Pancen - IQMS-PQP | Clearly Found |
| Owner | QA | Clearly Found |
| Department | QA \| QC \| PCNSVR | Source inventory |
| Form List | Pancen - IQMS-PQP | Source inventory |
| Blueprint Department | - | Source inventory |
| Blueprint Code | IQMSPQP | Source inventory or inferred |
| Build Readiness | blocked_missing_source | Source inventory |
| Overall Source Status | pdf_only_or_unmapped | Source inventory |

## 2. PDF Evidence

| PDF Path | Source Kind | Match Method | Score | Confidence | Pages | Text Chars | Field Candidates | Workflow Signals | Title / Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/018_oleObject122.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 4 | 2591 | 33 | 13 | Page 1 of 4 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/027_oleObject190.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 1.200 | Embedded metadata fallback needs review | 20 | 18979 | 345 | 96 | MASTERLIST OF LAB EQUIPMENTS |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QA/037_oleObject141.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 5688 | 33 | 6 | Page 1 of 8 |
| source/Project Iventories/extracted-embedded-pdfs/Johor/QC/035_oleObject198.pdf | Extracted embedded PDF | embedded_pdf_meta_title_fallback | 0.700 | Embedded metadata fallback needs review | 8 | 5688 | 33 | 6 | Page 1 of 8 |

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
| 10 | Masterlist Of Lab Equipments | Inferred from PDF text | Needs Human Confirmation |
| 11 | Part B: Instrument History Card | Inferred from PDF text | Needs Human Confirmation |
| 12 | Internal Verification | Inferred from PDF text | Needs Human Confirmation |

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
| 34 | Company | Company | Text | 1 | Parsed from PDF text |
| 35 | Calibration | Calibration | Text | 1 | Parsed from PDF text |
| 36 | Instrument Type | InsType | Choice/Text | 1 | Parsed from PDF text |
| 37 | External Calibration | ExtCal | Text | 1 | Parsed from PDF text |
| 38 | Frequency | Frequency_1 | Text | 1 | Parsed from PDF text |
| 39 | Internal Verification | IntStand | Text | 1 | Parsed from PDF text |
| 40 | Frequency | Frequency_2 | Text | 1 | Parsed from PDF text |
| 41 | Preventive Maintenance | PrevMant | Text | 1 | Parsed from PDF text |
| 42 | Frequency | Frequency_3 | Text | 1 | Parsed from PDF text |
| 43 | Instrument Tag | InstTag | Text | 1 | Parsed from PDF text |
| 44 | Brand/Manufacturer | BrandMant | Text | 1 | Parsed from PDF text |
| 45 | Model | Model | Text | 1 | Parsed from PDF text |
| 46 | Serial No | SerialNo | Text | 1 | Parsed from PDF text |
| 47 | Type | TypeOfIn | Choice/Text | 1 | Parsed from PDF text |
| 48 | Supplier | Supplier | Text | 1 | Parsed from PDF text |
| 49 | Date received | DateRecv | Date/Text | 1 | Parsed from PDF text |
| 50 | Location | Location | Text | 1 | Parsed from PDF text |
| 51 | Measuring Range | MeasuringRange | Text | 1 | Parsed from PDF text |
| 52 | Tolerance | Tolerance | Text | 1 | Parsed from PDF text |
| 53 | Justification/ Remark | JustRem | Multiline Text | 1 | Parsed from PDF text |
| 54 | Attachments | Attch | Text | 1 | Parsed from PDF text |
| 55 | STANDARD NAME | STDName | Person/Text | 1 | Parsed from PDF text |
| 56 | STANDARD LOT # | STDLot | Text | 1 | Parsed from PDF text |
| 57 | DATE | STDExpDate | Date/Text | 1 | Parsed from PDF text |
| 58 | PREPARED BY | STDPreBy | Person/Text | 1 | Parsed from PDF text |
| 59 | Calibrated by (External calibration) | CalBy_1 | Number/Text | 1 | Parsed from PDF text |
| 60 | Date | RV_1 | Date/Text | 1 | Parsed from PDF text |
| 61 | INSTRUMENT TAG # | TagNo_1 | Text | 1 | Parsed from PDF text |
| 62 | STANDARD NAME | STDName_1 | Person/Text | 1 | Parsed from PDF text |
| 63 | STANDARD LOT # | STDLot_1 | Text | 1 | Parsed from PDF text |
| 64 | STANDARD EXP. DATE | STDExpDate_1 | Date/Text | 1 | Parsed from PDF text |
| 65 | BY | STDPreBy_1 | Text | 1 | Parsed from PDF text |
| 66 | Calibrated by (External calibration) | CalBy_2 | Number/Text | 1 | Parsed from PDF text |
| 67 | Date | RV_2 | Date/Text | 1 | Parsed from PDF text |
| 68 | INSTRUMENT TAG # | TagNo_2 | Text | 1 | Parsed from PDF text |
| 69 | Date | RV_3 | Date/Text | 1 | Parsed from PDF text |
| 70 | STANDARD LOT # | STDLot_2 | Text | 1 | Parsed from PDF text |
| 71 | STANDARD EXP. DATE | STDExpDate_2 | Date/Text | 1 | Parsed from PDF text |
| 72 | BY | STDPreBy_2 | Text | 1 | Parsed from PDF text |
| 73 | Calibrated by (External calibration) | CalBy_3 | Number/Text | 1 | Parsed from PDF text |
| 74 | INSTRUMENT TAG # | TagNo_3 | Text | 1 | Parsed from PDF text |
| 75 | STANDARD NAME | STDName_3 | Person/Text | 1 | Parsed from PDF text |
| 76 | STANDARD LOT # | STDLot_3 | Text | 1 | Parsed from PDF text |
| 77 | STANDARD EXP. DATE | STDExpDate_3 | Date/Text | 1 | Parsed from PDF text |
| 78 | BY | STDPreBy_3 | Text | 1 | Parsed from PDF text |
| 79 | Calibrated by (External calibration) | CalBy_4 | Number/Text | 1 | Parsed from PDF text |
| 80 | Date | RV_4 | Date/Text | 1 | Parsed from PDF text |
| 81 | INSTRUMENT TAG # | TagNo_4 | Text | 1 | Parsed from PDF text |
| 82 | STANDARD NAME | STDName_4 | Person/Text | 1 | Parsed from PDF text |
| 83 | STANDARD LOT # | STDLot_4 | Text | 1 | Parsed from PDF text |
| 84 | STANDARD EXP. DATE | STDExpDate_4 | Date/Text | 1 | Parsed from PDF text |
| 85 | STANDARD PREPARED | STDPreBy_4 | Person/Text | 1 | Parsed from PDF text |
| 86 | Date | RV_5 | Date/Text | 1 | Parsed from PDF text |
| 87 | Calibrated by (External calibration) | CalBy_5 | Number/Text | 1 | Parsed from PDF text |
| 88 | INSTRUMENT TAG # | TagNo_5 | Text | 1 | Parsed from PDF text |
| 89 | STANDARD NAME | STDName_5 | Person/Text | 1 | Parsed from PDF text |
| 90 | STANDARD LOT # | STDLot_5 | Text | 1 | Parsed from PDF text |
| 91 | STANDARD EXP. DATE | STDExpDate_5 | Date/Text | 1 | Parsed from PDF text |
| 92 | BY | STDPreBy_5 | Text | 1 | Parsed from PDF text |
| 93 | Calibrated by (External calibration) | CalBy_6 | Number/Text | 1 | Parsed from PDF text |
| 94 | Date | RV_6 | Date/Text | 1 | Parsed from PDF text |
| 95 | INSTRUMENT TAG # | TagNo_6 | Text | 1 | Parsed from PDF text |
| 96 | STANDARD NAME | STDName_6 | Person/Text | 1 | Parsed from PDF text |
| 97 | STANDARD LOT # | STDLot_6 | Text | 1 | Parsed from PDF text |
| 98 | STANDARD EXP. DATE | STDExpDate_6 | Date/Text | 1 | Parsed from PDF text |
| 99 | BY | STDPreBy_6 | Text | 1 | Parsed from PDF text |
| 100 | Date | RV_7 | Date/Text | 1 | Parsed from PDF text |
| 101 | Calibrated by (External calibration) | CalBy_7 | Number/Text | 1 | Parsed from PDF text |
| 102 | INSTRUMENT TAG # | TagNo_7 | Text | 1 | Parsed from PDF text |
| 103 | STANDARD NAME | STDName_7 | Person/Text | 1 | Parsed from PDF text |
| 104 | STANDARD LOT # | STDLot_7 | Text | 1 | Parsed from PDF text |
| 105 | STANDARD EXP. DATE | STDExpDate_7 | Date/Text | 1 | Parsed from PDF text |
| 106 | BY | STDPreBy_7 | Text | 1 | Parsed from PDF text |
| 107 | Calibrated by (External calibration) | CalBy_8 | Number/Text | 1 | Parsed from PDF text |
| 108 | Date | RV_8 | Date/Text | 1 | Parsed from PDF text |
| 109 | INSTRUMENT TAG # | TagNo_8 | Text | 1 | Parsed from PDF text |
| 110 | STANDARD NAME | STDName_8 | Person/Text | 1 | Parsed from PDF text |
| 111 | STANDARD LOT # | STDLot_8 | Text | 1 | Parsed from PDF text |
| 112 | STANDARD EXP. DATE | STDExpDate_8 | Date/Text | 1 | Parsed from PDF text |
| 113 | BY | STDPreBy_8 | Text | 1 | Parsed from PDF text |
| 114 | Calibrated by (External calibration) | CalBy_9 | Number/Text | 1 | Parsed from PDF text |
| 115 | Date | RV_9 | Date/Text | 1 | Parsed from PDF text |
| 116 | Oth_10 | TagNo_9 | Text | 1 | Parsed from PDF text |
| 117 | STANDARD NAME | STDName_9 | Person/Text | 1 | Parsed from PDF text |
| 118 | STANDARD LOT # | STDLot_9 | Text | 1 | Parsed from PDF text |
| 119 | STANDARD EXP. DATE | STDExpDate_9 | Date/Text | 1 | Parsed from PDF text |
| 120 | BY | STDPreBy_9 | Text | 1 | Parsed from PDF text |
| 121 | Calibrated by (External calibration) | CalBy_10 | Number/Text | 1 | Parsed from PDF text |
| 122 | Date | RV_10 | Date/Text | 1 | Parsed from PDF text |
| 123 | INSTRUMENT TAG # | TagNo_10 | Text | 1 | Parsed from PDF text |
| 124 | STANDARD NAME | STDName_10 | Person/Text | 1 | Parsed from PDF text |
| 125 | STANDARD LOT # | STDLot_10 | Text | 1 | Parsed from PDF text |
| 126 | STANDARD EXP. DATE | STDExpDate_10 | Date/Text | 1 | Parsed from PDF text |
| 127 | BY | STDPreBy_10 | Text | 1 | Parsed from PDF text |
| 128 | Calibrated by (External calibration) | CalBy_11 | Number/Text | 1 | Parsed from PDF text |
| 129 | Date | RV21 | Date/Text | 1 | Parsed from PDF text |
| 130 | INSTRUMENT TAG # | TagNo_11 | Text | 1 | Parsed from PDF text |
| 131 | STANDARD NAME | STDName_11 | Person/Text | 1 | Parsed from PDF text |
| 132 | STANDARD LOT # | STDLot_11 | Text | 1 | Parsed from PDF text |
| 133 | Date | RV22 | Date/Text | 1 | Parsed from PDF text |
| 134 | BY | STDPreBy_11 | Text | 1 | Parsed from PDF text |
| 135 | Calibrated by (External calibration) | CalBy_12 | Number/Text | 1 | Parsed from PDF text |
| 136 | INSTRUMENT TAG # | TagNo_12 | Text | 1 | Parsed from PDF text |
| 137 | STANDARD NAME | STDName_12 | Person/Text | 1 | Parsed from PDF text |
| 138 | STANDARD LOT # | STDLot_12 | Text | 1 | Parsed from PDF text |
| 139 | STANDARD EXP. DATE | STDExpDate_12 | Date/Text | 1 | Parsed from PDF text |
| 140 | BY | STDPreBy_12 | Text | 1 | Parsed from PDF text |
| 141 | Calibrated by (External calibration) | CalBy_13 | Number/Text | 1 | Parsed from PDF text |
| 142 | Date | RV23 | Date/Text | 1 | Parsed from PDF text |
| 143 | INSTRUMENT TAG # | TagNo_13 | Text | 1 | Parsed from PDF text |
| 144 | STANDARD NAME | STDName_13 | Person/Text | 1 | Parsed from PDF text |
| 145 | STANDARD LOT # | STDLot_13 | Text | 1 | Parsed from PDF text |
| 146 | STANDARD EXP. DATE | STDExpDate_13 | Date/Text | 1 | Parsed from PDF text |
| 147 | BY | STDPreBy_13 | Text | 1 | Parsed from PDF text |
| 148 | Date | RV24 | Date/Text | 1 | Parsed from PDF text |
| 149 | Calibrated by (External calibration) | CalBy_14 | Number/Text | 1 | Parsed from PDF text |
| 150 | INSTRUMENT TAG # | TagNo_14 | Text | 1 | Parsed from PDF text |
| 151 | STANDARD NAME | STDName_14 | Person/Text | 1 | Parsed from PDF text |
| 152 | STANDARD LOT # | STDLot_14 | Text | 1 | Parsed from PDF text |
| 153 | STANDARD EXP. DATE | STDExpDate_14 | Date/Text | 1 | Parsed from PDF text |
| 154 | BY | STDPreBy_14 | Text | 1 | Parsed from PDF text |
| 155 | Calibrated by (External calibration) | CalBy15 | Number/Text | 1 | Parsed from PDF text |
| 156 | Date | RV25 | Date/Text | 1 | Parsed from PDF text |
| 157 | INSTRUMENT TAG # | TagNo_16 | Text | 1 | Parsed from PDF text |
| 158 | STANDARD NAME | STDName_16 | Person/Text | 1 | Parsed from PDF text |
| 159 | STANDARD LOT # | STDLot_16 | Text | 1 | Parsed from PDF text |
| 160 | STANDARD EXP. DATE | STDExpDate_16 | Date/Text | 1 | Parsed from PDF text |
| 161 | BY | STDPreBy_16 | Text | 1 | Parsed from PDF text |
| 162 | Calibrated by (External calibration) | CalBy16 | Number/Text | 1 | Parsed from PDF text |
| 163 | Date | RV26 | Date/Text | 1 | Parsed from PDF text |
| 164 | INSTRUMENT TAG # | TagNo_17 | Text | 1 | Parsed from PDF text |
| 165 | STANDARD NAME | STDName_17 | Person/Text | 1 | Parsed from PDF text |
| 166 | STANDARD LOT # | STDLot_17 | Text | 1 | Parsed from PDF text |
| 167 | STANDARD EXP. DATE | STDExpDate_17 | Date/Text | 1 | Parsed from PDF text |
| 168 | BY | STDPreBy_17 | Text | 1 | Parsed from PDF text |
| 169 | Calibrated by (External calibration) | CalBy17 | Number/Text | 1 | Parsed from PDF text |
| 170 | Date | RV27 | Date/Text | 1 | Parsed from PDF text |
| 171 | INSTRUMENT TAG # | TagNo_18 | Text | 1 | Parsed from PDF text |
| 172 | STANDARD NAME | STDName_18 | Person/Text | 1 | Parsed from PDF text |
| 173 | STANDARD LOT # | STDLot_18 | Text | 1 | Parsed from PDF text |
| 174 | STANDARD EXP. DATE | STDExpDate_18 | Date/Text | 1 | Parsed from PDF text |
| 175 | BY | STDPreBy_18 | Text | 1 | Parsed from PDF text |
| 176 | Calibrated by (External calibration) | CalBy18 | Number/Text | 1 | Parsed from PDF text |
| 177 | Date | RV28 | Date/Text | 1 | Parsed from PDF text |
| 178 | INSTRUMENT TAG # | TagNo_19 | Text | 1 | Parsed from PDF text |
| 179 | STANDARD NAME | STDName_19 | Person/Text | 1 | Parsed from PDF text |
| 180 | Date | RV29 | Date/Text | 1 | Parsed from PDF text |
| 181 | STANDARD EXP. DATE | STDExpDate_19 | Date/Text | 1 | Parsed from PDF text |
| 182 | BY | STDPreBy_19 | Text | 1 | Parsed from PDF text |
| 183 | Calibrated by (External calibration) | CalBy19 | Number/Text | 1 | Parsed from PDF text |
| 184 | INSTRUMENT TAG # | TagNo_20 | Text | 1 | Parsed from PDF text |
| 185 | STANDARD NAME | STDName_20 | Person/Text | 1 | Parsed from PDF text |
| 186 | STANDARD LOT # | STDLot_20 | Text | 1 | Parsed from PDF text |
| 187 | STANDARD EXP. DATE | STDExpDate_20 | Date/Text | 1 | Parsed from PDF text |
| 188 | BY | STDPreBy_20 | Text | 1 | Parsed from PDF text |
| 189 | Calibrated by (External calibration) | CalBy20 | Number/Text | 1 | Parsed from PDF text |
| 190 | Date | RV30 | Date/Text | 1 | Parsed from PDF text |
| 191 | INSTRUMENT TAG # | TagNo_21 | Text | 1 | Parsed from PDF text |
| 192 | STANDARD NAME | STDName_21 | Person/Text | 1 | Parsed from PDF text |
| 193 | STANDARD LOT # | STDLot_21 | Text | 1 | Parsed from PDF text |
| 194 | STANDARD EXP. DATE | STDExpDate_21 | Date/Text | 1 | Parsed from PDF text |
| 195 | BY | STDPreBy_21 | Text | 1 | Parsed from PDF text |
| 196 | Date | RV31 | Date/Text | 1 | Parsed from PDF text |
| 197 | Calibrated by (External calibration) | CalBy21 | Number/Text | 1 | Parsed from PDF text |
| 198 | INSTRUMENT TAG # | TagNo_22 | Text | 1 | Parsed from PDF text |
| 199 | STANDARD NAME | STDName_22 | Person/Text | 1 | Parsed from PDF text |
| 200 | STANDARD LOT # | STDLot_22 | Text | 1 | Parsed from PDF text |
| 201 | STANDARD EXP. DATE | STDExpDate_22 | Date/Text | 1 | Parsed from PDF text |
| 202 | BY | STDPreBy_22 | Text | 1 | Parsed from PDF text |
| 203 | Calibrated by (External calibration) | CalBy22 | Number/Text | 1 | Parsed from PDF text |
| 204 | Date | RV32 | Date/Text | 1 | Parsed from PDF text |
| 205 | INSTRUMENT TAG # | TagNo_23 | Text | 1 | Parsed from PDF text |
| 206 | STANDARD NAME | STDName_23 | Person/Text | 1 | Parsed from PDF text |
| 207 | STANDARD LOT # | STDLot_23 | Text | 1 | Parsed from PDF text |
| 208 | STANDARD EXP. DATE | STDExpDate_23 | Date/Text | 1 | Parsed from PDF text |
| 209 | BY | STDPreBy_23 | Text | 1 | Parsed from PDF text |
| 210 | Calibrated by (External calibration) | CalBy23 | Number/Text | 1 | Parsed from PDF text |
| 211 | Date | RV33 | Date/Text | 1 | Parsed from PDF text |
| 212 | INSTRUMENT TAG # | TagNo_24 | Text | 1 | Parsed from PDF text |
| 213 | STANDARD NAME | STDName_24 | Person/Text | 1 | Parsed from PDF text |
| 214 | STANDARD LOT # | STDLot_24 | Text | 1 | Parsed from PDF text |
| 215 | STANDARD EXP. DATE | STDExpDate_24 | Date/Text | 1 | Parsed from PDF text |
| 216 | BY | STDPreBy_24 | Text | 1 | Parsed from PDF text |
| 217 | Calibrated by (External calibration) | CalBy24 | Number/Text | 1 | Parsed from PDF text |
| 218 | Date | RV34 | Date/Text | 1 | Parsed from PDF text |
| 219 | INSTRUMENT TAG # | TagNo_25 | Text | 1 | Parsed from PDF text |
| 220 | STANDARD NAME | STDName_25 | Person/Text | 1 | Parsed from PDF text |
| 221 | STANDARD LOT # | STDLot_25 | Text | 1 | Parsed from PDF text |
| 222 | STANDARD EXP. DATE | STDExpDate_25 | Date/Text | 1 | Parsed from PDF text |
| 223 | BY | STDPreBy_25 | Text | 1 | Parsed from PDF text |
| 224 | Calibrated by (External calibration) | CalBy25 | Number/Text | 1 | Parsed from PDF text |
| 225 | Date | RV35 | Date/Text | 1 | Parsed from PDF text |
| 226 | INSTRUMENT TAG # | TagNo_26 | Text | 1 | Parsed from PDF text |
| 227 | STANDARD NAME | STDName_26 | Person/Text | 1 | Parsed from PDF text |
| 228 | Date | RV36 | Date/Text | 1 | Parsed from PDF text |
| 229 | STANDARD LOT # | STDLot_26 | Text | 1 | Parsed from PDF text |
| 230 | STANDARD EXP. DATE | STDExpDate_26 | Date/Text | 1 | Parsed from PDF text |
| 231 | BY | STDPreBy_26 | Text | 1 | Parsed from PDF text |
| 232 | Calibrated by (External calibration) | CalBy26 | Number/Text | 1 | Parsed from PDF text |
| 233 | INSTRUMENT TAG # | TagNo_27 | Text | 1 | Parsed from PDF text |
| 234 | STANDARD NAME | STDName_27 | Person/Text | 1 | Parsed from PDF text |
| 235 | STANDARD LOT # | STDLot_27 | Text | 1 | Parsed from PDF text |
| 236 | STANDARD EXP. DATE | STDExpDate_27 | Date/Text | 1 | Parsed from PDF text |
| 237 | BY | STDPreBy_27 | Text | 1 | Parsed from PDF text |
| 238 | Calibrated by (External calibration) | CalBy27 | Number/Text | 1 | Parsed from PDF text |
| 239 | Date | RV37 | Date/Text | 1 | Parsed from PDF text |
| 240 | INSTRUMENT TAG # | TagNo_28 | Text | 1 | Parsed from PDF text |
| 241 | STANDARD NAME | STDName_28 | Person/Text | 1 | Parsed from PDF text |
| 242 | STANDARD LOT # | STDLot_28 | Text | 1 | Parsed from PDF text |
| 243 | STANDARD EXP. DATE | STDExpDate_28 | Date/Text | 1 | Parsed from PDF text |
| 244 | BY | STDPreBy_28 | Text | 1 | Parsed from PDF text |
| 245 | Date | RV38 | Date/Text | 1 | Parsed from PDF text |
| 246 | Calibrated by (External calibration) | CalBy28 | Number/Text | 1 | Parsed from PDF text |
| 247 | INSTRUMENT TAG # | TagNo_29 | Text | 1 | Parsed from PDF text |
| 248 | STANDARD NAME | STDName_29 | Person/Text | 1 | Parsed from PDF text |
| 249 | STANDARD LOT # | STDLot_29 | Text | 1 | Parsed from PDF text |
| 250 | STANDARD EXP. DATE | STDExpDate_29 | Date/Text | 1 | Parsed from PDF text |
| 251 | BY | STDPreBy_29 | Text | 1 | Parsed from PDF text |
| 252 | Calibrated by (External calibration) | CalBy29 | Number/Text | 1 | Parsed from PDF text |
| 253 | Date | RV39 | Date/Text | 1 | Parsed from PDF text |
| 254 | INSTRUMENT TAG # | TagNo_30 | Text | 1 | Parsed from PDF text |
| 255 | STANDARD NAME | STDName_30 | Person/Text | 1 | Parsed from PDF text |
| 256 | STANDARD LOT # | STDLot_30 | Text | 1 | Parsed from PDF text |
| 257 | STANDARD EXP. DATE | STDExpDate_30 | Date/Text | 1 | Parsed from PDF text |
| 258 | BY | STDPreBy_30 | Text | 1 | Parsed from PDF text |
| 259 | Calibrated by (External calibration) | CalBy30 | Number/Text | 1 | Parsed from PDF text |
| 260 | Date | RV40 | Date/Text | 1 | Parsed from PDF text |
| 261 | INSTRUMENT TAG # | TagNo_31 | Text | 1 | Parsed from PDF text |
| 262 | STANDARD NAME | STDName_31 | Person/Text | 1 | Parsed from PDF text |
| 263 | STANDARD LOT # | STDLot_31 | Text | 1 | Parsed from PDF text |
| 264 | STANDARD EXP. DATE | STDExpDate_31 | Date/Text | 1 | Parsed from PDF text |
| 265 | BY | STDPreBy_31 | Text | 1 | Parsed from PDF text |
| 266 | Calibrated by (External calibration) | CalBy31 | Number/Text | 1 | Parsed from PDF text |
| 267 | Date | RV41 | Date/Text | 1 | Parsed from PDF text |
| 268 | INSTRUMENT TAG # | TagNo_32 | Text | 1 | Parsed from PDF text |
| 269 | STANDARD NAME | STDName_32 | Person/Text | 1 | Parsed from PDF text |
| 270 | STANDARD LOT # | STDLot_32 | Text | 1 | Parsed from PDF text |
| 271 | STANDARD EXP. DATE | STDExpDate_32 | Date/Text | 1 | Parsed from PDF text |
| 272 | BY | STDPreBy_32 | Text | 1 | Parsed from PDF text |
| 273 | Calibrated by (External calibration) | CalBy32 | Number/Text | 1 | Parsed from PDF text |
| 274 | Date | RV42 | Date/Text | 1 | Parsed from PDF text |
| 275 | INSTRUMENT TAG # | TagNo_33 | Text | 1 | Parsed from PDF text |
| 276 | STANDARD NAME | STDName_33 | Person/Text | 1 | Parsed from PDF text |
| 277 | STANDARD LOT # | STDLot_33 | Text | 1 | Parsed from PDF text |
| 278 | STANDARD EXP. DATE | STDExpDate_33 | Date/Text | 1 | Parsed from PDF text |
| 279 | BY | STDPreBy_33 | Text | 1 | Parsed from PDF text |
| 280 | Calibrated by (External calibration) | CalBy33 | Number/Text | 1 | Parsed from PDF text |
| 281 | Date | RV43 | Date/Text | 1 | Parsed from PDF text |
| 282 | INSTRUMENT TAG # | TagNo_34 | Text | 1 | Parsed from PDF text |
| 283 | STANDARD NAME | STDName_34 | Person/Text | 1 | Parsed from PDF text |
| 284 | STANDARD LOT # | STDLot_34 | Text | 1 | Parsed from PDF text |
| 285 | STANDARD EXP. DATE | STDExpDate_34 | Date/Text | 1 | Parsed from PDF text |
| 286 | BY | STDPreBy_34 | Text | 1 | Parsed from PDF text |
| 287 | Calibrated by (External calibration) | CalBy34 | Number/Text | 1 | Parsed from PDF text |
| 288 | Date | RV44 | Date/Text | 1 | Parsed from PDF text |
| 289 | INSTRUMENT TAG # | TagNo_35 | Text | 1 | Parsed from PDF text |
| 290 | STANDARD NAME | STDName_35 | Person/Text | 1 | Parsed from PDF text |
| 291 | STANDARD LOT # | STDLot_35 | Text | 1 | Parsed from PDF text |
| 292 | STANDARD EXP. DATE | STDExpDate_35 | Date/Text | 1 | Parsed from PDF text |
| 293 | BY | STDPreBy_35 | Text | 1 | Parsed from PDF text |
| 294 | Calibrated by (External calibration) | CalBy35 | Number/Text | 1 | Parsed from PDF text |
| 295 | Date | RV45 | Date/Text | 1 | Parsed from PDF text |
| 296 | INSTRUMENT TAG # | TagNo_36 | Text | 1 | Parsed from PDF text |
| 297 | STANDARD NAME | STDName_36 | Person/Text | 1 | Parsed from PDF text |
| 298 | STANDARD LOT # | STDLot_36 | Text | 1 | Parsed from PDF text |
| 299 | STANDARD EXP. DATE | STDExpDate_36 | Date/Text | 1 | Parsed from PDF text |
| 300 | BY | STDPreBy_36 | Text | 1 | Parsed from PDF text |
| 301 | Date | RV46 | Date/Text | 1 | Parsed from PDF text |
| 302 | Calibrated by (External calibration) | CalBy36 | Number/Text | 1 | Parsed from PDF text |
| 303 | INSTRUMENT TAG # | TagNo_37 | Text | 1 | Parsed from PDF text |
| 304 | STANDARD NAME | STDName_37 | Person/Text | 1 | Parsed from PDF text |
| 305 | STANDARD LOT # | STDLot_37 | Text | 1 | Parsed from PDF text |
| 306 | STANDARD EXP. DATE | STDExpDate_37 | Date/Text | 1 | Parsed from PDF text |
| 307 | BY | STDPreBy_37 | Text | 1 | Parsed from PDF text |
| 308 | Calibrated by (External calibration) | CalBy37 | Number/Text | 1 | Parsed from PDF text |
| 309 | Date | RV47 | Date/Text | 1 | Parsed from PDF text |
| 310 | INSTRUMENT TAG # | TagNo_38 | Text | 1 | Parsed from PDF text |
| 311 | STANDARD NAME | STDName_38 | Person/Text | 1 | Parsed from PDF text |
| 312 | STANDARD LOT # | STDLot_38 | Text | 1 | Parsed from PDF text |
| 313 | STANDARD EXP. DATE | STDExpDate_38 | Date/Text | 1 | Parsed from PDF text |
| 314 | BY | STDPreBy_38 | Text | 1 | Parsed from PDF text |
| 315 | Calibrated by (External calibration) | CalBy38 | Number/Text | 1 | Parsed from PDF text |
| 316 | Date | RV48 | Date/Text | 1 | Parsed from PDF text |
| 317 | INSTRUMENT TAG # | TagNo_39 | Text | 1 | Parsed from PDF text |
| 318 | STANDARD NAME | STDName_39 | Person/Text | 1 | Parsed from PDF text |
| 319 | STANDARD LOT # | STDLot_39 | Text | 1 | Parsed from PDF text |
| 320 | STANDARD EXP. DATE | STDExpDate_39 | Date/Text | 1 | Parsed from PDF text |
| 321 | BY | STDPreBy_39 | Text | 1 | Parsed from PDF text |
| 322 | Date | RV49 | Date/Text | 1 | Parsed from PDF text |
| 323 | Calibrated by (External calibration) | CalBy39 | Number/Text | 1 | Parsed from PDF text |
| 324 | INSTRUMENT TAG # | TagNo_40 | Text | 1 | Parsed from PDF text |
| 325 | STANDARD NAME | STDName_40 | Person/Text | 1 | Parsed from PDF text |
| 326 | STANDARD LOT # | STDLot_40 | Text | 1 | Parsed from PDF text |
| 327 | STANDARD EXP. DATE | STDExpDate_40 | Date/Text | 1 | Parsed from PDF text |
| 328 | BY | STDPreBy_40 | Text | 1 | Parsed from PDF text |
| 329 | Calibrated by (External calibration) | CalBy40 | Number/Text | 1 | Parsed from PDF text |
| 330 | Date | RV50 | Date/Text | 1 | Parsed from PDF text |
| 331 | INSTRUMENT TAG # | TagNo_41 | Text | 1 | Parsed from PDF text |
| 332 | STANDARD NAME | STDName_41 | Person/Text | 1 | Parsed from PDF text |
| 333 | STANDARD LOT # | STDLot_41 | Text | 1 | Parsed from PDF text |
| 334 | STANDARD EXP. DATE | STDExpDate_41 | Date/Text | 1 | Parsed from PDF text |
| 335 | BY | STDPreBy_41 | Text | 1 | Parsed from PDF text |
| 336 | Calibrated by (External calibration) | CalBy41 | Number/Text | 1 | Parsed from PDF text |
| 337 | Date | RV51 | Date/Text | 1 | Parsed from PDF text |
| 338 | INSTRUMENT TAG # | TagNo_42 | Text | 1 | Parsed from PDF text |
| 339 | STANDARD NAME | STDName_42 | Person/Text | 1 | Parsed from PDF text |
| 340 | STANDARD LOT # | STDLot_42 | Text | 1 | Parsed from PDF text |
| 341 | STANDARD EXP. DATE | STDExpDate_42 | Date/Text | 1 | Parsed from PDF text |
| 342 | BY | STDPreBy_42 | Text | 1 | Parsed from PDF text |
| 343 | Date | RV52 | Date/Text | 1 | Parsed from PDF text |
| 344 | Calibrated by (External calibration) | CalBy42 | Number/Text | 1 | Parsed from PDF text |
| 345 | INSTRUMENT TAG # | TagNo_43 | Text | 1 | Parsed from PDF text |
| 346 | STANDARD NAME | STDName_43 | Person/Text | 1 | Parsed from PDF text |
| 347 | STANDARD LOT # | STDLot_43 | Text | 1 | Parsed from PDF text |
| 348 | STANDARD EXP. DATE | STDExpDate_43 | Date/Text | 1 | Parsed from PDF text |
| 349 | BY | STDPreBy_43 | Text | 1 | Parsed from PDF text |
| 350 | Calibrated by (External calibration) | CalBy43 | Number/Text | 1 | Parsed from PDF text |
| 351 | Date | RV53 | Date/Text | 1 | Parsed from PDF text |
| 352 | INSTRUMENT TAG # | TagNo_44 | Text | 1 | Parsed from PDF text |
| 353 | STANDARD NAME | STDName_44 | Person/Text | 1 | Parsed from PDF text |
| 354 | STANDARD LOT # | STDLot_44 | Text | 1 | Parsed from PDF text |
| 355 | STANDARD EXP. DATE | STDExpDate_44 | Date/Text | 1 | Parsed from PDF text |
| 356 | BY | STDPreBy_44 | Text | 1 | Parsed from PDF text |
| 357 | Calibrated by (External calibration) | CalBy44 | Number/Text | 1 | Parsed from PDF text |
| 358 | Date | RV54 | Date/Text | 1 | Parsed from PDF text |
| 359 | INSTRUMENT TAG # | TagNo_45 | Text | 1 | Parsed from PDF text |
| 360 | STANDARD NAME | STDName_45 | Person/Text | 1 | Parsed from PDF text |
| 361 | STANDARD LOT # | STDLot_45 | Text | 1 | Parsed from PDF text |
| 362 | STANDARD EXP. DATE | STDExpDate_45 | Date/Text | 1 | Parsed from PDF text |
| 363 | Date | RV55 | Date/Text | 1 | Parsed from PDF text |
| 364 | BY | STDPreBy_45 | Text | 1 | Parsed from PDF text |
| 365 | Calibrated by (External calibration) | CalBy45 | Number/Text | 1 | Parsed from PDF text |
| 366 | CurrentAction | CA | Text | 1 | Parsed from PDF text |
| 367 | Editor 1 | Editor1 | Text | 1 | Parsed from PDF text |
| 368 | Editor 2 | Editor2 | Text | 1 | Parsed from PDF text |
| 369 | Editor 3 | Editor3 | Text | 1 | Parsed from PDF text |
| 370 | DB Admin | DBA | Text | 1 | Parsed from PDF text |
| 371 | QC List | QCList | Text | 1 | Parsed from PDF text |
| 372 | QC manager | QCHOD | Person/Text | 1 | Parsed from PDF text |
| 373 | Next Cal Date | NextCal | Date/Text | 1 | Parsed from PDF text |
| 374 | Reminder To | RemTo | Text | 1 | Parsed from PDF text |
| 375 | Reminder Date | RemDate | Date/Text | 1 | Parsed from PDF text |
| 376 | Reviewer | SendTo | Date/Text | 1 | Parsed from PDF text |
| 377 | IT | IT | Text | 1 | Parsed from PDF text |
| 378 | Status List | StatusList | Choice/Text | 1 | Parsed from PDF text |
| 379 | Document Title | TitleDoc | Text | 1 | Parsed from PDF text |
| 380 | Business Area | BusinessArea | Text | 1 | Parsed from PDF text |
| 381 | Number | No | Text | 1 | Parsed from PDF text |
| 382 | Issue No. | IssueNum; BA | Number/Text | 1 | Parsed from PDF text |
| 383 | Number of Initiators | NoOfIni; i1 | Text | 1 | Parsed from PDF text |
| 384 | Number of Signed Initiators | IniSign; Send_1 | Text | 1 | Parsed from PDF text |
| 385 | Number of Signed DHs | DHSign; DH_1 | Text | 1 | Parsed from PDF text |
| 386 | Pending DH | P1 | Text | 1 | Parsed from PDF text |
| 387 | All Pending DH | AllPdgDH | Text | 1 | Parsed from PDF text |
| 388 | All Approved | AllDHApproved | Person/Text | 1 | Parsed from PDF text |
| 389 | Title | TitleForDoc | Text | 1 | Parsed from PDF text |
| 390 | Effective date counting | increment | Date/Text | 1 | Parsed from PDF text |
| 391 | Initiator List | InitiatorList | Text | 1 | Parsed from PDF text |
| 392 | Original Authors | Authors | Text | 1 | Parsed from PDF text |
| 393 | QA2 | QA2 | Text | 1 | Parsed from PDF text |
| 394 | QA Admin | QAAdmin | Text | 1 | Parsed from PDF text |
| 395 | To display the Company name | CompName | Person/Text | 1 | Parsed from PDF text |
| 396 | Servers | Servers | Text | 1 | Parsed from PDF text |
| 397 | Azilan | Azilan; Azilan1; ID | Text | 1 | Parsed from PDF text |

## 5. Workflow and Routing

| Attribute | Value | Confidence |
| --- | --- | --- |
| Approval Required | Yes - inferred from PDF workflow/routing terms | Inferred |
| Workflow Evidence | reviewed (48), verified (45), status (10), approval (5), review (4), approved (3), verification (2), submitted (1) | Parsed from PDF text |
| CurrentAction Field | CA/CurrentAction candidate if present in source evidence | Needs Human Confirmation |
| State Values | Unknown | Needs Human Confirmation |

## 6. SharePoint Design Recommendation

Parent list: `MainDB_QA`
FormCode: `IQMSPQP`
Child-list recommendation: `MainDB_QA_Ext_IQMSPQP_Rows` candidate for repeating row fields

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
| MASTER-093-01 | Confirm the matched PDF evidence belongs to this Domino app/form. | High |
| MASTER-093-02 | Confirm required workflow states, approver roles, and CurrentAction values. | High |
| MASTER-093-03 | Confirm whether repeating rows should be child lists or fixed extension columns. | Medium |

## 9. Final Classification

| Attribute | Value |
| --- | --- |
| PDF Source Status | Extracted - Needs Review |
| PDF Count | 4 |
| Parsed Field Count | 397 |
| Workflow Signal Count | 121 |
| Notes | PDF matched through fallback scoring; confirm ownership/form identity before build. |
