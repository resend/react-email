import { Heading } from '@tiptap/extension-heading';
import { EmailNode } from './email-node';

describe('EmailNode', () => {
  it('maintains all user-defined properties from Heading', () => {
    const Component = vi.fn(() => 'some important value');
    const CustomHeader = EmailNode.from(Heading, Component);
    expect(CustomHeader).toBeInstanceOf(EmailNode);
    expect(Heading.config).not.toHaveProperty('renderToReactEmail');

    expect(CustomHeader.options).toStrictEqual(Heading.options);
    expect(CustomHeader.storage).toStrictEqual(Heading.storage);
    expect(CustomHeader.child).toStrictEqual(Heading.child);
    expect(CustomHeader.type).toStrictEqual(Heading.type);
    expect(CustomHeader.name).toStrictEqual(Heading.name);
    expect(CustomHeader.parent).toStrictEqual(Heading.parent);
    expect(CustomHeader.config).toHaveProperty('renderToReactEmail');

    expect(
      CustomHeader.config.renderToReactEmail(
        {} as unknown as Parameters<
          typeof CustomHeader.config.renderToReactEmail
        >[0],
      ),
    ).toBe('some important value');
    const configWithoutRender = { ...CustomHeader.config } as Record<
      string,
      unknown
    >;
    delete configWithoutRender.renderToReactEmail;
    expect(configWithoutRender).toStrictEqual(Heading.config);
  });

  it('remains an EmailNode instance and preserves renderToReactEmail after configure()', () => {
    const Component = vi.fn(() => 'rendered');
    const CustomHeader = EmailNode.from(Heading, Component);

    const configured = CustomHeader.configure({ levels: [1, 2] });

    expect(configured).toBeInstanceOf(EmailNode);
    expect(configured.config).toHaveProperty('renderToReactEmail');
    expect(configured.config.renderToReactEmail).toBe(Component);
    expect(configured.name).toBe(CustomHeader.name);
  });

  // Covers the second @ts-expect-error path in email-node.ts:75 — extend()
  // must keep the EmailNode identity and the renderToReactEmail component.
  it('preserves EmailNode identity through extend()', () => {
    const Component = vi.fn(() => 'rendered');
    const Base = EmailNode.from(Heading, Component);

    const Extended = Base.extend({
      addOptions() {
        return { levels: [1, 2, 3] as const, HTMLAttributes: {} };
      },
    });

    expect(Extended).toBeInstanceOf(EmailNode);
    expect(Extended.config).toHaveProperty('renderToReactEmail');
    expect(Extended.config.renderToReactEmail).toBe(Component);
  });

  it('configure() can be called twice without losing renderToReactEmail', () => {
    const Component = vi.fn(() => 'rendered');
    const Base = EmailNode.from(Heading, Component);

    const a = Base.configure({ levels: [1, 2] });
    const b = a.configure({ levels: [1, 2, 3] });

    expect(b).toBeInstanceOf(EmailNode);
    expect(b.config.renderToReactEmail).toBe(Component);
  });
});
