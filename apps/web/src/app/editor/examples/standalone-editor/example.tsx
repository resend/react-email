'use client';

import { EmailEditor } from '@react-email/editor';
import { ExampleShell } from '../example-shell';

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is the simplest way to use the editor — a single component with everything pre-wired. Try selecting text to see the bubble menu, or type "/" for slash commands.',
        },
      ],
    },
  ],
};

export function StandaloneEditor() {
  return (
    <ExampleShell
      title="Standalone editor — minimal"
      description="The simplest setup — one component with everything included."
    >
      <EmailEditor content={content} />
    </ExampleShell>
  );
}
