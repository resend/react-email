'use client';

import { InspectorBreadcrumb } from './breadcrumb';
import { DefaultField } from './default-field';
import { InspectorPanel } from './panel';
import { InspectorRoot } from './root';

export const Inspector = {
  Root: InspectorRoot,
  Breadcrumb: InspectorBreadcrumb,
  Panel: InspectorPanel,
  DefaultField,
};

export type { InspectorPanelEntry, PanelInputWithHandler } from './hooks/use-inspector-fields';
export { useInspectorFields } from './hooks/use-inspector-fields';
