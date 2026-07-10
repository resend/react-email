import { promises as fs } from 'node:fs';
import { getImportedModules } from './get-imported-modules.js';

vi.mock('@babel/traverse', async () => {
  const traverse = await vi.importActual('@babel/traverse');
  return { default: traverse };
});

describe('getImportedModules()', () => {
  it('works with this test file', async () => {
    const contents = await fs.readFile(import.meta.filename, 'utf8');

    expect(getImportedModules(contents)).toEqual({
      staticImports: ['node:fs', './get-imported-modules.js'],
      dynamicImportPrefixes: [],
    });
  });

  it('works with direct exports', () => {
    const contents = `export * from './component-a';
    export { ComponentB } from './component-b';

    import { ComponentC } from './component-c';
    export { ComponentC }`;
    expect(getImportedModules(contents)).toEqual({
      staticImports: ['./component-a', './component-b', './component-c'],
      dynamicImportPrefixes: [],
    });
  });

  it('works with regular imports and double quotes', () => {
    const contents = `import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import { Component } from '../../my-component';

import * as React from "react";
    `;
    expect(getImportedModules(contents)).toEqual({
      staticImports: [
        '@react-email/components',
        '@react-email/tailwind',
        '../../my-component',
        'react',
      ],
      dynamicImportPrefixes: [],
    });
  });

  it('works with regular imports and single quotes', () => {
    const contents = `import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from 'react-email';
import { Tailwind } from '@react-email/tailwind';
import { Component } from '../../my-component';

import * as React from 'react';
    `;
    expect(getImportedModules(contents)).toEqual({
      staticImports: [
        'react-email',
        '@react-email/tailwind',
        '../../my-component',
        'react',
      ],
      dynamicImportPrefixes: [],
    });
  });

  it('works with commonjs require with double quotes', () => {
    const contents = `const {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} = require("@react-email/components");
const { Tailwind } = require("@react-email/tailwind");
const { Component } = require("../../my-component");

const React = require("react");
    `;
    expect(getImportedModules(contents)).toEqual({
      staticImports: [
        '@react-email/components',
        '@react-email/tailwind',
        '../../my-component',
        'react',
      ],
      dynamicImportPrefixes: [],
    });
  });

  it('works with commonjs require with single quotes', () => {
    const contents = `const {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} = require('@react-email/components');
const { Tailwind } = require('@react-email/tailwind');
const { Component } = require('../../my-component');

const React = require('react');
    `;
    expect(getImportedModules(contents)).toEqual({
      staticImports: [
        '@react-email/components',
        '@react-email/tailwind',
        '../../my-component',
        'react',
      ],
      dynamicImportPrefixes: [],
    });
  });

  it('treats dynamic import() with a string literal as a static import', () => {
    const contents = `const mod = await import('./my-module.json');`;
    expect(getImportedModules(contents)).toEqual({
      staticImports: ['./my-module.json'],
      dynamicImportPrefixes: [],
    });
  });

  it('captures the leading static prefix of dynamic import() template literals', () => {
    const contents = `
      i18next.use(
        resourcesToBackend(
          (lng, ns) => import(\`./messages/\${lng}/\${ns}.json\`),
        ),
      );
    `;
    expect(getImportedModules(contents)).toEqual({
      staticImports: [],
      dynamicImportPrefixes: ['./messages/'],
    });
  });

  it('ignores dynamic import() template literals that start with an interpolation', () => {
    // biome-ignore lint/suspicious/noTemplateCurlyInString: the `${base}` here is intentionally raw source text, not a template-string interpolation.
    const contents = 'const m = await import(`${base}/file.json`);';
    expect(getImportedModules(contents)).toEqual({
      staticImports: [],
      dynamicImportPrefixes: [],
    });
  });

  it('treats a dynamic import() template literal with no interpolation as a static import', () => {
    const contents = 'const m = await import(`./my-module.json`);';
    expect(getImportedModules(contents)).toEqual({
      staticImports: ['./my-module.json'],
      dynamicImportPrefixes: [],
    });
  });
});
