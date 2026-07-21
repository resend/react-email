import type { Editor, Extensions, JSONContent } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { useEditorState } from '@tiptap/react';
import type * as React from 'react';
import { Body, Head, Html, Preview } from 'react-email';
import type { ComposeContext } from '../../core/serializer/compose-context';
import { toComposeContext } from '../../core/serializer/compose-context';
import type { SerializerPlugin } from '../../core/serializer/serializer-plugin';
import {
  getGlobalContent,
  getGlobalContentFromJSON,
} from '../../extensions/global-content';
import { DARK_MODE_CSS } from '../../utils/dark-mode';
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
import { isThemeConfig, themeStylesToPanelOverrides } from './theme-config';
import {
  DEFAULT_INBOX_FONT_SIZE_PX,
  EDITOR_THEMES,
  RESET_THEMES,
} from './themes';
import type {
  CssJs,
  EditorTheme,
  EditorThemeInput,
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
 * Node types and theme component keys that should receive the universal
 * `reset` CSS (e.g. `margin: 0; padding: 0`) layered underneath their own
 * theme styles. Shared between `getResolvedNodeStyles` (email serializer)
 * and `injectThemeCss` (editor preview) so both surfaces stay in sync.
 *
 * Includes both raw tiptap node names (e.g. `tableCell`) and theme
 * component keys (e.g. `list`) because the serializer matches against both.
 *
 * `bulletList` and `orderedList` are intentionally omitted: their elements
 * already carry the shared `node-list` class, so the `list` reset rule
 * covers them without forcing the dedicated `.node-bulletList` /
 * `.node-orderedList` rules to redundantly emit `margin: 0; padding: 0`.
 */
export const RESET_NODE_TYPES = new Set<string>([
  'body',
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
  'table',
  'paragraph',
  'tableCell',
  'tableHeader',
  'tableRow',
  'youtube',
]);

/**
 * Returns resolved React.CSSProperties for a node when you already have merged CssJs
 * (e.g. in the serializer where there is no editor). Centralizes which theme keys
 * apply to which node type.
 */
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

function resolveThemeConfig(config: EditorThemeInput): {
  baseTheme: EditorTheme;
  panels: PanelGroup[] | undefined;
} {
  if (!isThemeConfig(config)) {
    return { baseTheme: config, panels: undefined };
  }
  const baseTheme: EditorTheme = config.extends ?? 'minimal';
  const basePanels = EDITOR_THEMES[baseTheme];
  const panels = themeStylesToPanelOverrides(config.styles, basePanels);
  return { baseTheme, panels };
}

interface ThemingInputs {
  /** The theme configured on the theming extension, if any. */
  configuredTheme: EditorThemeInput | undefined;
  /** Values persisted in the document's `globalContent` node. */
  globalTheme: unknown;
  globalStyles: PanelGroup[] | null;
  globalCss: string | null;
}

export interface EmailThemingResult {
  theme: EditorTheme;
  styles: PanelGroup[];
  css: string | null;
}

function resolveEmailTheme(
  configuredTheme: EditorThemeInput | undefined,
  globalTheme: unknown,
  globalStyles: PanelGroup[] | null,
): EditorTheme {
  if (isThemeConfig(configuredTheme)) {
    return resolveThemeConfig(configuredTheme).baseTheme;
  }
  if (configuredTheme === 'basic' || configuredTheme === 'minimal') {
    return configuredTheme;
  }
  if (globalTheme === 'basic' || globalTheme === 'minimal') {
    return globalTheme;
  }
  return inferThemeFromPanelStyles(globalStyles) ?? 'basic';
}

/**
 * Resolves the effective theme, panel styles, and global CSS from the two
 * places theming can live: the extension's configuration and the document's
 * `globalContent` node. Shared by the editor path (live document) and the
 * serializer path (JSON document) so both resolve identically.
 */
function resolveEmailTheming({
  configuredTheme,
  globalTheme,
  globalStyles,
  globalCss,
}: ThemingInputs): EmailThemingResult {
  const theme = resolveEmailTheme(configuredTheme, globalTheme, globalStyles);

  // Styles persisted in the document win. Otherwise a config-object theme
  // contributes its own panel overrides — the editor also seeds these into
  // `globalContent` on mount, but a document serialized on a server may
  // never have been opened in an editor, so seeding cannot be relied on.
  const panelStyles =
    globalStyles ??
    (isThemeConfig(configuredTheme)
      ? (resolveThemeConfig(configuredTheme).panels ?? null)
      : null);

  return {
    theme,
    styles:
      normalizeThemePanelStyles(theme, panelStyles) ?? EDITOR_THEMES[theme],
    css: globalCss,
  };
}

function findConfiguredTheme(
  extensions: Extensions,
): EditorThemeInput | undefined {
  return (
    extensions.find((extension) => extension.name === 'theming') as
      | { options?: { theme?: EditorThemeInput } }
      | undefined
  )?.options?.theme;
}

export function getEmailTheming(
  editor: Editor | ComposeContext,
): EmailThemingResult {
  // Also accepts a ComposeContext: serializer plugins written against the
  // editor-based API call this with whatever the serializer handed them,
  // which is a context since the SSR refactor.
  if (!('extensionManager' in editor)) {
    return getEmailThemingFromContext(editor);
  }
  return resolveEmailTheming({
    configuredTheme: findConfiguredTheme(editor.extensionManager.extensions),
    globalTheme: getGlobalContent('theme', editor),
    globalStyles: getEmailStyles(editor),
    globalCss: getEmailCss(editor),
  });
}

const themingByContext = new WeakMap<ComposeContext, EmailThemingResult>();

export function getEmailThemingFromContext(
  context: ComposeContext,
): EmailThemingResult {
  let theming = themingByContext.get(context);
  if (!theming) {
    theming = resolveEmailTheming({
      configuredTheme: findConfiguredTheme(context.extensions),
      globalTheme: getGlobalContentFromJSON('theme', context.doc),
      globalStyles: getGlobalContentFromJSON('styles', context.doc) as
        | PanelGroup[]
        | null,
      globalCss: getGlobalContentFromJSON('css', context.doc) as string | null,
    });
    themingByContext.set(context, theming);
  }
  return theming;
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

function getEmailTheme(editor: Editor): EditorTheme {
  return resolveEmailTheme(
    findConfiguredTheme(editor.extensionManager.extensions),
    getGlobalContent('theme', editor),
    getEmailStyles(editor),
  );
}

function getEmailCss(editor: Editor) {
  return getGlobalContent('css', editor) as string | null;
}

const mergedCssJsByContext = new WeakMap<ComposeContext, CssJs>();

function getMergedCssJsForContext(value: Editor | ComposeContext): CssJs {
  const context = toComposeContext(value);
  let merged = mergedCssJsByContext.get(context);
  if (!merged) {
    const { theme, styles } = getEmailThemingFromContext(context);
    merged = getMergedCssJs(theme, styles);
    mergedCssJsByContext.set(context, merged);
  }
  return merged;
}

export const EmailTheming = Extension.create<{
  theme?: EditorThemeInput;
  serializerPlugin: SerializerPlugin;
}>({
  name: 'theming',

  addOptions() {
    return {
      theme: undefined as EditorThemeInput | undefined,
      serializerPlugin: {
        getNodeStyles(node, depth, context): React.CSSProperties {
          return getResolvedNodeStyles(
            node,
            depth,
            getMergedCssJsForContext(context),
          );
        },
        BaseTemplate({
          previewText,
          children,
          context,
          editor,
          previewMode = false,
        }) {
          // `editor` carries the context when a BaseTemplate written against
          // the editor-based API delegates here forwarding only that prop.
          const received = context ?? editor;
          if (!received) {
            throw new Error(
              "EmailTheming's BaseTemplate received neither `context` nor `editor`. Serializer plugins must forward the `context` prop (the `editor` prop was replaced by `context`).",
            );
          }
          const resolvedContext = toComposeContext(received);
          const { css: globalCss } =
            getEmailThemingFromContext(resolvedContext);
          const mergedStyles = getMergedCssJsForContext(resolvedContext);

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

                {!previewMode && <style>{DARK_MODE_CSS}</style>}
                {globalCss && <style>{globalCss}</style>}
              </Head>
              {previewText && previewText !== '' && (
                <Preview>{previewText}</Preview>
              )}

              <Body
                style={{
                  margin: 0,
                  padding: 0,
                  ...mergedStyles.body,
                }}
              >
                {children}
              </Body>
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
          let seededFromConfig = false;

          view.dom.setAttribute(scopeAttribute, scopeId);

          const sync = () => {
            if (!seededFromConfig) {
              seededFromConfig = true;
              const extensionTheme = findConfiguredTheme(
                editor.extensionManager.extensions,
              );

              if (isThemeConfig(extensionTheme)) {
                const { baseTheme, panels } =
                  resolveThemeConfig(extensionTheme);
                if (panels && !getGlobalContent('styles', editor)) {
                  editor.commands.setGlobalContent('styles', panels);
                }
                if (!getGlobalContent('theme', editor)) {
                  editor.commands.setGlobalContent('theme', baseTheme);
                }
              }
            }

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
