// =============================================================================
// M2 IT SUPPORT & SERVICE REQUESTS - COMPLETE FORM FIELD DEFINITIONS
// =============================================================================

import type { FormField, FormSection } from './it-forms-config';

// =============================================================================
// IAL1 - SERVER REBOOT LOG
// =============================================================================

export const IAL1_SECTIONS: FormSection[] = [
  {
    id: 'server-info',
    title: 'Server Information',
    description: 'Identify the server being rebooted',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'serverName',
        label: 'Server Name',
        type: 'text',
        placeholder: 'e.g., PRAI-SRV-01',
        required: true,
        helperText: 'Enter the hostname of the server',
      },
      {
        id: 'serverIP',
        label: 'Server IP Address',
        type: 'text',
        placeholder: 'e.g., 192.168.1.100',
        required: true,
      },
      {
        id: 'serverType',
        label: 'Server Type',
        type: 'select',
        required: true,
        options: [
          { value: 'production', label: 'Production' },
          { value: 'staging', label: 'Staging' },
          { value: 'development', label: 'Development' },
          { value: 'backup', label: 'Backup' },
        ],
      },
      {
        id: 'operatingSystem',
        label: 'Operating System',
        type: 'select',
        required: true,
        options: [
          { value: 'windows-server-2022', label: 'Windows Server 2022' },
          { value: 'windows-server-2019', label: 'Windows Server 2019' },
          { value: 'rhel-8', label: 'RHEL 8' },
          { value: 'ubuntu-22', label: 'Ubuntu 22.04 LTS' },
          { value: 'centos-7', label: 'CentOS 7' },
        ],
      },
      {
        id: 'location',
        label: 'Server Location',
        type: 'select',
        required: true,
        options: [
          { value: 'MY-PR', label: 'Prai Data Center' },
          { value: 'MY-JH', label: 'Johor Data Center' },
          { value: 'DR-Site', label: 'DR Site' },
        ],
      },
    ],
  },
  {
    id: 'reboot-details',
    title: 'Reboot Details',
    description: 'Document the reboot event details',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'rebootDate',
        label: 'Reboot Date',
        type: 'date',
        required: true,
      },
      {
        id: 'rebootTime',
        label: 'Reboot Time',
        type: 'text',
        placeholder: 'HH:MM (24-hour format)',
        required: true,
      },
      {
        id: 'rebootType',
        label: 'Reboot Type',
        type: 'select',
        required: true,
        options: [
          { value: 'scheduled', label: 'Scheduled Maintenance' },
          { value: 'emergency', label: 'Emergency Reboot' },
          { value: 'patch', label: 'Patch Application' },
          { value: 'hardware', label: 'Hardware Change' },
          { value: 'unplanned', label: 'Unplanned Outage' },
        ],
      },
      {
        id: 'rebootReason',
        label: 'Reason for Reboot',
        type: 'textarea',
        placeholder: 'Describe why the server was rebooted',
        required: true,
      },
      {
        id: 'affectedServices',
        label: 'Affected Services',
        type: 'textarea',
        placeholder: 'List all services/applications affected by this reboot',
      },
      {
        id: 'estimatedDowntime',
        label: 'Estimated Downtime (minutes)',
        type: 'number',
        placeholder: 'e.g., 15',
      },
      {
        id: 'actualDowntime',
        label: 'Actual Downtime (minutes)',
        type: 'number',
        placeholder: 'e.g., 12',
      },
    ],
  },
  {
    id: 'verification',
    title: 'Post-Reboot Verification',
    description: 'Confirm server is functioning correctly after reboot',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'serviceRestored',
        label: 'All services restored successfully',
        type: 'checkbox',
        helperText: 'Check if all services are running normally',
      },
      {
        id: 'networkConnectivity',
        label: 'Network connectivity verified',
        type: 'checkbox',
        helperText: 'Confirm server is reachable on the network',
      },
      {
        id: 'applicationHealth',
        label: 'Application health checks passed',
        type: 'checkbox',
        helperText: 'All application health checks are green',
      },
      {
        id: 'monitoringActive',
        label: 'Monitoring alerts cleared',
        type: 'checkbox',
        helperText: 'No active alerts in monitoring system',
      },
      {
        id: 'verificationNotes',
        label: 'Verification Notes',
        type: 'textarea',
        placeholder: 'Any additional notes from post-reboot verification',
      },
      {
        id: 'verifiedBy',
        label: 'Verified By',
        type: 'people',
        placeholder: 'Search for verifier...',
        required: true,
      },
    ],
  },
];

// =============================================================================
// IAL2 - DATA CENTER ACCESS LOG
// =============================================================================

