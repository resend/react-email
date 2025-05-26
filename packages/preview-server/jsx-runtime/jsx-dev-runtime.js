import * as ReactJsxDevRuntime from 'react/jsx-dev-runtime';

export function jsxDEV(type, props, key, isStaticChildren, source, self) {
  const newProps = { ...props };

  if (source) {
    newProps['data-source-file'] = source.fileName;
    newProps['data-source-line'] = source.lineNumber;
  }

  return ReactJsxDevRuntime.jsxDEV(
    type,
    newProps,
    key,
    isStaticChildren,
    source,
    self,
  );
}

export const Fragment = ReactJsxDevRuntime.Fragment;
