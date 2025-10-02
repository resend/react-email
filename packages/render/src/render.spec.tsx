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

  it('decodes ampersands in href attributes', () => {
    const component = (
      <a href="https://example.com/page?param1=value1&param2=value2&param3=value3">
        Click here
      </a>
    );
    const html = render(component);

    // Should not contain encoded ampersands in href attributes
    expect(html).not.toContain('&amp;param');

    // Should contain actual ampersands in URLs
    expect(html).toContain('param1=value1&param2=value2&param3=value3');
  });
});
