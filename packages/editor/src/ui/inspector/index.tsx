'use client';

import { InspectorBreadcrumb } from './breadcrumb';
import { DefaultField } from './default-field';
import { InspectorDocument } from './document';
import { InspectorPanel } from './panel';
import { InspectorProvider } from './provider';

export const Inspector = {
  Provider: InspectorProvider,
  Breadcrumb: InspectorBreadcrumb,
  Panel: InspectorPanel,
  Document: InspectorDocument,
  DefaultField,
};

export type { InspectorDocumentProps } from './document';
export type {
  InspectorPanelEntry,
  PanelInputWithHandler,
} from './hooks/use-inspector-fields';
export { useInspectorFields } from './hooks/use-inspector-fields';
