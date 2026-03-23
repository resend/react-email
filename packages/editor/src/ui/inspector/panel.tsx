import * as React from 'react';
import type { PanelGroup } from '../../plugins/email-theming/types';
import { useInspectorFields, type PanelInputWithHandler } from './hooks/use-inspector-fields';

export interface InspectorPanelProps {
  children: (
    group: PanelGroup,
    fields: PanelInputWithHandler[],
  ) => React.ReactNode;
}

export function InspectorPanel({ children }: InspectorPanelProps) {
  const entries = useInspectorFields();

  if (!entries) {
    return null;
  }

  return (
    <>
      {entries.map(({ group, fields }) => (
        <React.Fragment key={group.id ?? group.title}>
          {children(group, fields)}
        </React.Fragment>
      ))}
    </>
  );
}