export const IAL2_SECTIONS: FormSection[] = [
  {
    id: 'visitor-info',
    title: 'Visitor Information',
    description: 'Details of the person accessing the data center',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'visitorName',
        label: 'Visitor Name',
        type: 'people',
        placeholder: 'Search for visitor...',
        required: true,
      },
      {
        id: 'visitorCompany',
        label: 'Company/Department',
        type: 'text',
        placeholder: 'Company or IOI department',
        required: true,
      },
      {
        id: 'visitorType',
        label: 'Visitor Type',
        type: 'select',
        required: true,
        options: [
          { value: 'ioi-staff', label: 'IOI Staff' },
          { value: 'contractor', label: 'Contractor' },
          { value: 'vendor', label: 'Vendor' },
          { value: 'auditor', label: 'Auditor' },
          { value: 'guest', label: 'Guest' },
        ],
      },
      {
        id: 'idNumber',
        label: 'ID/Badge Number',
        type: 'text',
        placeholder: 'Employee ID or visitor badge number',
        required: true,
      },
      {
        id: 'contactNumber',
        label: 'Contact Number',
        type: 'text',
        placeholder: '+60 12-345-6789',
      },
    ],
  },
  {
    id: 'access-details',
    title: 'Access Details',
    description: 'Reason and scope of data center access',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'accessDate',
        label: 'Access Date',
        type: 'date',
        required: true,
      },
      {
        id: 'entryTime',
        label: 'Entry Time',
        type: 'text',
        placeholder: 'HH:MM (24-hour format)',
        required: true,
      },
      {
        id: 'dataCenterLocation',
        label: 'Data Center Location',
        type: 'select',
        required: true,
        options: [
          { value: 'MY-PR-DC1', label: 'Prai DC - Main Hall' },
          { value: 'MY-PR-DC2', label: 'Prai DC - Server Room 2' },
          { value: 'MY-JH-DC1', label: 'Johor DC - Main Hall' },
          { value: 'DR-Site', label: 'DR Site' },
        ],
      },
      {
        id: 'accessPurpose',
        label: 'Purpose of Access',
        type: 'select',
        required: true,
        options: [
          { value: 'maintenance', label: 'Hardware Maintenance' },
          { value: 'installation', label: 'Equipment Installation' },
          { value: 'troubleshooting', label: 'Troubleshooting' },
          { value: 'audit', label: 'Audit/Inspection' },
          { value: 'cabling', label: 'Cabling Work' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'accessDescription',
        label: 'Detailed Description',
        type: 'textarea',
        placeholder: 'Describe the specific tasks to be performed',
        required: true,
      },
      {
        id: 'equipmentBrought',
        label: 'Equipment Brought In',
        type: 'textarea',
        placeholder: 'List any tools, laptops, or equipment brought into the data center',
      },
      {
        id: 'escortedBy',
        label: 'Escorted By (if applicable)',
        type: 'people',
        placeholder: 'Search for IOI IT staff escort...',
      },
    ],
  },
  {
    id: 'exit-time',
    title: 'Exit Information',
    description: 'Record exit time and any items removed',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'exitTime',
        label: 'Exit Time',
        type: 'text',
        placeholder: 'HH:MM (24-hour format)',
      },
      {
        id: 'equipmentRemoved',
        label: 'Equipment Removed',
        type: 'textarea',
        placeholder: 'List any equipment removed from the data center',
      },
      {
        id: 'workCompleted',
        label: 'Work completed successfully',
        type: 'checkbox',
      },
      {
        id: 'incidentReported',
        label: 'Any incidents to report',
        type: 'checkbox',
      },
      {
        id: 'incidentDetails',
        label: 'Incident Details',
        type: 'textarea',
        placeholder: 'Describe any incidents that occurred',
      },
      {
        id: 'securitySignOff',
        label: 'Security Sign-Off Name',
        type: 'people',
        placeholder: 'Search for security personnel...',
      },
    ],
  },
];

// =============================================================================
// IAL3 - IT EVENT LOG
// =============================================================================

export const IAL3_SECTIONS: FormSection[] = [
  {
    id: 'event-info',
    title: 'Event Information',
    description: 'Basic details about the IT event',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'eventTitle',
        label: 'Event Title',
        type: 'text',
        placeholder: 'Brief description of the event',
        required: true,
      },
      {
        id: 'eventType',
        label: 'Event Type',
        type: 'select',
        required: true,
        options: [
          { value: 'incident', label: 'Incident' },
          { value: 'outage', label: 'Service Outage' },
          { value: 'security', label: 'Security Event' },
          { value: 'maintenance', label: 'Maintenance Window' },
          { value: 'change', label: 'Change Implementation' },
          { value: 'alert', label: 'Monitoring Alert' },
        ],
      },
      {
        id: 'severity',
        label: 'Severity Level',
        type: 'select',
        required: true,
        options: [
          { value: 'critical', label: 'Critical - Immediate Action Required' },
          { value: 'high', label: 'High - Urgent' },
          { value: 'medium', label: 'Medium - Normal Priority' },
          { value: 'low', label: 'Low - Informational' },
        ],
      },
      {
        id: 'eventDate',
        label: 'Event Date',
        type: 'date',
        required: true,
      },
      {
        id: 'eventTime',
        label: 'Event Time',
        type: 'text',
        placeholder: 'HH:MM (24-hour format)',
        required: true,
      },
      {
        id: 'reportedBy',
        label: 'Reported By',
        type: 'people',
        required: true,
      },
    ],
  },
  {
    id: 'impact',
    title: 'Impact Assessment',
    description: 'Assess the impact of the event',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'affectedSystems',
        label: 'Affected Systems',
        type: 'textarea',
        placeholder: 'List all systems, servers, or applications affected',
        required: true,
      },
      {
        id: 'affectedUsers',
        label: 'Number of Affected Users',
        type: 'select',
        options: [
          { value: '1-10', label: '1-10 users' },
          { value: '11-50', label: '11-50 users' },
          { value: '51-100', label: '51-100 users' },
          { value: '100+', label: 'More than 100 users' },
          { value: 'all', label: 'All users / Company-wide' },
        ],
      },
      {
        id: 'businessImpact',
        label: 'Business Impact',
        type: 'textarea',
        placeholder: 'Describe the impact on business operations',
        required: true,
      },
      {
        id: 'downtime',
        label: 'Total Downtime (minutes)',
        type: 'number',
        placeholder: 'Enter 0 if no downtime',
      },
    ],
  },
  {
    id: 'resolution',
    title: 'Resolution',
    description: 'How the event was resolved',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'rootCause',
        label: 'Root Cause',
        type: 'textarea',
        placeholder: 'Describe the root cause of the event',
      },
      {
        id: 'actionsTaken',
        label: 'Actions Taken',
        type: 'textarea',
        placeholder: 'List all actions taken to resolve the event',
        required: true,
      },
      {
        id: 'resolutionTime',
        label: 'Resolution Time',
        type: 'text',
        placeholder: 'HH:MM (24-hour format)',
      },
      {
        id: 'preventiveMeasures',
        label: 'Preventive Measures',
        type: 'textarea',
        placeholder: 'Measures to prevent recurrence',
      },
      {
        id: 'lessonsLearned',
        label: 'Lessons Learned',
        type: 'textarea',
        placeholder: 'Key takeaways from this event',
      },
      {
        id: 'resolvedBy',
        label: 'Resolved By',
        type: 'people',
        placeholder: 'Search for person who resolved...',
      },
    ],
  },
];

