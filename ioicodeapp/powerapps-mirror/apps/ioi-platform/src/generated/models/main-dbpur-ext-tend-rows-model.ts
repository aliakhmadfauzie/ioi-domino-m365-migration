export interface MainDBPURExtTENDRows {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  tENDTenderNo?: string;
  tENDTenderDate?: string;
  tENDTenderTitle?: string;
  tENDTenderDescription?: string;
  tENDClosingDate?: string;
  tENDOpeningDate?: string;
  tENDType?: string;
  tENDCategory?: string;
  tENDStatus?: string;
  tENDRenStatus?: string;
  tENDSDStatus?: string;
  tENDTotalBidders?: number;
  tENDAwardedTo?: string;
  tENDAwardValue?: number;
}
