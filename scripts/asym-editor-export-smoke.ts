import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

type ExportCheck = {
  expectedRuntimeExports: string[];
  specifier: string;
};

const javascriptExportChecks: ExportCheck[] = [
  {
    expectedRuntimeExports: ['EmailEditor'],
    specifier: '@react-email/editor',
  },
  {
    expectedRuntimeExports: [
      'EmailMark',
      'EmailNode',
      'composeReactEmail',
      'editorEventBus',
      'isDocumentVisuallyEmpty',
    ],
    specifier: '@react-email/editor/core',
  },
  {
    expectedRuntimeExports: [
      'Body',
      'Bold',
      'Button',
      'Container',
      'Heading',
      'Link',
      'Paragraph',
      'Section',
      'StarterKit',
      'Table',
      'Text',
    ],
    specifier: '@react-email/editor/extensions',
  },
  {
    expectedRuntimeExports: ['EmailTheming', 'useEditorImage'],
    specifier: '@react-email/editor/plugins',
  },
  {
    expectedRuntimeExports: ['BubbleMenu', 'Inspector', 'SlashCommand'],
    specifier: '@react-email/editor/ui',
  },
  {
    expectedRuntimeExports: ['setTextAlignment'],
    specifier: '@react-email/editor/utils',
  },
];

const cssExportSpecifiers = [
  '@react-email/editor/styles/bubble-menu.css',
  '@react-email/editor/styles/button-bubble-menu.css',
  '@react-email/editor/styles/image-bubble-menu.css',
  '@react-email/editor/styles/inspector.css',
  '@react-email/editor/styles/link-bubble-menu.css',
  '@react-email/editor/styles/slash-command.css',
  '@react-email/editor/themes/default.css',
];

function assertExportExists(
  moduleNamespace: Record<string, unknown>,
  specifier: string,
  exportName: string,
) {
  if (!(exportName in moduleNamespace)) {
    throw new Error(`${specifier} is missing runtime export ${exportName}.`);
  }
}

async function importPackageExport(
  packageRequire: NodeRequire,
  check: ExportCheck,
) {
  const resolvedPath = packageRequire.resolve(check.specifier);
  const moduleNamespace = (await import(
    pathToFileURL(resolvedPath).href
  )) as Record<string, unknown>;

  for (const exportName of check.expectedRuntimeExports) {
    assertExportExists(moduleNamespace, check.specifier, exportName);
  }

  console.log(
    `imported ${check.specifier} exports=${check.expectedRuntimeExports.join(',')}`,
  );
}

function resolveCssExport(packageRequire: NodeRequire, specifier: string) {
  const resolvedPath = packageRequire.resolve(specifier);

  if (!existsSync(resolvedPath)) {
    throw new Error(`${specifier} resolved to missing file ${resolvedPath}.`);
  }

  console.log(`resolved ${specifier}`);
}

const repoRoot = process.cwd();
const editorPackagePath = join(repoRoot, 'packages', 'editor', 'package.json');
const editorRequire = createRequire(editorPackagePath);

async function main() {
  console.log('asym-editor-export-smoke');

  for (const check of javascriptExportChecks) {
    await importPackageExport(editorRequire, check);
  }

  for (const specifier of cssExportSpecifiers) {
    resolveCssExport(editorRequire, specifier);
  }

  console.log('status=ok');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
