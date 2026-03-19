import { StarterKit } from '@react-email/editor/extensions';
import { BUTTON, ButtonBubbleMenu, SlashCommand } from '@react-email/editor/ui';
import { EditorProvider } from '@tiptap/react';
import { ExampleShell } from '../example-shell';

const extensions = [StarterKit];

const content = `
  <p>Click the button below to see its bubble menu. You can edit the button link and text.</p>
  <div class="align-left"><a class="node-button button" data-id="react-email-button" href="https://react.email">Click me</a></div>
  <p>Use the slash command menu (type /) to insert more buttons.</p>
`;

export function Buttons() {
  return (
    <ExampleShell
      title="Buttons"
      description="Click the button to edit its link via the button bubble menu."
    >
      <EditorProvider extensions={extensions} content={content}>
        <ButtonBubbleMenu.Default />
        <SlashCommand.Root items={[BUTTON]} />
      </EditorProvider>
    </ExampleShell>
  );
}
