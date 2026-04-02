import type * as React from 'react';

function SelectRoot({
  children,
  value,
  defaultValue,
  onValueChange,
  ...rest
}: React.ComponentProps<'select'> & {
  onValueChange?: (value: string) => void;
}) {
  return (
    <select
      data-re-inspector-select=""
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...rest}
    >
      {children}
    </select>
  );
}

function SelectTrigger({ children, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div data-re-inspector-select-trigger="" {...rest}>
      {children}
    </div>
  );
}

function SelectValue(props: React.ComponentProps<'span'>) {
  return <span {...props} />;
}

function SelectContent({ children, ...rest }: React.ComponentProps<'div'>) {
  return (
    <div data-re-inspector-select-content="" {...rest}>
      {children}
    </div>
  );
}

function SelectItem(props: React.ComponentProps<'option'>) {
  return <option {...props} />;
}

export const Root = SelectRoot;
export const Trigger = SelectTrigger;
export const Value = SelectValue;
export const Content = SelectContent;
export const Item = SelectItem;
