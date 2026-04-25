# Editor Dependency Graph

This document maps `@react-email/editor` as of Phase 2. The checked fixture is
`docs/dep-map.json`; regenerate it with `pnpm asym:dep-map` and verify it with
`pnpm asym:dep-map:check`.

## Scope

Phase 2 covers:

- `packages/editor/package.json`
- `packages/editor/src/**`
- `packages/editor/tsdown.config.ts`
- `packages/editor/vitest.config.ts`
- workspace package manifests
- docs, examples, apps, tests, and scripts that reference the editor

Phase 2 does not rename editor APIs or move source files.

## Dependency Counts

Current deterministic counts from `docs/dep-map.json`:

| Area | Count |
|---|---:|
| Package manifests scanned | 26 |
| Editor source import edges | 913 |
| Editor CSS `@import` edges | 6 |
| Editor test/snapshot entries | 59 |
| Repo references to editor terms/APIs | 139 |
| Unknown classifications | 0 |

## Classification Policy

| Classification | Meaning |
|---|---|
| `keep` | Dependency remains directly useful for the PDF builder foundation. |
| `wrap` | Dependency is retained behind an adapter or compatibility boundary for now. |
| `fork` | Current editor code or concept will become PDF-first in later package-boundary work. |
| `replace-later` | Email-specific app, docs, example, or workflow retained until a later phase owns replacement. |
| `remove-later` | Upstream-only surface that may be deleted after a later phase approves removal. |
| `unknown` | The script cannot classify it; must be documented and followed up before isolation. |

## Package Dependencies

`packages/editor/package.json` dependencies classify as follows:

| Classification | Packages |
|---|---|
| `keep` | `react`, `react-dom`, all `@tiptap/*` dependencies, `@floating-ui/react-dom`, `@radix-ui/react-popover`, `@radix-ui/react-slot`, `hast-util-from-html`, `prismjs`, `postcss`, `postcss-import`, `@testing-library/react`, `@vitejs/plugin-react`, `@vitest/browser-playwright`, `playwright`, `tsconfig`, `tsdown`, `tsx`, `typescript`, `vitest-browser-react`, `@types/node`, `@types/prismjs` |
| `wrap` | `react-email` |
| `fork` | none as external dependencies; the editor source itself is classified `fork` |
| `replace-later` | none as direct editor dependencies |
| `remove-later` | none in Phase 2 |
| `unknown` | none |

`react-email` is wrapped because `DefaultBaseTemplate` imports `Body`, `Head`,
`Html`, and `Preview` from `react-email`, and the serializer currently produces
React Email output. Phase 3 owns package boundaries; Phase 6 owns the future
PDF serializer.

## Source Import Graph

The editor graph is centered on these public source roots:

| Area | Path | Current role | Classification |
|---|---|---|---|
| Root export | `packages/editor/src/index.ts` | Re-exports `EmailEditor` and its props/ref types | fork |
| Editor shell | `packages/editor/src/email-editor` | React component around TipTap `EditorProvider`, `StarterKit`, theming, image upload, bubble menu, slash command, and `composeReactEmail` methods | fork |
| Core | `packages/editor/src/core` | Event bus, paste/drop handlers, document-empty helper, serializer types | fork |
| Serializer | `packages/editor/src/core/serializer` | `composeReactEmail`, `EmailNode`, `EmailMark`, serializer plugin, default base template | fork/wrap |
| Extensions | `packages/editor/src/extensions` | TipTap nodes/marks for email-aware content and `StarterKit` | fork |
| Plugins | `packages/editor/src/plugins` | `EmailTheming` and image upload extension | fork |
| UI | `packages/editor/src/ui` | Bubble menu, inspector, slash command, icons, focus scope, theme CSS | fork |
| Utils | `packages/editor/src/utils` | Attribute helpers, default styles, paste sanitizer, Prism helpers, text alignment | keep/fork |

External package imports are mostly React, TipTap, ProseMirror, Radix/Floating
UI, Prism, and `hast-util-from-html`. Local imports remain internal editor
edges that Phase 3 must preserve while creating package boundaries.

## Serializer Edges

Key serializer paths:

- `packages/editor/src/core/serializer/compose-react-email.tsx`
  - walks TipTap JSON
  - maps extension names to `EmailNode` and `EmailMark`
  - calls `renderToReactEmail`
  - applies `EmailTheming` styles
  - wraps output with `DefaultBaseTemplate` or a serializer plugin
  - returns `{ html, text }`
- `packages/editor/src/core/serializer/default-base-template.tsx`
  - imports `Body`, `Head`, `Html`, and `Preview` from `react-email`
  - is the clearest current wrap point for the React Email runtime
- `packages/editor/src/core/serializer/email-node.ts`
  - extends TipTap `Node` with `renderToReactEmail`
- `packages/editor/src/core/serializer/email-mark.ts`
  - extends TipTap `Mark` with `renderToReactEmail`
