![React email cover](https://react.email/static/covers/react-email.png)

<div align="center"><strong>React Email</strong></div>
<div align="center">The next generation of writing emails.<br />High-quality, unstyled components for creating emails.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://github.com/resend/react-email">GitHub</a> 
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

## Getting started

To get started, open a new shell and run:

```sh
npx create-email
```

This will create a new folder called `emails` with a few email templates.

## Commands

### `email dev`

Starts a local development server that will watch your files and automatically rebuild your email when you make changes.

```sh
npx react-email dev
```

### `email export`

Generates the plain HTML files of your emails into a `out` directory.

```sh
npx react-email export
```

## Development setup

Running it for deveopment can be done, after you have built all packages, with:

1. ```sh
   pnpm link ./dev -g
   ```
2. ```sh
   email-dev ...
   ```

This is a script that runs the CLI using `tsx` directly from source so there is no need to rebuild it before running again.

## License

MIT License
