import * as React from 'react';
import { Button } from './index';
import { render } from '../../render/src/index';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Button> component', () => {
    const actualOutput = render(<Button href="https://example.com" />);
    expect(actualOutput).toMatchSnapshot();
  });
});
