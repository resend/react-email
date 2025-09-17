# Bencharmks for the Tailwind component

This is a collection of `tinybench` benchmarks that we've written with the purposes of scientifically
determining the performance hits that the Tailwind component causes to try improving it.

## Structure

```
├── package.json
├── src
|  ├── emails
|  ├── benchmark-0.0.12-vs-local-version.tsx
|  ├── benchmark-0.0.17-vs-local-version.tsx
|  ├── benchmark-with-vs-without.tsx
|  └── tailwind-render.tsx
├── tailwind.config.js
└── tsconfig.json
```

Each direct descendant of `./src` is a benchmark we have for a specific purpose.

The only exception for this is the `./src/tailwind-render.ts` as it is used for making a
flamegraph on the rendering process of the Tailwind component.

The `emails` folder contains examples to be used across different benchmarks.

## Running benchmarks

We have scripts for each benchmark on our `./package.json` that you can try running:

```json
    "scripts": {
        "with-vs-without": "tsx ./src/benchmark-with-vs-without",
        "0.0.17-vs-local": "tsx --max-old-space-size=256 ./src/benchmark-0.0.17-vs-local-version",
        "0.0.12-vs-local": "tsx ./src/benchmark-0.0.12-vs-local-version",
        "flamegraph-render-tailwind": "tsx --prof ./src/tailwind-render && node --prof-process --preprocess -j isolate*.log | flamebearer"
    },
```
