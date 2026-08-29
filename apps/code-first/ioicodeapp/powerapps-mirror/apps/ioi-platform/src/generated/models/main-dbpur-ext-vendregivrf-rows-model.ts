export interface MainDBPURExtVENDREGIVRFRows {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  vENDREGIVRFVendorName?: string;
  vENDREGIVRFVendorCode?: string;
  vENDREGIVRFVendorAddress?: string;
  vENDREGIVRFVendorPIC?: string;
  vENDREGIVRFPhone?: number;
  vENDREGIVRFFax?: number;
  vENDREGIVRFEmail?: string;
  vENDREGIVRFRegistrationDate?: string;
  vENDREGIVRFExpiryDate?: string;
  vENDREGIVRFCertificates?: string;
  vENDREGIVRFIssueCategory?: string;
  vENDREGIVRFACC?: string;
  vENDREGIVRFVenNew?: string;
  vENDREGIVRFStatus?: string;
}
