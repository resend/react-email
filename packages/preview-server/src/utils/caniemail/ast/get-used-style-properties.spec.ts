import { parse } from '@babel/parser';
import { getObjectVariables } from './get-object-variables';
import { getUsedStyleProperties } from './get-used-style-properties';

describe('getUsedStyleProperties()', async () => {
  it('handles styles defined as an object in another variable', async () => {
    const reactCode = `
<Button style={buttonStyle}>Click me</Button>

const buttonStyle = {
  borderRadius: '5px',
};
`;
    const ast = parse(reactCode, {
      strictMode: false,
      errorRecovery: true,
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript', 'decorators'],
    });
    const objectVariables = getObjectVariables(ast);
    expect(
      await getUsedStyleProperties(ast, reactCode, '', objectVariables),
    ).toMatchInlineSnapshot(`
      [
        {
          "location": SourceLocation {
            "end": Position {
              "column": 21,
              "index": 91,
              "line": 5,
            },
            "filename": undefined,
            "identifierName": undefined,
            "start": Position {
              "column": 2,
              "index": 72,
              "line": 5,
            },
          },
          "name": "borderRadius",
          "value": "5px",
        },
      ]
    `);
  });

  it('handles styles defined inline in the attribute', async () => {
    const reactCode = `
<Button style={{ borderRadius: '5px', "color": "#fff", padding: 10 }}>Click me</Button>
`;
    const ast = parse(reactCode, {
      strictMode: false,
      errorRecovery: true,
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript', 'decorators'],
    });
    const objectVariables = getObjectVariables(ast);
    expect(
      await getUsedStyleProperties(ast, reactCode, '', objectVariables),
    ).toMatchInlineSnapshot(`
      [
        {
          "location": SourceLocation {
            "end": Position {
              "column": 36,
              "index": 37,
              "line": 2,
            },
            "filename": undefined,
            "identifierName": undefined,
            "start": Position {
              "column": 17,
              "index": 18,
              "line": 2,
            },
          },
          "name": "borderRadius",
          "value": "5px",
        },
        {
          "location": SourceLocation {
            "end": Position {
              "column": 53,
              "index": 54,
              "line": 2,
            },
            "filename": undefined,
            "identifierName": undefined,
            "start": Position {
              "column": 38,
              "index": 39,
              "line": 2,
            },
          },
          "name": "color",
          "value": "#fff",
        },
        {
          "location": SourceLocation {
            "end": Position {
              "column": 66,
              "index": 67,
              "line": 2,
            },
            "filename": undefined,
            "identifierName": undefined,
            "start": Position {
              "column": 55,
              "index": 56,
              "line": 2,
            },
          },
          "name": "padding",
          "value": "10",
        },
      ]
    `);
  });

  it('handles styles objects that are a property of another object', async () => {
    const reactCode = `
const styles = {
  button: { borderRadius: '5px', "color": "#fff", padding: 10 },
}
<Button style={styles.button}>Click me</Button>
`;
    const ast = parse(reactCode, {
      strictMode: false,
      errorRecovery: true,
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript', 'decorators'],
    });
    const objectVariables = getObjectVariables(ast);
    expect(
      await getUsedStyleProperties(ast, reactCode, '', objectVariables),
    ).toMatchInlineSnapshot();
  });
});
