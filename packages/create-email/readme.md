# create-email

This is a retained upstream React Email package inside the Asymmetric.al PDF
Document Builder fork. It remains here to preserve the frozen baseline while
the repo is refactored through OpenSpec phases.

This package is not the PDF builder entrypoint. For product direction, current
phase scope, and future package boundaries, start with the root README,
`AGENTS.md`, and `openspec/changes/build-pdf-document-builder/`.

## Current Baseline Behavior

The upstream package scaffolds a React Email project:

```sh
npx create-email
```

You can pass a directory name:

```sh
npx create-email my-emails
```

Do not repurpose this package for PDF builder scaffolding until an OpenSpec
phase explicitly introduces that boundary.

## License

MIT
