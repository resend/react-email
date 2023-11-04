## Why `npm`?

This is due to `vsce` (The VS Code extension CLI) having problems with monorepos due to the fact
that it has its own type of linker that, in a monorepo, seems to fail when running `npm run package`.

So you will need to run:

```bash
$ npm install --force
```

## Why `--force`?

Sadly, this is because esbuild is a compiled package, and it has a specific package for each OS,
therefore, we do need to have installed a package for each OS to support them all.

Maybe a better solution for this can be found later.

See https://esbuild.github.io/getting-started/#simultaneous-platforms.
