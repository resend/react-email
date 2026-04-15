'use client';

import { EmailEditor } from '@react-email/editor';
import { composeReactEmail } from '@react-email/editor/core';
import { SendHorizonal, X } from 'lucide-react';
import * as React from 'react';
import { CodeBlock } from '../code-block';
import { Heading } from '../heading';
import { Text } from '../text';
import { EditorToolbar } from './editor-toolbar';
import '@react-email/editor/themes/default.css';
import './editor.css';

export const EditorHomepage = () => {
  const [html, setHtml] = React.useState('');
  const [subject, setSubject] = React.useState(
    'I hope this email finds you well',
  );

  return (
    <div className="relative py-10 pb-80 space-y-16 sm:space-y-24">
      <div className="space-y-6 pt-20">
        <Heading as="h2" size="8" weight="medium" className="text-white/80">
          Plug'n Play Email Editor
        </Heading>

        <Text size="5" className="block max-w-[400px] text-balance opacity-70">
          A visual editor you can embed directly in your app to compose
          email templates.
        </Text>
      </div>

      <div className="w-4/6 bg-white z-20 relative border border-slate-4 grow rounded-2xl sm:rounded-3xl overflow-hidden [overflow-anchor:none] -order-1 md:order-0 flex flex-col">
        <div
          aria-hidden="true"
          class="absolute top-0 right-0 h-px w-96 bg-linear-to-l from-transparent via-cyan-12/30 via-50% to-transparent"
        />

        <EmailEditor
          content={INITIAL_CONTENT}
          className="flex-1 overflow-auto px-6 w-full [&>div]:w-full [&_div]:outline-none"
          onChange={async (editor) => {
            const { html } = await composeReactEmail({ editor });
            setHtml(html);
          }}
          ref={async ({ editor }) => {
            const { html } = await composeReactEmail({ editor });
            setHtml(html);
          }}
        >
          <input
            className="text-black h-15 -order-1 px-6 text-xl outline-none"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
          />
          <EditorToolbar className="shrink-0 border-y border-gray-100 px-4 py-1" />
          <div className="absolute right-6 top-4 inline-flex items-center justify-center rounded p-1.5 text-gray-400">
            <X size={14} />
          </div>

          <div className="shrink-0 flex items-center justify-end px-6 py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400">
              Send
              <SendHorizonal size={14} />
            </div>
          </div>
        </EmailEditor>
      </div>

      <div className="overflow-hidden absolute right-10 top-0 h-full z-10 w-1/2 [-mask-image:linear-gradient(to_bottom,black_50%,transparent)]">
        <CodeBlock
          children={html}
          codeClassName="w-fit text-xs opacity-60"
          language="tsx"
          isGradientLine={false}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-40 top-1/2 inset-0"
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
      ],
    },
  ],
};
