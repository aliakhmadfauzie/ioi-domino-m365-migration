export interface MainDBPURExtVENDDIALREPO {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  vENDDIALREPODialogueNo?: string;
  vENDDIALREPODialogueDate?: string;
  vENDDIALREPOVendorName?: string;
  vENDDIALREPOVendorCode?: string;
  vENDDIALREPOParticipants?: string;
  vENDDIALREPODiscussionPoints?: string;
  vENDDIALREPOActionItems?: string;
  vENDDIALREPOFollowUpDate?: string;
  vENDDIALREPOStatus?: string;
}
