import * as React from 'react';
import { Img } from './index';
import { render } from '../../render/src/index';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Img> component', () => {
    const actualOutput = render(
      <Img src="cat.jpg" alt="Cat" width="300" height="300" />
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
