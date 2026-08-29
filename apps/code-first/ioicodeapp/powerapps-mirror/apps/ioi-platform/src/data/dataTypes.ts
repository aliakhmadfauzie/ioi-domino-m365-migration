/** Uniform result wrapper returned by all data layer wrappers */
export type DataResult<T> =
  | { success: true;  data: T;       error?: never; durationMs: number }
  | { success: false; data?: never;  error: string; durationMs: number };

/** Parameters shared by every read operation */
export interface ReadParams {
  sourceKey: string;
  screenId: string;
  userId?: string;
  filter?: string;
  orderBy?: string | string[];
  top?: number;
  select?: string[];
}

/** Parameters shared by every write operation */
export interface WriteParams {
  sourceKey: string;
  screenId: string;
  actionKey: string;
  userId?: string;
}
