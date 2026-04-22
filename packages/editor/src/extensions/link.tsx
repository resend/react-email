import type { LinkOptions as TipTapLinkOptions } from '@tiptap/extension-link';
import TiptapLink from '@tiptap/extension-link';
import { Link as ReactEmailLink } from 'react-email';

export type LinkOptions = TipTapLinkOptions;

import { editorEventBus } from '../core';
import { EmailMark } from '../core/serializer/email-mark';
import { isSafeUrl } from '../utils/is-safe-url';
import { inlineCssToJs } from '../utils/styles';
import { processStylesForUnlink } from './preserved-style';

export const Link: EmailMark<TipTapLinkOptions, any> = EmailMark.from(
  TiptapLink,
  ({ children, mark, style }) => {
    const linkMarkStyle = mark.attrs?.style
      ? inlineCssToJs(mark.attrs.style)
      : {};

    const rawHref = (mark.attrs?.href as string) ?? '';
    const href = isSafeUrl(rawHref) ? rawHref : undefined;

    return (
      <ReactEmailLink
        href={href}
        rel={mark.attrs?.rel ?? undefined}
        style={{
          ...style,
          ...linkMarkStyle,
        }}
        target={mark.attrs?.target ?? undefined}
        {...(mark.attrs?.['ses:no-track']
          ? { 'ses:no-track': mark.attrs['ses:no-track'] }
          : {})}
      >
        {children}
      </ReactEmailLink>
    );
  },
).extend({
  parseHTML() {
    return [
      {
        tag: 'a[target]:not([data-id="react-email-button"])',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const href = element.getAttribute('href') ?? '';
          if (!isSafeUrl(href)) {
            return false;
          }
          const attrs: Record<string, string> = {};
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });
          return attrs;
        },
      },
      {
        tag: 'a[href]:not([data-id="react-email-button"])',
        getAttrs: (node) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const href = element.getAttribute('href') ?? '';
          if (!isSafeUrl(href)) {
            return false;
          }
          const attrs: Record<string, string> = {};
          Array.from(element.attributes).forEach((attr) => {
            attrs[attr.name] = attr.value;
          });
          return attrs;
        },
      },
    ];
  },

  addAttributes() {
    return {
      ...this.parent?.(),

      'ses:no-track': {
        default: null,
        parseHTML: (element) => element.getAttribute('ses:no-track'),
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),

      unsetLink:
        () =>
        ({ state, chain }) => {
          const { from } = state.selection;
          const linkMark = state.doc
            .resolve(from)
            .marks()
            .find((m) => m.type.name === 'link');
          const linkStyle = linkMark?.attrs?.style ?? null;

          const preservedStyle = processStylesForUnlink(linkStyle);

          const shouldRemoveUnderline = preservedStyle !== linkStyle;

          if (preservedStyle) {
            const cmd = chain()
              .extendMarkRange('link')
              .unsetMark('link')
              .setMark('preservedStyle', { style: preservedStyle });

            return shouldRemoveUnderline
              ? cmd.unsetMark('underline').run()
              : cmd.run();
          }

          return chain()
            .extendMarkRange('link')
            .unsetMark('link')
            .unsetMark('underline')
            .run();
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-k': () => {
        editorEventBus.dispatch('bubble-menu:add-link', undefined);
        // unselect
        return this.editor.chain().focus().toggleLink({ href: '' }).run();
      },
    };
  },
});
