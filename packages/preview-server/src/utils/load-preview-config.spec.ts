import path from 'node:path';
import {
  loadReactEmailConfig,
  resolvePreviewEmailsDir,
} from './load-preview-config';

const fixturesRoot = path.resolve(
  __dirname,
  '../../../react-email/src/utils/__fixtures__',
);

describe('loadReactEmailConfig (preview-server)', () => {
  it('returns undefined when no config file exists', async () => {
    const dir = path.join(fixturesRoot, 'no-config');
    expect(await loadReactEmailConfig(dir)).toBeUndefined();
  });

  it('reads react-email.config.json', async () => {
    const dir = path.join(fixturesRoot, 'config-json');
    expect(await loadReactEmailConfig(dir)).toEqual({
      emailsDir: './src/emails',
      preview: { port: 4000 },
    });
  });
});

describe('resolvePreviewEmailsDir', () => {
  it('returns undefined when no config file exists', async () => {
    const dir = path.join(fixturesRoot, 'no-config');
    expect(await resolvePreviewEmailsDir(dir)).toBeUndefined();
  });

  it('resolves emailsDir from top-level field', async () => {
    const dir = path.join(fixturesRoot, 'config-resolve-top');
    expect(await resolvePreviewEmailsDir(dir)).toBe(
      path.resolve(dir, './my-emails'),
    );
  });

  it('prefers preview.emailsDir over top-level emailsDir', async () => {
    const dir = path.join(fixturesRoot, 'config-resolve-preview');
    expect(await resolvePreviewEmailsDir(dir)).toBe(
      path.resolve(dir, './preview-only-emails'),
    );
  });

  it('falls back to top-level emailsDir when preview.emailsDir is absent', async () => {
    const dir = path.join(fixturesRoot, 'config-resolve-fallback');
    expect(await resolvePreviewEmailsDir(dir)).toBe(
      path.resolve(dir, './fallback-emails'),
    );
  });
});
