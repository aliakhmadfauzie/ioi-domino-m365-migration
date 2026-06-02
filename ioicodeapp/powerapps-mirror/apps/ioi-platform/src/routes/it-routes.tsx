import { lazy } from 'react';
import { Route, Navigate, useParams } from 'react-router-dom';
import DepartmentLayout from '@/components/layouts/department-layout';
import { PageLoading } from '@/components/page-loading';
import { useMainDBIT } from '@/generated/hooks/use-main-dbit';
import { getITFormDetailPath } from '@/lib/it-form-routes';

const ITDepartmentHomePage = lazy(() => import('@/pages/it/index'));
const ITSupportPage = lazy(() => import('@/pages/it/support'));
const AccessPage = lazy(() => import('@/pages/it/access'));
const HardwarePage = lazy(() => import('@/pages/it/hardware'));
const HardwareDashboardPage = lazy(() => import('@/pages/it/hardware-dashboard'));
const SAPPage = lazy(() => import('@/pages/it/sap'));
const DocumentationPage = lazy(() => import('@/pages/it/documentation'));
const ISGDocumentationPage = lazy(() => import('@/pages/it/isg'));
const DisasterRecoveryPage = lazy(() => import('@/pages/it/disaster'));
const NewITFormPage = lazy(() => import('@/pages/it/forms/[formCode]/new'));
const ITFormDatabaseView = lazy(() => import('@/pages/it/forms/[formCode]/index'));
const ITFormDetailPage = lazy(() => import('@/pages/it/forms/[formCode]/detail'));
const NewRequestPage = lazy(() => import('@/pages/it/forms/new-request'));
const ITFormsIndexPage = lazy(() => import('@/pages/it/forms/index'));
const ITSSRNewFormPage = lazy(() => import('@/pages/it/forms/itssr/new'));
const EAFNewFormPage = lazy(() => import('@/pages/it/forms/eaf/new'));
const EAFDetailPage = lazy(() => import('@/pages/it/forms/eaf/detail'));
const NIRNewFormPage = lazy(() => import('@/pages/it/forms/nir/new'));
const PRFNewPage = lazy(() => import('@/pages/it/forms/prf/new'));
const HINewPage = lazy(() => import('@/pages/it/forms/hi/new'));
const HIDatabaseView = lazy(() => import('@/pages/it/forms/hi/index'));
const HIDetailPage = lazy(() => import('@/pages/it/forms/hi/[id]'));
const EDLNewFormPage = lazy(() => import('@/pages/it/forms/edl/new'));
const ITPNewFormPage = lazy(() => import('@/pages/it/forms/itp/new'));
const ITSCNewFormPage = lazy(() => import('@/pages/it/forms/itsc/new'));
const ITSCDatabaseView = lazy(() => import('@/pages/it/forms/itsc/index'));
const ITSCDetailPage = lazy(() => import('@/pages/it/forms/itsc/detail'));
const ITSSRListPage = lazy(() => import('@/pages/it/forms/itssr/index'));
const ITSSRDetailPage = lazy(() => import('@/pages/it/forms/itssr/[id]'));
const AssetSubmissionNewFormPage = lazy(() => import('@/pages/it/forms/asset-submission/new'));
const HWRRNewFormPage = lazy(() => import('@/pages/it/forms/hwrr/new'));
const RSNewFormPage = lazy(() => import('@/pages/it/forms/rs/new'));
const SFARNewFormPage = lazy(() => import('@/pages/it/forms/sfar/new'));
const URNewFormPage = lazy(() => import('@/pages/it/forms/ur/new'));
const SRLNewFormPage = lazy(() => import('@/pages/it/forms/srl/new'));
const SRLDatabaseView = lazy(() => import('@/pages/it/forms/srl/index'));
const DCALNewFormPage = lazy(() => import('@/pages/it/forms/dcal/new'));
const DCALDatabaseView = lazy(() => import('@/pages/it/forms/dcal/index'));
const ITENewFormPage = lazy(() => import('@/pages/it/forms/ite/new'));
const ITEVTDatabaseView = lazy(() => import('@/pages/it/forms/ite/index'));
const SRRNewFormPage = lazy(() => import('@/pages/it/forms/srr/new'));
const DRRNewFormPage = lazy(() => import('@/pages/it/forms/drr/new'));
const DATARESTDatabaseView = lazy(() => import('@/pages/it/forms/drr/index'));
const ITDRNewFormPage = lazy(() => import('@/pages/it/forms/itdr/new'));
const ITDR2NewFormPage = lazy(() => import('@/pages/it/forms/itdr2/new'));
const ITDAILYRPTDatabaseView = lazy(() => import('@/pages/it/forms/itdr/index'));
const ITDR2DatabaseView = lazy(() => import('@/pages/it/forms/itdr2/index'));
const SVRRECNewFormPage = lazy(() => import('@/pages/it/forms/srvr/new'));
const SVRRECDatabaseView = lazy(() => import('@/pages/it/forms/srvr/index'));
const MPSPRNNewFormPage = lazy(() => import('@/pages/it/forms/mpsprn/new'));
const NewITINFOPage = lazy(() => import('@/pages/it/forms/itinfo/new'));
const ITINFODatabaseView = lazy(() => import('@/pages/it/forms/itinfo/index'));
const ITActivityLogPage = lazy(() => import('@/pages/it/activity-log'));
const IOIPNewFormPage = lazy(() => import('@/pages/it/forms/ioip/new'));
const IOIPDatabaseView = lazy(() => import('@/pages/it/forms/ioip/index'));
const NewTRNMANPage = lazy(() => import('@/pages/it/forms/trnman/new'));
const TRNMANDatabaseView = lazy(() => import('@/pages/it/forms/trnman/index'));
const NewISGDOCPage = lazy(() => import('@/pages/it/forms/isgdoc/new'));
const ISGDOCDatabaseView = lazy(() => import('@/pages/it/forms/isgdoc/index'));
const SAPAMRNewFormPage = lazy(() => import('@/pages/it/forms/sapamr/new'));
const SAPAMRDatabaseView = lazy(() => import('@/pages/it/forms/sapamr/index'));
const SAPCANewFormPage = lazy(() => import('@/pages/it/forms/sapca/new'));
const SAPCRNewFormPage = lazy(() => import('@/pages/it/forms/sapcr/new'));
const SAPDRPNewFormPage = lazy(() => import('@/pages/it/forms/sapdrp/new'));
const MRFNewPage = lazy(() => import('@/forms/mrf/MRFNewPage').then(m => ({ default: m.MRFNewPage })));
const SAPDRPDatabaseView = lazy(() => import('@/pages/it/forms/sapdrp/index'));
const SAPSLCFNewFormPage = lazy(() => import('@/pages/it/forms/sapslcf/new'));
const SAPSLCFDatabaseView = lazy(() => import('@/pages/it/forms/sapslcf/index'));
const SAPSOF2NewFormPage = lazy(() => import('@/pages/it/forms/sapsof2/new'));
const SAPSOF2DatabaseView = lazy(() => import('@/pages/it/forms/sapsof2/index'));
const SAPINCNewFormPage = lazy(() => import('@/pages/it/forms/sap-inc/new'));
const SAPTRNewFormPage = lazy(() => import('@/pages/it/forms/saptr/new'));
const ApproverDashboardPage = lazy(() => import('@/pages/it/approver-dashboard'));
const ITTriageDashboardPage = lazy(() => import('@/pages/it/triage-dashboard'));
const ITSupportServicesPage = lazy(() => import('@/pages/it/support-services'));
const ITAttachmentsPage = lazy(() => import('@/pages/it/attachments'));
const HelpPage = lazy(() => import('@/pages/help'));
const SettingsPage = lazy(() => import('@/pages/settings'));

