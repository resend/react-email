import type { JSONContent } from '@tiptap/core';

/**
 * Representative documents for benchmarking the email serialization
 * pipeline. All fixtures are TipTap JSON as produced by the editor —
 * the same shape applications persist and would serialize on a server.
 */

const themePanelData = {
  theme: 'basic',
  css: '.custom-class { letter-spacing: 0.02em; }',
};

export const simpleDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'globalContent',
      attrs: { data: themePanelData },
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'Hi there,' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Your invite is ready. ' },
        {
          type: 'text',
          text: 'Join the workspace',
          marks: [
            { type: 'link', attrs: { href: 'https://example.com/invite' } },
          ],
        },
        { type: 'text', text: ' whenever you are ready.' },
      ],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: '— The team' }],
    },
  ],
};

const newsletterBody: JSONContent[] = [
  {
    type: 'heading',
    attrs: { level: 1 },
    content: [{ type: 'text', text: 'Product changelog' }],
  },
  {
    type: 'paragraph',
    content: [
      { type: 'text', text: 'Here is everything we shipped this week, ' },
      { type: 'text', text: 'including', marks: [{ type: 'italic' }] },
      { type: 'text', text: ' some ' },
      { type: 'text', text: 'big ones', marks: [{ type: 'bold' }] },
      { type: 'text', text: '.' },
    ],
  },
  {
    type: 'section',
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Faster exports' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Exports now stream results as they are generated.',
          },
        ],
      },
      {
        type: 'button',
        attrs: { href: 'https://example.com/changelog', alignment: 'left' },
        content: [{ type: 'text', text: 'Read the changelog' }],
      },
    ],
  },
  {
    type: 'bulletList',
    content: [
      {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'New keyboard shortcuts' }],
          },
        ],
      },
      {
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: 'Dark mode for the ' },
              { type: 'text', text: 'dashboard', marks: [{ type: 'code' }] },
            ],
          },
        ],
      },
    ],
  },
  {
    type: 'codeBlock',
    attrs: { language: 'typescript' },
    content: [
      {
        type: 'text',
        text: "import { send } from 'emails';\n\nawait send({ to: 'user@example.com' });",
      },
    ],
  },
  { type: 'horizontalRule' },
  {
    type: 'paragraph',
    content: [
      {
        type: 'text',
        text: 'You are receiving this because you signed up for updates.',
      },
    ],
  },
];

export const newsletterDoc: JSONContent = {
  type: 'doc',
  content: [
    { type: 'globalContent', attrs: { data: themePanelData } },
    ...newsletterBody,
  ],
};

const LARGE_DOC_REPEATS = 40;

export const largeDoc: JSONContent = {
  type: 'doc',
  content: [
    { type: 'globalContent', attrs: { data: themePanelData } },
    ...Array.from({ length: LARGE_DOC_REPEATS }, () =>
      structuredClone(newsletterBody),
    ).flat(),
  ],
};

export const fixtures = {
  simple: simpleDoc,
  newsletter: newsletterDoc,
  large: largeDoc,
} as const;

export type FixtureName = keyof typeof fixtures;
