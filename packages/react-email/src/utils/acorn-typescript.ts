export interface JSXOpeningElement {
  type: 'JSXOpeningElement';
  start: number;
  end: number;
  name: JSXIdentifier;
  attributes: JSXAttribute[];
}

export interface JSXIdentifier {
  type: 'JSXIdentifier';
  start: number;
  end: number;
  name: string;
}

export interface JSXAttribute {
  type: 'JSXAttribute';
  start: number;
  end: number;
  name: JSXIdentifier;
  // TODO: type this, or wait for acorn to provide some
  // way for acorn-typescript to type this
  value: any;
}
