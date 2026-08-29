/**
 * IOI Employee Directory SharePoint list
 * Site: https://ioioi.sharepoint.com/sites/IOI-App_Admin_Sites
 * List: IOI Employee Directory
 */

export interface IOIEmployeeDirectory {
  /**
   * @displayName ID
   * @uiConstraints NEVER create input fields for this ID
   */
  id: number;
  /**
   * @displayName Company
   * Company name (SP Title column)
   */
  title?: string;
  /**
   * @displayName Name
   * Full name of the employee (SP field_1 column)
   */
  field_1?: string;
  /**
   * @displayName Internet Address
   * Employee email address
   */
  internetAddress?: string;
  /**
   * @displayName Department
   */
  department?: string;
  /**
   * @displayName Job Title
   */
  jobTitle?: string;
  /**
   * @displayName Work Phone
   */
  workPhone?: string;
  /**
   * @displayName Office
   */
  office?: string;
}

export const _IOIEmployeeDirectory = 'IOIEmployeeDirectory' as const;
