import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { CanonicalSubmissionDetailRedirect } from './shared';

const HRDepartmentHomePage = lazy(() => import('@/pages/hr/index'));

// ── Existing sub-form flows ───────────────────────────────────────────────────
const BSDListPage     = lazy(() => import('@/pages/hr/bsd/index'));
const BSDNewPage      = lazy(() => import('@/pages/hr/bsd/new'));
const BSDDetailPage   = lazy(() => import('@/pages/hr/bsd/detail'));
const DRDListPage     = lazy(() => import('@/pages/hr/drd/index'));
const DRDNewPage      = lazy(() => import('@/pages/hr/drd/new'));
const DRDDetailPage   = lazy(() => import('@/pages/hr/drd/detail'));
const CafeteriaListPage   = lazy(() => import('@/pages/hr/cafeteria/index'));
const CafeteriaNewPage    = lazy(() => import('@/pages/hr/cafeteria/new'));
const CafeteriaDetailPage = lazy(() => import('@/pages/hr/cafeteria/detail'));
const EENListPage     = lazy(() => import('@/pages/hr/een/index'));
const EENNewPage      = lazy(() => import('@/pages/hr/een/new'));
const EENDetailPage   = lazy(() => import('@/pages/hr/een/detail'));
const AWHRListPage    = lazy(() => import('@/pages/hr/awhr/index'));
const AWHRNewPage     = lazy(() => import('@/pages/hr/awhr/new'));
const AWHRDetailPage  = lazy(() => import('@/pages/hr/awhr/detail'));
const CWRListPage     = lazy(() => import('@/pages/hr/cwr/index'));
const CWRNewPage      = lazy(() => import('@/pages/hr/cwr/new'));
const CWRDetailPage   = lazy(() => import('@/pages/hr/cwr/detail'));

// ── Recruitment & Hiring ─────────────────────────────────────────────────────
const SRListPage            = lazy(() => import('@/pages/hr/sr/index'));
const SRNewPage             = lazy(() => import('@/pages/hr/sr/new'));
const SRDetailPage          = lazy(() => import('@/pages/hr/sr/detail'));
const FTCRListPage          = lazy(() => import('@/pages/hr/ftcr/index'));
const FTCRNewPage           = lazy(() => import('@/pages/hr/ftcr/new'));
const FTCRDetailPage        = lazy(() => import('@/pages/hr/ftcr/detail'));
const JDListPage            = lazy(() => import('@/pages/hr/jd/index'));
const JDNewPage             = lazy(() => import('@/pages/hr/jd/new'));
const JDDetailPage          = lazy(() => import('@/pages/hr/jd/detail'));
const InternListPage        = lazy(() => import('@/pages/hr/intern/index'));
const InternNewPage         = lazy(() => import('@/pages/hr/intern/new'));
const InternDetailPage      = lazy(() => import('@/pages/hr/intern/detail'));
const InterviewDBListPage   = lazy(() => import('@/pages/hr/interview-db/index'));
const InterviewDBNewPage    = lazy(() => import('@/pages/hr/interview-db/new'));
const InterviewDBDetailPage = lazy(() => import('@/pages/hr/interview-db/detail'));

// ── Leave & Attendance ───────────────────────────────────────────────────────
const LVEListPage     = lazy(() => import('@/pages/hr/lve/index'));
const LVENewPage      = lazy(() => import('@/pages/hr/lve/new'));
const LVEDetailPage   = lazy(() => import('@/pages/hr/lve/detail'));
const OWPListPage     = lazy(() => import('@/pages/hr/owp/index'));
const OWPNewPage      = lazy(() => import('@/pages/hr/owp/new'));
const OWPDetailPage   = lazy(() => import('@/pages/hr/owp/detail'));
const FWWPEListPage   = lazy(() => import('@/pages/hr/fwwpe/index'));
const FWWPENewPage    = lazy(() => import('@/pages/hr/fwwpe/new'));
const FWWPEDetailPage = lazy(() => import('@/pages/hr/fwwpe/detail'));

// ── Health & Wellness ────────────────────────────────────────────────────────
const HealthInfoListPage   = lazy(() => import('@/pages/hr/healthinfo/index'));
const HealthInfoNewPage    = lazy(() => import('@/pages/hr/healthinfo/new'));
const HealthInfoDetailPage = lazy(() => import('@/pages/hr/healthinfo/detail'));
const MCLListPage          = lazy(() => import('@/pages/hr/mcl/index'));
const MCLNewPage           = lazy(() => import('@/pages/hr/mcl/new'));
const MCLDetailPage        = lazy(() => import('@/pages/hr/mcl/detail'));
const HSEListPage          = lazy(() => import('@/pages/hr/hse/index'));
const HSENewPage           = lazy(() => import('@/pages/hr/hse/new'));
const HSEDetailPage        = lazy(() => import('@/pages/hr/hse/detail'));

