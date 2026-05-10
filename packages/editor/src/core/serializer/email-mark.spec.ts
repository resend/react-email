import { Mark } from '@tiptap/core';
import { EmailMark } from './email-mark';

const Highlight = Mark.create({
  name: 'highlight',
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },
  parseHTML() {
    return [{ tag: 'mark' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['mark', HTMLAttributes, 0];
  },
});

describe('EmailMark', () => {
  it('maintains all user-defined properties from Mark', () => {
    const Component = vi.fn(() => 'some important value');
    const CustomHighlight = EmailMark.from(Highlight, Component);

    expect(CustomHighlight).toBeInstanceOf(EmailMark);
    expect(Highlight.config).not.toHaveProperty('renderToReactEmail');

    expect(CustomHighlight.options).toStrictEqual(Highlight.options);
    expect(CustomHighlight.storage).toStrictEqual(Highlight.storage);
    expect(CustomHighlight.type).toStrictEqual(Highlight.type);
    expect(CustomHighlight.name).toStrictEqual(Highlight.name);
    expect(CustomHighlight.parent).toStrictEqual(Highlight.parent);
    expect(CustomHighlight.config).toHaveProperty('renderToReactEmail');

    expect(
      CustomHighlight.config.renderToReactEmail(
        {} as unknown as Parameters<
          typeof CustomHighlight.config.renderToReactEmail
        >[0],
      ),
    ).toBe('some important value');

    const configWithoutRender = { ...CustomHighlight.config } as Record<
      string,
      unknown
    >;
    delete configWithoutRender.renderToReactEmail;
    expect(configWithoutRender).toStrictEqual(Highlight.config);
  });

  it('remains an EmailMark instance and preserves renderToReactEmail after configure()', () => {
    const Component = vi.fn(() => 'rendered');
    const CustomHighlight = EmailMark.from(Highlight, Component);

    const configured = CustomHighlight.configure({
      HTMLAttributes: { class: 'test-mark' },
    });

    expect(configured).toBeInstanceOf(EmailMark);
    expect(configured.config).toHaveProperty('renderToReactEmail');
    expect(configured.config.renderToReactEmail).toBe(Component);
    expect(configured.name).toBe(CustomHighlight.name);
  });

  // Covers the second @ts-expect-error path in email-mark.ts:77 — extend()
  // must keep the EmailMark identity and the renderToReactEmail component
  // so subclasses don't lose their renderer at the type/runtime boundary.
  it('preserves EmailMark identity through extend()', () => {
    const Component = vi.fn(() => 'rendered');
    const Base = EmailMark.from(Highlight, Component);

    const Extended = Base.extend({
      addOptions() {
        return { HTMLAttributes: { class: 'extended-mark' } };
      },
    });

    expect(Extended).toBeInstanceOf(EmailMark);
    expect(Extended.config).toHaveProperty('renderToReactEmail');
    expect(Extended.config.renderToReactEmail).toBe(Component);
  });

  it('configure() can be called twice without losing renderToReactEmail', () => {
    const Component = vi.fn(() => 'rendered');
    const Base = EmailMark.from(Highlight, Component);

    const a = Base.configure({ HTMLAttributes: { class: 'a' } });
    const b = a.configure({ HTMLAttributes: { class: 'b' } });

    expect(b).toBeInstanceOf(EmailMark);
    expect(b.config.renderToReactEmail).toBe(Component);
  });
});
