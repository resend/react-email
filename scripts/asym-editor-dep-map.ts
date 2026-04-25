import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

type Classification =
  | 'fork'
  | 'keep'
  | 'remove-later'
  | 'replace-later'
  | 'unknown'
  | 'wrap';

type JsonPrimitive = boolean | null | number | string;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type ClassifiedValue = {
  classification: Classification;
  reason: string;
};

type ImportEdge = {
  classification: Classification;
  file: string;
  kind: 'css' | 'node' | 'package' | 'relative';
  packageName?: string;
  reason: string;
  specifier: string;
  target?: string;
};

type PackageEntry = {
  classification: Classification;
  name: string;
  path: string;
  private: boolean;
  reason: string;
  scripts: string[];
  version: string | null;
};

const excludedDirectoryNames = new Set([
  '.git',
  '.next',
  '.react-email',
  '.turbo',
  'dist',
  'node_modules',
  'out',
]);

const sourceExtensions = new Set([
  '.css',
  '.cts',
  '.cjs',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mdx',
  '.mts',
  '.mjs',
  '.ts',
  '.tsx',
  '.yaml',
  '.yml',
]);

const editorDependencySections = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
] as const;

const referencePatterns = [
  '@asym/docraptor-client',
  '@asym/pdf-editor',
  '@asym/pdf-renderer',
  '@asym/pdf-template-schema',
  '@react-email/editor',
  'packages/editor',
  'packages/docraptor-client',
  'packages/pdf-editor',
  'packages/pdf-renderer',
  'packages/pdf-template-schema',
  'EmailEditor',
  'EmailMark',
  'EmailNode',
  'EmailTheming',
  'BaseTemplate',
  'composeReactEmail',
  'renderToReactEmail',
];

const publicExportSubpaths = [
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

function toPosixPath(filePath: string): string {
  return filePath.split(sep).join('/');
}

function relativeToRoot(repoRoot: string, filePath: string): string {
  return toPosixPath(relative(repoRoot, filePath));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJsonObject(filePath: string): Record<string, unknown> {
  const rawContent = readFileSync(filePath, 'utf8');
  const parsedJson: unknown = JSON.parse(rawContent);

  if (!isRecord(parsedJson)) {
    throw new Error(`${filePath} did not contain a JSON object.`);
  }

  return parsedJson;
}

function readStringMap(
  jsonRecord: Record<string, unknown>,
  fieldName: string,
): Record<string, string> {
  const value = jsonRecord[fieldName];

  if (!isRecord(value)) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === 'string') {
      result[key] = entry;
    }
  }

  return result;
}

function readScripts(jsonRecord: Record<string, unknown>): string[] {
  return Object.keys(readStringMap(jsonRecord, 'scripts')).sort();
}

function readWorkspaceGlobs(repoRoot: string): string[] {
  const workspaceFile = join(repoRoot, 'pnpm-workspace.yaml');
  const workspaceContent = readFileSync(workspaceFile, 'utf8');
  const workspaceGlobs: string[] = [];
  let inPackagesBlock = false;

  for (const line of workspaceContent.split(/\r?\n/)) {
    if (line.trim() === 'packages:') {
      inPackagesBlock = true;
      continue;
    }

    if (!inPackagesBlock) {
      continue;
    }

    const globMatch = line.match(/^\s*-\s+(.+)$/);
    if (globMatch) {
      workspaceGlobs.push(globMatch[1].trim());
      continue;
    }

    if (line.trim() !== '' && !line.startsWith(' ')) {
      break;
    }
  }

  return workspaceGlobs.sort();
}

function listFiles(repoRoot: string, startPath: string): string[] {
  if (!existsSync(startPath)) {
    return [];
  }

  const collectedFiles: string[] = [];

  function visit(currentPath: string) {
    const stats = statSync(currentPath);

    if (stats.isDirectory()) {
      const directoryName = currentPath.split(/[\\/]/).at(-1);
      if (directoryName && excludedDirectoryNames.has(directoryName)) {
        return;
      }

      const children = readdirSync(currentPath)
        .map((child) => join(currentPath, child))
        .sort((left, right) => left.localeCompare(right));

      for (const child of children) {
        visit(child);
      }

      return;
    }

    if (stats.isFile()) {
      collectedFiles.push(currentPath);
    }
  }

  visit(startPath);

  return collectedFiles.sort((left, right) =>
    relativeToRoot(repoRoot, left).localeCompare(
      relativeToRoot(repoRoot, right),
    ),
  );
}

