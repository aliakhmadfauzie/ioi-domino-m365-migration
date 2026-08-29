export interface MainDBPURExtNOTIOFCHANRows {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  nOTIOFCHANChangeNo?: string;
  nOTIOFCHANChangeDate?: string;
  nOTIOFCHANChangeType?: string;
  nOTIOFCHANChangeDescription?: string;
  nOTIOFCHANAffectedProduct?: string;
  nOTIOFCHANAffectedProcess?: string;
  nOTIOFCHANVCARCat?: string;
  nOTIOFCHANtxtStatus1?: string;
  nOTIOFCHANTotalList?: number;
  nOTIOFCHANGetTotal?: number;
  nOTIOFCHANGetApp?: number;
}
