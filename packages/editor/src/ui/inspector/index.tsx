'use client';

import { InspectorBreadcrumb } from './breadcrumb';
import { InspectorDocument } from './document';
import { InspectorNode } from './node';
import { InspectorProvider } from './provider';
import { InspectorText } from './text';

export const Inspector = {
  Provider: InspectorProvider,
  Breadcrumb: InspectorBreadcrumb,
  Document: InspectorDocument,
  Node: InspectorNode,
  Text: InspectorText,
};

export type { InspectorDocumentProps } from './document';
export type { InspectorNodeContext, InspectorNodeProps } from './node';
export type { InspectorTextContext, InspectorTextProps } from './text';
