const emptyStyle = {};

const baseHeaderStyles = {
  fontWeight: '500',
  paddingTop: 20,
};

const h1 = {
  ...baseHeaderStyles,
  fontSize: '2.5rem',
};

const h2 = {
  ...baseHeaderStyles,
  fontSize: '2rem',
};
const h3 = {
  ...baseHeaderStyles,
  fontSize: '1.75rem',
};
const h4 = {
  ...baseHeaderStyles,
  fontSize: '1.5rem',
};
const h5 = {
  ...baseHeaderStyles,
  fontSize: '1.25rem',
};
const h6 = {
  ...baseHeaderStyles,
  fontSize: '1rem',
};

const bold = {
  fontWeight: 'bold',
};

const italic = {
  fontStyle: 'italic',
};

const blockQuote = {
  background: '#f9f9f9',
  borderLeft: '10px solid #ccc',
  margin: '1.5em 10px',
  padding: '1em 10px',
};

const codeInline = {
  color: '#212529',
  fontSize: '87.5%',
  display: 'inline',
  background: ' #f8f8f8',
  fontFamily: 'SFMono-Regular,Menlo,Monaco,Consolas,monospace',
};

const codeBlock = {
  ...codeInline,
  paddingTop: 10,
  paddingRight: 10,
  paddingLeft: 10,
  paddingBottom: 1,
  marginBottom: 20,
  background: ' #f8f8f8',
};

const link = {
  color: '#007bff',
  textDecoration: 'underline',
  backgroundColor: 'transparent',
};

export type StylesType = {
  h1?: React.CSSProperties;
  h2?: React.CSSProperties;
  h3?: React.CSSProperties;
  h4?: React.CSSProperties;
  h5?: React.CSSProperties;
  h6?: React.CSSProperties;
  blockQuote?: React.CSSProperties;
  bold?: React.CSSProperties;
  italic?: React.CSSProperties;
  link?: React.CSSProperties;
  codeBlock?: React.CSSProperties;
  codeInline?: React.CSSProperties;
  p?: React.CSSProperties;
  li?: React.CSSProperties;
  ul?: React.CSSProperties;
  ol?: React.CSSProperties;
  image?: React.CSSProperties;
  br?: React.CSSProperties;
  hr?: React.CSSProperties;
  table?: React.CSSProperties;
  thead?: React.CSSProperties;
  tbody?: React.CSSProperties;
  tr?: React.CSSProperties;
  th?: React.CSSProperties;
  td?: React.CSSProperties;
  strikethrough?: React.CSSProperties;
};

export const styles: StylesType = {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  blockQuote,
  bold,
  italic,
  link,
  codeBlock: { ...codeBlock, wordWrap: 'break-word' },
  codeInline: { ...codeInline, wordWrap: 'break-word' },
  p: emptyStyle,
  li: emptyStyle,
  ul: emptyStyle,
  ol: emptyStyle,
  image: emptyStyle,
  br: emptyStyle,
  hr: emptyStyle,
  table: emptyStyle,
  thead: emptyStyle,
  tbody: emptyStyle,
  th: emptyStyle,
  td: emptyStyle,
  tr: emptyStyle,
  strikethrough: emptyStyle,
};
