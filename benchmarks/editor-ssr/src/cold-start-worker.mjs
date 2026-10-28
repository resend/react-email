// Measures cold-start cost in a fresh Node process: module import time
// plus a single newsletter compose. Invoked by run.ts via spawnSync.
// Plain .mjs (not TypeScript) so the child process runs without a loader
// and the measurement reflects what a server actually pays.
const startedAt = performance.now();
const mode = process.argv[2] ?? 'editor';

const [{ composeReactEmail }, { StarterKit }, { EmailTheming }, { Editor }] =
  await Promise.all([
    import('@react-email/editor/core'),
    import('@react-email/editor/extensions'),
    import('@react-email/editor/plugins'),
    // The headless path never needs @tiptap/core directly.
    mode === 'editor' ? import('@tiptap/core') : Promise.resolve({}),
  ]);

const importedAt = performance.now();

const doc = {
  type: 'doc',
  content: [
    {
      type: 'globalContent',
      attrs: { data: { theme: 'basic', css: '' } },
    },
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Cold start' }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'One compose in a fresh process.' }],
    },
    {
      type: 'button',
      attrs: { href: 'https://example.com', alignment: 'left' },
      content: [{ type: 'text', text: 'Open' }],
    },
  ],
};

if (mode === 'editor') {
  const editor = new Editor({
    extensions: [StarterKit, EmailTheming],
    content: doc,
  });
  await composeReactEmail({ editor });
  editor.destroy();
} else if (mode === 'headless') {
  await composeReactEmail({
    content: doc,
    extensions: [StarterKit, EmailTheming],
  });
} else {
  throw new Error(`unknown mode: ${mode}`);
}

const finishedAt = performance.now();

process.stdout.write(
  JSON.stringify({
    totalMs: finishedAt - startedAt,
    importMs: importedAt - startedAt,
    composeMs: finishedAt - importedAt,
  }),
);
