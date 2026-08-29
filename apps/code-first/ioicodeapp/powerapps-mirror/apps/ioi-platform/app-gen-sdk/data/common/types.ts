export interface IOperationOptions {
  filter?: string;
  orderBy?: string | string[];
  top?: number;
  skip?: number;
  select?: string[];
  expand?: string[];
}