- `packages/editor/src/core/serializer/serializer-plugin.ts`
  - defines `SerializerPluginStorage`, including optional `BaseTemplate` and
    `getNodeStyles`

The future PDF serializer should not mutate these files in Phase 2. It should
use this graph to decide where `DocumentNode`, `DocumentMark`, and
`composePdfDocumentHtml` can be introduced later.

## CSS And Theme Edges

CSS/theme exports are public package surfaces:

- `@react-email/editor/styles/bubble-menu.css`
- `@react-email/editor/styles/link-bubble-menu.css`
- `@react-email/editor/styles/button-bubble-menu.css`
- `@react-email/editor/styles/image-bubble-menu.css`
- `@react-email/editor/styles/slash-command.css`
- `@react-email/editor/styles/inspector.css`
- `@react-email/editor/themes/default.css`

Source CSS imports:

| File | Import |
|---|---|
| `packages/editor/src/ui/button-bubble-menu/button-bubble-menu.css` | `../bubble-menu/bubble-menu.css` |
| `packages/editor/src/ui/image-bubble-menu/image-bubble-menu.css` | `../bubble-menu/bubble-menu.css` |
| `packages/editor/src/ui/link-bubble-menu/link-bubble-menu.css` | `../bubble-menu/bubble-menu.css` |
| `packages/editor/src/ui/themes/default.css` | `../bubble-menu/bubble-menu.css` |
| `packages/editor/src/ui/themes/default.css` | `../slash-command/slash-command.css` |
| `packages/editor/src/ui/themes/default.css` | `../inspector/inspector.css` |

`EmailEditor` also imports `../ui/themes/default.css` as a side effect. Later
PDF package work must keep CSS side effects explicit because `packages/editor`
declares `"sideEffects": ["**/*.css"]`.

Phase 2 added the three compatibility wrapper CSS files for declared package
exports that previously pointed to missing build artifacts. The wrappers import
the existing bubble menu CSS and preserve the declared public subpaths without
changing JavaScript behavior.

## Browser, Server, Shared, And Test Concerns

| Concern | Current paths | Notes |
|---|---|---|
| Browser/editor | `packages/editor/src/email-editor`, `packages/editor/src/ui`, `packages/editor/src/plugins/image` | Uses React, DOM, TipTap React, file upload, menus, inspector, CSS. Keep browser-only code out of future server renderer packages. |
| Shared editor model | `packages/editor/src/core`, `packages/editor/src/extensions`, `packages/editor/src/utils` | Mostly schema, serializer contracts, and deterministic helpers. Later split shared model from browser shell where useful. |
| Wrapped email runtime | `packages/editor/src/core/serializer/default-base-template.tsx`, extension `renderToReactEmail` functions | React Email components/rendering are retained until PDF serializer exists. |
| Test-only | `*.spec.ts`, `*.spec.tsx`, `*.browser.spec.tsx`, `__snapshots__`, `__tests__` | Unit tests use happy-dom; browser tests use Playwright and stub `@react-email/render`. |
| Server-only future | none in editor package today | DocRaptor and storage secrets must not enter this package in later phases. |

## Docs, Examples, And App References

`docs/dep-map.json` records 139 references to editor package names and email
terms. The main reference sets are:

- `apps/docs/editor/**`: public editor docs and API references.
- `packages/editor/src/**`: implementation and tests.
- `docs/**`: fork governance and phase docs.
- `packages/react-email/CHANGELOG.md`: upstream history.
- `scripts/asym-baseline-smoke.ts`: baseline package-name check.

These references are not renamed in Phase 2. They are the migration inventory
for later docs, package, and compatibility phases.

## Candidate Package Boundaries

Phase 3 should use this boundary map:

| Future package | Inputs from current graph | Dependency direction |
|---|---|---|
| `@asym/pdf-template-schema` | none from editor runtime yet; future schema should be independent | no React, no browser, no DocRaptor secrets |
| `@asym/pdf-editor` | editor shell, extensions, plugins, UI, CSS/theme exports | may depend on schema and renderer contracts; browser-only |
| `@asym/pdf-renderer` | serializer patterns from `composeReactEmail`, `EmailNode`, `EmailMark`, theme style resolution | may depend on schema; no React UI; no tenant app imports |
| `@asym/docraptor-client` | no current editor source; future server package | server-only, no browser import path |
| `@asym/pdf-studio-adapter` | no current editor source; future integration package | depends outward on package APIs, not on core app internals |

## Phase 2 Findings

- No unknown direct editor dependencies remain after classification.
- The largest current risk is not package dependency count; it is email naming
  and `renderToReactEmail` assumptions across serializer, docs, extensions,
  theming, and tests.
- The current editor package has public CSS/theme subpaths that future packages
  must preserve or replace with explicit compatibility paths.
- `react-email` and `@react-email/render` should be wrapped until PDF package
  boundaries and serializer contracts exist. Removing them in Phase 2 would
  break hidden behavior.
