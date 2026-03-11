import type { Editor } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import type { SuggestionProps } from '@tiptap/suggestion';
import tippy, { type GetReferenceClientRect, type Instance } from 'tippy.js';
import { CommandList, type CommandListRef } from './command-list';
import type { SlashCommandItem } from './types';

type Props = SuggestionProps<SlashCommandItem>;

export function renderItems() {
  let component: ReactRenderer<CommandListRef> | null = null;
  let popup: Instance[] | null = null;

  return {
    onStart: (props: Props) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      if (!props.clientRect) return;

      popup = tippy('body', {
        getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        placement: 'bottom-start',
      });
    },

    onUpdate: (props: Props) => {
      if (!component) return;
      component.updateProps(props);

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
      return component?.ref?.onKeyDown(props) ?? false;
    },

    onExit: () => {
      popup?.[0]?.destroy();
      component?.destroy();
      popup = null;
      component = null;
    },
  };
}
