# react-email

This is a retained upstream React Email package inside the Asymmetric.al PDF
Document Builder fork. It remains here to preserve the frozen baseline while
the repo is refactored through OpenSpec phases.

This package is not the PDF builder API. For product direction, current phase
scope, and future package boundaries, start with the root README, `AGENTS.md`,
and `openspec/changes/build-pdf-document-builder/`.

## Current Baseline Behavior

The upstream CLI can run a local preview server for email templates:

```sh
npx react-email dev
```

It can export plain HTML files:

```sh
npx react-email export
```

Those commands are retained for compatibility. Do not add PDF rendering,
DocRaptor credentials, tenant data, or batch generation behavior here until a
later OpenSpec phase explicitly changes the package boundary.

## Development

Use `pnpm` from the repo root:

```sh
pnpm --filter react-email build
pnpm --filter react-email test
```

## License

MIT
