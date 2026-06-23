import { createJiti } from 'jiti';
import { getEmailConfig } from './get-email-config';

vi.mock('jiti', () => ({
  createJiti: vi.fn(),
}));

describe('getEmailConfig()', () => {
  const mockedCreateJiti = vi.mocked(createJiti);

  beforeEach(() => {
    mockedCreateJiti.mockReset();
  });

  it('returns an empty config when no path is provided', async () => {
    await expect(getEmailConfig()).resolves.toEqual({});
    expect(mockedCreateJiti).not.toHaveBeenCalled();
  });

  it('loads a config object from disk', async () => {
    const importMock = vi.fn().mockResolvedValue({
      esbuild: {
        plugins: [{ name: 'test-plugin', setup: vi.fn() }],
      },
    });
    mockedCreateJiti.mockReturnValue({
      import: importMock,
    } as unknown as ReturnType<typeof createJiti>);

    const config = await getEmailConfig('/tmp/email.config.ts');

    expect(config).toMatchObject({
      esbuild: {
        plugins: [{ name: 'test-plugin' }],
      },
    });

    expect(mockedCreateJiti).toHaveBeenCalledWith('/tmp/email.config.ts');
    expect(importMock).toHaveBeenCalledWith('/tmp/email.config.ts', {
      default: true,
    });
  });

  it('rejects configs that do not export an object', async () => {
    mockedCreateJiti.mockReturnValue({
      import: vi.fn().mockResolvedValue(null),
    } as unknown as ReturnType<typeof createJiti>);

    await expect(getEmailConfig('/tmp/email.config.ts')).rejects.toThrow(
      'Expected React Email config at /tmp/email.config.ts to export an object.',
    );
  });

  it('rejects configs with a non-array esbuild.plugins value', async () => {
    mockedCreateJiti.mockReturnValue({
      import: vi.fn().mockResolvedValue({
        esbuild: {
          plugins: {},
        },
      }),
    } as unknown as ReturnType<typeof createJiti>);

    await expect(getEmailConfig('/tmp/email.config.ts')).rejects.toThrow(
      'Expected "esbuild.plugins" in React Email config at /tmp/email.config.ts to be an array.',
    );
  });
});
