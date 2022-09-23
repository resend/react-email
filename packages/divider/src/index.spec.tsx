import * as React from 'react';
import { Divider } from './index';
import { render } from '../../render/src/index';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Divider> component', () => {
    const actualOutput = render(<Divider />);
    expect(actualOutput).toMatchSnapshot();
  });
});
