import type { Node } from '@tiptap/pm/model';
import type { Editor } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import { Trash2 } from 'lucide-react';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { cn } from '@/lib/cn';
import { Button } from '@/ui/button';
import * as Dialog from '@/ui/dialog';
import { IconButton } from '@/ui/icon-button';
import { SHORTCUTS_VALUES } from '@/ui/kbd';
import * as Select from '@/ui/select';
import { Text } from '@/ui/text';
import { TextField } from '@/ui/text-field';
import * as Tooltip from '@/ui/tooltip';
import { useLocalStorage } from '@/utils/use-local-storage';
// NOTE: Extensions layer imports from plugins and ui layers - this is acceptable.
import { useAgnosticSelf } from '../plugins/collaboration/liveblocks';
import { VariablesDropdown } from '../plugins/variables/dropdown';
import { EditorDialog } from '../ui/dialogs/editor-dialog';
import { SocialComponent } from './social-component';
import { SOCIAL_LINKS, type SocialLinkType } from './social-config';

type HtmlNodeProps = {
  node: Node;
  editor: Editor;
  selected?: boolean;
  updateAttributes: (attrs: Record<string, unknown>) => void;
};

type SocialLink = {
  type: SocialLinkType;
  url: string;
};

export function SocialNode(props: HtmlNodeProps) {
  const node = props.node;
  const currentUser = useAgnosticSelf();

  const [defaultLinks, setDefaultLinks] = useLocalStorage(
    'resend-editor-social-links',
    JSON.stringify({}),
  );

  const handleOpenDialog = React.useCallback(() => {
    props.updateAttributes({
      internal_new: true,
      internal_event_user_id: currentUser?.id,
    });
  }, [props.updateAttributes, currentUser?.id]);
  const [newSocialType, setNewSocialType] = React.useState<SocialLinkType>(
    SOCIAL_LINKS[0].value,
  );
  const [newSocialUrl, setNewSocialUrl] = React.useState('');
  const urlInputRef = React.useRef<HTMLInputElement>(null);

  const localDefaultLinks: Record<string, string> = (() => {
    try {
      if (typeof defaultLinks === 'string') {
        return JSON.parse(defaultLinks);
      }
      if (defaultLinks && typeof defaultLinks === 'object') {
        return defaultLinks as Record<string, string>;
      }
      return {};
    } catch {
      return {};
    }
  })();

  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>(() => {
    const initialLinks: SocialLink[] = [];

    SOCIAL_LINKS.forEach(({ value }) => {
      const url = node.attrs.links?.[value] || localDefaultLinks?.[value];

      if (url) {
        initialLinks.push({ type: value, url });
      }
    });

    return initialLinks;
  });

  React.useEffect(() => {
    // In this effect, we only want to update the social links, if they
    // were altered without using the dialog -- i.e. if the node.attrs.links was changed
    // due to a variable delete/update
    if (node.attrs.internal_new) {
      return;
    }

    const updatedLinks = SOCIAL_LINKS.map(({ value }) => {
      const url = node.attrs.links?.[value];
      return url ? { type: value, url } : null;
    }).filter((link): link is SocialLink => link !== null);

    setSocialLinks(updatedLinks);
  }, [node.attrs.links, node.attrs.internal_new]);

  const handleAddSocial = () => {
    if (!newSocialUrl) {
      return;
    }

    setSocialLinks((prevLinks) => [
      ...prevLinks.filter((link) => link.type !== newSocialType),
      { type: newSocialType, url: newSocialUrl },
    ]);

    setNewSocialUrl('');
  };

  const handleRemoveSocial = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  function handleVariableSelect(variable: string) {
    if (!urlInputRef.current) {
      return;
    }
    const currentValue = newSocialUrl;
    const newValue = currentValue + variable;
    setNewSocialUrl(newValue);
    urlInputRef.current.value = newValue;
    urlInputRef.current.focus();
  }

  const handleSave = React.useCallback(() => {
    const links = Object.fromEntries(
      SOCIAL_LINKS.map(({ value }) => [
        value,
        socialLinks.find((link) => link.type === value)?.url || false,
      ]),
    );

    setDefaultLinks(JSON.stringify(links));

    if (socialLinks.length > 0) {
      props.updateAttributes({ links, internal_new: false });
    } else {
      props.editor.commands.deleteSelection();
    }
  }, [socialLinks, props.updateAttributes, props.editor, setDefaultLinks]);

  const handleSocialTypeChange = (value: string) => {
    setNewSocialType(value as SocialLinkType);
  };

  useHotkeys('meta+enter', () => {
    handleSave();
  }, [handleSave]);

  return (
    <NodeViewWrapper>
      <div
        onClick={handleOpenDialog}
        className={cn(
          'cursor-pointer',
          props.selected && 'socialLinksNode-selected',
        )}
      >
        <SocialComponent {...node.attrs.links} />
      </div>

      <EditorDialog
        updateAttributes={props.updateAttributes}
        opened={node.attrs.internal_new}
        eventUserId={node.attrs.internal_event_user_id}
      >
        <Dialog.Title>Add your social networks</Dialog.Title>
        <Text size="2">Choose the social and add the url</Text>

        <div className="mt-4 flex w-full flex-col gap-5">
          <div className="flex items-center gap-2">
            <Select.Root
              value={newSocialType}
              onValueChange={handleSocialTypeChange}
            >
              <Select.Trigger className="w-[110px]">
                <Select.Value placeholder="Select" />
              </Select.Trigger>
              <Select.Content>
                {SOCIAL_LINKS.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            <TextField.Root className="flex-1">
              <TextField.Input
                ref={urlInputRef}
                placeholder="http://"
                type="url"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
              />
              <TextField.Slot>
                <VariablesDropdown
                  onVariableSelect={handleVariableSelect}
                  onCreateVariable={() => {
                    // Open modal without auto-injection
                    if (
                      props.editor?.storage?.variable
                        ?.onCreateVariableWithoutInjection
                    ) {
                      props.editor.storage.variable.onCreateVariableWithoutInjection();
                    }
                  }}
                  modal
                />
              </TextField.Slot>
            </TextField.Root>
            <Button appearance="gray" onClick={handleAddSocial}>
              Add
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {socialLinks.map((link, index) => {
              const social = SOCIAL_LINKS.find(
                (opt) => opt.value === link.type,
              );

              return (
                <div
                  key={`${link.type}-${index}`}
                  className="flex items-center gap-3 p-2 border border-gray-3 rounded-2xl"
                >
                  <Tooltip.Root>
                    <Tooltip.Trigger>
                      <div className="min-w-[24px] flex items-center justify-center">
                        <img
                          src={social?.icon}
                          alt={social?.label}
                          className="w-6 h-6"
                        />
                      </div>
                    </Tooltip.Trigger>
                    <Tooltip.Content>{social?.label}</Tooltip.Content>
                  </Tooltip.Root>
                  <div className="flex-1 text-sm text-gray-9 truncate">
                    {link.url}
                  </div>
                  <IconButton
                    onClick={() => handleRemoveSocial(index)}
                    appearance="fade"
                  >
                    <Trash2 className="!w-4 h-3 text-red-10" />
                  </IconButton>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Button
            shortcut={[SHORTCUTS_VALUES.CMD, SHORTCUTS_VALUES.ENTER]}
            appearance="white"
            onClick={handleSave}
            type="submit"
          >
            Save
          </Button>
          <Dialog.Close asChild>
            <Button appearance="gray" shortcut={SHORTCUTS_VALUES.ESC}>
              Cancel
            </Button>
          </Dialog.Close>
        </div>
      </EditorDialog>
    </NodeViewWrapper>
  );
}