// =============================================================================
// IAL4 - SERVER RECORDS
// =============================================================================

export const IAL4_SECTIONS: FormSection[] = [
  {
    id: 'server-details',
    title: 'Server Details',
    description: 'Core server identification and specifications',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'serverName',
        label: 'Server Name',
        type: 'text',
        placeholder: 'e.g., PRAI-APP-01',
        required: true,
      },
      {
        id: 'serverIP',
        label: 'IP Address',
        type: 'text',
        placeholder: 'e.g., 192.168.1.100',
        required: true,
      },
      {
        id: 'serverRole',
        label: 'Server Role',
        type: 'select',
        required: true,
        options: [
          { value: 'application', label: 'Application Server' },
          { value: 'database', label: 'Database Server' },
          { value: 'web', label: 'Web Server' },
          { value: 'file', label: 'File Server' },
          { value: 'domain', label: 'Domain Controller' },
          { value: 'mail', label: 'Mail Server' },
          { value: 'backup', label: 'Backup Server' },
          { value: 'monitoring', label: 'Monitoring Server' },
        ],
      },
      {
        id: 'environment',
        label: 'Environment',
        type: 'select',
        required: true,
        options: [
          { value: 'production', label: 'Production' },
          { value: 'staging', label: 'Staging' },
          { value: 'development', label: 'Development' },
          { value: 'test', label: 'Test' },
          { value: 'dr', label: 'Disaster Recovery' },
        ],
      },
      {
        id: 'location',
        label: 'Physical Location',
        type: 'select',
        required: true,
        options: [
          { value: 'MY-PR-R1', label: 'Prai DC - Rack 1' },
          { value: 'MY-PR-R2', label: 'Prai DC - Rack 2' },
          { value: 'MY-PR-R3', label: 'Prai DC - Rack 3' },
          { value: 'MY-JH-R1', label: 'Johor DC - Rack 1' },
          { value: 'MY-JH-R2', label: 'Johor DC - Rack 2' },
          { value: 'DR-R1', label: 'DR Site - Rack 1' },
          { value: 'cloud', label: 'Cloud (Azure/AWS)' },
        ],
      },
      {
        id: 'rackPosition',
        label: 'Rack Position (U)',
        type: 'text',
        placeholder: 'e.g., U1-U4',
      },
    ],
  },
  {
    id: 'configuration',
    title: 'Hardware & Software Configuration',
    description: 'Technical specifications and installed software',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'manufacturer',
        label: 'Manufacturer',
        type: 'select',
        options: [
          { value: 'dell', label: 'Dell' },
          { value: 'hp', label: 'HP / HPE' },
          { value: 'ibm', label: 'IBM' },
          { value: 'lenovo', label: 'Lenovo' },
          { value: 'cisco', label: 'Cisco' },
          { value: 'vmware', label: 'VMware (Virtual)' },
          { value: 'hyper-v', label: 'Hyper-V (Virtual)' },
        ],
      },
      {
        id: 'model',
        label: 'Model',
        type: 'text',
        placeholder: 'e.g., PowerEdge R640',
      },
      {
        id: 'serialNumber',
        label: 'Serial Number',
        type: 'text',
        placeholder: 'Enter hardware serial number',
      },
      {
        id: 'cpu',
        label: 'CPU Configuration',
        type: 'text',
        placeholder: 'e.g., 2x Intel Xeon Gold 6230 @ 2.1GHz',
      },
      {
        id: 'ram',
        label: 'Memory (GB)',
        type: 'number',
        placeholder: 'e.g., 128',
      },
      {
        id: 'storage',
        label: 'Storage Configuration',
        type: 'textarea',
        placeholder: 'e.g., 4x 1.2TB SAS SSD RAID 10',
      },
      {
        id: 'operatingSystem',
        label: 'Operating System',
        type: 'select',
        options: [
          { value: 'ws2022', label: 'Windows Server 2022' },
          { value: 'ws2019', label: 'Windows Server 2019' },
          { value: 'ws2016', label: 'Windows Server 2016' },
          { value: 'rhel8', label: 'RHEL 8.x' },
          { value: 'rhel7', label: 'RHEL 7.x' },
          { value: 'ubuntu22', label: 'Ubuntu 22.04 LTS' },
          { value: 'ubuntu20', label: 'Ubuntu 20.04 LTS' },
          { value: 'esxi7', label: 'VMware ESXi 7.x' },
          { value: 'esxi8', label: 'VMware ESXi 8.x' },
        ],
      },
      {
        id: 'installedSoftware',
        label: 'Key Installed Software',
        type: 'textarea',
        placeholder: 'List major applications, databases, services installed',
      },
    ],
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    description: 'Warranty, support contracts, and maintenance schedule',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'purchaseDate',
        label: 'Purchase Date',
        type: 'date',
      },
      {
        id: 'warrantyExpiry',
        label: 'Warranty Expiry Date',
        type: 'date',
      },
      {
        id: 'supportContract',
        label: 'Support Contract',
        type: 'select',
        options: [
          { value: 'none', label: 'No Support Contract' },
          { value: '24x7', label: '24x7 Support' },
          { value: '8x5', label: '8x5 Business Hours' },
          { value: 'nbd', label: 'Next Business Day' },
        ],
      },
      {
        id: 'maintenanceWindow',
        label: 'Preferred Maintenance Window',
        type: 'text',
        placeholder: 'e.g., Sundays 2:00 AM - 6:00 AM',
      },
      {
        id: 'backupSchedule',
        label: 'Backup Schedule',
        type: 'textarea',
        placeholder: 'Describe backup frequency and retention policy',
      },
      {
        id: 'owner',
        label: 'System Owner',
        type: 'people',
        placeholder: 'Search for responsible IT staff...',
        required: true,
      },
      {
        id: 'notes',
        label: 'Additional Notes',
        type: 'textarea',
        placeholder: 'Any other relevant information',
      },
    ],
  },
];

