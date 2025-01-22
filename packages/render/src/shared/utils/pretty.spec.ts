import { pretty } from './pretty';

describe('pretty', () => {
  test('if mso syntax does not wrap', async () => {
    expect(
      await pretty(
        `<!--[if mso]><i style="mso-font-width:100%;mso-text-raise:12" hidden>&#8202;&#8202;</i><![endif]-->`,
      ),
    ).toMatchSnapshot();
  });
});
