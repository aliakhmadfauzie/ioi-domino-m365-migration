import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DepartmentCode } from '@/config/departments';

const DEPARTMENT_BASE_PATHS: Partial<Record<DepartmentCode, string>> = {
  ADM: 'adm',
  ADMIN: 'adm',
  ENG: 'engineering',
  FIN: 'fin',
  GOV: 'governance',
  LOG: 'log',
  MAINT: 'mtr',
  MKT: 'sales',
  MTR: 'mtr',
  PROD: 'production',
  PUR: 'procurement',
  PURCH: 'procurement',
  SEC: 'security',
  SHE: 'she',
  TD: 'training',
  WH: 'warehouse',
};

export function getDepartmentBasePath(code: string): string {
  return DEPARTMENT_BASE_PATHS[code as DepartmentCode] || code.toLowerCase();
}

export function getDepartmentRoutePath(code: string): string {
  return `/${getDepartmentBasePath(code)}`;
}

export function useBackNavigation(fallbackPath = '/') {
  const navigate = useNavigate();

  return useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackPath, { replace: true });
  }, [fallbackPath, navigate]);
}
