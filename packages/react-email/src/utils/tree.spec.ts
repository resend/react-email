import { tree } from './tree.js';

test('tree(__dirname, 2)', async () => {
  expect(await tree(__dirname, 2)).toMatchInlineSnapshot(`
    "utils
    ├── esbuild
    │   ├── escape-string-for-regex.ts
    │   └── renderring-utilities-exporter.ts
    ├── preview
    │   ├── hot-reloading
    │   ├── get-env-variables-for-preview-app.ts
    │   ├── index.ts
    │   ├── serve-static-file.ts
    │   └── start-dev-server.ts
    ├── types
    │   ├── hot-reload-change.ts
    │   └── hot-reload-event.ts
    ├── conf.ts
    ├── get-emails-directory-metadata.spec.ts
    ├── get-emails-directory-metadata.ts
    ├── get-preview-server-location.ts
    ├── index.ts
    ├── packageJson.ts
    ├── register-spinner-autostopping.ts
    ├── style-text.ts
    ├── tree.spec.ts
    └── tree.ts"
  `);
});
