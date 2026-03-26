import type { PanelGroup } from '@/types/editor/styles';

/**
 * Converts a PanelGroup's inputs array into a flat CSS-like style record.
 * Empty string values are treated as undefined (no value set).
 */
export function inputsToStyleObject(
  inputs: PanelGroup['inputs'],
): Record<string, string | number | undefined> {
  const obj: Record<string, string | number | undefined> = {};
  for (const input of inputs) {
    obj[input.prop] = input.value === '' ? undefined : input.value;
  }
  return obj;
}

/**
 * Builds a mapping from CSS property name → classReference so that
 * onChange can route updates to the correct theme component.
 *
 * This is needed because inputs within a single group can target different
 * classReferences (e.g. typography group has fontSize→body, lineHeight→container).
 */
export function buildPropClassMap(
  inputs: PanelGroup['inputs'],
): Record<string, string | undefined> {
  const map: Record<string, string | undefined> = {};
  for (const input of inputs) {
    map[input.prop] = input.classReference;
  }
  return map;
}
