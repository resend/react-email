import type { Editor, MarkViewRendererProps } from '@tiptap/core';
import { MarkView, mergeAttributes } from '@tiptap/core';
import type { LinkOptions as TipTapLinkOptions } from '@tiptap/extension-link';
import TiptapLink from '@tiptap/extension-link';
import type { DOMOutputSpec } from '@tiptap/pm/model';
import { DOMSerializer } from '@tiptap/pm/model';
import { Link as ReactEmailLink } from 'react-email';

export type LinkOptions = TipTapLinkOptions;

import { editorEventBus } from '../core';
import { EmailMark } from '../core/serializer/email-mark';
import {
  getEmailTheming,
  getMergedCssJs,
  getResolvedNodeStyles,
} from '../plugins/email-theming/extension';
import { inlineCssToJs, jsToInlineCss } from '../utils/styles';
import { processStylesForUnlink } from './preserved-style';

function resolveThemedLinkStyle(editor: Editor): string {
  const theming = getEmailTheming(editor);
  const resolved = getResolvedNodeStyles(
    { type: 'link', attrs: {} },
    0,
    getMergedCssJs(theming.theme, theming.styles),
  );
  return jsToInlineCss(resolved).replace(/;$/, '');
}

function renderLinkSpec(
  optionsHTMLAttributes: Record<string, unknown>,
  HTMLAttributes: Record<string, unknown>,
  themedStyle: string,
): DOMOutputSpec {
  const userStyle = ((HTMLAttributes.style as string | undefined) ?? '')
    .trim()
    .replace(/;$/, '');
  const mergedStyle = [themedStyle, userStyle].filter(Boolean).join('; ');
  return [
    'a',
    mergeAttributes(optionsHTMLAttributes, HTMLAttributes, {
      style: mergedStyle || null,
    }),
    0,
  ];
}

/**
 * Renders links in the live editor without the theme style inlined, because
 * ProseMirror only re-creates a mark's DOM when its attrs change, so an
 * inlined theme color would go stale on theme changes. The EmailTheming
 * plugin's scoped `.node-link` CSS paints them instead and updates live.
 * Serialization (`getHTML`, clipboard) still goes through `renderHTML`.
 */
class LinkMarkView extends MarkView<null> {
  private readonly element: HTMLElement;

  constructor(
    props: MarkViewRendererProps,
    optionsHTMLAttributes: Record<string, unknown>,
  ) {
    super(null, props);
    const hasLiveThemeCss = props.editor.extensionManager.extensions.some(
      (extension) => extension.name === 'theming',
    );
    const { dom } = DOMSerializer.renderSpec(
      document,
      renderLinkSpec(
        optionsHTMLAttributes,
        props.HTMLAttributes,
        hasLiveThemeCss ? '' : resolveThemedLinkStyle(props.editor),
      ),
    );
    this.element = dom as HTMLElement;
  }

  override get dom(): HTMLElement {
    return this.element;
  }

  override get contentDOM(): HTMLElement {
    return this.element;
  }
}

export const Link: EmailMark<TipTapLinkOptions, any> = EmailMark.from(
  TiptapLink,
  ({ children, mark, style }) => {
    const linkMarkStyle = mark.attrs?.style
      ? inlineCssToJs(mark.attrs.style)
      : {};

    return (
      <ReactEmailLink
        href={mark.attrs?.href ?? undefined}
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
          const attrs: Record<string, string> = {};

          // Preserve all attributes
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
          const attrs: Record<string, string> = {};

          // Preserve all attributes
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

  renderHTML({ HTMLAttributes }) {
    return renderLinkSpec(
      this.options.HTMLAttributes,
      HTMLAttributes,
      this.editor ? resolveThemedLinkStyle(this.editor) : '',
    );
  },

  addMarkView() {
    return (props) => new LinkMarkView(props, this.options.HTMLAttributes);
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
