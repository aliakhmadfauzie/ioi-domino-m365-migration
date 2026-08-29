import { getClient } from '../../../app-gen-sdk/data';
import {
  type UserRolesIT,
  type UserRolesITRoleCodeKey,
  type UserRolesITSiteKey,
  type UserRolesITEntitySiteKey,
} from '../models/user-roles-it-model';
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const DATA_SOURCE_NAME = 'UserRolesIT';

type RawUserRolesIT = Record<string, unknown>;

function choiceVal(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'Value' in value) {
    return String((value as { Value?: string }).Value ?? '');
  }
  return undefined;
}

function str(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return undefined;
  return String(value);
}

function num(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim()) {
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
}

function roleCodeKey(value: unknown): UserRolesITRoleCodeKey | undefined {
  switch (choiceVal(value)?.trim().toUpperCase()) {
    case 'INITIATOR': return 'RoleCodeKey0';
    case 'MANAGER':   return 'RoleCodeKey1';
    case 'HOD':       return 'RoleCodeKey2';
    case 'ADMIN':     return 'RoleCodeKey3';
    case 'READER':    return 'RoleCodeKey4';
    case 'IT_ADMIN':  return 'RoleCodeKey5';
    case 'IT_MANAGER': return 'RoleCodeKey6';
    case 'APPROVER':  return 'RoleCodeKey7';
    default: return undefined;
  }
}

function siteKey(value: unknown): UserRolesITSiteKey | undefined {
  switch (choiceVal(value)?.trim().toUpperCase()) {
    case 'PRAI': return 'SiteKey0';
    case 'JHR':  return 'SiteKey1';
    case 'ALL':  return 'SiteKey2';
    default: return undefined;
  }
}

function entitySiteKey(value: unknown): UserRolesITEntitySiteKey | undefined {
  switch (choiceVal(value)?.trim().toUpperCase()) {
    case 'PRAI': return 'EntitySiteKey0';
    case 'JHR':  return 'EntitySiteKey1';
    case 'ALL':  return 'EntitySiteKey2';
    default: return undefined;
  }
}

// SP column names (PascalCase / raw) → model camelCase + resolve choice fields to enum keys
function normalizeUserRolesIT(record: RawUserRolesIT): UserRolesIT {
  return {
    id: num(record.id) ?? num(record.ID) ?? 0,
    title: str(record.title) ?? str(record.Title) ?? '',
    appName: str(record.appName) ?? str(record.AppName),
    department: str(record.department) ?? str(record.Department),
    effectiveFrom: str(record.effectiveFrom) ?? str(record.EffectiveFrom),
    effectiveTo: str(record.effectiveTo) ?? str(record.EffectiveTo),
    entitySiteKey:
      (record.entitySiteKey as UserRolesITEntitySiteKey | undefined) ??
      entitySiteKey(record.EntitySite),
    isActive:
      typeof record.isActive === 'boolean'
        ? record.isActive
        : typeof record.IsActive === 'boolean'
        ? record.IsActive
        : undefined,
    roleCodeKey:
      (record.roleCodeKey as UserRolesITRoleCodeKey | undefined) ??
      roleCodeKey(record.RoleCode) ??
      'RoleCodeKey0',
    roleDisplay: str(record.roleDisplay) ?? str(record.RoleDisplay),
    securityRole: str(record.securityRole) ?? str(record.SecurityRole) ?? '',
    siteKey:
      (record.siteKey as UserRolesITSiteKey | undefined) ?? siteKey(record.Site),
    userDisplayName: str(record.userDisplayName) ?? str(record.UserDisplayName) ?? '',
    userEmail: str(record.userEmail) ?? str(record.UserEmail) ?? '',
  };
}

export class UserRolesITService {
  static async create(record: Omit<UserRolesIT, 'id'>): Promise<UserRolesIT> {
    const result = await getClient().createRecordAsync(DATA_SOURCE_NAME, record);
    if (!result.success) throw result.error;
    return normalizeUserRolesIT(result.data as RawUserRolesIT);
  }

  static async update(
    id: string,
    changedFields: Partial<Omit<UserRolesIT, 'id'>>
  ): Promise<UserRolesIT> {
    const result = await getClient().updateRecordAsync(DATA_SOURCE_NAME, id, changedFields);
    if (!result.success) throw result.error;
    return normalizeUserRolesIT(result.data as RawUserRolesIT);
  }

  static async delete(id: string): Promise<void> {
    const result = await getClient().deleteRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
  }

  static async get(id: string): Promise<UserRolesIT> {
    const result = await getClient().retrieveRecordAsync(DATA_SOURCE_NAME, id);
    if (!result.success) throw result.error;
    return normalizeUserRolesIT(result.data as RawUserRolesIT);
  }

  static async getAll(options?: IOperationOptions): Promise<UserRolesIT[]> {
    const result = await getClient().retrieveMultipleRecordsAsync(DATA_SOURCE_NAME, options);
    if (!result.success) throw result.error;
    return (result.data as RawUserRolesIT[]).map(normalizeUserRolesIT);
  }
}
