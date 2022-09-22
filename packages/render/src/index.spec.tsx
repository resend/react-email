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
});
