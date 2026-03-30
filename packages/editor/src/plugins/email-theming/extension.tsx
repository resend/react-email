import { Body, Head, Html, Preview } from '@react-email/components';
import type { Editor, JSONContent } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { useEditorState } from '@tiptap/react';
import type * as React from 'react';
import type { SerializerPlugin } from '../../core/serializer/serializer-plugin';
import { getGlobalContent } from '../../extensions/global-content';
import {
  injectGlobalPlainCss,
  injectThemeCss,
  mergeCssJs,
  transformToCssJs,
} from './css-transforms';
import {
  inferThemeFromPanelStyles,
  normalizeThemePanelStyles,
} from './normalization';
import {
  DEFAULT_INBOX_FONT_SIZE_PX,
  EDITOR_THEMES,
  RESET_THEMES,
} from './themes';
import type {
  CssJs,
  EditorTheme,
  KnownThemeComponents,
  PanelGroup,
} from './types';

/**
 * Maps a document node (type + attrs) to the theme component key used for style lookup.
 * Centralizes all node-type → theme-component knowledge.
 */
export function getThemeComponentKey(
  nodeType: string,
  depth: number,
  attrs: Record<string, unknown> = {},
): KnownThemeComponents | null {
  switch (nodeType) {
    case 'paragraph':
      if (depth > 0) {
        return 'listParagraph';
      }
      return 'paragraph';
    case 'heading': {
      const level = attrs.level as number | undefined;
      return `h${level ?? 1}` as KnownThemeComponents;
    }
    case 'blockquote':
      return 'blockquote';
    case 'button':
      return 'button';
    case 'container':
      return 'container';
    case 'section':
      return 'section';
    case 'footer':
      return 'footer';
    case 'image':
      return 'image';
    case 'youtube':
    case 'twitter':
      return 'image';
    case 'orderedList':
    case 'bulletList':
      if (depth > 0) {
        return 'nestedList';
      }
      return 'list';
    case 'listItem':
      return 'listItem';
    case 'codeBlock':
      return 'codeBlock';
    case 'code':
      return 'inlineCode';
    case 'link':
      return 'link';
    case 'horizontalRule':
      return 'hr';
    default:
      return null;
  }
}

/**
 * Returns merged theme styles (reset + panel styles) for the given editor.
 * Use when you have editor access and need the full CssJs map.
 */
export function getMergedCssJs(
  theme: EditorTheme,
  panelStyles: PanelGroup[] | undefined,
): CssJs {
  const panels: PanelGroup[] =
    normalizeThemePanelStyles(theme, panelStyles) ?? EDITOR_THEMES[theme];
  const parsed = transformToCssJs(panels, DEFAULT_INBOX_FONT_SIZE_PX);
  const merged = mergeCssJs(RESET_THEMES[theme], parsed);

  return merged;
}

/**
 * Returns resolved React.CSSProperties for a node when you already have merged CssJs
 * (e.g. in the serializer where there is no editor). Centralizes which theme keys
 * apply to which node type.
 */
const RESET_NODE_TYPES = new Set([
  'body',
  'bulletList',
  'container',
  'button',
  'columns',
  'div',
  'h1',
  'h2',
  'h3',
  'list',
  'listItem',
  'listParagraph',
  'nestedList',
  'orderedList',
  'table',
  'paragraph',
  'tableCell',
  'tableHeader',
  'tableRow',
  'youtube',
]);

export function getResolvedNodeStyles(
  node: JSONContent,
  depth: number,
  mergedCssJs: CssJs,
): React.CSSProperties {
  const key = getThemeComponentKey(node.type ?? '', depth, node.attrs ?? {});
  if (!key) {
    if (RESET_NODE_TYPES.has(node.type ?? '')) {
      return mergedCssJs.reset ?? {};
    }
    return {};
  }
  const component = mergedCssJs[key] ?? {};
  const shouldReset =
    RESET_NODE_TYPES.has(key) || RESET_NODE_TYPES.has(node.type ?? '');
  if (shouldReset) {
    const reset = mergedCssJs.reset ?? {};
    return { ...reset, ...component };
  }
  return { ...component };
}

export function stylesToCss(
  styles: PanelGroup[],
  theme: EditorTheme,
): Record<KnownThemeComponents, React.CSSProperties> {
  const parsed = transformToCssJs(
    normalizeThemePanelStyles(theme, styles) ?? EDITOR_THEMES[theme],
    DEFAULT_INBOX_FONT_SIZE_PX,
  );
  return mergeCssJs(RESET_THEMES[theme], parsed);
}

function getEmailTheming(editor: Editor) {
  const theme = getEmailTheme(editor);
  const normalizedStyles =
    normalizeThemePanelStyles(theme, getEmailStyles(editor)) ??
    EDITOR_THEMES[theme];

  return {
    styles: normalizedStyles,
    theme,
    css: getEmailCss(editor),
  };
}

