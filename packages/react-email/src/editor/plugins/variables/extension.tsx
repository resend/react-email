import { InputRule } from '@tiptap/core';
import Mention from '@tiptap/extension-mention';
import { ReactNodeViewRenderer, ReactRenderer } from '@tiptap/react';
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { PlusIcon } from 'lucide-react';
import {
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type {
  GetReferenceClientRect,
  Instance as TippyInstance,
} from 'tippy.js';
import tippy from 'tippy.js';
import { cn } from '@/lib/cn';
import type { VariableType } from '@/schemas/templates';
import { DropdownMenu } from '@/ui/dropdown-menu';
import { IconDots } from '@/ui/icons/icon-dots';
import { dropdown } from '@/ui/shared';
import { editorEventBus } from '../../core/event-bus';
import { VariableNode } from './react-variable-node';
import { useCustomVariables } from './use-custom-variables';
import {
  flattenObjectPaths,
  getLoopItemVariables,
  normalizeFallbackValue,
} from './utils';

export const CONTACT_VARIABLES = [
  '{{{contact.first_name}}}',
  '{{{contact.last_name}}}',
  '{{{contact.email}}}',
];

export const BROADCAST_ONLY_VARIABLES = ['{{{RESEND_UNSUBSCRIBE_URL}}}'];

export function isSystemVariable(variableId: string | undefined): boolean {
  if (!variableId) {
    return false;
  }
  return BROADCAST_ONLY_VARIABLES.some((v) => variableId.includes(v));
}

export type CustomVariable = {
  id: string;
  key: string;
  type: string;
  fallback_value?: string | null;
};

export type VariableUpdates = {
  variableKey?: string;
  type?: VariableType;
  fallbackValue?: string;
};

export type OnUpdateVariableHandler = (
  currentVariableKey: string,
  updates: VariableUpdates,
) => Promise<void>;

export type OnDeleteVariableHandler = (variableKey: string) => Promise<void>;

export type EditingVariable = {
  displayKey: string;
  variableKey: string;
  fallbackValue: string | null;
};

export type OnEditVariableHandler = (variable: EditingVariable) => void;

export type OnRequestDeleteVariableHandler = (
  variable: EditingVariable,
) => void;

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      setVariableContext: (context: {
        customVariables?: Array<CustomVariable> | null;
        onCreateVariable?: () => void;
        onCreateVariableWithoutInjection?: () => void;
        onUpdateVariableFallback?: (
          variableKey: string,
          fallbackValue: string,
          originalValue: string,
        ) => void;
        onUpdateVariable?: OnUpdateVariableHandler;
        onAutoCreateVariable?: (variableKey: string) => Promise<void>;
        onDeleteVariable?: OnDeleteVariableHandler;
        onEditVariable?: OnEditVariableHandler;
        onRequestDeleteVariable?: OnRequestDeleteVariableHandler;
        showContactVariables?: boolean;
      }) => ReturnType;
    };
  }

  // TODO: Refactor to use storage only for data and use handlers for methods/callbacks
  interface Storage {
    metadata?: {
      objectType: 'broadcast' | 'template';
      objectId: string;
    };
    variable: {
      showContactVariables?: boolean;
      customVariables?: Array<CustomVariable> | null;
      onCreateVariable?: () => void;
      onCreateVariableWithoutInjection?: () => void;
      onUpdateVariableFallback?: (
        variableKey: string,
        fallbackValue: string,
        originalValue: string,
      ) => void;
      onUpdateVariable?: OnUpdateVariableHandler;
      onAutoCreateVariable?: (variableKey: string) => Promise<void>;
      onDeleteVariable?: OnDeleteVariableHandler;
      onEditVariable?: OnEditVariableHandler;
      onRequestDeleteVariable?: OnRequestDeleteVariableHandler;
    };
    previewText: {
      previewText: string | null;
    };
  }
}

