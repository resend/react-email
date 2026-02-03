import { findChildren } from '@tiptap/core';
import type { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { fromHtml } from 'hast-util-from-html';
import Prism from 'prismjs';
import {
  hasPrismThemeLoaded,
  loadPrismTheme,
  removePrismTheme,
} from './prism-utils.js';

const PRISM_LANGUAGE_LOADED_META = 'prismLanguageLoaded';

function parseNodes(
  nodes: any[],
  className: string[] = [],
): { text: string; classes: string[] }[] {
  return nodes.flatMap((node) => {
    const classes = [
      ...className,
      ...(node.properties ? node.properties.className : []),
    ];

    if (node.children) {
      return parseNodes(node.children, classes);
    }

    return {
      text: node.value,
      classes,
    };
  });
}

function getHighlightNodes(html: string) {
  return fromHtml(html, { fragment: true }).children;
}

function registeredLang(aliasOrLanguage: string) {
  const allSupportLang = Object.keys(Prism.languages).filter(
    (id) => typeof Prism.languages[id] === 'object',
  );
  return Boolean(allSupportLang.find((x) => x === aliasOrLanguage));
}

function getDecorations({
  doc,
  name,
  defaultLanguage,
  defaultTheme,
  loadingLanguages,
  onLanguageLoaded,
}: {
  doc: ProsemirrorNode;
  name: string;
  defaultLanguage: string | null | undefined;
  defaultTheme: string | null | undefined;
  loadingLanguages: Set<string>;
  onLanguageLoaded: (language: string) => void;
}) {
  const decorations: Decoration[] = [];

  findChildren(doc, (node) => node.type.name === name).forEach((block) => {
    let from = block.pos + 1;
    const language = block.node.attrs.language || defaultLanguage;
    const theme = block.node.attrs.theme || defaultTheme;
    let html = '';

    try {
      if (!registeredLang(language) && !loadingLanguages.has(language)) {
        loadingLanguages.add(language);
        import(`prismjs/components/prism-${language}`)
          .then(() => {
            loadingLanguages.delete(language);
            onLanguageLoaded(language);
          })
          .catch(() => {
            loadingLanguages.delete(language);
          });
      }

      if (!hasPrismThemeLoaded(theme)) {
        loadPrismTheme(theme);
      }

      html = Prism.highlight(
        block.node.textContent,
        Prism.languages[language],
        language,
      );
    } catch {
      html = Prism.highlight(
        block.node.textContent,
        Prism.languages.javascript,
        'js',
      );
    }

    const nodes = getHighlightNodes(html);

    parseNodes(nodes).forEach((node) => {
      const to = from + node.text.length;

      if (node.classes.length) {
        const decoration = Decoration.inline(from, to, {
          class: node.classes.join(' '),
        });

        decorations.push(decoration);
      }

      from = to;
    });
  });

  return DecorationSet.create(doc, decorations);
}

export function PrismPlugin({
  name,
  defaultLanguage,
  defaultTheme,
}: {
  name: string;
  defaultLanguage: string;
  defaultTheme: string;
}) {
  if (!defaultLanguage) {
    throw Error('You must specify the defaultLanguage parameter');
  }

  const loadingLanguages = new Set<string>();
  let pluginView: EditorView | null = null;

  const onLanguageLoaded = (language: string) => {
    if (pluginView) {
      pluginView.dispatch(
        pluginView.state.tr.setMeta(PRISM_LANGUAGE_LOADED_META, language),
      );
    }
  };

  const prismjsPlugin: Plugin<any> = new Plugin({
    key: new PluginKey('prism'),

    view(view) {
      pluginView = view;
      return {
        destroy() {
          pluginView = null;
        },
      };
    },

    state: {
      init: (_, { doc }) => {
        return getDecorations({
          doc,
          name,
          defaultLanguage,
          defaultTheme,
          loadingLanguages,
          onLanguageLoaded,
        });
      },
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
          transaction.getMeta(PRISM_LANGUAGE_LOADED_META) ||
          (transaction.docChanged &&
            // Apply decorations if:
            // selection includes named node,
            ([oldNodeName, newNodeName].includes(name) ||
              // OR transaction adds/removes named node,
              newNodes.length !== oldNodes.length ||
              // OR transaction has changes that completely encapsulate a node
              // (for example, a transaction that affects the entire document).
              // Such transactions can happen during collab syncing via y-prosemirror, for example.
              transaction.steps.some((step) => {
                return (
                  // @ts-expect-error
                  step.from !== undefined &&
                  // @ts-expect-error
                  step.to !== undefined &&
                  oldNodes.some((node) => {
                    return (
                      // @ts-expect-error
                      node.pos >= step.from &&
                      // @ts-expect-error
                      node.pos + node.node.nodeSize <= step.to
                    );
                  })
                );
              })))
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage,
            defaultTheme,
            loadingLanguages,
            onLanguageLoaded,
          });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },

    props: {
      decorations(state) {
        return prismjsPlugin.getState(state);
      },
    },

    destroy() {
      pluginView = null;
      removePrismTheme();
    },
  });

  return prismjsPlugin;
}
