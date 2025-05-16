import child_process from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const previewServerRoot = path.resolve(dirname, '..');
const emailsDirectoryPath = path.join(previewServerRoot, 'emails');

await fs.writeFile(
  path.join(previewServerRoot, '.env.local'),
  `EMAILS_DIR_RELATIVE_PATH=./emails
EMAILS_DIR_ABSOLUTE_PATH=${emailsDirectoryPath}
USER_PROJECT_LOCATION=${previewServerRoot}
NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT=true`,
  'utf8',
);

const emptyEmail = `import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

interface EmptyEmailProps {
  username: string;
}

export default function EmptyEmail({ username }: EmptyEmailProps) {
  return <Html>
    <Head/>
    <Tailwind>
      <Body>
        <Preview>Empty email for testing the preview server's UI</Preview>
        <Container className="bg-[#eaeaea]">
          <Text>Hello, {username}</Text>
          <Heading className="text-[36px]">
            This is an empty email meant for testing the preview server's UI.
          </Heading>
        </Container>
      </Body>
    </Tailwind>
  </Html>;
}

EmptyEmail.PreviewProps = {
  username: 'developer'
} satisfies EmptyEmailProps;

`;

const directoryCount = 15;
const emailsPerDirectoryCount = 10;
if (existsSync(emailsDirectoryPath)) {
  await fs.rm(emailsDirectoryPath, {
    recursive: true,
  });
}
await fs.mkdir(emailsDirectoryPath);
for (let i = 0; i < directoryCount; i++) {
  const directoryPath = path.join(emailsDirectoryPath, `directory-${i}`);
  await fs.mkdir(directoryPath);
  for (let j = 0; j < emailsPerDirectoryCount; j++) {
    await fs.writeFile(
      path.join(directoryPath, `file-${i}-${j}.tsx`),
      emptyEmail,
      'utf8',
    );
  }
}

const webServerProcess = child_process.spawn('next', ['dev'], {
  cwd: previewServerRoot,
  shell: true,
  stdio: 'inherit',
});

webServerProcess.on('exit', async () => {
  await fs.rm(path.join(previewServerRoot, '.env.local'));
});

process.on('SIGINT', () => {
  webServerProcess.kill('SIGINT');
});
process.on('SIGUSR1', () => {
  webServerProcess.kill('SIGUSR1');
});
process.on('SIGUSR2', () => {
  webServerProcess.kill('SIGUSR2');
});
process.on('uncaughtExceptionMonitor', () => {
  webServerProcess.kill();
});
process.on('exit', () => {
  webServerProcess.kill();
});
