'use client';

import { InspectorBreadcrumb } from './breadcrumb';
import { InspectorDocument } from './document';
import { InspectorNode } from './node';
import { InspectorFocusScope, InspectorRoot } from './root';
import { InspectorText } from './text';

export const Inspector = {
  Root: InspectorRoot,
  Breadcrumb: InspectorBreadcrumb,
  Document: InspectorDocument,
  Node: InspectorNode,
  Text: InspectorText,
  FocusScope: InspectorFocusScope,
};

export type { InspectorDocumentProps } from './document';
export type { InspectorNodeContext, InspectorNodeProps } from './node';
export type { InspectorTextContext, InspectorTextProps } from './text';
