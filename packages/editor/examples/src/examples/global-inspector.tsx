import { StarterKit } from '@react-email/editor/extensions';
import { Inspector } from '@react-email/editor/ui';
import {
  EditorContent,
  EditorContext,
  EditorProvider,
  useEditor,
} from '@tiptap/react';

const extensions = [StarterKit];

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Click on the editor or select nodes to see the inspector update. The panel on the right shows the global document properties.',
        },
      ],
    },
  ],
};

export function GlobalInspector() {
  const editor = useEditor({
    extensions,
    content,
  });

  return (
    <div>
      <p className="text-sm text-(--re-text-muted) mb-4">
        Using the Inspector compound component to render a global document
        inspector with breadcrumb navigation and property fields.
      </p>
      <EditorContext.Provider value={{ editor }}>
        <div className="flex gap-4 border border-(--re-border) rounded-xl min-h-75">
          <div className="flex-1 p-4">
            <EditorContent editor={editor} />
          </div>

          <aside className="w-72 border-l border-(--re-border) p-4 flex flex-col gap-4">
            <Inspector.Root>
              <nav>
                <ol className="flex items-center gap-1 text-xs list-none m-0 p-0">
                  <Inspector.Breadcrumb>
                    {(segments) =>
                      segments.map((segment, i) => (
                        <li key={i} className="flex items-center gap-1">
                          {i !== 0 && (
                            <span className="text-(--re-text-muted)">/</span>
                          )}
                          <button
                            type="button"
                            className="bg-transparent border-0 cursor-pointer text-(--re-text) hover:underline p-0 text-xs"
                            {...segment.props}
                          >
                            {segment.node?.nodeType ?? 'Layout'}
                          </button>
                        </li>
                      ))
                    }
                  </Inspector.Breadcrumb>
                </ol>
              </nav>

              <Inspector.Panel>
                {(group, fields) => (
                  <section className="border-t border-(--re-border) pt-3 first:border-0 first:pt-0">
                    <h3 className="text-xs font-semibold text-(--re-text) m-0 mb-2">
                      {group.title}
                    </h3>

                    <div className="flex flex-col gap-2">
                      {fields.map((field) => (
                        <Inspector.DefaultField key={field.prop} {...field} />
                      ))}
                    </div>
                  </section>
                )}
              </Inspector.Panel>
            </Inspector.Root>
          </aside>
        </div>
      </EditorContext.Provider>
    </div>
  );
}
