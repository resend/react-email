import { render } from '@react-email/components';
import type { JSONContent } from '@tiptap/core';
import { Editor } from '@tiptap/core';
import { afterEach, describe, expect, it } from 'vitest';
import { composeReactEmail } from '../core/serializer/compose-react-email';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Container } from './container';
import { StarterKit } from './index';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

const containerStyle = {
  ...DEFAULT_STYLES.reset,
  ...DEFAULT_STYLES.container,
};

describe('Container Node', () => {
  it('renders React Email properly', async () => {
    const Component = Container.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'container',
            attrs: {},
          }}
          style={containerStyle}
          extension={Container}
        >
          Container content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders with width and maxWidth from style', async () => {
    const Component = Container.config.renderToReactEmail;
    const html = await render(
      <Component
        node={{
          type: 'container',
          attrs: {},
        }}
        style={{ ...containerStyle, width: 600 }}
        extension={Container}
      >
        Content
      </Component>,
    );

    expect(html).toContain('max-width:600px');
    expect(html).toContain('width:100%');
  });
});

describe('Container in editor', () => {
  let editor: Editor | null = null;

  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  it('auto-inserts container node when editor initializes with plain content', () => {
    editor = new Editor({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      },
      extensions: [StarterKit],
    });

    const json = editor.getJSON();
    const containerNode = json.content?.find((n) => n.type === 'container');
    expect(containerNode).toBeDefined();
    expect(containerNode?.content).toBeDefined();

    // The paragraph should be inside the container
    const paragraph = containerNode?.content?.find(
      (n) => n.type === 'paragraph',
    );
    expect(paragraph).toBeDefined();
  });

  it('preserves globalContent outside the container', () => {
    editor = new Editor({
      content: {
        type: 'doc',
        content: [
          {
            type: 'globalContent',
            attrs: {
              data: { theme: 'basic' },
            },
          },
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      },
      extensions: [StarterKit],
    });

    const json = editor.getJSON();

    // globalContent should remain a direct child of doc
    const globalContent = json.content?.find(
      (n) => n.type === 'globalContent',
    );
    expect(globalContent).toBeDefined();

    // container should wrap the paragraph
    const containerNode = json.content?.find((n) => n.type === 'container');
    expect(containerNode).toBeDefined();

    // globalContent should NOT be inside the container
    const globalInsideContainer = containerNode?.content?.find(
      (n) => n.type === 'globalContent',
    );
    expect(globalInsideContainer).toBeUndefined();
  });

  it('renders container div with node-container class in editor HTML', () => {
    editor = new Editor({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello' }],
          },
        ],
      },
      extensions: [StarterKit],
    });

    const html = editor.getHTML();
    expect(html).toContain('data-type="container"');
    expect(html).toContain('class="node-container"');
  });
});

describe('Container in composeReactEmail', () => {
  let editor: Editor | null = null;

  afterEach(() => {
    editor?.destroy();
    editor = null;
  });

  function createEditorWithContent(content: JSONContent) {
    editor = new Editor({
      content,
      extensions: [StarterKit],
    });
    return editor;
  }

  it('renders container element in serialized email output', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: {
            data: { theme: 'basic', css: '' },
          },
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello world' }],
        },
      ],
    };

    const ed = createEditorWithContent(content);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    // The Container component renders as a <table> in email HTML
    expect(result.html).toContain('Hello world');
    expect(result.text).toContain('Hello world');
  });

  it('wraps content inside a container in the serialized output', async () => {
    const content: JSONContent = {
      type: 'doc',
      content: [
        {
          type: 'globalContent',
          attrs: {
            data: { theme: 'basic', css: '' },
          },
        },
        {
          type: 'container',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Inside container' }],
            },
          ],
        },
      ],
    };

    const ed = createEditorWithContent(content);
    const result = await composeReactEmail({ editor: ed, preview: '' });

    expect(result.html).toContain('Inside container');
    // Container renders as a table with role="presentation"
    expect(result.html).toContain('role="presentation"');
  });
});