const VariableDropdownContent = ({
  children,
  className,
  id,
  ref,
  hasCreateVariable = false,
  ...props
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  ref?: Ref<HTMLDivElement>;
  hasCreateVariable?: boolean;
}) => (
  <div
    ref={ref}
    className={cn(
      dropdown.content.sizing,
      dropdown.content.appearance,
      'max-h-94 max-w-[19rem] rounded-2xl',
      'min-w-58 flex flex-col overflow-auto',
      hasCreateVariable && 'pb-10',
      className,
    )}
    id={id}
    style={{ scrollbarWidth: 'none' }}
    {...props}
  >
    {children}
  </div>
);

const VariableDropdownItem = ({
  children,
  selected = false,
  onClick,
  className,
  ref,
  appearance = 'gray',
  ...props
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  appearance?: 'gray' | 'red';
}) => (
  <button
    ref={ref}
    className={cn(
      'flex min-h-8 cursor-pointer items-center gap-1.5 rounded-xl',
      'data-disabled:cursor-not-allowed',
      dropdown.item.sizing,
      appearance === 'gray'
        ? dropdown.item.appearance.gray
        : 'text-red-10 hover:bg-red-3 focus-visible:bg-red-3',
      selected && 'bg-gray-a2 text-gray-a10',
      'text-left',
      className,
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const VariableList = ({
  props,
  ref,
  popup,
}: {
  props: SuggestionProps;
  ref?: Ref<{ onKeyDown: (props: { event: KeyboardEvent }) => boolean }>;
  popup?: TippyInstance[];
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const storage = props.editor?.storage?.variable || {
    customVariables: null,
    onCreateVariable: undefined,
  };

  const customVariables = useCustomVariables(storage.customVariables);

  const hasCustomVariablesSystem = storage.customVariables !== null;

  const objectVariables = customVariables.filter(
    (v: CustomVariable) => v.type === 'object',
  );
  const primitiveAndListVariables = customVariables.filter(
    (v: CustomVariable) => v.type !== 'object',
  );

  type FlattenedItem = {
    displayKey: string;
    variableKey: string;
    fallbackValue: string | null;
  };

  const flattenedObjectItems: FlattenedItem[] = objectVariables.flatMap(
    (v: CustomVariable) => {
      const normalized = normalizeFallbackValue(v.fallback_value);
      const nestedPaths = flattenObjectPaths(normalized, 2);
      return nestedPaths.map((path) => ({
        displayKey: `${v.key}.${path}`,
        variableKey: v.key,
        fallbackValue: v.fallback_value ?? null,
      }));
    },
  );

  const primitiveItems: FlattenedItem[] = primitiveAndListVariables.map(
    (v: CustomVariable) => ({
      displayKey: v.key,
      variableKey: v.key,
      fallbackValue: v.fallback_value ?? null,
    }),
  );

  const loopItems: FlattenedItem[] = (() => {
    const loopPaths = getLoopItemVariables(props.editor, customVariables);
    return loopPaths.map((path) => ({
      displayKey: path,
      variableKey: 'loop-item',
      fallbackValue: null,
    }));
  })();

  const query = props.query || '';
  const search = query.toLowerCase();

  const filteredLoopItems = loopItems.filter((item) =>
    search.length > 0
      ? `{{{${item.displayKey}}}}`?.toLowerCase().includes(search)
      : true,
  );
  const filteredObjectItems = flattenedObjectItems.filter((item) =>
    search.length > 0
      ? `{{{${item.displayKey}}}}`?.toLowerCase().includes(search)
      : true,
  );
  const filteredPrimitiveItems = primitiveItems.filter((item) =>
    search.length > 0
      ? `{{{${item.displayKey}}}}`?.toLowerCase().includes(search)
      : true,
  );

  const allCustomItems = [...filteredObjectItems, ...filteredPrimitiveItems];

  const contactProperties =
    storage.showContactVariables !== false
      ? allCustomItems.filter((item) => item.displayKey.startsWith('contact.'))
      : [];
  const templateCustomVariables = allCustomItems.filter(
    (item) => !item.displayKey.startsWith('contact.'),
  );

  const filteredBroadcastVars =
    storage.showContactVariables !== false
      ? BROADCAST_ONLY_VARIABLES.filter((item) =>
          search.length > 0 ? item.toLowerCase().includes(search) : true,
        )
      : [];

  // Order items to match rendering: loop items, contact items, system items, custom items
  const allContactItems = [
    ...props.items,
    ...contactProperties.map((item) => `{{{${item.displayKey}}}}`),
  ];

  const allItems = (() => {
    const items: string[] = [];
    if (filteredLoopItems.length > 0) {
      items.push(
        ...filteredLoopItems.map((item) => `{{{${item.displayKey}}}}`),
      );
    }
    items.push(...allContactItems);
    items.push(...filteredBroadcastVars);
    if (templateCustomVariables.length > 0) {
      items.push(
        ...templateCustomVariables.map((item) => `{{{${item.displayKey}}}}`),
      );
    }
    return items;
  })();

  const totalItemsCount =
    allItems.length +
    (hasCustomVariablesSystem && storage.onCreateVariable ? 1 : 0);

  const hasLoopResults = filteredLoopItems.length > 0;
  const hasContactResults = allContactItems.length > 0;
  const hasSystemResults = filteredBroadcastVars.length > 0;
  const hasCustomResults = templateCustomVariables.length > 0;
  const hasAnyResults =
    hasLoopResults || hasContactResults || hasSystemResults || hasCustomResults;

  // Callback to set item refs
  const setItemRef = useCallback((index: number) => {
    return (element: HTMLElement | null) => {
      if (element) {
        itemRefs.current.set(index, element);
      } else {
        itemRefs.current.delete(index);
      }
    };
  }, []);

  useEffect(() => {
    const selectedElement = itemRefs.current.get(selectedIndex);
    const container = dropdownRef.current;

    if (selectedElement && container) {
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // Get element position relative to container
      const elementTop = selectedElement.offsetTop;
      const elementHeight = selectedElement.offsetHeight;
      const elementBottom = elementTop + elementHeight;

      // Add buffer zone of 120px
      const buffer = 120;

      // Calculate visible area with buffer
      const visibleTop = containerScrollTop + buffer;
      const visibleBottom = containerScrollTop + containerHeight - buffer;

      let newScrollTop = containerScrollTop;

      // If element is above visible area, scroll up
      if (elementTop < visibleTop) {
        newScrollTop = elementTop - buffer;
      }
      // If element is below visible area, scroll down
      else if (elementBottom > visibleBottom) {
        newScrollTop = elementBottom - containerHeight + buffer;
      }

      // Only scroll if position changed
      if (newScrollTop !== containerScrollTop) {
        container.scrollTo({
          top: Math.max(0, newScrollTop),
          behavior: 'smooth',
        });
      }
    }
  }, [selectedIndex]);

  const selectItem = (index: number) => {
    const item = allItems[index];

    if (item) {
      const loopItemsCount = filteredLoopItems.length;
      const adjustedIndex = index - loopItemsCount;

      // Check if it's a loop item
      if (index < loopItemsCount) {
        const loopItem = filteredLoopItems[index];
        props.command({
          id: item,
          fallback: loopItem.fallbackValue || '',
          internal_new: false,
        });
      }
      // Check if it's a contact variable
      else if (index < loopItemsCount + props.items.length) {
        props.command({ id: item });
      }
      // Otherwise it's a custom variable or broadcast variable
      else {
        const contactPropertyIndex = adjustedIndex - props.items.length;
        const broadcastVarIndex =
          contactPropertyIndex - contactProperties.length;
        const templateCustomVariableIndex =
          broadcastVarIndex - filteredBroadcastVars.length;

        if (
          contactPropertyIndex >= 0 &&
          contactPropertyIndex < contactProperties.length
        ) {
          const property = contactProperties[contactPropertyIndex];
          props.command({
            id: item,
            fallback: property.fallbackValue || '',
          });
        } else if (
          broadcastVarIndex >= 0 &&
          broadcastVarIndex < filteredBroadcastVars.length
        ) {
          props.command({ id: item });
        } else if (
          templateCustomVariableIndex >= 0 &&
          templateCustomVariableIndex < templateCustomVariables.length
        ) {
          const variable = templateCustomVariables[templateCustomVariableIndex];
          props.command({
            id: item,
            fallback: variable.fallbackValue || '',
          });
        }
      }
    }
  };

  const handleCreateVariable = () => {
    if (storage.onCreateVariable) {
      storage.onCreateVariable();
    }
    // Close the tippy popup when creating a variable
    if (popup?.[0]) {
      popup[0].hide();
    }
  };

  useEffect(() => setSelectedIndex(0), [props.query]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (totalItemsCount === 0) {
        return false;
      }

      if (event.key === 'ArrowUp') {
        setSelectedIndex(
          (selectedIndex + totalItemsCount - 1) % totalItemsCount,
        );
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % totalItemsCount);
        return true;
      }

      if (event.key === 'Enter') {
        if (hasCustomVariablesSystem && selectedIndex === allItems.length) {
          handleCreateVariable();
        } else {
          selectItem(selectedIndex);
        }
        return true;
      }

      return false;
    },
  }));

  return (
    <VariableDropdownContent
      ref={dropdownRef}
      id="variable-command"
      hasCreateVariable={hasCustomVariablesSystem && !!storage.onCreateVariable}
    >
      {hasLoopResults && (
        <>
          <div className={cn(dropdown.label, 'px-3')}>Loop Item</div>
          {filteredLoopItems.map((item, index) => {
            const isLast = index === filteredLoopItems.length - 1;
            return (
              <VariableDropdownItem
                key={`loop-${item.displayKey}`}
                ref={setItemRef(index)}
                selected={index === selectedIndex}
                onClick={() => selectItem(index)}
                className={cn(
                  'font-mono',
                  isLast && !hasContactResults && !hasCustomResults && 'mb-1',
                )}
              >
                <span className="truncate">{`{{{${item.displayKey}}}}`}</span>
              </VariableDropdownItem>
            );
          })}
        </>
      )}

      {hasContactResults && (
        <>
          <div className={cn(dropdown.label, 'px-3')}>Contact Properties</div>
          {props.items.map((item: string, index: number) => {
            const globalIndex = filteredLoopItems.length + index;
            return (
              <VariableDropdownItem
                key={`contact-${index}`}
                ref={setItemRef(globalIndex)}
                selected={globalIndex === selectedIndex}
                onClick={() => selectItem(globalIndex)}
                className="font-mono"
              >
                <span className="truncate">{item}</span>
              </VariableDropdownItem>
            );
          })}
          {contactProperties.map((item, index) => {
            const globalIndex =
              filteredLoopItems.length + props.items.length + index;
            const isLast = index === contactProperties.length - 1;
            return (
              <VariableDropdownItem
                key={`contact-property-${item.displayKey}`}
                ref={setItemRef(globalIndex)}
                selected={globalIndex === selectedIndex}
                onClick={() => selectItem(globalIndex)}
                className={cn(
                  'font-mono',
                  isLast && !hasSystemResults && !hasCustomResults && 'mb-1',
                )}
              >
                <span className="truncate">{`{{{${item.displayKey}}}}`}</span>
              </VariableDropdownItem>
            );
          })}
        </>
      )}

      {hasSystemResults && (
        <>
          <div className={cn(dropdown.label, 'px-3')}>System Variables</div>
          {filteredBroadcastVars.map((item, index) => {
            const globalIndex =
              filteredLoopItems.length +
              props.items.length +
              contactProperties.length +
              index;
            const isLast = index === filteredBroadcastVars.length - 1;
            return (
              <VariableDropdownItem
                key={`system-${item}`}
                ref={setItemRef(globalIndex)}
                selected={globalIndex === selectedIndex}
                onClick={() => selectItem(globalIndex)}
                className={cn(
                  'font-mono',
                  isLast && !hasCustomResults && 'mb-1',
                )}
              >
                <span className="truncate">{item}</span>
              </VariableDropdownItem>
            );
          })}
        </>
      )}

      {hasCustomVariablesSystem && hasCustomResults && (
        <>
          <div className={cn(dropdown.label, 'px-3')}>Template Variables</div>
          {templateCustomVariables.map((item, index) => {
            const globalIndex =
              filteredLoopItems.length +
              allContactItems.length +
              filteredBroadcastVars.length +
              index;
            const isLast = index === templateCustomVariables.length - 1;
            return (
              <VariableDropdownItem
                key={`custom-variable-${item.displayKey}`}
                ref={setItemRef(globalIndex)}
                selected={globalIndex === selectedIndex}
                onClick={() => selectItem(globalIndex)}
                className={cn('font-mono flex items-center justify-between', {
                  'mb-1': isLast,
                })}
              >
                <span className="truncate">{`{{{${item.displayKey}}}}`}</span>
                {storage.onEditVariable && (
                  <div
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      popup?.[0]?.hide();
                      storage.onEditVariable?.({
                        displayKey: item.displayKey,
                        variableKey: item.variableKey,
                        fallbackValue: item.fallbackValue,
                      });
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    className="cursor-pointer"
                  >
                    <IconDots />
                  </div>
                )}
              </VariableDropdownItem>
            );
          })}
        </>
      )}

      {!hasAnyResults && (
        <div className="px-3 py-2 text-sm text-gray-11">No results</div>
      )}

      {hasCustomVariablesSystem && storage.onCreateVariable && (
        <div className="absolute left-0 right-0 bottom-0 bg-background rounded-b-2xl flex flex-col border-l border-r border-b border-gray-3">
          <DropdownMenu.Separator />
          <VariableDropdownItem
            ref={setItemRef(allItems.length)}
            selected={selectedIndex === allItems.length}
            onClick={handleCreateVariable}
            className="my-1"
          >
            <div className="flex flex-row gap-2 items-center">
              <PlusIcon className="size-4" />
              Create Variable
            </div>
          </VariableDropdownItem>
        </div>
      )}
    </VariableDropdownContent>
  );
};

