import * as React from 'react';
import { render } from './index';
import { Template } from './utils/template';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('converts a React component into HTML', () => {
    const actualOutput = render(<Template firstName="Jim" />);
    expect(actualOutput).toMatchSnapshot();
  });

  it('decodes HTML entities in style attributes', () => {
    const component = (
      <div
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        }}
      >
        Test
      </div>
    );
    const html = render(component);

    // Should not contain encoded quotes
    expect(html).not.toContain('&quot;');

    // Should contain actual quotes
    expect(html).toContain('"Segoe UI"');
    expect(html).toContain('"Roboto"');
  });

  it('decodes ampersands in style attributes', () => {
    const component = (
      <div
        style={{
          backgroundImage:
            'url(https://example.com/image?param1=value1&param2=value2)',
        }}
      >
        Test
      </div>
    );
    const html = render(component);

    // Should not contain encoded ampersands in style attributes
    expect(html).not.toContain('&amp;param');

    // Should contain actual ampersands in URLs
    expect(html).toContain('param1=value1&param2=value2');
  });
});