function hasSupportedSourceExtension(filePath: string): boolean {
  for (const extension of sourceExtensions) {
    if (filePath.endsWith(extension)) {
      return true;
    }
  }

  return false;
}

function packageNameFromSpecifier(specifier: string): string {
  if (specifier.startsWith('@')) {
    const [scope, packageName] = specifier.split('/');
    return `${scope}/${packageName}`;
  }

  return specifier.split('/')[0];
}

function classifyDependency(name: string): ClassifiedValue {
  if (name === 'react-email' || name === '@react-email/render') {
    return {
      classification: 'wrap',
      reason:
        'React Email runtime/render dependency is retained behind a future PDF adapter boundary.',
    };
  }

  if (
    name === '@floating-ui/react-dom' ||
    name === '@radix-ui/react-popover' ||
    name === '@radix-ui/react-slot'
  ) {
    return {
      classification: 'keep',
      reason:
        'Shared editor UI dependency that remains useful for PDF authoring.',
    };
  }

  if (
    name === 'react' ||
    name === 'react-dom' ||
    name.startsWith('@types/react')
  ) {
    return {
      classification: 'keep',
      reason: 'React runtime/type dependency for the editor surface.',
    };
  }

  if (name.startsWith('@tiptap/')) {
    return {
      classification: 'keep',
      reason: 'TipTap and ProseMirror remain the authoring foundation.',
    };
  }

  if (
    name === 'hast-util-from-html' ||
    name === 'postcss' ||
    name === 'postcss-import'
  ) {
    return {
      classification: 'keep',
      reason:
        'HTML or CSS utility that remains useful for deterministic editor behavior.',
    };
  }

  if (name === 'prismjs' || name === '@types/prismjs') {
    return {
      classification: 'keep',
      reason:
        'Code highlighting dependency retained with current editor behavior.',
    };
  }

  if (
    name === '@testing-library/react' ||
    name === '@vitejs/plugin-react' ||
    name === '@vitest/browser-playwright' ||
    name === 'playwright' ||
    name === 'tsconfig' ||
    name === 'tsdown' ||
    name === 'tsx' ||
    name === 'typescript' ||
    name === 'vitest-browser-react'
  ) {
    return {
      classification: 'keep',
      reason:
        'Build or test tooling required to preserve the upstream baseline.',
    };
  }

  if (name.startsWith('@types/')) {
    return {
      classification: 'keep',
      reason: 'Type dependency for baseline package builds and tests.',
    };
  }

  return {
    classification: 'unknown',
    reason: 'No Phase 2 classification rule matched this dependency.',
  };
}

function classifyWorkspacePackage(
  pathFromRoot: string,
  name: string,
): ClassifiedValue {
  if (pathFromRoot === 'packages/pdf-editor') {
    return {
      classification: 'fork',
      reason:
        'Phase 3 PDF editor boundary that wraps the current editor until PDF-first behavior exists.',
    };
  }

  if (
    pathFromRoot === 'packages/pdf-renderer' ||
    pathFromRoot === 'packages/pdf-template-schema'
  ) {
    return {
      classification: 'keep',
      reason:
        'Phase 3 PDF package boundary retained for future schema and renderer work.',
    };
  }

  if (pathFromRoot === 'packages/docraptor-client') {
    return {
      classification: 'keep',
      reason:
        'Phase 3 server-only DocRaptor package boundary retained for future rendering work.',
    };
  }

  if (pathFromRoot === 'packages/editor') {
    return {
      classification: 'fork',
      reason:
        'Current editor foundation that later phases will fork into PDF package boundaries.',
    };
  }

  if (
    pathFromRoot === 'packages/render' ||
    pathFromRoot === 'packages/react-email'
  ) {
    return {
      classification: 'wrap',
      reason:
        'React Email runtime/render surface required until PDF renderer boundaries exist.',
    };
  }

  if (
    pathFromRoot.startsWith('apps/') ||
    pathFromRoot.startsWith('examples/') ||
    pathFromRoot === 'playground' ||
    name.includes('mailersend') ||
    name.includes('nodemailer') ||
    name.includes('postmark') ||
    name.includes('sendgrid')
  ) {
    return {
      classification: 'replace-later',
      reason:
        'Email-oriented app or example retained until a later phase owns replacements.',
    };
  }

  if (
    pathFromRoot === 'packages/create-email' ||
    pathFromRoot.includes('/template')
  ) {
    return {
      classification: 'replace-later',
      reason:
        'Email starter workflow retained until package-boundary and examples phases.',
    };
  }

  if (pathFromRoot === 'packages/ui') {
    return {
      classification: 'replace-later',
      reason:
        'Upstream preview UI is useful reference but remains email-focused.',
    };
  }

  return {
    classification: 'keep',
    reason:
      'Workspace support package or benchmark retained during Phase 2 inventory.',
  };
}

