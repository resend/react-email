import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

type ModuleNamespace = Record<string, unknown>;

const phase08RuntimeExports = [
  'DocumentEditor',
  'DocumentMark',
  'DocumentNode',
  'PdfEditor',
  'ReactEmailEditorReference',
  'ReactEmailMarkReference',
  'ReactEmailNodeReference',
  'pdfEditorBoundary',
] as const;

const phase08DeclarationNames = [
  'DocumentEditor',
  'DocumentEditorProps',
  'DocumentEditorRef',
  'DocumentMark',
  'DocumentNode',
  'PdfEditor',
  'PdfEditorProps',
  'PdfEditorRef',
] as const;

function assertRuntimeExport(
  moduleNamespace: ModuleNamespace,
  exportName: string,
) {
  if (!(exportName in moduleNamespace)) {
    throw new Error(`@asym/pdf-editor is missing ${exportName}.`);
  }
}

function assertAliasIdentity(
  moduleNamespace: ModuleNamespace,
  aliasName: string,
  referenceName: string,
) {
  if (moduleNamespace[aliasName] !== moduleNamespace[referenceName]) {
    throw new Error(
      `${aliasName} must be the same runtime value as ${referenceName}.`,
    );
  }
}

function assertDeclarationName(filePath: string, declarationName: string) {
  const declarationContent = readFileSync(filePath, 'utf8');

  if (!declarationContent.includes(declarationName)) {
    throw new Error(`${filePath} is missing ${declarationName}.`);
  }
}

function assertDeclarationFile(filePath: string) {
  if (!existsSync(filePath)) {
    throw new Error(`Generated declaration file not found: ${filePath}.`);
  }

  for (const declarationName of phase08DeclarationNames) {
    assertDeclarationName(filePath, declarationName);
  }
}

async function importPdfEditorPackage(repoRoot: string) {
  const pdfEditorPackageJson = join(
    repoRoot,
    'packages',
    'pdf-editor',
    'package.json',
  );
  const packageRequire = createRequire(pdfEditorPackageJson);
  const resolvedPath = packageRequire.resolve('@asym/pdf-editor');

  return (await import(pathToFileURL(resolvedPath).href)) as ModuleNamespace;
}

async function main() {
  const repoRoot = process.cwd();
  const pdfEditorNamespace = await importPdfEditorPackage(repoRoot);

  console.log('asym-phase-08-document-names-smoke');

  for (const exportName of phase08RuntimeExports) {
    assertRuntimeExport(pdfEditorNamespace, exportName);
  }

  assertAliasIdentity(
    pdfEditorNamespace,
    'PdfEditor',
    'ReactEmailEditorReference',
  );
  assertAliasIdentity(
    pdfEditorNamespace,
    'DocumentEditor',
    'ReactEmailEditorReference',
  );
  assertAliasIdentity(
    pdfEditorNamespace,
    'DocumentNode',
    'ReactEmailNodeReference',
  );
  assertAliasIdentity(
    pdfEditorNamespace,
    'DocumentMark',
    'ReactEmailMarkReference',
  );

  assertDeclarationFile(
    join(repoRoot, 'packages', 'pdf-editor', 'dist', 'index.d.mts'),
  );
  assertDeclarationFile(
    join(repoRoot, 'packages', 'pdf-editor', 'dist', 'index.d.cts'),
  );

  console.log(`verified Phase 08 aliases=${phase08DeclarationNames.join(',')}`);
  console.log('status=ok');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
