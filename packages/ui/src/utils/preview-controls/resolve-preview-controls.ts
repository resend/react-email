import { humanizeIdentifier } from '../humanize-identifier';
import type {
  DeclaredPreviewControl,
  DeclaredPreviewControls,
} from './declared-preview-controls';

/**
 * A fully resolved control the props panel renders: a declared control (or
 * one inferred from a prop's value) with its key and final label attached.
 */
export type ControlDescriptor = DeclaredPreviewControl & {
  key: string;
  label: string;
};

/**
 * Maps a prop value to the control its type implies: booleans become
 * switches, finite numbers become number inputs, strings become text inputs,
 * and anything else (objects, arrays, null) falls back to a raw JSON field.
 */
const inferControl = (value: unknown): DeclaredPreviewControl => {
  if (typeof value === 'boolean') {
    return { type: 'boolean' };
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { type: 'number' };
  }
  if (typeof value === 'string') {
    return { type: 'text' };
  }
  return { type: 'json' };
};

/**
 * Resolves the controls to render for a set of preview props. Declared
 * controls come first, in declaration order, so the template author decides
 * the layout; props without a declaration get a control inferred from their
 * current value, appended in prop order. Labels default to a humanized form
 * of the key.
 */
export const resolvePreviewControls = (
  previewProps: Record<string, unknown>,
  declaredControls: DeclaredPreviewControls | undefined,
): ControlDescriptor[] => {
  const descriptors: ControlDescriptor[] = [];

  for (const [key, control] of Object.entries(declaredControls ?? {})) {
    descriptors.push({
      ...control,
      key,
      label: control.label ?? humanizeIdentifier(key),
    });
  }

  for (const [key, value] of Object.entries(previewProps)) {
    if (declaredControls !== undefined && key in declaredControls) {
      continue;
    }
    descriptors.push({
      ...inferControl(value),
      key,
      label: humanizeIdentifier(key),
    });
  }

  return descriptors;
};
