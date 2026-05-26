import { findChildren } from '@tiptap/core';
import type { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import * as ReactEmailComponents from 'react-email';
import { ensureLanguage, ensureTheme, getHighlighter, type Theme } from 'react-email';
import type { LanguageRegistration } from 'shiki/core';

// Bit flags from vscode-textmate's FontStyle enum.
const FONT_STYLE_ITALIC = 1;
const FONT_STYLE_BOLD = 2;
const FONT_STYLE_UNDERLINE = 4;

function buildStyle(token: {
  color?: string;
  bgColor?: string;
  fontStyle?: number;
}): string {
  const parts: string[] = [];
  if (token.color) parts.push(`color: ${token.color}`);
  if (token.bgColor) parts.push(`background-color: ${token.bgColor}`);
  const fs = token.fontStyle ?? 0;
  if ((fs & FONT_STYLE_ITALIC) !== 0) parts.push('font-style: italic');
  if ((fs & FONT_STYLE_BOLD) !== 0) parts.push('font-weight: bold');
  if ((fs & FONT_STYLE_UNDERLINE) !== 0) {
    parts.push('text-decoration: underline');
  }
  return parts.join('; ');
}

function getDecorations({
  doc,
  name,
  defaultLanguage,
  defaultTheme,
  languages,
}: {
  doc: ProsemirrorNode;
  name: string;
  defaultLanguage: string | null | undefined;
  defaultTheme: string | null | undefined;
  languages: Record<string, LanguageRegistration | LanguageRegistration[]>;
}) {
  const decorations: Decoration[] = [];
  const highlighter = getHighlighter();

  findChildren(doc, (node) => node.type.name === name).forEach((block) => {
    const startPos = block.pos + 1;
    const rawLanguage = block.node.attrs.language || defaultLanguage;
    const themeName = block.node.attrs.theme || defaultTheme;

    const langModule = rawLanguage ? languages[rawLanguage] : undefined;
    if (!langModule) return;

    // biome-ignore lint/performance/noDynamicNamespaceImportAccess: theme names are user-selected at runtime
    const themeCandidate = themeName
      ? (ReactEmailComponents as Record<string, unknown>)[themeName]
      : undefined;
    const theme =
      themeCandidate &&
      typeof themeCandidate === 'object' &&
      'shikiTheme' in themeCandidate
        ? (themeCandidate as Theme)
        : undefined;
    if (!theme) return;

    const langName = ensureLanguage(langModule);
    const resolvedThemeName = ensureTheme(theme.shikiTheme);

    let lines: ReturnType<typeof highlighter.codeToTokensBase>;
    try {
      lines = highlighter.codeToTokensBase(block.node.textContent, {
        lang: langName,
        theme: resolvedThemeName,
        includeExplanation: false,
      });
    } catch {
      return;
    }

    let cursor = startPos;
    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
      const lineTokens = lines[lineIdx];
      for (const token of lineTokens) {
        const from = cursor;
        const to = cursor + token.content.length;
        const style = buildStyle(token);
        if (style.length > 0) {
          decorations.push(Decoration.inline(from, to, { style }));
        }
        cursor = to;
      }
      if (lineIdx < lines.length - 1) cursor += 1;
    }
  });

  return DecorationSet.create(doc, decorations);
}

export function ShikiPlugin({
  name,
  defaultLanguage,
  defaultTheme,
  languages,
}: {
  name: string;
  defaultLanguage: string;
  defaultTheme: string;
  languages: Record<string, LanguageRegistration | LanguageRegistration[]>;
}) {
  if (!defaultLanguage) {
    throw Error('You must specify the defaultLanguage parameter');
  }

  const plugin: Plugin<DecorationSet> = new Plugin({
    key: new PluginKey('shiki'),

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          name,
          defaultLanguage,
          defaultTheme,
          languages,
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name;
        const newNodeName = newState.selection.$head.parent.type.name;

        const oldNodes = findChildren(
          oldState.doc,
          (node) => node.type.name === name,
        );
        const newNodes = findChildren(
          newState.doc,
          (node) => node.type.name === name,
        );

        if (
          transaction.docChanged &&
          ([oldNodeName, newNodeName].includes(name) ||
            newNodes.length !== oldNodes.length ||
            transaction.steps.some((step) => {
              const rangeStep = step as unknown as {
                from?: number;
                to?: number;
              };
              return (
                rangeStep.from !== undefined &&
                rangeStep.to !== undefined &&
                oldNodes.some((node) => {
                  return (
                    node.pos >= rangeStep.from! &&
                    node.pos + node.node.nodeSize <= rangeStep.to!
                  );
                })
              );
            }))
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage,
            defaultTheme,
            languages,
          });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },

    props: {
      decorations(state) {
        return plugin.getState(state);
      },
    },
  });

  return plugin;
}
