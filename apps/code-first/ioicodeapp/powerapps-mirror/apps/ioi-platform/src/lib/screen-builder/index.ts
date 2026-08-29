// =============================================================================
// Screen Builder — Module Index
// =============================================================================

export {
  buildScreenFormDefinition,
  buildDepartmentFormDefinitions,
  shouldUseScreenBuilder,
  getSharePointListForDept,
  getDepartmentDisplayName,
  DEPARTMENT_SCREEN_CONFIGS,
} from './screen-builder-service';

export { buildDepartmentRoutes, buildAllScreenBuilderRoutes } from './build-department-routes';

export type {
  ScreenFieldType,
  ScreenFieldDef,
  ScreenSectionDef,
  ScreenListColumn,
  ScreenDetailFieldGroup,
  ScreenFormDefinition,
  DepartmentScreenConfig,
} from './screen-builder-types';
