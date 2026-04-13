import type * as React from 'react';

export interface LabelProps extends React.ComponentProps<'label'> {}

export function Label({ className, ...rest }: LabelProps) {
  // biome-ignore lint/a11y/noLabelWithoutControl: consumer provides htmlFor
  return <label data-re-inspector-label="" className={className} {...rest} />;
}
