'use client';

import { InspectorBreadcrumb } from './breadcrumb';
import { InspectorDocument } from './document';
import { InspectorProvider } from './provider';

export const Inspector = {
  Provider: InspectorProvider,
  Breadcrumb: InspectorBreadcrumb,
  Document: InspectorDocument,
};

export type { InspectorDocumentProps } from './document';
