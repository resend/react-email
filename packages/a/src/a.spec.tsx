import * as React from 'react';
import { A } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <A> component', () => {
    const actualOutput = render(
      <A href="https://example.com">Example</A>
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
