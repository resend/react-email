import { describe, expect, it, vi } from 'vitest';

describe('Phase 11 DocRaptor browser runtime guard', () => {
  it('rejects browser-like runtime imports', async () => {
    vi.resetModules();

    const previousWindow = Reflect.get(globalThis, 'window');
    const previousDocument = Reflect.get(globalThis, 'document');

    try {
      Reflect.set(globalThis, 'window', {});
      Reflect.set(globalThis, 'document', {});

      const modulePath = '../src/index.ts';

      await expect(import(modulePath)).rejects.toThrow(
        '@asym/docraptor-client is server-only',
      );
    } finally {
      if (previousWindow === undefined) {
        Reflect.deleteProperty(globalThis, 'window');
      } else {
        Reflect.set(globalThis, 'window', previousWindow);
      }

      if (previousDocument === undefined) {
        Reflect.deleteProperty(globalThis, 'document');
      } else {
        Reflect.set(globalThis, 'document', previousDocument);
      }

      vi.resetModules();
    }
  });

  it('rejects browser-like runtime client creation', async () => {
    vi.resetModules();

    const modulePath = '../src/index.ts';
    const { createDocRaptorClient } = await import(modulePath);
    const previousWindow = Reflect.get(globalThis, 'window');
    const previousDocument = Reflect.get(globalThis, 'document');

    try {
      Reflect.set(globalThis, 'window', {});
      Reflect.set(globalThis, 'document', {});

      expect(() => createDocRaptorClient({ apiKey: 'test-key' })).toThrow(
        '@asym/docraptor-client is server-only',
      );
    } finally {
      if (previousWindow === undefined) {
        Reflect.deleteProperty(globalThis, 'window');
      } else {
        Reflect.set(globalThis, 'window', previousWindow);
      }

      if (previousDocument === undefined) {
        Reflect.deleteProperty(globalThis, 'document');
      } else {
        Reflect.set(globalThis, 'document', previousDocument);
      }

      vi.resetModules();
    }
  });
});
