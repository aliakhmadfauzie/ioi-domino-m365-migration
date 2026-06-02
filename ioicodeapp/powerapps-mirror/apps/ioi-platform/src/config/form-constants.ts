/**
 * Form Constants
 * 
 * Re-exports from form-dropdown-config with simplified naming for form components
 */

import {
  MASTER_COMPANIES,
  MASTER_DEPARTMENTS,
  RS_APPLICATION_TYPES,
  RS_SAP_CLIENTS as RS_SAP_CLIENTS_CONFIG,
  RS_BANKS as RS_BANKS_CONFIG,
  RS_RESET_TYPES as RS_RESET_TYPES_CONFIG,
  RS_UNLOCK_OPTIONS as RS_UNLOCK_OPTIONS_CONFIG,
} from './form-dropdown-config';

// Companies - simplified format for forms
export const COMPANIES = MASTER_COMPANIES.map(c => ({
  code: c.code,
  name: c.name,
  shortName: c.shortName,
}));

// Departments - simplified format for forms  
export const DEPARTMENTS = MASTER_DEPARTMENTS.map(d => ({
  code: d.code,
  name: d.name,
  category: d.category,
}));

// RS Form - Application types
export const RS_APPLICATIONS = RS_APPLICATION_TYPES.map(a => a.name);

// RS Form - SAP Clients
export const RS_SAP_CLIENTS = RS_SAP_CLIENTS_CONFIG.map(c => ({
  code: c.code,
  name: c.name,
}));

// RS Form - Banks
export const RS_BANKS = [...RS_BANKS_CONFIG];

// RS Form - Reset Types
export const RS_RESET_TYPES = RS_RESET_TYPES_CONFIG.map(t => t.name);

// RS Form - Unlock Options
export const RS_UNLOCK_OPTIONS = RS_UNLOCK_OPTIONS_CONFIG.map(o => o.name);