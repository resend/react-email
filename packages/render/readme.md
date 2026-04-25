# @react-email/render

This is a retained upstream React Email package inside the Asymmetric.al PDF
Document Builder fork. It remains here to preserve the frozen baseline while
the repo is refactored through OpenSpec phases.

This package renders React Email components to HTML. It is not the production
PDF renderer, and it must not grow DocRaptor credential handling or PDF batch
job behavior unless a later OpenSpec phase explicitly changes that boundary.

## Current Baseline Behavior

```tsx
import { render } from "@react-email/render";
import { MyTemplate } from "../components/MyTemplate";

const html = await render(<MyTemplate firstName="Jim" />);
```

For PDF builder work, start with the root README, `AGENTS.md`, and
`openspec/changes/build-pdf-document-builder/`.

## License

MIT
