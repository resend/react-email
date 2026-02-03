import { html as htmlLanguage } from '@codemirror/lang-html';
import { EditorView } from '@codemirror/view';
import type { Node } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import CodeMirror from '@uiw/react-codemirror';
import DOMPurify from 'dompurify';
import * as React from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/ui/button';
import * as Dialog from '@/ui/dialog';
import { vesperInit } from '@/utils/codemirror-theme';
// NOTE: Extensions layer imports from plugins and ui layers - this is acceptable.
import { useAgnosticSelf } from '../plugins/collaboration/liveblocks';
import { EditorDialog } from '../ui/dialogs/editor-dialog';
import { elementFromString } from './custom-html-utils';

type HtmlNodeProps = {
  node: Node;
  editor: Editor;
  selected?: boolean;
  updateAttributes: (attrs: Record<string, unknown>) => void;
};

export function HtmlNode(props: HtmlNodeProps) {
  const node = props.node;
  const [html, setHtml] = React.useState(node.attrs.content);
  const currentUser = useAgnosticSelf();

  const handleSave = () => {
    const content = DOMPurify.sanitize(elementFromString(html).innerHTML);

    if (!content) {
      props.editor.commands.deleteSelection();
    } else {
      props.updateAttributes({
        content,
        internal_new: false,
      });
    }
  };

  function revertPendingState() {
    setHtml(node.attrs.content);
  }

  const handleOpenDialog = React.useCallback(() => {
    props.updateAttributes({
      internal_new: true,
      internal_event_user_id: currentUser?.id,
    });
  }, [props.updateAttributes, currentUser?.id]);

  return (
    <NodeViewWrapper>
      <div className="relative">
        <div
          dangerouslySetInnerHTML={{
            __html: node.attrs.content,
          }}
          className={cn(
            'htmlContent',
            props.selected && 'htmlContent-selected',
          )}
        />
        <div
          role="button"
          tabIndex={0}
          aria-label="Edit HTML content"
          onClick={handleOpenDialog}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenDialog();
            }
          }}
          className="absolute inset-0 cursor-pointer"
        />
      </div>

      <EditorDialog
        opened={node.attrs.internal_new}
        eventUserId={node.attrs.internal_event_user_id}
        updateAttributes={props.updateAttributes}
        onModalClose={revertPendingState}
      >
        <Dialog.Title>Write or paste your raw HTML</Dialog.Title>
        <div className="mt-4 flex w-full flex-col gap-1">
          <CodeMirror
            extensions={[htmlLanguage(), EditorView.lineWrapping]}
            height="370px"
            id="emails"
            onChange={(value) => setHtml(value)}
            placeholder="<table>content...</table>"
            style={{
              fontSize: '15px',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
            theme={vesperInit({
              settings: {
                caret: '#61a8f8',
                lineHighlight: 'transparent',
              },
            })}
            value={html}
          />
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Button appearance="white" onClick={handleSave} type="submit">
            Save
          </Button>
          <Dialog.Close asChild>
            <Button appearance="fade">Cancel</Button>
          </Dialog.Close>
        </div>
      </EditorDialog>
    </NodeViewWrapper>
  );
}
