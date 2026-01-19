import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      showAds: (...placementIds: number[]) => void;
      destroyPlaceholders: (...placementIds: number[]) => void;
    };
  }
}

interface EzoicAdProps {
  placementId: number;
}

/**
 * Ezoic Ad Placement Component
 *
 * Handles dynamic mounting/unmounting for SPAs and modals.
 * Calls showAds on mount and destroyPlaceholders on unmount.
 *
 * Usage: <EzoicAd placementId={101} />
 *
 * Get your placement IDs from the Ezoic dashboard.
 * Do not add any styling to this component - Ezoic handles sizing.
 */
export function EzoicAd({ placementId }: EzoicAdProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Show ad when component mounts
    if (!hasInitialized.current && window.ezstandalone) {
      hasInitialized.current = true;
      window.ezstandalone.cmd.push(() => {
        window.ezstandalone?.showAds(placementId);
      });
    }

    // Cleanup: destroy placeholder when component unmounts
    return () => {
      if (hasInitialized.current && window.ezstandalone) {
        window.ezstandalone.cmd.push(() => {
          window.ezstandalone?.destroyPlaceholders(placementId);
        });
        hasInitialized.current = false;
      }
    };
  }, [placementId]);

  return <div id={`ezoic-pub-ad-placeholder-${placementId}`} />;
}
