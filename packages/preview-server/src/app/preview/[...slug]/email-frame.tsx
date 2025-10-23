import Color from 'color';
import { type ComponentProps, type RefObject, useRef } from 'react';
import { makeIframeDocumentBubbleEvents } from '../../../components/resizable-wrapper';

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

interface EmailFrameProps extends Omit<ComponentProps<'iframe'>, 'ref'> {
  markup: string;
  width: number;
  height: number;
  theme: 'dark' | 'light';
}

export function EmailFrame({
  markup,
  width,
  height,
  theme,
  ...rest
}: EmailFrameProps) {
  return (
    <iframe
      srcDoc={markup}
      width={width}
      height={height}
      {...rest}
      // This key makes sure that the iframe itself remounts to the DOM when theme changes, so
      // that the color changes in dark mode can be easily undone when switching to light mode.
      key={`iframe-on-${theme}-mode`}
      ref={(iframe) => {
        if (!iframe) return;

        if (theme === 'dark') {
          applyColorInversion(iframe);
        }

        const handleLoad = () => {
          if (theme === 'dark') {
            applyColorInversion(iframe);
          }
        };

        iframe.addEventListener('load', handleLoad);

        let callback: () => void;
        if (iframe) {
          callback = makeIframeDocumentBubbleEvents(iframe);
        }

        return () => {
          callback?.();
          if (iframe) {
            iframe.removeEventListener('load', handleLoad);
          }
        };
      }}
    />
  );
}
