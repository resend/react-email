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

#### Watching files outside the emails directory

By default, only the emails directory and files reachable through static imports from your templates are watched. Files loaded at runtime are invisible to the static dependency graph, so editing them does not refresh the preview. Common examples:

- `react-i18next` message JSON pulled in through a dynamic import:

  ```ts
  i18next.use(resourcesToBackend((lng, ns) => import(`./messages/${lng}/${ns}.json`)));
  ```

- MDX or YAML content loaded by a backend at request time.
- Any file read with `fs.readFileSync` / `fs.promises.readFile`.

Pass `-w, --watch <paths...>` to declare extra files or directories to watch. A change in any of these paths reloads every email preview:

```sh
npx react-email dev -d ./emails -w ./i18n
```

Multiple paths are supported:

```sh
npx react-email dev -w ./i18n ./content
```

Non-existent paths are skipped with a warning rather than failing.

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