function ITLayout() {
  return <DepartmentLayout departmentCode="IT" />;
}

function ITStaticFormDetailAlias({ formCode }: { formCode: string }) {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={getITFormDetailPath(formCode, id)} replace />;
}

function ITFormDetailAlias() {
  const { formCode, id } = useParams<{ formCode: string; id: string }>();
  return <Navigate to={getITFormDetailPath(formCode, id)} replace />;
}

function ITSubmissionDetailRedirect() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useMainDBIT(id ?? '');

  if (!id) return <Navigate to="/my-submissions" replace />;
  if (isLoading) return <PageLoading message="Resolving request detail..." />;
  return <Navigate to={getITFormDetailPath(data?.formcode, id)} replace />;
}

export const itRoutes = (
  <Route path="it" element={<ITLayout />}>
    <Route index element={<ITDepartmentHomePage />} />
    <Route path="support" element={<ITSupportPage />} />
    <Route path="access" element={<AccessPage />} />
    <Route path="hardware" element={<HardwarePage />} />
    <Route path="hardware-dashboard" element={<HardwareDashboardPage />} />
    <Route path="sap" element={<SAPPage />} />
    <Route path="documentation" element={<DocumentationPage />} />
    <Route path="isg" element={<ISGDocumentationPage />} />
    <Route path="docs" element={<DocumentationPage />} />
    <Route path="disaster" element={<DisasterRecoveryPage />} />
    <Route path="forms" element={<ITFormsIndexPage />} />

    {/* SAP Forms */}
    <Route path="forms/sapamr/new" element={<SAPAMRNewFormPage />} />
    <Route path="forms/saptr/new" element={<SAPTRNewFormPage />} />
    <Route path="forms/sapca/new" element={<SAPCANewFormPage />} />
    <Route path="forms/sapcr/new" element={<SAPCRNewFormPage />} />
    <Route path="forms/sapdrp/new" element={<SAPDRPNewFormPage />} />
    <Route path="forms/sapslcf/new" element={<SAPSLCFNewFormPage />} />
    <Route path="forms/intuatsof" element={<Navigate to="/it/forms/sapsof2" replace />} />
    <Route path="forms/intuatsof/new" element={<Navigate to="/it/forms/sapsof2/new" replace />} />
    <Route path="forms/silouatsof" element={<Navigate to="/it/forms/sapsof2" replace />} />
    <Route path="forms/silouatsof/new" element={<Navigate to="/it/forms/sapsof2/new" replace />} />
    <Route path="forms/sapsof2/new" element={<SAPSOF2NewFormPage />} />
    <Route path="forms/sap-inc/new" element={<SAPINCNewFormPage />} />

    {/* Hardware Forms */}
    <Route path="forms/asset/new" element={<AssetSubmissionNewFormPage />} />
    <Route path="forms/hwrr/new" element={<HWRRNewFormPage />} />

    {/* ITSC - IT Service Continuity */}
    <Route path="forms/itsc" element={<ITSCDatabaseView />} />
    <Route path="forms/itsc/new" element={<ITSCNewFormPage />} />
    <Route path="forms/itsc/:id" element={<ITSCDetailPage />} />

    {/* IT Forms */}
    {/* Template screen removed — redirect to proper ITSSR form */}
    <Route path="forms/new-request" element={<Navigate to="/it/forms/itssr/new" replace />} />
    {/* VPN is an alias for EAF (External Access Form for VPN & Citrix) */}
    <Route path="forms/vpn/new" element={<EAFNewFormPage />} />
    <Route path="forms/vpnaccess" element={<Navigate to="/it/forms/eaf" replace />} />
    <Route path="forms/vpnaccess/new" element={<Navigate to="/it/forms/eaf/new" replace />} />
    <Route path="forms/eaf/new" element={<EAFNewFormPage />} />
    <Route path="forms/eaf/:id" element={<EAFDetailPage />} />
    <Route path="forms/itssr/new" element={<ITSSRNewFormPage />} />
    <Route path="forms/itssr/itssr_submissiom" element={<ITSSRListPage />} />
    <Route path="forms/itssr/:id" element={<ITSSRDetailPage />} />
    <Route path="forms/nir/new" element={<NIRNewFormPage />} />
    <Route path="forms/itdr/new" element={<ITDRNewFormPage />} />

    {/* M2: IT Support Forms */}
    {/* IAL1 = Server Reboot Log (SRL) */}
    <Route path="forms/ial1/new" element={<SRLNewFormPage />} />
    <Route path="forms/svrreboot" element={<Navigate to="/it/forms/srl" replace />} />
    <Route path="forms/svrreboot/new" element={<Navigate to="/it/forms/srl/new" replace />} />
    <Route path="forms/srl/new" element={<SRLNewFormPage />} />
    {/* IAL2 = Data Center Access Log (DCAL) */}
    <Route path="forms/ial2/new" element={<DCALNewFormPage />} />
    <Route path="forms/dcal/new" element={<DCALNewFormPage />} />
    {/* IAL5 = Data Restoration Request (DRR) */}
    <Route path="forms/ial5/new" element={<DRRNewFormPage />} />
    <Route path="forms/drr/new" element={<DRRNewFormPage />} />
    <Route path="forms/itdr-new/new" element={<ITDRNewFormPage />} />
    <Route path="forms/prf/new" element={<PRFNewPage />} />
    <Route path="forms/mpsprn/new" element={<MPSPRNNewFormPage />} />
    {/* HI_JHR is a Johor-site variant of Hardware Inventory */}
    <Route path="forms/hi_jhr/new" element={<HINewPage />} />
    <Route path="forms/hi" element={<HIDatabaseView />} />
    <Route path="forms/hi/new" element={<HINewPage />} />
    <Route path="forms/hi/:id" element={<HIDetailPage />} />
    {/* IAL3 = IT Event Log (ITE) */}
    <Route path="forms/ial3/new" element={<ITENewFormPage />} />
    <Route path="forms/itevt" element={<Navigate to="/it/forms/ite" replace />} />
    <Route path="forms/itevt/new" element={<Navigate to="/it/forms/ite/new" replace />} />
    <Route path="forms/ite/new" element={<ITENewFormPage />} />
    <Route path="forms/srr/new" element={<SRRNewFormPage />} />
    <Route path="forms/edl/new" element={<EDLNewFormPage />} />
    <Route path="forms/itp/new" element={<ITPNewFormPage />} />
    <Route path="forms/itdr2/new" element={<ITDR2NewFormPage />} />

    {/* M1: User Access Management Forms */}
    <Route path="forms/notesid" element={<Navigate to="/it/forms/nir" replace />} />
    <Route path="forms/notesid/new" element={<Navigate to="/it/forms/nir/new" replace />} />
    <Route path="forms/pwdreset" element={<Navigate to="/it/forms/rs" replace />} />
    <Route path="forms/pwdreset/new" element={<Navigate to="/it/forms/rs/new" replace />} />
    <Route path="forms/userid" element={<Navigate to="/it/forms/ur" replace />} />
    <Route path="forms/userid/new" element={<Navigate to="/it/forms/ur/new" replace />} />
    <Route path="forms/rs/new" element={<RSNewFormPage />} />
    <Route path="forms/sfar/new" element={<SFARNewFormPage />} />
    <Route path="forms/ur/new" element={<URNewFormPage />} />
    <Route path="forms/itdr2/:id" element={<ITStaticFormDetailAlias formCode="ITDR2" />} />
    <Route path="forms/itdr/:id" element={<ITStaticFormDetailAlias formCode="ITDR" />} />
    <Route path="forms/nir/:id" element={<ITStaticFormDetailAlias formCode="NIR" />} />

    {/* IAL4 = Server Records (SVRREC) */}
    <Route path="forms/ial4/new" element={<SVRRECNewFormPage />} />
    {/* SVRREC Form */}
    <Route path="forms/svrrec" element={<Navigate to="/it/forms/srvr" replace />} />
    <Route path="forms/svrrec/new" element={<Navigate to="/it/forms/srvr/new" replace />} />
    <Route path="forms/srvr/new" element={<SVRRECNewFormPage />} />

    {/* ISG / Training / Info Forms */}
    <Route path="forms/itinfo/new" element={<NewITINFOPage />} />
    <Route path="forms/trnman/new" element={<NewTRNMANPage />} />
    <Route path="forms/isgdoc/new" element={<NewISGDOCPage />} />

    {/* M5: IT Documentation — IOI Policy */}
    <Route path="forms/ioipol" element={<Navigate to="/it/forms/ioip" replace />} />
    <Route path="forms/ioipol/new" element={<Navigate to="/it/forms/ioip/new" replace />} />
    <Route path="forms/ioip/new" element={<IOIPNewFormPage />} />
    <Route path="forms/ioip" element={<IOIPDatabaseView />} />
    <Route path="forms/ioip/:id" element={<ITStaticFormDetailAlias formCode="IOIP" />} />

    {/* Form Database Views — specific routes must precede generic :formCode */}
    <Route path="forms/ial1" element={<SRLDatabaseView />} />
    <Route path="forms/srl" element={<SRLDatabaseView />} />
    <Route path="forms/ial2" element={<DCALDatabaseView />} />
    <Route path="forms/dcal" element={<DCALDatabaseView />} />
    <Route path="forms/ial3" element={<ITEVTDatabaseView />} />
    <Route path="forms/ite" element={<ITEVTDatabaseView />} />
    <Route path="forms/ial4" element={<SVRRECDatabaseView />} />
    <Route path="forms/srvr" element={<SVRRECDatabaseView />} />
    <Route path="forms/ial5" element={<DATARESTDatabaseView />} />
    <Route path="forms/drr" element={<DATARESTDatabaseView />} />
    <Route path="forms/itdailyrpt" element={<Navigate to="/it/forms/itdr" replace />} />
    <Route path="forms/itdailyrpt/new" element={<Navigate to="/it/forms/itdr/new" replace />} />
    <Route path="forms/hwinv_prai" element={<Navigate to="/it/forms/hi" replace />} />
    <Route path="forms/hwinv_prai/new" element={<Navigate to="/it/forms/hi/new" replace />} />
    <Route path="forms/itdr" element={<ITDAILYRPTDatabaseView />} />
    <Route path="forms/itdr2" element={<ITDR2DatabaseView />} />
    <Route path="forms/itinfo" element={<ITINFODatabaseView />} />
    <Route path="forms/trnman" element={<TRNMANDatabaseView />} />
    <Route path="forms/isgdoc" element={<ISGDOCDatabaseView />} />
    <Route path="forms/sapamr" element={<SAPAMRDatabaseView />} />
    <Route path="forms/sapdrp" element={<SAPDRPDatabaseView />} />
    <Route path="forms/sapslcf" element={<SAPSLCFDatabaseView />} />
    <Route path="forms/sapsof2" element={<SAPSOF2DatabaseView />} />
    <Route path="forms/itssr" element={<ITSSRListPage />} />

    {/* IT Support Services */}
    <Route path="support-services" element={<ITSupportServicesPage />} />
    <Route path="support-services/submission/:id" element={<ITStaticFormDetailAlias formCode="ITSSR" />} />

    {/* Debug-instrumented MRF example — must precede generic :formCode routes */}
    <Route path="forms/mrf/new" element={<MRFNewPage />} />

    {/* Generic form routes — must follow specific routes above */}
    <Route path="forms/:formCode" element={<ITFormDatabaseView />} />
    <Route path="forms/:formCode/new" element={<NewITFormPage />} />
    <Route path="forms/:formCode/detail/:id" element={<ITFormDetailPage />} />
    <Route path="forms/:formCode/:id" element={<ITFormDetailAlias />} />

    {/* IAL1-5 Consolidated Database View */}
    <Route path="activity-log" element={<ITActivityLogPage />} />
    <Route path="triage-dashboard" element={<ITTriageDashboardPage />} />
    <Route path="approver-dashboard" element={<ApproverDashboardPage />} />
    <Route path="attachments" element={<ITAttachmentsPage />} />
    <Route path="approvals" element={<Navigate to="/approvals" replace />} />
    <Route path="submissions" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/module/:moduleCode" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/form/:formCode" element={<Navigate to="/my-submissions" replace />} />
    <Route path="submissions/:id" element={<ITSubmissionDetailRedirect />} />
    <Route path="manager-dashboard" element={<Navigate to="/manager-dashboard" replace />} />
    <Route path="help" element={<HelpPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
);
