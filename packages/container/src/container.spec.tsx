import * as React from 'react';
import { Container } from './index';
import { render } from '@react-email/render';

describe('render', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('renders the <Container> component', () => {
    const container = render(
      <Container style={{ maxWidth: '300px' }}>
        <button>Hi</button>
      </Container>,
    );

    expect(container).toMatchSnapshot();
  });
});
