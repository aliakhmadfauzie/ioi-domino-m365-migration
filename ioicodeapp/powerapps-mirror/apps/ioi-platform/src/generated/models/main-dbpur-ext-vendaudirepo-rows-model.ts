export interface MainDBPURExtVENDAUDIREPORows {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  vENDAUDIREPOAuditNo?: string;
  vENDAUDIREPOAuditDate?: string;
  vENDAUDIREPOVendorName?: string;
  vENDAUDIREPOVendorCode?: string;
  vENDAUDIREPOAuditorName?: string;
  vENDAUDIREPOAuditScope?: string;
  vENDAUDIREPOAuditFindings?: string;
  vENDAUDIREPONonConformance?: string;
  vENDAUDIREPOCorrectiveAction?: string;
  vENDAUDIREPODueDate?: string;
  vENDAUDIREPOClosedDate?: string;
  vENDAUDIREPOCategory?: string;
  vENDAUDIREPOProductCategory?: string;
  vENDAUDIREPOStatus?: string;
}
