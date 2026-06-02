export interface MainDBSEC {
  id: number;
  title: string;
  formCode: string;
  department?: string;
  siteKey?: string;
  submittedBy?: string;
  submittedOn?: string;
  statusKey?: string;
  approverEmail?: string;
  location?: string;
  remarks?: string;
  iMSRelated?: boolean;
  iMSRefNo?: string;
  guardName?: string;
  visitorName?: string;
  vehicleNo?: string;
  passType?: string;
  incidentType?: string;
  incidentDate?: string;
  incidentDescription?: string;
  actionTaken?: string;
}
