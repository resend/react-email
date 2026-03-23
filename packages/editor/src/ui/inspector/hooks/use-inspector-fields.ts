import type { PanelGroup } from '../../../plugins/email-theming/types';
import { useInspector } from '../root';
import { getDocInspectorData } from './get-doc-inspector-data';

/** A PanelGroup input with an onChange callback attached. */
export type PanelInputWithHandler = PanelGroup['inputs'][number] & {
  onChange: (value: string | number) => void;
};

export interface InspectorPanelEntry {
  group: PanelGroup;
  fields: PanelInputWithHandler[];
}

export function useInspectorFields(): InspectorPanelEntry[] | null {
  const { inspectorTarget } = useInspector();
  const docData = getDocInspectorData();

  if (inspectorTarget === 'doc') {
    return docData;
  }

  // Other modes not yet implemented
  return null;
}
