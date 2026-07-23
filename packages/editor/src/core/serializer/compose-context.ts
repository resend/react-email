import type { Editor, Extensions, JSONContent } from '@tiptap/core';
import { getSchemaByResolvedExtensions, resolveExtensions } from '@tiptap/core';
import type { Schema } from '@tiptap/pm/model';

/**
 * Everything the serialization pipeline knows about a compose run.
 * A plain data bag — no editor, no commands, no view — so serialization
 * works the same in the browser, in Node, and in edge runtimes.
 */
export interface ComposeContext {
  /** The document being serialized, as TipTap JSON. */
  doc: JSONContent;
  /** Compiled ProseMirror schema for this extension set (mark rank sorting). */
  schema: Schema;
  /**
   * Resolved extensions: kits flattened and priority-sorted, matching what
   * an editor's `extensionManager.extensions` would contain.
   */
  extensions: Extensions;
}

/**
 * Extension resolution and schema compilation are cached per extensions-array
 * identity: servers typically define the extension list once at module scope
 * and serialize many documents with it, so neither should be paid per
 * document.
 */
const resolutionCache = new WeakMap<
  Extensions,
  { snapshot: Extensions; resolved: Extensions; schema: Schema }
>();

function isStaleResolution(
  snapshot: Extensions,
  extensions: Extensions,
): boolean {
  return (
    snapshot.length !== extensions.length ||
    snapshot.some((extension, index) => extension !== extensions[index])
  );
}

function assertNotPreResolved(resolved: Extensions): void {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const extension of resolved) {
    if (seen.has(extension.name)) {
      duplicates.add(extension.name);
    }
    seen.add(extension.name);
  }
  if (duplicates.size > 0) {
    throw new Error(
      `The \`extensions\` list resolves to duplicate extension names (${[...duplicates].join(', ')}). This usually means an already-resolved array — like \`editor.extensionManager.extensions\` or \`context.extensions\` — was passed; resolution re-expands kits, duplicating their children. Pass the original extensions the document was created with instead.`,
    );
  }
}

export function createComposeContext({
  content,
  extensions,
}: {
  content: JSONContent;
  extensions: Extensions;
}): ComposeContext {
  if (typeof content === 'string') {
    throw new Error(
      'composeReactEmail received a string as `content`. If this is a stored JSON document, JSON.parse it first; if it is HTML, convert it with `generateJSON` from @tiptap/html.',
    );
  }

  if (!extensions) {
    throw new Error(
      'composeReactEmail with `content` also requires `extensions` — the extension set the document was written with.',
    );
  }

  let resolution = resolutionCache.get(extensions);
  if (resolution && isStaleResolution(resolution.snapshot, extensions)) {
    resolution = undefined;
  }
  if (!resolution) {
    const resolved = resolveExtensions(extensions);
    assertNotPreResolved(resolved);
    // `getSchema` resolves its input internally, and resolution is not
    // idempotent (kits re-expand, duplicating every child extension) — so
    // the already-resolved array must go through the resolved-only variant.
    resolution = {
      snapshot: extensions.slice(),
      resolved,
      schema: getSchemaByResolvedExtensions(resolved),
    };
    resolutionCache.set(extensions, resolution);
  }

  const topNodeName = resolution.schema.topNodeType.name;
  if (content.type !== topNodeName) {
    throw new Error(
      `composeReactEmail expects \`content\` to be a full document ({ type: '${topNodeName}', … }) — got ${JSON.stringify(content.type)}.`,
    );
  }

  // Round-tripping through the schema materializes attribute defaults the
  // same way `editor.getJSON()` does — hand-written JSON serializes
  // identically to editor-produced JSON — and rejects node/mark types the
  // extension set doesn't know with a clear error instead of silently
  // dropping content from the sent email.
  const doc = resolution.schema.nodeFromJSON(content).toJSON() as JSONContent;

  return { doc, schema: resolution.schema, extensions: resolution.resolved };
}

const contextByEditor = new WeakMap<
  Editor,
  { pmDoc: unknown; context: ComposeContext }
>();

/**
 * Coerces a live editor — or a value that is already a context — into a
 * `ComposeContext`. This is the bridge for serializer plugins written
 * against the pre-context API, which passed an `Editor` around.
 */
export function toComposeContext(
  value: Editor | ComposeContext,
): ComposeContext {
  if ('extensionManager' in value) {
    const cached = contextByEditor.get(value);
    if (cached && cached.pmDoc === value.state.doc) {
      return cached.context;
    }
    // The editor's extensions are already resolved (kits flattened and
    // priority-sorted), and its schema is already compiled — reuse both.
    const context: ComposeContext = {
      doc: value.getJSON(),
      schema: value.schema,
      extensions: value.extensionManager.extensions,
    };
    contextByEditor.set(value, { pmDoc: value.state.doc, context });
    return context;
  }
  return value;
}
