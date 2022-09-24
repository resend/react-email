import * as React from 'react';
import { Ul } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Ul> component', () => {
    const actualOutput = render(
      <Ul>
        <li>foo</li> <li>bar</li>
      </Ul>,
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
