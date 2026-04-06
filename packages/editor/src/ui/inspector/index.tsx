'use client';

import { InspectorBreadcrumb } from './breadcrumb';
import { InspectorDocument } from './document';
import { InspectorNode } from './node';
import { InspectorProvider } from './provider';
import { InspectorAttributes } from './sections/attributes';
import { InspectorBackground } from './sections/background';
import { InspectorBorder } from './sections/border';
import { InspectorLink } from './sections/link';
import { InspectorPadding } from './sections/padding';
import { InspectorSize } from './sections/size';
import { InspectorTypography } from './sections/typography';
import { InspectorText } from './text';

export const Inspector = {
  Provider: InspectorProvider,
  Breadcrumb: InspectorBreadcrumb,
  Document: InspectorDocument,
  Node: InspectorNode,
  Text: InspectorText,
  Attributes: InspectorAttributes,
  Background: InspectorBackground,
  Border: InspectorBorder,
  Link: InspectorLink,
  Padding: InspectorPadding,
  Size: InspectorSize,
  Typography: InspectorTypography,
};

export type { InspectorDocumentProps } from './document';
export type { InspectorNodeContext, InspectorNodeProps } from './node';
export type { InspectorTextContext, InspectorTextProps } from './text';
