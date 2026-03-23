import { useCurrentEditor } from '@tiptap/react';
import { Label } from '@/ui/label';
import * as Select from '@/ui/select';
import { TEST_TEMPLATES } from '../../../../_internal';
import { EditorThemeSelector } from '../../../panels/theme-selector';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';

export function DevToolPanel({ resetStyles }: { resetStyles: () => void }) {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <Section title="Devtools">
      <EditorThemeSelector resetStyles={resetStyles} />

      <PropRow>
        <Label htmlFor="preview">Load template</Label>

        <Select.Root
          defaultValue="empty"
          onValueChange={(newValue) => {
            // Defer to avoid flushSync during React render cycle
            queueMicrotask(() => {
              editor.commands.clearContent();
              editor.commands.setContent(JSON.parse(newValue));
            });
          }}
        >
          <Select.Trigger className="py-[0.85rem]" size="1">
            <Select.Value />
          </Select.Trigger>

          <Select.Content>
            <Select.Item value="empty">Template</Select.Item>
            {TEST_TEMPLATES?.map((value) => (
              <Select.Item key={value.id} className="h-9" value={value.content}>
                {value.title}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </PropRow>
    </Section>
  );
}
