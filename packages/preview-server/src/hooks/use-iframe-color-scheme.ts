import * as React from 'react';
import Color from 'color';

function* walkDOM(element: Element): Generator<Element> {
  if (element.children.length > 0) {
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children.item(i)!;
      yield child;
      yield* walkDOM(child);
    }
  }
}

function invertColor(colorString: string, mode: 'foreground' | 'background') {
  const color = Color(colorString);

  let lightness = color.lightness();
  if (mode === 'foreground') {
    if (lightness < 50) {
      lightness = 100 - lightness;
    }
  } else if (mode === 'background') {
    if (lightness >= 50) {
      lightness = 100 - lightness;
    }
  }

  return Color.hsl(color.hue(), color.saturationl(), lightness).string();
}

const colorRegex =
  /#[0-9a-zA-Z]{0,8}|rgba?\(.*?\)|hsl\(.*?\)|hsv\(.*?\)|oklab\(.*?\)|oklch\(.*?\)/g;

function applyColorInversion(iframe: HTMLIFrameElement) {
  const { contentDocument, contentWindow } = iframe;
  if (!contentDocument || !contentWindow) return;

  for (const element of walkDOM(contentDocument.documentElement)) {
    if (
      element instanceof
      (contentWindow as unknown as typeof globalThis).HTMLElement
    ) {
      if (element.style.color) {
        element.style.color = element.style.color.replaceAll(
          colorRegex,
          (color) => invertColor(color, 'foreground'),
        );
        colorRegex.lastIndex = 0;
      }
      if (element.style.backgroundColor) {
        element.style.backgroundColor =
          element.style.backgroundColor.replaceAll(colorRegex, (color) =>
            invertColor(color, 'background'),
          );
        colorRegex.lastIndex = 0;
      }
      if (element.style.borderColor) {
        element.style.borderColor = element.style.borderColor.replaceAll(
          colorRegex,
          (color) => invertColor(color, 'background'),
        );
        colorRegex.lastIndex = 0;
      }
    }
  }
}

export function useIframeColorScheme(
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  theme: 'dark' | 'light',
) {
  React.useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) return;

    if (theme === 'dark') {
      console.log('applying color inversion');
      applyColorInversion(iframe);
    }

    const handleLoad = () => {
      if (theme === 'dark') {
        console.log('applying color inversion');
        applyColorInversion(iframe);
      }
    };

    iframe.addEventListener('load', handleLoad);

    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, [theme, iframeRef]);
}
