import { validatePreviewControlsDeclaration } from './declared-preview-controls';

describe('validatePreviewControlsDeclaration()', () => {
  it('accepts a missing declaration', () => {
    expect(validatePreviewControlsDeclaration(undefined)).toEqual({
      value: undefined,
    });
  });

  it('accepts a declaration using every control type', () => {
    const declaration = {
      username: { type: 'text', label: 'Username' },
      teamSize: { type: 'number', min: 1, max: 500, step: 1 },
      isTrial: { type: 'boolean' },
      plan: { type: 'select', options: ['hobby', 'pro', 'enterprise'] },
      metadata: { type: 'json' },
    };

    expect(validatePreviewControlsDeclaration(declaration)).toEqual({
      value: declaration,
    });
  });

  it('rejects unknown control types', () => {
    expect(
      validatePreviewControlsDeclaration({
        username: { type: 'color' },
      }),
    ).toHaveProperty('error');
  });

  it('rejects typo`d fields instead of silently ignoring them', () => {
    expect(
      validatePreviewControlsDeclaration({
        username: { type: 'text', lable: 'Username' },
      }),
    ).toHaveProperty('error');
  });

  it('rejects a select without options', () => {
    expect(
      validatePreviewControlsDeclaration({
        plan: { type: 'select', options: [] },
      }),
    ).toHaveProperty('error');
  });

  it('rejects non-object declarations', () => {
    expect(validatePreviewControlsDeclaration('text')).toHaveProperty('error');
    expect(validatePreviewControlsDeclaration(null)).toHaveProperty('error');
    expect(validatePreviewControlsDeclaration(['text'])).toHaveProperty(
      'error',
    );
  });
});
