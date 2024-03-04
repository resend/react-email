import { tree } from './tree';

test('tree(__dirname, 2)', async () => {
  expect(await tree(__dirname, 2)).toMatchInlineSnapshot(`"utils
├── preview
│   ├── get-env-variables-for-preview-app.ts
│   ├── index.ts
│   ├── serve-static-file.ts
│   ├── setup-hot-reloading.ts
│   └── start-dev-server.ts
├── close-ora-on-sigint.ts
├── index.ts
├── tree.spec.ts
└── tree.ts"`);
});
