import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { composeReactEmail } from '@react-email/editor/core';
import { StarterKit } from '@react-email/editor/extensions';
import { EmailTheming } from '@react-email/editor/plugins';
import { Editor } from '@tiptap/core';
import { Bench } from 'tinybench';
import { fixtures } from './fixtures.js';

const here = dirname(fileURLToPath(import.meta.url));

const extensions = [StarterKit, EmailTheming];

function composeViaEditor(doc: (typeof fixtures)[keyof typeof fixtures]) {
  const editor = new Editor({ extensions, content: doc });
  try {
    return composeReactEmail({ editor });
  } finally {
    editor.destroy();
  }
}

interface ColdStartSample {
  totalMs: number;
  importMs: number;
  composeMs: number;
}

function measureColdStart(mode: 'editor' | 'headless'): ColdStartSample {
  const child = spawnSync(
    process.execPath,
    [resolve(here, 'cold-start-worker.mjs'), mode],
    { encoding: 'utf-8' },
  );
  if (child.status !== 0) {
    throw new Error(`cold-start worker failed: ${child.stderr}`);
  }
  return JSON.parse(child.stdout) as ColdStartSample;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? Number.NaN;
}

async function checkParity() {
  const parity: Record<string, boolean> = {};
  for (const [name, doc] of Object.entries(fixtures)) {
    const fromEditor = await composeViaEditor(doc);
    const fromContent = await composeReactEmail({
      content: doc,
      extensions,
    });
    parity[name] =
      fromEditor.unformattedHtml === fromContent.unformattedHtml &&
      fromEditor.text === fromContent.text;
    if (!parity[name]) {
      const a = fromEditor.unformattedHtml;
      const b = fromContent.unformattedHtml;
      let index = 0;
      while (index < a.length && a[index] === b[index]) {
        index += 1;
      }
      console.error(
        `parity FAILED for ${name} at byte ${index}:\n  editor : …${a.slice(index - 60, index + 60)}…\n  content: …${b.slice(index - 60, index + 60)}…`,
      );
    }
  }
  return parity;
}

async function main() {
  const results: Record<string, unknown> = {};

  // 1. Parity: the headless path must produce byte-identical output to the
  // editor path for the same document. Anything else is a correctness bug,
  // not a performance trade-off.
  const parity = await checkParity();
  results.parity = parity;
  console.log('\n## Parity (editor path vs content path)\n');
  console.log(parity);

  // 2. Throughput: serialize each fixture the way a server would —
  // one document in, one HTML string out.
  const bench = new Bench({ time: 3000, warmupTime: 500 });
  for (const [name, doc] of Object.entries(fixtures)) {
    bench.add(`editor-based compose: ${name}`, async () => {
      await composeViaEditor(doc);
    });
    // Warm schema: module-scope extensions array, the realistic server
    // steady state (schema/extension resolution cached by array identity).
    bench.add(`headless compose (warm): ${name}`, async () => {
      await composeReactEmail({ content: doc, extensions });
    });
    // Cold schema: a fresh extensions array per call defeats the cache and
    // pays extension resolution + schema compilation every time.
    bench.add(`headless compose (cold): ${name}`, async () => {
      await composeReactEmail({
        content: doc,
        extensions: [StarterKit, EmailTheming],
      });
    });
  }
  await bench.run();

  console.log('\n## Throughput (tinybench)\n');
  console.table(bench.table());
  results.throughput = bench.tasks.map((task) => ({
    name: task.name,
    hz: task.result?.throughput.mean,
    meanMs: task.result?.latency.mean,
    p99Ms: task.result?.latency.p99,
    samples: task.result?.latency.samples.length,
  }));

  // 3. Cold start: fresh Node process, import + one newsletter compose.
  const coldStartRuns = 7;
  const coldStart: Record<string, unknown> = {};
  for (const mode of ['editor', 'headless'] as const) {
    const samples = Array.from({ length: coldStartRuns }, () =>
      measureColdStart(mode),
    );
    coldStart[mode] = {
      totalMs: median(samples.map((sample) => sample.totalMs)),
      importMs: median(samples.map((sample) => sample.importMs)),
      composeMs: median(samples.map((sample) => sample.composeMs)),
    };
    console.log(`\n## Cold start (${mode}, median of ${coldStartRuns})\n`);
    console.log(coldStart[mode]);
  }
  results.coldStart = coldStart;

  // 4. Output sizes, as a sanity anchor across iterations.
  const sizes: Record<string, number> = {};
  for (const [name, doc] of Object.entries(fixtures)) {
    const { unformattedHtml } = await composeReactEmail({
      content: doc,
      extensions,
    });
    sizes[name] = unformattedHtml.length;
  }
  results.outputBytes = sizes;
  console.log('\n## Output size (unformatted HTML bytes)\n');
  console.log(sizes);

  const outPath = resolve(here, '../results');
  mkdirSync(outPath, { recursive: true });
  writeFileSync(
    resolve(outPath, 'latest.json'),
    `${JSON.stringify(results, null, 2)}\n`,
  );
  console.log(`\nResults written to ${resolve(outPath, 'latest.json')}`);
}

await main();
