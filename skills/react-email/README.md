# Legacy React Email Skill Reference

This directory is retained as upstream React Email reference material for the
current compatibility baseline. It is not the product source of truth for the
Asymmetric.al PDF Document Builder.

Agents working on the PDF builder, PDF Studio replacement, DocRaptor rendering,
template schema, variables, repeaters, financial reports, batch generation,
Unlayer migration, or future `Asymmetric-al/core` integration must start with:

- `AGENTS.md`
- `openspec/project.md`
- `openspec/changes/build-pdf-document-builder/proposal.md`
- `openspec/changes/build-pdf-document-builder/design.md`
- `openspec/changes/build-pdf-document-builder/tasks.md`
- `docs/asym-product-charter.md`
- `docs/roadmap.md`

## Why This Still Exists

The fork still contains upstream-shaped packages such as `@react-email/editor`,
`react-email`, `@react-email/render`, and `create-email`. Until a later OpenSpec
phase replaces or renames those package boundaries, this skill remains useful
for understanding inherited editor behavior and compatibility expectations.

## What This Skill Covers

- Legacy HTML email templates built with React Email components
- Upstream visual email editor behavior
- Upstream rendering and sending references
- Compatibility investigation for retained React Email packages

## What This Skill Does Not Cover

- Asym PDF template schema design
- DocRaptor production rendering contracts
- PDF Studio replacement behavior
- tenant brand defaults, donor data, financial reports, or batch PDF jobs
- migration from Unlayer document templates
- adapter contracts for future `Asymmetric-al/core` integration

## Structure

```text
skills/
  react-email/
    SKILL.md              # Legacy upstream skill instructions
    references/
      COMPONENTS.md       # Upstream component reference
      EDITOR.md           # Upstream visual email editor reference
      I18N.md             # Upstream internationalization guide
      PATTERNS.md         # Upstream email patterns and examples
      SENDING.md          # Upstream email sending guide
      STYLING.md          # Upstream styling and CSS reference
```

## Maintenance Rule

Do not expand this skill into PDF builder product guidance. Add durable PDF
builder behavior to OpenSpec and repo docs instead.
