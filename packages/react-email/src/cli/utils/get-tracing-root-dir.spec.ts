import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getTracingRootDir } from './get-tracing-root-dir.js';

const mkTempDir = () =>
  fs.mkdtempSync(path.join(os.tmpdir(), 'get-tracing-root-dir-'));

const writeJson = (filePath: string, contents: unknown) =>
  fs.writeFileSync(filePath, JSON.stringify(contents));

test('resolves to the project directory itself for a standalone package', async () => {
  const projectDir = mkTempDir();
  writeJson(path.join(projectDir, 'package.json'), { name: 'standalone' });

  expect(await getTracingRootDir(projectDir)).toBe(
    projectDir.replaceAll('\\', '/'),
  );

  fs.rmSync(projectDir, { recursive: true });
});

test('resolves to the workspace root for a package nested inside a pnpm workspace', async () => {
  const repoRoot = mkTempDir();
  const packageDir = path.join(repoRoot, 'packages', 'transactional');
  fs.mkdirSync(packageDir, { recursive: true });

  writeJson(path.join(repoRoot, 'package.json'), { name: 'monorepo-root' });
  fs.writeFileSync(
    path.join(repoRoot, 'pnpm-workspace.yaml'),
    'packages:\n  - "packages/*"\n',
  );
  writeJson(path.join(packageDir, 'package.json'), { name: 'transactional' });

  expect(await getTracingRootDir(packageDir)).toBe(
    repoRoot.replaceAll('\\', '/'),
  );

  fs.rmSync(repoRoot, { recursive: true });
});

test('falls back to the project directory when no package.json can be found', async () => {
  const projectDir = fs.realpathSync(mkTempDir());

  expect(await getTracingRootDir(projectDir)).toBe(
    projectDir.replaceAll('\\', '/'),
  );

  fs.rmSync(projectDir, { recursive: true });
});
