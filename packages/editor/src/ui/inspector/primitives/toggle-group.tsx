import * as React from 'react';

export interface RootProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface ItemProps extends React.ComponentProps<'button'> {
  value: string;
}

const ToggleGroupContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

export function Root({ value, onValueChange, children, className }: RootProps) {
  return (
    <ToggleGroupContext.Provider value={{ value, onValueChange }}>
      {/* biome-ignore lint/a11y/useSemanticElements: div with role is intentional for styling */}
      <div data-re-inspector-toggle-group="" className={className} role="group">
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export function Item({ value, children, ...rest }: ItemProps) {
  const ctx = React.useContext(ToggleGroupContext);
  const isActive = ctx?.value === value;
  return (
    <button
      type="button"
      data-re-inspector-toggle-item=""
      {...(isActive ? { 'data-active': '' } : {})}
      aria-pressed={isActive}
      {...rest}
      onClick={(e) => {
        ctx?.onValueChange(value);
        rest.onClick?.(e);
      }}
    >
      {children}
    </button>
  );
}
