import { convertUrisIntoUrls } from './convert-uris-into-urls';

describe('convertUrisIntoUrls()', () => {
  it('should work with src attributes', () => {
    expect(
      convertUrisIntoUrls(`
const MyComp = () => {
  return <Img src="/static/my-image.png"/>;
}

<html>
  <head>...</head>
  <body>
    <img src="/static/my-image.png">
  </body>
</html>
`),
    ).toBe(`
const MyComp = () => {
  return <Img src="https://react.email/static/my-image.png"/>;
}

<html>
  <head>...</head>
  <body>
    <img src="https://react.email/static/my-image.png">
  </body>
</html>
`);
  });

  it('should work with url() function calls for fonts in styles', () => {
    expect(
      convertUrisIntoUrls(`
const MyComp = () => {
  return <style dangerouslySetInnerHTML={{ __html: '
.my-class {
  font-family: url(/fonts/my-font);
}
' }}>;
}

<html>
  <head>
    <style>
      .my-class {
        font-family: url(/fonts/my-font);
      }
    </style>
  </head>
</html>
`),
    ).toBe(`
const MyComp = () => {
  return <style dangerouslySetInnerHTML={{ __html: '
.my-class {
  font-family: url(https://react.email/fonts/my-font);
}
' }}>;
}

<html>
  <head>
    <style>
      .my-class {
        font-family: url(https://react.email/fonts/my-font);
      }
    </style>
  </head>
</html>
`);
  });
});
