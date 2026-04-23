'use client';

import { StarterKit } from '@react-email/editor/extensions';
import { BubbleMenu } from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit];

const content = `
  <p>Click on <a href="https://react.email" target="_blank" rel="noopener noreferrer">this link</a> to see the link bubble menu. You can edit the URL, open the link, or unlink it.</p>
  <p>Try adding more links by selecting text and pressing Cmd+K.</p>
`;

export function LinkEditing() {
  return (
    <ExampleShell
      title="Link editing"
      description="Click a link to see the link bubble menu. Select text and press Cmd+K to add links."
    >
      <EditorProvider
        extensions={extensions}
        content={content}
        immediatelyRender={false}
      >
        <BubbleMenu.LinkDefault />
      </EditorProvider>
    </ExampleShell>
  );
}
