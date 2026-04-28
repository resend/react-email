import { promises as fs } from 'node:fs';
import path from 'node:path';

export async function getExampleSource(slug: string) {
  const filePath = path.join(
    process.cwd(),
    `src/app/editor/${slug}/example.tsx`,
  );
  return fs.readFile(filePath, 'utf8');
}

export function getExampleGitHubUrl(slug: string) {
  return `https://github.com/resend/react-email/tree/canary/apps/web/src/app/editor/${slug}/example.tsx`;
}
