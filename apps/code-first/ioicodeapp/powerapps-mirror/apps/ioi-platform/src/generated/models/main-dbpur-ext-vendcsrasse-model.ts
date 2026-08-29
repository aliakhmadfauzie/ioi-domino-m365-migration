export interface MainDBPURExtVENDCSRASSE {
  id: number;
  title: string;
  parentFormCode?: string;
  parentSite?: string;
  parentRecord?: { id: number; title: string };
  sourceSite?: string;
  sourceMasterIndex?: number;
  rowNumber?: number;
  vENDCSRASSEVendorName?: string;
  vENDCSRASSEVendorCode?: string;
  vENDCSRASSEAssessmentDate?: string;
  vENDCSRASSEAssessorName?: string;
  vENDCSRASSEEnvironmentalScore?: number;
  vENDCSRASSESocialScore?: number;
  vENDCSRASSEGovernanceScore?: number;
  vENDCSRASSESafetyScore?: number;
  vENDCSRASSETotalScore?: number;
  vENDCSRASSEType?: string;
  vENDCSRASSECategory?: string;
  vENDCSRASSEStatus?: string;
}
