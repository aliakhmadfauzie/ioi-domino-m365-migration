import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component that automatically scrolls to the top of the page
 * whenever the route changes. This ensures users always start at the top
 * of each page when navigating.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Also reset any scrollable containers
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Focus on the main content area for accessibility
    const main = document.querySelector('main');
    if (main) {
      main.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}