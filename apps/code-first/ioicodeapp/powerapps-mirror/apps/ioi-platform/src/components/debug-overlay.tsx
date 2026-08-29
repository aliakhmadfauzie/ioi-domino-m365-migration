import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_LIBS = [
  'react',
  'react-router-dom',
  '@tanstack/react-query',
  'lucide-react',
  'motion/react',
  'sonner',
];

interface RouteMeta {
  matcher: RegExp;
  file: string;
  feature: string;
  service: string;
  model: string;
  component: string;
}

const ROUTE_METADATA: RouteMeta[] = [
  {
    matcher: /^\/$|^\/department-hub$/,
    file: 'src/pages/department-hub.tsx',
    feature: 'department-hub',
    service: 'usePlatform, navigation, dashboard hooks',
    model: 'department config types',
    component: 'DepartmentHubPage',
  },
  {
    matcher: /^\/it\/forms\/eaf\/new$/,
    file: 'src/pages/it/forms/eaf/new.tsx',
    feature: 'it>forms>eaf>new',
    service: 'useCreateMainDBIT, MainDBITExtAccessService, useSendApprovalEmail, useSendConfirmationEmail, useFormApprover, useSharePointCompanies, useOffice365Users',
    model: 'MainDBIT, MainDBITExtAccess, EAFFormInput',
    component: 'PeoplePicker, Select, Input, Textarea, Card',
  },
  {
    matcher: /^\/it\/forms\/itssr\/new$/,
    file: 'src/pages/it/forms/itssr/new.tsx',
    feature: 'it>forms>itssr>new',
    service: 'MainDBITService, MainDBITExtSupportService, MainDBITExtDocsService, determineITSSRRouting, useSharePointConfig',
    model: 'MainDBIT, MainDBITExtSupport, MainDBITExtDocs',
    component: 'ITSSRNewFormPage, SharePointLookupSelect, Input, Select',
  },
  {
    matcher: /^\/it\/forms\/itssr(?:\/|$)/,
    file: 'src/pages/it/forms/itssr/index.tsx',
    feature: 'features>itssr>itssr-app',
    service: 'useITSSRList, useITSSRDetail, useWorkflowHooks',
    model: 'ITSSRRecord',
    component: 'ITSSRListScreen, Table, Filters',
  },
  {
    matcher: /^\/it\/forms\/eaf(?:\/|$)/,
    file: 'src/pages/it/forms/eaf/index.tsx',
    feature: 'it>forms>eaf',
    service: 'useEAFSubmissions, approval hooks, dynamic routing',
    model: 'EAFSubmission, ApprovalHistory',
    component: 'EAFDatabaseView, Table, Tabs',
  },
  {
    matcher: /^\/it\/forms\/hwrr\/new$/,
    file: 'src/pages/it/forms/hwrr/new.tsx',
    feature: 'it>forms>hwrr>new',
    service: 'useCreateMainDBIT, useCreateMainDBITExtAssets, useOffice365Users, useSharePointConfig',
    model: 'MainDBIT, HWRRFormInput',
    component: 'PeoplePicker, UserPicker, Select, Input, Textarea',
  },
];

function getRouteMetadata(pathname: string) {
  const match = ROUTE_METADATA.find((meta) => meta.matcher.test(pathname));
  return (
    match ?? {
      matcher: /.*/,
      file: normalizePathToSource(pathname),
      feature: pathname.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean).join('>') || 'department-hub',
      service: 'generated services, platform connectors, workflow hooks',
      model: 'generated models, form types, submission schemas',
      component: 'page layout, shared UI components, feature modules',
    }
  );
}

function normalizePathToSource(pathname: string) {
  const trimmed = pathname.replace(/\/?$/, '');
  if (trimmed === '') {
    return 'src/pages/department-hub.tsx';
  }

  const segments = trimmed.split('/').filter(Boolean);
  const maybeId = segments[segments.length - 1];
  const hasIdSegment = /^\d+$/.test(maybeId) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(maybeId);

  if (segments[0] === 'it' && segments[1] === 'forms' && segments[2] === 'itssr') {
    if (segments.length === 3) {
      return 'src/pages/it/forms/itssr/index.tsx';
    }
    if (segments[3] === 'new') {
      return 'src/pages/it/forms/itssr/new.tsx';
    }
    if (segments.length === 4) {
      return 'src/pages/it/forms/itssr/[id].tsx';
    }
  }

  if (segments[0] === 'admin' && segments.length === 2) {
    return `src/pages/admin/${segments[1]}.tsx`;
  }

  if (segments[0] === 'submissions' && segments.length === 2) {
    return 'src/pages/submissions/[id].tsx';
  }

  if (segments[segments.length - 1] === 'new') {
    return `src/pages/${segments.slice(0, -1).join('/')}/new.tsx`;
  }

  if (segments[segments.length - 1] === 'index' || segments[segments.length - 1] === '') {
    return `src/pages/${segments.join('/')}/index.tsx`;
  }

  if (segments.length === 1) {
    return `src/pages/${segments[0]}.tsx`;
  }

  if (hasIdSegment) {
    return `src/pages/${segments.slice(0, -1).join('/')}/[id].tsx`;
  }

  return `src/pages/${segments.join('/')}.tsx`;
}

export function DebugOverlay() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const routeMeta = useMemo(() => getRouteMetadata(location.pathname), [location.pathname]);

  return (
    <div className="fixed right-3 bottom-3 z-[9999]" aria-hidden="true">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border border-slate-600/40 bg-slate-950/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 shadow-lg backdrop-blur-sm transition hover:border-slate-500 hover:text-slate-200"
        >
          dbg
        </button>
      ) : (
        <div className="w-[330px] rounded-2xl border border-slate-600/40 bg-slate-950/95 px-3 py-2 text-[11px] leading-5 text-slate-200 shadow-2xl shadow-slate-950/30 backdrop-blur-sm">
          <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            <span>debug info</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-slate-700/60 bg-slate-900/90 px-2 py-1 text-[10px] font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              close
            </button>
          </div>
          <div className="space-y-1">
            <div>
              <span className="font-semibold text-slate-100">route:</span>{' '}
              <span className="text-slate-300">{location.pathname || '/'}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-100">file:</span>{' '}
              <span className="text-slate-300">{routeMeta.file}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-100">feature:</span>{' '}
              <span className="text-slate-300">{routeMeta.feature}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-100">service:</span>{' '}
              <span className="text-slate-300">{routeMeta.service}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-100">model:</span>{' '}
              <span className="text-slate-300">{routeMeta.model}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-100">component:</span>{' '}
              <span className="text-slate-300">{routeMeta.component}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-100">libraries:</span>{' '}
              <span className="text-slate-300">{DEFAULT_LIBS.join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
