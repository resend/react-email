import { mergeAttributes, Node } from '@tiptap/core';

export const RESEND_UNSUBSCRIBE_URL = '{{{RESEND_UNSUBSCRIBE_URL}}}';

const defaultFooterContent = [
  {
    type: 'paragraph',
  },
  {
    type: 'footer',
    content: [
      {
        type: 'horizontalRule',
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'You are receiving this email because you opted in via our site.',
          },
          {
            type: 'hardBreak',
          },
          {
            type: 'hardBreak',
          },
          {
            type: 'text',
            text: 'Want to change how you receive these emails?',
          },
          {
            type: 'hardBreak',
          },
          {
            type: 'text',
            text: 'You can ',
          },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: RESEND_UNSUBSCRIBE_URL,
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  'ses:no-track': 'true',
                },
              },
            ],
            text: 'unsubscribe from this list',
          },
          {
            type: 'text',
            text: '.',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Company Name',
          },
          {
            type: 'hardBreak',
          },
          {
            type: 'text',
            text: '99 Street Address',
          },
          {
            type: 'hardBreak',
          },
          {
            type: 'text',
            text: 'City, STATE 000-000',
          },
        ],
      },
    ],
  },
];

interface FooterOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    footer: {
      /**
       * Set a heading node
       */
      insertFooter: () => ReturnType;
    };
  }
}

export const Footer = Node.create<FooterOptions>({
  name: 'footer',
  content: 'block*',
  group: 'block',
  selectable: false,
  draggable: false,

  addAttributes() {
    return {
      class: {
        default: 'node-footer',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-unsubscribe-footer]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(
        { 'data-unsubscribe-footer': '', class: 'node-footer' },
        HTMLAttributes,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      insertFooter:
        () =>
        ({ commands }) => {
          commands.insertContent(defaultFooterContent);
          return true;
        },
    };
  },
});