function classifyImport(filePath: string, specifier: string): ClassifiedValue {
  if (specifier.startsWith('node:')) {
    return {
      classification: 'keep',
      reason: 'Node built-in import used by tooling or tests.',
    };
  }

  if (specifier.startsWith('.')) {
    return {
      classification: 'fork',
      reason:
        'Local editor source edge to preserve now and fork through later package boundaries.',
    };
  }

  const packageName = packageNameFromSpecifier(specifier);
  const dependencyClassification = classifyDependency(packageName);

  if (dependencyClassification.classification !== 'unknown') {
    return dependencyClassification;
  }

  if (filePath.endsWith('.spec.ts') || filePath.endsWith('.spec.tsx')) {
    return {
      classification: 'keep',
      reason: 'Test-only import retained to preserve baseline coverage.',
    };
  }

  return dependencyClassification;
}

function createImportEdge(
  repoRoot: string,
  absoluteFilePath: string,
  specifier: string,
): ImportEdge {
  const file = relativeToRoot(repoRoot, absoluteFilePath);
  const classification = classifyImport(file, specifier);
  const isRelative = specifier.startsWith('.');
  const isCss = specifier.endsWith('.css');
  const isNode = specifier.startsWith('node:');
  const packageName =
    isRelative || isNode ? undefined : packageNameFromSpecifier(specifier);
  const target = isRelative
    ? toPosixPath(
        relative(repoRoot, join(dirname(absoluteFilePath), specifier)),
      )
    : undefined;

  return {
    classification: classification.classification,
    file,
    kind: isCss ? 'css' : isNode ? 'node' : isRelative ? 'relative' : 'package',
    ...(packageName ? { packageName } : {}),
    reason: classification.reason,
    specifier,
    ...(target ? { target } : {}),
  };
}

function extractImportSpecifiers(content: string): string[] {
  const specifiers = new Set<string>();
  const importExportPattern =
    /\b(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;

  for (const match of content.matchAll(importExportPattern)) {
    specifiers.add(match[1]);
  }

  return [...specifiers].sort();
}

function extractCssImports(content: string): string[] {
  const specifiers = new Set<string>();
  const cssImportPattern = /@import\s+['"]([^'"]+)['"]/g;

  for (const match of content.matchAll(cssImportPattern)) {
    specifiers.add(match[1]);
  }

  return [...specifiers].sort();
}

function buildSourceImports(repoRoot: string): ImportEdge[] {
  const editorSourceRoot = join(repoRoot, 'packages', 'editor', 'src');
  const edges: ImportEdge[] = [];

  for (const filePath of listFiles(repoRoot, editorSourceRoot)) {
    if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
      continue;
    }

    const content = readFileSync(filePath, 'utf8');
    for (const specifier of extractImportSpecifiers(content)) {
      edges.push(createImportEdge(repoRoot, filePath, specifier));
    }
  }

  return edges.sort((left, right) =>
    `${left.file}:${left.specifier}`.localeCompare(
      `${right.file}:${right.specifier}`,
    ),
  );
}

