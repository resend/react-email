import { useCurrentEditor } from '@tiptap/react';
import { PlusIcon } from 'lucide-react';
import * as React from 'react';
import * as Command from '@/ui/command';
import { IconButton } from '@/ui/icon-button';
import { IconDots } from '@/ui/icons/icon-dots';
import { IconVariable } from '@/ui/icons/icon-variable';
import * as Popover from '@/ui/popover';
import { BROADCAST_ONLY_VARIABLES, CONTACT_VARIABLES } from './extension';
import { useCustomVariables } from './use-custom-variables';
import { getLoopItemVariables } from './utils';

interface VariablesDropdownProps
  extends Pick<
      React.ComponentProps<typeof Popover.Root>,
      'modal' | 'open' | 'onOpenChange'
    >,
    Pick<
      React.ComponentProps<typeof Popover.Content>,
      'align' | 'side' | 'sideOffset' | 'alignOffset' | 'portalContainerId'
    > {
  onVariableSelect: (variable: string) => void;
  children?: React.ReactNode;
  anchorRef?: React.RefObject<HTMLElement | null>;
  onCreateVariable?: () => void;
}

export function VariablesDropdown({
  onVariableSelect,
  modal = false,
  children,
  portalContainerId,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  align = 'end',
  side = 'bottom',
  sideOffset = 8,
  alignOffset = -4,
  anchorRef,
  onCreateVariable,
}: VariablesDropdownProps) {
  const { editor } = useCurrentEditor();

  const [internalOpen, setInternalOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  // Use controlled state if provided, otherwise use internal state
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (controlledOnOpenChange ?? setInternalOpen)
    : setInternalOpen;

  const storage = editor?.storage?.variable ?? {
    customVariables: null,
    onCreateVariable: undefined,
    onDeleteVariable: undefined,
    onUpdateVariable: undefined,
    onEditVariable: undefined,
    showContactVariables: true,
  };

  const customVariables = useCustomVariables(storage.customVariables);

  const { contactProperties, templateVariables } = (() => {
    if (customVariables.length === 0) {
      return { contactProperties: [], templateVariables: [] };
    }

    const contact: string[] = [];
    const template: string[] = [];

    for (const variable of customVariables) {
      const formatted = `{{{${variable.key}}}}`;
      if (variable.key.startsWith('contact.')) {
        contact.push(formatted);
      } else {
        template.push(formatted);
      }
    }

    return { contactProperties: contact, templateVariables: template };
  })();

  const loopVariables = React.useMemo(() => {
    if (!editor) {
      return [];
    }
    const loopItemVars = getLoopItemVariables(editor, customVariables);
    return loopItemVars.map((varName) => `{{{${varName}}}}`);
  }, [editor, customVariables]);

  const filteredHardcodedContactVariables =
    storage.showContactVariables !== false
      ? CONTACT_VARIABLES.filter((variable) => {
          if (searchValue.length > 0) {
            const search = searchValue.toLowerCase();
            return variable.toLowerCase().includes(search);
          }
          return true;
        })
      : [];

  const filteredBroadcastVariables =
    storage.showContactVariables !== false
      ? BROADCAST_ONLY_VARIABLES.filter((variable) => {
          if (searchValue.length > 0) {
            const search = searchValue.toLowerCase();
            return variable.toLowerCase().includes(search);
          }
          return true;
        })
      : [];

  const filteredContactProperties =
    storage.showContactVariables !== false
      ? contactProperties.filter((variable) => {
          if (searchValue.length > 0) {
            const search = searchValue.toLowerCase();
            return variable.toLowerCase().includes(search);
          }
          return true;
        })
      : [];

  const filteredContactVariables = [
    ...filteredHardcodedContactVariables,
    ...filteredContactProperties,
  ];

  const filteredTemplateVariables = templateVariables.filter((variable) => {
    if (searchValue.length > 0) {
      const search = searchValue.toLowerCase();
      return variable.toLowerCase().includes(search);
    }
    return true;
  });

  const filteredLoopVariables = loopVariables.filter((variable) => {
    if (searchValue.length > 0) {
      const search = searchValue.toLowerCase();
      return variable.toLowerCase().includes(search);
    }
    return true;
  });

  const hasLoopResults = filteredLoopVariables.length > 0;
  const hasContactResults = filteredContactVariables.length > 0;
  const hasSystemResults = filteredBroadcastVariables.length > 0;
  const hasTemplateResults = filteredTemplateVariables.length > 0;
  const hasAnyVariables =
    loopVariables.length > 0 ||
    (storage.showContactVariables !== false
      ? CONTACT_VARIABLES.length > 0 ||
        contactProperties.length > 0 ||
        BROADCAST_ONLY_VARIABLES.length > 0
      : false) ||
    templateVariables.length > 0;

  function handleVariableClick(variable: string) {
    onVariableSelect(variable);
    setOpen(false);
    setSearchValue('');
  }

  function handleCreateVariable() {
    if (onCreateVariable) {
      onCreateVariable();
    } else if (storage.onCreateVariable) {
      storage.onCreateVariable();
    }
    setOpen(false);
    setSearchValue('');
  }

  function handleEditVariable(customVar: {
    key: string;
    fallback_value?: string | null;
  }) {
    if (storage.onEditVariable) {
      setOpen(false);
      storage.onEditVariable({
        displayKey: customVar.key,
        variableKey: customVar.key,
        fallbackValue: customVar.fallback_value ?? null,
      });
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal={modal}>
      {anchorRef?.current && (
        <Popover.Anchor virtualRef={{ current: anchorRef.current }} />
      )}
      {children ? (
        <Popover.Trigger asChild>{children}</Popover.Trigger>
      ) : !anchorRef ? (
        <Popover.Trigger asChild>
          <IconButton appearance="fade" size="1" aria-label="Variables">
            <IconVariable className="h-4 w-4!" />
          </IconButton>
        </Popover.Trigger>
      ) : null}
      <Popover.Content
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="p-0 z-50"
        portalContainerId={portalContainerId}
      >
        <Command.Root shouldFilter={false}>
          <Command.Input
            placeholder={
              hasContactResults ? 'Search properties...' : 'Search variables...'
            }
            value={searchValue}
            onValueChange={(value) => setSearchValue(value)}
          />

          <Command.List className="w-[248px] py-0 max-h-fit">
            <div className="max-h-72 scroll-smooth overflow-y-auto">
              <Command.Empty>
                {hasAnyVariables
                  ? 'No variables found.'
                  : 'No variables available.'}
              </Command.Empty>

              {hasLoopResults && (
                <Command.Group
                  heading="Loop Variables"
                  className="**:[[cmdk-group-heading]]:min-h-fit **:[[cmdk-group-heading]]:mt-2"
                >
                  {filteredLoopVariables.map((variable) => (
                    <Command.Item
                      key={`loop-${variable}`}
                      value={variable}
                      onSelect={() => handleVariableClick(variable)}
                      className="font-mono first:mt-0 mt-1 last:mb-1"
                    >
                      <span className="truncate">{variable}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {hasContactResults && (
                <Command.Group
                  heading="Contact Properties"
                  className="**:[[cmdk-group-heading]]:min-h-fit **:[[cmdk-group-heading]]:mt-2"
                >
                  {filteredContactVariables.map((variable) => (
                    <Command.Item
                      key={`contact-${variable}`}
                      value={variable}
                      onSelect={() => handleVariableClick(variable)}
                      className="font-mono first:mt-0 mt-1 last:mb-1"
                    >
                      <span className="truncate">{variable}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {hasSystemResults && (
                <Command.Group
                  heading="System Variables"
                  className="**:[[cmdk-group-heading]]:min-h-fit **:[[cmdk-group-heading]]:mt-2"
                >
                  {filteredBroadcastVariables.map((variable) => (
                    <Command.Item
                      key={`system-${variable}`}
                      value={variable}
                      onSelect={() => handleVariableClick(variable)}
                      className="font-mono first:mt-0 mt-1 last:mb-1"
                    >
                      <span className="truncate">{variable}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {hasTemplateResults && (
                <Command.Group
                  heading="Template Variables"
                  className="**:[[cmdk-group-heading]]:min-h-fit **:[[cmdk-group-heading]]:mt-2"
                >
                  {filteredTemplateVariables.map((variable: string) => {
                    const variableKey = variable.replace(/^\{+|\}+$/g, '');
                    const customVar = customVariables.find(
                      (v) => v.key === variableKey,
                    );

                    return (
                      <Command.Item
                        key={`template-${variable}`}
                        value={variable}
                        onSelect={() => handleVariableClick(variable)}
                        className="font-mono first:mt-0 mt-1 last:mb-1 flex items-center justify-between"
                      >
                        <span className="truncate">{variable}</span>

                        {customVar && storage.onEditVariable ? (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditVariable(customVar);
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="cursor-pointer"
                          >
                            <IconDots />
                          </div>
                        ) : (
                          <IconDots />
                        )}
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              )}
            </div>

            {(!!storage.onCreateVariable || !!onCreateVariable) &&
              !searchValue.length && (
                <>
                  {hasAnyVariables && <Command.Separator />}
                  <Command.Group className="my-1">
                    <Command.Item onSelect={handleCreateVariable}>
                      <div className="flex flex-row gap-2 items-center">
                        <PlusIcon className="size-4" />
                        Create Variable
                      </div>
                    </Command.Item>
                  </Command.Group>
                </>
              )}
          </Command.List>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
  );
}
