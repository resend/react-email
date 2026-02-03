/**
 * Recursively flattens object paths up to a specified depth.
 * Used to extract nested property paths from variable fallback values.
 *
 * @example
 * flattenObjectPaths({ user: { name: 'John', email: 'john@example.com' } })
 * // Returns: ['user', 'user.name', 'user.email']
 */
export function flattenObjectPaths(
  obj: unknown,
  maxDepth = 2,
  prefix = '',
  depth = 0,
): string[] {
  if (depth >= maxDepth) {
    return [];
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return [];
  }
  const target = obj as Record<string, unknown>;
  const paths: string[] = [];
  for (const key of Object.keys(target)) {
    const path = prefix ? `${prefix}.${key}` : key;
    paths.push(path);

    if (
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      paths.push(...flattenObjectPaths(target[key], maxDepth, path, depth + 1));
    }
  }
  return paths;
}

/**
 * Normalizes fallback values by parsing JSON strings into objects.
 * Object and array fallback values are stored as JSON strings and need to be parsed.
 *
 * @example
 * normalizeFallbackValue('{"name": "John"}')
 * // Returns: { name: 'John' }
 */
export function normalizeFallbackValue(value: unknown): unknown {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return value;
      }
    }
  }
  return value;
}

/**
 * Calculates loop item variables directly from a list variable.
 * Used by loop nodes to determine available `this` references.
 *
 * @example
 * // For a list of primitives [1, 2, 3]:
 * calculateLoopItemVariables(listVariable)
 * // Returns: ['this']
 *
 * @example
 * // For a list of objects [{name: 'John', email: '...'}]:
 * calculateLoopItemVariables(listVariable)
 * // Returns: ['this.name', 'this.email']
 */
export function calculateLoopItemVariables(
  listVariable:
    | {
        type: string;
        fallback_value?: unknown;
      }
    | null
    | undefined,
): string[] {
  if (!listVariable || listVariable.type !== 'list') {
    return [];
  }
  if (!listVariable.fallback_value) {
    return [];
  }

  const normalized = normalizeFallbackValue(listVariable.fallback_value);
  if (!Array.isArray(normalized) || normalized.length === 0) {
    return [];
  }

  const sampleItem = normalized[0];

  if (typeof sampleItem === 'object' && sampleItem !== null) {
    const nestedPaths = flattenObjectPaths(sampleItem, 2);
    return nestedPaths.map((path) => `this.${path}`);
  }

  return ['this'];
}

/**
 * Extracts loop item variables from the current editor context.
 * When a node is inside a loop, this returns variable paths for `this`
 * (for primitive list items) or `this.<property>` (for object list items).
 *
 * @param pos - Optional position in the document. If provided, uses this position
 *              to find the loop context. Otherwise, uses the current selection.
 *
 * @example
 * // Inside a loop iterating over primitives:
 * getLoopItemVariables(editor, variables)
 * // Returns: ['this']
 *
 * @example
 * // Inside a loop iterating over objects with {name, email}:
 * getLoopItemVariables(editor, variables)
 * // Returns: ['this.name', 'this.email']
 */
export function getLoopItemVariables(
  editor: any,
  customVariables: Array<{
    id: string;
    key: string;
    type: string;
    fallback_value?: unknown;
  }> | null,
  pos?: number,
): string[] {
  if (!editor || !customVariables) {
    return [];
  }

  const { state } = editor;
  // Use provided position or fall back to current selection
  const $pos =
    pos !== undefined ? state.doc.resolve(pos) : state.selection.$from;
  let loopNode = null;

  for (let d = $pos.depth; d > 0; d--) {
    const node = $pos.node(d);
    if (node.type.name === 'loop') {
      loopNode = node;
      break;
    }
  }

  if (!loopNode || !loopNode.attrs.list) {
    return [];
  }

  const listKey = loopNode.attrs.list;
  const listVariable = customVariables.find(
    (v) => v.key === listKey && v.type === 'list',
  );

  if (!listVariable || !listVariable.fallback_value) {
    return [];
  }

  const normalized = normalizeFallbackValue(listVariable.fallback_value);
  if (!Array.isArray(normalized) || normalized.length === 0) {
    return [];
  }

  const sampleItem = normalized[0];

  // If list items are objects, provide this.<property> paths
  if (typeof sampleItem === 'object' && sampleItem !== null) {
    const nestedPaths = flattenObjectPaths(sampleItem, 2);
    return nestedPaths.map((path) => `this.${path}`);
  }

  // If list items are primitives, just provide 'this'
  return ['this'];
}

/**
 * Determines if loop item variables have structurally changed.
 * This detects changes between primitive and object list items.
 *
 * @example
 * hasLoopStructureChanged(['this'], ['this.name', 'this.email'])
 * // Returns: true (primitive → object)
 *
 * @example
 * hasLoopStructureChanged(['this.name'], ['this.email', 'this.id'])
 * // Returns: false (both objects, just different properties)
 */
export function hasLoopStructureChanged(
  oldVars: string[],
  newVars: string[],
): boolean {
  if (oldVars.length === 0 || newVars.length === 0) {
    return false;
  }

  const oldIsPrimitive = oldVars.length === 1 && oldVars[0] === 'this';
  const newIsPrimitive = newVars.length === 1 && newVars[0] === 'this';

  // Structural change if one is primitive and the other is object
  return oldIsPrimitive !== newIsPrimitive;
}
