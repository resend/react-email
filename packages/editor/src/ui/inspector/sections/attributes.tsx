'use client';

import { NumberInput } from '../components/number-input';
import { PropRow } from '../components/prop-row';
import { Section } from '../components/section';
import {
  EXCLUDED_ATTRIBUTES,
  LIVEBLOCKS_INTERNAL_PROPS,
  LOCAL_PROPS_SCHEMA,
} from '../config/attribute-schema';
import type { InspectorNodeContext } from '../node';
import { Label, Select, Textarea, TextField } from '../primitives';

interface InspectorAttributesProps {
  context: InspectorNodeContext;
  initialCollapsed?: boolean;
}

export function InspectorAttributes({
  context,
  initialCollapsed = false,
}: InspectorAttributesProps) {
  const { nodeType, getAttr, setAttr } = context;

  const nodeAttrs = getVisibleAttributes(nodeType, getAttr);

  if (nodeAttrs.length === 0) {
    return null;
  }

  return (
    <Section title="Attributes" initialCollapsed={initialCollapsed}>
      {nodeAttrs.map(({ name, config, value }) => (
        <PropRow key={name}>
          <Label>{config.label}</Label>
          {config.type === 'select' && config.options ? (
            <Select.Root
              value={String(value ?? config.defaultValue)}
              onChange={(e) => {
                const newValue = e.target.value;
                setAttr(name, newValue);
                config.customUpdate?.({ newValue });
              }}
            >
              {Object.entries(config.options)
                .filter(([, v]) => typeof v === 'string')
                .map(([val, label]) => (
                  <Select.Item key={val} value={val}>
                    {label as string}
                  </Select.Item>
                ))}
            </Select.Root>
          ) : config.type === 'number' ? (
            <NumberInput
              value={value ?? config.defaultValue}
              onChange={(v) => setAttr(name, v)}
              unit={config.unit}
              min={0}
            />
          ) : config.type === 'textarea' ? (
            <Textarea
              value={String(value ?? config.defaultValue)}
              onChange={(e) => setAttr(name, e.target.value)}
            />
          ) : (
            <TextField
              type="text"
              value={String(value ?? config.defaultValue)}
              onChange={(e) => setAttr(name, e.target.value)}
            />
          )}
        </PropRow>
      ))}
    </Section>
  );
}

function getVisibleAttributes(
  _nodeType: string,
  getAttr: (name: string) => unknown,
) {
  const results: Array<{
    name: string;
    config: (typeof LOCAL_PROPS_SCHEMA)[string];
    value: unknown;
  }> = [];

  for (const [name, config] of Object.entries(LOCAL_PROPS_SCHEMA)) {
    if (EXCLUDED_ATTRIBUTES.includes(name)) continue;
    if (LIVEBLOCKS_INTERNAL_PROPS.includes(name)) continue;

    const value = getAttr(name);
    if (value !== undefined && value !== null) {
      results.push({ name, config, value });
    }
  }

  return results;
}
