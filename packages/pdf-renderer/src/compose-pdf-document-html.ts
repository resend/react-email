import type { DocumentContentNode } from '@asym/pdf-template-schema';

export type PdfDocumentCssMedia = 'all' | 'print';

export interface PdfDocumentCssRequirement {
  readonly id: string;
  readonly media: PdfDocumentCssMedia;
  readonly css: string;
}

export type PdfDocumentRenderWarningCode =
  | 'empty_document'
  | 'invalid_document'
  | 'missing_attribute'
  | 'unknown_mark'
  | 'unknown_node'
  | 'unsupported_mark'
  | 'unsupported_node';

export type PdfDocumentRenderWarningSeverity = 'warning' | 'error';

export interface PdfDocumentRenderWarning {
  readonly code: PdfDocumentRenderWarningCode;
  readonly severity: PdfDocumentRenderWarningSeverity;
  readonly message: string;
  readonly path: readonly string[];
  readonly nodeType?: string;
  readonly markType?: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

export interface PdfDocumentAssetReference {
  readonly src: string;
  readonly altText?: string;
  readonly role?: string;
  readonly width?: string;
  readonly height?: string;
  readonly path: readonly string[];
}

export interface PdfDocumentVariableUsage {
  readonly key: string;
  readonly formatter?: string;
  readonly path: readonly string[];
}

export interface PdfDocumentMark {
  readonly type: string;
  readonly attrs?: Readonly<Record<string, unknown>>;
}

export interface PdfDocumentNodeRendererContext {
  readonly node: DocumentContentNode;
  readonly path: readonly string[];
  readonly childrenHtml: string;
  readonly renderChildren: (
    children: readonly unknown[] | undefined,
    path: readonly string[],
  ) => string;
  readonly addWarning: (warning: PdfDocumentRenderWarning) => void;
  readonly addAsset: (asset: PdfDocumentAssetReference) => void;
  readonly addVariable: (usage: PdfDocumentVariableUsage) => void;
}

export interface PdfDocumentNodeRenderer {
  readonly type: string;
  readonly render: (context: PdfDocumentNodeRendererContext) => string;
}

export interface PdfDocumentMarkRendererContext {
  readonly mark: PdfDocumentMark;
  readonly node: DocumentContentNode;
  readonly path: readonly string[];
  readonly childrenHtml: string;
  readonly addWarning: (warning: PdfDocumentRenderWarning) => void;
}

export interface PdfDocumentMarkRenderer {
  readonly type: string;
  readonly render: (context: PdfDocumentMarkRendererContext) => string;
}

export interface ComposePdfDocumentHtmlInput {
  readonly document: DocumentContentNode;
  readonly nodeRenderers?: readonly PdfDocumentNodeRenderer[];
  readonly markRenderers?: readonly PdfDocumentMarkRenderer[];
}

export interface ComposePdfDocumentHtmlResult {
  readonly html: string;
  readonly cssRequirements: readonly PdfDocumentCssRequirement[];
  readonly warnings: readonly PdfDocumentRenderWarning[];
  readonly assets: readonly PdfDocumentAssetReference[];
  readonly variables: readonly PdfDocumentVariableUsage[];
}

type AttributeMap = Record<string, string>;
type StyleMap = Record<string, string>;

interface RenderState {
  readonly nodeRenderers: ReadonlyMap<string, PdfDocumentNodeRenderer>;
  readonly markRenderers: ReadonlyMap<string, PdfDocumentMarkRenderer>;
  readonly warnings: PdfDocumentRenderWarning[];
  readonly assets: PdfDocumentAssetReference[];
  readonly variables: PdfDocumentVariableUsage[];
}

const phase09Css = [
  '.pdf-button{display:inline-block;text-decoration:none;}',
  '.pdf-column{box-sizing:border-box;display:table-cell;vertical-align:top;width:50%;}',
  '.pdf-columns{box-sizing:border-box;display:table;width:100%;}',
  '.pdf-image{max-width:100%;}',
  '.pdf-table{border-collapse:collapse;width:100%;}',
  '.pdf-variable{white-space:nowrap;}',
].join('\n');

const phase09CssRequirement: PdfDocumentCssRequirement = {
  id: 'phase-09-document-serializer',
  media: 'all',
  css: phase09Css,
};

export function composePdfDocumentHtml(
  input: ComposePdfDocumentHtmlInput,
): ComposePdfDocumentHtmlResult {
  const warnings: PdfDocumentRenderWarning[] = [];
  const assets: PdfDocumentAssetReference[] = [];
  const variables: PdfDocumentVariableUsage[] = [];
  const nodeRenderers = createNodeRendererMap(input.nodeRenderers);
  const markRenderers = createMarkRendererMap(input.markRenderers);
  const state: RenderState = {
    nodeRenderers,
    markRenderers,
    warnings,
    assets,
    variables,
  };

  if (!isDocumentNode(input.document)) {
    warnings.push({
      code: 'invalid_document',
      severity: 'error',
      message:
        'Phase 09 composePdfDocumentHtml requires a structured document node.',
      path: [],
    });

    return {
      html: '',
      cssRequirements: [],
      warnings,
      assets,
      variables,
    };
  }

  if (isDocumentEmpty(input.document)) {
    warnings.push({
      code: 'empty_document',
      severity: 'warning',
      message: 'Phase 09 composePdfDocumentHtml received an empty document.',
      path: [],
      nodeType: input.document.type,
    });
  }

  const html = renderNode(input.document, [], state);

  return {
    html,
    cssRequirements: [phase09CssRequirement],
    warnings,
    assets,
    variables,
  };
}

function createNodeRendererMap(
  customRenderers: readonly PdfDocumentNodeRenderer[] | undefined,
): ReadonlyMap<string, PdfDocumentNodeRenderer> {
  const renderers = new Map<string, PdfDocumentNodeRenderer>();

  for (const renderer of builtInNodeRenderers) {
    renderers.set(renderer.type, renderer);
  }

  for (const renderer of customRenderers ?? []) {
    renderers.set(renderer.type, renderer);
  }

  return renderers;
}

function createMarkRendererMap(
  customRenderers: readonly PdfDocumentMarkRenderer[] | undefined,
): ReadonlyMap<string, PdfDocumentMarkRenderer> {
  const renderers = new Map<string, PdfDocumentMarkRenderer>();

  for (const renderer of builtInMarkRenderers) {
    renderers.set(renderer.type, renderer);
  }

  for (const renderer of customRenderers ?? []) {
    renderers.set(renderer.type, renderer);
  }

  return renderers;
}

function renderNode(
  value: unknown,
  path: readonly string[],
  state: RenderState,
): string {
  if (!isDocumentNode(value)) {
    state.warnings.push({
      code: 'invalid_document',
      severity: 'error',
      message: 'Phase 09 serializer skipped an invalid document node.',
      path,
    });
    return '';
  }

  if (value.type === 'text') {
    return renderTextNode(value, path, state);
  }

  const childrenHtml = renderChildren(value.content, path, state);
  const renderer = state.nodeRenderers.get(value.type);

  if (renderer) {
    return renderer.render({
      node: value,
      path,
      childrenHtml,
      renderChildren: (children, childPath) =>
        renderChildren(children, childPath, state),
      addWarning: (warning) => {
        state.warnings.push(warning);
      },
      addAsset: (asset) => {
        state.assets.push(asset);
      },
      addVariable: (usage) => {
        state.variables.push(usage);
      },
    });
  }

  if (hasRenderableChildren(value)) {
    state.warnings.push({
      code: 'unknown_node',
      severity: 'warning',
      message: `Phase 09 serializer rendered children for unknown node "${value.type}".`,
      path,
      nodeType: value.type,
    });
    return childrenHtml;
  }

  state.warnings.push({
    code: 'unsupported_node',
    severity: 'warning',
    message: `Phase 09 serializer omitted unsupported leaf node "${value.type}".`,
    path,
    nodeType: value.type,
  });
  return '';
}

function renderChildren(
  children: readonly unknown[] | undefined,
  path: readonly string[],
  state: RenderState,
): string {
  if (!children) {
    return '';
  }

  return children
    .map((child, index) =>
      renderNode(child, [...path, 'content', String(index)], state),
    )
    .join('');
}

function renderTextNode(
  node: DocumentContentNode,
  path: readonly string[],
  state: RenderState,
): string {
  let renderedText = escapeHtml(node.text ?? '');

  for (const mark of getNodeMarks(node)) {
    const renderer = state.markRenderers.get(mark.type);

    if (!renderer) {
      state.warnings.push({
        code: 'unknown_mark',
        severity: 'warning',
        message: `Phase 09 serializer ignored unknown mark "${mark.type}".`,
        path,
        markType: mark.type,
      });
      continue;
    }

    renderedText = renderer.render({
      mark,
      node,
      path,
      childrenHtml: renderedText,
      addWarning: (warning) => {
        state.warnings.push(warning);
      },
    });
  }

  return renderedText;
}

function renderDoc(context: PdfDocumentNodeRendererContext): string {
  return context.childrenHtml;
}

function renderBody(context: PdfDocumentNodeRendererContext): string {
  return renderElement(
    'div',
    getElementAttributes(context.node, {
      className: 'pdf-document-body',
    }),
    context.childrenHtml,
  );
}

function renderContainer(context: PdfDocumentNodeRendererContext): string {
  return renderElement(
    'div',
    getElementAttributes(context.node, {
      className: 'pdf-document-container',
    }),
    context.childrenHtml,
  );
}

function renderSection(context: PdfDocumentNodeRendererContext): string {
  return renderElement(
    'section',
    getElementAttributes(context.node, {
      className: 'pdf-document-section',
    }),
    context.childrenHtml,
  );
}

function renderParagraph(context: PdfDocumentNodeRendererContext): string {
  const alignment = readStringAttribute(context.node.attrs, 'alignment');
  const alignmentStyle = alignment ? { 'text-align': alignment } : undefined;

  return renderElement(
    'p',
    getElementAttributes(context.node, {
      excludedAttributeNames: ['alignment'],
      extraStyle: alignmentStyle,
    }),
    context.childrenHtml,
  );
}

function renderHeading(context: PdfDocumentNodeRendererContext): string {
  const level = clampHeadingLevel(
    readNumberAttribute(context.node.attrs, 'level'),
  );

  return renderElement(
    `h${level}`,
    getElementAttributes(context.node, {
      excludedAttributeNames: ['level'],
    }),
    context.childrenHtml,
  );
}

function renderImage(context: PdfDocumentNodeRendererContext): string {
  const src = readStringAttribute(context.node.attrs, 'src');

  if (!src) {
    context.addWarning({
      code: 'missing_attribute',
      severity: 'warning',
      message: 'Phase 09 image node is missing a src attribute.',
      path: context.path,
      nodeType: context.node.type,
      details: { attribute: 'src' },
    });
    return '';
  }

  const altText =
    readStringAttribute(context.node.attrs, 'alt') ??
    readStringAttribute(context.node.attrs, 'altText');
  const width = readScalarAttribute(context.node.attrs, 'width');
  const height = readScalarAttribute(context.node.attrs, 'height');
  const role = readStringAttribute(context.node.attrs, 'role');
  const attributes: AttributeMap = {
    ...getElementAttributes(context.node, {
      className: 'pdf-image',
      excludedAttributeNames: [
        'alignment',
        'alt',
        'altText',
        'height',
        'role',
        'src',
        'width',
      ],
    }),
    src,
  };

  if (altText !== undefined) {
    attributes.alt = altText;
  }

  if (width !== undefined) {
    attributes.width = width;
  }

  if (height !== undefined) {
    attributes.height = height;
  }

  context.addAsset({
    src,
    altText,
    role,
    width,
    height,
    path: context.path,
  });

  return renderElement('img', attributes, '', true);
}

function renderButton(context: PdfDocumentNodeRendererContext): string {
  const href = readStringAttribute(context.node.attrs, 'href');
  const alignment = readStringAttribute(context.node.attrs, 'alignment');
  const alignmentStyle = alignment ? { 'text-align': alignment } : undefined;

  if (!href) {
    context.addWarning({
      code: 'missing_attribute',
      severity: 'warning',
      message: 'Phase 09 button node is missing an href attribute.',
      path: context.path,
      nodeType: context.node.type,
      details: { attribute: 'href' },
    });

    return renderElement(
      'span',
      getElementAttributes(context.node, {
        className: 'pdf-button',
        excludedAttributeNames: ['alignment', 'href'],
        extraStyle: alignmentStyle,
      }),
      context.childrenHtml,
    );
  }

  return renderElement(
    'a',
    {
      ...getElementAttributes(context.node, {
        className: 'pdf-button',
        excludedAttributeNames: ['alignment', 'href'],
        extraStyle: alignmentStyle,
      }),
      href,
    },
    context.childrenHtml,
  );
}

function renderColumns(context: PdfDocumentNodeRendererContext): string {
  const columnCount = Array.isArray(context.node.content)
    ? context.node.content.length
    : 0;
  const className =
    columnCount > 0 ? `pdf-columns pdf-columns--${columnCount}` : 'pdf-columns';

  return renderElement(
    'div',
    getElementAttributes(context.node, { className }),
    context.childrenHtml,
  );
}

function renderColumn(context: PdfDocumentNodeRendererContext): string {
  return renderElement(
    'div',
    getElementAttributes(context.node, { className: 'pdf-column' }),
    context.childrenHtml,
  );
}

function renderTable(context: PdfDocumentNodeRendererContext): string {
  const alignment = readStringAttribute(context.node.attrs, 'alignment');
  const alignmentStyle = alignment
    ? { margin: alignmentToMargin(alignment) }
    : undefined;

  return renderElement(
    'table',
    getElementAttributes(context.node, {
      className: 'pdf-table',
      excludedAttributeNames: ['alignment'],
      extraStyle: alignmentStyle,
    }),
    context.childrenHtml,
  );
}

function renderTableRow(context: PdfDocumentNodeRendererContext): string {
  return renderElement(
    'tr',
    getElementAttributes(context.node),
    context.childrenHtml,
  );
}

function renderTableCell(context: PdfDocumentNodeRendererContext): string {
  return renderTableCellElement('td', context);
}

function renderTableHeader(context: PdfDocumentNodeRendererContext): string {
  return renderTableCellElement('th', context);
}

function renderTableCellElement(
  tagName: 'td' | 'th',
  context: PdfDocumentNodeRendererContext,
): string {
  const alignment = readStringAttribute(context.node.attrs, 'alignment');
  const alignmentStyle = alignment ? { 'text-align': alignment } : undefined;

  return renderElement(
    tagName,
    getElementAttributes(context.node, {
      excludedAttributeNames: ['alignment'],
      extraStyle: alignmentStyle,
    }),
    context.childrenHtml,
  );
}

function renderVariable(context: PdfDocumentNodeRendererContext): string {
  const key =
    readStringAttribute(context.node.attrs, 'key') ??
    readStringAttribute(context.node.attrs, 'variableKey');

  if (!key) {
    context.addWarning({
      code: 'missing_attribute',
      severity: 'warning',
      message: 'Phase 09 variable node is missing a key attribute.',
      path: context.path,
      nodeType: context.node.type,
      details: { attribute: 'key' },
    });
    return '';
  }

  const formatter = readStringAttribute(context.node.attrs, 'formatter');

  context.addVariable({
    key,
    formatter,
    path: context.path,
  });

  return renderElement(
    'span',
    {
      class: 'pdf-variable',
      'data-variable-key': key,
      ...(formatter ? { 'data-variable-formatter': formatter } : {}),
    },
    '',
  );
}

function renderLinkMark(context: PdfDocumentMarkRendererContext): string {
  const href = readStringAttribute(context.mark.attrs, 'href');

  if (!href) {
    context.addWarning({
      code: 'missing_attribute',
      severity: 'warning',
      message: 'Phase 09 link mark is missing an href attribute.',
      path: context.path,
      markType: context.mark.type,
      details: { attribute: 'href' },
    });
    return context.childrenHtml;
  }

  return renderElement(
    'a',
    getMarkAttributes(context.mark, {
      href,
      excludedAttributeNames: ['href'],
    }),
    context.childrenHtml,
  );
}

function renderStrongMark(context: PdfDocumentMarkRendererContext): string {
  return renderElement(
    'strong',
    getMarkAttributes(context.mark),
    context.childrenHtml,
  );
}

function renderEmphasisMark(context: PdfDocumentMarkRendererContext): string {
  return renderElement(
    'em',
    getMarkAttributes(context.mark),
    context.childrenHtml,
  );
}

function renderUnderlineMark(context: PdfDocumentMarkRendererContext): string {
  return renderElement(
    'span',
    getMarkAttributes(context.mark, {
      extraStyle: { 'text-decoration': 'underline' },
    }),
    context.childrenHtml,
  );
}

const builtInNodeRenderers: readonly PdfDocumentNodeRenderer[] = [
  { type: 'doc', render: renderDoc },
  { type: 'body', render: renderBody },
  { type: 'container', render: renderContainer },
  { type: 'section', render: renderSection },
  { type: 'paragraph', render: renderParagraph },
  { type: 'heading', render: renderHeading },
  { type: 'image', render: renderImage },
  { type: 'button', render: renderButton },
  { type: 'twoColumns', render: renderColumns },
  { type: 'threeColumns', render: renderColumns },
  { type: 'fourColumns', render: renderColumns },
  { type: 'columnsColumn', render: renderColumn },
  { type: 'table', render: renderTable },
  { type: 'tableRow', render: renderTableRow },
  { type: 'tableCell', render: renderTableCell },
  { type: 'tableHeader', render: renderTableHeader },
  { type: 'variable', render: renderVariable },
  { type: 'variableReference', render: renderVariable },
];

const builtInMarkRenderers: readonly PdfDocumentMarkRenderer[] = [
  { type: 'link', render: renderLinkMark },
  { type: 'bold', render: renderStrongMark },
  { type: 'italic', render: renderEmphasisMark },
  { type: 'underline', render: renderUnderlineMark },
];

function isDocumentNode(value: unknown): value is DocumentContentNode {
  if (!isRecord(value)) {
    return false;
  }

  return typeof value.type === 'string' && value.type.length > 0;
}

function isDocumentEmpty(document: DocumentContentNode): boolean {
  return (
    document.type === 'doc' &&
    (!document.content || document.content.length === 0)
  );
}

function hasRenderableChildren(node: DocumentContentNode): boolean {
  return Array.isArray(node.content) && node.content.length > 0;
}

function getNodeMarks(node: DocumentContentNode): readonly PdfDocumentMark[] {
  if (!Array.isArray(node.marks)) {
    return [];
  }

  return node.marks.filter(isPdfDocumentMark);
}

function isPdfDocumentMark(value: unknown): value is PdfDocumentMark {
  return (
    isRecord(value) && typeof value.type === 'string' && value.type.length > 0
  );
}

function getElementAttributes(
  node: DocumentContentNode,
  options: {
    readonly className?: string;
    readonly excludedAttributeNames?: readonly string[];
    readonly extraStyle?: Readonly<Record<string, string>> | undefined;
  } = {},
): AttributeMap {
  return getAttributes(node.attrs, options);
}

function getMarkAttributes(
  mark: PdfDocumentMark,
  options: {
    readonly excludedAttributeNames?: readonly string[];
    readonly extraStyle?: Readonly<Record<string, string>> | undefined;
    readonly href?: string;
  } = {},
): AttributeMap {
  return getAttributes(mark.attrs, options);
}

function getAttributes(
  sourceAttributes: Readonly<Record<string, unknown>> | undefined,
  options: {
    readonly className?: string;
    readonly excludedAttributeNames?: readonly string[];
    readonly extraStyle?: Readonly<Record<string, string>> | undefined;
    readonly href?: string;
  },
): AttributeMap {
  const attributes: AttributeMap = {};
  const excludedAttributeNames = new Set([
    'style',
    ...(options.excludedAttributeNames ?? []),
  ]);

  if (sourceAttributes) {
    for (const [name, value] of Object.entries(sourceAttributes)) {
      if (excludedAttributeNames.has(name)) {
        continue;
      }

      const normalizedName = normalizeAttributeName(name);
      const stringValue = stringifyAttributeValue(value);

      if (stringValue !== undefined && isSafeAttributeName(normalizedName)) {
        attributes[normalizedName] = stringValue;
      }
    }
  }

  if (options.href) {
    attributes.href = options.href;
  }

  const sourceClass = readStringAttribute(sourceAttributes, 'class');
  const sourceClassName = readStringAttribute(sourceAttributes, 'className');
  const className = joinClassNames(
    options.className,
    sourceClass,
    sourceClassName,
  );

  if (className) {
    attributes.class = className;
  }

  const style = mergeStyles(
    parseStyleAttribute(sourceAttributes?.style),
    options.extraStyle,
  );

  if (Object.keys(style).length > 0) {
    attributes.style = serializeStyle(style);
  }

  return attributes;
}

function mergeStyles(
  ...styleInputs: readonly (Readonly<Record<string, string>> | undefined)[]
): StyleMap {
  const style: StyleMap = {};

  for (const styleInput of styleInputs) {
    if (!styleInput) {
      continue;
    }

    for (const [key, value] of Object.entries(styleInput)) {
      const normalizedKey = normalizeStyleName(key);

      if (normalizedKey && value.trim()) {
        style[normalizedKey] = value.trim();
      }
    }
  }

  return style;
}

function parseStyleAttribute(value: unknown): StyleMap {
  if (typeof value === 'string') {
    return parseInlineStyle(value);
  }

  if (!isRecord(value)) {
    return {};
  }

  const style: StyleMap = {};

  for (const [key, rawValue] of Object.entries(value)) {
    if (typeof rawValue === 'string' || typeof rawValue === 'number') {
      style[normalizeStyleName(key)] = String(rawValue);
    }
  }

  return style;
}

function parseInlineStyle(value: string): StyleMap {
  const style: StyleMap = {};

  for (const declaration of value.split(';')) {
    const separatorIndex = declaration.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const property = normalizeStyleName(declaration.slice(0, separatorIndex));
    const propertyValue = declaration.slice(separatorIndex + 1).trim();

    if (property && propertyValue) {
      style[property] = propertyValue;
    }
  }

  return style;
}

function serializeStyle(style: Readonly<Record<string, string>>): string {
  return Object.keys(style)
    .sort()
    .map((property) => `${property}:${style[property]}`)
    .join(';');
}

function renderElement(
  tagName: string,
  attributes: Readonly<Record<string, string>>,
  childrenHtml: string,
  voidElement = false,
): string {
  const serializedAttributes = serializeAttributes(attributes);
  const openingTag = serializedAttributes
    ? `<${tagName} ${serializedAttributes}>`
    : `<${tagName}>`;

  if (voidElement) {
    return serializedAttributes
      ? `<${tagName} ${serializedAttributes} />`
      : `<${tagName} />`;
  }

  return `${openingTag}${childrenHtml}</${tagName}>`;
}

function serializeAttributes(
  attributes: Readonly<Record<string, string>>,
): string {
  return Object.keys(attributes)
    .sort()
    .map((name) => `${name}="${escapeAttribute(attributes[name])}"`)
    .join(' ');
}

function normalizeAttributeName(name: string): string {
  if (name === 'className') {
    return 'class';
  }

  if (name === 'colSpan') {
    return 'colspan';
  }

  if (name === 'rowSpan') {
    return 'rowspan';
  }

  return name;
}

function normalizeStyleName(name: string): string {
  return name
    .trim()
    .replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`)
    .toLowerCase();
}

function isSafeAttributeName(name: string): boolean {
  return /^(aria-[a-z0-9-]+|data-[a-z0-9-]+|[a-z][a-z0-9-]*)$/.test(name);
}

function stringifyAttributeValue(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return undefined;
}

function readStringAttribute(
  attributes: Readonly<Record<string, unknown>> | undefined,
  name: string,
): string | undefined {
  const value = attributes?.[name];

  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readNumberAttribute(
  attributes: Readonly<Record<string, unknown>> | undefined,
  name: string,
): number | undefined {
  const value = attributes?.[name];

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : undefined;
  }

  return undefined;
}

function readScalarAttribute(
  attributes: Readonly<Record<string, unknown>> | undefined,
  name: string,
): string | undefined {
  const value = attributes?.[name];

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return undefined;
}

function joinClassNames(
  ...values: readonly (string | undefined)[]
): string | undefined {
  const className = values
    .flatMap((value) => value?.split(/\s+/) ?? [])
    .filter((value) => value.length > 0)
    .join(' ');

  return className.length > 0 ? className : undefined;
}

function clampHeadingLevel(level: number | undefined): number {
  if (!level) {
    return 1;
  }

  return Math.min(Math.max(Math.trunc(level), 1), 6);
}

function alignmentToMargin(alignment: string): string {
  if (alignment === 'center') {
    return '0 auto';
  }

  if (alignment === 'right') {
    return '0 0 0 auto';
  }

  return '0 auto 0 0';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replaceAll('"', '&quot;');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
