import { checkImages, type ImageCheckingResult } from './check-images';

test('checkImages()', async () => {
  const results: ImageCheckingResult[] = [];
  const html = `<div>
  <img src="https://cdn.resend.com/brand/resend-icon-black.png" />,
  <img src="/static/codepen-challengers.png" alt="codepen challenges" />,
</div>`;
  const stream = await checkImages(html, 'https://demo.react.email');
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (value) {
      results.push(value);
    }
    if (done) {
      break;
    }
  }
  expect(results).toMatchSnapshot();
});