// =============================================================================
// IAL5 - DATA RESTORATION REQUEST
// =============================================================================

export const IAL5_SECTIONS: FormSection[] = [
  {
    id: 'requester-info',
    title: 'Requester Information',
    description: 'Details of the person requesting data restoration',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'requesterName',
        label: 'Requester Name',
        type: 'people',
        required: true,
      },
      {
        id: 'requesterDepartment',
        label: 'Department',
        type: 'text',
        required: true,
      },
      {
        id: 'requesterEmail',
        label: 'Email',
        type: 'email',
        required: true,
      },
      {
        id: 'requesterPhone',
        label: 'Contact Number',
        type: 'text',
        placeholder: 'Ext or mobile number',
      },
      {
        id: 'urgency',
        label: 'Urgency Level',
        type: 'select',
        required: true,
        options: [
          { value: 'critical', label: 'Critical - Within 4 hours' },
          { value: 'high', label: 'High - Within 24 hours' },
          { value: 'normal', label: 'Normal - Within 3 days' },
          { value: 'low', label: 'Low - Within 1 week' },
        ],
      },
    ],
  },
  {
    id: 'data-details',
    title: 'Data to Restore',
    description: 'Specify what data needs to be restored',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'dataType',
        label: 'Data Type',
        type: 'select',
        required: true,
        options: [
          { value: 'files', label: 'Files/Folders' },
          { value: 'database', label: 'Database' },
          { value: 'email', label: 'Email/Mailbox' },
          { value: 'application', label: 'Application Data' },
          { value: 'system', label: 'Full System' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'serverName',
        label: 'Source Server/System',
        type: 'text',
        placeholder: 'Server name where data was located',
        required: true,
      },
      {
        id: 'dataLocation',
        label: 'Original Data Location',
        type: 'text',
        placeholder: 'e.g., D:\\Shared\\Finance\\Reports',
        required: true,
      },
      {
        id: 'dataDescription',
        label: 'Data Description',
        type: 'textarea',
        placeholder: 'Describe the specific files, folders, or data to restore',
        required: true,
      },
      {
        id: 'dataSize',
        label: 'Approximate Data Size',
        type: 'select',
        options: [
          { value: 'small', label: 'Small (< 1 GB)' },
          { value: 'medium', label: 'Medium (1-10 GB)' },
          { value: 'large', label: 'Large (10-100 GB)' },
          { value: 'very-large', label: 'Very Large (> 100 GB)' },
          { value: 'unknown', label: 'Unknown' },
        ],
      },
      {
        id: 'deletionDate',
        label: 'When was data deleted/lost?',
        type: 'date',
        required: true,
      },
      {
        id: 'restoreToDate',
        label: 'Restore to date (point-in-time)',
        type: 'date',
        helperText: 'What date should the data be restored from?',
      },
    ],
  },
  {
    id: 'backup-source',
    title: 'Restore Destination',
    description: 'Where should the restored data go?',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'restoreDestination',
        label: 'Restore Destination',
        type: 'select',
        required: true,
        options: [
          { value: 'original', label: 'Original Location' },
          { value: 'alternate', label: 'Alternate Location' },
          { value: 'staging', label: 'Staging Area' },
        ],
      },
      {
        id: 'alternateLocation',
        label: 'Alternate Location Path',
        type: 'text',
        placeholder: 'If not restoring to original location',
      },
      {
        id: 'overwriteExisting',
        label: 'Overwrite existing data if present',
        type: 'checkbox',
        helperText: 'Warning: This will overwrite any current data',
      },
      {
        id: 'notifyOnComplete',
        label: 'Notify me when restoration is complete',
        type: 'checkbox',
      },
      {
        id: 'justification',
        label: 'Business Justification',
        type: 'textarea',
        placeholder: 'Explain why this data restoration is needed',
        required: true,
      },
      {
        id: 'additionalNotes',
        label: 'Additional Notes',
        type: 'textarea',
        placeholder: 'Any other relevant information for IT',
      },
    ],
  },
];

// =============================================================================
// ITDR - IT DAILY REPORT
// =============================================================================

