/**
 * ITSSR SLA Calculation Utilities
 *
 * Calculates working days for SLA metrics, excluding:
 * - Weekends (Saturday, Sunday)
 * - Public holidays (from Holidays field)
 *
 * Maps to Lotus Domino computed fields:
 * - Days: Working days to complete
 * - Days2_1: Adjusted days (excludes holidays)
 * - Days2: Working days to first respond
 *
 * ⚠️ SLA THRESHOLDS NEED BUSINESS CONFIRMATION
 * Current values (from Domino analysis):
 * - Critical: 1 hour first response, 4 hours resolution
 * - High:     4 hours first response, 8 hours resolution
 * - Normal:   8 hours first response, 24 hours resolution  (Domino default)
 * - Low:      24 hours first response, 48 hours resolution
 *
 * These values were inferred from Domino workflow patterns and
 * the `IT_Department_ITSSR_Detailed_Requirements.md` document.
 * They MUST be validated with the IT Service Desk team before
 * production deployment. See RAQ log docs/risks-assumptions-questions.md.
 */

import {
  type SLAStatus,
  type ITSSRSLAMetrics,
  ITSSR_SLA_THRESHOLDS,
  SLA_STATUS_INFO,
} from '@/types/m2-itssr-workflow';
import type { ITSSRPriority } from '@/types/m2-itssr-types';

// =============================================================================
// WORKING DAYS CALCULATION
// =============================================================================

/**
 * Check if a date is a weekend (Saturday or Sunday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Check if a date is a holiday
 */
export function isHoliday(date: Date, holidays: Date[]): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return holidays.some((h: Date) => h.toISOString().split('T')[0] === dateStr);
}

/**
 * Check if a date is a working day (not weekend, not holiday)
 */
export function isWorkingDay(date: Date, holidays: Date[] = []): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays);
}

/**
 * Calculate working days between two dates (excluding weekends only)
 */
