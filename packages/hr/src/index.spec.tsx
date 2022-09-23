import * as React from 'react';
import { Hr } from './index';
import { render } from '../../render/src/index';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Hr> component', () => {
    const actualOutput = render(<Hr />);
    expect(actualOutput).toMatchSnapshot();
  });
});
