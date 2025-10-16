import { Button, Html } from '@react-email/components';
import { useMDXComponents as _provideComponents } from 'react';
import {
  Fragment as _Fragment,
  jsxDEV as _jsxDEV,
} from 'react/jsx-dev-runtime';

const MDXLayout = function Email2() {
  return _jsxDEV(
    Html,
    {
      children: _jsxDEV(
        Button,
        {
          href: 'https://example.com',
          style: {
            background: '#000',
            color: '#fff',
            padding: '12px 20px',
          },
          children: 'Click me',
        },
        void 0,
        false,
        {
          fileName:
            '/Users/david/src/silencia-ai/silencia/proto/emails-raw/em1.mdx',
          lineNumber: 7,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName:
        '/Users/david/src/silencia-ai/silencia/proto/emails-raw/em1.mdx',
      lineNumber: 6,
      columnNumber: 5,
    },
    this,
  );
};

function _createMdxContent(props) {
  const _components = {
    h1: 'h1',
    ..._provideComponents(),
    ...props.components,
  };
  return _jsxDEV(
    _Fragment,
    {
      children: [
        _jsxDEV(
          _components.h1,
          {
            children: 'Hello!',
          },
          void 0,
          false,
          {
            fileName:
              '/Users/david/src/silencia-ai/silencia/proto/emails-raw/em1.mdx',
            lineNumber: 17,
            columnNumber: 1,
          },
          this,
        ),
        '\n',
        _jsxDEV(
          Email,
          {},
          void 0,
          false,
          {
            fileName:
              '/Users/david/src/silencia-ai/silencia/proto/emails-raw/em1.mdx',
            lineNumber: 19,
            columnNumber: 1,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName:
        '/Users/david/src/silencia-ai/silencia/proto/emails-raw/em1.mdx',
      lineNumber: 1,
      columnNumber: 1,
    },
    this,
  );
}

function MDXContent(props = {}) {
  return _jsxDEV(
    MDXLayout,
    {
      ...props,
      children: _jsxDEV(
        _createMdxContent,
        {
          ...props,
        },
        void 0,
        false,
        {
          fileName:
            '/Users/david/src/silencia-ai/silencia/proto/emails-raw/em1.mdx',
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName:
        '/Users/david/src/silencia-ai/silencia/proto/emails-raw/em1.mdx',
    },
    this,
  );
}

export { MDXContent as default };
