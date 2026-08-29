import { Navigate, useParams } from 'react-router-dom';
import { PageLoading } from '@/components/page-loading';
import { useMainDBIT } from '@/generated/hooks/use-main-dbit';
import { getITFormDetailPath } from '@/lib/it-form-routes';

export function CanonicalSubmissionDetailRedirect() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useMainDBIT(id ?? '');

  if (!id) return <Navigate to="/my-submissions" replace />;
  if (isLoading) return <PageLoading message="Resolving submission detail..." />;

  return <Navigate to={getITFormDetailPath(data?.formcode, id)} replace />;
}
