export interface MainDBPUR {
  /**
   * @displayName ID
   * @description Unique system identifier
   */
  id: number;
  /**
   * @displayName Title
   * @description Human-readable record identifier
   */
  title: string;
  /**
   * @displayName Form Code
   * @description Discriminator field identifying which PUR form this record belongs to
   */
  formCode: string;
  /**
   * @displayName Status Key
   */
  statusKey?: string;
  /**
   * @displayName Source Site
   */
  sourceSite?: string;
  /**
   * @displayName Source Master Index
   */
  sourceMasterIndex?: number;
  /**
   * @displayName App Name
   */
  appName?: string;
  /**
   * @displayName Request Title
   */
  requestTitle?: string;
  /**
   * @displayName Requestor Email
   */
  requestorEmail?: string;
  /**
   * @displayName Submitted On
   */
  submittedOn?: string;
  /**
   * @displayName Current Action
   */
  currentAction?: string;
  /**
   * @displayName Remarks
   */
  remarks?: string;
}
