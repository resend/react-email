import { tree } from './tree';

test('tree(__dirname, 2)', async () => {
  expect(await tree(__dirname, 2)).toMatchInlineSnapshot(`"utils
├── preview
│   ├── hot-reloading
│   ├── get-env-variables-for-preview-app.ts
│   ├── index.ts
│   ├── serve-static-file.ts
│   └── start-dev-server.ts
├── index.ts
├── tree.spec.ts
└── tree.ts"`);
});
