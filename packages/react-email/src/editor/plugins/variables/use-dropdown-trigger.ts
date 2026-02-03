import * as React from 'react';
import type { MultiplayerTextFieldRef } from '@/components/broadcasts/multiplayer-text-field';

interface UseVariableDropdownTriggerProps {
  onUpdate: (value: string) => void;
}

export function useVariableDropdownTrigger({
  onUpdate,
}: UseVariableDropdownTriggerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState<number>(0);
  const [bracketStart, setBracketStart] = React.useState<number>(0);
  const inputRef = React.useRef<MultiplayerTextFieldRef>(null);
  const previousIsOpen = React.useRef(isOpen);

  React.useEffect(() => {
    if (previousIsOpen.current && !isOpen) {
      inputRef.current?.focus();
    }
    previousIsOpen.current = isOpen;
  }, [isOpen]);

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const cursorPos = event.target.selectionStart ?? 0;
      const textBeforeCursor = value.substring(0, cursorPos);

      const bracketMatch = textBeforeCursor.match(/\{\{\{?$/);

      if (bracketMatch) {
        setBracketStart(cursorPos - bracketMatch[0].length);
        setCursorPosition(cursorPos);
        setIsOpen(true);
      } else if (isOpen) {
        setIsOpen(false);
      }

      onUpdate(value);
    },
    [onUpdate, isOpen],
  );

  const handleVariableSelect = React.useCallback(
    (variable: string, onLiveBlocksUpdate: (value: string) => void) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      const newValue =
        input.value.substring(0, bracketStart) +
        variable +
        input.value.substring(cursorPosition);

      input.handleTextChange(newValue);

      const newCursorPos = bracketStart + variable.length;
      setTimeout(() => {
        input.setSelectionRange(newCursorPos, newCursorPos);
        input.focus();
      }, 0);

      onLiveBlocksUpdate(newValue);
      onUpdate(newValue);
    },
    [bracketStart, cursorPosition, onUpdate],
  );

  return {
    isOpen,
    setIsOpen,
    inputRef,
    handleChange,
    handleVariableSelect,
  };
}
