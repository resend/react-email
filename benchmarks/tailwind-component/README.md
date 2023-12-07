# Bencharmks for the Tailwind component

This is a collection of `tinybench` benchmarks that we've written with the purposes of scientifically
determining the performance hits that the Tailwind component causes to try improving it.

## Structure

```
├── package.json
├── src
|  ├── emails
|  ├── benchmark-0.0.12-vs-local-version.ts
|  ├── benchmark-with-vs-without.ts
|  └── tailwind-render.ts
├── tailwind.config.js
└── tsconfig.json
```

Each direct descendant of `./src` is a benchmark we have for a specific purpose.

The only exception for this is the `./src/tailwind-render.ts` as it is used for making a
flamegraph on the rendering process of the Tailwind component.

Inside of the emails folder we have a couple of emails we use across different benchmarks.

## Running benchmarks

To avoid ESM problems, these benchmarks need to be compiled using `tsup`,
which can be done by just running `pnpm compile`, to then be ran with node directly.

They are each compiled into a different entry on the `./dist` folder with their respective names.

To make this simpler we have scripts for each benchmark on our `./package.json` that you can try running:

```json
"scripts": {
    "with-vs-without": "pnpm compile && node ./dist/benchmark-with-vs-without.js",
    "before-perf-vs-after-perf": "pnpm compile && node ./dist/benchmark-0.0.12-vs-local-version",

    "flamegraph-render-tailwind": "pnpm compile && node --prof ./dist/tailwind-render && node --prof-process --preprocess -j isolate*.log | flamebearer",

    "compile": "tsup src/*.ts",
    "lint": "eslint ."
},
```