// ── Performance & Training ───────────────────────────────────────────────────
const PAFListPage     = lazy(() => import('@/pages/hr/paf/index'));
const PAFNewPage      = lazy(() => import('@/pages/hr/paf/new'));
const PAFDetailPage   = lazy(() => import('@/pages/hr/paf/detail'));
const TMPUListPage    = lazy(() => import('@/pages/hr/tmpu/index'));
const TMPUNewPage     = lazy(() => import('@/pages/hr/tmpu/new'));
const TMPUDetailPage  = lazy(() => import('@/pages/hr/tmpu/detail'));
const HRAPRListPage   = lazy(() => import('@/pages/hr/hrapr/index'));
const HRAPRNewPage    = lazy(() => import('@/pages/hr/hrapr/new'));
const HRAPRDetailPage = lazy(() => import('@/pages/hr/hrapr/detail'));

// ── Employee Records ─────────────────────────────────────────────────────────
const EPDUListPage     = lazy(() => import('@/pages/hr/epdu/index'));
const EPDUNewPage      = lazy(() => import('@/pages/hr/epdu/new'));
const EPDUDetailPage   = lazy(() => import('@/pages/hr/epdu/detail'));
const HRInfoListPage   = lazy(() => import('@/pages/hr/hrinfo/index'));
const HRInfoNewPage    = lazy(() => import('@/pages/hr/hrinfo/new'));
const HRInfoDetailPage = lazy(() => import('@/pages/hr/hrinfo/detail'));
const GDSNListPage     = lazy(() => import('@/pages/hr/gdsn/index'));
const GDSNNewPage      = lazy(() => import('@/pages/hr/gdsn/new'));
const GDSNDetailPage   = lazy(() => import('@/pages/hr/gdsn/detail'));

// ── Documents & Forms ────────────────────────────────────────────────────────
const NDFListPage    = lazy(() => import('@/pages/hr/ndf/index'));
const NDFNewPage     = lazy(() => import('@/pages/hr/ndf/new'));
const NDFDetailPage  = lazy(() => import('@/pages/hr/ndf/detail'));
const ESFListPage    = lazy(() => import('@/pages/hr/esf/index'));
const ESFNewPage     = lazy(() => import('@/pages/hr/esf/new'));
const ESFDetailPage  = lazy(() => import('@/pages/hr/esf/detail'));

// ── Shared pages ─────────────────────────────────────────────────────────────
const HelpPage     = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function HRLayout() {
  return <DepartmentLayout departmentCode="HR" />;
}

