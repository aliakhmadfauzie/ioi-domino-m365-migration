/**
 * Generated model for MainDB_IT_Ext_Policy SharePoint list.
 * IOI Policy (IOIP) extended fields — one record per policy submission.
 */
export interface MainDBITExtPolicy {
  id: number;
  title?: string;

  // Parent relationship
  parentFormCode?: string;
  parentRecordId?: number;
  parentRecord?: { id: number; title?: string };

  // Policy header
  iOIPPolicyNo?: string;
  iOIPSubject?: string;
  iOIPReviNum?: string;
  iOIPDateIssue?: string;
  iOIPBody?: string;
  iOIPDocTitle?: string;

  // Final status & archive
  iOIPFinalStatus?: string;
  iOIPDateArchived?: string;

  // Approver 1
  iOIPApp1_1?: string;
  iOIPReq1?: string;
  iOIPStatus1?: string;
  iOIPDateApproved1?: string;
  iOIPComment1?: string;
  iOIPA1replied?: string;

  // Approver 2
  iOIPApp2_1?: string;
  iOIPReq2?: string;
  iOIPStatus2?: string;
  iOIPDateApproved2?: string;
  iOIPComment2?: string;
  iOIPA2replied?: string;

  // Approver 3
  iOIPApp3_1?: string;
  iOIPReq3?: string;
  iOIPStatus3?: string;
  iOIPDateApproved3?: string;
  iOIPComment3?: string;
  iOIPA3replied?: string;

  // Distribution
  iOIPDefaultList?: string;
  iOIPDistributionList?: string;

  // Revision history — latest
  iOIPRevR?: string;
  iOIPRevD?: string;
  iOIPRevU?: string;

  // Revision history — rows 1-10
  iOIPRevR1?: string;
  iOIPRevD1?: string;
  iOIPRevU1?: string;
  iOIPRevR2?: string;
  iOIPRevD2?: string;
  iOIPRevU2?: string;
  iOIPRevR3?: string;
  iOIPRevD3?: string;
  iOIPRevU3?: string;
  iOIPRevR4?: string;
  iOIPRevD4?: string;
  iOIPRevU4?: string;
  iOIPRevR5?: string;
  iOIPRevD5?: string;
  iOIPRevU5?: string;
  iOIPRevR6?: string;
  iOIPRevD6?: string;
  iOIPRevU6?: string;
  iOIPRevR7?: string;
  iOIPRevD7?: string;
  iOIPRevU7?: string;
  iOIPRevR8?: string;
  iOIPRevD8?: string;
  iOIPRevU8?: string;
  iOIPRevR9?: string;
  iOIPRevD9?: string;
  iOIPRevU9?: string;
  iOIPRevR10?: string;
  iOIPRevD10?: string;
  iOIPRevU10?: string;

  // Editors & tracking
  iOIPEditors?: string;
  iOIPAuthors?: string;
  iOIPSendto?: string;
}
