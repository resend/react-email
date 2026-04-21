import { getPreviewProps } from '../export.js';

test('getPreviewProps returns object preview props', () => {
  const emailComponent = Object.assign(() => null, {
    PreviewProps: { name: 'Alice', inviteLink: 'https://example.com' },
  });

  expect(getPreviewProps(emailComponent)).toEqual({
    name: 'Alice',
    inviteLink: 'https://example.com',
  });
});

test('getPreviewProps falls back to an empty object for invalid preview props', () => {
  const emailComponent = Object.assign(() => null, {
    PreviewProps: null,
  });
  const primitivePreviewPropsComponent = Object.assign(() => null, {
    PreviewProps: 'invalid',
  });

  expect(getPreviewProps(emailComponent)).toEqual({});
  expect(getPreviewProps(primitivePreviewPropsComponent)).toEqual({});
});
