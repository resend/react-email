import * as React from 'react';
import { P } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <P> component', () => {
    const actualOutput = render(
      <P>Lorem ipsum</P>
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
