import * as React from 'react';
import { Code } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Code> component', () => {
    const actualOutput = render(
      <Code style={{ maxWidth: '300px' }}>const foo = 'bar';</Code>,
    );

    expect(actualOutput).toMatchSnapshot();
  });
});
