import { Parser } from '../../parser';
import { getObjectVariables } from './get-object-variables';

test('getObjectVariables()', () => {
  const reactCode = `
<Button style={buttonStyle}>Click me</Button>

const buttonStyle = {
  borderRadius: '5px',
};
`;
  const ast = Parser.parse(reactCode, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
  expect(getObjectVariables(ast)).toMatchSnapshot();
});
