/* @vitest-environment jsdom */

import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SOCIAL_LINKS } from '@/components/editor/extensions/social-config';
import {
  detectSocialType,
  getSocialConfig,
  SocialLinksSection,
} from './social-links';

const mocks = vi.hoisted(() => ({
  state: {
    storedLinks: '{}' as string | Record<string, string>,
  },
  setDefaultLinks: vi.fn(),
  getNodeAtExactPos: vi.fn(),
}));

vi.mock('@/utils/use-local-storage', () => ({
  useLocalStorage: () => [mocks.state.storedLinks, mocks.setDefaultLinks],
}));

vi.mock('../utils/get-node-at-pos', () => ({
  getNodeAtExactPos: (...args: unknown[]) => mocks.getNodeAtExactPos(...args),
}));

vi.mock('../components/section', () => ({
  Section: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}));

vi.mock('@/ui/icon-button', () => ({
  IconButton: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
    React.createElement('button', { type: 'button', ...props }, children),
}));

vi.mock('@/ui/text-field', async () => {
  const React = await import('react');

  return {
    TextField: {
      Root: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLDivElement> & {
        children?: React.ReactNode;
      }) => React.createElement('div', props, children),
      Slot: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLDivElement> & {
        children?: React.ReactNode;
      }) => React.createElement('div', props, children),
      Input: React.forwardRef<
        HTMLInputElement,
        React.InputHTMLAttributes<HTMLInputElement>
      >((props, ref) => React.createElement('input', { ...props, ref })),
    },
  };
});

function createEditor() {
  const markupTransaction = { id: 'markup-transaction' };
  const deleteTransaction = { id: 'delete-transaction' };

  return {
    markupTransaction,
    deleteTransaction,
    editor: {
      state: {
        tr: {
          setNodeMarkup: vi.fn(() => markupTransaction),
          deleteRange: vi.fn(() => deleteTransaction),
        },
      },
      view: {
        dispatch: vi.fn(),
      },
      commands: {
        deleteSelection: vi.fn(),
      },
    },
  };
}

const socialLinksNodeData = {
  nodeType: 'socialLinks',
  nodeAttrs: {},
  nodePos: { pos: 5, inside: 5 },
} as const;

