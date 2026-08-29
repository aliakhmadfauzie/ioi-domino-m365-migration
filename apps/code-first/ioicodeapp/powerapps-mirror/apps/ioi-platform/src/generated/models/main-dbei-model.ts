export interface MainDBEI {
  id: number; title: string; formCode: string; department?: string;
  siteKey?: string; submittedBy?: string; submittedOn?: string;
  statusKey?: string; approverEmail?: string; location?: string;
  remarks?: string; equipmentID?: string; instrumentType?: string;
  calibrationDate?: string; calibrationDue?: string; calibrationResult?: string;
  certificateNo?: string; performedBy?: string;
}
