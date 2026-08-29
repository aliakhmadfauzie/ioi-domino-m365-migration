import { useMemo, useCallback } from 'react';
import { useAttachmentIndexHRList, useCreateAttachmentIndexHR, useDeleteAttachmentIndexHR } from '@/generated/hooks/use-attachment-index-hr';
import type { Attachment } from '@/components/attachments';
import { useUser } from '@/hooks/use-user';
import { v4 as uuidv4 } from 'uuid';

interface UseAttachmentsOptions {
  department: 'IT' | 'HR' | 'STR' | 'QA' | 'FIN' | 'PRD' | 'SHE';
  recordId?: string;
  formCode?: string;
}

// Simulated IT attachments since we don't have a dedicated IT attachment table
const SAMPLE_IT_ATTACHMENTS: Attachment[] = [
  {
    id: 'att-it-001',
    fileName: 'SAP_Authorization_Matrix.xlsx',
    fileURL: 'https://sharepoint.com/sites/ioi/attachments/sap_auth_matrix.xlsx',
    fileType: 'xlsx',
    fileSizeKB: 245,
    category: 'Supporting Document',
    uploadedBy: 'ahsha@ioioleo.com',
    uploadedByName: 'Ahsha',
    uploadedOn: '2026-05-10T08:30:00Z',
    recordID: 'SAPAMR-202605-0001',
    formCode: 'SAPAMR',
  },
  {
    id: 'att-it-002',
    fileName: 'VPN_Request_Approval.pdf',
    fileURL: 'https://sharepoint.com/sites/ioi/attachments/vpn_approval.pdf',
    fileType: 'pdf',
    fileSizeKB: 156,
    category: 'Approval Letter',
    uploadedBy: 'naufal@ioioleo.com',
    uploadedByName: 'Naufal',
    uploadedOn: '2026-05-08T14:20:00Z',
    recordID: 'EAF-202605-0002',
    formCode: 'EAF',
  },
  {
    id: 'att-it-003',
    fileName: 'Password_Reset_Screenshot.png',
    fileURL: 'https://sharepoint.com/sites/ioi/attachments/reset_screenshot.png',
    fileType: 'png',
    fileSizeKB: 89,
    category: 'Screenshot',
    uploadedBy: 'malanihr@ioioleo.com',
    uploadedByName: 'Malani',
    uploadedOn: '2026-05-07T09:15:00Z',
    recordID: 'RS-202605-0003',
    formCode: 'RS',
  },
  {
    id: 'att-it-004',
    fileName: 'Transport_Request_Details.docx',
    fileURL: 'https://sharepoint.com/sites/ioi/attachments/tr_details.docx',
    fileType: 'docx',
    fileSizeKB: 78,
    category: 'Reference',
    uploadedBy: 'ravindran@ioioleo.com',
    uploadedByName: 'Ravindran',
    uploadedOn: '2026-05-05T11:45:00Z',
    recordID: 'SAPTR-202605-0001',
    formCode: 'SAPTR',
  },
  {
    id: 'att-it-005',
    fileName: 'Hardware_Inventory_List.csv',
    fileURL: 'https://sharepoint.com/sites/ioi/attachments/hw_inventory.csv',
    fileType: 'csv',
    fileSizeKB: 320,
    category: 'Supporting Document',
    uploadedBy: 'ahsha@ioioleo.com',
    uploadedByName: 'Ahsha',
    uploadedOn: '2026-05-03T16:00:00Z',
    recordID: 'HI-202605-0001',
    formCode: 'HI',
  },
  {
    id: 'att-it-006',
    fileName: 'SSR_Ticket_Evidence.jpg',
    fileURL: 'https://sharepoint.com/sites/ioi/attachments/ssr_evidence.jpg',
    fileType: 'jpg',
    fileSizeKB: 412,
    category: 'Evidence',
    uploadedBy: 'naufal@ioioleo.com',
    uploadedByName: 'Naufal',
    uploadedOn: '2026-05-01T10:30:00Z',
    recordID: 'ITSSR-202605-0004',
    formCode: 'ITSSR',
  },
];

const SAMPLE_HR_ATTACHMENTS: Attachment[] = [
  {
    id: 'att-hr-001',
    fileName: 'Employee_Onboarding_Checklist.pdf',
    fileURL: 'https://sharepoint.com/sites/ioi/hr/onboarding_checklist.pdf',
    fileType: 'pdf',
    fileSizeKB: 189,
    category: 'Supporting Document',
    uploadedBy: 'malanihr@ioioleo.com',
    uploadedByName: 'Malani',
    uploadedOn: '2026-05-12T09:00:00Z',
    recordID: 'HR-ONB-001',
    formCode: 'ONB',
  },
  {
    id: 'att-hr-002',
    fileName: 'Leave_Application_Form.docx',
    fileURL: 'https://sharepoint.com/sites/ioi/hr/leave_form.docx',
    fileType: 'docx',
    fileSizeKB: 56,
    category: 'Reference',
    uploadedBy: 'kelly@ioioleo.com',
    uploadedByName: 'Kelly Chan',
    uploadedOn: '2026-05-10T14:30:00Z',
    recordID: 'HR-LVE-001',
    formCode: 'LVE',
  },
  {
    id: 'att-hr-003',
    fileName: 'Training_Certificate.png',
    fileURL: 'https://sharepoint.com/sites/ioi/hr/training_cert.png',
    fileType: 'png',
    fileSizeKB: 234,
    category: 'Evidence',
    uploadedBy: 'ravimadhu@ioioleo.com',
    uploadedByName: 'Ravi Madhu',
    uploadedOn: '2026-05-08T11:15:00Z',
    recordID: 'HR-TRN-001',
    formCode: 'TRN',
  },
  {
    id: 'att-hr-004',
    fileName: 'Exit_Interview_Notes.pdf',
    fileURL: 'https://sharepoint.com/sites/ioi/hr/exit_interview.pdf',
    fileType: 'pdf',
    fileSizeKB: 145,
    category: 'Supporting Document',
    uploadedBy: 'malanihr@ioioleo.com',
    uploadedByName: 'Malani',
    uploadedOn: '2026-05-05T16:45:00Z',
    recordID: 'HR-EXT-001',
    formCode: 'EXT',
  },
  {
    id: 'att-hr-005',
    fileName: 'Performance_Review_Q1.xlsx',
    fileURL: 'https://sharepoint.com/sites/ioi/hr/perf_review_q1.xlsx',
    fileType: 'xlsx',
    fileSizeKB: 378,
    category: 'Reference',
    uploadedBy: 'kelly@ioioleo.com',
    uploadedByName: 'Kelly Chan',
    uploadedOn: '2026-05-02T10:00:00Z',
    recordID: 'HR-PRF-001',
    formCode: 'PRF',
  },
];

