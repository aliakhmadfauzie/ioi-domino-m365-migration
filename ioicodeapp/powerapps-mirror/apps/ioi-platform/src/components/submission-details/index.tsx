import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainDBITSiteKeyToLabel, MainDBITEnvironmenttagKeyToLabel } from '@/generated/models/main-dbit-model';
import type { MainDBIT } from '@/generated/models/main-dbit-model';
import type { MainDBITExtAccess } from '@/generated/models/main-dbit-ext-access-model';
import type { MainDBITExtSupport } from '@/generated/models/main-dbit-ext-support-model';
import type { ApprovalRecords } from '@/generated/models/approval-records-model';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getStatusLabel } from '@/lib/status-utils';
import {
  User,
  Mail,
  Building2,
  Calendar,
  Server,
  MapPin,
  FileText,
  Tag,
  Hash,
  Shield,
  Globe,
  Phone,
  Key,
  FolderOpen,
  Monitor,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  AtSign,
  Briefcase,
  Network,
  HardDrive,
  Database,
  Settings,
} from 'lucide-react';

interface DynamicSubmissionDetailsProps {
  submission: MainDBIT;
  dataSource: string;
  approvals: ApprovalRecords[];
  extAccessRecords?: MainDBITExtAccess[];
  extSupportRecords?: MainDBITExtSupport[];
  showWorkflow?: boolean;
  showHistory?: boolean;
}

function FieldRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border last:border-b-0">
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">{String(value)}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {children}
      </CardContent>
    </Card>
  );
}

function EAFDetails({ s, extAccess }: { s: MainDBIT; extAccess?: MainDBITExtAccess }) {
  // HApp (Higher Approver) is mapped as eAFHigherApproverEmail in ExtAccess service
  const extAny = extAccess as unknown as Record<string, string | undefined>;
  const higherApproverEmail = extAny?.eafHigherApproverEmail;
  const clientId = extAny?.eafClientId;
  const userGroup = extAny?.eafUserGroup;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Requestor Info" icon={User}>
        <FieldRow icon={User} label="Full Name" value={s.requestorName || extAccess?.eAFTargetUserEmail?.split('@')[0] || '-'} />
        <FieldRow icon={Mail} label="Email" value={extAccess?.eAFTargetUserEmail || s.requestoremail || '-'} />
        <FieldRow icon={Building2} label="Company" value={s.company || '-'} />
        <FieldRow icon={Tag} label="Client ID" value={clientId || '-'} />
        <FieldRow icon={User} label="User Group" value={userGroup || '-'} />
      </SectionCard>
      <SectionCard title="Access Details" icon={Shield}>
        <FieldRow icon={Tag} label="Application" value={extAccess?.eAFApplication || '-'} />
        <FieldRow icon={Monitor} label="System Name" value={extAccess?.eAFSystemName || '-'} />
        <FieldRow icon={Globe} label="Environment" value={s.environmenttagKey ? MainDBITEnvironmenttagKeyToLabel[s.environmenttagKey] : '-'} />
        <FieldRow icon={FileText} label="Justification" value={extAccess?.eAFJustification || s.remarks || '-'} />
        <FieldRow icon={Mail} label="CC Recipients" value={extAccess?.eAFCC || extAccess?.eAFReminderTo || '-'} />
      </SectionCard>
      <SectionCard title="Approval Status" icon={CheckCircle2}>
        <FieldRow icon={User} label="Higher Approver (HApp)" value={higherApproverEmail || '-'} />
        <FieldRow icon={User} label="Dept. Head" value={extAccess?.eAFDeptHeadEmail || '-'} />
        <FieldRow icon={CheckCircle2} label="Dept. Head Status" value={extAccess?.eAFDeptHeadStatus || '-'} />
        <FieldRow icon={Calendar} label="Dept. Head Date" value={extAccess?.eAFDeptHeadDate || '-'} />
        <FieldRow icon={User} label="Div. Director" value={extAccess?.eAFDDAppApprovedBy || '-'} />
        <FieldRow icon={CheckCircle2} label="Div. Director Status" value={extAccess?.eAFDDAppStatus || '-'} />
        <FieldRow icon={Calendar} label="Div. Director Date" value={extAccess?.eAFDDAppDate || '-'} />
        <FieldRow icon={User} label="IT Manager" value={extAccess?.eAFITManagerApprovedBy || '-'} />
        <FieldRow icon={CheckCircle2} label="IT Manager Status" value={extAccess?.eAFITManagerStatus || '-'} />
        <FieldRow icon={Calendar} label="IT Manager Date" value={extAccess?.eAFITManagerDate || '-'} />
      </SectionCard>
      {extAccess?.eAFITConfigStatus && (
        <SectionCard title="IT Configuration" icon={Settings}>
          <FieldRow icon={CheckCircle2} label="Config Status" value={extAccess.eAFITConfigStatus} />
          <FieldRow icon={FileText} label="Config Remarks" value={extAccess.eAFITConfigRemarks} />
        </SectionCard>
      )}
    </div>
  );
}

