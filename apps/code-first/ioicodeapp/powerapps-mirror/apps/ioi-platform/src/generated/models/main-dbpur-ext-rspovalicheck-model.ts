export interface MainDBPURExtRSPOVALICHEC {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  rSPOVALICHECVendorName?: string;
  rSPOVALICHECVendorCode?: string;
  rSPOVALICHECCertNo?: string;
  rSPOVALICHECCertDate?: string;
  rSPOVALICHECExpiryDate?: string;
  rSPOVALICHECScope?: string;
  rSPOVALICHECStatus?: string;
  rSPOVALICHECFNO?: number;
}
