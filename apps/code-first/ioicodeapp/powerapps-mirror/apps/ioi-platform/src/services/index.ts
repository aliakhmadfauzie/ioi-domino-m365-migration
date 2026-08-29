/**
 * Services Module
 * Re-exports all services
 */

// Admin services
export * from './admin-sharepoint-service';

// HR services
export * from './hr-submission-service';
export * from './main-dbhr-service';

// STR services (only one to avoid duplicates)
export * from './str-submission-service';

// QA/QC services
export * from './main-dbqa-site-service';

// Notification services
export * from './notification-service';

// Submission services
// NOTE: sharepoint-submission-service is deprecated - use generated services (MainDBITService, etc.) instead
// export * from './sharepoint-submission-service';
