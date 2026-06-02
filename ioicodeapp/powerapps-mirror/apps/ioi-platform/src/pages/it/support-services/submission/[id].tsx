import { Navigate, useParams } from 'react-router-dom';
import { getITFormDetailPath } from '@/lib/it-form-routes';

export default function ITSupportServiceSubmissionRedirect() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={getITFormDetailPath('ITSSR', id)} replace />;
}
