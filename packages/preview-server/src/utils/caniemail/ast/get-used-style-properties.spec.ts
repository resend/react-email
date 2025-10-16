import { parse } from '@babel/parser';
import { getObjectVariables } from './get-object-variables';
import { getUsedStyleProperties } from './get-used-style-properties';

test('getUsedStyleProperties()', async () => {
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
  ).toMatchSnapshot();
});
