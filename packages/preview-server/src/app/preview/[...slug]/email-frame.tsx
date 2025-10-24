import { Slot } from '@radix-ui/react-slot';
import Color from 'colorjs.io';
import type { ComponentProps } from 'react';

function* walkDom(element: Element): Generator<Element> {
  if (element.children.length > 0) {
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children.item(i)!;
      yield child;
      yield* walkDom(child);
    }
  }
}

function invertColor(colorString: string, mode: 'foreground' | 'background') {
  const color = new Color(colorString).to("lch");

  if (mode === 'foreground') {
    if (color.lch.l! < 50) {
      color.lch.l = 100 - color.lch.l! * 0.75;
    }
  } else if (mode === 'background') {
    if (color.lch.l! >= 50) {
      color.lch.l = 100 - color.lch.l! * 0.75;
    }
  }
  
  color.lch.c! *= 0.80;

  return color.toString();
}

const colorRegex =
  /#[0-9a-fA-F]{3,4}|#[0-9a-fA-F]{6,8}|rgba?\(.*?\)|hsl\(.*?\)|hsv\(.*?\)|oklab\(.*?\)|oklch\(.*?\)/g;

function applyColorInversion(iframe: HTMLIFrameElement) {
  const { contentDocument, contentWindow } = iframe;
  if (!contentDocument || !contentWindow) return;

  if (contentDocument.body.hasAttribute('inverted-colors')) return;

  contentDocument.body.setAttribute('inverted-colors', '');

  if (!contentDocument.body.style.color) {
    contentDocument.body.style.color = 'rgb(0, 0, 0)';
  }

  for (const element of walkDom(contentDocument.documentElement)) {
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
      if (element.style.background) {
        element.style.background = element.style.background.replaceAll(
          colorRegex,
          (color) => invertColor(color, 'background'),
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
      if (element.style.border) {
        element.style.border = element.style.border.replaceAll(
          colorRegex,
          (color) => invertColor(color, 'background'),
        );
        colorRegex.lastIndex = 0;
      }
    }
  }
}

interface EmailFrameProps extends ComponentProps<'iframe'> {
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
    <Slot
      ref={(iframe: HTMLIFrameElement) => {
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
        return () => {
          iframe.removeEventListener('load', handleLoad);
        };
      }}
    >
      <iframe
        srcDoc={markup}
        width={width}
        height={height}
        {...rest}
        // This key makes sure that the iframe itself remounts to the DOM when theme changes, so
        // that the color changes in dark mode can be easily undone when switching to light mode.
        key={`iframe-on-${theme}-mode`}
      />
    </Slot>
  );
}
