![React Email preview cover](https://react.email/static/covers/preview.png)

<div align="center"><strong>@react-email/preview-server</strong></div>
<div align="center">A live preview of your emails right in your browser.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://github.com/resend/react-email">GitHub</a> 
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

This package is used to store the preview server, it is also published and versioned so that it can be installed when the [CLI](../react-email) is being used.

## Development setup

Running it for deveopment can be done with:

1. ```sh
   pnpm dev:seed
   ```
2. ```sh
   pnpm dev
   ```
3. Opening http://localhost:3000

The `pnpm dev` is separate from the CLI, and is meant just for working on the UI at a faster pace by using `next dev`. It lets you to work on the preview server of the email templates in `./emails` without hot reloading or other features that require the CLI.

The `pnpm dev:seed` command generates a boilerplate emails directory for you to work with. These files can also be modified as you see fit since they are not included in git.