function ITSSRDetails({ s }: { s: MainDBIT }) {
  // Parse Section 1 snapshot from remarks JSON (stored by ITSSR submission)
  let section1: Record<string, string> = {};
  try {
    const remarks = s.remarks || '';
    const start = remarks.indexOf('[ITSSR_SECTION1_JSON]');
    const end = remarks.indexOf('[/ITSSR_SECTION1_JSON]');
    if (start >= 0 && end > start) {
      section1 = JSON.parse(remarks.slice(start + '[ITSSR_SECTION1_JSON]'.length, end).trim());
    }
  } catch { /* ignore parse errors */ }

  const serviceType = section1.ServiceType || '—';
  const problemDesc = section1.ProblemDescription || s.iTSSRITRemarks || s.remarks?.split('\n')[0] || '—';
  const company = section1.Company || '—';
  const department = section1.Department || '—';
  const assignedTo = section1.SendToEmail || '—';
  const hardware = section1.Hardware || '';
  const application = section1.Application || '';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Requestor Info" icon={User}>
        <FieldRow icon={User} label="Requestor" value={s.requestorName || s.requestoremail?.split('@')[0] || '—'} />
        <FieldRow icon={Mail} label="Email" value={s.requestoremail} />
        <FieldRow icon={Building2} label="Company" value={company} />
        <FieldRow icon={Building2} label="Department" value={department} />
        <FieldRow icon={Calendar} label="Submitted" value={s.submitteddate ? format(new Date(s.submitteddate), 'dd MMM yyyy h:mm a') : '—'} />
      </SectionCard>
      <SectionCard title="Issue Details" icon={AlertCircle}>
        <FieldRow icon={FileText} label="Service Type" value={serviceType} />
        <FieldRow icon={Server} label="Hardware / App" value={hardware || application || '—'} />
        <div className="md:col-span-2">
          <FieldRow icon={AlertCircle} label="Problem Description" value={problemDesc} />
        </div>
      </SectionCard>
      <SectionCard title="Support Info" icon={HeadsetIcon}>
        <FieldRow icon={User} label="Routed to IT" value={assignedTo} />
      </SectionCard>
    </div>
  );
}

const HeadsetIcon = (props: React.ComponentProps<typeof Server>) => <Server {...props} />;

function NIRDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Employee Info" icon={User}>
        <FieldRow icon={User} label="Full Name" value={s.nIRFullName} />
        <FieldRow icon={Hash} label="Employee No." value={s.nIREmployeeNumber} />
        <FieldRow icon={Briefcase} label="Designation" value={s.nIRDesignation} />
        <FieldRow icon={Building2} label="Department" value={s.nIRDepartment} />
        <FieldRow icon={Globe} label="Employee Type" value={s.nIREmployeeType} />
      </SectionCard>
      <SectionCard title="Account Details" icon={AtSign}>
        <FieldRow icon={Mail} label="Existing Email" value={s.nIRExistingEmailAddress} />
        <FieldRow icon={Phone} label="Phone Extension" value={s.nIRPhoneExtension} />
        <FieldRow icon={Tag} label="Request Type" value={s.nIRRequestType} />
      </SectionCard>
      <SectionCard title="Approval Status" icon={CheckCircle2}>
        <FieldRow icon={CheckCircle2} label="HOD Status" value={s.nIRHODApprovalStatus} />
        <FieldRow icon={User} label="HOD Approved By" value={s.nIRHODApprovedBy} />
        <FieldRow icon={Calendar} label="HOD Date" value={s.nIRHODApprovedDate} />
        <FieldRow icon={CheckCircle2} label="Notes Admin" value={s.nIRNotesAdminStatus} />
        <FieldRow icon={User} label="Notes Admin By" value={s.nIRNotesAdminBy} />
        <FieldRow icon={Calendar} label="Notes Admin Date" value={s.nIRNotesAdminDate} />
        <FieldRow icon={CheckCircle2} label="IT Hardware" value={s.nIRITHardwareStatus} />
        <FieldRow icon={User} label="IT Hardware By" value={s.nIRITHardwareBy} />
      </SectionCard>
    </div>
  );
}

function RSDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="User Info" icon={User}>
        <FieldRow icon={User} label="Username" value={s.rSUserName} />
        <FieldRow icon={Briefcase} label="Designation" value={s.rSDesignation} />
        <FieldRow icon={Building2} label="Company" value={s.rSCompany} />
        <FieldRow icon={Building2} label="Department" value={s.rSDepartment} />
        <FieldRow icon={MapPin} label="Location" value={s.rSLocation} />
      </SectionCard>
      <SectionCard title="Reset Details" icon={Key}>
        <FieldRow icon={Tag} label="Reset Type" value={s.rSResetType} />
        <FieldRow icon={FileText} label="Reason" value={s.rSReasonForReset} />
        <FieldRow icon={Shield} label="Token Serial" value={s.rSBankTokenSerial} />
        <FieldRow icon={Mail} label="Executive Director" value={s.rSExecutiveDirectorEmail} />
      </SectionCard>
      <SectionCard title="System Info" icon={Server}>
        <FieldRow icon={Database} label="SAP Client" value={s.rSSAPClient} />
        <FieldRow icon={Globe} label="IEP Client Name" value={s.rSIEPClientName} />
        <FieldRow icon={Mail} label="Target User Email" value={s.rSTargetUserEmail} />
        <FieldRow icon={Tag} label="Request Type" value={s.rSRequestType} />
      </SectionCard>
      <SectionCard title="Processing" icon={Clock}>
        <FieldRow icon={CheckCircle2} label="Needs ED Approval" value={s.rSNeedsEDApproval} />
        <FieldRow icon={User} label="IT Processed By" value={s.rSITProcessedBy} />
        <FieldRow icon={Calendar} label="IT Processed Date" value={s.rSITProcessedDate} />
        <FieldRow icon={User} label="ED Approved By" value={s.rSEDApprovedBy} />
        <FieldRow icon={Calendar} label="ED Approved Date" value={s.rSEDApprovedDate} />
      </SectionCard>
    </div>
  );
}

function SFARDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Requestor Info" icon={User}>
        <FieldRow icon={Building2} label="Company" value={s.sFARCompany} />
        <FieldRow icon={Building2} label="Department" value={s.sFARDepartment} />
        <FieldRow icon={Phone} label="Extension" value={s.sFARExtension} />
        <FieldRow icon={Mail} label="HOD Email" value={s.sFARHODEmail} />
      </SectionCard>
      <SectionCard title="Folder Details" icon={FolderOpen}>
        <FieldRow icon={Tag} label="Folder Type" value={s.sFARFolderType} />
        <FieldRow icon={Server} label="Server Name" value={s.sFARServerName} />
        <FieldRow icon={Tag} label="Request Type" value={s.sFARRequestType} />
        <FieldRow icon={User} label="Owner" value={s.sFAROwner} />
        <FieldRow icon={Shield} label="Access Level" value={s.sFARAccessLevel} />
        <FieldRow icon={FolderOpen} label="Folder Path" value={s.sFARFolderPath} />
      </SectionCard>
      <SectionCard title="Access Details" icon={Key}>
        <FieldRow icon={Mail} label="Access To" value={s.sFARAccessTo} />
        <FieldRow icon={User} label="Access To Name" value={s.sFARAccessToName} />
        <FieldRow icon={FileText} label="Purpose" value={s.sFARPurpose} />
        <FieldRow icon={FileText} label="Justification" value={s.sFARJustification} />
      </SectionCard>
      <SectionCard title="Review" icon={CheckCircle2}>
        <FieldRow icon={User} label="Reviewed By" value={s.sFARReviewedBy} />
        <FieldRow icon={Calendar} label="Reviewed Date" value={s.sFARReviewedDate} />
      </SectionCard>
    </div>
  );
}

function URDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="User Info" icon={User}>
        <FieldRow icon={User} label="Full Name" value={s.uRUserFullName} />
        <FieldRow icon={Hash} label="Employee No." value={s.uREmployeeNumber} />
        <FieldRow icon={Briefcase} label="Designation" value={s.uRDesignation} />
        <FieldRow icon={Building2} label="Company" value={s.uRCompany} />
        <FieldRow icon={Building2} label="Division" value={s.uRDivision} />
        <FieldRow icon={Building2} label="Department" value={s.uRUserDepartment} />
      </SectionCard>
      <SectionCard title="Contact & System" icon={AtSign}>
        <FieldRow icon={Phone} label="Extension" value={s.uRExtension} />
        <FieldRow icon={Mail} label="Email Address" value={s.uREmailAddress} />
        <FieldRow icon={Shield} label="System Access" value={s.uRSystemAccess} />
        <FieldRow icon={Tag} label="Request Type" value={s.uRRequestType} />
      </SectionCard>
      <SectionCard title="Bank Info" icon={Building2}>
        <FieldRow icon={Building2} label="Bank Name" value={s.uRBankName} />
        <FieldRow icon={Mail} label="Bank User Email" value={s.uRBankUserEmail} />
        <FieldRow icon={Globe} label="Plant" value={s.uRPlant} />
      </SectionCard>
      <SectionCard title="IT Processing" icon={Clock}>
        <FieldRow icon={User} label="IT Admin By" value={s.uRITAdminBy} />
        <FieldRow icon={Calendar} label="IT Admin Date" value={s.uRITAdminDate} />
      </SectionCard>
    </div>
  );
}

function PRFDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Request Info" icon={FileText}>
        <FieldRow icon={Hash} label="Request No." value={s.pRFRequestNo} />
        <FieldRow icon={Tag} label="Request Type" value={s.pRFRequestType} />
        <FieldRow icon={Server} label="Is SAP" value={s.pRFIsSAP} />
        <FieldRow icon={Building2} label="Department" value={s.pRFDepartment} />
      </SectionCard>
      <SectionCard title="SAP Details" icon={Database}>
        <FieldRow icon={Database} label="SAP Client" value={s.pRFSAPClient} />
        <FieldRow icon={Globe} label="SAP Module" value={s.pRFSAPModule} />
      </SectionCard>
      <SectionCard title="Priority & Timeline" icon={Calendar}>
        <FieldRow icon={Tag} label="Priority" value={s.pRFPriority} />
        <FieldRow icon={Calendar} label="Deadline" value={s.pRFDeadline} />
        <FieldRow icon={Phone} label="Phone Ext." value={s.pRFPhoneExt} />
        <FieldRow icon={Mail} label="CC Emails" value={s.pRFCCEmails} />
        <FieldRow icon={Mail} label="Dept. Manager Email" value={s.pRFDeptManagerEmail} />
      </SectionCard>
      <SectionCard title="Objectives" icon={FileText}>
        <FieldRow icon={FileText} label="Objective" value={s.pRFObjective} />
        <FieldRow icon={FileText} label="Justification" value={s.pRFJustification} />
        <FieldRow icon={FileText} label="Current Process" value={s.pRFCurrentProcess} />
        <FieldRow icon={FileText} label="Expected Outcome" value={s.pRFExpectedOutcome} />
      </SectionCard>
    </div>
  );
}

function HIDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Asset Info" icon={Monitor}>
        <FieldRow icon={Tag} label="Tag No." value={s.hITagNo} />
        <FieldRow icon={Hash} label="Asset No." value={s.hIAssetNo} />
        <FieldRow icon={Monitor} label="Computer Name" value={s.hIComputerName} />
        <FieldRow icon={HardDrive} label="Type" value={s.hIType} />
        <FieldRow icon={Hash} label="Serial No." value={s.hISerialNo} />
      </SectionCard>
      <SectionCard title="Assignment" icon={User}>
        <FieldRow icon={Building2} label="Company" value={s.hICompany} />
        <FieldRow icon={Building2} label="Department" value={s.hIDepartment} />
        <FieldRow icon={User} label="Used By" value={s.hIUsedByEmail} />
        <FieldRow icon={MapPin} label="Location" value={s.hILocation} />
      </SectionCard>
      <SectionCard title="Purchase & Warranty" icon={DollarSign}>
        <FieldRow icon={DollarSign} label="Purchase Price" value={s.hIPurchasePrice} />
        <FieldRow icon={Calendar} label="Purchase Date" value={s.hIPurchaseDate} />
        <FieldRow icon={Calendar} label="Warranty Expiry" value={s.hIWarrantyExpiry} />
        <FieldRow icon={Building2} label="Vendor" value={s.hIVendor} />
        <FieldRow icon={Hash} label="PO Number" value={s.hIPONumber} />
      </SectionCard>
      <SectionCard title="Status" icon={CheckCircle2}>
        <FieldRow icon={Tag} label="Status" value={s.hIStatus} />
        <FieldRow icon={Tag} label="Condition" value={s.hICondition} />
        <FieldRow icon={FileText} label="Specifications" value={s.hISpecifications} />
        <FieldRow icon={Calendar} label="Year" value={s.hIYear} />
        <FieldRow icon={Calendar} label="Month" value={s.hIMonth} />
      </SectionCard>
    </div>
  );
}

function SAPSOFDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="SAP Details" icon={Database}>
        <FieldRow icon={Database} label="SAP Client" value={s.pRFSAPClient} />
        <FieldRow icon={Globe} label="SAP Module" value={s.pRFSAPModule} />
        <FieldRow icon={Building2} label="Department" value={s.pRFDepartment} />
      </SectionCard>
      <SectionCard title="Request Info" icon={FileText}>
        <FieldRow icon={FileText} label="Description" value={s.remarks} />
        <FieldRow icon={User} label="Requestor" value={s.requestorName} />
      </SectionCard>
    </div>
  );
}

function SAPAMRDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Request Info" icon={FileText}>
        <FieldRow icon={FileText} label="Title" value={s.title} />
        <FieldRow icon={User} label="Requestor" value={s.requestorName || s.requestoremail} />
        <FieldRow icon={Calendar} label="Submitted" value={s.submitteddate ? format(new Date(s.submitteddate), 'dd MMM yyyy') : undefined} />
        <FieldRow icon={Building2} label="Company" value={s.company} />
      </SectionCard>
      <SectionCard title="Authorisation Matrix" icon={Shield}>
        <FieldRow icon={User} label="TBV (Technical)" value={s.sAPAMRTBVEmail} />
        <FieldRow icon={User} label="TBA (Business)" value={s.sAPAMRTBAEmail} />
        <FieldRow icon={User} label="TBV 1" value={s.sAPAMRTBV1Email} />
        <FieldRow icon={User} label="TBV 2" value={s.sAPAMRTBV2Email} />
        <FieldRow icon={User} label="TBV 3" value={s.sAPAMRTBV3Email} />
        <FieldRow icon={User} label="TBV 4" value={s.sAPAMRTBV4Email} />
        <FieldRow icon={User} label="TBV 5" value={s.sAPAMRTBV5Email} />
      </SectionCard>
      <SectionCard title="Details" icon={FileText}>
        <FieldRow icon={FileText} label="Remarks" value={s.remarks} />
      </SectionCard>
    </div>
  );
}

function SRVRDetails({ s }: { s: MainDBIT }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SectionCard title="Record Info" icon={Server}>
        <FieldRow icon={FileText} label="Title" value={s.title} />
        <FieldRow icon={User} label="Requestor" value={s.requestorName || s.requestoremail} />
        <FieldRow icon={Calendar} label="Submitted" value={s.submitteddate ? format(new Date(s.submitteddate), 'dd MMM yyyy') : undefined} />
        <FieldRow icon={MapPin} label="Site" value={s.siteKey ? MainDBITSiteKeyToLabel[s.siteKey] : undefined} />
      </SectionCard>
      <SectionCard title="Server Details" icon={HardDrive}>
        <FieldRow icon={FileText} label="Description" value={s.remarks} />
      </SectionCard>
    </div>
  );
}

