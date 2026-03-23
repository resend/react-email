import type { useCurrentEditor } from '@tiptap/react';
import { PlusIcon, Trash2 } from 'lucide-react';
import * as React from 'react';
import type { NodeClickedEvent } from '@/components/editor/core/types';
import {
  SOCIAL_LINKS,
  type SocialLinkType,
} from '@/components/editor/extensions/social-config';
import { cn } from '@/lib/cn';
import { IconButton } from '@/ui/icon-button';
import { TextField } from '@/ui/text-field';
import { Section } from '../components/section';
import { getNodeAtExactPos } from '../utils/get-node-at-pos';

type SocialLink = {
  type: SocialLinkType;
  url: string;
};

const DOMAIN_TO_SOCIAL: Record<string, SocialLinkType> = {
  'linkedin.com': 'linkedin',
  'www.linkedin.com': 'linkedin',
  'twitter.com': 'twitter',
  'www.twitter.com': 'twitter',
  'x.com': 'twitter',
  'www.x.com': 'twitter',
  'github.com': 'github',
  'www.github.com': 'github',
  'discord.gg': 'discord',
  'discord.com': 'discord',
  'www.discord.com': 'discord',
  'slack.com': 'slack',
  'www.slack.com': 'slack',
  'instagram.com': 'instagram',
  'www.instagram.com': 'instagram',
  'facebook.com': 'facebook',
  'www.facebook.com': 'facebook',
  'fb.com': 'facebook',
  'youtube.com': 'youtube',
  'www.youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'tiktok.com': 'tiktok',
  'www.tiktok.com': 'tiktok',
  'opencollective.com': 'opencollective',
  'www.opencollective.com': 'opencollective',
  'patreon.com': 'patreon',
  'www.patreon.com': 'patreon',
  'mastodon.social': 'mastodon',
  'bsky.app': 'bluesky',
  'reddit.com': 'reddit',
  'www.reddit.com': 'reddit',
  'pinterest.com': 'pinterest',
  'www.pinterest.com': 'pinterest',
  'threads.net': 'threads',
  'www.threads.net': 'threads',
  'twitch.tv': 'twitch',
  'www.twitch.tv': 'twitch',
  't.me': 'telegram',
  'telegram.org': 'telegram',
  'telegram.me': 'telegram',
  'wa.me': 'whatsapp',
  'whatsapp.com': 'whatsapp',
  'www.whatsapp.com': 'whatsapp',
  'open.spotify.com': 'spotify',
  'spotify.com': 'spotify',
  'medium.com': 'medium',
  'www.medium.com': 'medium',
  'substack.com': 'substack',
  'dribbble.com': 'dribbble',
  'www.dribbble.com': 'dribbble',
  'behance.net': 'behance',
  'www.behance.net': 'behance',
  'dev.to': 'devto',
  'producthunt.com': 'producthunt',
  'www.producthunt.com': 'producthunt',
  'vimeo.com': 'vimeo',
  'www.vimeo.com': 'vimeo',
  'snapchat.com': 'snapchat',
  'www.snapchat.com': 'snapchat',
};

export function detectSocialType(url: string): SocialLinkType | null {
  try {
    const parsed = new URL(url);
    return DOMAIN_TO_SOCIAL[parsed.hostname] ?? null;
  } catch {
    return null;
  }
}

export function getSocialConfig(type: SocialLinkType) {
  return SOCIAL_LINKS.find((s) => s.value === type);
}

interface SocialLinksSectionProps {
  editor: NonNullable<ReturnType<typeof useCurrentEditor>['editor']>;
  data: NodeClickedEvent;
}

