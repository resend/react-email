import type { useCurrentEditor } from '@tiptap/react';
import type { NodeClickedEvent } from '@/components/editor/core/types';
import type { KnownCssProperties } from '@/components/editor/plugins/email-theming/types';
import { SUPPORTED_CSS_PROPERTIES } from '../../../../plugins/email-theming/themes';
import {
  ensureBorderStyleFallback,
  inlineCssToJs,
  jsToInlineCss,
} from '../../../../utils/styles';
import { getNodeAtExactPos } from './get-node-at-pos';

export function customUpdateAttributes(
  {
    editor,
    nodePos,
    prop,
    newValue,
  }: {
    editor: NonNullable<ReturnType<typeof useCurrentEditor>['editor']>;
    nodePos: { pos: number; inside: number };
    prop: string;
    newValue: string | number;
  },
  setLocalAttr: (value: NodeClickedEvent['nodeAttrs']) => void,
) {
  const result = getNodeAtExactPos(editor, nodePos);
  if (!result?.node) {
    return;
  }

  const { node, pos } = result;
  const attributes = { ...node.attrs };
  attributes[prop] = newValue;

  setLocalAttr(attributes);

  const transaction = editor.state.tr.setNodeMarkup(pos, null, attributes);
  editor.view.dispatch(transaction);
}

type StyleUpdateBase = {
  editor: NonNullable<ReturnType<typeof useCurrentEditor>['editor']>;
  nodePos: { pos: number; inside: number };
};

type SingleStyleUpdate = StyleUpdateBase & {
  prop: string;
  newValue: string | number;
};

type BatchStyleUpdate = StyleUpdateBase & {
  changes: [string, string | number][];
};

export function customUpdateStyles(
  params: SingleStyleUpdate | BatchStyleUpdate,
  setLocalAttr: (value: NodeClickedEvent['nodeAttrs']) => void,
) {
  const result = getNodeAtExactPos(params.editor, params.nodePos);
  if (!result?.node) {
    return;
  }

  const { node, pos } = result;
  const currentStyle = inlineCssToJs(node.attrs.style);

  const changes: [string, string | number][] =
    'changes' in params ? params.changes : [[params.prop, params.newValue]];

  for (const [prop, value] of changes) {
    if (value === '' || value === undefined) {
      delete currentStyle[prop];
    } else {
      const unit = SUPPORTED_CSS_PROPERTIES[prop as KnownCssProperties]?.unit;
      currentStyle[prop] =
        unit && typeof value === 'number' ? `${value}${unit}` : String(value);
    }
  }

  ensureBorderStyleFallback(currentStyle);
  const newStyle = jsToInlineCss(currentStyle);
  const attributes = { ...node.attrs, style: newStyle };

  setLocalAttr(attributes);

  const transaction = params.editor.state.tr.setNodeMarkup(
    pos,
    null,
    attributes,
  );
  params.editor.view.dispatch(transaction);
}
