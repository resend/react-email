import { json } from '@codemirror/lang-json';
import { EditorView } from '@codemirror/view';
import { zodResolver } from '@hookform/resolvers/zod';
import CodeMirror from '@uiw/react-codemirror';
import { AnimatePresence, motion } from 'framer-motion';
import { useAction } from 'next-safe-action/hooks';
import { useTheme } from 'next-themes';
import * as React from 'react';
import {
  Controller,
  type SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { createVariable } from '@/actions/templates';
import { getActionErrorMessage } from '@/errors';
import { cn } from '@/lib/cn';
import {
  type CreateVariableSchema,
  createVariableSchema,
  type VariableType,
} from '@/schemas/templates';
import { Button } from '@/ui/button';
import * as Dialog from '@/ui/dialog';
import { SHORTCUTS_VALUES } from '@/ui/kbd';
import { Label } from '@/ui/label';
import * as Select from '@/ui/select';
import { TextField } from '@/ui/text-field';
import { showToast } from '@/ui/toast';
import { vesperInit } from '@/utils/codemirror-theme';
import type { CustomVariable } from './extension';

type FallbackValueInputProps = {
  variableType: VariableType;
  fallbackValue: string;
  setFallbackValue: (value: string) => void;
  theme?: string;
  error?: string;
};

function FallbackValueInput({
  variableType,
  fallbackValue,
  setFallbackValue,
  theme,
  error,
}: FallbackValueInputProps) {
  if (variableType === 'boolean') {
    return (
      <Select.Root value={fallbackValue} onValueChange={setFallbackValue}>
        <Select.Trigger id="fallback" state={error ? 'invalid' : 'normal'}>
          <Select.Value placeholder="Select a value" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="true">True</Select.Item>
          <Select.Item value="false">False</Select.Item>
        </Select.Content>
      </Select.Root>
    );
  }

  if (variableType === 'object' || variableType === 'list') {
    return (
      <div className="relative">
        <CodeMirror
          id="fallback"
          value={fallbackValue}
          onChange={setFallbackValue}
          placeholder={
            variableType === 'object'
              ? '{"key": "value", "nested": {"field": 123}}'
              : '["Item 1", "Item 2"]'
          }
          extensions={[json(), EditorView.lineWrapping]}
          basicSetup={{
            foldGutter: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            lineNumbers: false,
            searchKeymap: false,
          }}
          theme={vesperInit({
            theme: theme === 'dark' ? 'dark' : 'light',
            settings: {
              background: 'var(--gray-a2)',
              gutterBackground: 'transparent',
              lineHighlight: 'transparent',
            },
          })}
          className={cn(
            'bg-gray-a2 border border-gray-a3 placeholder:text-gray-7 text-gray-a10 focus-visible:ring-2 focus-visible:ring-gray-a3 w-full resize-none rounded-xl outline-hidden overflow-hidden',
            'focus-within:ring-gray-a2 focus-within:ring-2',
            '[&_.cm-editor]:outline-hidden [&_.cm-scroller]:px-1.5 [&_.cm-scroller]:py-0.5',
            error && 'border-red-6',
          )}
        />
        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <TextField.Error message={error} id="fallback-error" />
          </div>
        )}
      </div>
    );
  }

  if (variableType === 'number') {
    return (
      <TextField.Root>
        <TextField.Input
          id="fallback"
          type="number"
          value={fallbackValue}
          onChange={(e) => setFallbackValue(e.target.value)}
          placeholder="0"
          className="text-gray-9 no-spinner"
          state={error ? 'invalid' : 'normal'}
        />
        {error && (
          <TextField.Slot className="data-[side=right]:right-3">
            <TextField.Error message={error} id="fallback-error" />
          </TextField.Slot>
        )}
      </TextField.Root>
    );
  }

  return (
    <TextField.Root>
      <TextField.Input
        id="fallback"
        type="text"
        value={fallbackValue}
        onChange={(e) => setFallbackValue(e.target.value)}
        placeholder="Value that appears if the variable is empty"
        className="text-gray-9"
        state={error ? 'invalid' : 'normal'}
      />
      {error && (
        <TextField.Slot className="data-[side=right]:right-3">
          <TextField.Error message={error} id="fallback-error" />
        </TextField.Slot>
      )}
    </TextField.Root>
  );
}

interface CreateVariableModalProps {
  templateVersionId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mutate: () => void;
  onVariableCreated?: (variable: CustomVariable) => void;
  enableTemplateLanguage?: boolean;
}

export function CreateVariableModal({
  templateVersionId,
  open,
  onOpenChange,
  mutate,
  onVariableCreated,
  enableTemplateLanguage = false,
}: CreateVariableModalProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Content>
        <CreateVariableModalContent
          onOpenChange={onOpenChange}
          mutate={mutate}
          templateVersionId={templateVersionId}
          onVariableCreated={onVariableCreated}
          enableTemplateLanguage={enableTemplateLanguage}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}

type CreateVariableModalContentProps = {
  onOpenChange: (open: boolean) => void;
  mutate: () => void;
  templateVersionId: string;
  onVariableCreated?: (variable: CustomVariable) => void;
  enableTemplateLanguage?: boolean;
};

