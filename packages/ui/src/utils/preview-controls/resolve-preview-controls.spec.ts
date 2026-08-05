import { resolvePreviewControls } from './resolve-preview-controls';

describe('resolvePreviewControls()', () => {
  it('returns no controls for empty props and no declaration', () => {
    expect(resolvePreviewControls({}, undefined)).toEqual([]);
  });

  it('infers controls from prop values when nothing is declared', () => {
    expect(
      resolvePreviewControls(
        {
          userName: 'alan',
          isVip: false,
          itemCount: 3,
          items: [1, 2],
          user: null,
          ratio: Number.POSITIVE_INFINITY,
        },
        undefined,
      ),
    ).toEqual([
      { key: 'userName', label: 'User Name', type: 'text' },
      { key: 'isVip', label: 'Is Vip', type: 'boolean' },
      { key: 'itemCount', label: 'Item Count', type: 'number' },
      { key: 'items', label: 'Items', type: 'json' },
      { key: 'user', label: 'User', type: 'json' },
      { key: 'ratio', label: 'Ratio', type: 'json' },
    ]);
  });

  it('puts declared controls first, in declaration order', () => {
    const controls = resolvePreviewControls(
      { userName: 'alan', plan: 'pro', isVip: true },
      {
        plan: { type: 'select', options: ['hobby', 'pro'] },
        userName: { type: 'text' },
      },
    );

    expect(controls.map((control) => control.key)).toEqual([
      'plan',
      'userName',
      'isVip',
    ]);
  });

  it('keeps declared fields like options and number bounds', () => {
    expect(
      resolvePreviewControls(
        { teamSize: 3 },
        { teamSize: { type: 'number', min: 1, max: 500, step: 1 } },
      ),
    ).toEqual([
      {
        key: 'teamSize',
        label: 'Team Size',
        type: 'number',
        min: 1,
        max: 500,
        step: 1,
      },
    ]);
  });

  it('prefers a declared label and humanizes the key otherwise', () => {
    expect(
      resolvePreviewControls(
        { userName: 'alan', inviterName: 'ada' },
        { userName: { type: 'text', label: 'Customer' } },
      ),
    ).toEqual([
      { key: 'userName', label: 'Customer', type: 'text' },
      { key: 'inviterName', label: 'Inviter Name', type: 'text' },
    ]);
  });

  it('resolves declared controls even when the prop has no value', () => {
    expect(resolvePreviewControls({}, { promoCode: { type: 'text' } })).toEqual(
      [{ key: 'promoCode', label: 'Promo Code', type: 'text' }],
    );
  });

  it('lets a declaration override what a value would have inferred', () => {
    expect(
      resolvePreviewControls(
        { plan: 'pro' },
        { plan: { type: 'select', options: ['hobby', 'pro'] } },
      ),
    ).toEqual([
      { key: 'plan', label: 'Plan', type: 'select', options: ['hobby', 'pro'] },
    ]);
  });
});