export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  if (endDate < startDate) return 0;

  let workingDays = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    if (!isWeekend(current)) {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Calculate adjusted working days (excluding weekends AND holidays)
 */
export function calculateAdjustedWorkingDays(
  startDate: Date,
  endDate: Date,
  holidays: Date[] = []
): number {
  if (endDate < startDate) return 0;

  let workingDays = 0;
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  while (current <= end) {
    if (isWorkingDay(current, holidays)) {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return workingDays;
}

/**
 * Add working days to a date
 */
export function addWorkingDays(startDate: Date, days: number, holidays: Date[] = []): Date {
  const result = new Date(startDate);
  let addedDays = 0;

  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    if (isWorkingDay(result, holidays)) {
      addedDays++;
    }
  }

  return result;
}

// =============================================================================
// SLA METRICS CALCULATION
// =============================================================================

export interface SLACalculationInput {
  /** Date the request was submitted */
  submittedDate: Date;
  /** Date IT first responded (if responded) */
  respondDate?: Date;
  /** Date the case was closed (if closed) */
  closedDate?: Date;
  /** Public holidays to exclude */
  holidays?: Date[];
}

export interface SLACalculationResult extends ITSSRSLAMetrics {
  /** Whether response SLA is breached */
  isResponseBreached: boolean;
  /** Whether resolution SLA is breached (based on default threshold) */
  isResolutionBreached: boolean;
}

/**
 * Calculate all SLA metrics for a request
 */
export function calculateSLAMetrics(input: SLACalculationInput): SLACalculationResult {
  const { submittedDate, respondDate, closedDate, holidays = [] } = input;
  const now = new Date();

  // Calculate Days2: Working days to first respond
  const responseEndDate = respondDate ?? now;
  const Days2 = calculateWorkingDays(submittedDate, responseEndDate);

  // Calculate Days: Working days to complete (raw)
  const completionEndDate = closedDate ?? now;
  const Days = calculateWorkingDays(submittedDate, completionEndDate);

  // Calculate Days2_1: Adjusted days (excludes holidays)
  const Days2_1 = calculateAdjustedWorkingDays(submittedDate, completionEndDate, holidays);

  // Check SLA breaches
  const isResponseBreached = Days2 > ITSSR_SLA_THRESHOLDS.responseTarget;
  const isResolutionBreached = Days2_1 > ITSSR_SLA_THRESHOLDS.resolutionStandard;

  return {
    RespondDate: respondDate,
    Days,
    Days2_1,
    Days2,
    Holidays: holidays,
    isResponseBreached,
    isResolutionBreached,
  };
}

// =============================================================================
// SLA STATUS DETERMINATION
// =============================================================================

/**
 * Get resolution SLA threshold based on priority
 */
export function getResolutionThreshold(priority?: ITSSRPriority): number {
  switch (priority) {
    case 'Critical':
      return ITSSR_SLA_THRESHOLDS.resolutionCritical;
    case 'High':
      return ITSSR_SLA_THRESHOLDS.resolutionHigh;
    case 'Medium':
      return ITSSR_SLA_THRESHOLDS.resolutionMedium;
    case 'Low':
      return ITSSR_SLA_THRESHOLDS.resolutionLow;
    default:
      return ITSSR_SLA_THRESHOLDS.resolutionStandard;
  }
}

/**
 * Determine SLA status for response time
 */
export function getResponseSLAStatus(daysTaken: number): SLAStatus {
  const threshold = ITSSR_SLA_THRESHOLDS.responseTarget;

  if (daysTaken <= threshold) {
    return 'OnTrack';
  } else if (daysTaken <= threshold * 1.5) {
    return 'AtRisk';
  } else {
    return 'Breached';
  }
}

/**
 * Determine SLA status for resolution time
 */
export function getResolutionSLAStatus(daysTaken: number, priority?: ITSSRPriority): SLAStatus {
  const threshold = getResolutionThreshold(priority);

  if (daysTaken <= threshold) {
    return 'OnTrack';
  } else if (daysTaken <= threshold * 1.2) {
    return 'AtRisk';
  } else {
    return 'Breached';
  }
}

/**
 * Get SLA status info with color and label
 */
export function getSLAStatusInfo(status: SLAStatus) {
  return SLA_STATUS_INFO[status];
}

// =============================================================================
// DEADLINE CALCULATION
// =============================================================================

/**
 * Calculate response deadline
 */
export function calculateResponseDeadline(submittedDate: Date, holidays: Date[] = []): Date {
  return addWorkingDays(submittedDate, ITSSR_SLA_THRESHOLDS.responseTarget, holidays);
}

/**
 * Calculate resolution deadline based on priority
 */
export function calculateResolutionDeadline(
  submittedDate: Date,
  priority?: ITSSRPriority,
  holidays: Date[] = []
): Date {
  const threshold = getResolutionThreshold(priority);
  return addWorkingDays(submittedDate, threshold, holidays);
}

/**
 * Get time remaining until deadline in human-readable format
 */
export function getTimeRemainingText(deadline: Date): string {
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();

  if (diffMs < 0) {
    const overdueDays = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    return `${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue`;
  }

  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining === 0) {
    const hoursRemaining = Math.ceil(diffMs / (1000 * 60 * 60));
    return `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} remaining`;
  }

  return `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`;
}

// =============================================================================
// HOLIDAY MANAGEMENT
// =============================================================================

/**
 * Default Malaysian public holidays for 2024-2026
 * In production, this would be fetched from a database
 */
export const DEFAULT_HOLIDAYS_MALAYSIA: Date[] = [
  // 2024
  new Date('2024-01-01'), // New Year's Day
  new Date('2024-01-25'), // Thaipusam
  new Date('2024-02-01'), // Federal Territory Day
  new Date('2024-02-10'), // Chinese New Year
  new Date('2024-02-11'), // Chinese New Year (Day 2)
  new Date('2024-04-10'), // Hari Raya Aidilfitri
  new Date('2024-04-11'), // Hari Raya Aidilfitri (Day 2)
  new Date('2024-05-01'), // Labour Day
  new Date('2024-05-22'), // Vesak Day
  new Date('2024-06-03'), // Agong's Birthday
  new Date('2024-06-17'), // Hari Raya Haji
  new Date('2024-07-07'), // Awal Muharram
  new Date('2024-08-31'), // Merdeka Day
  new Date('2024-09-16'), // Malaysia Day
  new Date('2024-09-16'), // Prophet's Birthday
  new Date('2024-10-31'), // Deepavali
  new Date('2024-12-25'), // Christmas
  // 2025
  new Date('2025-01-01'), // New Year's Day
  new Date('2025-01-29'), // Chinese New Year
  new Date('2025-01-30'), // Chinese New Year (Day 2)
  new Date('2025-02-01'), // Federal Territory Day
  new Date('2025-02-11'), // Thaipusam
  new Date('2025-03-30'), // Hari Raya Aidilfitri
  new Date('2025-03-31'), // Hari Raya Aidilfitri (Day 2)
  new Date('2025-05-01'), // Labour Day
  new Date('2025-05-12'), // Vesak Day
  new Date('2025-06-02'), // Agong's Birthday
  new Date('2025-06-06'), // Hari Raya Haji
  new Date('2025-06-27'), // Awal Muharram
  new Date('2025-08-31'), // Merdeka Day
  new Date('2025-09-05'), // Prophet's Birthday
  new Date('2025-09-16'), // Malaysia Day
  new Date('2025-10-20'), // Deepavali
  new Date('2025-12-25'), // Christmas
  // 2026
  new Date('2026-01-01'), // New Year's Day
  new Date('2026-02-01'), // Federal Territory Day
  new Date('2026-02-17'), // Chinese New Year
  new Date('2026-02-18'), // Chinese New Year (Day 2)
  new Date('2026-03-20'), // Hari Raya Aidilfitri
  new Date('2026-03-21'), // Hari Raya Aidilfitri (Day 2)
  new Date('2026-05-01'), // Labour Day
  new Date('2026-05-27'), // Hari Raya Haji
  new Date('2026-06-01'), // Agong's Birthday
  new Date('2026-06-17'), // Awal Muharram
  new Date('2026-08-26'), // Prophet's Birthday
  new Date('2026-08-31'), // Merdeka Day
  new Date('2026-09-16'), // Malaysia Day
  new Date('2026-11-08'), // Deepavali
  new Date('2026-12-25'), // Christmas
];

/**
 * Parse holiday dates from string array (for data from backend)
 */
export function parseHolidays(holidayStrings: string[]): Date[] {
  return holidayStrings
    .map((s: string) => new Date(s))
    .filter((d: Date) => !isNaN(d.getTime()));
}

/**
 * Format holidays for display
 */
export function formatHolidayList(holidays: Date[]): string[] {
  return holidays.map((d: Date) => d.toLocaleDateString('en-MY', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }));
}