export const ITDR_SECTIONS: FormSection[] = [
  {
    id: 'date-shift',
    title: 'Report Information',
    description: 'Date and shift details',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'reportDate',
        label: 'Report Date',
        type: 'date',
        required: true,
      },
      {
        id: 'shift',
        label: 'Shift',
        type: 'select',
        required: true,
        options: [
          { value: 'day', label: 'Day Shift (8:00 AM - 5:00 PM)' },
          { value: 'evening', label: 'Evening Shift (5:00 PM - 12:00 AM)' },
          { value: 'night', label: 'Night Shift (12:00 AM - 8:00 AM)' },
        ],
      },
      {
        id: 'staffOnDuty',
        label: 'Staff On Duty',
        type: 'textarea',
        placeholder: 'List all IT staff on duty for this shift',
        required: true,
      },
      {
        id: 'handoverFrom',
        label: 'Handover From',
        type: 'people',
        placeholder: 'Search for previous shift staff...',
      },
    ],
  },
  {
    id: 'activities',
    title: 'Daily Activities',
    description: 'Summary of tasks and activities performed',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'ticketsResolved',
        label: 'Tickets Resolved',
        type: 'number',
        placeholder: 'Number of tickets closed',
      },
      {
        id: 'ticketsPending',
        label: 'Tickets Pending',
        type: 'number',
        placeholder: 'Number of tickets still open',
      },
      {
        id: 'scheduledTasks',
        label: 'Scheduled Tasks Completed',
        type: 'textarea',
        placeholder: 'List scheduled maintenance tasks completed',
      },
      {
        id: 'adhocTasks',
        label: 'Ad-hoc Tasks',
        type: 'textarea',
        placeholder: 'Unplanned tasks handled during shift',
      },
      {
        id: 'systemChecks',
        label: 'System Checks Performed',
        type: 'textarea',
        placeholder: 'Routine monitoring and system checks',
      },
      {
        id: 'backupStatus',
        label: 'Backup Status',
        type: 'select',
        options: [
          { value: 'all-success', label: 'All Backups Successful' },
          { value: 'partial-failure', label: 'Some Failures - See Notes' },
          { value: 'all-failed', label: 'All Backups Failed' },
          { value: 'not-applicable', label: 'Not Applicable' },
        ],
      },
    ],
  },
  {
    id: 'issues',
    title: 'Issues & Escalations',
    description: 'Problems encountered and items requiring attention',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'issuesEncountered',
        label: 'Issues Encountered',
        type: 'textarea',
        placeholder: 'Describe any problems or incidents during shift',
      },
      {
        id: 'escalations',
        label: 'Escalations',
        type: 'textarea',
        placeholder: 'Items escalated to management or other teams',
      },
      {
        id: 'pendingActions',
        label: 'Pending Actions for Next Shift',
        type: 'textarea',
        placeholder: 'Tasks to be continued by next shift',
      },
      {
        id: 'criticalAlerts',
        label: 'Any critical alerts active',
        type: 'checkbox',
      },
      {
        id: 'alertDetails',
        label: 'Critical Alert Details',
        type: 'textarea',
        placeholder: 'Details of any active critical alerts',
      },
      {
        id: 'handoverNotes',
        label: 'Handover Notes',
        type: 'textarea',
        placeholder: 'Important information for the incoming shift',
      },
    ],
  },
];

// =============================================================================
// ITDR2 - OUTSTANDING TASKS REGISTER
// =============================================================================

export const ITDR2_SECTIONS: FormSection[] = [
  {
    id: 'task-info',
    title: 'Task Information',
    description: 'Details of the outstanding task',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'taskTitle',
        label: 'Task Title',
        type: 'text',
        placeholder: 'Brief title for the task',
        required: true,
      },
      {
        id: 'taskDescription',
        label: 'Task Description',
        type: 'textarea',
        placeholder: 'Detailed description of the task',
        required: true,
      },
      {
        id: 'taskCategory',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          { value: 'infrastructure', label: 'Infrastructure' },
          { value: 'application', label: 'Application' },
          { value: 'security', label: 'Security' },
          { value: 'network', label: 'Network' },
          { value: 'project', label: 'Project Work' },
          { value: 'maintenance', label: 'Maintenance' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'select',
        required: true,
        options: [
          { value: 'critical', label: 'Critical' },
          { value: 'high', label: 'High' },
          { value: 'medium', label: 'Medium' },
          { value: 'low', label: 'Low' },
        ],
      },
      {
        id: 'assignedTo',
        label: 'Assigned To',
        type: 'people',
        placeholder: 'Search for responsible IT staff...',
        required: true,
      },
      {
        id: 'requestedBy',
        label: 'Requested By',
        type: 'people',
        placeholder: 'Search for requester...',
      },
    ],
  },
  {
    id: 'status',
    title: 'Task Status',
    description: 'Current status and progress',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'taskStatus',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'not-started', label: 'Not Started' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'on-hold', label: 'On Hold' },
          { value: 'blocked', label: 'Blocked' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' },
        ],
      },
      {
        id: 'progressPercent',
        label: 'Progress (%)',
        type: 'number',
        placeholder: '0-100',
      },
      {
        id: 'blockers',
        label: 'Blockers/Dependencies',
        type: 'textarea',
        placeholder: 'What is preventing progress?',
      },
      {
        id: 'lastUpdate',
        label: 'Latest Update',
        type: 'textarea',
        placeholder: 'Most recent status update',
        required: true,
      },
      {
        id: 'updatedDate',
        label: 'Last Updated Date',
        type: 'date',
      },
    ],
  },
  {
    id: 'target-date',
    title: 'Timeline',
    description: 'Due dates and milestones',
    visibleAtStages: ['Draft', 'Review', 'Approve'],
    isStageGated: false,
    fields: [
      {
        id: 'createdDate',
        label: 'Task Created Date',
        type: 'date',
        required: true,
      },
      {
        id: 'targetDate',
        label: 'Target Completion Date',
        type: 'date',
        required: true,
      },
      {
        id: 'revisedDate',
        label: 'Revised Target Date',
        type: 'date',
        helperText: 'If original target has changed',
      },
      {
        id: 'completedDate',
        label: 'Actual Completion Date',
        type: 'date',
      },
      {
        id: 'estimatedHours',
        label: 'Estimated Hours',
        type: 'number',
        placeholder: 'Total estimated effort',
      },
      {
        id: 'actualHours',
        label: 'Actual Hours Spent',
        type: 'number',
        placeholder: 'Hours logged so far',
      },
      {
        id: 'notes',
        label: 'Additional Notes',
        type: 'textarea',
        placeholder: 'Any other relevant information',
      },
    ],
  },
];

