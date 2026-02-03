/**
 * Creates TipTap attribute definitions for a list of HTML attributes.
 * Each attribute will have the same pattern:
 * - default: null
 * - parseHTML: extracts the attribute from the element
 * - renderHTML: conditionally renders the attribute if it has a value
 *
 * @param attributeNames - Array of HTML attribute names to create definitions for
 * @returns Object with TipTap attribute definitions
 *
 * @example
 * const attrs = createStandardAttributes(['class', 'id', 'title']);
 * // Returns:
 * // {
 * //   class: {
 * //     default: null,
 * //     parseHTML: (element) => element.getAttribute('class'),
 * //     renderHTML: (attributes) => attributes.class ? { class: attributes.class } : {}
 * //   },
 * //   ...
 * // }
 */
export function createStandardAttributes(attributeNames: readonly string[]) {
  return Object.fromEntries(
    attributeNames.map((attr) => [
      attr,
      {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute(attr),
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes[attr]) {
            return {};
          }

          return {
            [attr]: attributes[attr],
          };
        },
      },
    ]),
  );
}

/**
 * Common HTML attributes used across multiple extensions.
 * These preserve attributes during HTML import and editing for better
 * fidelity when importing existing email templates.
 */
export const COMMON_HTML_ATTRIBUTES = [
  'id',
  'class',
  'title',
  'lang',
  'dir',
  'data-id',
] as const;

/**
 * Layout-specific HTML attributes used for positioning and sizing.
 */
export const LAYOUT_ATTRIBUTES = ['align', 'width', 'height'] as const;

/**
 * Table-specific HTML attributes used for table layout and styling.
 */
export const TABLE_ATTRIBUTES = [
  'border',
  'cellpadding',
  'cellspacing',
] as const;

/**
 * Table cell-specific HTML attributes.
 */
export const TABLE_CELL_ATTRIBUTES = [
  'valign',
  'bgcolor',
  'colspan',
  'rowspan',
] as const;

/**
 * Table header cell-specific HTML attributes.
 * These are additional attributes that only apply to <th> elements.
 */
export const TABLE_HEADER_ATTRIBUTES = [
  ...TABLE_CELL_ATTRIBUTES,
  'scope',
] as const;
