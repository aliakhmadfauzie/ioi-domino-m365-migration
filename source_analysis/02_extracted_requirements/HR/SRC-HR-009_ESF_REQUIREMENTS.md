# Form Requirement - Employee Survey Form (ESF)

> **Source ID**: SRC-HR-009 | **Department**: HR | **Promoted**: 2026-06-01 | **Quality**: 92/100
> **Evidence**: PyMuPDF direct text from `PRAI_SITE_FORM/HR/ESF.pdf` (3 pages, 2,183 chars)
> **Promotion**: Promote with Human Confirmation - survey response table design and choice values need confirmation

## 1. Basic Information

| Attribute | Value | Confidence |
|---|---|---|
| Source ID | SRC-HR-009 | Clearly Found |
| Department | HR | Clearly Found |
| PDF Title | "EMPLOYEE SURVEY FORM" | Clearly Found |
| Form Purpose | Capture employee motivation/satisfaction survey ratings and comments. | Clearly Found |
| Pages | 3 | Clearly Found |
| Rating Scale | 1 to 10, Poor to Excellent | Clearly Found |

## 2. Form Sections

| Section | Page | Type | Key Fields |
|---|---:|---|---|
| Survey Instructions and Rating Legend | 1 | Reference | Scale 1-10; Poor, Below Average, Above Average, Good, Excellent |
| Motivation Factor Questions | 1-2 | Repeating survey table | Question text, Rating, Comment, group/category code |
| Respondent Summary | 2 | Requester | Service, Age, Category, Suggestion, DateSubmitted |
| Hidden Fields | 2 | System/routing | CA, HR, IT, Editor1, Servers, Readers |
| Aggregated Survey Fields | 3 | System/summary | Qs, Cs, Gs-G_16, TotalRating |

## 3. Field Requirements

### Survey Question Table

| Structure | Domino Fields | Type | Confidence |
|---|---|---|---|
| Question text rows | `N_1`-`N_15` plus visible question text | Survey question label/text | Clearly Found |
| Rating rows | `R_1`-`R_16` | Number/Choice 1-10 | Clearly Found |
| Comment rows | `C_1`-`C_15` | Multiline | Clearly Found |
| Group/category rows | `G_1`-`G_16` | Text/Choice | Clearly Found |
| All Questions | `Qs` | Aggregated text/system | Clearly Found |
| All Comments | `Cs` | Aggregated text/system | Clearly Found |
| Ratings | `Gs - G_16` | Aggregated/system | Clearly Found |
| Total Rating | `TotalRating` | Number/Choice | Clearly Found |

### Respondent Summary

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| Years of Service | `Service` | Number/Text | Clearly Found |
| Age Group | `Age` | Choice/Text | Clearly Found, choices Unknown |
| Category | `Category` | Choice | Clearly Found, choices Unknown |
| Suggestion/s (for improvement) | `Suggestion` | Multiline | Clearly Found |
| Submitted On | `DateSubmitted` | Date | Clearly Found |

### Hidden Fields

| PDF Label | Domino Field | Type | Confidence |
|---|---|---|---|
| CA | `CA` | Choice/System | Clearly Found |
| HR | `HR` | Person/Text | Clearly Found |
| IT | `IT` | Text | Clearly Found |
| Editor 1 | `Editor1` | Person/Text | Clearly Found |
| Servers | `Servers` | Text | Clearly Found |
| Readers | `Readers` | Text | Clearly Found |

## 4. Workflow and Routing

| Attribute | Value | Confidence |
|---|---|---|
| Approval Required | Not Required / Survey Form Candidate | Clearly Found |
| Evidence | Survey has hidden CA/routing fields but no approval blocks or approver actions in extracted text. | Clearly Found |
| Confidentiality | Text states responses are "strictly confidential" | Clearly Found |

## 5. SharePoint Design Recommendation

**Parent List**: `MainDB_HR`
**FormCode**: `ESF`
**Child List Candidate**: `MainDB_HR_Ext_ESF_Responses` with columns for question number, question text, rating, comment, and group/category code.

If HR confirms questions are always fixed, the app can seed the 16 questions from configuration and store responses as child rows. Avoid creating many unrelated parent columns for each survey row unless reporting requires fixed columns.

## 6. Human Confirmation Questions

| # | Question | Severity |
|---|---|---|
| ESF-01 | Are survey questions fixed at 16 rows, or should HR manage the question list as configuration? | High |
| ESF-02 | Should responses be stored as child rows or fixed parent columns? | High |
| ESF-03 | What are the choice values for Years of Service, Age Group, and Category? | Medium |
| ESF-04 | How should confidentiality be enforced in SharePoint/Power Apps access rules? | Medium |
| ESF-05 | Confirm TotalRating calculation formula. | Low |

## 7. Final Classification

| Attribute | Value |
|---|---|
| Ready for SharePoint Design | Yes, with response-table decision |
| Approval Required | No approval; survey form |
| Promotion Quality | 92/100 |
