import * as React from 'react';
import type { ButtonState } from '@/ui/button';
import { Button } from '@/ui/button';
import { CopyButton } from '@/ui/copy-button';
import * as Dialog from '@/ui/dialog';
import { SHORTCUTS_VALUES } from '@/ui/kbd';
import { Tag } from '@/ui/tag';
import { Text } from '@/ui/text';
import { TextField } from '@/ui/text-field';
import { showToast } from '@/ui/toast';
import type { OnDeleteVariableHandler } from './extension';

interface DeleteVariableModalProps {
  variableKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteVariable: OnDeleteVariableHandler;
  onCancel?: () => void;
  hideOverlay?: boolean;
}

export function DeleteVariableModal({
  variableKey,
  open,
  onOpenChange,
  onDeleteVariable,
  onCancel,
  hideOverlay,
}: DeleteVariableModalProps) {
  const deleteInputRef = React.useRef<HTMLInputElement>(null);
  const [confirmationText, setConfirmationText] = React.useState('');
  const [buttonState, setButtonState] = React.useState<ButtonState>('disabled');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [stableVariableKey, setStableVariableKey] = React.useState(variableKey);

  React.useEffect(() => {
    if (variableKey) {
      setStableVariableKey(variableKey);
    }
  }, [variableKey]);

  const handleConfirmationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setConfirmationText(value);
    setButtonState(value === stableVariableKey ? 'normal' : 'disabled');
  };

  const handleDelete = async () => {
    if (confirmationText !== stableVariableKey) {
      return;
    }

    setIsDeleting(true);
    setButtonState('loading');
    try {
      await onDeleteVariable(stableVariableKey);
      resetState();
      onOpenChange(false);
      showToast({
        title: `Variable "${stableVariableKey}" deleted successfully`,
        appearance: 'green',
      });
    } catch (error) {
      showToast({
        title: (error as Error).message,
        appearance: 'red',
      });
      resetState();
      onOpenChange(false);
    }
  };

  const resetState = () => {
    setConfirmationText('');
    setButtonState('disabled');
    setIsDeleting(false);
  };

  const handleCancel = () => {
    resetState();
    onCancel?.();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetState();
      if (onCancel) {
        onCancel();
      } else {
        onOpenChange(false);
      }
      return;
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content
        hideOverlay={hideOverlay}
        onOpenAutoFocus={(event: Event) => {
          event.preventDefault();
          deleteInputRef.current?.focus();
        }}
      >
        <Dialog.Title>Delete variable</Dialog.Title>

        <Text className="mt-6 block" size="2">
          We'll delete this variable and automatically remove it everywhere it
          appears in this template.
        </Text>
        <Text color="red" size="2" weight="bold">
          This can not be undone.
        </Text>
        <Text className="mt-4 block" size="2">
          Type{' '}
          <Tag className="inline-flex max-w-80 pr-1 text-sm" size="1">
            <span className="truncate text-slate-12">{stableVariableKey}</span>
            <CopyButton value={stableVariableKey} />
          </Tag>{' '}
          to confirm.
        </Text>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleDelete();
          }}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              handleDelete();
            }
          }}
        >
          <div className="mt-4 flex w-full flex-col gap-1">
            <TextField.Input
              ref={deleteInputRef}
              onChange={handleConfirmationChange}
              value={confirmationText}
              placeholder="Enter variable name"
            />
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Button
              appearance="red"
              state={buttonState}
              type="submit"
              shortcut={SHORTCUTS_VALUES.ENTER}
            >
              Delete variable
            </Button>
            <Button
              appearance="gray"
              shortcut={SHORTCUTS_VALUES.ESC}
              onClick={handleCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
