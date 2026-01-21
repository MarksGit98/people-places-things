import { useEffect, useRef } from 'react';
import './AdsterraAd.css';

interface AdsterraAdProps {
  scriptSrc: string;
  containerId: string;
}

/**
 * Adsterra Ad Component
 *
 * Dynamically loads an Adsterra ad script and renders its container.
 * Handles cleanup on unmount to prevent memory leaks in SPAs.
 *
 * Usage:
 * <AdsterraAd
 *   scriptSrc="https://pl28527779.effectivegatecpm.com/e367eb54c5443f7ddc13daba8ded0da3/invoke.js"
 *   containerId="container-e367eb54c5443f7ddc13daba8ded0da3"
 * />
 */
export function AdsterraAd({ scriptSrc, containerId }: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Create and append the script
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    // Append script to the container's parent or document body
    if (containerRef.current) {
      containerRef.current.parentNode?.insertBefore(script, containerRef.current);
      scriptRef.current = script;
    }

    // Cleanup on unmount
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      // Clear the container contents
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [scriptSrc]);

  return (
    <div className="adsterra-ad">
      <div id={containerId} ref={containerRef} />
    </div>
  );
}
