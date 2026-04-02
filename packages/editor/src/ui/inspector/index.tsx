'use client';

import { InspectorBreadcrumb } from './breadcrumb';
import { InspectorGlobal } from './controllers/global';
import { InspectorLocal } from './controllers/local';
import { InspectorText } from './controllers/text';
import { InspectorDocument } from './document';
import { InspectorProvider } from './provider';

export const Inspector = {
  Provider: InspectorProvider,
  Breadcrumb: InspectorBreadcrumb,
  Document: InspectorDocument,
  Global: InspectorGlobal,
  Local: InspectorLocal,
  Text: InspectorText,
};

export type { InspectorDocumentProps } from './document';
