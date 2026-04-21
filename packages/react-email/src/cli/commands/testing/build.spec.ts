import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getPackages } from '@manypkg/get-packages';
import { detectPackageManager, installDependencies, runScript } from 'nypm';
import * as getUiLocationModule from '../../utils/get-ui-location.js';
import * as registerSpinnerAutostoppingModule from '../../utils/register-spinner-autostopping.js';
import { build } from '../build.js';

vi.mock('@manypkg/get-packages', () => ({
  getPackages: vi.fn(),
}));

vi.mock('log-symbols', () => ({
  default: {
    success: 'success',
  },
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start() {
      return this;
    },
    stopAndPersist() {},
    text: '',
  })),
}));

vi.mock('nypm', () => ({
  detectPackageManager: vi.fn(),
  installDependencies: vi.fn(),
  runScript: vi.fn(),
}));

const mockedDetectPackageManager = vi.mocked(detectPackageManager);
const mockedGetPackages = vi.mocked(getPackages);
const mockedGetUiLocation = vi.spyOn(
  getUiLocationModule,
  'getUiLocation',
);
const mockedInstallDependencies = vi.mocked(installDependencies);
const mockedRunScript = vi.mocked(runScript);
const mockedRegisterSpinnerAutostopping = vi.spyOn(
  registerSpinnerAutostoppingModule,
  'registerSpinnerAutostopping',
);

const createFixture = async () => {
  const root = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'react-email-build-'),
  );
  const emailsDir = path.join(root, 'emails');
  const previewDir = path.join(root, 'preview');

  await fs.promises.mkdir(path.join(emailsDir, 'static'), {
    recursive: true,
  });
  await fs.promises.writeFile(
    path.join(emailsDir, 'welcome.tsx'),
    `export default function Welcome() {
  return null;
}
`,
    'utf8',
  );

  await fs.promises.mkdir(path.join(previewDir, 'src/app/preview/[...slug]'), {
    recursive: true,
  });
  await fs.promises.writeFile(
    path.join(previewDir, 'package.json'),
    JSON.stringify({
      name: 'ui',
      scripts: {
        build: 'next build',
        start: 'next start',
        postbuild: 'echo postbuild',
      },
      dependencies: {},
      devDependencies: {},
    }),
    'utf8',
  );
  await fs.promises.writeFile(
    path.join(previewDir, 'src/app/layout.tsx'),
    `export const dynamic = 'force-dynamic';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
`,
    'utf8',
  );
  await fs.promises.writeFile(
    path.join(previewDir, 'src/app/preview/[...slug]/page.tsx'),
    `export const dynamic = 'force-dynamic';

export default function Page() {
  return null;
}
`,
    'utf8',
  );

  return { root, emailsDir, previewDir };
};

describe('build()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('auto-detects the package manager when none is provided', async () => {
    const fixture = await createFixture();
    const previousCwd = process.cwd();

    try {
      process.chdir(fixture.root);
      const projectLocation = process.cwd();

      mockedGetPackages.mockResolvedValue({
        rootDir: projectLocation,
      } as never);
      mockedGetUiLocation.mockResolvedValue(fixture.previewDir);
      mockedDetectPackageManager.mockResolvedValue({
        name: 'pnpm',
        command: 'pnpm',
      } as never);

      await build({ dir: 'emails' });

      expect(mockedDetectPackageManager).toHaveBeenCalledWith(projectLocation);
      expect(mockedRunScript).toHaveBeenCalledWith('build', {
        cwd: path.join(projectLocation, '.react-email'),
        packageManager: {
          name: 'pnpm',
          command: 'pnpm',
        },
      });
      expect(mockedInstallDependencies).not.toHaveBeenCalled();
      expect(mockedRegisterSpinnerAutostopping).toHaveBeenCalled();
    } finally {
      process.chdir(previousCwd);
      await fs.promises.rm(fixture.root, { recursive: true, force: true });
    }
  });

  it('uses the explicit package manager when provided', async () => {
    const fixture = await createFixture();
    const previousCwd = process.cwd();

    try {
      process.chdir(fixture.root);
      const projectLocation = process.cwd();

      mockedGetPackages.mockResolvedValue({
        rootDir: projectLocation,
      } as never);
      mockedGetUiLocation.mockResolvedValue(fixture.previewDir);

      await build({ dir: 'emails', packageManager: 'yarn' });

      expect(mockedDetectPackageManager).not.toHaveBeenCalled();
      expect(mockedRunScript).toHaveBeenCalledWith('build', {
        cwd: path.join(projectLocation, '.react-email'),
        packageManager: 'yarn',
      });
      expect(mockedInstallDependencies).not.toHaveBeenCalled();
      expect(mockedRegisterSpinnerAutostopping).toHaveBeenCalled();
    } finally {
      process.chdir(previousCwd);
      await fs.promises.rm(fixture.root, { recursive: true, force: true });
    }
  });
});
