import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type JsonRecord = Record<string, unknown>;

const reactEmailEditorExportSubpaths = [
  '.',
  './core',
  './extensions',
  './plugins',
  './ui',
  './utils',
  './styles/bubble-menu.css',
  './styles/button-bubble-menu.css',
  './styles/image-bubble-menu.css',
  './styles/inspector.css',
  './styles/link-bubble-menu.css',
  './styles/slash-command.css',
  './themes/default.css',
];

const asymPackagePaths = [
  'packages/pdf-editor/package.json',
  'packages/pdf-renderer/package.json',
  'packages/pdf-template-schema/package.json',
  'packages/docraptor-client/package.json',
];

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

function readRecordField(
  jsonRecord: JsonRecord,
  fieldName: string,
  filePath: string,
): JsonRecord {
  const value = jsonRecord[fieldName];

  if (!isJsonRecord(value)) {
    throw new Error(`${filePath} is missing object field "${fieldName}".`);
  }

  return value;
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

function assertHasOwnField(
  jsonRecord: JsonRecord,
  fieldName: string,
  filePath: string,
) {
  if (!Object.hasOwn(jsonRecord, fieldName)) {
    throw new Error(`${filePath} is missing field "${fieldName}".`);
  }
}

function assertPackageIsPrivate(packageJson: JsonRecord, filePath: string) {
  if (packageJson.private !== true) {
    throw new Error(`${filePath} must remain private during Phase 5.`);
  }
}

function assertSourceExports(
  sourceContent: string,
  sourcePath: string,
  expectedExports: string[],
) {
  for (const expectedExport of expectedExports) {
    if (!sourceContent.includes(expectedExport)) {
      throw new Error(`${sourcePath} is missing ${expectedExport}.`);
    }
  }
}

function verifyReactEmailEditorPackage(repoRoot: string) {
  const relativePath = 'packages/editor/package.json';
  const packagePath = join(repoRoot, relativePath);
  const packageJson = readJsonRecord(packagePath);
  const exportsField = readRecordField(packageJson, 'exports', relativePath);
  const packageName = readStringField(packageJson, 'name', relativePath);
  const packageVersion = readStringField(packageJson, 'version', relativePath);

  if (packageName !== '@react-email/editor') {
    throw new Error(`${relativePath} name changed to ${packageName}.`);
  }

  if (packageVersion !== '1.1.1') {
    throw new Error(`${relativePath} version changed to ${packageVersion}.`);
  }

  for (const subpath of reactEmailEditorExportSubpaths) {
    assertHasOwnField(exportsField, subpath, relativePath);
  }

  console.log(
    `verified @react-email/editor version=${packageVersion} exports=${reactEmailEditorExportSubpaths.join(',')}`,
  );
}

function verifyPdfEditorPackage(repoRoot: string) {
  const relativePath = 'packages/pdf-editor/package.json';
  const packageJson = readJsonRecord(join(repoRoot, relativePath));
  const dependencies = readRecordField(
    packageJson,
    'dependencies',
    relativePath,
  );
  const exportsField = readRecordField(packageJson, 'exports', relativePath);
  const packageName = readStringField(packageJson, 'name', relativePath);
  const sourcePath = 'packages/pdf-editor/src/index.ts';
  const compatSourcePath = 'packages/pdf-editor/src/react-email-compat.ts';
  const sourceContent = readFileSync(join(repoRoot, sourcePath), 'utf8');
  const compatSourceContent = readFileSync(
    join(repoRoot, compatSourcePath),
    'utf8',
  );

  if (packageName !== '@asym/pdf-editor') {
    throw new Error(`${relativePath} name changed to ${packageName}.`);
  }

  assertPackageIsPrivate(packageJson, relativePath);
  assertHasOwnField(exportsField, '.', relativePath);
  assertHasOwnField(exportsField, './react-email-compat', relativePath);

  if (dependencies['@react-email/editor'] !== 'workspace:*') {
    throw new Error(
      `${relativePath} must keep @react-email/editor as a workspace dependency.`,
    );
  }

  assertSourceExports(sourceContent, sourcePath, [
    'pdfEditorBoundary',
    "'@react-email/editor'",
    'react-email-reference-adapter',
  ]);
  assertSourceExports(compatSourceContent, compatSourcePath, [
    'ReactEmailEditorReference',
    'ReactEmailNodeReference',
    'ReactEmailMarkReference',
    'composeReactEmailReference',
    'ReactEmailStarterKitReference',
  ]);

  console.log(
    'verified @asym/pdf-editor wrapper strategy exports=.,./react-email-compat',
  );
}

function verifyAsymPackagesStayPrivate(repoRoot: string) {
  for (const relativePath of asymPackagePaths) {
    const packagePath = join(repoRoot, relativePath);

    if (!existsSync(packagePath)) {
      throw new Error(`${relativePath} was not found.`);
    }

    const packageJson = readJsonRecord(packagePath);
    const packageName = readStringField(packageJson, 'name', relativePath);

    assertPackageIsPrivate(packageJson, relativePath);
    console.log(`verified ${packageName} private=true`);
  }
}

const repoRoot = process.cwd();

console.log('asym-package-strategy-smoke');
verifyReactEmailEditorPackage(repoRoot);
verifyPdfEditorPackage(repoRoot);
verifyAsymPackagesStayPrivate(repoRoot);
console.log('status=ok');
