export interface MainDB_HR_Ext_Cafeteria {
  id: string | number;
  ID?: number;
  Title?: string;
  ParentRecord?: string;
  ParentFormCode?: string;
  cIRRecordType?: string | { Value: string };
  cIRTeamMembers?: string;
  cIRDueDate?: string;
  cIRInspectorName?: string;
  cIRSentBy?: string;
  cIRSentDate?: string;
  cIREditor1?: string;
  cIREditor2?: string;
  cIREditor3?: string;
  cIREditors?: string;
  cIRACMCommittee?: string;
  cIRECMCommittee?: string;
  cIRTND?: string;
  cIRITGroup?: string;
  cirSite?: string;
  cirTeamMembers0?: string;
  cirTeamMembers1?: string;
  cirTeamMembers2?: string;
  cirTeamMembers3?: string;
  cirInspector?: string;
  cirInsDate?: string;
  cirInsTime?: string;
  cirSubmittedBy?: string;
  cirSubmittedDate?: string;
  cirReviewedBy?: string;
  cirReviewedDate?: string;
  cirRemarks?: string;
  cirCurrentAction?: string;
  cirACMComm?: string;
  cirECMComm?: string;
  cirINO?: string;
  Created?: string;
  Modified?: string;
  Author?: {
    DisplayName?: string;
    Email?: string;
  };
  Editor?: {
    DisplayName?: string;
    Email?: string;
  };
}

export type MainDB_HR_Ext_CafeteriaRead = MainDB_HR_Ext_Cafeteria;