function buildStyleImports(repoRoot: string): ImportEdge[] {
  const editorSourceRoot = join(repoRoot, 'packages', 'editor', 'src');
  const edges: ImportEdge[] = [];

  for (const filePath of listFiles(repoRoot, editorSourceRoot)) {
    if (!filePath.endsWith('.css')) {
      continue;
    }

    const content = readFileSync(filePath, 'utf8');
    for (const specifier of extractCssImports(content)) {
      edges.push(createImportEdge(repoRoot, filePath, specifier));
    }
  }

  return edges.sort((left, right) =>
    `${left.file}:${left.specifier}`.localeCompare(
      `${right.file}:${right.specifier}`,
    ),
  );
}

function buildPackageEntries(repoRoot: string): PackageEntry[] {
  const packageFiles = listFiles(repoRoot, repoRoot).filter((filePath) =>
    filePath.endsWith('package.json'),
  );

  return packageFiles
    .map((packageFilePath) => {
      const packageJson = readJsonObject(packageFilePath);
      const packageDirectory = dirname(packageFilePath);
      const pathFromRoot = relativeToRoot(repoRoot, packageDirectory) || '.';
      const nameValue = packageJson.name;
      const versionValue = packageJson.version;
      const privateValue = packageJson.private;
      const name = typeof nameValue === 'string' ? nameValue : pathFromRoot;
      const classification = classifyWorkspacePackage(pathFromRoot, name);

      return {
        classification: classification.classification,
        name,
        path: pathFromRoot,
        private: privateValue === true,
        reason: classification.reason,
        scripts: readScripts(packageJson),
        version: typeof versionValue === 'string' ? versionValue : null,
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path));
}

function buildEditorDependencyEntries(
  editorPackageJson: Record<string, unknown>,
): JsonObject[] {
  const entries: JsonObject[] = [];

  for (const section of editorDependencySections) {
    const dependencies = readStringMap(editorPackageJson, section);
    for (const [name, range] of Object.entries(dependencies).sort(
      ([left], [right]) => left.localeCompare(right),
    )) {
      const classification = classifyDependency(name);
      entries.push({
        classification: classification.classification,
        name,
        range,
        reason: classification.reason,
        section,
      });
    }
  }

  return entries;
}

function buildEditorExports(
  editorPackageJson: Record<string, unknown>,
): JsonObject[] {
  const exportsField = editorPackageJson.exports;

  if (!isRecord(exportsField)) {
    return [];
  }

  return Object.entries(exportsField)
    .map(([subpath, target]) => ({
      kind: subpath.endsWith('.css') ? 'css' : 'javascript',
      subpath,
      target: normalizeJsonValue(target),
    }))
    .sort((left, right) => left.subpath.localeCompare(right.subpath));
}

function buildTestFiles(repoRoot: string): string[] {
  const editorSourceRoot = join(repoRoot, 'packages', 'editor', 'src');

  return listFiles(repoRoot, editorSourceRoot)
    .map((filePath) => relativeToRoot(repoRoot, filePath))
    .filter(
      (filePath) =>
        filePath.includes('.spec.') ||
        filePath.includes('.browser.spec.') ||
        filePath.includes('__snapshots__') ||
        filePath.includes('__tests__/'),
    )
    .sort();
}

function buildRepoReferences(repoRoot: string): JsonObject[] {
  const rootsToScan = ['apps', 'docs', 'examples', 'packages', 'scripts'];
  const references: JsonObject[] = [];

  for (const rootName of rootsToScan) {
    for (const filePath of listFiles(repoRoot, join(repoRoot, rootName))) {
      if (!hasSupportedSourceExtension(filePath)) {
        continue;
      }

      const pathFromRoot = relativeToRoot(repoRoot, filePath);
      if (pathFromRoot === 'docs/dep-map.json') {
        continue;
      }

      const content = readFileSync(filePath, 'utf8');
      const matchedPatterns = referencePatterns.filter((pattern) =>
        content.includes(pattern),
      );

      if (matchedPatterns.length === 0) {
        continue;
      }

      references.push({
        path: pathFromRoot,
        patterns: matchedPatterns.sort(),
      });
    }
  }

  return references.sort((left, right) =>
    String(left.path).localeCompare(String(right.path)),
  );
}

function buildClassificationSummary(
  dependencies: JsonObject[],
  imports: ImportEdge[],
  packages: PackageEntry[],
): JsonObject {
  const summary: Record<Classification, Set<string>> = {
    fork: new Set(),
    keep: new Set(),
    'remove-later': new Set(),
    'replace-later': new Set(),
    unknown: new Set(),
    wrap: new Set(),
  };

  for (const dependency of dependencies) {
    const classification = dependency.classification;
    const name = dependency.name;
    if (typeof classification === 'string' && typeof name === 'string') {
      summary[classification as Classification].add(name);
    }
  }

  for (const importEdge of imports) {
    const label =
      importEdge.packageName ?? importEdge.target ?? importEdge.specifier;
    summary[importEdge.classification].add(label);
  }

  for (const packageEntry of packages) {
    summary[packageEntry.classification].add(packageEntry.path);
  }

  return Object.fromEntries(
    Object.entries(summary).map(([classification, values]) => [
      classification,
      [...values].sort(),
    ]),
  );
}

function readTurboTasks(repoRoot: string): string[] {
  const turboJson = readJsonObject(join(repoRoot, 'turbo.json'));
  const tasks = turboJson.tasks;

  if (!isRecord(tasks)) {
    return [];
  }

  return Object.keys(tasks).sort();
}

function normalizeJsonValue(value: unknown): JsonValue {
  if (
    value === null ||
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string'
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => normalizeJsonValue(entry));
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, entry]) => [key, normalizeJsonValue(entry)] as const)
        .sort(([left], [right]) => left.localeCompare(right)),
    );
  }

  return null;
}

