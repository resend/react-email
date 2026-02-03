import type { Node } from '@tiptap/pm/model';
import { NodeViewWrapper } from '@tiptap/react';
import { IconWarning } from '@/ui/icons/icon-warning';
import { editorEventBus } from '../../core/event-bus';
import { isSystemVariable } from './extension';

type VariableNodeProps = {
  node: Node;
  getPos: () => number | undefined;
};

export function VariableNode({ node, getPos }: VariableNodeProps) {
  const isLoopContextVariable = node.attrs.id?.includes('{{{this');
  const isEmailVariable = node.attrs.id?.includes('{{{contact.email}}}');
  const isSystemVar = isSystemVariable(node.attrs.id);
  const showWarning =
    node.attrs?.fallback === '' &&
    !isEmailVariable &&
    !isLoopContextVariable &&
    !isSystemVar;

  const handleClick = () => {
    const pos = getPos();
    if (pos === undefined) {
      return;
    }

    editorEventBus.dispatch('disable-focus-mode', undefined);
    editorEventBus.dispatch('node-clicked', {
      nodeType: 'variable',
      nodeAttrs: { ...node.attrs },
      nodePos: { pos, inside: pos },
    });
  };

  return (
    <NodeViewWrapper className="inline-block node-variable">
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className="cursor-pointer border-black/10 bg-black/3 inline-flex items-center gap-1 rounded-lg border px-1 py-0.5 font-mono text-[.86em] leading-none -my-0.5 outline-none focus-visible:ring-2 focus-visible:ring-gray-a5"
      >
        {node.attrs.label ?? node.attrs.id}
        {showWarning && <IconWarning className="text-red-10" size={16} />}
      </span>
    </NodeViewWrapper>
  );
}
