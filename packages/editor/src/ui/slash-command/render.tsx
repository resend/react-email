import { ReactRenderer } from '@tiptap/react';
import type { SuggestionProps } from '@tiptap/suggestion';
import tippy, { type GetReferenceClientRect, type Instance } from 'tippy.js';
import { CommandList } from './command-list';
import type {
  CommandListComponent,
  CommandListRef,
  SlashCommandItem,
} from './types';

type Props = SuggestionProps<SlashCommandItem>;

export function createRenderItems(
  component: CommandListComponent = CommandList,
) {
  return () => {
    let renderer: ReactRenderer<CommandListRef> | null = null;
    let popup: Instance[] | null = null;

    return {
      onStart: (props: Props) => {
        renderer = new ReactRenderer(component, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) return;

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: renderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate: (props: Props) => {
        if (!renderer) return;
        renderer.updateProps(props);

        if (popup?.[0] && props.clientRect) {
          popup[0].setProps({
            getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          });
        }
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === 'Escape') {
          popup?.[0]?.hide();
          return true;
        }
        return renderer?.ref?.onKeyDown(props) ?? false;
      },

      onExit: () => {
        popup?.[0]?.destroy();
        renderer?.destroy();
        popup = null;
        renderer = null;
      },
    };
  };
}
