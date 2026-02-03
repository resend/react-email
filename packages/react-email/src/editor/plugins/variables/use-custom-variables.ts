import * as React from 'react';
import { editorEventBus } from '../../core/event-bus';
import type { CustomVariable } from './extension';

export function useCustomVariables(
  storageVariables: Array<CustomVariable> | null = [],
): Array<CustomVariable> {
  const [customVariables, setCustomVariables] = React.useState<
    Array<CustomVariable>
  >(storageVariables || []);

  React.useEffect(() => {
    const subscription = editorEventBus.on('variables-updated', (event) => {
      setCustomVariables((prev) =>
        event.customVariables !== undefined
          ? (event.customVariables ?? [])
          : prev,
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  return customVariables;
}
