import type * as React from 'react';

function SelectRoot({ children, ...rest }: React.ComponentProps<'select'>) {
  return (
    <select data-re-inspector-select="" {...rest}>
      {children}
    </select>
  );
}

function SelectItem(props: React.ComponentProps<'option'>) {
  return <option {...props} />;
}

export const Root = SelectRoot;
export const Item = SelectItem;
