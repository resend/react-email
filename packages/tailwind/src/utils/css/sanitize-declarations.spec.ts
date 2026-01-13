import { generate, parse } from 'css-tree';
import { sanitizeDeclarations } from './sanitize-declarations';

describe('sanitizeDeclarations', () => {
  it('converts border-radius:calc(Infinity * 1px) to border-radius:9999px', () => {
    let root = parse(`.rounded-full {
  border-radius: calc(Infinity * 1px);
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toBe('.rounded-full{border-radius:9999px}');

    root = parse(`.rounded-full {
  border-radius: calc(infinity * 1px);
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toBe('.rounded-full{border-radius:9999px}');

    root = parse(`.rounded-full {
  border-radius: calc(infinity*1px);
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toBe('.rounded-full{border-radius:9999px}');

    root = parse(`.rounded-full {
  border-radius: calc(Infinity*1px);
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toBe('.rounded-full{border-radius:9999px}');
  });

  it('separates padding-block and padding-inline', () => {
    let root = parse(`.box {
  padding-inline: 4px 14;
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toMatchInlineSnapshot(`".box{padding-right:14;padding-left:4px}"`);

    root = parse(`.box {
  padding-block: 10px 20%;
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toMatchInlineSnapshot(`".box{padding-bottom:20%;padding-top:10px}"`);

    root = parse(`.box {
  padding-inline: 99rem;
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toMatchInlineSnapshot(`".box{padding-right:99rem;padding-left:99rem}"`);

    root = parse(`.box {
  padding-block: 8px;
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toMatchInlineSnapshot(`".box{padding-bottom:8px;padding-top:8px}"`);
  });

  it('should do separation of margin-block and margin-inline', () => {
    let root = parse(`.box {
  margin-inline: 4px 14;
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toMatchInlineSnapshot(`".box{margin-right:14;margin-left:4px}"`);

    root = parse(`.box {
  margin-block: 10px 20%;
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toMatchInlineSnapshot(`".box{margin-bottom:20%;margin-top:10px}"`);

    root = parse(`.box {
  margin-inline: 99rem;
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toMatchInlineSnapshot(`".box{margin-right:99rem;margin-left:99rem}"`);

    root = parse(`.box {
  margin-block: 8px;
}
`);
    sanitizeDeclarations(root);
    expect(generate(root)).toMatchInlineSnapshot(`".box{margin-bottom:8px;margin-top:8px}"`);
  });

  test('oklch to rgb conversion', () => {
    let stylesheet = parse('div { color: oklch(90.5% 0.2 180); }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      'conversion without alpha',
    ).toMatchInlineSnapshot(`"div{color:rgb(0,255,229)}"`);

    stylesheet = parse('div { color: oklch(96.6% 0.147 107 / 80%); }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      'conversion with alpha',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,251,126,0.8)}"`);

    stylesheet = parse('div { color: oklch(96.6% 0.147 107deg / 80%); }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      'conversion with deg unit',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,251,126,0.8)}"`);

    stylesheet = parse('div { color: oklch(92.6% 0.0546 218 / 50%); }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(191,240,255,0.5)}"`);

    stylesheet = parse('div { color: oklch(88.3% 0.102 329); }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,193,250)}"`);

    stylesheet = parse('div { color: oklch(69.3% 0.206 42.8); }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,100,0)}"`);
  });

  test('rgba space syntax to comma syntax conversion', () => {
    let stylesheet = parse('div { color: rgb(255 0 128); }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      'conversion with space syntax and no alpha',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,128)}"`);

    stylesheet = parse('div { color: rgb(255 0 128 / 0.5); }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      'conversion with space syntax and alpha',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,128,0.5)}"`);

    stylesheet = parse('div { color: rgb(100% 0% 50% / 50%); }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      'conversion with percentage values',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,128,0.5)}"`);

    stylesheet = parse('div { color: rgb(255 0 128 / 50%); }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      'conversion with space syntax and alpha with a percetange syntax',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,128,0.5)}"`);

    stylesheet = parse('div { color: rgb(255 0 128 / 1); }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,0,128)}"`);

    stylesheet = parse(
      'div { background: linear-gradient(rgb(255 0 0), rgb(0 255 0 / 0.8)); }',
    );
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{background:linear-gradient(rgb(255,0,0),rgb(0,255,0,0.8))}"`);

    stylesheet = parse('div { color: rgb(  255   0   128  /  0.7  ); }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,0,128,0.7)}"`);

    stylesheet = parse('div { color: rgb(0 0 0); }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(0,0,0)}"`);

    stylesheet = parse('div { color: rgb(255, 0, 128); }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      'treatment for already supported rgb syntax',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,128)}"`);
  });

  test('hex to rgb conversion', () => {
    let stylesheet = parse('div { color: #f0a; }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      '3-digit hex without alpha',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,170)}"`);

    stylesheet = parse('div { color: #f0a8; }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      '4-digit hex with alpha',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,170,0.5333333333333333)}"`);

    stylesheet = parse('div { color: #ff00aa; }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      '6-digit hex without alpha',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,170)}"`);

    stylesheet = parse('div { color: #ff00aa80; }');
    sanitizeDeclarations(stylesheet);
    expect(
      generate(stylesheet),
      '8-digit hex with alpha',
    ).toMatchInlineSnapshot(`"div{color:rgb(255,0,170,0.5019607843137255)}"`);

    stylesheet = parse('div { color: #000; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(0,0,0)}"`);

    stylesheet = parse('div { color: #fff; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,255,255)}"`);

    stylesheet = parse('div { color: #ff0000; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,0,0)}"`);

    stylesheet = parse('div { color: #00ff00; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(0,255,0)}"`);

    stylesheet = parse('div { color: #0000ff; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(0,0,255)}"`);

    stylesheet = parse('div { color: #abcdef; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(171,205,239)}"`);

    stylesheet = parse('div { color: #ABCDEF; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(171,205,239)}"`);

    stylesheet = parse('div { color: #AbCdEf; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet), 'mixed casing').toMatchInlineSnapshot(`"div{color:rgb(171,205,239)}"`);

    stylesheet = parse('div { color: #ff000000; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,0,0,0)}"`);

    stylesheet = parse('div { color: #ff0000ff; }');
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,0,0)}"`);

    stylesheet = parse(
      'div { background: linear-gradient(#ff0000, #00ff00, #0000ff); }',
    );
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{background:linear-gradient(rgb(255,0,0),rgb(0,255,0),rgb(0,0,255))}"`);

    stylesheet = parse(
      'div { background: linear-gradient(#ff0000, rgb(0 255 0), oklch(50% 0.2 240)); }',
    );
    sanitizeDeclarations(stylesheet);
    const result = generate(stylesheet);
    expect(result).toMatchInlineSnapshot(`"div{background:linear-gradient(rgb(255,0,0),rgb(0,255,0),rgb(0,105,199))}"`);

    stylesheet = parse(
      'div { content: "Visit our site at example.com#section"; }',
    );
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{content:"Visit our site at example.com#section"}"`);

    stylesheet = parse(`
      div {
        color: #ff0000;
        background-color: #00ff00;
        border-color: #0000ff;
        box-shadow: 0 0 10px #333;
      }
    `);
    sanitizeDeclarations(stylesheet);
    expect(generate(stylesheet)).toMatchInlineSnapshot(`"div{color:rgb(255,0,0);background-color:rgb(0,255,0);border-color:rgb(0,0,255);box-shadow:0 0 10px rgb(51,51,51)}"`);
  });

  it('handles transparency generated with color-mix', () => {
    const stylesheet = parse(`
     .bg-blue-600/50 {
        background-color: color-mix(in oklab, oklch(54.6% 0.245 262.881) 60%, transparent);
      }
    `);
    sanitizeDeclarations(stylesheet);
    const result = generate(stylesheet);
    expect(result).toMatchInlineSnapshot(`".bg-blue-600/50{background-color:rgb(21,93,252,60%)}"`);
  });

  describe('complex scenarios', () => {
    it('handles multiple declarations with different rgb formats', () => {
      const stylesheet = parse(`
        div {
          color: rgb(255 0 128 / 0.5);
          background-color: rgb(0 255 0);
          border-color: rgb(128, 128, 128);
        }
      `);
      sanitizeDeclarations(stylesheet);
      const result = generate(stylesheet);
      expect(result).toMatchInlineSnapshot(`"div{color:rgb(255,0,128,0.5);background-color:rgb(0,255,0);border-color:rgb(128,128,128)}"`);
    });

    it('handles nested rules', () => {
      const stylesheet = parse(`
        @media (min-width: 768px) {
          div { color: rgb(255 0 128 / 0.8); }
        }
      `);
      sanitizeDeclarations(stylesheet);
      expect(generate(stylesheet)).toMatchInlineSnapshot(`"@media (min-width:768px){div{color:rgb(255,0,128,0.8)}}"`);
    });

    it('processes at-rule declarations', () => {
      const stylesheet = parse(`
        @keyframes fade {
          from { background: rgb(255 0 0 / 0); }
          to { background: rgb(255 0 0 / 1); }
        }
      `);
      sanitizeDeclarations(stylesheet);
      const result = generate(stylesheet);
      expect(result).toMatchInlineSnapshot(`"@keyframes fade{from{background:rgb(255,0,0,0)}to{background:rgb(255,0,0)}}"`);
    });
  });
});
