import { parse } from '@babel/parser';
import { getObjectVariables } from './get-object-variables';

test('getObjectVariables()', () => {
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
  expect(getObjectVariables(ast)).toMatchSnapshot();
});
