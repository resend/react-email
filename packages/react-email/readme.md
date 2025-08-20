![React email cover](https://react.email/static/covers/react-email.png)

<div align="center"><strong>React Email</strong></div>
<div align="center">The next generation of writing emails.<br />High-quality, unstyled components for creating emails.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a>
<span> · </span>
<a href="https://github.com/resend/react-email">GitHub</a>

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

## Setting Up the Environment

When working in the CLI, a lot of friction can get introduced with installing it and rebuilding for every change. To avoid that, we have a script that can be linked globally to directly run the source code of the CLI. You can use it the same as you would the standard CLI.

### 1. Link `react-email` globally

```sh
pnpm link ./dev -g
```

### 2. Run the CLI

```sh
email-dev [command] [flags]
```

## License

MIT License
