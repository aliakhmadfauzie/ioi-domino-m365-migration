/**
 * DeepLinkHandler — Watches for Power Automate deep-link parameters
 * and handles auto-navigation + notifications when the app loads
 * from an external link (e.g. email notification).
 */

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppParams } from '@/hooks/use-app-params';
import { toast } from 'sonner';

export function DeepLinkHandler() {
  const params = useAppParams();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    // Only handle once on initial load
    if (handled.current) return;
    if (!params.formCode && !params.itemId && !params.notification) return;

    handled.current = true;

    // Show a notification toast if one was provided
    if (params.notification) {
      toast.info(params.notification, {
        duration: 6000,
        position: 'top-center',
      });
    }

    // Auto-navigate based on params
    if (params.formCode && params.action) {
      const dept = params.department?.toLowerCase() || 'it';
      const formCode = params.formCode.toLowerCase();

      switch (params.action) {
        case 'new':
          navigate(`/${dept}/forms/${formCode}/new`);
          break;
        case 'view':
          if (params.itemId) {
            navigate(`/${dept}/forms/${formCode}/${params.itemId}`);
          } else {
            navigate(`/${dept}/forms/${formCode}`);
          }
          break;
        case 'edit':
          if (params.itemId) {
            navigate(`/${dept}/forms/${formCode}/${params.itemId}/edit`);
          }
          break;
        case 'approve':
          navigate('/approvals');
          break;
      }
    } else if (params.itemId) {
      // Just an item ID — go to the canonical detail redirect
      navigate(`/submissions/${params.itemId}`);
    }
  }, [params, navigate]);

  return null;
}
