import * as React from 'react';

export function useIframeColorScheme(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  theme: string,
) {
  React.useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    // Set on iframe element itself
    iframe.style.colorScheme = theme;

    // Set on iframe's document if available
    if (iframe.contentDocument) {
      iframe.contentDocument.documentElement.style.colorScheme = theme;
      iframe.contentDocument.body.style.colorScheme = theme;
    }

    // Ensure styles are applied after it loads
    const handleLoad = () => {
      if (iframe.contentDocument) {
        iframe.contentDocument.documentElement.style.colorScheme = theme;
        iframe.contentDocument.body.style.colorScheme = theme;
      }
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [theme, iframeRef]);
}
