import { StarterKit } from '@react-email/editor/extensions';
import { LinkBubbleMenu } from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit];

const content = `
  <p>Click on <a href="https://react.email" target="_blank">this link</a> to see the link bubble menu. You can edit the URL, open the link, or unlink it.</p>
  <p>Try adding more links by selecting text and pressing Cmd+K.</p>
`;

export function LinkEditing() {
  return (
    <ExampleShell
      title="Link Editing"
      description="Click a link to see the link bubble menu. Select text and press Cmd+K to add links."
    >
      <EditorProvider extensions={extensions} content={content}>
        <LinkBubbleMenu.Default />
      </EditorProvider>
    </ExampleShell>
  );
}