export const hrRoutes = (
  <Route path="hr" element={<HRLayout />}>
    <Route index element={<HRDepartmentHomePage />} />

    {/* ── Existing sub-form flows ─────────────────────────────────────────── */}
    <Route path="bsd" element={<BSDListPage />} />
    <Route path="bsd/new" element={<BSDNewPage />} />
    <Route path="bsd/detail/:id" element={<BSDDetailPage />} />

    <Route path="drd" element={<DRDListPage />} />
    <Route path="drd/new" element={<DRDNewPage />} />
    <Route path="drd/detail/:id" element={<DRDDetailPage />} />
    <Route path="drd/:id" element={<DRDDetailPage />} />

    <Route path="cafeteria" element={<CafeteriaListPage />} />
    <Route path="cafeteria/new" element={<CafeteriaNewPage />} />
    <Route path="cafeteria/detail/:id" element={<CafeteriaDetailPage />} />

    <Route path="een" element={<EENListPage />} />
    <Route path="een/new" element={<EENNewPage />} />
    <Route path="een/:id" element={<EENDetailPage />} />

    <Route path="awhr" element={<AWHRListPage />} />
    <Route path="awhr/new" element={<AWHRNewPage />} />
    <Route path="awhr/:id" element={<AWHRDetailPage />} />

    <Route path="cwr" element={<CWRListPage />} />
    <Route path="cwr/new" element={<CWRNewPage />} />
    <Route path="cwr/detail/:id" element={<CWRDetailPage />} />

    {/* ── Recruitment & Hiring ────────────────────────────────────────────── */}
    <Route path="sr" element={<SRListPage />} />
    <Route path="sr/new" element={<SRNewPage />} />
    <Route path="sr/:id" element={<SRDetailPage />} />

    <Route path="ftcr" element={<FTCRListPage />} />
    <Route path="ftcr/new" element={<FTCRNewPage />} />
    <Route path="ftcr/:id" element={<FTCRDetailPage />} />

    <Route path="jd" element={<JDListPage />} />
    <Route path="jd/new" element={<JDNewPage />} />
    <Route path="jd/:id" element={<JDDetailPage />} />

    <Route path="intern" element={<InternListPage />} />
    <Route path="intern/new" element={<InternNewPage />} />
    <Route path="intern/:id" element={<InternDetailPage />} />

    <Route path="interview-db" element={<InterviewDBListPage />} />
    <Route path="interview-db/new" element={<InterviewDBNewPage />} />
    <Route path="interview-db/:id" element={<InterviewDBDetailPage />} />

    {/* ── Leave & Attendance ──────────────────────────────────────────────── */}
    <Route path="lve" element={<LVEListPage />} />
    <Route path="lve/new" element={<LVENewPage />} />
    <Route path="lve/:id" element={<LVEDetailPage />} />

    <Route path="owp" element={<OWPListPage />} />
    <Route path="owp/new" element={<OWPNewPage />} />
    <Route path="owp/:id" element={<OWPDetailPage />} />

    <Route path="fwwpe" element={<FWWPEListPage />} />
    <Route path="fwwpe/new" element={<FWWPENewPage />} />
    <Route path="fwwpe/:id" element={<FWWPEDetailPage />} />

    {/* ── Health & Wellness ───────────────────────────────────────────────── */}
    <Route path="healthinfo" element={<HealthInfoListPage />} />
    <Route path="healthinfo/new" element={<HealthInfoNewPage />} />
    <Route path="healthinfo/:id" element={<HealthInfoDetailPage />} />

    <Route path="mcl" element={<MCLListPage />} />
    <Route path="mcl/new" element={<MCLNewPage />} />
    <Route path="mcl/:id" element={<MCLDetailPage />} />

    <Route path="hse" element={<HSEListPage />} />
    <Route path="hse/new" element={<HSENewPage />} />
    <Route path="hse/:id" element={<HSEDetailPage />} />

    {/* ── Performance & Training ──────────────────────────────────────────── */}
    <Route path="paf" element={<PAFListPage />} />
    <Route path="paf/new" element={<PAFNewPage />} />
    <Route path="paf/:id" element={<PAFDetailPage />} />

    <Route path="tmpu" element={<TMPUListPage />} />
    <Route path="tmpu/new" element={<TMPUNewPage />} />
    <Route path="tmpu/:id" element={<TMPUDetailPage />} />

    <Route path="hrapr" element={<HRAPRListPage />} />
    <Route path="hrapr/new" element={<HRAPRNewPage />} />
    <Route path="hrapr/:id" element={<HRAPRDetailPage />} />

    {/* ── Employee Records ────────────────────────────────────────────────── */}
    <Route path="epdu" element={<EPDUListPage />} />
    <Route path="epdu/new" element={<EPDUNewPage />} />
    <Route path="epdu/:id" element={<EPDUDetailPage />} />

    <Route path="hrinfo" element={<HRInfoListPage />} />
    <Route path="hrinfo/new" element={<HRInfoNewPage />} />
    <Route path="hrinfo/:id" element={<HRInfoDetailPage />} />

    <Route path="gdsn" element={<GDSNListPage />} />
    <Route path="gdsn/new" element={<GDSNNewPage />} />
    <Route path="gdsn/:id" element={<GDSNDetailPage />} />

    {/* ── Documents & Forms ───────────────────────────────────────────────── */}
    <Route path="ndf" element={<NDFListPage />} />
    <Route path="ndf/new" element={<NDFNewPage />} />
    <Route path="ndf/:id" element={<NDFDetailPage />} />

    <Route path="esf" element={<ESFListPage />} />
    <Route path="esf/new" element={<ESFNewPage />} />
    <Route path="esf/:id" element={<ESFDetailPage />} />

    {/* ── Legacy HR URLs now point to SharePoint-backed form flows ─────────── */}
    <Route path="additional-hours" element={<Navigate to="/hr/awhr" replace />} />
    <Route path="backup-staff" element={<Navigate to="/hr/bsd" replace />} />
    <Route path="contract-workers" element={<Navigate to="/hr/cwr" replace />} />
    <Route path="employee-update" element={<Navigate to="/hr/epdu/new" replace />} />
    <Route path="exit-tracking" element={<Navigate to="/hr/een" replace />} />
    <Route path="foreign-workers" element={<Navigate to="/hr/fwwpe" replace />} />
    <Route path="gift-donation" element={<Navigate to="/hr/gdsn" replace />} />
    <Route path="health" element={<Navigate to="/hr/healthinfo" replace />} />
    <Route path="health-record" element={<Navigate to="/hr/healthinfo" replace />} />
    <Route path="interview-pipeline" element={<Navigate to="/hr/interview-db" replace />} />
    <Route path="internships" element={<Navigate to="/hr/intern" replace />} />
    <Route path="job-descriptions" element={<Navigate to="/hr/jd" replace />} />
    <Route path="leave" element={<Navigate to="/hr/lve" replace />} />
    <Route path="manpower-requisition" element={<Navigate to="/hr/sr/new" replace />} />
    <Route path="night-duty" element={<Navigate to="/hr/ndf" replace />} />
    <Route path="notice-database" element={<Navigate to="/hr/ndf" replace />} />
    <Route path="performance" element={<Navigate to="/hr/paf" replace />} />
    <Route path="recruitment" element={<Navigate to="/hr/sr" replace />} />
    <Route path="staff-requisition" element={<Navigate to="/hr/sr" replace />} />
    <Route path="training" element={<Navigate to="/hr/tmpu" replace />} />

    {/* ── Global redirects ────────────────────────────────────────────────── */}
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<CanonicalSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />

    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
