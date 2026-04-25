import {
  legacyEditorCssExportSubpaths,
  legacyEditorPackageExportSubpaths,
  legacyReactEmailEditorBoundary,
} from './index';

describe('legacy React Email editor boundary', () => {
  it('records the current package subpaths without adding public exports', () => {
    expect(legacyReactEmailEditorBoundary.packageName).toBe(
      '@react-email/editor',
    );
    expect(legacyReactEmailEditorBoundary.maturity).toBe(
      'phase-4-internal-boundary',
    );
    expect(legacyReactEmailEditorBoundary.publicExportSubpaths).toEqual([
      '.',
      './core',
      './extensions',
      './plugins',
      './ui',
      './utils',
    ]);
    expect(legacyEditorPackageExportSubpaths).toBe(
      legacyReactEmailEditorBoundary.publicExportSubpaths,
    );
  });

  it('records the current CSS and theme package surfaces', () => {
    expect(legacyEditorCssExportSubpaths).toEqual([
      './styles/bubble-menu.css',
      './styles/button-bubble-menu.css',
      './styles/image-bubble-menu.css',
      './styles/inspector.css',
      './styles/link-bubble-menu.css',
      './styles/slash-command.css',
      './themes/default.css',
    ]);
    expect(legacyReactEmailEditorBoundary.cssExportSubpaths).toBe(
      legacyEditorCssExportSubpaths,
    );
  });

  it('resolves selected legacy editor references used by future wrappers', () => {
    const { references } = legacyReactEmailEditorBoundary;

    expect(references.root.EmailEditor).toBeDefined();
    expect(references.core.EmailMark).toBeDefined();
    expect(references.core.EmailNode).toBeDefined();
    expect(references.core.composeReactEmail).toBeDefined();
    expect(references.core.editorEventBus).toBeDefined();
    expect(references.core.isDocumentVisuallyEmpty).toBeDefined();
    expect(references.extensions.StarterKit).toBeDefined();
    expect(references.plugins.EmailTheming).toBeDefined();
    expect(references.plugins.useEditorImage).toBeDefined();
    expect(references.ui.BubbleMenu).toBeDefined();
    expect(references.ui.Inspector).toBeDefined();
    expect(references.ui.SlashCommand).toBeDefined();
    expect(references.utils.setTextAlignment).toBeDefined();
  });
});