describe('detectSocialType', () => {
  it.each([
    ['https://linkedin.com/in/johndoe', 'linkedin'],
    ['https://www.linkedin.com/company/resend', 'linkedin'],
    ['https://twitter.com/resabordo', 'twitter'],
    ['https://www.twitter.com/resabordo', 'twitter'],
    ['https://x.com/resabordo', 'twitter'],
    ['https://www.x.com/resabordo', 'twitter'],
    ['https://github.com/resend', 'github'],
    ['https://www.github.com/resend', 'github'],
    ['https://discord.gg/invite-code', 'discord'],
    ['https://discord.com/server', 'discord'],
    ['https://www.discord.com/server', 'discord'],
    ['https://slack.com/workspace', 'slack'],
    ['https://www.slack.com/workspace', 'slack'],
    ['https://instagram.com/resend', 'instagram'],
    ['https://www.instagram.com/resend', 'instagram'],
    ['https://facebook.com/resend', 'facebook'],
    ['https://www.facebook.com/resend', 'facebook'],
    ['https://fb.com/resend', 'facebook'],
    ['https://youtube.com/watch?v=123', 'youtube'],
    ['https://www.youtube.com/watch?v=123', 'youtube'],
    ['https://youtu.be/123', 'youtube'],
    ['https://tiktok.com/@resend', 'tiktok'],
    ['https://www.tiktok.com/@resend', 'tiktok'],
    ['https://opencollective.com/resend', 'opencollective'],
    ['https://www.opencollective.com/resend', 'opencollective'],
    ['https://patreon.com/resend', 'patreon'],
    ['https://www.patreon.com/resend', 'patreon'],
    ['https://mastodon.social/@resend', 'mastodon'],
    ['https://bsky.app/profile/resend', 'bluesky'],
    ['https://reddit.com/r/resend', 'reddit'],
    ['https://www.reddit.com/r/resend', 'reddit'],
    ['https://pinterest.com/resend', 'pinterest'],
    ['https://www.pinterest.com/resend', 'pinterest'],
    ['https://threads.net/@resend', 'threads'],
    ['https://www.threads.net/@resend', 'threads'],
    ['https://twitch.tv/resend', 'twitch'],
    ['https://www.twitch.tv/resend', 'twitch'],
    ['https://t.me/resend', 'telegram'],
    ['https://telegram.org/resend', 'telegram'],
    ['https://telegram.me/resend', 'telegram'],
    ['https://wa.me/1234567890', 'whatsapp'],
    ['https://whatsapp.com/channel/resend', 'whatsapp'],
    ['https://www.whatsapp.com/channel/resend', 'whatsapp'],
    ['https://open.spotify.com/artist/resend', 'spotify'],
    ['https://spotify.com/artist/resend', 'spotify'],
    ['https://medium.com/@resend', 'medium'],
    ['https://www.medium.com/@resend', 'medium'],
    ['https://substack.com/resend', 'substack'],
    ['https://dribbble.com/resend', 'dribbble'],
    ['https://www.dribbble.com/resend', 'dribbble'],
    ['https://behance.net/resend', 'behance'],
    ['https://www.behance.net/resend', 'behance'],
    ['https://dev.to/resend', 'devto'],
    ['https://producthunt.com/products/resend', 'producthunt'],
    ['https://www.producthunt.com/products/resend', 'producthunt'],
    ['https://vimeo.com/resend', 'vimeo'],
    ['https://www.vimeo.com/resend', 'vimeo'],
    ['https://snapchat.com/add/resend', 'snapchat'],
    ['https://www.snapchat.com/add/resend', 'snapchat'],
  ])('detects %s as %s', (url, expected) => {
    expect(detectSocialType(url)).toBe(expected);
  });

  it('returns null for an unrecognized domain', () => {
    expect(detectSocialType('https://example.com/profile')).toBeNull();
  });

  it('returns null for an invalid URL', () => {
    expect(detectSocialType('not-a-url')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(detectSocialType('')).toBeNull();
  });

  it('ignores URL path and query params when detecting', () => {
    expect(
      detectSocialType('https://github.com/resend/resend?tab=repositories'),
    ).toBe('github');
  });

  it('handles URLs with ports', () => {
    expect(detectSocialType('https://github.com:443/resend')).toBe('github');
  });
});

describe('getSocialConfig', () => {
  it.each(
    SOCIAL_LINKS.map((s) => [s.value, s.label, s.icon]),
  )('returns config for %s', (value, label, icon) => {
    const config = getSocialConfig(
      value as (typeof SOCIAL_LINKS)[number]['value'],
    );
    expect(config).toEqual({ value, label, icon });
  });

  it('returns undefined for an unknown type', () => {
    expect(
      getSocialConfig('nonexistent' as (typeof SOCIAL_LINKS)[number]['value']),
    ).toBeUndefined();
  });
});

describe('SocialLinksSection', () => {
  beforeEach(() => {
    mocks.state.storedLinks = '{}';
    mocks.setDefaultLinks.mockReset();
    mocks.getNodeAtExactPos.mockReset();
    mocks.getNodeAtExactPos.mockReturnValue({
      pos: socialLinksNodeData.nodePos.pos,
      node: { attrs: { links: {} }, nodeSize: 1 },
    });
  });

  it('keeps a newly inserted empty social links node in place', () => {
    const { editor } = createEditor();

    render(
      React.createElement(SocialLinksSection, {
        editor: editor as never,
        data: socialLinksNodeData,
      }),
    );

    expect(editor.state.tr.setNodeMarkup).not.toHaveBeenCalled();
    expect(editor.view.dispatch).not.toHaveBeenCalled();
    expect(editor.commands.deleteSelection).not.toHaveBeenCalled();
    expect(mocks.setDefaultLinks).not.toHaveBeenCalled();
  });

  it('initializes from node links data on mount', () => {
    const { editor } = createEditor();
    mocks.getNodeAtExactPos.mockReturnValue({
      pos: socialLinksNodeData.nodePos.pos,
      node: {
        attrs: { links: { twitter: 'https://x.com/resend' } },
        nodeSize: 1,
      },
    });

    const { container } = render(
      React.createElement(SocialLinksSection, {
        editor: editor as never,
        data: socialLinksNodeData,
      }),
    );

    const input = getLinksInput(container);
    expect(input).not.toBeNull();
    expect((input as HTMLInputElement).value).toBe('https://x.com/resend');
    expect(editor.state.tr.setNodeMarkup).not.toHaveBeenCalled();
    expect(editor.view.dispatch).not.toHaveBeenCalled();
    expect(editor.commands.deleteSelection).not.toHaveBeenCalled();
  });

  it('removes social-links node when clearing the last link on blur', () => {
    const { editor, deleteTransaction } = createEditor();
    mocks.getNodeAtExactPos.mockReturnValue({
      pos: socialLinksNodeData.nodePos.pos,
      node: {
        attrs: { links: { twitter: 'https://x.com/resend' } },
        nodeSize: 3,
      },
    });

    const { container } = render(
      React.createElement(SocialLinksSection, {
        editor: editor as never,
        data: socialLinksNodeData,
      }),
    );

    const input = getLinksInput(container);
    expect(input).not.toBeNull();

    fireEvent.blur(input as Element, { target: { value: '' } });

    expect(editor.state.tr.deleteRange).toHaveBeenCalledWith(5, 8);
    expect(editor.view.dispatch).toHaveBeenCalledWith(deleteTransaction);
    expect(editor.commands.deleteSelection).not.toHaveBeenCalled();
    expect(editor.state.tr.setNodeMarkup).not.toHaveBeenCalled();
  });

  it('removes social-links node by position when deleting the last link', () => {
    const { editor, deleteTransaction } = createEditor();
    mocks.getNodeAtExactPos.mockReturnValue({
      pos: socialLinksNodeData.nodePos.pos,
      node: {
        attrs: { links: { twitter: 'https://x.com/resend' } },
        nodeSize: 2,
      },
    });

    const { getByLabelText } = render(
      React.createElement(SocialLinksSection, {
        editor: editor as never,
        data: socialLinksNodeData,
      }),
    );

    fireEvent.click(getByLabelText('Remove social link'));

    expect(editor.state.tr.deleteRange).toHaveBeenCalledWith(5, 7);
    expect(editor.view.dispatch).toHaveBeenCalledWith(deleteTransaction);
    expect(editor.commands.deleteSelection).not.toHaveBeenCalled();
    expect(editor.state.tr.setNodeMarkup).not.toHaveBeenCalled();
  });
});

function getLinksInput(container: HTMLElement) {
  return container.querySelector('input[value="https://x.com/resend"]');
}
