export interface MainDBPURExtVENDQUALAPPRRows {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  vENDQUALAPPRApprovalNo?: string;
  vENDQUALAPPRApprovalDate?: string;
  vENDQUALAPPRVendorName?: string;
  vENDQUALAPPRVendorCode?: string;
  vENDQUALAPPRMaterialName?: string;
  vENDQUALAPPRMaterialCode?: string;
  vENDQUALAPPRQualityScore?: number;
  vENDQUALAPPRDeliveryScore?: number;
  vENDQUALAPPRServiceScore?: number;
  vENDQUALAPPRTotalScore?: number;
  vENDQUALAPPRCategory?: string;
  vENDQUALAPPRCategoryName?: string;
  vENDQUALAPPRStatus?: string;
}
