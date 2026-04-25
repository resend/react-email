# Editor Package Isolation

Phase 4 isolates the current `@react-email/editor` package as the legacy
working editor baseline. This is an internal boundary and regression-harness
step. It does not rename packages, remove React Email behavior, replace the
serializer, or introduce PDF rendering behavior.

## Current Package Exports

`packages/editor/package.json` exposes these public subpaths:

| Subpath | Current role |
|---|---|
| `@react-email/editor` | Root React editor component and props/ref types. |
| `@react-email/editor/core` | Event bus, serializer, `EmailNode`, `EmailMark`, and core editor helpers. |
| `@react-email/editor/extensions` | TipTap extensions and the current `StarterKit`. |
| `@react-email/editor/plugins` | Email theming and image upload helpers. |
| `@react-email/editor/ui` | Bubble menu, inspector, slash command, icons, and editor UI primitives. |
| `@react-email/editor/utils` | Public utility exports such as `setTextAlignment`. |
| `@react-email/editor/styles/*.css` | Public CSS import surfaces. |
| `@react-email/editor/themes/default.css` | Public default theme CSS import surface. |

These exports remain the compatibility baseline until a later OpenSpec phase
explicitly defines a rename or replacement path.

## Internal Entry Points

The editor package currently organizes source code around these internal
entry points:

| Area | Path | Boundary role |
|---|---|---|
| Root public entry | `packages/editor/src/index.ts` | Re-exports `EmailEditor` only. |
| Editor shell | `packages/editor/src/email-editor` | Browser React shell around TipTap `EditorProvider`, default extensions, menus, theme CSS, and ref methods. |
| Core | `packages/editor/src/core` | Event bus, paste/drop handlers, visual-empty helper, serializer contracts, and core types. |
| Serializer | `packages/editor/src/core/serializer` | Current React Email serializer, email node/mark contracts, and base email template. |
| Extensions | `packages/editor/src/extensions` | Current email-aware TipTap nodes, marks, attributes, and `StarterKit`. |
| Plugins | `packages/editor/src/plugins` | Email theming and browser image upload helpers. |
| UI | `packages/editor/src/ui` | Bubble menus, inspector, slash commands, icons, primitives, and CSS. |
| Utils | `packages/editor/src/utils` | Public and internal helper utilities. |
| Internal boundary | `packages/editor/src/boundary` | Phase 4 metadata and tests that group the legacy editor surface without creating public exports. |

## Safe To Wrap

The following surfaces are safe to wrap during the migration because they can
be referenced without changing runtime behavior:

- Public package subpaths through `@asym/pdf-editor/react-email-compat`.
- Internal metadata in `packages/editor/src/boundary`.
- Export smoke scripts and package boundary tests.
- Plain fixture data under `packages/pdf-editor/test/fixtures` and
  `packages/pdf-renderer/test/fixtures`.
- Documentation that marks email-first behavior as the legacy baseline.

## Must Remain Untouched For Now

The following surfaces must not be moved or renamed in Phase 4:

- `packages/editor/package.json#name`, `#exports`, and CSS side-effect policy.
- `packages/editor/src/index.ts` public root behavior.
- `packages/editor/src/email-editor/email-editor.tsx` ref methods:
  `getEmail`, `getEmailHTML`, `getEmailText`, `getJSON`, and `editor`.
- `packages/editor/src/core/serializer/compose-react-email.tsx`.
- `packages/editor/src/core/serializer/email-node.ts`.
- `packages/editor/src/core/serializer/email-mark.ts`.
- `packages/editor/src/core/serializer/default-base-template.tsx`.
- Current extension renderers that implement `renderToReactEmail`.
- Existing unit, browser, and snapshot tests.
- Retained upstream email apps, examples, and docs classified as
  `replace-later`.

## Current Test Coverage

Current behavior is protected by these test groups:

- Serializer unit tests under
  `packages/editor/src/core/serializer/*.spec.ts*`.
- Extension renderer snapshot tests under
  `packages/editor/src/extensions/*.spec.tsx` and
  `packages/editor/src/extensions/__snapshots__`.
- Core event, visual-empty, and paste/drop handler tests under
  `packages/editor/src/core`.
- Plugin tests under `packages/editor/src/plugins/**`.
- UI tests under `packages/editor/src/ui/**`.
- Browser integration tests under `packages/editor/src/__tests__` and
  `*.browser.spec.tsx`.
- Export smoke coverage through `pnpm asym:editor-export-smoke`.
- Phase 4 internal boundary tests under `packages/editor/src/boundary`.

## Future Package Split

The intended future split remains:

| Package | Future ownership |
|---|---|
| `@asym/pdf-template-schema` | Versioned template JSON, page settings, themes, variables, assets, render jobs, batch runs, and audit-oriented model types. |
| `@asym/pdf-editor` | Browser React editor shell, PDF-first TipTap extensions, document UI, inspector controls, and compatibility adapters. |
| `@asym/pdf-renderer` | PDF serializer, deterministic print HTML/CSS, preflight, preview helpers, and fixture utilities. |
| `@asym/docraptor-client` | Server-only DocRaptor API calls, async status, test mode, error normalization, and render metadata. |
| `@asym/pdf-studio-adapter` | Future `Asymmetric-al/core` adapter for storage, permissions, assets, audit, feature flags, and render jobs. |

Phase 4 only creates boundary documentation, metadata, and fixture scaffolding.
Real schema, serializer, editor shell, DocRaptor, and adapter behavior belongs
to later phases.

## Risks If Moved Too Early

- Breaking `@react-email/editor` public exports before compatibility paths
  exist.
- Losing the known-working `composeReactEmail` baseline before PDF serializer
  fixtures exist.
- Pulling browser-only editor code into future server renderer packages.
- Leaking server-only DocRaptor credentials into browser packages.
- Invalidating extension snapshots before there is a documented fixture update
  policy.
- Confusing email-era retained references with final PDF product APIs.
- Hiding regressions behind package moves instead of behavior-focused tests.

## Phase 4 Boundary Added

Phase 4 adds `packages/editor/src/boundary` as an internal-only metadata
surface. It records the selected legacy root, core, extension, plugin, UI, and
utility references that future wrappers may depend on. It is intentionally not
listed in `packages/editor/package.json#exports`.