function buildSuggestion(trigger: string): Omit<SuggestionOptions, 'editor'> {
  return {
    char: trigger,
    items: ({ query, editor }) => {
      if (!editor.storage.variable?.showContactVariables) {
        return [];
      }

      return CONTACT_VARIABLES.filter((item) => {
        if (typeof query === 'string' && query.length > 0) {
          const search = query.toLowerCase();
          return item.toLowerCase().includes(search);
        }

        return true;
      });
    },

    render: () => {
      let component: ReactRenderer;
      let popup: TippyInstance[] | null = null;
      let scrollHandler: (() => void) | null = null;

      return {
        onStart: (suggestionProps) => {
          component = new ReactRenderer(VariableList, {
            props: { props: suggestionProps, popup: null },
            editor: suggestionProps.editor,
          });

          if (!suggestionProps.clientRect) {
            return;
          }

          popup = tippy('body', {
            getReferenceClientRect:
              suggestionProps.clientRect as GetReferenceClientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });

          component.updateProps({ props: suggestionProps, popup });

          scrollHandler = () => {
            if (popup?.[0]) {
              popup[0].popperInstance?.update();
            }
          };
          window.addEventListener('scroll', scrollHandler, true);
        },

        onUpdate(updateProps) {
          component.updateProps({ props: updateProps, popup });

          if (!updateProps.clientRect) {
            return;
          }

          popup?.[0]?.setProps({
            getReferenceClientRect:
              updateProps.clientRect as unknown as GetReferenceClientRect,
          });
        },

        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup?.[0].hide();

            return true;
          }

          return (
            (
              component.ref as {
                onKeyDown?: (props: { event: KeyboardEvent }) => boolean;
              }
            )?.onKeyDown?.(props) ?? false
          );
        },

        onExit() {
          if (scrollHandler) {
            window.removeEventListener('scroll', scrollHandler, true);
          }
          popup?.[0].destroy();
          if (component) {
            component.destroy();
          }
        },
      };
    },
  };
}

