'use client';

import { InspectorBreadcrumb } from './breadcrumb';
import { InspectorDocument } from './document';
import { InspectorNode } from './node';
import { InspectorRoot } from './root';
import { AttributesSection } from './sections/attributes';
import { BackgroundSection } from './sections/background';
import { BorderSection } from './sections/border';
import { LinkSection } from './sections/link';
import { PaddingSection } from './sections/padding';
import { SizeSection } from './sections/size';
import { TypographySection } from './sections/typography';
import { InspectorText } from './text';

export const Inspector = {
  Root: InspectorRoot,
  Breadcrumb: InspectorBreadcrumb,
  Document: InspectorDocument,
  Node: InspectorNode,
  Text: InspectorText,
  Attributes: AttributesSection,
  Background: BackgroundSection,
  Border: BorderSection,
  Link: LinkSection,
  Padding: PaddingSection,
  Size: SizeSection,
  Typography: TypographySection,
};

export type { NodeMeta } from './config/node-meta';
export { getNodeMeta } from './config/node-meta';
export type { InspectorDocumentProps } from './document';
export type { InspectorNodeContext, InspectorNodeProps } from './node';
export type { InspectorTextContext, InspectorTextProps } from './text';
