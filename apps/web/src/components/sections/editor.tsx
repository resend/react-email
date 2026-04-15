'use client';

import { EmailEditor } from '@react-email/editor';
import { composeReactEmail } from '@react-email/editor/core';
import * as React from 'react';
import { CodeBlock } from '../code-block';
import { Heading } from '../heading';
import { Text } from '../text';
import '@react-email/editor/themes/default.css';

export const EditorHomepage = () => {
  const [html, setHtml] = React.useState('');

  return (
    <div className="relative overflow-hidden py-40 space-y-16 sm:space-y-24">
      <div className="space-y-6 pt-20">
        <Heading as="h2" size="8" weight="medium" className="text-white/80">
          Plug'n Play Email Editor
        </Heading>

        <Text size="5" className="block max-w-[400px] text-balance opacity-70">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          suscipit auctor dui,
        </Text>
      </div>

      <div className="w-1/2 p-10 bg-white z-20 aspect-square relative border border-slate-4 grow rounded-2xl sm:rounded-3xl overflow-hidden [overflow-anchor:none] -order-1 md:order-0">
        <div
          aria-hidden="true"
          class="absolute top-0 right-0 h-px w-96 bg-linear-to-l from-transparent via-cyan-12/30 via-50% to-transparent"
        />

        <EmailEditor
          content={INITIAL_CONTENT}
          className="h-full [&_div]:outline-none"
          onChange={async (editor) => {
            const { html } = await composeReactEmail({ editor });
            console.log(editor.getJSON());
            setHtml(html);
          }}
        />
      </div>

      <div className="absolute right-20 top-0 bottom-0 z-10 w-1/2 opacity-60 [mask-image:linear-gradient(to_bottom,black_50%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent)]">
        <div className="relative">
          <CodeBlock
            children={html}
            className="max-md:px-2 max-md:py-3 h-full"
            codeClassName="w-fit"
            language="tsx"
            isGradientLine={false}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div
              className="absolute inset-0 backdrop-blur-sm"
              style={{
                mask: 'linear-gradient(to top, black, transparent 30%)',
                WebkitMask: 'linear-gradient(to top, black, transparent 30%)',
              }}
            />
            <div
              className="absolute inset-0 backdrop-blur"
              style={{
                mask: 'linear-gradient(to top, black, transparent 50%)',
                WebkitMask: 'linear-gradient(to top, black, transparent 50%)',
              }}
            />
            <div
              className="absolute inset-0 backdrop-blur-lg"
              style={{
                mask: 'linear-gradient(to top, black, transparent 70%)',
                WebkitMask: 'linear-gradient(to top, black, transparent 70%)',
              }}
            />
            <div
              className="absolute inset-0 backdrop-blur-2xl"
              style={{
                mask: 'linear-gradient(to top, black, transparent 85%)',
                WebkitMask: 'linear-gradient(to top, black, transparent 85%)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const INITIAL_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'container',
      content: [
        {
          type: 'heading',
          attrs: {
            style: 'margin-top: 0px; margin-bottom: 16px;',
            alignment: null,
            class: '',
            level: 1,
          },
          content: [
            {
              type: 'text',
              text: 'Welcome aboard',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            style: 'margin-bottom: 16px;',
            alignment: null,
            class: 'node-paragraph',
          },
          content: [
            {
              type: 'text',
              text: 'Hi there!',
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            style: 'margin-bottom: 16px;',
            alignment: null,
            class: 'node-paragraph',
          },
          content: [
            {
              type: 'text',
              text: "Thanks for signing up. We're glad to have you with us. Your account is ready, and you can start exploring right away.",
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            style: 'margin-bottom: 16px;',
            alignment: null,
            class: 'node-paragraph',
          },
          content: [
            {
              type: 'text',
              text: 'Head over to your dashboard to get set up and make the most of your new account.',
            },
          ],
        },
        {
          type: 'div',
          attrs: {
            style: '',
            class: 'align-left',
            id: null,
            title: null,
            lang: null,
            dir: null,
            'data-id': null,
            align: null,
            width: null,
            height: null,
          },
          content: [
            {
              type: 'button',
              attrs: {
                style: 'margin-bottom: 24px;',
                alignment: 'left',
                class: 'node-button button',
                href: '#',
              },
              content: [
                {
                  type: 'text',
                  text: 'Go to Your Dashboard',
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          attrs: {
            style: 'margin-bottom: 0px;',
            alignment: null,
            class: 'node-paragraph',
          },
          content: [
            {
              type: 'text',
              text: "If you have any questions, just reply to this email. We're happy to help.",
            },
          ],
        },
        {
          type: 'horizontalRule',
          attrs: {
            style: 'margin-bottom: 24px;',
            class: 'divider',
          },
        },
        {
          type: 'paragraph',
          attrs: {
            style: 'color: #6b7280; font-size: 12px; margin-bottom: 0px;',
            alignment: 'left',
            class: 'node-paragraph',
          },
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
              text: '123 Main Street, Suite 100, City, ST 00000',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    style: '',
                    class: 'node-link',
                    href: '{{{RESEND_UNSUBSCRIBE_URL}}}',
                    target: '_blank',
                    rel: 'noopener noreferrer nofollow',
                    title: null,
                    'ses:no-track': 'true',
                  },
                },
              ],
              text: 'Unsubscribe',
            },
            {
              type: 'text',
              text: ' · © 2025 Company Name',
            },
          ],
        },
      ],
    },
  ],
};
