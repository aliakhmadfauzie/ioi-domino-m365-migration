export interface MainDBPURExtMATEEVALMERRows {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  mATEEVALMERVendorName?: string;
  mATEEVALMERVendorCode?: string;
  mATEEVALMERVendorAddress?: string;
  mATEEVALMERVendorPIC?: string;
  mATEEVALMERVendorPhone?: string;
  mATEEVALMERVendorEmail?: string;
  mATEEVALMEREvaluationDate?: string;
  mATEEVALMERMaterialName?: string;
  mATEEVALMERMaterialCode?: string;
  mATEEVALMERQualityScore?: number;
  mATEEVALMERDeliveryScore?: number;
  mATEEVALMERServiceScore?: number;
  mATEEVALMERTotalScore?: number;
  mATEEVALMERStatusApp?: string;
  mATEEVALMERStatus1?: string;
  mATEEVALMERStatus2?: string;
  mATEEVALMERStatus3?: string;
  mATEEVALMERWDStatus?: string;
}
