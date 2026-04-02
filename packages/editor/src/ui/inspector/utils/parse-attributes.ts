import type { Attrs } from '@tiptap/pm/model';
import type { KnownCssProperties } from '../../../plugins/email-theming/types';
import { humanizeString } from './humanize-string';
import { SUPPORTED_CSS_PROPERTIES } from '../../../plugins/email-theming/themes';
import {
  EXCLUDED_ATTRIBUTES,
  LIVEBLOCKS_INTERNAL_PROPS,
  LOCAL_PROPS_SCHEMA,
} from '../config/attribute-schema';
import { SECTION_METADATA } from '../config/node-section-config';

export interface AttributeInput {
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  value: string | number;
  prop: string;
  unit?: 'px' | '%';
  options?: Record<string, string | boolean>;
  placeholder?: string;
  detectedUnit?: string;
}

export function parseAttributes(
  attrs: Attrs,
  allowedAttributes: string[],
): AttributeInput[] {
  const keysToShow =
    allowedAttributes.length > 0
      ? allowedAttributes
      : Object.keys(attrs).filter(
          (key) =>
            !key.startsWith('internal_') &&
            !LIVEBLOCKS_INTERNAL_PROPS.includes(key) &&
            !EXCLUDED_ATTRIBUTES.includes(key),
        );

  const results: AttributeInput[] = [];

  for (const input of keysToShow) {
    if (!(input in attrs) && !LOCAL_PROPS_SCHEMA[input]) {
      continue;
    }

    const value =
      attrs[input] ??
      LOCAL_PROPS_SCHEMA[input]?.defaultValue ??
      SUPPORTED_CSS_PROPERTIES[input as KnownCssProperties]?.defaultValue;
    const inputType = LOCAL_PROPS_SCHEMA[input]?.type || 'text';
    const inputUnit = LOCAL_PROPS_SCHEMA[input]?.unit;
    const inputOptions = LOCAL_PROPS_SCHEMA[input]?.options || {};
    const inputLabel =
      LOCAL_PROPS_SCHEMA[input]?.label || humanizeString(input);
    const inputPlaceholder = LOCAL_PROPS_SCHEMA[input]?.placeholder;

    results.push({
      label: inputLabel,
      type: inputType,
      value,
      prop: input,
      unit: inputUnit,
      options: inputOptions as Record<string, string | boolean>,
      placeholder: inputPlaceholder,
    });
  }

  return results;
}

export function getOtherStyles(
  styleObject: Record<string, string | number>,
): Record<string, string | number> {
  const sectionHandledKeys = Object.values(SECTION_METADATA).flatMap(
    (section) => section.properties,
  );

  const excludedKeys = new Set(sectionHandledKeys);

  return Object.fromEntries(
    Object.entries(styleObject).filter(([key]) => !excludedKeys.has(key)),
  );
}

export function parseOtherStyleToInput(
  prop: string,
  rawValue: string | number,
): AttributeInput {
  const strValue = String(rawValue).trim();

  const numericMatch = strValue.match(/^(-?\d*\.?\d+)(px|%|em|rem|vh|vw)?$/);
  if (numericMatch) {
    const detectedUnit = numericMatch[2] || 'px';
    return {
      label: humanizeString(prop),
      type: 'number',
      value: Number.parseFloat(numericMatch[1]),
      prop,
      unit: detectedUnit as 'px' | '%',
      detectedUnit,
    };
  }

  return {
    label: humanizeString(prop),
    type: 'text',
    value: strValue,
    prop,
  };
}
