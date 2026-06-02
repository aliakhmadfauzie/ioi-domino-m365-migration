export interface MainDB_HR_Ext_CWR {
  id: string;
  Title?: string;
  ParentRecord?: string;
  cWRFormType?: string;
  cWRCategory?: string;
  cWRType?: string;
  cWRNoWorkers?: number;
  cWRWorkstation?: string;
  cWRJobDescription?: string;
  cWREffectiveDate?: string;
  cWRPeriod1From?: string;
  cWRPeriod1To?: string;
  cWRDivHead?: string;
  cWREditor1?: string;
}

export type MainDB_HR_Ext_CWRRead = MainDB_HR_Ext_CWR;