export const Variable = Mention.extend({
  name: 'variable',
  inline: true,
  group: 'inline',
  marks: '_',

  addStorage() {
    return {
      customVariables: null,
      onCreateVariable: undefined,
      onCreateVariableWithoutInjection: undefined,
      onUpdateVariableFallback: undefined,
      onUpdateVariable: undefined,
      onAutoCreateVariable: undefined,
      onDeleteVariable: undefined,
      onRequestDeleteVariable: undefined,
      showContactVariables: true,
    };
  },

  addAttributes() {
    return {
      // @ts-expect-error'
      ...this.parent?.(),
      fallback: {
        default: '',
      },
      internal_new: {
        default: true,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable"]',
        getAttrs: (node: string | HTMLElement) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string | boolean> = {};

          const nodeContent = element.textContent;
          attrs.id = nodeContent;
          // Avoid opening the fallback value popup input when the variable is imported
          attrs.internal_new = false;

          return attrs;
        },
      },
      {
        tag: 'span[data-type="loop-item"]',
        getAttrs: (node: string | HTMLElement) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string | boolean> = {};

          const nodeContent = element.textContent;
          attrs.id = nodeContent;
          // Avoid opening the fallback value popup input when the variable is imported
          attrs.internal_new = false;

          return attrs;
        },
      },
      {
        tag: 'span[data-type="loop-variable"]',
        getAttrs: (node: string | HTMLElement) => {
          if (typeof node === 'string') {
            return false;
          }
          const element = node as HTMLElement;
          const attrs: Record<string, string | boolean> = {};

          const nodeContent = element.textContent;
          attrs.id = nodeContent;
          // Avoid opening the fallback value popup input when the variable is imported
          attrs.internal_new = false;

          return attrs;
        },
      },
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VariableNode);
  },

  addCommands() {
    return {
      // @ts-expect-error
      ...this.parent?.(),

      setVariableContext:
        (context: {
          customVariables?: Array<CustomVariable> | null;
          onCreateVariable?: () => void;
          onCreateVariableWithoutInjection?: () => void;
          onUpdateVariableFallback?: (
            variableKey: string,
            fallbackValue: string,
            originalValue: string,
          ) => void;
          onUpdateVariable?: OnUpdateVariableHandler;
          onAutoCreateVariable?: (variableKey: string) => Promise<void>;
          onDeleteVariable?: OnDeleteVariableHandler;
          onRequestDeleteVariable?: OnRequestDeleteVariableHandler;
          showContactVariables?: boolean;
        }) =>
        () => {
          Object.assign(this.storage, context);
          editorEventBus.dispatch('variables-updated', {
            customVariables: context.customVariables,
          });

          return true;
        },
    };
  },

  addInputRules() {
    return [
      new InputRule({
        find: /\{\{\{(\w+)\}\}\}$/,
        handler: ({ range, match }) => {
          if (!this.storage.onAutoCreateVariable) {
            return;
          }

          const variableKey = match[1];
          const variableId = `{{{${variableKey}}}}`;

          const existingVariable = this.storage.customVariables?.find(
            (v: CustomVariable) => v.key === variableKey,
          );

          this.editor.commands.insertContentAt(range, {
            type: 'variable',
            attrs: {
              id: variableId,
              label: null,
              fallback: existingVariable?.fallback_value || '',
              internal_new: false,
            },
          });

          this.storage.onAutoCreateVariable(variableKey);
        },
      }),
    ];
  },
}).configure({
  suggestions: [buildSuggestion('{{'), buildSuggestion('{{{')],
  renderLabel({ node }) {
    return `${node.attrs.label ?? node.attrs.id}`;
  },
});
