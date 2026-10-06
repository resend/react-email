import { render } from '@react-email/render';
import * as React from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import {
  createEmailContext,
  markAsEmailContextConsumer,
  markAsEmailContextProvider,
  provideEmailContext,
  readEmailContext,
} from './index.js';

const valueContext = createEmailContext<string>(
  'email-context.spec',
  'default value',
);

const Consumer = (props: { children?: React.ReactNode }) => {
  const value = readEmailContext(props, valueContext);
  return (
    <span data-value={value} data-testid="consumer">
      {props.children}
    </span>
  );
};
markAsEmailContextConsumer(Consumer);

const Provider = (props: { value: string; children?: React.ReactNode }) => {
  return provideEmailContext(valueContext, props.value, props.children, props);
};
markAsEmailContextProvider(Provider);

describe('email contexts', () => {
  it('provides the default value without a provider', async () => {
    const html = await render(<Consumer />);
    expect(html).toContain('data-value="default value"');
  });

  it('provides values to direct children', async () => {
    const html = await render(
      <Provider value="direct">
        <Consumer />
      </Provider>,
    );
    expect(html).toContain('data-value="direct"');
  });

  it('provides values through host elements, fragments and arrays', async () => {
    const html = await render(
      <Provider value="structural">
        <div>
          <>
            {[
              <table key="table">
                <tbody>
                  <tr>
                    <td>
                      <Consumer />
                    </td>
                  </tr>
                </tbody>
              </table>,
            ]}
          </>
        </div>
      </Provider>,
    );
    expect(html).toContain('data-value="structural"');
  });

  it('provides values through custom function components', async () => {
    const Layout = ({ children }: { children: React.ReactNode }) => {
      return <div className="layout">{children}</div>;
    };
    const DeepLayout = () => {
      return (
        <Layout>
          <Consumer />
        </Layout>
      );
    };

    const html = await render(
      <Provider value="through components">
        <DeepLayout />
      </Provider>,
    );
    expect(html).toContain('data-value="through components"');
  });

  it('provides values through components that use hooks', async () => {
    const Layout = ({ children }: { children: React.ReactNode }) => {
      const [state] = React.useState('state value');
      const id = React.useId();
      return (
        <div data-state={state} data-id={id}>
          {children}
        </div>
      );
    };

    const html = await render(
      <Provider value="with hooks">
        <Layout>
          <Consumer />
        </Layout>
      </Provider>,
    );
    expect(html).toContain('data-value="with hooks"');
    expect(html).toContain('data-state="state value"');
  });

  it('provides values through forwardRef and memo components', async () => {
    const ForwardRefLayout = React.forwardRef<
      HTMLDivElement,
      { children: React.ReactNode }
    >(({ children }, ref) => {
      return <div ref={ref}>{children}</div>;
    });
    const MemoLayout = React.memo(
      ({ children }: { children: React.ReactNode }) => {
        return <div>{children}</div>;
      },
    );

    const html = await render(
      <Provider value="exotic components">
        <ForwardRefLayout>
          <MemoLayout>
            <Consumer />
          </MemoLayout>
        </ForwardRefLayout>
      </Provider>,
    );
    expect(html).toContain('data-value="exotic components"');
  });

  it('lets the closest provider win', async () => {
    const html = await render(
      <Provider value="outer">
        <Consumer />
        <Provider value="inner">
          <Consumer />
        </Provider>
      </Provider>,
    );
    expect(html).toContain('data-value="outer"');
    expect(html).toContain('data-value="inner"');
  });

  it('keeps values from other contexts when nesting different providers', async () => {
    const otherContext = createEmailContext<string>(
      'email-context.spec.other',
      'other default',
    );
    const OtherConsumer = (props: object) => {
      const value = readEmailContext(props, valueContext);
      const otherValue = readEmailContext(props, otherContext);
      return <span data-value={value} data-other-value={otherValue} />;
    };
    markAsEmailContextConsumer(OtherConsumer);
    const OtherProvider = (props: {
      value: string;
      children?: React.ReactNode;
    }) => {
      return provideEmailContext(
        otherContext,
        props.value,
        props.children,
        props,
      );
    };
    markAsEmailContextProvider(OtherProvider);

    const html = await render(
      <Provider value="from outer provider">
        <OtherProvider value="from inner provider">
          <OtherConsumer />
        </OtherProvider>
      </Provider>,
    );
    expect(html).toContain('data-value="from outer provider"');
    expect(html).toContain('data-other-value="from inner provider"');
  });

  it('provides values through async components', async () => {
    const AsyncLayout = async ({ children }: { children: React.ReactNode }) => {
      await new Promise((resolve) => setTimeout(resolve, 5));
      return <div>{children}</div>;
    };

    const html = await render(
      <Provider value="through async components">
        <AsyncLayout>
          <Consumer />
        </AsyncLayout>
      </Provider>,
    );
    expect(html).toContain('data-value="through async components"');
  });

  it('provides values when client-rendered in the browser', () => {
    const Layout = ({ children }: { children: React.ReactNode }) => {
      const [state] = React.useState('client state');
      return <div data-state={state}>{children}</div>;
    };

    const container = document.createElement('div');
    const root = createRoot(container);
    flushSync(() => {
      root.render(
        <Provider value="client rendered">
          <Layout>
            <Consumer />
          </Layout>
        </Provider>,
      );
    });

    expect(container.innerHTML).toContain('data-value="client rendered"');
    expect(container.innerHTML).toContain('data-state="client state"');
    root.unmount();
  });

  it('does not leak the private prop into the markup', async () => {
    const html = await render(
      <Provider value="private">
        <Consumer />
      </Provider>,
    );
    expect(html.toLowerCase()).not.toContain('reactemailcontexts');
  });

  it('does not reach consumers inside class components', async () => {
    class ClassLayout extends React.Component<{
      children?: React.ReactNode;
    }> {
      render() {
        return <Consumer />;
      }
    }

    const html = await render(
      <Provider value="class component">
        <ClassLayout />
      </Provider>,
    );
    expect(html).toContain('data-value="default value"');
  });

  it('still reaches consumers passed as children to class components', async () => {
    class ClassLayout extends React.Component<{
      children?: React.ReactNode;
    }> {
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    const html = await render(
      <Provider value="class children">
        <ClassLayout>
          <Consumer />
        </ClassLayout>
      </Provider>,
    );
    expect(html).toContain('data-value="class children"');
  });
});
