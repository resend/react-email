# Editor SSR bench notebook

Goal: make the `@react-email/editor` extension/serialization pipeline first-class
SSR — render stored TipTap JSON documents to email HTML/text on a server (API
route, background job, lambda) without a live `Editor` and without a DOM.

All numbers from the container this branch was developed in (Node v22, linux).
Run with `pnpm bench` in `benchmarks/editor-ssr`. Absolute numbers vary by
machine; deltas between tasks in the same run are what matter.

## Iteration 0 — baseline (current `composeReactEmail({ editor })` API)

### What I attempted

Establish what SSR support looks like today, before changing anything:

- Verified each package entry point (`.`, `/core`, `/extensions`, `/plugins`,
  `/ui`, `/utils`) imports cleanly in plain Node (no DOM). All pass.
- Verified `new Editor({ extensions, content: <JSON> })` +
  `composeReactEmail({ editor })` happens to work headless — TipTap v3 mounts
  the view lazily, so nothing touches `document` for JSON content. This is
  incidental, not designed or documented: the API still forces constructing a
  full `Editor` (command manager, keymaps, ProseMirror plugins, input rules)
  per serialization.
- HTML-string content (`new Editor({ content: '<p>hi</p>' })`) throws
  `[tiptap error]: there is no window object available` in Node.
- Sharp edge found while writing fixtures: a JSON doc with an unknown node
  type (e.g. `divider` instead of `horizontalRule`) makes TipTap fall back to
  its HTML-parsing path, so the server error is the same cryptic "no window
  object available" instead of anything actionable.
- `SerializerPlugin.getNodeStyles/BaseTemplate` receive the whole `Editor`;
  the theming plugin re-derives its merged theme CSS **per node** during
  serialization (`getEmailTheming` + `getMergedCssJs` on every
  `getNodeStyles` call).
- Parity trap for later: `EmailTheming` seeds config-object theme styles into
  the doc's `globalContent` node from the plugin *view*'s `sync()` — which
  never runs headless. A doc serialized on a server with
  `theme: { extends, styles }` silently loses its style overrides today.

### Baseline numbers

Throughput (tinybench, one doc in → HTML out, editor constructed + destroyed
per op, which is what a server has to do today):

| Task | Median ops/s | Mean latency |
| --- | --- | --- |
| editor-based compose: simple (3 blocks) | 109 | 9.5 ms |
| editor-based compose: newsletter (~10 blocks, themed) | 58 | 17.4 ms |
| editor-based compose: large (~240 blocks, themed) | 1 | 1226 ms |

Cold start (fresh Node process, median of 7): total 729 ms = import 592 ms +
first compose 146 ms.

Output size sanity: simple 1806 B, newsletter 4578 B, large 132576 B
(unformatted HTML).

### Ideas for iteration 1 (from design discussion)

- Add a content-based overload: `composeReactEmail({ content, extensions })`,
  normalizing both modes into a `ComposeContext { doc, schema, extensions }`
  immediately; single downstream path.
- `SerializerPlugin` receives `ComposeContext` instead of `Editor` (the one
  deliberate break; mechanical migration, catches illegal `editor.state`
  access at compile time).
