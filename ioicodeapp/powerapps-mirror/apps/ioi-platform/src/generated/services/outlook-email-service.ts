/**
 * Office 365 Outlook Service (Email)
 * Auto-generated from Power Platform connector schema
 * NOTE: Stub implementation — replace with actual PAC-generated service
 */

export interface ClientSendHtmlMessage {
  To?: string[];
  Cc?: string[];
  Bcc?: string[];
  Subject?: string;
  Body?: string;
  Importance?: 'Normal' | 'Low' | 'High';
  ShowAs?: 'Draft' | 'Sent';
  ReplyTo?: string[];
}

export class Office365OutlookService {
  static async SendEmailV2(message: ClientSendHtmlMessage): Promise<void> {
    return;
  }
}
