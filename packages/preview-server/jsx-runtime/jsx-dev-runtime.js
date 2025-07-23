// This hack is necessary because React forces the use of the non-dev JSX runtime
// when NODE_ENV is set to 'production', which would break the data-source references
// we need for stack traces in the preview server.
import ReactJSXDevRuntime from 'react/jsx-dev-runtime';

export function jsxDEV(type, props, key, isStaticChildren, source, self) {
  const newProps = { ...props };

  if (source && shouldIncludeSourceReference) {
    newProps['data-source-file'] = source.fileName;
    newProps['data-source-line'] = source.lineNumber;
  }

  return ReactJSXDevRuntime.jsxDEV(
    type,
    newProps,
    key,
    isStaticChildren,
    source,
    self,
  );
}

export const Fragment = ReactJSXDevRuntime.Fragment;