export function useAttachments(options: UseAttachmentsOptions) {
  const { department, recordId, formCode } = options;
  const { data: user } = useUser();

  // For HR, use the actual SharePoint list
  const { data: hrAttachments, isLoading: hrLoading, refetch: refetchHR } = useAttachmentIndexHRList();
  const createHRAttachment = useCreateAttachmentIndexHR();
  const deleteHRAttachment = useDeleteAttachmentIndexHR();

  // Transform HR SharePoint data to Attachment format
  const transformedHRAttachments = useMemo(() => {
    if (!hrAttachments || department !== 'HR') return [];
    
    return hrAttachments.map((item: any): Attachment => ({
      id: String(item.id),
      fileName: item.fileName || item.title || 'Unknown',
      fileURL: item.fileURL || '',
      fileType: (item.fileName || '').split('.').pop() || 'unknown',
      fileSizeKB: 0, // Not available in current schema
      category: item.appName || 'Other',
      uploadedBy: item.uploadedBy || '',
      uploadedByName: item.uploadedBy || 'Unknown',
      uploadedOn: item.uploadedOn || new Date().toISOString(),
      recordID: item.recordID || '',
      formCode: item.appName || '',
    }));
  }, [hrAttachments, department]);

  // Get attachments based on department
  const attachments = useMemo(() => {
    let allAttachments: Attachment[] = [];

    switch (department) {
      case 'IT':
        allAttachments = SAMPLE_IT_ATTACHMENTS;
        break;
      case 'HR':
        allAttachments = transformedHRAttachments.length > 0 
          ? transformedHRAttachments 
          : SAMPLE_HR_ATTACHMENTS;
        break;
      default:
        allAttachments = [];
    }

    // Filter by recordId if provided
    if (recordId) {
      allAttachments = allAttachments.filter((a: Attachment) => a.recordID === recordId);
    }

    // Filter by formCode if provided
    if (formCode) {
      allAttachments = allAttachments.filter((a: Attachment) => a.formCode === formCode);
    }

    return allAttachments;
  }, [department, recordId, formCode, transformedHRAttachments]);

  const isLoading = department === 'HR' ? hrLoading : false;

  const refetch = useCallback(() => {
    if (department === 'HR') {
      refetchHR();
    }
  }, [department, refetchHR]);

  const uploadAttachments = useCallback(
    async (files: File[], category: string) => {
      if (!user) throw new Error('User not authenticated');

      // In a real implementation, this would:
      // 1. Upload file to SharePoint document library
      // 2. Create record in AttachmentIndex table
      
      for (const file of files) {
        const attachmentData = {
          title: file.name,
          fileName: file.name,
          fileURL: `https://sharepoint.com/sites/ioi/${department.toLowerCase()}/${file.name}`,
          appName: formCode || department,
          recordID: recordId || '',
          attachmentID: uuidv4(),
          uploadedBy: user.userPrincipalName,
          uploadedOn: new Date().toISOString(),
          siteKey: 'SiteKey0' as const, // Prai
        };

        if (department === 'HR') {
          await createHRAttachment.mutateAsync(attachmentData as any);
        } else {
          // For IT and other departments, simulate upload
          // In production, would call respective service
          console.log('Uploading to', department, attachmentData);
          // Simulate delay
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      refetch();
    },
    [user, department, formCode, recordId, createHRAttachment, refetch]
  );

  const deleteAttachment = useCallback(
    async (attachmentId: string) => {
      if (department === 'HR') {
        await deleteHRAttachment.mutateAsync(attachmentId);
      } else {
        // For IT and other departments, simulate delete
        console.log('Deleting attachment', attachmentId, 'from', department);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      refetch();
    },
    [department, deleteHRAttachment, refetch]
  );

  return {
    attachments,
    isLoading,
    refetch,
    uploadAttachments,
    deleteAttachment,
  };
}

// Hook for getting all attachments for a department (for index page)
export function useAllDepartmentAttachments(department: 'IT' | 'HR' | 'STR' | 'QA' | 'FIN' | 'PRD' | 'SHE') {
  return useAttachments({ department });
}