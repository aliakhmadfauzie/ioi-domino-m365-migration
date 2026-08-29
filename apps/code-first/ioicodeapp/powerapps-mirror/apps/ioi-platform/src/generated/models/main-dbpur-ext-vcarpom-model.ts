export interface MainDBPURExtVCARPOM {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  vCARPOMPONo?: string;
  vCARPOMPODate?: string;
  vCARPOMSupplierName?: string;
  vCARPOMSupplierCode?: string;
  vCARPOMMaterialName?: string;
  vCARPOMMaterialCode?: string;
  vCARPOMQuantity?: number;
  vCARPOMUnitPrice?: number;
  vCARPOMTotalPrice?: number;
  vCARPOMDeliveryDate?: string;
  vCARPOMStatus?: string;
}