export function DynamicSubmissionDetails({
  submission,
  dataSource,
  approvals,
  extAccessRecords,
  extSupportRecords,
  showWorkflow = true,
  showHistory = true,
}: DynamicSubmissionDetailsProps) {
  const formCode = submission.formcode?.toUpperCase() || '';

  // Find matching extension records by parent ID
  const extAccess = extAccessRecords?.find(
    (ext) => ext.parentRecord?.id === submission.id
  );
  const extSupport = extSupportRecords?.find(
    (ext) => ext.parentRecord?.id === submission.id
  );

  const renderFormDetails = () => {
    switch (formCode) {
      case 'EAF':
        return <EAFDetails s={submission} extAccess={extAccess} />;
      case 'ITSSR':
        return <ITSSRDetails s={submission} />;
      case 'NIR':
        return <NIRDetails s={submission} />;
      case 'RS':
        return <RSDetails s={submission} />;
      case 'SFAR':
        return <SFARDetails s={submission} />;
      case 'UR':
        return <URDetails s={submission} />;
      case 'PRF':
        return <PRFDetails s={submission} />;
      case 'SAPSOF':
        return <SAPSOFDetails s={submission} />;
      case 'SAPAMR':
        return <SAPAMRDetails s={submission} />;
      case 'SRVR':
      case 'IAL4':
        return <SRVRDetails s={submission} />;
      case 'HI':
        return <HIDetails s={submission} />;
      default:
        const hasData = submission.formcode || submission.id || submission.title || submission.requestorName || submission.requestoremail || submission.submitteddate || submission.siteKey || submission.remarks || submission.currentStatus || submission.workflowstage || submission.environmenttagKey || submission.islocked;
        if (!hasData) {
          return (
            <div className="flex items-center justify-center py-12 text-center">
              <div className="space-y-2">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground/60">No submission data available</p>
              </div>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard title="Submission Info" icon={FileText}>
              <FieldRow icon={Tag} label="Form Code" value={submission.formcode} />
              <FieldRow icon={Hash} label="ID" value={submission.id} />
              <FieldRow icon={FileText} label="Title" value={submission.title} />
              <FieldRow icon={User} label="Requestor" value={submission.requestorName || submission.requestoremail} />
              <FieldRow icon={Calendar} label="Submitted" value={submission.submitteddate ? format(new Date(submission.submitteddate), 'dd MMM yyyy') : undefined} />
              <FieldRow icon={MapPin} label="Site" value={submission.siteKey ? MainDBITSiteKeyToLabel[submission.siteKey] : undefined} />
              <FieldRow icon={FileText} label="Remarks" value={submission.remarks} />
              <FieldRow icon={Tag} label="Status" value={getStatusLabel(submission.currentStatus)} />
              <FieldRow icon={Layers} label="Stage" value={submission.workflowstage} />
              <FieldRow icon={Globe} label="Environment" value={submission.environmenttagKey ? MainDBITEnvironmenttagKeyToLabel[submission.environmenttagKey] : undefined} />
              <FieldRow icon={Shield} label="Locked" value={submission.islocked ? 'Yes' : 'No'} />
            </SectionCard>
          </div>
        );
    }
  };

  if (showWorkflow || showHistory) {
    return (
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full border-b border-border bg-transparent p-0 h-auto rounded-none gap-0">
          <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground">
            <FileText className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          {showWorkflow && (
            <TabsTrigger value="workflow" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground">
              <Layers className="h-4 w-4 mr-2" />
              Workflow
            </TabsTrigger>
          )}
          {showHistory && (
            <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="details" className="mt-4">
          {renderFormDetails()}
        </TabsContent>
        {showWorkflow && (
          <TabsContent value="workflow" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Workflow Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <FieldRow icon={Layers} label="Current Stage" value={submission.workflowstage || 1} />
                  <FieldRow icon={CheckCircle2} label="Status" value={getStatusLabel(submission.currentStatus)} />
                  <FieldRow icon={Calendar} label="Submitted" value={submission.submitteddate ? format(new Date(submission.submitteddate), 'dd MMM yyyy') : undefined} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {showHistory && (
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Approval History</CardTitle>
              </CardHeader>
              <CardContent>
                {approvals.filter((a: ApprovalRecords) => a.formid === String(submission.id)).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No approval history yet</p>
                ) : (
                  <div className="space-y-3">
                    {approvals
                      .filter((a: ApprovalRecords) => a.formid === String(submission.id))
                      .map((record: ApprovalRecords) => (
                        <div key={record.id} className="flex gap-3 text-sm border-b border-border pb-2">
                          <div>
                            <p className="font-medium">{record.stagename || record.actionKey || 'Action'}</p>
                            <p className="text-muted-foreground">{record.actionbyname || 'System'}</p>
                            {record.actiondate && (
                              <p className="text-xs text-muted-foreground">{format(new Date(record.actiondate), 'MMM d, yyyy • h:mm a')}</p>
                            )}
                            {record.comments && <p className="mt-1 italic">"{record.comments}"</p>}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    );
  }

  return renderFormDetails();
}