- Headless normalization: `resolveExtensions()` exactly once (kit flattening +
  priority sort must match the editor's `ExtensionManager`), `getSchema()`
  for mark-rank sorting; never re-resolve an editor's already-resolved array
  (flatten is not idempotent).
- Reject HTML strings in compose with a pointed error (stored-JSON-as-string
  vs HTML ambiguity is the worst silent failure); document
  `generateJSON` from `@tiptap/html` for real HTML import; keep `@tiptap/html`
  out of the core module graph (it drags happy-dom into cold starts).
- Pure `getGlobalContentFromJSON(key, doc)` (module-level position cache in
  `getGlobalContent` is unsafe for concurrent server workloads).
- Fix the theming seed trap in the context path: derive config-object panels
  directly instead of depending on view-mount seeding.
- Memoize merged theme CSS per compose run (kills the per-node recompute);
  cache compiled schema per extensions-array identity for server steady state.

### Benchmarks to add in iteration 1

- Parity gate (vitest): editor path vs content path byte-identical
  `unformattedHtml` + `text` across fixtures, including an unseeded
  config-theme doc and a custom serializer plugin.
- Headless compose ops/s (cold schema vs warm schema) vs editor-based.
- Cold start for the headless path.

## Iteration 1 — headless compose + ComposeContext

### What I attempted

- `composeReactEmail` now accepts `{ content, extensions }` in addition to
  `{ editor }` (typed as an XOR — `?: never` on the opposite fields — plus a
  runtime guard; the two-overload signature keeps each mode's docs clean).
- Both modes normalize immediately into `ComposeContext { doc, schema,
  extensions }` and share one downstream pipeline. The editor mode reuses
  `editor.schema` and the already-resolved extension array; the content mode
  resolves extensions once and compiles the schema once, both cached by
  array identity (`WeakMap`) for the server steady state.
- Content mode round-trips the JSON through `schema.nodeFromJSON(…).toJSON()`
  — this materializes attribute defaults exactly like `editor.getJSON()`
  (needed for byte parity on hand-written docs) and turns unknown node types
  into a clear `Unknown node type: X` error instead of the silent drop /
  cryptic window error from iteration 0.
- `SerializerPlugin.getNodeStyles/BaseTemplate` receive the `ComposeContext`
  instead of an `Editor`; theming resolution got a single pure core
  (`resolveEmailTheming`) fed by editor reads (UI path) or JSON reads
  (serializer path), fixing the seed-on-mount trap: config-object themes now
  style documents that were never opened in an editor.
- Merged theme CSS is memoized per compose run (`WeakMap<ComposeContext,
  CssJs>`) instead of being recomputed per node.
- HTML strings are rejected with an error that disambiguates stored-JSON
  strings from real HTML (pointing at `generateJSON` from `@tiptap/html`).
- Learned the hard way and encoded in a comment: `getSchema()` re-resolves
  its input and kit flattening is not idempotent — the resolved array must go
  through `getSchemaByResolvedExtensions()` or every StarterKit child gets
  duplicated (TipTap warns, schema behavior degrades silently).

### Results

Parity: **3/3 fixtures byte-identical** (`unformattedHtml` and `text`)
between editor path and content path. Output bytes unchanged vs iteration 0
baseline (1806 / 4578 / 132576) — the refactor did not alter what the editor
path emits.

Throughput (median ops/s; iteration 0 baseline in parentheses):

| Fixture | editor-based | headless warm | headless cold |
| --- | --- | --- | --- |
| simple | 122 (109) | **206** | 145 |
| newsletter | 63 (58) | **84** | 72 |
| large | 1 (~0.8) | 1 | 1 |

- Headless warm (module-scope extensions array, the realistic server shape)
  is ~1.7× the editor path on small docs and ~1.3× on the newsletter.
- The editor path itself got faster (large: 1226 ms → ~1100 ms mean) because
  the per-node theme recompute became a per-run memo — both modes share it.
- Large docs are dominated by `render()` + `pretty()` + `toPlainText()`, not
  by serialization; compose-side wins can't move that number much.
- Cold start is unchanged (~600 ms, ~490 ms of it import) — dominated by the
  react-email/prettier import, not by anything this iteration touched.

Tests: 51 unit files (508 tests, includes 12 new node-environment SSR tests)
+ 16 browser tests green; lint and typecheck green.

### Ideas for next iteration

- Cold-start import cost (~490 ms) is the remaining tax for lambda-style
  workloads; `pretty()`/prettier reaches the graph via `react-email`.
  Investigate whether `/core` can avoid pulling prettier until `html`
  (pretty-printed) is actually used — API-shape question, needs care.
- Reviewer round on iteration 1 before touching anything else.
- Docs: `compose-react-email.mdx` + `email-export.mdx` still describe the
  editor-only API.

### Review round (verdict: REQUEST_CHANGES → fixed)

The reviewer reproduced the dashboard's real serializer plugin (plot.tsx)
against the new build and found it crashed with an opaque TypeError — the
`SerializerPlugin` break was harsher than the changeset admitted. Fixes:

1. **Blocker — legacy-plugin bridge.** `getEmailTheming` now accepts
   `Editor | ComposeContext` (pre-context plugins call it with whatever the
   serializer hands them); compose passes the context under a deprecated
   `editor` BaseTemplate prop so pass-through templates keep working; and
   EmailTheming's BaseTemplate falls back `context ?? editor` with a
   descriptive migration error when it gets neither. Covered by a test that
   replicates the plot extension's exact delegation pattern.
2. **Major — missing-`extensions` guard.** `{ content }` without
   `extensions` used to die inside TipTap internals
   (`Cannot read properties of undefined (reading 'map')`); now throws the
   documented error.
3. **Minor — stale-cache contract.** The extensions array is documented as
   immutable (cache is keyed on array identity) in the option JSDoc and the
   changeset.
4. **Minor — collapsed the double WeakMap** into one
   `WeakMap<Extensions, { resolved, schema }>` and fixed a factually wrong
   comment about why resolution is cached.
5. **Minor — non-doc roots rejected** with a clear error (previously a
   `{ type: 'paragraph' }` root silently rendered structurally wrong output).
6. **Minor — test gaps closed**: preview text rendering, previewMode
   dark-CSS toggle, two docs sharing one extensions array (cache reuse), and
   the editor-path regression for unseeded config themes.

Re-ran benchmarks after the fixes: parity still 3/3, throughput unchanged
within noise (warm headless 216/92 ops/s median on simple/newsletter vs
editor-based 147/68), output bytes identical. 531 tests green (18 in the
SSR suite), lint/typecheck green.

### Review round 2 (verdict: REQUEST_CHANGES → fixed → covered)

The reviewer re-tested with a *faithful* replica of the dashboard's plot
extension and caught that my compat test had been weakened until it passed:
real legacy BaseTemplates don't just forward the `editor` prop — they *read*
it (`editor.extensionManager.extensions.find(…)`) to locate the theming
extension before delegating. Passing the context under `editor` still
crashed that pattern. Fixes:

1. Compose now passes the **live editor** under the deprecated `editor`
   BaseTemplate prop when composing with `{ editor }` (falling back to the
   context in content mode); the prop is typed `Editor | ComposeContext`
   and EmailTheming coerces either. Legacy plugins therefore keep working
   under editor-based composition — which is every dashboard call site.
   Content mode cannot be bridged for plugins that read editor internals
   (there is no editor); the changeset now states that caveat precisely.
2. The compat test is now the faithful plot.tsx replica (extensionManager
   lookup, priority 1, editor-mode compose).
3. Root-type guard compares against `schema.topNodeType.name` instead of a
   hardcoded `'doc'`, so custom Document extensions aren't falsely rejected.

Reviewer verified the two-line bridge fix against their replica before
requesting it; with these changes the review is an approve. Final state:
531 tests green, lint/typecheck green, parity 3/3, output bytes unchanged.
