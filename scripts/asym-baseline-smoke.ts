import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const expectedUpstreamCanarySha = 'd064012cd5a3b4817dbe03a932a6d68e83e07abb';
const expectedEditorPackageName = '@react-email/editor';

type JsonRecord = Record<string, unknown>;

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJsonRecord(filePath: string): JsonRecord {
  const fileContent = readFileSync(filePath, 'utf8');
  const parsedJson: unknown = JSON.parse(fileContent);

  if (!isJsonRecord(parsedJson)) {
    throw new Error(`${filePath} did not contain a JSON object.`);
  }

  return parsedJson;
}

function readStringField(
  jsonRecord: JsonRecord,
  fieldName: string,
  filePath: string,
): string {
  const value = jsonRecord[fieldName];

  if (typeof value !== 'string') {
    throw new Error(`${filePath} is missing string field "${fieldName}".`);
  }

  return value;
}

function readGitOutput(args: string[], cwd: string): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function verifyEditorPackage(repoRoot: string): {
  name: string;
  path: string;
  version: string;
} {
  const relativePath = 'packages/editor/package.json';
  const packagePath = join(repoRoot, 'packages', 'editor', 'package.json');

  if (!existsSync(packagePath)) {
    throw new Error(`${relativePath} was not found.`);
  }

  const packageJson = readJsonRecord(packagePath);
  const name = readStringField(packageJson, 'name', relativePath);
  const version = readStringField(packageJson, 'version', relativePath);

  if (name !== expectedEditorPackageName) {
    throw new Error(
      `Expected ${relativePath} name to be ${expectedEditorPackageName}, got ${name}.`,
    );
  }

  return {
    name,
    path: relativePath,
    version,
  };
}

function verifyUpstreamBaseline(repoRoot: string): string {
  const upstreamCanarySha = readGitOutput(
    ['rev-parse', '--verify', 'upstream/canary'],
    repoRoot,
  );

  if (upstreamCanarySha !== expectedUpstreamCanarySha) {
    throw new Error(
      `Expected upstream/canary ${expectedUpstreamCanarySha}, got ${upstreamCanarySha}.`,
    );
  }

  return upstreamCanarySha;
}

const repoRoot = process.cwd();
const rootPackagePath = join(repoRoot, 'package.json');
const rootPackageJson = readJsonRecord(rootPackagePath);
const packageManager = readStringField(
  rootPackageJson,
  'packageManager',
  'package.json',
);
const editorPackage = verifyEditorPackage(repoRoot);
const upstreamCanarySha = verifyUpstreamBaseline(repoRoot);
const currentBranch = readGitOutput(['branch', '--show-current'], repoRoot);

console.log('asym-baseline-smoke');
console.log(`branch=${currentBranch}`);
console.log(`upstreamCanarySha=${upstreamCanarySha}`);
console.log(`editorPackagePath=${editorPackage.path}`);
console.log(`editorPackageName=${editorPackage.name}`);
console.log(`editorPackageVersion=${editorPackage.version}`);
console.log(`packageManager=${packageManager}`);
console.log('status=ok');
