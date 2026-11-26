import { findChildren } from '@tiptap/core';
import type { Node as ProsemirrorNode } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import Prism, { type TokenStream } from 'prismjs';
import {
  hasPrismThemeLoaded,
  loadPrismTheme,
  removePrismTheme,
} from '../utils/prism-utils';

const PRISM_LANGUAGE_LOADED_META = 'prismLanguageLoaded';

function flattenTokens(
  tokens: TokenStream,
  classes: string[] = [],
): { text: string; classes: string[] }[] {
  if (typeof tokens === 'string') {
    return [{ text: tokens, classes }];
  }

  if (Array.isArray(tokens)) {
    return tokens.flatMap((token) => flattenTokens(token, classes));
  }

  return flattenTokens(tokens.content, [
    ...classes,
    'token',
    tokens.type,
    ...[tokens.alias ?? []].flat(),
  ]);
}

// Returns undefined, leaving the code unhighlighted, until the language's
// grammar has loaded. `Prism.tokenize` alone skips the hooks `Prism.highlight`
// runs, which templating grammars (php, handlebars, ...) rely on to tokenize
// the surrounding markup separately from the embedded template code.
function tokenize(code: string, language: string) {
  if (!isLanguageLoaded(language)) {
    return undefined;
  }

  const env: Prism.hooks.TokenizeEnvironment & { tokens?: TokenStream } = {
    code,
    grammar: Prism.languages[language],
    language,
  };

  try {
    Prism.hooks.run('before-tokenize', env);
    env.tokens = Prism.tokenize(env.code, env.grammar);
    Prism.hooks.run('after-tokenize', env);
  } catch {
    // A throwing grammar or hook shouldn't break the editor transaction.
    return undefined;
  }

  return env.tokens;
}

// `Prism.languages` also holds helper functions like `extend`.
function isLanguageLoaded(language: string) {
  return typeof Prism.languages[language] === 'object';
}

// Prism's own metadata resolves aliases (`shell` is defined by `bash`) and
// requirements (`php` needs `markup-templating` first). It is loaded on demand,
// the first time a code block uses a grammar that isn't registered yet.
export async function loadPrismLanguage(language: string) {
  const [{ default: components }, { default: getLoader }] = await Promise.all([
    import('prismjs/components.js'),
    import('prismjs/dependencies.js'),
  ]);
  const ids = getLoader(components, [language])
    .getIds()
    .filter((id) => id in components.languages && !isLanguageLoaded(id));

  for (const id of ids) {
    await import(/* @vite-ignore */ `prismjs/components/prism-${id}`);
  }

  if (!isLanguageLoaded(language)) {
    throw new Error(`Prism has no grammar for "${language}"`);
  }
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
    const language = block.node.attrs.language || defaultLanguage;
    const theme = block.node.attrs.theme || defaultTheme;

    if (!isLanguageLoaded(language) && !loadingLanguages.has(language)) {
      loadingLanguages.add(language);
      loadPrismLanguage(language)
        .then(() => onLanguageLoaded(language))
        .catch(() => {})
        .finally(() => loadingLanguages.delete(language));
    }

    try {
      if (!hasPrismThemeLoaded(theme)) {
        loadPrismTheme(theme);
      }
    } catch {
      // Without a DOM there is no theme stylesheet to load; tokens still apply.
    }

    const tokens = tokenize(block.node.textContent, language);

    if (!tokens) {
      return;
    }

    let from = block.pos + 1;

    for (const { text, classes } of flattenTokens(tokens)) {
      const to = from + text.length;

      if (classes.length) {
        decorations.push(
          Decoration.inline(from, to, { class: classes.join(' ') }),
        );
      }

      from = to;
    }
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

  const decorate = (doc: ProsemirrorNode) =>
    getDecorations({
      doc,
      name,
      defaultLanguage,
      defaultTheme,
      loadingLanguages,
      onLanguageLoaded,
    });

  const prismjsPlugin: Plugin<DecorationSet> = new Plugin({
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
      init: (_, { doc }) => decorate(doc),
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
              })))
        ) {
          return decorate(transaction.doc);
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
