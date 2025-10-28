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
    ).toEqual([]);
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
    ).toEqual([]);
  });
});
