import type Prism from 'prismjs';
import type React from 'react';

export type Theme = Record<
  string | 'base' | keyof Prism.Grammar,
  React.CSSProperties
>;

export const xonokai = {
  'base': {
    MozTabSize: '2',
    OTabSize: '2',
    tabSize: '2',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    whiteSpace: 'pre-wrap',
    wordWrap: 'normal',
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: '14px',
    color: '#76d9e6',
    textShadow: 'none',
    background: '#2a2a2a',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #e1e1e8',
    overflow: 'auto',
    position: 'relative',
  },
  'namespace': {
    opacity: '.7',
  },
  'comment': {
    color: '#6f705e',
  },
  'prolog': {
    color: '#6f705e',
  },
  'doctype': {
    color: '#6f705e',
  },
  'cdata': {
    color: '#6f705e',
  },
  'operator': {
    color: '#a77afe',
  },
  'boolean': {
    color: '#a77afe',
  },
  'number': {
    color: '#a77afe',
  },
  'attr-name': {
    color: '#e6d06c',
  },
  'string': {
    color: '#e6d06c',
  },
  'entity': {
    color: '#e6d06c',
    cursor: 'help',
  },
  'url': {
    color: '#e6d06c',
  },
  'selector': {
    color: '#a6e22d',
  },
  'inserted': {
    color: '#a6e22d',
  },
  'atrule': {
    color: '#ef3b7d',
  },
  'attr-value': {
    color: '#ef3b7d',
  },
  'keyword': {
    color: '#ef3b7d',
  },
  'important': {
    color: '#ef3b7d',
    fontWeight: 'bold',
  },
  'deleted': {
    color: '#ef3b7d',
  },
  'regex': {
    color: '#76d9e6',
  },
  'statement': {
    color: '#76d9e6',
    fontWeight: 'bold',
  },
  'placeholder': {
    color: '#fff',
  },
  'variable': {
    color: '#fff',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'punctuation': {
    color: '#bebec5',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;

export const vscDarkPlus = {
  'base': {
    color: '#d4d4d4',
    fontSize: '13px',
    textShadow: 'none',
    fontFamily:
      'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    background: '#1e1e1e',
  },
  'doctype .token.doctype-tag': {
    color: '#569CD6',
  },
  'doctype .token.name': {
    color: '#9cdcfe',
  },
  'comment': {
    color: '#6a9955',
  },
  'prolog': {
    color: '#6a9955',
  },
  'punctuation': {
    color: '#d4d4d4',
  },
  'property': {
    color: '#9cdcfe',
  },
  'tag': {
    color: '#569cd6',
  },
  'boolean': {
    color: '#569cd6',
  },
  'number': {
    color: '#b5cea8',
  },
  'constant': {
    color: '#9cdcfe',
  },
  'symbol': {
    color: '#b5cea8',
  },
  'inserted': {
    color: '#b5cea8',
  },
  'unit': {
    color: '#b5cea8',
  },
  'selector': {
    color: '#d7ba7d',
  },
  'attr-name': {
    color: '#9cdcfe',
  },
  'string': {
    color: '#ce9178',
  },
  'char': {
    color: '#ce9178',
  },
  'builtin': {
    color: '#ce9178',
  },
  'deleted': {
    color: '#ce9178',
  },
  'operator': {
    color: '#d4d4d4',
  },
  'entity': {
    color: '#569cd6',
  },
  'operator.arrow': {
    color: '#569CD6',
  },
  'atrule': {
    color: '#ce9178',
  },
  'atrule .token.rule': {
    color: '#c586c0',
  },
  'atrule .token.url': {
    color: '#9cdcfe',
  },
  'atrule .token.url .token.function': {
    color: '#dcdcaa',
  },
  'atrule .token.url .token.punctuation': {
    color: '#d4d4d4',
  },
  'keyword': {
    color: '#569CD6',
  },
  'keyword.module': {
    color: '#c586c0',
  },
  'keyword.control-flow': {
    color: '#c586c0',
  },
  'function': {
    color: '#dcdcaa',
  },
  'function .token.maybe-class-name': {
    color: '#dcdcaa',
  },
  'regex': {
    color: '#d16969',
  },
  'important': {
    color: '#569cd6',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'class-name': {
    color: '#4ec9b0',
  },
  'maybe-class-name': {
    color: '#4ec9b0',
  },
  'console': {
    color: '#9cdcfe',
  },
  'parameter': {
    color: '#9cdcfe',
  },
  'interpolation': {
    color: '#9cdcfe',
  },
  'punctuation.interpolation-punctuation': {
    color: '#569cd6',
  },
  'variable': {
    color: '#9cdcfe',
  },
  'imports .token.maybe-class-name': {
    color: '#9cdcfe',
  },
  'exports .token.maybe-class-name': {
    color: '#9cdcfe',
  },
  'escape': {
    color: '#d7ba7d',
  },
  'tag .token.punctuation': {
    color: '#808080',
  },
  'cdata': {
    color: '#808080',
  },
  'attr-value': {
    color: '#ce9178',
  },
  'attr-value .token.punctuation': {
    color: '#ce9178',
  },
  'attr-value .token.punctuation.attr-equals': {
    color: '#d4d4d4',
  },
  'namespace': {
    color: '#4ec9b0',
  },
} as const;
export const duotoneForest = {
  'base': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    background: '#2a2d2a',
    color: '#687d68',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#535f53',
  },
  'prolog': {
    color: '#535f53',
  },
  'doctype': {
    color: '#535f53',
  },
  'cdata': {
    color: '#535f53',
  },
  'punctuation': {
    color: '#535f53',
  },
  'namespace': {
    opacity: '.7',
  },
  'tag': {
    color: '#a2b34d',
  },
  'operator': {
    color: '#a2b34d',
  },
  'number': {
    color: '#a2b34d',
  },
  'property': {
    color: '#687d68',
  },
  'function': {
    color: '#687d68',
  },
  'tag-id': {
    color: '#f0fff0',
  },
  'selector': {
    color: '#f0fff0',
  },
  'atrule-id': {
    color: '#f0fff0',
  },
  'attr-name': {
    color: '#b3d6b3',
  },
  'boolean': {
    color: '#e5fb79',
  },
  'string': {
    color: '#e5fb79',
  },
  'entity': {
    color: '#e5fb79',
    cursor: 'help',
  },
  'url': {
    color: '#e5fb79',
  },
  'attr-value': {
    color: '#e5fb79',
  },
  'keyword': {
    color: '#e5fb79',
  },
  'control': {
    color: '#e5fb79',
  },
  'directive': {
    color: '#e5fb79',
  },
  'unit': {
    color: '#e5fb79',
  },
  'statement': {
    color: '#e5fb79',
  },
  'regex': {
    color: '#e5fb79',
  },
  'atrule': {
    color: '#e5fb79',
  },
  'placeholder': {
    color: '#e5fb79',
  },
  'variable': {
    color: '#e5fb79',
  },
  'deleted': {
    textDecoration: 'line-through',
  },
  'inserted': {
    borderBottom: '1px dotted #f0fff0',
    textDecoration: 'none',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'important': {
    fontWeight: 'bold',
    color: '#b3d6b3',
  },
  'bold': {
    fontWeight: 'bold',
  },
} as const;
export const holiTheme = {
  'base': {},
  'comment': {
    color: '#446e69',
  },
  'prolog': {
    color: '#446e69',
  },
  'doctype': {
    color: '#446e69',
  },
  'cdata': {
    color: '#446e69',
  },
  'punctuation': {
    color: '#d6b007',
  },
  'property': {
    color: '#d6e7ff',
  },
  'tag': {
    color: '#d6e7ff',
  },
  'boolean': {
    color: '#d6e7ff',
  },
  'number': {
    color: '#d6e7ff',
  },
  'constant': {
    color: '#d6e7ff',
  },
  'symbol': {
    color: '#d6e7ff',
  },
  'deleted': {
    color: '#d6e7ff',
  },
  'selector': {
    color: '#e60067',
  },
  'attr-name': {
    color: '#e60067',
  },
  'builtin': {
    color: '#e60067',
  },
  'inserted': {
    color: '#e60067',
  },
  'string': {
    color: '#49c6ec',
  },
  'char': {
    color: '#49c6ec',
  },
  'operator': {
    color: '#ec8e01',
    background: 'transparent',
  },
  'entity': {
    color: '#ec8e01',
    background: 'transparent',
  },
  'url': {
    color: '#ec8e01',
    background: 'transparent',
  },
  'atrule': {
    color: '#0fe468',
  },
  'attr-value': {
    color: '#0fe468',
  },
  'keyword': {
    color: '#0fe468',
  },
  'function': {
    color: '#78f3e9',
  },
  'class-name': {
    color: '#78f3e9',
  },
  'regex': {
    color: '#d6e7ff',
  },
  'important': {
    color: '#d6e7ff',
  },
  'variable': {
    color: '#d6e7ff',
  },
} as const;
export const cb = {
  'base': {
    color: '#fff',
    textShadow: '0 1px 1px #000',
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    direction: 'ltr',
    textAlign: 'left',
    wordSpacing: 'normal',
    whiteSpace: 'pre',
    wordWrap: 'normal',
    lineHeight: '1.4',
    background: '#222',
    border: '0',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    padding: '15px',
    margin: '1em 0',
    overflow: 'auto',
    MozBorderRadius: '8px',
    WebkitBorderRadius: '8px',
    borderRadius: '8px',
  },
  'comment': {
    color: '#797979',
  },
  'prolog': {
    color: '#797979',
  },
  'doctype': {
    color: '#797979',
  },
  'cdata': {
    color: '#797979',
  },
  'selector': {
    color: '#fff',
  },
  'operator': {
    color: '#fff',
  },
  'punctuation': {
    color: '#fff',
  },
  'namespace': {
    opacity: '.7',
  },
  'tag': {
    color: '#ffd893',
  },
  'boolean': {
    color: '#ffd893',
  },
  'atrule': {
    color: '#B0C975',
  },
  'attr-value': {
    color: '#B0C975',
  },
  'hex': {
    color: '#B0C975',
  },
  'string': {
    color: '#B0C975',
  },
  'property': {
    color: '#c27628',
  },
  'entity': {
    color: '#c27628',
    cursor: 'help',
  },
  'url': {
    color: '#c27628',
  },
  'attr-name': {
    color: '#c27628',
  },
  'keyword': {
    color: '#c27628',
  },
  'regex': {
    color: '#9B71C6',
  },
  'function': {
    color: '#e5a638',
  },
  'constant': {
    color: '#e5a638',
  },
  'variable': {
    color: '#fdfba8',
  },
  'number': {
    color: '#8799B0',
  },
  'important': {
    color: '#E45734',
  },
  'deliminator': {
    color: '#E45734',
  },
} as const;
export const vs = {
  'base': {
    color: '#393A34',
    fontFamily:
      '"Consolas", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    fontSize: '.9em',
    lineHeight: '1.2em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    border: '1px solid #dddddd',
    backgroundColor: 'white',
  },
  'comment': {
    color: '#008000',
    fontStyle: 'italic',
  },
  'prolog': {
    color: '#008000',
    fontStyle: 'italic',
  },
  'doctype': {
    color: '#008000',
    fontStyle: 'italic',
  },
  'cdata': {
    color: '#008000',
    fontStyle: 'italic',
  },
  'namespace': {
    opacity: '.7',
  },
  'string': {
    color: '#A31515',
  },
  'punctuation': {
    color: '#393A34',
  },
  'operator': {
    color: '#393A34',
  },
  'url': {
    color: '#36acaa',
  },
  'symbol': {
    color: '#36acaa',
  },
  'number': {
    color: '#36acaa',
  },
  'boolean': {
    color: '#36acaa',
  },
  'variable': {
    color: '#36acaa',
  },
  'constant': {
    color: '#36acaa',
  },
  'inserted': {
    color: '#36acaa',
  },
  'atrule': {
    color: '#0000ff',
  },
  'keyword': {
    color: '#0000ff',
  },
  'attr-value': {
    color: '#0000ff',
  },
  'function': {
    color: '#393A34',
  },
  'deleted': {
    color: '#9a050f',
  },
  'selector': {
    color: '#800000',
  },
  'important': {
    color: '#e90',
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'class-name': {
    color: '#2B91AF',
  },
  'tag': {
    color: '#800000',
  },
  'attr-name': {
    color: '#ff0000',
  },
  'property': {
    color: '#ff0000',
  },
  'regex': {
    color: '#ff0000',
  },
  'entity': {
    color: '#ff0000',
  },
  'directive.tag .tag': {
    background: '#ffff00',
    color: '#393A34',
  },
} as const;
export const materialDark = {
  'base': {
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    color: '#eee',
    background: '#2f2f2f',
    fontFamily: 'Roboto Mono, monospace',
    fontSize: '1em',
    lineHeight: '1.5em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    overflow: 'auto',
    position: 'relative',
    margin: '0.5em 0',
    padding: '1.25em 1em',
  },
  'atrule': {
    color: '#c792ea',
  },
  'attr-name': {
    color: '#ffcb6b',
  },
  'attr-value': {
    color: '#a5e844',
  },
  'attribute': {
    color: '#a5e844',
  },
  'boolean': {
    color: '#c792ea',
  },
  'builtin': {
    color: '#ffcb6b',
  },
  'cdata': {
    color: '#80cbc4',
  },
  'char': {
    color: '#80cbc4',
  },
  'class': {
    color: '#ffcb6b',
  },
  'class-name': {
    color: '#f2ff00',
  },
  'comment': {
    color: '#616161',
  },
  'constant': {
    color: '#c792ea',
  },
  'deleted': {
    color: '#ff6666',
  },
  'doctype': {
    color: '#616161',
  },
  'entity': {
    color: '#ff6666',
  },
  'function': {
    color: '#c792ea',
  },
  'hexcode': {
    color: '#f2ff00',
  },
  'id': {
    color: '#c792ea',
    fontWeight: 'bold',
  },
  'important': {
    color: '#c792ea',
    fontWeight: 'bold',
  },
  'inserted': {
    color: '#80cbc4',
  },
  'keyword': {
    color: '#c792ea',
  },
  'number': {
    color: '#fd9170',
  },
  'operator': {
    color: '#89ddff',
  },
  'prolog': {
    color: '#616161',
  },
  'property': {
    color: '#80cbc4',
  },
  'pseudo-class': {
    color: '#a5e844',
  },
  'pseudo-element': {
    color: '#a5e844',
  },
  'punctuation': {
    color: '#89ddff',
  },
  'regex': {
    color: '#f2ff00',
  },
  'selector': {
    color: '#ff6666',
  },
  'string': {
    color: '#a5e844',
  },
  'symbol': {
    color: '#c792ea',
  },
  'tag': {
    color: '#ff6666',
  },
  'unit': {
    color: '#fd9170',
  },
  'url': {
    color: '#ff6666',
  },
  'variable': {
    color: '#ff6666',
  },
} as const;
export const dracula = {
  'base': {
    color: '#f8f8f2',
    background: '#282a36',
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  'comment': {
    color: '#6272a4',
  },
  'prolog': {
    color: '#6272a4',
  },
  'doctype': {
    color: '#6272a4',
  },
  'cdata': {
    color: '#6272a4',
  },
  'punctuation': {
    color: '#f8f8f2',
  },
  'property': {
    color: '#ff79c6',
  },
  'tag': {
    color: '#ff79c6',
  },
  'constant': {
    color: '#ff79c6',
  },
  'symbol': {
    color: '#ff79c6',
  },
  'deleted': {
    color: '#ff79c6',
  },
  'boolean': {
    color: '#bd93f9',
  },
  'number': {
    color: '#bd93f9',
  },
  'selector': {
    color: '#50fa7b',
  },
  'attr-name': {
    color: '#50fa7b',
  },
  'string': {
    color: '#50fa7b',
  },
  'char': {
    color: '#50fa7b',
  },
  'builtin': {
    color: '#50fa7b',
  },
  'inserted': {
    color: '#50fa7b',
  },
  'operator': {
    color: '#f8f8f2',
  },
  'entity': {
    color: '#f8f8f2',
    cursor: 'help',
  },
  'url': {
    color: '#f8f8f2',
  },
  'variable': {
    color: '#f8f8f2',
  },
  'atrule': {
    color: '#f1fa8c',
  },
  'attr-value': {
    color: '#f1fa8c',
  },
  'function': {
    color: '#f1fa8c',
  },
  'class-name': {
    color: '#f1fa8c',
  },
  'keyword': {
    color: '#8be9fd',
  },
  'regex': {
    color: '#ffb86c',
  },
  'important': {
    color: '#ffb86c',
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
export const shadesOfPurple = {
  'base': {},
  '': {
    fontWeight: '400',
  },
  'comment': {
    color: '#b362ff',
  },
  'prolog': {
    color: '#b362ff',
  },
  'cdata': {
    color: '#b362ff',
  },
  'delimiter': {
    color: '#ff9d00',
  },
  'keyword': {
    color: '#ff9d00',
  },
  'selector': {
    color: '#ff9d00',
  },
  'important': {
    color: '#ff9d00',
  },
  'atrule': {
    color: '#ff9d00',
  },
  'operator': {
    color: 'rgb(255, 180, 84)',
    background: 'none',
  },
  'attr-name': {
    color: 'rgb(255, 180, 84)',
  },
  'punctuation': {
    color: '#ffffff',
  },
  'boolean': {
    color: 'rgb(255, 98, 140)',
  },
  'tag': {
    color: 'rgb(255, 157, 0)',
  },
  'tag .punctuation': {
    color: 'rgb(255, 157, 0)',
  },
  'doctype': {
    color: 'rgb(255, 157, 0)',
  },
  'builtin': {
    color: 'rgb(255, 157, 0)',
  },
  'entity': {
    color: '#6897bb',
    background: 'none',
  },
  'symbol': {
    color: '#6897bb',
  },
  'number': {
    color: '#ff628c',
  },
  'property': {
    color: '#ff628c',
  },
  'constant': {
    color: '#ff628c',
  },
  'variable': {
    color: '#ff628c',
  },
  'string': {
    color: '#a5ff90',
  },
  'char': {
    color: '#a5ff90',
  },
  'attr-value': {
    color: '#a5c261',
  },
  'attr-value .punctuation': {
    color: '#a5c261',
  },
  'attr-value .punctuation:first-child': {
    color: '#a9b7c6',
  },
  'url': {
    color: '#287bde',
    textDecoration: 'underline',
    background: 'none',
  },
  'function': {
    color: 'rgb(250, 208, 0)',
  },
  'regex': {
    background: '#364135',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'inserted': {
    background: '#00ff00',
  },
  'deleted': {
    background: '#ff000d',
  },
  'class-name': {
    color: '#fb94ff',
  },
} as const;
export const gruvboxDark = {
  'base': {
    color: '#ebdbb2',
    fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    background: '#1d2021',
  },
  'comment': {
    color: '#a89984',
  },
  'prolog': {
    color: '#a89984',
  },
  'cdata': {
    color: '#a89984',
  },
  'delimiter': {
    color: '#fb4934',
  },
  'boolean': {
    color: '#fb4934',
  },
  'keyword': {
    color: '#fb4934',
  },
  'selector': {
    color: '#fb4934',
  },
  'important': {
    color: '#fb4934',
  },
  'atrule': {
    color: '#fb4934',
  },
  'operator': {
    color: '#a89984',
  },
  'punctuation': {
    color: '#a89984',
  },
  'attr-name': {
    color: '#a89984',
  },
  'tag': {
    color: '#fabd2f',
  },
  'tag .punctuation': {
    color: '#fabd2f',
  },
  'doctype': {
    color: '#fabd2f',
  },
  'builtin': {
    color: '#fabd2f',
  },
  'entity': {
    color: '#d3869b',
  },
  'number': {
    color: '#d3869b',
  },
  'symbol': {
    color: '#d3869b',
  },
  'property': {
    color: '#fb4934',
  },
  'constant': {
    color: '#fb4934',
  },
  'variable': {
    color: '#fb4934',
  },
  'string': {
    color: '#b8bb26',
  },
  'char': {
    color: '#b8bb26',
  },
  'attr-value': {
    color: '#a89984',
  },
  'attr-value .punctuation': {
    color: '#a89984',
  },
  'url': {
    color: '#b8bb26',
    textDecoration: 'underline',
  },
  'function': {
    color: '#fabd2f',
  },
  'regex': {
    background: '#b8bb26',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'inserted': {
    background: '#a89984',
  },
  'deleted': {
    background: '#fb4934',
  },
} as const;
export const baseAteliersulphurpoolLight = {
  'base': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    background: '#f5f7ff',
    color: '#5e6687',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#898ea4',
  },
  'prolog': {
    color: '#898ea4',
  },
  'doctype': {
    color: '#898ea4',
  },
  'cdata': {
    color: '#898ea4',
  },
  'punctuation': {
    color: '#5e6687',
  },
  'namespace': {
    opacity: '.7',
  },
  'operator': {
    color: '#c76b29',
  },
  'boolean': {
    color: '#c76b29',
  },
  'number': {
    color: '#c76b29',
  },
  'property': {
    color: '#c08b30',
  },
  'tag': {
    color: '#3d8fd1',
  },
  'string': {
    color: '#22a2c9',
  },
  'selector': {
    color: '#6679cc',
  },
  'attr-name': {
    color: '#c76b29',
  },
  'entity': {
    color: '#22a2c9',
    cursor: 'help',
  },
  'url': {
    color: '#22a2c9',
  },
  'attr-value': {
    color: '#ac9739',
  },
  'keyword': {
    color: '#ac9739',
  },
  'control': {
    color: '#ac9739',
  },
  'directive': {
    color: '#ac9739',
  },
  'unit': {
    color: '#ac9739',
  },
  'statement': {
    color: '#22a2c9',
  },
  'regex': {
    color: '#22a2c9',
  },
  'atrule': {
    color: '#22a2c9',
  },
  'placeholder': {
    color: '#3d8fd1',
  },
  'variable': {
    color: '#3d8fd1',
  },
  'deleted': {
    textDecoration: 'line-through',
  },
  'inserted': {
    borderBottom: '1px dotted #202746',
    textDecoration: 'none',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'important': {
    fontWeight: 'bold',
    color: '#c94922',
  },
  'bold': {
    fontWeight: 'bold',
  },
} as const;
export const coldarkCold = {
  'base': {
    color: '#111b27',
    background: '#e3eaf2',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#3c526d',
  },
  'prolog': {
    color: '#3c526d',
  },
  'doctype': {
    color: '#3c526d',
  },
  'cdata': {
    color: '#3c526d',
  },
  'punctuation': {
    color: '#111b27',
  },
  'delimiter.important': {
    color: '#006d6d',
    fontWeight: 'inherit',
  },
  'selector .parent': {
    color: '#006d6d',
  },
  'tag': {
    color: '#006d6d',
  },
  'tag .token.punctuation': {
    color: '#006d6d',
  },
  'attr-name': {
    color: '#755f00',
  },
  'boolean': {
    color: '#755f00',
  },
  'boolean.important': {
    color: '#755f00',
  },
  'number': {
    color: '#755f00',
  },
  'constant': {
    color: '#755f00',
  },
  'selector .token.attribute': {
    color: '#755f00',
  },
  'class-name': {
    color: '#005a8e',
  },
  'key': {
    color: '#005a8e',
  },
  'parameter': {
    color: '#005a8e',
  },
  'property': {
    color: '#005a8e',
  },
  'property-access': {
    color: '#005a8e',
  },
  'variable': {
    color: '#005a8e',
  },
  'attr-value': {
    color: '#116b00',
  },
  'inserted': {
    color: '#116b00',
  },
  'color': {
    color: '#116b00',
  },
  'selector .token.value': {
    color: '#116b00',
  },
  'string': {
    color: '#116b00',
  },
  'string .token.url-link': {
    color: '#116b00',
  },
  'builtin': {
    color: '#af00af',
  },
  'keyword-array': {
    color: '#af00af',
  },
  'package': {
    color: '#af00af',
  },
  'regex': {
    color: '#af00af',
  },
  'function': {
    color: '#7c00aa',
  },
  'selector .token.class': {
    color: '#7c00aa',
  },
  'selector .token.id': {
    color: '#7c00aa',
  },
  'atrule .token.rule': {
    color: '#a04900',
  },
  'combinator': {
    color: '#a04900',
  },
  'keyword': {
    color: '#a04900',
  },
  'operator': {
    color: '#a04900',
  },
  'pseudo-class': {
    color: '#a04900',
  },
  'pseudo-element': {
    color: '#a04900',
  },
  'selector': {
    color: '#a04900',
  },
  'unit': {
    color: '#a04900',
  },
  'deleted': {
    color: '#c22f2e',
  },
  'important': {
    color: '#c22f2e',
    fontWeight: 'bold',
  },
  'keyword-this': {
    color: '#005a8e',
    fontWeight: 'bold',
  },
  'this': {
    color: '#005a8e',
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'entity': {
    cursor: 'help',
  },
  'token.tab:not(:empty):before': {
    color: '#3c526d',
  },
  'token.cr:before': {
    color: '#3c526d',
  },
  'token.lf:before': {
    color: '#3c526d',
  },
  'token.space:before': {
    color: '#3c526d',
  },
} as const;
export const solarizedDarkAtom = {
  'base': {
    color: '#839496',
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily:
      "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
    background: '#002b36',
  },
  'comment': {
    color: '#586e75',
  },
  'prolog': {
    color: '#586e75',
  },
  'doctype': {
    color: '#586e75',
  },
  'cdata': {
    color: '#586e75',
  },
  'punctuation': {
    color: '#93a1a1',
  },
  'property': {
    color: '#268bd2',
  },
  'keyword': {
    color: '#268bd2',
  },
  'tag': {
    color: '#268bd2',
  },
  'class-name': {
    color: '#FFFFB6',
    textDecoration: 'underline',
  },
  'boolean': {
    color: '#b58900',
  },
  'constant': {
    color: '#b58900',
  },
  'symbol': {
    color: '#dc322f',
  },
  'deleted': {
    color: '#dc322f',
  },
  'number': {
    color: '#859900',
  },
  'selector': {
    color: '#859900',
  },
  'attr-name': {
    color: '#859900',
  },
  'string': {
    color: '#859900',
  },
  'char': {
    color: '#859900',
  },
  'builtin': {
    color: '#859900',
  },
  'inserted': {
    color: '#859900',
  },
  'variable': {
    color: '#268bd2',
  },
  'operator': {
    color: '#EDEDED',
  },
  'function': {
    color: '#268bd2',
  },
  'regex': {
    color: '#E9C062',
  },
  'important': {
    color: '#fd971f',
    fontWeight: 'bold',
  },
  'entity': {
    color: '#FFFFB6',
    cursor: 'help',
  },
  'url': {
    color: '#96CBFE',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'atrule': {
    color: '#F9EE98',
  },
  'attr-value': {
    color: '#F9EE98',
  },
} as const;
export const synthwave84 = {
  'base': {
    color: '#f92aad',
    textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
    background: 'none',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    backgroundColor: 'transparent !important',
    backgroundImage: 'linear-gradient(to bottom, #2a2139 75%, #34294f)',
  },
  'comment': {
    color: '#8e8e8e',
  },
  'block-comment': {
    color: '#8e8e8e',
  },
  'prolog': {
    color: '#8e8e8e',
  },
  'doctype': {
    color: '#8e8e8e',
  },
  'cdata': {
    color: '#8e8e8e',
  },
  'punctuation': {
    color: '#ccc',
  },
  'tag': {
    color: '#e2777a',
  },
  'attr-name': {
    color: '#e2777a',
  },
  'namespace': {
    color: '#e2777a',
  },
  'number': {
    color: '#e2777a',
  },
  'unit': {
    color: '#e2777a',
  },
  'hexcode': {
    color: '#e2777a',
  },
  'deleted': {
    color: '#e2777a',
  },
  'property': {
    color: '#72f1b8',
    textShadow: '0 0 2px #100c0f, 0 0 10px #257c5575, 0 0 35px #21272475',
  },
  'selector': {
    color: '#72f1b8',
    textShadow: '0 0 2px #100c0f, 0 0 10px #257c5575, 0 0 35px #21272475',
  },
  'function-name': {
    color: '#6196cc',
  },
  'boolean': {
    color: '#fdfdfd',
    textShadow:
      '0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975',
  },
  'selector .token.id': {
    color: '#fdfdfd',
    textShadow:
      '0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975',
  },
  'function': {
    color: '#fdfdfd',
    textShadow:
      '0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975',
  },
  'class-name': {
    color: '#fff5f6',
    textShadow:
      '0 0 2px #000, 0 0 10px #fc1f2c75, 0 0 5px #fc1f2c75, 0 0 25px #fc1f2c75',
  },
  'constant': {
    color: '#f92aad',
    textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
  },
  'symbol': {
    color: '#f92aad',
    textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
  },
  'important': {
    color: '#f4eee4',
    textShadow: '0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575',
    fontWeight: 'bold',
  },
  'atrule': {
    color: '#f4eee4',
    textShadow: '0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575',
  },
  'keyword': {
    color: '#f4eee4',
    textShadow: '0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575',
  },
  'selector .token.class': {
    color: '#f4eee4',
    textShadow: '0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575',
  },
  'builtin': {
    color: '#f4eee4',
    textShadow: '0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575',
  },
  'string': {
    color: '#f87c32',
  },
  'char': {
    color: '#f87c32',
  },
  'attr-value': {
    color: '#f87c32',
  },
  'regex': {
    color: '#f87c32',
  },
  'variable': {
    color: '#f87c32',
  },
  'operator': {
    color: '#67cdcc',
  },
  'entity': {
    color: '#67cdcc',
    cursor: 'help',
  },
  'url': {
    color: '#67cdcc',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'inserted': {
    color: 'green',
  },
} as const;
export const materialOceanic = {
  'base': {
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    color: '#c3cee3',
    background: '#263238',
    fontFamily: 'Roboto Mono, monospace',
    fontSize: '1em',
    lineHeight: '1.5em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    overflow: 'auto',
    position: 'relative',
    margin: '0.5em 0',
    padding: '1.25em 1em',
  },
  'atrule': {
    color: '#c792ea',
  },
  'attr-name': {
    color: '#ffcb6b',
  },
  'attr-value': {
    color: '#c3e88d',
  },
  'attribute': {
    color: '#c3e88d',
  },
  'boolean': {
    color: '#c792ea',
  },
  'builtin': {
    color: '#ffcb6b',
  },
  'cdata': {
    color: '#80cbc4',
  },
  'char': {
    color: '#80cbc4',
  },
  'class': {
    color: '#ffcb6b',
  },
  'class-name': {
    color: '#f2ff00',
  },
  'color': {
    color: '#f2ff00',
  },
  'comment': {
    color: '#546e7a',
  },
  'constant': {
    color: '#c792ea',
  },
  'deleted': {
    color: '#f07178',
  },
  'doctype': {
    color: '#546e7a',
  },
  'entity': {
    color: '#f07178',
  },
  'function': {
    color: '#c792ea',
  },
  'hexcode': {
    color: '#f2ff00',
  },
  'id': {
    color: '#c792ea',
    fontWeight: 'bold',
  },
  'important': {
    color: '#c792ea',
    fontWeight: 'bold',
  },
  'inserted': {
    color: '#80cbc4',
  },
  'keyword': {
    color: '#c792ea',
    fontStyle: 'italic',
  },
  'number': {
    color: '#fd9170',
  },
  'operator': {
    color: '#89ddff',
  },
  'prolog': {
    color: '#546e7a',
  },
  'property': {
    color: '#80cbc4',
  },
  'pseudo-class': {
    color: '#c3e88d',
  },
  'pseudo-element': {
    color: '#c3e88d',
  },
  'punctuation': {
    color: '#89ddff',
  },
  'regex': {
    color: '#f2ff00',
  },
  'selector': {
    color: '#f07178',
  },
  'string': {
    color: '#c3e88d',
  },
  'symbol': {
    color: '#c792ea',
  },
  'tag': {
    color: '#f07178',
  },
  'unit': {
    color: '#f07178',
  },
  'url': {
    color: '#fd9170',
  },
  'variable': {
    color: '#f07178',
  },
} as const;
export const duotoneSpace = {
  'base': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    background: '#24242e',
    color: '#767693',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#5b5b76',
  },
  'prolog': {
    color: '#5b5b76',
  },
  'doctype': {
    color: '#5b5b76',
  },
  'cdata': {
    color: '#5b5b76',
  },
  'punctuation': {
    color: '#5b5b76',
  },
  'namespace': {
    opacity: '.7',
  },
  'tag': {
    color: '#dd672c',
  },
  'operator': {
    color: '#dd672c',
  },
  'number': {
    color: '#dd672c',
  },
  'property': {
    color: '#767693',
  },
  'function': {
    color: '#767693',
  },
  'tag-id': {
    color: '#ebebff',
  },
  'selector': {
    color: '#ebebff',
  },
  'atrule-id': {
    color: '#ebebff',
  },
  'attr-name': {
    color: '#aaaaca',
  },
  'boolean': {
    color: '#fe8c52',
  },
  'string': {
    color: '#fe8c52',
  },
  'entity': {
    color: '#fe8c52',
    cursor: 'help',
  },
  'url': {
    color: '#fe8c52',
  },
  'attr-value': {
    color: '#fe8c52',
  },
  'keyword': {
    color: '#fe8c52',
  },
  'control': {
    color: '#fe8c52',
  },
  'directive': {
    color: '#fe8c52',
  },
  'unit': {
    color: '#fe8c52',
  },
  'statement': {
    color: '#fe8c52',
  },
  'regex': {
    color: '#fe8c52',
  },
  'atrule': {
    color: '#fe8c52',
  },
  'placeholder': {
    color: '#fe8c52',
  },
  'variable': {
    color: '#fe8c52',
  },
  'deleted': {
    textDecoration: 'line-through',
  },
  'inserted': {
    borderBottom: '1px dotted #ebebff',
    textDecoration: 'none',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'important': {
    fontWeight: 'bold',
    color: '#aaaaca',
  },
  'bold': {
    fontWeight: 'bold',
  },
} as const;
export const materialLight = {
  'base': {
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    color: '#90a4ae',
    background: '#fafafa',
    fontFamily: 'Roboto Mono, monospace',
    fontSize: '1em',
    lineHeight: '1.5em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    overflow: 'auto',
    position: 'relative',
    margin: '0.5em 0',
    padding: '1.25em 1em',
  },
  'atrule': {
    color: '#7c4dff',
  },
  'attr-name': {
    color: '#39adb5',
  },
  'attr-value': {
    color: '#f6a434',
  },
  'attribute': {
    color: '#f6a434',
  },
  'boolean': {
    color: '#7c4dff',
  },
  'builtin': {
    color: '#39adb5',
  },
  'cdata': {
    color: '#39adb5',
  },
  'char': {
    color: '#39adb5',
  },
  'class': {
    color: '#39adb5',
  },
  'class-name': {
    color: '#6182b8',
  },
  'comment': {
    color: '#aabfc9',
  },
  'constant': {
    color: '#7c4dff',
  },
  'deleted': {
    color: '#e53935',
  },
  'doctype': {
    color: '#aabfc9',
  },
  'entity': {
    color: '#e53935',
  },
  'function': {
    color: '#7c4dff',
  },
  'hexcode': {
    color: '#f76d47',
  },
  'id': {
    color: '#7c4dff',
    fontWeight: 'bold',
  },
  'important': {
    color: '#7c4dff',
    fontWeight: 'bold',
  },
  'inserted': {
    color: '#39adb5',
  },
  'keyword': {
    color: '#7c4dff',
  },
  'number': {
    color: '#f76d47',
  },
  'operator': {
    color: '#39adb5',
  },
  'prolog': {
    color: '#aabfc9',
  },
  'property': {
    color: '#39adb5',
  },
  'pseudo-class': {
    color: '#f6a434',
  },
  'pseudo-element': {
    color: '#f6a434',
  },
  'punctuation': {
    color: '#39adb5',
  },
  'regex': {
    color: '#6182b8',
  },
  'selector': {
    color: '#e53935',
  },
  'string': {
    color: '#f6a434',
  },
  'symbol': {
    color: '#7c4dff',
  },
  'tag': {
    color: '#e53935',
  },
  'unit': {
    color: '#f76d47',
  },
  'url': {
    color: '#e53935',
  },
  'variable': {
    color: '#e53935',
  },
} as const;
export const duotoneSea = {
  'base': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    background: '#1d262f',
    color: '#57718e',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#4a5f78',
  },
  'prolog': {
    color: '#4a5f78',
  },
  'doctype': {
    color: '#4a5f78',
  },
  'cdata': {
    color: '#4a5f78',
  },
  'punctuation': {
    color: '#4a5f78',
  },
  'namespace': {
    opacity: '.7',
  },
  'tag': {
    color: '#0aa370',
  },
  'operator': {
    color: '#0aa370',
  },
  'number': {
    color: '#0aa370',
  },
  'property': {
    color: '#57718e',
  },
  'function': {
    color: '#57718e',
  },
  'tag-id': {
    color: '#ebf4ff',
  },
  'selector': {
    color: '#ebf4ff',
  },
  'atrule-id': {
    color: '#ebf4ff',
  },
  'attr-name': {
    color: '#7eb6f6',
  },
  'boolean': {
    color: '#47ebb4',
  },
  'string': {
    color: '#47ebb4',
  },
  'entity': {
    color: '#47ebb4',
    cursor: 'help',
  },
  'url': {
    color: '#47ebb4',
  },
  'attr-value': {
    color: '#47ebb4',
  },
  'keyword': {
    color: '#47ebb4',
  },
  'control': {
    color: '#47ebb4',
  },
  'directive': {
    color: '#47ebb4',
  },
  'unit': {
    color: '#47ebb4',
  },
  'statement': {
    color: '#47ebb4',
  },
  'regex': {
    color: '#47ebb4',
  },
  'atrule': {
    color: '#47ebb4',
  },
  'placeholder': {
    color: '#47ebb4',
  },
  'variable': {
    color: '#47ebb4',
  },
  'deleted': {
    textDecoration: 'line-through',
  },
  'inserted': {
    borderBottom: '1px dotted #ebf4ff',
    textDecoration: 'none',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'important': {
    fontWeight: 'bold',
    color: '#7eb6f6',
  },
  'bold': {
    fontWeight: 'bold',
  },
} as const;
export const a11yDark = {
  'base': {
    color: '#f8f8f2',
    background: '#2b2b2b',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  'comment': {
    color: '#d4d0ab',
  },
  'prolog': {
    color: '#d4d0ab',
  },
  'doctype': {
    color: '#d4d0ab',
  },
  'cdata': {
    color: '#d4d0ab',
  },
  'punctuation': {
    color: '#fefefe',
  },
  'property': {
    color: '#ffa07a',
  },
  'tag': {
    color: '#ffa07a',
  },
  'constant': {
    color: '#ffa07a',
  },
  'symbol': {
    color: '#ffa07a',
  },
  'deleted': {
    color: '#ffa07a',
  },
  'boolean': {
    color: '#00e0e0',
  },
  'number': {
    color: '#00e0e0',
  },
  'selector': {
    color: '#abe338',
  },
  'attr-name': {
    color: '#abe338',
  },
  'string': {
    color: '#abe338',
  },
  'char': {
    color: '#abe338',
  },
  'builtin': {
    color: '#abe338',
  },
  'inserted': {
    color: '#abe338',
  },
  'operator': {
    color: '#00e0e0',
  },
  'entity': {
    color: '#00e0e0',
    cursor: 'help',
  },
  'url': {
    color: '#00e0e0',
  },
  'variable': {
    color: '#00e0e0',
  },
  'atrule': {
    color: '#ffd700',
  },
  'attr-value': {
    color: '#ffd700',
  },
  'function': {
    color: '#ffd700',
  },
  'keyword': {
    color: '#00e0e0',
  },
  'regex': {
    color: '#ffd700',
  },
  'important': {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
export const darcula = {
  'base': {
    color: '#a9b7c6',
    fontFamily: "Consolas, Monaco, 'Andale Mono', monospace",
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    background: '#2b2b2b',
  },
  'comment': {
    color: '#808080',
  },
  'prolog': {
    color: '#808080',
  },
  'cdata': {
    color: '#808080',
  },
  'delimiter': {
    color: '#cc7832',
  },
  'boolean': {
    color: '#cc7832',
  },
  'keyword': {
    color: '#cc7832',
  },
  'selector': {
    color: '#cc7832',
  },
  'important': {
    color: '#cc7832',
  },
  'atrule': {
    color: '#cc7832',
  },
  'operator': {
    color: '#a9b7c6',
  },
  'punctuation': {
    color: '#a9b7c6',
  },
  'attr-name': {
    color: '#a9b7c6',
  },
  'tag': {
    color: '#e8bf6a',
  },
  'tag .punctuation': {
    color: '#e8bf6a',
  },
  'doctype': {
    color: '#e8bf6a',
  },
  'builtin': {
    color: '#e8bf6a',
  },
  'entity': {
    color: '#6897bb',
  },
  'number': {
    color: '#6897bb',
  },
  'symbol': {
    color: '#6897bb',
  },
  'property': {
    color: '#9876aa',
  },
  'constant': {
    color: '#9876aa',
  },
  'variable': {
    color: '#9876aa',
  },
  'string': {
    color: '#6a8759',
  },
  'char': {
    color: '#6a8759',
  },
  'attr-value': {
    color: '#a5c261',
  },
  'attr-value .punctuation': {
    color: '#a5c261',
  },
  'attr-value .punctuation:first-child': {
    color: '#a9b7c6',
  },
  'url': {
    color: '#287bde',
    textDecoration: 'underline',
  },
  'function': {
    color: '#ffc66d',
  },
  'regex': {
    background: '#364135',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'inserted': {
    background: '#294436',
  },
  'deleted': {
    background: '#484a4a',
  },
} as const;
export const zTouch = {
  'base': {
    color: 'white',
    fontFamily: 'monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    lineHeight: '25px',
    fontSize: '18px',
    margin: '0.5em 0',
    background: '#0a143c',
    padding: '1em',
    overflow: 'auto',
  },
  'comment': {
    color: 'rgb(99, 119, 119)',
    fontStyle: 'italic',
  },
  'prolog': {
    color: 'rgb(99, 119, 119)',
    fontStyle: 'italic',
  },
  'cdata': {
    color: 'rgb(99, 119, 119)',
    fontStyle: 'italic',
  },
  'punctuation': {
    color: 'rgb(199, 146, 234)',
  },
  'deleted': {
    color: 'rgba(239, 83, 80, 0.56)',
    fontStyle: 'italic',
  },
  'symbol': {
    color: 'rgb(128, 203, 196)',
  },
  'property': {
    color: 'rgb(128, 203, 196)',
  },
  'tag': {
    color: 'rgb(127, 219, 202)',
  },
  'operator': {
    color: 'rgb(127, 219, 202)',
  },
  'keyword': {
    color: 'rgb(127, 219, 202)',
  },
  'boolean': {
    color: 'rgb(255, 88, 116)',
  },
  'number': {
    color: 'rgb(247, 140, 108)',
  },
  'constant': {
    color: 'rgb(34 183 199)',
  },
  'function': {
    color: 'rgb(34 183 199)',
  },
  'builtin': {
    color: 'rgb(34 183 199)',
  },
  'char': {
    color: 'rgb(34 183 199)',
  },
  'selector': {
    color: 'rgb(199, 146, 234)',
    fontStyle: 'italic',
  },
  'doctype': {
    color: 'rgb(199, 146, 234)',
    fontStyle: 'italic',
  },
  'attr-name': {
    color: 'rgb(173, 219, 103)',
    fontStyle: 'italic',
  },
  'inserted': {
    color: 'rgb(173, 219, 103)',
    fontStyle: 'italic',
  },
  'string': {
    color: 'rgb(173, 219, 103)',
  },
  'url': {
    color: 'rgb(173, 219, 103)',
  },
  'entity': {
    color: 'rgb(173, 219, 103)',
  },
  'class-name': {
    color: 'rgb(255, 203, 139)',
  },
  'atrule': {
    color: 'rgb(255, 203, 139)',
  },
  'attr-value': {
    color: 'rgb(255, 203, 139)',
  },
  'regex': {
    color: 'rgb(214, 222, 235)',
  },
  'important': {
    color: 'rgb(214, 222, 235)',
    fontWeight: 'bold',
  },
  'variable': {
    color: 'rgb(214, 222, 235)',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
export const duotoneEarth = {
  'base': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    background: '#322d29',
    color: '#88786d',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#6a5f58',
  },
  'prolog': {
    color: '#6a5f58',
  },
  'doctype': {
    color: '#6a5f58',
  },
  'cdata': {
    color: '#6a5f58',
  },
  'punctuation': {
    color: '#6a5f58',
  },
  'namespace': {
    opacity: '.7',
  },
  'tag': {
    color: '#bfa05a',
  },
  'operator': {
    color: '#bfa05a',
  },
  'number': {
    color: '#bfa05a',
  },
  'property': {
    color: '#88786d',
  },
  'function': {
    color: '#88786d',
  },
  'tag-id': {
    color: '#fff3eb',
  },
  'selector': {
    color: '#fff3eb',
  },
  'atrule-id': {
    color: '#fff3eb',
  },
  'attr-name': {
    color: '#a48774',
  },
  'boolean': {
    color: '#fcc440',
  },
  'string': {
    color: '#fcc440',
  },
  'entity': {
    color: '#fcc440',
    cursor: 'help',
  },
  'url': {
    color: '#fcc440',
  },
  'attr-value': {
    color: '#fcc440',
  },
  'keyword': {
    color: '#fcc440',
  },
  'control': {
    color: '#fcc440',
  },
  'directive': {
    color: '#fcc440',
  },
  'unit': {
    color: '#fcc440',
  },
  'statement': {
    color: '#fcc440',
  },
  'regex': {
    color: '#fcc440',
  },
  'atrule': {
    color: '#fcc440',
  },
  'placeholder': {
    color: '#fcc440',
  },
  'variable': {
    color: '#fcc440',
  },
  'deleted': {
    textDecoration: 'line-through',
  },
  'inserted': {
    borderBottom: '1px dotted #fff3eb',
    textDecoration: 'none',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'important': {
    fontWeight: 'bold',
    color: '#a48774',
  },
  'bold': {
    fontWeight: 'bold',
  },
} as const;
export const gruvboxLight = {
  'base': {
    color: '#3c3836',
    fontFamily: 'Consolas, Monaco, "Andale Mono", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    background: '#f9f5d7',
  },
  'comment': {
    color: '#7c6f64',
  },
  'prolog': {
    color: '#7c6f64',
  },
  'cdata': {
    color: '#7c6f64',
  },
  'delimiter': {
    color: '#9d0006',
  },
  'boolean': {
    color: '#9d0006',
  },
  'keyword': {
    color: '#9d0006',
  },
  'selector': {
    color: '#9d0006',
  },
  'important': {
    color: '#9d0006',
  },
  'atrule': {
    color: '#9d0006',
  },
  'operator': {
    color: '#7c6f64',
  },
  'punctuation': {
    color: '#7c6f64',
  },
  'attr-name': {
    color: '#7c6f64',
  },
  'tag': {
    color: '#b57614',
  },
  'tag .punctuation': {
    color: '#b57614',
  },
  'doctype': {
    color: '#b57614',
  },
  'builtin': {
    color: '#b57614',
  },
  'entity': {
    color: '#8f3f71',
  },
  'number': {
    color: '#8f3f71',
  },
  'symbol': {
    color: '#8f3f71',
  },
  'property': {
    color: '#9d0006',
  },
  'constant': {
    color: '#9d0006',
  },
  'variable': {
    color: '#9d0006',
  },
  'string': {
    color: '#797403',
  },
  'char': {
    color: '#797403',
  },
  'attr-value': {
    color: '#7c6f64',
  },
  'attr-value .punctuation': {
    color: '#7c6f64',
  },
  'url': {
    color: '#797403',
    textDecoration: 'underline',
  },
  'function': {
    color: '#b57614',
  },
  'regex': {
    background: '#797403',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'inserted': {
    background: '#7c6f64',
  },
  'deleted': {
    background: '#9d0006',
  },
} as const;
export const oneDark = {
  'base': {
    background: 'hsl(220, 13%, 18%)',
    color: 'hsl(220, 14%, 71%)',
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily:
      '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '2',
    OTabSize: '2',
    tabSize: '2',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  'comment': {
    color: 'hsl(220, 10%, 40%)',
    fontStyle: 'italic',
  },
  'prolog': {
    color: 'hsl(220, 10%, 40%)',
  },
  'cdata': {
    color: 'hsl(220, 10%, 40%)',
  },
  'doctype': {
    color: 'hsl(220, 14%, 71%)',
  },
  'punctuation': {
    color: 'hsl(220, 14%, 71%)',
  },
  'entity': {
    color: 'hsl(220, 14%, 71%)',
    cursor: 'help',
  },
  'attr-name': {
    color: 'hsl(29, 54%, 61%)',
  },
  'class-name': {
    color: 'hsl(29, 54%, 61%)',
  },
  'boolean': {
    color: 'hsl(29, 54%, 61%)',
  },
  'constant': {
    color: 'hsl(29, 54%, 61%)',
  },
  'number': {
    color: 'hsl(29, 54%, 61%)',
  },
  'atrule': {
    color: 'hsl(29, 54%, 61%)',
  },
  'keyword': {
    color: 'hsl(286, 60%, 67%)',
  },
  'property': {
    color: 'hsl(355, 65%, 65%)',
  },
  'tag': {
    color: 'hsl(355, 65%, 65%)',
  },
  'symbol': {
    color: 'hsl(355, 65%, 65%)',
  },
  'deleted': {
    color: 'hsl(355, 65%, 65%)',
  },
  'important': {
    color: 'hsl(355, 65%, 65%)',
  },
  'selector': {
    color: 'hsl(95, 38%, 62%)',
  },
  'string': {
    color: 'hsl(95, 38%, 62%)',
  },
  'char': {
    color: 'hsl(95, 38%, 62%)',
  },
  'builtin': {
    color: 'hsl(95, 38%, 62%)',
  },
  'inserted': {
    color: 'hsl(95, 38%, 62%)',
  },
  'regex': {
    color: 'hsl(95, 38%, 62%)',
  },
  'attr-value': {
    color: 'hsl(95, 38%, 62%)',
  },
  'attr-value > .token.punctuation': {
    color: 'hsl(95, 38%, 62%)',
  },
  'variable': {
    color: 'hsl(207, 82%, 66%)',
  },
  'operator': {
    color: 'hsl(207, 82%, 66%)',
  },
  'function': {
    color: 'hsl(207, 82%, 66%)',
  },
  'url': {
    color: 'hsl(187, 47%, 55%)',
  },
  'attr-value > .token.punctuation.attr-equals': {
    color: 'hsl(220, 14%, 71%)',
  },
  'special-attr > .token.attr-value > .token.value.css': {
    color: 'hsl(220, 14%, 71%)',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'namespace': {
    opacity: '0.8',
  },
  'token.tab:not(:empty):before': {
    color: 'hsla(220, 14%, 71%, 0.15)',
    textShadow: 'none',
  },
  'token.cr:before': {
    color: 'hsla(220, 14%, 71%, 0.15)',
    textShadow: 'none',
  },
  'token.lf:before': {
    color: 'hsla(220, 14%, 71%, 0.15)',
    textShadow: 'none',
  },
  'token.space:before': {
    color: 'hsla(220, 14%, 71%, 0.15)',
    textShadow: 'none',
  },
} as const;
export const duotoneDark = {
  'base': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    background: '#2a2734',
    color: '#9a86fd',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#6c6783',
  },
  'prolog': {
    color: '#6c6783',
  },
  'doctype': {
    color: '#6c6783',
  },
  'cdata': {
    color: '#6c6783',
  },
  'punctuation': {
    color: '#6c6783',
  },
  'namespace': {
    opacity: '.7',
  },
  'tag': {
    color: '#e09142',
  },
  'operator': {
    color: '#e09142',
  },
  'number': {
    color: '#e09142',
  },
  'property': {
    color: '#9a86fd',
  },
  'function': {
    color: '#9a86fd',
  },
  'tag-id': {
    color: '#eeebff',
  },
  'selector': {
    color: '#eeebff',
  },
  'atrule-id': {
    color: '#eeebff',
  },
  'attr-name': {
    color: '#c4b9fe',
  },
  'boolean': {
    color: '#ffcc99',
  },
  'string': {
    color: '#ffcc99',
  },
  'entity': {
    color: '#ffcc99',
    cursor: 'help',
  },
  'url': {
    color: '#ffcc99',
  },
  'attr-value': {
    color: '#ffcc99',
  },
  'keyword': {
    color: '#ffcc99',
  },
  'control': {
    color: '#ffcc99',
  },
  'directive': {
    color: '#ffcc99',
  },
  'unit': {
    color: '#ffcc99',
  },
  'statement': {
    color: '#ffcc99',
  },
  'regex': {
    color: '#ffcc99',
  },
  'atrule': {
    color: '#ffcc99',
  },
  'placeholder': {
    color: '#ffcc99',
  },
  'variable': {
    color: '#ffcc99',
  },
  'deleted': {
    textDecoration: 'line-through',
  },
  'inserted': {
    borderBottom: '1px dotted #eeebff',
    textDecoration: 'none',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'important': {
    fontWeight: 'bold',
    color: '#c4b9fe',
  },
  'bold': {
    fontWeight: 'bold',
  },
} as const;
export const lucario = {
  'base': {
    color: '#f8f8f2',
    background: '#263E52',
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily: "Monaco, Consolas, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  'comment': {
    color: '#5c98cd',
  },
  'prolog': {
    color: '#5c98cd',
  },
  'doctype': {
    color: '#5c98cd',
  },
  'cdata': {
    color: '#5c98cd',
  },
  'punctuation': {
    color: '#f8f8f2',
  },
  'property': {
    color: '#F05E5D',
  },
  'tag': {
    color: '#F05E5D',
  },
  'constant': {
    color: '#F05E5D',
  },
  'symbol': {
    color: '#F05E5D',
  },
  'deleted': {
    color: '#F05E5D',
  },
  'boolean': {
    color: '#BC94F9',
  },
  'number': {
    color: '#BC94F9',
  },
  'selector': {
    color: '#FCFCD6',
  },
  'attr-name': {
    color: '#FCFCD6',
  },
  'string': {
    color: '#FCFCD6',
  },
  'char': {
    color: '#FCFCD6',
  },
  'builtin': {
    color: '#FCFCD6',
  },
  'inserted': {
    color: '#FCFCD6',
  },
  'operator': {
    color: '#f8f8f2',
  },
  'entity': {
    color: '#f8f8f2',
    cursor: 'help',
  },
  'url': {
    color: '#f8f8f2',
  },
  'variable': {
    color: '#f8f8f2',
  },
  'atrule': {
    color: '#66D8EF',
  },
  'attr-value': {
    color: '#66D8EF',
  },
  'function': {
    color: '#66D8EF',
  },
  'class-name': {
    color: '#66D8EF',
  },
  'keyword': {
    color: '#6EB26E',
  },
  'regex': {
    color: '#F05E5D',
  },
  'important': {
    color: '#F05E5D',
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
export const coldarkDark = {
  'base': {
    color: '#e3eaf2',
    background: '#111b27',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#8da1b9',
  },
  'prolog': {
    color: '#8da1b9',
  },
  'doctype': {
    color: '#8da1b9',
  },
  'cdata': {
    color: '#8da1b9',
  },
  'punctuation': {
    color: '#e3eaf2',
  },
  'delimiter.important': {
    color: '#66cccc',
    fontWeight: 'inherit',
  },
  'selector .parent': {
    color: '#66cccc',
  },
  'tag': {
    color: '#66cccc',
  },
  'tag .token.punctuation': {
    color: '#66cccc',
  },
  'attr-name': {
    color: '#e6d37a',
  },
  'boolean': {
    color: '#e6d37a',
  },
  'boolean.important': {
    color: '#e6d37a',
  },
  'number': {
    color: '#e6d37a',
  },
  'constant': {
    color: '#e6d37a',
  },
  'selector .token.attribute': {
    color: '#e6d37a',
  },
  'class-name': {
    color: '#6cb8e6',
  },
  'key': {
    color: '#6cb8e6',
  },
  'parameter': {
    color: '#6cb8e6',
  },
  'property': {
    color: '#6cb8e6',
  },
  'property-access': {
    color: '#6cb8e6',
  },
  'variable': {
    color: '#6cb8e6',
  },
  'attr-value': {
    color: '#91d076',
  },
  'inserted': {
    color: '#91d076',
  },
  'color': {
    color: '#91d076',
  },
  'selector .token.value': {
    color: '#91d076',
  },
  'string': {
    color: '#91d076',
  },
  'string .token.url-link': {
    color: '#91d076',
  },
  'builtin': {
    color: '#f4adf4',
  },
  'keyword-array': {
    color: '#f4adf4',
  },
  'package': {
    color: '#f4adf4',
  },
  'regex': {
    color: '#f4adf4',
  },
  'function': {
    color: '#c699e3',
  },
  'selector .token.class': {
    color: '#c699e3',
  },
  'selector .token.id': {
    color: '#c699e3',
  },
  'atrule .token.rule': {
    color: '#e9ae7e',
  },
  'combinator': {
    color: '#e9ae7e',
  },
  'keyword': {
    color: '#e9ae7e',
  },
  'operator': {
    color: '#e9ae7e',
  },
  'pseudo-class': {
    color: '#e9ae7e',
  },
  'pseudo-element': {
    color: '#e9ae7e',
  },
  'selector': {
    color: '#e9ae7e',
  },
  'unit': {
    color: '#e9ae7e',
  },
  'deleted': {
    color: '#cd6660',
  },
  'important': {
    color: '#cd6660',
    fontWeight: 'bold',
  },
  'keyword-this': {
    color: '#6cb8e6',
    fontWeight: 'bold',
  },
  'this': {
    color: '#6cb8e6',
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'entity': {
    cursor: 'help',
  },
  'token.tab:not(:empty):before': {
    color: '#8da1b9',
  },
  'token.cr:before': {
    color: '#8da1b9',
  },
  'token.lf:before': {
    color: '#8da1b9',
  },
  'token.space:before': {
    color: '#8da1b9',
  },
} as const;
export const atomDark = {
  'base': {
    color: '#c5c8c6',
    textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    fontFamily:
      "Inconsolata, Monaco, Consolas, 'Courier New', Courier, monospace",
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
    background: '#1d1f21',
  },
  'comment': {
    color: '#7C7C7C',
  },
  'prolog': {
    color: '#7C7C7C',
  },
  'doctype': {
    color: '#7C7C7C',
  },
  'cdata': {
    color: '#7C7C7C',
  },
  'punctuation': {
    color: '#c5c8c6',
  },
  'property': {
    color: '#96CBFE',
  },
  'keyword': {
    color: '#96CBFE',
  },
  'tag': {
    color: '#96CBFE',
  },
  'class-name': {
    color: '#FFFFB6',
    textDecoration: 'underline',
  },
  'boolean': {
    color: '#99CC99',
  },
  'constant': {
    color: '#99CC99',
  },
  'symbol': {
    color: '#f92672',
  },
  'deleted': {
    color: '#f92672',
  },
  'number': {
    color: '#FF73FD',
  },
  'selector': {
    color: '#A8FF60',
  },
  'attr-name': {
    color: '#A8FF60',
  },
  'string': {
    color: '#A8FF60',
  },
  'char': {
    color: '#A8FF60',
  },
  'builtin': {
    color: '#A8FF60',
  },
  'inserted': {
    color: '#A8FF60',
  },
  'variable': {
    color: '#C6C5FE',
  },
  'operator': {
    color: '#EDEDED',
  },
  'entity': {
    color: '#FFFFB6',
    cursor: 'help',
  },
  'url': {
    color: '#96CBFE',
  },
  'atrule': {
    color: '#F9EE98',
  },
  'attr-value': {
    color: '#F9EE98',
  },
  'function': {
    color: '#DAD085',
  },
  'regex': {
    color: '#E9C062',
  },
  'important': {
    color: '#fd971f',
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
export const pojoaque = {
  'base': {
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#DCCF8F',
    textShadow: '0',
    borderRadius: '5px',
    border: '1px solid #000',
    background:
      "#181914 url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAMAAA/+4ADkFkb2JlAGTAAAAAAf/bAIQACQYGBgcGCQcHCQ0IBwgNDwsJCQsPEQ4ODw4OERENDg4ODg0RERQUFhQUERoaHBwaGiYmJiYmKysrKysrKysrKwEJCAgJCgkMCgoMDwwODA8TDg4ODhMVDg4PDg4VGhMRERERExoXGhYWFhoXHR0aGh0dJCQjJCQrKysrKysrKysr/8AAEQgAjACMAwEiAAIRAQMRAf/EAF4AAQEBAAAAAAAAAAAAAAAAAAABBwEBAQAAAAAAAAAAAAAAAAAAAAIQAAEDAwIHAQEAAAAAAAAAAADwAREhYaExkUFRcYGxwdHh8REBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AyGFEjHaBS2fDDs2zkhKmBKktb7km+ZwwCnXPkLVmCTMItj6AXFxRS465/BTnkAJvkLkJe+7AKKoi2AtRS2zuAWsCb5GOlBN8gKfmuGHZ8MFqIth3ALmFoFwbwKWyAlTAp17uKqBvgBD8sM4fTjhvAhkzhaRkBMKBrfs7jGPIpzy7gFrAqnC0C0gB0EWwBDW2cBVQwm+QtPpa3wBO3sVvszCnLAhkzgL5/RLf13cLQd8/AGlu0Cb5HTx9KuAEieGJEdcehS3eRTp2ATdt3CpIm+QtZwAhROXFeb7swp/ahaM3kBE/jSIUBc/AWrgBN8uNFAl+b7sAXFxFn2YLUU5Ns7gFX8C4ib+hN8gFWXwK3bZglxEJm+gKdciLPsFV/TClsgJUwKJ5FVA7tvIFrfZhVfGJDcsCKaYgAqv6YRbE+RWOWBtu7+AL3yRalXLyKqAIIfk+zARbDgFyEsncYwJvlgFRW+GEWntIi2P0BooyFxcNr8Ep3+ANLbMO+QyhvbiqdgC0kVvgUUiLYgBS2QtPbiVI1/sgOmG9uO+Y8DW+7jS2zAOnj6O2BndwuIAUtkdRN8gFoK3wwXMQyZwHVbClsuNLd4E3yAUR6FVDBR+BafQGt93LVMxJTv8ABts4CVLhcfYWsCb5kC9/BHdU8CLYFY5bMAd+eX9MGthhpbA1vu4B7+RKkaW2Yq4AQtVBBFsAJU/AuIXBhN8gGWnstefhiZyWvLAEnbYS1uzSFP6Jvn4Baxx70JKkQojLib5AVTey1jjgkKJGO0AKWyOm7N7cSpgSpAdPH0Tfd/gp1z5C1ZgKqN9J2wFxcUUuAFLZAm+QC0Fb4YUVRFsAOvj4KW2dwtYE3yAWk/wS/PLMKfmuGHZ8MAXF/Ja32Yi5haAKWz4Ydm2cSpgU693Atb7km+Zwwh+WGcPpxw3gAkzCLY+iYUDW/Z3Adc/gpzyFrAqnALkJe+7DoItgAtRS2zuKqGE3yAx0oJvkdvYrfZmALURbDuL5/RLf13cAuDeBS2RpbtAm+QFVA3wR+3fUtFHoBDJnC0jIXH0HWsgMY8inPLuOkd9chp4z20ALQLSA8cI9jYAIa2zjzjBd8gRafS1vgiUho/kAKcsCGTOGWvoOpkAtB3z8Hm8x2Ff5ADp4+lXAlIvcmwH/2Q==') repeat left top",
    padding: '12px',
    overflow: 'auto',
  },
  'namespace': {
    opacity: '.7',
  },
  'comment': {
    color: '#586e75',
    fontStyle: 'italic',
  },
  'prolog': {
    color: '#586e75',
    fontStyle: 'italic',
  },
  'doctype': {
    color: '#586e75',
    fontStyle: 'italic',
  },
  'cdata': {
    color: '#586e75',
    fontStyle: 'italic',
  },
  'number': {
    color: '#b89859',
  },
  'string': {
    color: '#468966',
  },
  'char': {
    color: '#468966',
  },
  'builtin': {
    color: '#468966',
  },
  'inserted': {
    color: '#468966',
  },
  'attr-name': {
    color: '#b89859',
  },
  'operator': {
    color: '#dccf8f',
  },
  'entity': {
    color: '#dccf8f',
    cursor: 'help',
  },
  'url': {
    color: '#dccf8f',
  },
  'selector': {
    color: '#859900',
  },
  'regex': {
    color: '#859900',
  },
  'atrule': {
    color: '#cb4b16',
  },
  'keyword': {
    color: '#cb4b16',
  },
  'attr-value': {
    color: '#468966',
  },
  'function': {
    color: '#b58900',
  },
  'variable': {
    color: '#b58900',
  },
  'placeholder': {
    color: '#b58900',
  },
  'property': {
    color: '#b89859',
  },
  'tag': {
    color: '#ffb03b',
  },
  'boolean': {
    color: '#b89859',
  },
  'constant': {
    color: '#b89859',
  },
  'symbol': {
    color: '#b89859',
  },
  'important': {
    color: '#dc322f',
  },
  'statement': {
    color: '#dc322f',
  },
  'deleted': {
    color: '#dc322f',
  },
  'punctuation': {
    color: '#dccf8f',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
export const duotoneLight = {
  'base': {
    fontFamily:
      'Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace',
    fontSize: '14px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    background: '#faf8f5',
    color: '#728fcb',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#b6ad9a',
  },
  'prolog': {
    color: '#b6ad9a',
  },
  'doctype': {
    color: '#b6ad9a',
  },
  'cdata': {
    color: '#b6ad9a',
  },
  'punctuation': {
    color: '#b6ad9a',
  },
  'namespace': {
    opacity: '.7',
  },
  'tag': {
    color: '#063289',
  },
  'operator': {
    color: '#063289',
  },
  'number': {
    color: '#063289',
  },
  'property': {
    color: '#b29762',
  },
  'function': {
    color: '#b29762',
  },
  'tag-id': {
    color: '#2d2006',
  },
  'selector': {
    color: '#2d2006',
  },
  'atrule-id': {
    color: '#2d2006',
  },
  'attr-name': {
    color: '#896724',
  },
  'boolean': {
    color: '#728fcb',
  },
  'string': {
    color: '#728fcb',
  },
  'entity': {
    color: '#728fcb',
    cursor: 'help',
  },
  'url': {
    color: '#728fcb',
  },
  'attr-value': {
    color: '#728fcb',
  },
  'keyword': {
    color: '#728fcb',
  },
  'control': {
    color: '#728fcb',
  },
  'directive': {
    color: '#728fcb',
  },
  'unit': {
    color: '#728fcb',
  },
  'statement': {
    color: '#728fcb',
  },
  'regex': {
    color: '#728fcb',
  },
  'atrule': {
    color: '#728fcb',
  },
  'placeholder': {
    color: '#93abdc',
  },
  'variable': {
    color: '#93abdc',
  },
  'deleted': {
    textDecoration: 'line-through',
  },
  'inserted': {
    borderBottom: '1px dotted #2d2006',
    textDecoration: 'none',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'important': {
    fontWeight: 'bold',
    color: '#896724',
  },
  'bold': {
    fontWeight: 'bold',
  },
} as const;
export const nightOwl = {
  'base': {
    color: 'white',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    fontSize: '1em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    background: '#011627',
  },
  'comment': {
    color: 'rgb(99, 119, 119)',
    fontStyle: 'italic',
  },
  'prolog': {
    color: 'rgb(99, 119, 119)',
    fontStyle: 'italic',
  },
  'cdata': {
    color: 'rgb(99, 119, 119)',
    fontStyle: 'italic',
  },
  'punctuation': {
    color: 'rgb(199, 146, 234)',
  },
  'deleted': {
    color: 'rgba(239, 83, 80, 0.56)',
    fontStyle: 'italic',
  },
  'symbol': {
    color: 'rgb(128, 203, 196)',
  },
  'property': {
    color: 'rgb(128, 203, 196)',
  },
  'tag': {
    color: 'rgb(127, 219, 202)',
  },
  'operator': {
    color: 'rgb(127, 219, 202)',
  },
  'keyword': {
    color: 'rgb(127, 219, 202)',
  },
  'boolean': {
    color: 'rgb(255, 88, 116)',
  },
  'number': {
    color: 'rgb(247, 140, 108)',
  },
  'constant': {
    color: 'rgb(130, 170, 255)',
  },
  'function': {
    color: 'rgb(130, 170, 255)',
  },
  'builtin': {
    color: 'rgb(130, 170, 255)',
  },
  'char': {
    color: 'rgb(130, 170, 255)',
  },
  'selector': {
    color: 'rgb(199, 146, 234)',
    fontStyle: 'italic',
  },
  'doctype': {
    color: 'rgb(199, 146, 234)',
    fontStyle: 'italic',
  },
  'attr-name': {
    color: 'rgb(173, 219, 103)',
    fontStyle: 'italic',
  },
  'inserted': {
    color: 'rgb(173, 219, 103)',
    fontStyle: 'italic',
  },
  'string': {
    color: 'rgb(173, 219, 103)',
  },
  'url': {
    color: 'rgb(173, 219, 103)',
  },
  'entity': {
    color: 'rgb(173, 219, 103)',
  },
  'class-name': {
    color: 'rgb(255, 203, 139)',
  },
  'atrule': {
    color: 'rgb(255, 203, 139)',
  },
  'attr-value': {
    color: 'rgb(255, 203, 139)',
  },
  'regex': {
    color: 'rgb(214, 222, 235)',
  },
  'important': {
    color: 'rgb(214, 222, 235)',
    fontWeight: 'bold',
  },
  'variable': {
    color: 'rgb(214, 222, 235)',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
export const laserwave = {
  'base': {
    background: '#27212e',
    color: '#ffffff',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '1em',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '2',
    OTabSize: '2',
    tabSize: '2',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.5em',
  },
  'comment': {
    color: '#91889b',
  },
  'prolog': {
    color: '#91889b',
  },
  'cdata': {
    color: '#91889b',
  },
  'punctuation': {
    color: '#7b6995',
  },
  'builtin': {
    color: '#ffe261',
  },
  'constant': {
    color: '#ffe261',
  },
  'boolean': {
    color: '#ffe261',
  },
  'number': {
    color: '#b381c5',
  },
  'important': {
    color: '#40b4c4',
  },
  'atrule': {
    color: '#40b4c4',
  },
  'property': {
    color: '#40b4c4',
  },
  'keyword': {
    color: '#40b4c4',
  },
  'doctype': {
    color: '#74dfc4',
  },
  'operator': {
    color: '#74dfc4',
  },
  'inserted': {
    color: '#74dfc4',
  },
  'tag': {
    color: '#74dfc4',
  },
  'class-name': {
    color: '#74dfc4',
  },
  'symbol': {
    color: '#74dfc4',
  },
  'attr-name': {
    color: '#eb64b9',
  },
  'function': {
    color: '#eb64b9',
  },
  'deleted': {
    color: '#eb64b9',
  },
  'selector': {
    color: '#eb64b9',
  },
  'attr-value': {
    color: '#b4dce7',
  },
  'regex': {
    color: '#b4dce7',
  },
  'char': {
    color: '#b4dce7',
  },
  'string': {
    color: '#b4dce7',
  },
  'entity': {
    color: '#ffffff',
    cursor: 'help',
  },
  'url': {
    color: '#ffffff',
  },
  'variable': {
    color: '#ffffff',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'namespace': {
    opacity: '0.7',
  },
} as const;
export const coyWithoutShadows = {
  'base': {
    color: 'black',
    background: 'none',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    position: 'relative',
    borderLeft: '10px solid #358ccb',
    boxShadow: '-1px 0 0 0 #358ccb, 0 0 0 1px #dfdfdf',
    backgroundColor: '#fdfdfd',
    backgroundImage:
      'linear-gradient(transparent 50%, rgba(69, 142, 209, 0.04) 50%)',
    backgroundSize: '3em 3em',
    backgroundOrigin: 'content-box',
    backgroundAttachment: 'local',
    margin: '.5em 0',
    padding: '0 1em',
  },
  'comment': {
    color: '#7D8B99',
  },
  'block-comment': {
    color: '#7D8B99',
  },
  'prolog': {
    color: '#7D8B99',
  },
  'doctype': {
    color: '#7D8B99',
  },
  'cdata': {
    color: '#7D8B99',
  },
  'punctuation': {
    color: '#5F6364',
  },
  'property': {
    color: '#c92c2c',
  },
  'tag': {
    color: '#c92c2c',
  },
  'boolean': {
    color: '#c92c2c',
  },
  'number': {
    color: '#c92c2c',
  },
  'function-name': {
    color: '#c92c2c',
  },
  'constant': {
    color: '#c92c2c',
  },
  'symbol': {
    color: '#c92c2c',
  },
  'deleted': {
    color: '#c92c2c',
  },
  'selector': {
    color: '#2f9c0a',
  },
  'attr-name': {
    color: '#2f9c0a',
  },
  'string': {
    color: '#2f9c0a',
  },
  'char': {
    color: '#2f9c0a',
  },
  'function': {
    color: '#2f9c0a',
  },
  'builtin': {
    color: '#2f9c0a',
  },
  'inserted': {
    color: '#2f9c0a',
  },
  'operator': {
    color: '#a67f59',
    background: 'rgba(255, 255, 255, 0.5)',
  },
  'entity': {
    color: '#a67f59',
    background: 'rgba(255, 255, 255, 0.5)',
    cursor: 'help',
  },
  'url': {
    color: '#a67f59',
    background: 'rgba(255, 255, 255, 0.5)',
  },
  'variable': {
    color: '#a67f59',
    background: 'rgba(255, 255, 255, 0.5)',
  },
  'atrule': {
    color: '#1990b8',
  },
  'attr-value': {
    color: '#1990b8',
  },
  'keyword': {
    color: '#1990b8',
  },
  'class-name': {
    color: '#1990b8',
  },
  'regex': {
    color: '#e90',
  },
  'important': {
    color: '#e90',
    fontWeight: 'normal',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'namespace': {
    opacity: '.7',
  },
} as const;
export const hopscotch = {
  'base': {
    fontFamily:
      '"Fira Mono", Menlo, Monaco, "Lucida Console", "Courier New", Courier, monospace',
    fontSize: '16px',
    lineHeight: '1.375',
    direction: 'ltr',
    textAlign: 'left',
    wordSpacing: 'normal',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
    background: '#322931',
    color: '#b9b5b8',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
  },
  'comment': {
    color: '#797379',
  },
  'prolog': {
    color: '#797379',
  },
  'doctype': {
    color: '#797379',
  },
  'cdata': {
    color: '#797379',
  },
  'punctuation': {
    color: '#b9b5b8',
  },
  'null': {
    color: '#fd8b19',
  },
  'operator': {
    color: '#fd8b19',
  },
  'boolean': {
    color: '#fd8b19',
  },
  'number': {
    color: '#fd8b19',
  },
  'property': {
    color: '#fdcc59',
  },
  'tag': {
    color: '#1290bf',
  },
  'string': {
    color: '#149b93',
  },
  'selector': {
    color: '#c85e7c',
  },
  'attr-name': {
    color: '#fd8b19',
  },
  'entity': {
    color: '#149b93',
    cursor: 'help',
  },
  'url': {
    color: '#149b93',
  },
  'attr-value': {
    color: '#8fc13e',
  },
  'keyword': {
    color: '#8fc13e',
  },
  'control': {
    color: '#8fc13e',
  },
  'directive': {
    color: '#8fc13e',
  },
  'unit': {
    color: '#8fc13e',
  },
  'statement': {
    color: '#149b93',
  },
  'regex': {
    color: '#149b93',
  },
  'atrule': {
    color: '#149b93',
  },
  'placeholder': {
    color: '#1290bf',
  },
  'variable': {
    color: '#1290bf',
  },
  'important': {
    color: '#dd464c',
    fontWeight: 'bold',
  },
} as const;
export const oneLight = {
  'base': {
    background: 'hsl(230, 1%, 98%)',
    color: 'hsl(230, 8%, 24%)',
    fontFamily:
      '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    lineHeight: '1.5',
    MozTabSize: '2',
    OTabSize: '2',
    tabSize: '2',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  'comment': {
    color: 'hsl(230, 4%, 64%)',
    fontStyle: 'italic',
  },
  'prolog': {
    color: 'hsl(230, 4%, 64%)',
  },
  'cdata': {
    color: 'hsl(230, 4%, 64%)',
  },
  'doctype': {
    color: 'hsl(230, 8%, 24%)',
  },
  'punctuation': {
    color: 'hsl(230, 8%, 24%)',
  },
  'entity': {
    color: 'hsl(230, 8%, 24%)',
    cursor: 'help',
  },
  'attr-name': {
    color: 'hsl(35, 99%, 36%)',
  },
  'class-name': {
    color: 'hsl(35, 99%, 36%)',
  },
  'boolean': {
    color: 'hsl(35, 99%, 36%)',
  },
  'constant': {
    color: 'hsl(35, 99%, 36%)',
  },
  'number': {
    color: 'hsl(35, 99%, 36%)',
  },
  'atrule': {
    color: 'hsl(35, 99%, 36%)',
  },
  'keyword': {
    color: 'hsl(301, 63%, 40%)',
  },
  'property': {
    color: 'hsl(5, 74%, 59%)',
  },
  'tag': {
    color: 'hsl(5, 74%, 59%)',
  },
  'symbol': {
    color: 'hsl(5, 74%, 59%)',
  },
  'deleted': {
    color: 'hsl(5, 74%, 59%)',
  },
  'important': {
    color: 'hsl(5, 74%, 59%)',
  },
  'selector': {
    color: 'hsl(119, 34%, 47%)',
  },
  'string': {
    color: 'hsl(119, 34%, 47%)',
  },
  'char': {
    color: 'hsl(119, 34%, 47%)',
  },
  'builtin': {
    color: 'hsl(119, 34%, 47%)',
  },
  'inserted': {
    color: 'hsl(119, 34%, 47%)',
  },
  'regex': {
    color: 'hsl(119, 34%, 47%)',
  },
  'attr-value': {
    color: 'hsl(119, 34%, 47%)',
  },
  'attr-value > .token.punctuation': {
    color: 'hsl(119, 34%, 47%)',
  },
  'variable': {
    color: 'hsl(221, 87%, 60%)',
  },
  'operator': {
    color: 'hsl(221, 87%, 60%)',
  },
  'function': {
    color: 'hsl(221, 87%, 60%)',
  },
  'url': {
    color: 'hsl(198, 99%, 37%)',
  },
  'attr-value > .token.punctuation.attr-equals': {
    color: 'hsl(230, 8%, 24%)',
  },
  'special-attr > .token.attr-value > .token.value.css': {
    color: 'hsl(230, 8%, 24%)',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
  'namespace': {
    opacity: '0.8',
  },
  'token.tab:not(:empty):before': {
    color: 'hsla(230, 8%, 24%, 0.2)',
  },
  'token.cr:before': {
    color: 'hsla(230, 8%, 24%, 0.2)',
  },
  'token.lf:before': {
    color: 'hsla(230, 8%, 24%, 0.2)',
  },
  'token.space:before': {
    color: 'hsla(230, 8%, 24%, 0.2)',
  },
} as const;
export const nord = {
  'base': {
    color: '#f8f8f2',
    background: '#2E3440',
    fontFamily:
      "\"Fira Code\", Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  'comment': {
    color: '#636f88',
  },
  'prolog': {
    color: '#636f88',
  },
  'doctype': {
    color: '#636f88',
  },
  'cdata': {
    color: '#636f88',
  },
  'punctuation': {
    color: '#81A1C1',
  },
  'property': {
    color: '#81A1C1',
  },
  'tag': {
    color: '#81A1C1',
  },
  'constant': {
    color: '#81A1C1',
  },
  'symbol': {
    color: '#81A1C1',
  },
  'deleted': {
    color: '#81A1C1',
  },
  'number': {
    color: '#B48EAD',
  },
  'boolean': {
    color: '#81A1C1',
  },
  'selector': {
    color: '#A3BE8C',
  },
  'attr-name': {
    color: '#A3BE8C',
  },
  'string': {
    color: '#A3BE8C',
  },
  'char': {
    color: '#A3BE8C',
  },
  'builtin': {
    color: '#A3BE8C',
  },
  'inserted': {
    color: '#A3BE8C',
  },
  'operator': {
    color: '#81A1C1',
  },
  'entity': {
    color: '#81A1C1',
    cursor: 'help',
  },
  'url': {
    color: '#81A1C1',
  },
  'variable': {
    color: '#81A1C1',
  },
  'atrule': {
    color: '#88C0D0',
  },
  'attr-value': {
    color: '#88C0D0',
  },
  'function': {
    color: '#88C0D0',
  },
  'class-name': {
    color: '#88C0D0',
  },
  'keyword': {
    color: '#81A1C1',
  },
  'regex': {
    color: '#EBCB8B',
  },
  'important': {
    color: '#EBCB8B',
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
export const ghcolors = {
  'base': {
    color: '#393A34',
    fontFamily:
      '"Consolas", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    fontSize: '.9em',
    lineHeight: '1.2em',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',

    hyphens: 'none',
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    border: '1px solid #dddddd',
    backgroundColor: 'white',
  },
  'comment': {
    color: '#999988',
    fontStyle: 'italic',
  },
  'prolog': {
    color: '#999988',
    fontStyle: 'italic',
  },
  'doctype': {
    color: '#999988',
    fontStyle: 'italic',
  },
  'cdata': {
    color: '#999988',
    fontStyle: 'italic',
  },
  'namespace': {
    opacity: '.7',
  },
  'string': {
    color: '#e3116c',
  },
  'attr-value': {
    color: '#e3116c',
  },
  'punctuation': {
    color: '#393A34',
  },
  'operator': {
    color: '#393A34',
  },
  'entity': {
    color: '#36acaa',
  },
  'url': {
    color: '#36acaa',
  },
  'symbol': {
    color: '#36acaa',
  },
  'number': {
    color: '#36acaa',
  },
  'boolean': {
    color: '#36acaa',
  },
  'variable': {
    color: '#36acaa',
  },
  'constant': {
    color: '#36acaa',
  },
  'property': {
    color: '#36acaa',
  },
  'regex': {
    color: '#36acaa',
  },
  'inserted': {
    color: '#36acaa',
  },
  'atrule': {
    color: '#00a4db',
  },
  'keyword': {
    color: '#00a4db',
  },
  'attr-name': {
    color: '#00a4db',
  },
  'function': {
    color: '#9a050f',
    fontWeight: 'bold',
  },
  'deleted': {
    color: '#9a050f',
  },
  'tag': {
    color: '#00009f',
  },
  'selector': {
    color: '#00009f',
  },
  'important': {
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;

export const vesper = {
  'base': {
    color: '#a0a0a0',
    fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none',
    MozHyphens: 'none',
    MsHyphens: 'none',
    hyphens: 'none',
    overflowX: 'auto',
    backgroundColor: '#1E1E1E',
  },
  'selection': {
    textShadow: 'none',
    background: '#ffffff25',
  },
  'print': {
    textShadow: 'none',
  },
  'pre': {
    color: '#a0a0a0',
    background: '#101010',
  },
  'comment': {
    color: '#8b8b8b94',
  },
  'punctuation': {
    color: '#8b8b8b94',
  },
  'variable': {
    color: '#a0a0a0',
  },
  'tag': {
    color: '#a0a0a0',
  },
  'hexcode': {
    color: '#a0a0a0',
  },
  'string': {
    color: 'rgb(161, 252, 234)',
  },
  'url': {
    color: '#a0a0a0',
  },
  'keyword': {
    color: '#fff',
  },
  'deleted': {
    color: '#fff',
  },
  'function': {
    color: '#ffc799',
  },
  'builtin': {
    color: '#fff',
  },
  'number': {
    color: '#fff',
  },
  'char': {
    color: '#fff',
  },
  'constant': {
    color: '#fff',
  },
  'boolean': {
    color: '#fff',
  },
  'changed': {
    color: '#fff',
  },
  'symbol': {
    color: '#99ffe4',
  },
  'inserted': {
    color: '#ffc799',
  },
  'attr-name': {
    color: '#a0a0a0',
  },
  'selector': {
    color: '#a0a0a0',
  },
  'property': {
    color: '#a0a0a0',
  },
  'regex': {
    color: '#a0a0a0',
  },
  'important': {
    fontWeight: 'bold',
  },
  'bold': {
    fontWeight: 'bold',
  },
  'italic': {
    fontStyle: 'italic',
  },
} as const;