function CreateVariableModalContent({
  onOpenChange,
  mutate,
  templateVersionId,
  onVariableCreated,
  enableTemplateLanguage = false,
}: CreateVariableModalContentProps) {
  const { resolvedTheme } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const measureElementRef = React.useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = React.useState(111);

  const { handleSubmit, control, setValue, trigger, getValues, formState } =
    useForm<CreateVariableSchema>({
      resolver: zodResolver(createVariableSchema),
      mode: 'onBlur',
      reValidateMode: 'onBlur',
      defaultValues: {
        name: '',
        templateVersionId,
        type: 'string',
        fallbackValue: '',
      },
    });

  const [variableName, variableType] = useWatch({
    control,
    name: ['name', 'type'],
  });

  React.useEffect(() => {
    if (variableName && measureElementRef.current) {
      const width = measureElementRef.current.offsetWidth;
      setTextWidth(width);
    } else {
      setTextWidth(111);
    }
  }, [variableName]);

  const { execute, isPending } = useAction(createVariable, {
    onSuccess: ({ data }) => {
      onOpenChange(false);
      mutate();
      showToast({
        title: 'Variable created successfully',
        appearance: 'green',
      });

      if (data && onVariableCreated) {
        onVariableCreated(data);
      }
    },
    onError: ({ error }) => {
      showToast({
        title: getActionErrorMessage(error),
        appearance: 'red',
      });
    },
  });

  const onSubmit: SubmitHandler<CreateVariableSchema> = (data) => {
    execute({
      templateVersionId,
      name: data.name.trim(),
      type: data.type,
      fallbackValue: data.fallbackValue?.trim() || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      trigger().then((isValid: boolean) => {
        if (isValid) {
          const values = getValues();
          execute({
            templateVersionId,
            name: values.name.trim(),
            type: values.type,
            fallbackValue: values.fallbackValue?.trim() || undefined,
          });
        }
      });
    }
  };

  return (
    <>
      {/* Invisible element for measuring text width */}
      <span
        ref={measureElementRef}
        className="absolute invisible text-base sm:text-sm max-w-100 truncate whitespace-pre"
        aria-hidden="true"
      >
        {variableName}
      </span>

      <Dialog.Title>Create Variable</Dialog.Title>

      <div className="mt-6 flex flex-col gap-7">
        <form
          className="contents"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDownCapture={handleKeyDown}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-6 select-none font-mono z-10 pointer-events-none tracking-[-0.15rem] text-sm">
                    {'{{{'}
                  </div>
                  <TextField.Root>
                    <TextField.Input
                      ref={inputRef}
                      id="name"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="YOUR_VARIABLE"
                      className="pr-16"
                      state={fieldState.error ? 'invalid' : 'normal'}
                      style={{
                        paddingLeft: '35px',
                        paddingRight: '35px',
                      }}
                    />
                    <TextField.Slot className="data-[side=right]:right-3">
                      <AnimatePresence mode="wait" initial={false}>
                        {fieldState.error ? (
                          <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                          >
                            <TextField.Error
                              message={fieldState.error.message ?? ''}
                              id="name-error"
                            />
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </TextField.Slot>
                  </TextField.Root>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 text-gray-6 select-none font-mono z-10 pointer-events-none tracking-[-0.15rem] text-sm"
                    style={{
                      left: `${Math.min(35 + textWidth + 5, inputRef.current?.offsetWidth ? inputRef.current.offsetWidth - 32 : 35 + textWidth + 5)}px`,
                    }}
                  >
                    {'}}}'}
                  </div>
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="type">Type</Label>
            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <div className="flex items-center gap-2">
                  <Select.Root
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setValue('fallbackValue', '');
                    }}
                  >
                    <Select.Trigger
                      id="type"
                      state={fieldState.error ? 'invalid' : 'normal'}
                    >
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="string">String</Select.Item>
                      <Select.Item value="number">Number</Select.Item>
                      {enableTemplateLanguage && (
                        <>
                          <Select.Item value="boolean">Boolean</Select.Item>
                          <Select.Item value="object">Object</Select.Item>
                          <Select.Item value="list">List</Select.Item>
                        </>
                      )}
                    </Select.Content>
                  </Select.Root>
                  <AnimatePresence>
                    {fieldState.error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <TextField.Error
                          message={fieldState.error.message ?? ''}
                          id="type-error"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="fallback">Fallback value</Label>
            <Controller
              control={control}
              name="fallbackValue"
              render={({ field, fieldState }) => (
                <FallbackValueInput
                  variableType={variableType}
                  fallbackValue={field.value || ''}
                  setFallbackValue={field.onChange}
                  theme={resolvedTheme}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Button
              appearance="white"
              state={
                isPending
                  ? 'loading'
                  : formState.isValid
                    ? 'normal'
                    : 'disabled'
              }
              shortcut={[SHORTCUTS_VALUES.CMD, SHORTCUTS_VALUES.ENTER]}
              type="submit"
            >
              Create
            </Button>

            <Dialog.Close asChild>
              <Button
                appearance="gray"
                shortcut={SHORTCUTS_VALUES.ESC}
                disabled={isPending}
              >
                Cancel
              </Button>
            </Dialog.Close>
          </div>
        </form>
      </div>
    </>
  );
}