export function SocialLinksSection({ editor, data }: SocialLinksSectionProps) {
  function getNodePos() {
    return getNodeAtExactPos(editor, data.nodePos);
  }

  const deleteSocialLinksNode = React.useCallback(() => {
    const socialLinksNodePos = getNodePos();
    if (!socialLinksNodePos) {
      return;
    }

    const transaction = editor.state.tr.deleteRange(
      socialLinksNodePos.pos,
      socialLinksNodePos.pos + socialLinksNodePos.node.nodeSize,
    );
    editor.view.dispatch(transaction);
  }, [editor, data.nodePos]);

  const actualNodeLinks: Record<string, string> =
    getNodePos()?.node.attrs.links ?? {};

  const [socialLinksList, setSocialLinksList] = React.useState<SocialLink[]>(
    () => {
      const initialLinks: SocialLink[] = [];

      for (const { value } of SOCIAL_LINKS) {
        const url = actualNodeLinks[value];
        if (url) {
          initialLinks.push({ type: value, url });
        }
      }

      return initialLinks;
    },
  );

  const [detectedType, setDetectedType] = React.useState<SocialLinkType | null>(
    null,
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const saveSocialLinks = React.useCallback(
    (links: SocialLink[]) => {
      const linksMap = Object.fromEntries(
        SOCIAL_LINKS.map(({ value }) => [
          value,
          links.find((l) => l.type === value)?.url || false,
        ]),
      );

      localStorage.setItem(
        'resend-editor-social-links',
        JSON.stringify(linksMap),
      );

      const socialLinksNodePos = getNodePos();
      if (!socialLinksNodePos) {
        return;
      }

      if (links.length > 0) {
        const transaction = editor.state.tr.setNodeMarkup(
          socialLinksNodePos.pos,
          null,
          {
            ...socialLinksNodePos.node.attrs,
            links: linksMap,
          },
        );
        editor.view.dispatch(transaction);
      }
    },
    [editor, getNodePos],
  );

  const handleAdd = React.useCallback(() => {
    const url = inputRef.current?.value ?? '';
    const type = detectSocialType(url);
    if (!type || !url) {
      return;
    }

    const updated = [
      ...socialLinksList.filter((l) => l.type !== type),
      { type, url },
    ];
    setSocialLinksList(updated);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setDetectedType(null);
    saveSocialLinks(updated);
    inputRef.current?.focus();
  }, [socialLinksList, saveSocialLinks]);

  return (
    <Section title="Content">
      <div className="flex flex-col gap-2">
        {socialLinksList.map((link, index) => {
          const social = getSocialConfig(link.type);
          return (
            <div
              key={`${link.type}-${index}`}
              className="flex items-center gap-2"
            >
              <TextField.Root className="flex-1">
                {social && (
                  <TextField.Slot>
                    <img
                      src={social?.icon}
                      alt={social?.label}
                      className="h-6 w-6"
                    />
                  </TextField.Slot>
                )}
                <TextField.Input
                  onChange={(e) => {
                    const updated = [...socialLinksList];
                    updated[index] = { ...updated[index], url: e.target.value };
                    setSocialLinksList(updated);
                  }}
                  onBlur={(e) => {
                    if (e.target.value.trim() === '') {
                      const updated = socialLinksList.filter(
                        (_, i) => i !== index,
                      );
                      setSocialLinksList(updated);
                      saveSocialLinks(updated);
                      if (updated.length === 0) {
                        deleteSocialLinksNode();
                      }
                      return;
                    }
                  }}
                  value={link.url}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAdd();
                    }
                  }}
                />
              </TextField.Root>

              <IconButton
                onClick={() => {
                  const updated = socialLinksList.filter((_, i) => i !== index);
                  setSocialLinksList(updated);
                  saveSocialLinks(updated);
                  if (updated.length === 0) {
                    deleteSocialLinksNode();
                  }
                }}
                aria-label="Remove social link"
                appearance="fade"
              >
                <Trash2 className="h-3.5! w-3.5! text-gray-9" />
              </IconButton>
            </div>
          );
        })}

        <div className="flex items-center gap-2">
          <TextField.Root className="flex-1">
            {detectedType && (
              <TextField.Slot>
                <img
                  src={getSocialConfig(detectedType)?.icon}
                  alt={getSocialConfig(detectedType)?.label}
                  className="h-6 w-6"
                />
              </TextField.Slot>
            )}
            <TextField.Input
              ref={inputRef}
              placeholder="Add social link..."
              onChange={(e) =>
                setDetectedType(detectSocialType(e.target.value))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              onPaste={(e) => {
                const url = e.clipboardData.getData('text');
                if (detectSocialType(url)) {
                  e.preventDefault();
                  if (inputRef.current) {
                    inputRef.current.value = url;
                  }
                  handleAdd();
                }
              }}
            />
          </TextField.Root>
          <IconButton
            onClick={handleAdd}
            appearance="gray"
            className={cn(!detectedType && 'opacity-50 cursor-default')}
          >
            <PlusIcon className="w-4!" />
          </IconButton>
        </div>
      </div>
    </Section>
  );
}
