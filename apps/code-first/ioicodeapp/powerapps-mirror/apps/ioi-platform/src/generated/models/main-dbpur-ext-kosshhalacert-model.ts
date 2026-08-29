export interface MainDBPURExtKOSHHALACERT {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  kOSHHALACERTCertNo?: string;
  kOSHHALACERTCertDate?: string;
  kOSHHALACERTExpiryDate?: string;
  kOSHHALACERTProductName?: string;
  kOSHHALACERTBrandName?: string;
  kOSHHALACERTManufacturer?: string;
  kOSHHALACERTCategory?: string;
  kOSHHALACERTType?: string;
  kOSHHALACERTStatus?: string;
}
