export interface MainDBPURExtMASTOFAPPR {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  mASTOFAPPRApproverName?: string;
  mASTOFAPPRApproverEmail?: string;
  mASTOFAPPRApproverPosition?: string;
  mASTOFAPPRDepartment?: string;
  mASTOFAPPRApprovalLimit?: number;
  mASTOFAPPRCategory?: string;
  mASTOFAPPRStatus?: string;
}
