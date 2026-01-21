import { useEffect, useRef } from 'react';
import './AdsterraBanner.css';

interface AdsterraBannerProps {
  adKey: string;
  width: number;
  height: number;
  position?: 'left' | 'right' | 'bottom';
  desktopOnly?: boolean;
}

/**
 * Adsterra Banner Ad Component (iframe format)
 *
 * Handles the atOptions-style Adsterra banner ads.
 *
 * Usage:
 * <AdsterraBanner
 *   adKey="7370110dc9e2b65e305339fd5395c7e3"
 *   width={300}
 *   height={250}
 *   position="left"
 *   desktopOnly
 * />
 */
export function AdsterraBanner({ adKey, width, height, position = 'bottom', desktopOnly = false }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set atOptions on window
    (window as unknown as Record<string, unknown>).atOptions = {
      key: adKey,
      format: 'iframe',
      height: height,
      width: width,
      params: {}
    };

    // Create and append the script
    const script = document.createElement('script');
    script.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    script.async = true;

    containerRef.current.appendChild(script);
    scriptRef.current = script;

    // Cleanup on unmount
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [adKey, width, height]);

  const classNames = [
    'adsterra-banner',
    `adsterra-banner--${position}`,
    desktopOnly ? 'adsterra-banner--desktop-only' : ''
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classNames}
      ref={containerRef}
      style={{ width: `${width}px`, height: `${height}px` }}
    />
  );
}
