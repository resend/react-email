import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { styleText } from 'node:util';

const firstRunFilepath = path.join(tmpdir(), 'react-email-first-run-date');

async function showDataCollectionWarning() {
  if (!fs.existsSync(firstRunFilepath)) {
    console.log('');
    console.log(
      `${styleText(
        'yellowBright',
        'Attention',
      )}: React Email collects completely anonymous usage data.`,
    );
    console.log(
      'This usage data is strictly used by us to decide the future roadmap and priorities for the project.',
    );
    console.log('');

    try {
      await fs.promises.writeFile(firstRunFilepath, new Date().toISOString());
    } catch (_error) {
      // Silently fail if we can't write the flag file
      // This ensures the CLI continues to work even if there are permission issues
    }
  }
}

export async function getEnvironmentData(
  userProjectPath: string,
  emailsDirectoryRelativePath: string,
) {
  const nodeVersion = process.versions.node;

  const packageJson: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  } = JSON.parse(
    await fs.promises.readFile(
      path.resolve(userProjectPath, 'package.json'),
      'utf8',
    ),
  );

  const reactVersion =
    packageJson.dependencies.react ?? packageJson.devDependencies.react;

  const emailsDirectoryPath = path.resolve(
    userProjectPath,
    path.normalize(emailsDirectoryRelativePath),
  );

  const filenames = await fs.promises.readdir(emailsDirectoryPath, {
    recursive: true,
  });
  const emailFilenames = filenames.filter(
    (file) =>
      file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.js'),
  );

  let usesTailwind = false;
  const tailwindImportRegex =
    // Checks for the import of the `Tailwind` component from `@react-email/components` or `@react-email/tailwind`, but it might fail in some very specific edge cases
    /import\s*{[^}]*?Tailwind[^}]*}\s*from\s*('|")(@react-email\/components|@react-email\/tailwind)\1/g;

  for (const filename of emailFilenames) {
    const fileContent = await fs.promises.readFile(
      path.resolve(emailsDirectoryPath, filename),
      'utf8',
    );
    if (tailwindImportRegex.test(fileContent)) {
      usesTailwind = true;
      break;
    }
  }
  return {
    nodeVersion,
    reactVersion: reactVersion ?? 'unknown',
    templatesCount: emailFilenames.length,
    usesTailwind,
  };
}

export function collectUsageData(emailsDirectoryRelativePath: string) {
  showDataCollectionWarning();

  getEnvironmentData(process.cwd(), emailsDirectoryRelativePath)
    .then((data) => {
      fetch('http://localhost:3001/api/metrics/environment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    })
    .catch(() => {
      // No-op: metric collection should not affect user experience
    });
}
