import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { ArrowLeft, Server, Clock, User, HardDrive, Settings, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useMainDBITList } from '@/generated/hooks/use-main-dbit';
import type { MainDBIT } from '@/generated/models/main-dbit-model';

const REQUEST_TYPES: Record<string, string> = {
  'NEW': 'New Server',
  'MODIFY': 'Modify Existing Server',
  'DECOMMISSION': 'Decommission Server',
  'MIGRATION': 'Server Migration',
  'UPGRADE': 'Server Upgrade',
};

const SERVER_TYPES: Record<string, string> = {
  'PHYSICAL': 'Physical Server',
  'VIRTUAL': 'Virtual Machine',
  'CLOUD': 'Cloud Instance',
};

const OPERATING_SYSTEMS: Record<string, string> = {
  'WIN_SRV_2022': 'Windows Server 2022',
  'WIN_SRV_2019': 'Windows Server 2019',
  'WIN_SRV_2016': 'Windows Server 2016',
  'RHEL_9': 'Red Hat Enterprise Linux 9',
  'RHEL_8': 'Red Hat Enterprise Linux 8',
  'SUSE_15': 'SUSE Linux Enterprise 15',
  'UBUNTU_22': 'Ubuntu Server 22.04 LTS',
  'OTHER': 'Other',
};

const CPU_OPTIONS: Record<string, string> = {
  '2': '2 Cores',
  '4': '4 Cores',
  '8': '8 Cores',
  '16': '16 Cores',
  '32': '32 Cores',
  'OTHER': 'Other',
};

const MEMORY_OPTIONS: Record<string, string> = {
  '4GB': '4 GB',
  '8GB': '8 GB',
  '16GB': '16 GB',
  '32GB': '32 GB',
  '64GB': '64 GB',
  '128GB': '128 GB',
  'OTHER': 'Other',
};

const STORAGE_OPTIONS: Record<string, string> = {
  '100GB': '100 GB',
  '250GB': '250 GB',
  '500GB': '500 GB',
  '1TB': '1 TB',
  '2TB': '2 TB',
  'OTHER': 'Other',
};

const NETWORK_OPTIONS: Record<string, string> = {
  'INTERNAL': 'Internal Network Only',
  'DMZ': 'DMZ',
  'EXTERNAL': 'External Access Required',
};

const EXPECTED_USERS: Record<string, string> = {
  '1-10': '1-10 users',
  '11-50': '11-50 users',
  '51-100': '51-100 users',
  '100+': 'More than 100 users',
};

export default function SRVRDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: submissions, isLoading } = useMainDBITList();

  const submission = submissions?.find((s: MainDBIT) => s.title === id && s.formcode === 'SRVR');

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#7c3aed' }} />
          <span style={{ color: '#5C5C5C' }}>Loading request details...</span>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#9B2F23' }} />
            <h2 className="text-lg font-semibold mb-2" style={{ color: '#1C1C1C' }}>Request Not Found</h2>
            <p className="text-sm mb-4" style={{ color: '#5C5C5C' }}>The server request you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/my-submissions')} style={{ backgroundColor: '#7c3aed' }}>
              Back to Submissions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Parse the form data from remarks
  let formData: Record<string, unknown> = {};
  try {
    formData = JSON.parse(submission.remarks || '{}');
  } catch {
    formData = {};
  }

  const getStatusBadge = () => {
    const status = submission.currentStatus;
    switch (status) {
      case 'CurrentstatusKey1':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Pending IT Review</Badge>;
      case 'CurrentstatusKey2':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">HOD Approval</Badge>;
      case 'CurrentstatusKey3':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-300">IT Processing</Badge>;
      case 'CurrentstatusKey4':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'CurrentstatusKey5':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-6" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/my-submissions')}
            className="mb-4 -ml-2"
            style={{ color: '#5C5C5C' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Submissions
          </Button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)' }}
              >
                <Server className="w-6 h-6" style={{ color: '#7c3aed' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1C1C1C', fontFamily: 'Segoe UI' }}>
                  {submission.title}
                </h1>
                <p className="text-sm" style={{ color: '#5C5C5C' }}>
                  Server Request Form
                </p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </div>

        <div className="grid gap-6">
          {/* Submission Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card style={{ borderRadius: '12px' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: '#1C1C1C' }}>
                  <Clock className="w-4 h-4" style={{ color: '#7c3aed' }} />
                  Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Submitted By</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.requestor as string || submission.requestoremail}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Submitted Date</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {submission.submitteddate
                        ? format(new Date(submission.submitteddate), 'dd MMM yyyy, HH:mm')
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Site</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {submission.siteKey === 'SiteKey0' ? 'Johor (MY-JH)' : 'Prai (MY-PR)'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Department</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.department as string || '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Requestor Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card style={{ borderRadius: '12px' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: '#1C1C1C' }}>
                  <User className="w-4 h-4" style={{ color: '#7c3aed' }} />
                  Requestor Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Company</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.company as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Department</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.department as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Phone Extension</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.phoneExt as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>HOD</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.departmentHead as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>CC Recipients</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.ccRecipients as string || '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Server Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card style={{ borderRadius: '12px' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: '#1C1C1C' }}>
                  <HardDrive className="w-4 h-4" style={{ color: '#7c3aed' }} />
                  Server Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Request Type</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {REQUEST_TYPES[formData.requestType as string] || formData.requestType as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Server Type</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {SERVER_TYPES[formData.serverType as string] || formData.serverType as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Server Name</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.serverName as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Operating System</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {OPERATING_SYSTEMS[formData.os as string] || formData.os as string || '-'}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-4 h-4" style={{ color: '#7c3aed' }} />
                  <span className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>Hardware Specifications</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p style={{ color: '#5C5C5C' }}>CPU</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {CPU_OPTIONS[formData.cpu as string] || formData.cpu as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Memory</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {MEMORY_OPTIONS[formData.memory as string] || formData.memory as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Storage</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {STORAGE_OPTIONS[formData.storage as string] || formData.storage as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Network</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {NETWORK_OPTIONS[formData.network as string] || formData.network as string || '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Purpose & Justification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card style={{ borderRadius: '12px' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2" style={{ color: '#1C1C1C' }}>
                  <FileText className="w-4 h-4" style={{ color: '#7c3aed' }} />
                  Purpose & Justification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Application/System to be hosted</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.application as string || '-'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5C5C5C' }}>Purpose/Business Justification</p>
                    <p className="font-medium" style={{ color: '#1C1C1C' }}>
                      {formData.purpose as string || '-'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p style={{ color: '#5C5C5C' }}>Expected Users</p>
                      <p className="font-medium" style={{ color: '#1C1C1C' }}>
                        {EXPECTED_USERS[formData.expectedUsers as string] || formData.expectedUsers as string || '-'}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#5C5C5C' }}>Required By Date</p>
                      <p className="font-medium" style={{ color: '#1C1C1C' }}>
                        {formData.requiredDate
                          ? format(new Date(formData.requiredDate as string), 'dd MMM yyyy')
                          : '-'}
                      </p>
                    </div>
                  </div>
                  {typeof formData.remarks === 'string' && formData.remarks && (
                    <div>
                      <p style={{ color: '#5C5C5C' }}>Additional Remarks</p>
                      <p className="font-medium" style={{ color: '#1C1C1C' }}>
                        {formData.remarks as string}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
