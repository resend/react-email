<div align="center"><strong>@react-email/preview-server</strong></div>
<div align="center">A live preview of your emails right in your browser.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a>
<span> · </span>
<a href="https://github.com/resend/react-email">GitHub</a>

</div>

This package is used to store the preview server, it is also published and versioned so that it can be installed when the [CLI](../react-email) is being used.

## Development workflow

### 1. Seed email templates

```sh
pnpm dev:seed
```

This generates a boilerplate emails directory for you to work with. These files can also be modified as you see fit since they are not included in git.

### 2. Run development server

```sh
pnpm dev
```

This is somewhat equivalent to `next dev` and does not support hot reloading for email templates like the CLI does. It lets you work on the UI for the preview server mainly.

### 3. Open in your browser

Go to http://localhost:3000

