import type { ComposePdfDocumentHtmlResult } from '@asym/pdf-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';

const serializedDocument: ComposePdfDocumentHtmlResult = {
  html: '<p>Phase 10 body.</p>',
  cssRequirements: [],
  warnings: [],
  assets: [],
  variables: [],
};

describe('Phase 10 print shell invariants', () => {
  afterEach(() => {
    vi.doUnmock('@asym/pdf-template-schema');
    vi.resetModules();
  });

  it('throws if custom page settings pass validation without a custom size', async () => {
    vi.resetModules();
    vi.doMock('@asym/pdf-template-schema', () => ({
      DocumentPageSettingsSchema: {
        safeParse: (settings: unknown) => ({
          success: true,
          data: settings,
        }),
      },
    }));

    const { composePrintDocumentHtml } = await import('@asym/pdf-renderer');

    expect(() =>
      composePrintDocumentHtml({
        title: 'Broken Custom Page',
        document: serializedDocument,
        pageSettings: {
          pageSize: 'custom',
          orientation: 'portrait',
          margins: {
            top: '0.5in',
            right: '0.5in',
            bottom: '0.5in',
            left: '0.5in',
          },
        },
      }),
    ).toThrow(
      'Invariant violation: customSize is required when pageSize is "custom".',
    );
  });
});
