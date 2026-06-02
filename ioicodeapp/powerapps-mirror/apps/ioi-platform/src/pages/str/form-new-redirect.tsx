import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { getSTRFormInfo, getSTRModuleByFormCode } from '@/config/str-constants';

export default function STRFormNewRedirectPage() {
  const { formCode = '' } = useParams();
  const [searchParams] = useSearchParams();
  const normalizedCode = formCode.toUpperCase();
  const formInfo = getSTRFormInfo(normalizedCode);
  const module = getSTRModuleByFormCode(normalizedCode);

  if (!formInfo || !module) {
    return <Navigate to="/str" replace />;
  }

  if (normalizedCode === 'MRFAPP' && searchParams.get('generic') !== '1') {
    return <Navigate to="/str/mrf/new" replace />;
  }

  return <Navigate to={`/str/new?form=${normalizedCode}&module=${module.id}`} replace />;
}
