import type { CssJs } from './types';

export const DEFAULT_STYLES: CssJs = {
  reset: {
    margin: '0',
    padding: '0',
  },
  body: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: '16px',
    minHeight: '100%',
    lineHeight: '155%',
  },
  container: {},
  h1: {
    fontSize: '2.25em',
    lineHeight: '1.44em',
    paddingTop: '0.389em',
    fontWeight: 600,
  },
  h2: {
    fontSize: '1.8em',
    lineHeight: '1.44em',
    paddingTop: '0.389em',
    fontWeight: 600,
  },
  h3: {
    fontSize: '1.4em',
    lineHeight: '1.08em',
    paddingTop: '0.389em',
    fontWeight: 600,
  },
  paragraph: {
    fontSize: '1em',
    paddingTop: '0.5em',
    paddingBottom: '0.5em',
  },
  list: {
    paddingLeft: '1.1em',
    paddingBottom: '1em',
  },
  nestedList: {
    paddingLeft: '1.1em',
    paddingBottom: '0',
  },
  listItem: {
    marginLeft: '1em',
    marginBottom: '0.3em',
    marginTop: '0.3em',
  },
  listParagraph: { padding: '0', margin: '0' },
  blockquote: {
    borderLeft: '3px solid #acb3be',
    color: '#7e8a9a',
    marginLeft: 0,
    paddingLeft: '0.8em',
    fontSize: '1.1em',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  link: { textDecoration: 'underline' },
  footer: {
    fontSize: '0.8em',
  },
  hr: {
    paddingBottom: '1em',
    borderWidth: '2px',
  },
  image: {
    maxWidth: '100%',
  },
  button: {
    lineHeight: '100%',
    display: 'inline-block',
  },
  inlineCode: {
    paddingTop: '0.25em',
    paddingBottom: '0.25em',
    paddingLeft: '0.4em',
    paddingRight: '0.4em',
    background: '#e5e7eb',
    color: '#1e293b',
    borderRadius: '4px',
  },
  codeBlock: {
    fontFamily: 'monospace',
    fontWeight: '500',
    fontSize: '.92em',
  },
  codeTag: {
    lineHeight: '130%',
    fontFamily: 'monospace',
    fontSize: '.92em',
  },
  section: {
    padding: '10px 20px 10px 20px',
    boxSizing: 'border-box' as const,
  },
} as CssJs;