function buildDepMap(repoRoot: string): JsonObject {
  const rootPackageJson = readJsonObject(join(repoRoot, 'package.json'));
  const editorPackagePath = join(
    repoRoot,
    'packages',
    'editor',
    'package.json',
  );
  const editorPackageJson = readJsonObject(editorPackagePath);
  const editorDependencies = buildEditorDependencyEntries(editorPackageJson);
  const sourceImports = buildSourceImports(repoRoot);
  const styleImports = buildStyleImports(repoRoot);
  const packageEntries = buildPackageEntries(repoRoot);
  const packageManagerValue = rootPackageJson.packageManager;
  const editorNameValue = editorPackageJson.name;
  const editorVersionValue = editorPackageJson.version;

  return {
    editor: {
      dependencies: editorDependencies,
      exports: buildEditorExports(editorPackageJson),
      package: {
        engines: normalizeJsonValue(editorPackageJson.engines),
        name: typeof editorNameValue === 'string' ? editorNameValue : null,
        path: 'packages/editor/package.json',
        scripts: readScripts(editorPackageJson),
        version:
          typeof editorVersionValue === 'string' ? editorVersionValue : null,
      },
      publicExportSubpaths,
      references: buildRepoReferences(repoRoot),
      sourceImports,
      styleImports,
      testFiles: buildTestFiles(repoRoot),
    },
    generatedBy: 'scripts/asym-editor-dep-map.ts',
    schemaVersion: 1,
    summary: buildClassificationSummary(
      editorDependencies,
      [...sourceImports, ...styleImports],
      packageEntries,
    ),
    tooling: {
      turboTasks: readTurboTasks(repoRoot),
    },
    workspace: {
      packageManager:
        typeof packageManagerValue === 'string' ? packageManagerValue : null,
      packages: packageEntries,
      workspaceGlobs: readWorkspaceGlobs(repoRoot),
    },
  };
}

function stableStringify(value: JsonValue): string {
  return `${JSON.stringify(normalizeJsonValue(value), null, 2)}\n`;
}

const repoRoot = process.cwd();
const outputPath = join(repoRoot, 'docs', 'dep-map.json');
const depMap = buildDepMap(repoRoot);
const output = stableStringify(depMap);
const shouldCheck = process.argv.includes('--check');
const shouldWrite = process.argv.includes('--write') || !shouldCheck;

if (shouldCheck) {
  const existingOutput = existsSync(outputPath)
    ? readFileSync(outputPath, 'utf8')
    : '';

  if (existingOutput !== output) {
    console.error('docs/dep-map.json is stale. Run pnpm asym:dep-map.');
    process.exitCode = 1;
  } else {
    console.log('docs/dep-map.json is current.');
  }
}

if (shouldWrite) {
  writeFileSync(outputPath, output, 'utf8');
  console.log('wrote docs/dep-map.json');
}