// =============================================================================
// ITSSR - IT SUPPORT & SERVICE REQUEST 2025
// =============================================================================

export const ITSSR_SECTIONS: FormSection[] = [
  {
    id: 'requester-info',
    title: 'Requester Information',
    description: 'Your contact details',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
    isStageGated: false,
    fields: [
      {
        id: 'requesterName',
        label: 'Your Name',
        type: 'people',
        required: true,
      },
      {
        id: 'requesterDepartment',
        label: 'Department',
        type: 'text',
        required: true,
      },
      {
        id: 'requesterEmail',
        label: 'Email',
        type: 'email',
        required: true,
      },
      {
        id: 'requesterPhone',
        label: 'Extension/Phone',
        type: 'text',
      },
      {
        id: 'requesterLocation',
        label: 'Location',
        type: 'select',
        required: true,
        options: [
          { value: 'MY-PR', label: 'Prai Office' },
          { value: 'MY-JH', label: 'Johor Office' },
          { value: 'remote', label: 'Remote/WFH' },
        ],
      },
    ],
  },
  {
    id: 'issue-details',
    title: 'Issue Details',
    description: 'Describe your IT issue or request',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
    isStageGated: false,
    fields: [
      {
        id: 'serviceType',
        label: 'Service Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Hardware', label: 'Hardware Issue' },
          { value: 'Application', label: 'Application/Software Issue' },
          { value: 'SAP', label: 'SAP Issue' },
          { value: 'Bank', label: 'Bank System Issue' },
          { value: 'Network', label: 'Network/Connectivity' },
          { value: 'Email', label: 'Email Issue' },
          { value: 'Printer', label: 'Printer Issue' },
          { value: 'Other', label: 'Other' },
        ],
      },
      {
        id: 'priority',
        label: 'Priority',
        type: 'select',
        required: true,
        options: [
          { value: 'critical', label: 'Critical - Cannot work' },
          { value: 'high', label: 'High - Significant impact' },
          { value: 'normal', label: 'Normal - Some impact' },
          { value: 'low', label: 'Low - Minor inconvenience' },
        ],
      },
      {
        id: 'issueTitle',
        label: 'Issue Title',
        type: 'text',
        placeholder: 'Brief description of the issue',
        required: true,
      },
      {
        id: 'issueDescription',
        label: 'Detailed Description',
        type: 'textarea',
        placeholder: 'Describe the issue in detail. Include error messages if any.',
        required: true,
      },
      {
        id: 'affectedUsers',
        label: 'Number of Affected Users',
        type: 'select',
        options: [
          { value: '1', label: 'Just me' },
          { value: '2-5', label: '2-5 users' },
          { value: '6-20', label: '6-20 users' },
          { value: '20+', label: 'More than 20 users' },
          { value: 'department', label: 'Entire department' },
        ],
      },
      {
        id: 'deviceName',
        label: 'Device Name (if applicable)',
        type: 'text',
        placeholder: 'e.g., PRAI-WS-001',
        helperText: 'Your computer name - found in System Properties',
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting Steps',
    description: 'What have you already tried?',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5'],
    isStageGated: false,
    fields: [
      {
        id: 'restarted',
        label: 'Restarted the device/application',
        type: 'checkbox',
      },
      {
        id: 'clearedCache',
        label: 'Cleared browser cache/app cache',
        type: 'checkbox',
      },
      {
        id: 'checkedConnectivity',
        label: 'Checked network connectivity',
        type: 'checkbox',
      },
      {
        id: 'otherTroubleshooting',
        label: 'Other troubleshooting steps taken',
        type: 'textarea',
        placeholder: 'Describe any other steps you have tried',
      },
      {
        id: 'errorMessage',
        label: 'Error Message (if any)',
        type: 'textarea',
        placeholder: 'Copy the exact error message here',
      },
    ],
  },
  {
    id: 'triage',
    title: 'IT Triage',
    description: 'IT helpdesk triage information',
    visibleAtStages: ['S2', 'S3', 'S4', 'S5'],
    isStageGated: true,
    fields: [
      {
        id: 'triageCategory',
        label: 'Triage Category',
        type: 'select',
        options: [
          { value: 'hardware', label: 'Hardware' },
          { value: 'software', label: 'Software' },
          { value: 'network', label: 'Network' },
          { value: 'account', label: 'Account/Access' },
          { value: 'training', label: 'User Training' },
        ],
      },
      {
        id: 'assignedTechnician',
        label: 'Assigned Technician',
        type: 'people',
      },
      {
        id: 'estimatedResolutionTime',
        label: 'Estimated Resolution Time',
        type: 'select',
        options: [
          { value: '1h', label: 'Within 1 hour' },
          { value: '4h', label: 'Within 4 hours' },
          { value: '1d', label: 'Within 1 day' },
          { value: '3d', label: 'Within 3 days' },
          { value: '1w', label: 'Within 1 week' },
        ],
      },
      {
        id: 'triageNotes',
        label: 'Triage Notes',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'resolution',
    title: 'Resolution Details',
    description: 'How the issue was resolved',
    visibleAtStages: ['S3', 'S4', 'S5'],
    isStageGated: true,
    fields: [
      {
        id: 'resolutionType',
        label: 'Resolution Type',
        type: 'select',
        options: [
          { value: 'fixed', label: 'Fixed' },
          { value: 'workaround', label: 'Workaround Provided' },
          { value: 'replaced', label: 'Equipment Replaced' },
          { value: 'reinstalled', label: 'Software Reinstalled' },
          { value: 'training', label: 'User Training' },
          { value: 'escalated', label: 'Escalated to Vendor' },
          { value: 'not-reproducible', label: 'Could Not Reproduce' },
        ],
      },
      {
        id: 'resolutionDetails',
        label: 'Resolution Details',
        type: 'textarea',
        placeholder: 'Describe how the issue was resolved',
      },
      {
        id: 'rootCause',
        label: 'Root Cause',
        type: 'textarea',
        placeholder: 'What caused the issue?',
      },
      {
        id: 'partsReplaced',
        label: 'Parts/Items Replaced',
        type: 'textarea',
        placeholder: 'List any hardware parts or equipment replaced',
      },
      {
        id: 'timeSpent',
        label: 'Time Spent (minutes)',
        type: 'number',
      },
    ],
  },
  {
    id: 'acceptance',
    title: 'User Acceptance',
    description: 'Confirm the issue is resolved',
    visibleAtStages: ['S4', 'S5'],
    isStageGated: true,
    fields: [
      {
        id: 'issueResolved',
        label: 'Issue has been resolved to my satisfaction',
        type: 'checkbox',
      },
      {
        id: 'satisfactionRating',
        label: 'Satisfaction Rating',
        type: 'select',
        options: [
          { value: '5', label: '5 - Excellent' },
          { value: '4', label: '4 - Good' },
          { value: '3', label: '3 - Satisfactory' },
          { value: '2', label: '2 - Poor' },
          { value: '1', label: '1 - Very Poor' },
        ],
      },
      {
        id: 'userFeedback',
        label: 'Feedback',
        type: 'textarea',
        placeholder: 'Any feedback for the IT team?',
      },
    ],
  },
  {
    id: 'closure',
    title: 'Closure',
    description: 'Final ticket closure',
    visibleAtStages: ['S5'],
    isStageGated: true,
    fields: [
      {
        id: 'closureCode',
        label: 'Closure Code',
        type: 'select',
        options: [
          { value: 'resolved', label: 'Resolved' },
          { value: 'workaround', label: 'Workaround Applied' },
          { value: 'user-cancelled', label: 'User Cancelled' },
          { value: 'duplicate', label: 'Duplicate Ticket' },
          { value: 'no-response', label: 'No User Response' },
        ],
      },
      {
        id: 'closureNotes',
        label: 'Closure Notes',
        type: 'textarea',
      },
      {
        id: 'knowledgeBaseUpdate',
        label: 'Update Knowledge Base',
        type: 'checkbox',
        helperText: 'Check if this solution should be added to KB',
      },
      {
        id: 'closedBy',
        label: 'Closed By',
        type: 'text',
      },
    ],
  },
];

// =============================================================================
// PRF - PROGRAM REQUEST FORM 2025
// =============================================================================

export const PRF_SECTIONS: FormSection[] = [
  {
    id: 'requester-info',
    title: 'Requester Information',
    description: 'Who is requesting this program/development?',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    isStageGated: false,
    fields: [
      {
        id: 'requesterName',
        label: 'Requester Name',
        type: 'text',
        required: true,
      },
      {
        id: 'requesterDepartment',
        label: 'Department',
        type: 'text',
        required: true,
      },
      {
        id: 'requesterEmail',
        label: 'Email',
        type: 'email',
        required: true,
      },
      {
        id: 'requesterPhone',
        label: 'Phone/Extension',
        type: 'text',
      },
    ],
  },
  {
    id: 'program-details',
    title: 'Program/Development Details',
    description: 'What do you need?',
    visibleAtStages: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    isStageGated: false,
    fields: [
      {
        id: 'requestType',
        label: 'Request Type',
        type: 'select',
        required: true,
        options: [
          { value: 'new', label: 'New Program/Application' },
          { value: 'enhancement', label: 'Enhancement to Existing' },
          { value: 'report', label: 'New Report' },
          { value: 'integration', label: 'System Integration' },
          { value: 'automation', label: 'Process Automation' },
        ],
      },
      {
        id: 'programTitle',
        label: 'Program/Request Title',
        type: 'text',
        placeholder: 'Brief title for the request',
        required: true,
      },
      {
        id: 'businessProblem',
        label: 'Business Problem/Opportunity',
        type: 'textarea',
        placeholder: 'What business problem does this solve?',
        required: true,
      },
      {
        id: 'requirements',
        label: 'Detailed Requirements',
        type: 'textarea',
        placeholder: 'Describe what you need in detail',
        required: true,
      },
      {
        id: 'isSAP',
        label: 'Does this involve SAP?',
        type: 'select',
        required: true,
        options: [
          { value: 'Yes', label: 'Yes - SAP related' },
          { value: 'No', label: 'No - Not SAP related' },
        ],
      },
      {
        id: 'affectedSystems',
        label: 'Affected Systems',
        type: 'textarea',
        placeholder: 'List all systems that will be impacted',
      },
      {
        id: 'expectedUsers',
        label: 'Expected Number of Users',
        type: 'select',
        options: [
          { value: '1-5', label: '1-5 users' },
          { value: '6-20', label: '6-20 users' },
          { value: '21-50', label: '21-50 users' },
          { value: '50+', label: 'More than 50 users' },
        ],
      },
      {
        id: 'requestedDeadline',
        label: 'Requested Completion Date',
        type: 'date',
      },
    ],
  },
  {
    id: 'authorization',
    title: 'Department Head Authorization',
    description: 'HOD approval section',
    visibleAtStages: ['S2', 'S3', 'S4', 'S5', 'S6'],
    isStageGated: true,
    fields: [
      {
        id: 'hodApproved',
        label: 'Request Approved',
        type: 'checkbox',
      },
      {
        id: 'hodName',
        label: 'HOD Name',
        type: 'text',
      },
      {
        id: 'hodComments',
        label: 'HOD Comments',
        type: 'textarea',
      },
      {
        id: 'budgetApproved',
        label: 'Budget Approved (if applicable)',
        type: 'checkbox',
      },
      {
        id: 'budgetAmount',
        label: 'Approved Budget Amount (MYR)',
        type: 'number',
      },
    ],
  },
  {
    id: 'triage',
    title: 'IT Triage',
    description: 'IT assessment and planning',
    visibleAtStages: ['S3', 'S4', 'S5', 'S6'],
    isStageGated: true,
    fields: [
      {
        id: 'feasibility',
        label: 'Technical Feasibility',
        type: 'select',
        options: [
          { value: 'feasible', label: 'Feasible' },
          { value: 'feasible-with-changes', label: 'Feasible with modifications' },
          { value: 'not-feasible', label: 'Not Feasible' },
          { value: 'needs-study', label: 'Needs Further Study' },
        ],
      },
      {
        id: 'complexity',
        label: 'Complexity Level',
        type: 'select',
        options: [
          { value: 'simple', label: 'Simple (< 1 week)' },
          { value: 'moderate', label: 'Moderate (1-4 weeks)' },
          { value: 'complex', label: 'Complex (1-3 months)' },
          { value: 'very-complex', label: 'Very Complex (> 3 months)' },
        ],
      },
      {
        id: 'assignedDeveloper',
        label: 'Assigned Developer',
        type: 'text',
      },
      {
        id: 'estimatedEffort',
        label: 'Estimated Effort (days)',
        type: 'number',
      },
      {
        id: 'plannedStartDate',
        label: 'Planned Start Date',
        type: 'date',
      },
      {
        id: 'triageNotes',
        label: 'IT Triage Notes',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'sap-review',
    title: 'SAP Functional Review',
    description: 'SAP functional team assessment',
    visibleAtStages: ['S4', 'S5', 'S6'],
    isStageGated: true,
    conditionalField: { field: 'isSAP', value: 'Yes' },
    fields: [
      {
        id: 'sapModule',
        label: 'SAP Module',
        type: 'select',
        options: [
          { value: 'fi', label: 'FI - Financial Accounting' },
          { value: 'co', label: 'CO - Controlling' },
          { value: 'mm', label: 'MM - Materials Management' },
          { value: 'sd', label: 'SD - Sales & Distribution' },
          { value: 'pp', label: 'PP - Production Planning' },
          { value: 'qm', label: 'QM - Quality Management' },
          { value: 'pm', label: 'PM - Plant Maintenance' },
          { value: 'hr', label: 'HR - Human Resources' },
          { value: 'basis', label: 'Basis / Technical' },
          { value: 'abap', label: 'ABAP Development' },
        ],
      },
      {
        id: 'sapFunctionalApproved',
        label: 'SAP Functional Approved',
        type: 'checkbox',
      },
      {
        id: 'sapFunctionalReviewer',
        label: 'SAP Functional Reviewer',
        type: 'text',
      },
      {
        id: 'sapImpactAnalysis',
        label: 'SAP Impact Analysis',
        type: 'textarea',
        placeholder: 'Impact on existing SAP configuration',
      },
      {
        id: 'sapTestingRequired',
        label: 'SAP Testing Required',
        type: 'select',
        options: [
          { value: 'unit', label: 'Unit Testing Only' },
          { value: 'integration', label: 'Integration Testing' },
          { value: 'uat', label: 'Full UAT Required' },
        ],
      },
    ],
  },
  {
    id: 'development',
    title: 'Development Progress',
    description: 'Track development status',
    visibleAtStages: ['S5', 'S6'],
    isStageGated: true,
    fields: [
      {
        id: 'developmentStatus',
        label: 'Development Status',
        type: 'select',
        options: [
          { value: 'not-started', label: 'Not Started' },
          { value: 'in-progress', label: 'In Progress' },
          { value: 'testing', label: 'In Testing' },
          { value: 'uat', label: 'UAT Phase' },
          { value: 'completed', label: 'Development Completed' },
        ],
      },
      {
        id: 'progressPercent',
        label: 'Progress (%)',
        type: 'number',
      },
      {
        id: 'developmentNotes',
        label: 'Development Notes',
        type: 'textarea',
      },
      {
        id: 'testingResults',
        label: 'Testing Results',
        type: 'textarea',
      },
      {
        id: 'issuesFound',
        label: 'Issues Found',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'validation',
    title: 'User Validation',
    description: 'Final user acceptance',
    visibleAtStages: ['S6'],
    isStageGated: true,
    fields: [
      {
        id: 'uatCompleted',
        label: 'UAT Completed',
        type: 'checkbox',
      },
      {
        id: 'userAccepted',
        label: 'User Accepted Solution',
        type: 'checkbox',
      },
      {
        id: 'validationComments',
        label: 'Validation Comments',
        type: 'textarea',
      },
      {
        id: 'goLiveDate',
        label: 'Go-Live Date',
        type: 'date',
      },
      {
        id: 'trainingRequired',
        label: 'User Training Required',
        type: 'checkbox',
      },
      {
        id: 'trainingDate',
        label: 'Training Date',
        type: 'date',
      },
    ],
  },
];


// =============================================================================
// M2 FORM SECTIONS MAP
// =============================================================================
export const M2_FORM_SECTIONS: Record<string, FormSection[]> = {
  IAL1: IAL1_SECTIONS,
  IAL2: IAL2_SECTIONS,
  IAL3: IAL3_SECTIONS,
  IAL4: IAL4_SECTIONS,
  IAL5: IAL5_SECTIONS,
  ITDR: ITDR_SECTIONS,
  ITDR2: ITDR2_SECTIONS,
  ITSSR: ITSSR_SECTIONS,
  PRF: PRF_SECTIONS,
};