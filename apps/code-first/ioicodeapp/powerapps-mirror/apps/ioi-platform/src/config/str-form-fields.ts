import type { STRFormCode } from '@/config/str-constants';

export type STRFormFieldType = 'text' | 'textarea' | 'number' | 'date' | 'select';

export interface STRFormFieldOption {
  value: string;
  label: string;
}

export interface STRFormFieldConfig {
  id: string;
  label: string;
  type: STRFormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: STRFormFieldOption[];
}

const UOM_OPTIONS: STRFormFieldOption[] = [
  { value: 'Each', label: 'Each' },
  { value: 'Box', label: 'Box' },
  { value: 'Carton', label: 'Carton' },
  { value: 'Kg', label: 'Kg' },
  { value: 'Liter', label: 'Liter' },
  { value: 'Meter', label: 'Meter' },
  { value: 'Set', label: 'Set' },
  { value: 'MT', label: 'MT' },
];

export const STR_DEFAULT_FORM_FIELDS: STRFormFieldConfig[] = [
  { id: 'itemDescription', label: 'Item Description', type: 'text', required: true, placeholder: 'Describe the item or request' },
  { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
  { id: 'unitOfMeasure', label: 'Unit of Measure', type: 'select', options: UOM_OPTIONS },
];

export const STR_FORM_FIELDS: Record<STRFormCode, STRFormFieldConfig[]> = {
  ACMSTR: [
    { id: 'transactionType', label: 'Transaction Type', type: 'select', required: true, options: [
      { value: 'Receipt', label: 'Receipt' },
      { value: 'Issue', label: 'Issue' },
      { value: 'Transfer', label: 'Transfer' },
      { value: 'Adjustment', label: 'Adjustment' },
    ] },
    { id: 'itemCode', label: 'Item Code', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'unitOfMeasure', label: 'Unit of Measure', type: 'select', required: true, options: UOM_OPTIONS },
    { id: 'transactionDate', label: 'Transaction Date', type: 'date', required: true },
  ],
  ASMR: [
    { id: 'reportYear', label: 'Report Year', type: 'number', required: true },
    { id: 'auditPeriod', label: 'Audit Period', type: 'text', required: true, placeholder: 'e.g. FY2026' },
    { id: 'totalTransactions', label: 'Total Transactions', type: 'number' },
    { id: 'findingsSummary', label: 'Findings Summary', type: 'textarea', required: true },
    { id: 'improvementActions', label: 'Improvement Actions', type: 'textarea' },
  ],
  IRN: [
    { id: 'itemCode', label: 'Item Code', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'supplierName', label: 'Supplier Name', type: 'text' },
    { id: 'rejectedQuantity', label: 'Rejected Quantity', type: 'number', required: true },
    { id: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
    { id: 'rejectionReason', label: 'Rejection Reason', type: 'textarea', required: true },
  ],
  NIR: [
    { id: 'itemCode', label: 'Item Code', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'nonConformanceType', label: 'Non-Conformance Type', type: 'select', required: true, options: [
      { value: 'Quality', label: 'Quality' },
      { value: 'Quantity', label: 'Quantity' },
      { value: 'Packaging', label: 'Packaging' },
      { value: 'Documentation', label: 'Documentation' },
      { value: 'Other', label: 'Other' },
    ] },
    { id: 'quantity', label: 'Quantity', type: 'number' },
    { id: 'disposition', label: 'Disposition', type: 'select', options: [
      { value: 'Return', label: 'Return' },
      { value: 'Rework', label: 'Rework' },
      { value: 'Use As Is', label: 'Use As Is' },
      { value: 'Dispose', label: 'Dispose' },
    ] },
    { id: 'correctiveAction', label: 'Corrective Action', type: 'textarea' },
  ],
  SIC: [
    { id: 'certificateNo', label: 'Certificate No', type: 'text' },
    { id: 'itemCode', label: 'Item Code', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'issuedTo', label: 'Issued To', type: 'text', required: true },
    { id: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
  ],
  SII: [
    { id: 'itemCode', label: 'Item Code', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'issuedTo', label: 'Issued To', type: 'text', required: true },
    { id: 'issueDate', label: 'Issue Date', type: 'date', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'unitOfMeasure', label: 'Unit of Measure', type: 'select', options: UOM_OPTIONS },
  ],
  SIROP: [
    { id: 'requestType', label: 'Request Type', type: 'select', required: true, options: [
      { value: 'Request', label: 'Request' },
      { value: 'Order', label: 'Order' },
      { value: 'Follow Up', label: 'Follow Up' },
    ] },
    { id: 'itemCode', label: 'Item Code', type: 'text' },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'requestedQuantity', label: 'Requested Quantity', type: 'number', required: true },
    { id: 'requiredDate', label: 'Required Date', type: 'date' },
    { id: 'orderJustification', label: 'Order Justification', type: 'textarea' },
  ],
  SIU: [
    { id: 'itemCode', label: 'Item Code', type: 'text', required: true },
    { id: 'currentDescription', label: 'Current Description', type: 'text' },
    { id: 'requestedChange', label: 'Requested Change', type: 'textarea', required: true },
    { id: 'changeReason', label: 'Change Reason', type: 'textarea', required: true },
    { id: 'effectiveDate', label: 'Effective Date', type: 'date' },
  ],
  SR: [
    { id: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
    { id: 'purchaseOrderNo', label: 'Purchase Order No', type: 'text' },
    { id: 'receiptDate', label: 'Receipt Date', type: 'date', required: true },
    { id: 'receivedBy', label: 'Received By', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Details', type: 'textarea', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number' },
  ],
  STIDS: [
    { id: 'sourceLocation', label: 'Source Location', type: 'text', required: true },
    { id: 'destinationLocation', label: 'Destination Location', type: 'text', required: true },
    { id: 'transferDate', label: 'Transfer Date', type: 'date', required: true },
    { id: 'transferredBy', label: 'Transferred By', type: 'text', required: true },
    { id: 'itemDescription', label: 'Items Transferred', type: 'textarea', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number' },
  ],
  STIR: [
    { id: 'fromDepartment', label: 'From Department', type: 'text', required: true },
    { id: 'toDepartment', label: 'To Department', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'requiredDate', label: 'Required Date', type: 'date' },
    { id: 'transferReason', label: 'Transfer Reason', type: 'textarea' },
  ],
  SLED: [
    { id: 'itemCode', label: 'Item Code', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'batchNo', label: 'Batch No', type: 'text', required: true },
    { id: 'shelfLifeDate', label: 'Shelf Life Expiration Date', type: 'date', required: true },
    { id: 'storageLocation', label: 'Storage Location', type: 'text' },
    { id: 'actionRequired', label: 'Action Required', type: 'textarea' },
  ],
  SRRI1: [
    { id: 'returnBy', label: 'Return By', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'returnDate', label: 'Return Date', type: 'date', required: true },
    { id: 'returnCondition', label: 'Return Condition', type: 'select', options: [
      { value: 'Good', label: 'Good' },
      { value: 'Used', label: 'Used' },
      { value: 'Damaged', label: 'Damaged' },
    ] },
  ],
  SRRI2: [
    { id: 'transactionReference', label: 'Transaction Reference', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'reversalReason', label: 'Reversal Reason', type: 'textarea', required: true },
    { id: 'correctionRequired', label: 'Correction Required', type: 'textarea' },
    { id: 'requestedDate', label: 'Requested Date', type: 'date' },
  ],
  MRF: [
    { id: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
    { id: 'purchaseOrderNo', label: 'Purchase Order No', type: 'text' },
    { id: 'receiptDate', label: 'Receipt Date', type: 'date', required: true },
    { id: 'itemDescription', label: 'Material Description', type: 'textarea', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'unitOfMeasure', label: 'Unit of Measure', type: 'select', options: UOM_OPTIONS },
    { id: 'receivedBy', label: 'Received By', type: 'text' },
  ],
  MRFAPP: [
    { id: 'itemDescription', label: 'Material Description', type: 'textarea', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'unitOfMeasure', label: 'Unit of Measure', type: 'select', options: UOM_OPTIONS },
    { id: 'requiredDate', label: 'Required Date', type: 'date' },
    { id: 'purpose', label: 'Purpose', type: 'textarea', required: true },
  ],
  RETURNABLES: [
    { id: 'borrowedBy', label: 'Borrowed By', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'borrowDate', label: 'Borrow Date', type: 'date', required: true },
    { id: 'expectedReturnDate', label: 'Expected Return Date', type: 'date', required: true },
    { id: 'condition', label: 'Condition', type: 'select', options: [
      { value: 'Good', label: 'Good' },
      { value: 'Used', label: 'Used' },
      { value: 'Damaged', label: 'Damaged' },
    ] },
  ],
  IFSSH: [
    { id: 'employeeName', label: 'Employee Name', type: 'text', required: true },
    { id: 'employeeId', label: 'Employee ID', type: 'text', required: true },
    { id: 'issueType', label: 'Issue Type', type: 'select', required: true, options: [
      { value: 'new', label: 'New Issue' },
      { value: 'replacement', label: 'Replacement' },
    ] },
    { id: 'gearType', label: 'Gear Type', type: 'select', required: true, options: [
      { value: 'Safety Shoe', label: 'Safety Shoe' },
      { value: 'Helmet', label: 'Helmet' },
      { value: 'Safety Shoe and Helmet', label: 'Safety Shoe and Helmet' },
    ] },
    { id: 'size', label: 'Size', type: 'text' },
    { id: 'quantity', label: 'Quantity', type: 'number' },
  ],
  PCSTKITEM: [
    { id: 'proposedItemCode', label: 'Proposed Item Code', type: 'text' },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'category', label: 'Category', type: 'text', required: true },
    { id: 'unitOfMeasure', label: 'Unit of Measure', type: 'select', options: UOM_OPTIONS },
    { id: 'minimumStock', label: 'Minimum Stock', type: 'number' },
    { id: 'maximumStock', label: 'Maximum Stock', type: 'number' },
    { id: 'leadTime', label: 'Lead Time (days)', type: 'number' },
  ],
  COD: [
    { id: 'dispatchNo', label: 'Dispatch No', type: 'text', required: true },
    { id: 'destination', label: 'Destination', type: 'text', required: true },
    { id: 'carrierName', label: 'Carrier Name', type: 'text' },
    { id: 'dispatchDate', label: 'Dispatch Date', type: 'date', required: true },
    { id: 'estimatedCost', label: 'Estimated Cost', type: 'number', required: true },
    { id: 'costReason', label: 'Cost Reason', type: 'textarea' },
  ],
  QUOTATIONMD: [
    { id: 'itemDescription', label: 'Material / Despatch Description', type: 'textarea', required: true },
    { id: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
    { id: 'quotationNo', label: 'Quotation No', type: 'text' },
    { id: 'quotationDate', label: 'Quotation Date', type: 'date' },
    { id: 'quotedAmount', label: 'Quoted Amount', type: 'number' },
    { id: 'comparisonRemarks', label: 'Comparison Remarks', type: 'textarea' },
  ],
  SAPSLCF: [
    { id: 'plantCode', label: 'Plant Code', type: 'text', required: true },
    { id: 'storageLocationCode', label: 'Storage Location Code', type: 'text', required: true },
    { id: 'storageLocationDescription', label: 'Storage Location Description', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text' },
    { id: 'justificationDetail', label: 'Justification Detail', type: 'textarea' },
  ],
  ODFM: [
    { id: 'itemCode', label: 'Item Code', type: 'text', required: true },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'currentMinMax', label: 'Current Min / Max', type: 'text', required: true },
    { id: 'requestedMinMax', label: 'Requested Min / Max', type: 'text', required: true },
    { id: 'deviationReason', label: 'Deviation Reason', type: 'textarea', required: true },
    { id: 'effectivePeriod', label: 'Effective Period', type: 'text' },
  ],
  IMSI: [
    { id: 'itemCode', label: 'Item Code', type: 'text' },
    { id: 'itemDescription', label: 'Item Description', type: 'text', required: true },
    { id: 'category', label: 'Category', type: 'text', required: true },
    { id: 'unitOfMeasure', label: 'Unit of Measure', type: 'select', options: UOM_OPTIONS },
    { id: 'inclusionReason', label: 'Inclusion Reason', type: 'textarea', required: true },
  ],
  PCNMATDISPOSAL: [
    { id: 'materialDescription', label: 'Material Description', type: 'textarea', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'disposalReason', label: 'Disposal Reason', type: 'textarea', required: true },
    { id: 'proposedDisposalDate', label: 'Proposed Disposal Date', type: 'date' },
    { id: 'authorizedBy', label: 'Authorized By', type: 'text' },
  ],
  SWASTE: [
    { id: 'wasteCode', label: 'Waste Code', type: 'text', required: true },
    { id: 'wasteDescription', label: 'Waste Description', type: 'textarea', required: true },
    { id: 'generatedDate', label: 'Generated Date', type: 'date', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'unitOfMeasure', label: 'Unit', type: 'select', options: UOM_OPTIONS },
    { id: 'storageLocation', label: 'Storage Location', type: 'text' },
    { id: 'collectionDate', label: 'Collection Date', type: 'date' },
  ],
  ECMRMDNF: [
    { id: 'materialDescription', label: 'Material Description', type: 'textarea', required: true },
    { id: 'ecmrReference', label: 'ECMR Reference', type: 'text' },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'disposalMethod', label: 'Disposal Method', type: 'text', required: true },
    { id: 'notificationDate', label: 'Notification Date', type: 'date', required: true },
  ],
  MDNF: [
    { id: 'disposalType', label: 'Disposal Type', type: 'select', required: true, options: [
      { value: 'Scrap', label: 'Scrap' },
      { value: 'Obsolete', label: 'Obsolete' },
      { value: 'Damaged', label: 'Damaged' },
      { value: 'Expired', label: 'Expired' },
      { value: 'Other', label: 'Other' },
    ] },
    { id: 'materialDescription', label: 'Material Description', type: 'textarea', required: true },
    { id: 'quantity', label: 'Quantity', type: 'number', required: true },
    { id: 'disposalMethod', label: 'Disposal Method', type: 'text', required: true },
    { id: 'disposalDate', label: 'Disposal Date', type: 'date' },
    { id: 'authorizedBy', label: 'Authorized By', type: 'text' },
  ],
  STOREISP: [
    { id: 'inspectionDate', label: 'Inspection Date', type: 'date', required: true },
    { id: 'inspectorName', label: 'Inspector Name', type: 'text', required: true },
    { id: 'storeArea', label: 'Store Area', type: 'text', required: true },
    { id: 'inspectionType', label: 'Inspection Type', type: 'select', required: true, options: [
      { value: 'Routine', label: 'Routine' },
      { value: 'Safety', label: 'Safety' },
      { value: 'Inventory', label: 'Inventory' },
      { value: 'Regulatory', label: 'Regulatory' },
    ] },
    { id: 'findingsSummary', label: 'Findings Summary', type: 'textarea', required: true },
    { id: 'nonConformances', label: 'Non-Conformances', type: 'textarea' },
    { id: 'correctiveActions', label: 'Corrective Actions', type: 'textarea' },
    { id: 'nextInspectionDate', label: 'Next Inspection Date', type: 'date' },
  ],
};

export function getSTRFormFields(formCode: string): STRFormFieldConfig[] {
  return STR_FORM_FIELDS[formCode as STRFormCode] || STR_DEFAULT_FORM_FIELDS;
}

export function getSTRPrimaryDescription(fieldValues: Record<string, string>, formCode: string): string {
  const candidateKeys = [
    'itemDescription',
    'materialDescription',
    'wasteDescription',
    'findingsSummary',
    'storageLocationDescription',
    'requestedChange',
    'transactionReference',
    'dispatchNo',
    'quotationNo',
  ];
  for (const key of candidateKeys) {
    if (fieldValues[key]?.trim()) return fieldValues[key].trim();
  }
  return `${formCode} request`;
}

export function getSTRPrimaryQuantity(fieldValues: Record<string, string>): number | undefined {
  const value = fieldValues.quantity || fieldValues.requestedQuantity || fieldValues.rejectedQuantity;
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getSTRRequiredDate(fieldValues: Record<string, string>): string | undefined {
  return fieldValues.requiredDate || fieldValues.expectedReturnDate || fieldValues.nextInspectionDate || undefined;
}
