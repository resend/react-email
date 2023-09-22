### Getting Started

If you're new to either `pnpm` or `Moon` you'll want to run the `bootstrap.sh` script first. It will install everything you'll need to get started, and bootstrap your environment:

```console
$ ./shared/bootstrap.sh
```

Next we'll want to get dependencies installed, and get everything built. _(Note: One of the benefits of `Moon` is that it uses intelligent caching to assert that dependencies are always up to date before running any command. We don't techincally have to install dependencies first)_:

```console
$ pnpm install
```

Build all of the packages in the repo:

```console
$ moon run jsx-email:build.packages
```

And build the cli:

```console
$ moon run cli:build
```

To start up the preview server locally:

```console
$ pnpm dev
```

Open up the preview server [http://localhost:55420/](http://localhost:55420/)