export function useEmailTheming(editor: Editor | null) {
  return useEditorState({
    editor,
    selector({ editor: ed }) {
      if (!ed) {
        return null;
      }
      return getEmailTheming(ed);
    },
  });
}

function getEmailStyles(editor: Editor) {
  return getGlobalContent('styles', editor) as PanelGroup[] | null;
}

/**
 * Sets the global panel styles on the editor document.
 * Persists into the `GlobalContent` node under the `'styles'` key.
 */
export function setGlobalStyles(editor: Editor, styles: PanelGroup[]): boolean {
  return editor.commands.setGlobalContent('styles', styles);
}

/**
 * Sets the current email theme on the editor document.
 * Persists into the `GlobalContent` node under the `'theme'` key.
 */
export function setCurrentTheme(editor: Editor, theme: EditorTheme): boolean {
  return editor.commands.setGlobalContent('theme', theme);
}

/**
 * Sets the global CSS string injected into the email `<head>`.
 * Persists into the `GlobalContent` node under the `'css'` key.
 */
export function setGlobalCssInjected(editor: Editor, css: string): boolean {
  return editor.commands.setGlobalContent('css', css);
}

function getEmailTheme(editor: Editor) {
  const extensionTheme = (
    editor.extensionManager.extensions.find(
      (extension) => extension.name === 'theming',
    ) as { options?: { theme?: EditorTheme } }
  )?.options?.theme;
  if (extensionTheme === 'basic' || extensionTheme === 'minimal') {
    return extensionTheme;
  }

  const globalTheme = getGlobalContent('theme', editor) as EditorTheme | null;
  if (globalTheme === 'basic' || globalTheme === 'minimal') {
    return globalTheme;
  }

  const inferredTheme = inferThemeFromPanelStyles(getEmailStyles(editor));
  if (inferredTheme) {
    return inferredTheme;
  }

  return 'basic';
}

function getEmailCss(editor: Editor) {
  return getGlobalContent('css', editor) as string | null;
}

export const EmailTheming = Extension.create<{
  theme?: EditorTheme;
  serializerPlugin: SerializerPlugin;
}>({
  name: 'theming',

  addOptions() {
    return {
      theme: undefined as EditorTheme | undefined,
      serializerPlugin: {
        getNodeStyles(node, depth, editor): React.CSSProperties {
          const theming = getEmailTheming(editor);

          return getResolvedNodeStyles(
            node,
            depth,
            getMergedCssJs(theming.theme, theming.styles),
          );
        },
        BaseTemplate({ previewText, children, editor }) {
          const { css: globalCss, styles, theme } = getEmailTheming(editor);
          const mergedStyles = getMergedCssJs(theme, styles);

          return (
            <Html>
              <Head>
                <meta content="width=device-width" name="viewport" />
                <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
                <meta name="x-apple-disable-message-reformatting" />
                <meta
                  content="telephone=no,address=no,email=no,date=no,url=no"
                  name="format-detection"
                />

                {globalCss && <style>{globalCss}</style>}
              </Head>
              {previewText && previewText !== '' && (
                <Preview>{previewText}</Preview>
              )}

              <Body style={mergedStyles.body}>{children}</Body>
            </Html>
          );
        },
      } satisfies SerializerPlugin,
    };
  },

  addProseMirrorPlugins() {
    const { editor } = this;
    const scopeId = `tiptap-theme-${Math.random().toString(36).slice(2, 10)}`;
    const scopeAttribute = 'data-editor-theme-scope';
    const scopeSelector = `.tiptap.ProseMirror[${scopeAttribute}="${scopeId}"]`;
    const themeStyleId = `${scopeId}-theme`;
    const globalStyleId = `${scopeId}-global`;

    return [
      new Plugin({
        key: new PluginKey('themingStyleInjector'),
        view(view) {
          let prevStyles: PanelGroup[] | null = null;
          let prevTheme: EditorTheme | null = null;
          let prevCss: string | null = null;

          view.dom.setAttribute(scopeAttribute, scopeId);

          const sync = () => {
            const theme = getEmailTheme(editor);
            const styles = getEmailStyles(editor);
            const resolvedStyles = styles ?? EDITOR_THEMES[theme];
            const css = getEmailCss(editor);

            if (styles !== prevStyles || theme !== prevTheme) {
              prevStyles = styles as PanelGroup[] | null;
              prevTheme = theme;
              const mergedCssJs = getMergedCssJs(theme, resolvedStyles);
              injectThemeCss(mergedCssJs, {
                scopeSelector,
                styleId: themeStyleId,
              });
            }

            if (css !== prevCss) {
              prevCss = css;
              injectGlobalPlainCss(css, {
                scopeSelector,
                styleId: globalStyleId,
              });
            }
          };

          sync();

          return {
            update: sync,
            destroy() {
              document.getElementById(themeStyleId)?.remove();
              document.getElementById(globalStyleId)?.remove();
              view.dom.removeAttribute(scopeAttribute);
            },
          };
        },
      }),
    ];
  },
});
