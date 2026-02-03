'use client';

import type { Editor } from '@tiptap/core';
import * as React from 'react';
import type { ContextValue } from '@/types/editor/styles';
import {
  GLOBAL_CONTENT_NODE_TYPE,
  type GlobalContentData,
} from '../../extensions/global-content';
import {
  injectGlobalPlainCss,
  injectThemeCss,
  mergeCssJs,
  transformToCssJs,
} from './css-transforms';
import { EDITOR_THEMES, RESET_THEMES } from './themes';

const StyleContext = React.createContext<ContextValue>({} as ContextValue);

interface StyleContextProps {
  children: React.ReactNode;
}

export const StyleProvider: React.FC<Readonly<StyleContextProps>> = ({
  children,
}) => {
  const [theme, setTheme] = React.useState<ContextValue['theme']>('basic');
  const [styles, setStyles] = React.useState(EDITOR_THEMES[theme]);
  const [css, setCss] = React.useState('');

  // Inject theme styles on the preview when page load
  React.useEffect(() => {
    const parseStyles = transformToCssJs(styles);
    const fullCss = mergeCssJs(RESET_THEMES[theme], parseStyles);
    injectThemeCss(fullCss);
  }, []);

  const stylesWithToCss = React.useMemo(() => {
    return Object.assign(styles, {
      toCss: () => {
        const parseStyles = transformToCssJs(styles);
        const fullCss = mergeCssJs(RESET_THEMES[theme], parseStyles);
        return fullCss;
      },
    });
  }, [styles, theme]);

  const contextValue: ContextValue = React.useMemo(
    () => ({
      theme,
      styles: stylesWithToCss,
      css,
      subscribe: async (editor, propagateChanges) => {
        const editorData = await Promise.race([
          getGlobalContentFromEditor(editor),
          new Promise<null>((resolve) => setTimeout(resolve, 3_000)), // avoid getting stuck on a async function
        ]);

        if (!editorData) {
          // Propagates the default values when no data is present in the editor
          propagateChanges?.({
            theme,
            styles: stylesWithToCss,
            css,
          });
          return;
        }

        const nextTheme = editorData.theme ?? theme;

        // Apply theme first so subsequent style computations use the correct theme
        if (editorData.theme !== undefined) {
          setTheme(editorData.theme);
        }

        // Inject and set styles using the effective theme
        if (editorData.styles !== undefined) {
          const parsedStyles = transformToCssJs(editorData.styles);
          const fullCss = mergeCssJs(RESET_THEMES[nextTheme], parsedStyles);
          injectThemeCss(fullCss);
          setStyles(editorData.styles);
        }

        // Inject and set plain CSS
        if (editorData.css !== undefined) {
          injectGlobalPlainCss(editorData.css);
          setCss(editorData.css);
        }

        propagateChanges?.({
          theme: nextTheme,
          css: editorData.css ?? '',
          styles: Object.assign(editorData.styles ?? EDITOR_THEMES.basic, {
            toCss: () => {
              const effectiveStyles = editorData.styles ?? EDITOR_THEMES.basic;

              const parseStyles = transformToCssJs(effectiveStyles);
              const fullCss = mergeCssJs(RESET_THEMES[nextTheme], parseStyles);
              return fullCss;
            },
          }),
        });
      },
    }),
    [stylesWithToCss, theme, css],
  );

  return (
    <StyleContext.Provider value={contextValue}>
      {children}
    </StyleContext.Provider>
  );
};

function getGlobalContentFromEditor(
  editor: Editor,
): Promise<GlobalContentData | null> {
  let result: GlobalContentData | null = null;

  editor.state.doc.descendants((node) => {
    if (node.type.name === GLOBAL_CONTENT_NODE_TYPE) {
      result = node.attrs.data as GlobalContentData;
      return false; // Stop traversing once we find the first global content node
    }
  });

  return Promise.resolve(result);
}

export const useEditorStyles = (): ContextValue => {
  const styleContext = React.useContext(StyleContext);

  if (!styleContext) {
    throw new TypeError(
      '`useEditorStyles` must be called from within an `StyleContext`',
    );
  }

  return styleContext;
};
