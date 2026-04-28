import type { PanelGroup } from '../../../plugins/email-theming/types';

export function inputsToStyleObject(
  inputs: PanelGroup['inputs'],
): Record<string, string | number | undefined> {
  const obj: Record<string, string | number | undefined> = {};
  for (const input of inputs) {
    obj[input.prop] = input.value === '' ? undefined : input.value;
  }
  return obj;
}

export function buildPropClassMap(
  inputs: PanelGroup['inputs'],
): Record<string, string | undefined> {
  const map: Record<string, string | undefined> = {};
  for (const input of inputs) {
    map[input.prop] = input.classReference;
  }
  return map;
}
