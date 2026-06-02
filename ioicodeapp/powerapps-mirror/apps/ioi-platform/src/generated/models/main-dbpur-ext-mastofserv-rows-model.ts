export interface MainDBPURExtMASTOFSERVRows {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  mASTOFSERVServiceNo?: string;
  mASTOFSERVServiceDate?: string;
  mASTOFSERVVendorName?: string;
  mASTOFSERVVendorAddress?: string;
  mASTOFSERVVendorPIC?: string;
  mASTOFSERVVendorPhone?: string;
  mASTOFSERVVendorEmail?: string;
  mASTOFSERVService?: string;
  mASTOFSERVContractValue?: number;
  mASTOFSERVStartDate?: string;
  mASTOFSERVEndDate?: string;
  mASTOFSERVReminderStatus?: string;
  mASTOFSERVRenStatus?: string;
}
