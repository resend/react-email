import { composeReactEmail, EmailMark, EmailNode } from '../core';
import { editorEventBus } from '../core/event-bus';
import { isDocumentVisuallyEmpty } from '../core/is-document-visually-empty';
import { EmailEditor } from '../email-editor';
import {
  Body,
  Button,
  Heading,
  Link,
  Paragraph,
  Section,
  StarterKit,
  Table,
  Text,
} from '../extensions';
import { EmailTheming, useEditorImage } from '../plugins';
import { BubbleMenu, Inspector, SlashCommand } from '../ui';
import { setTextAlignment } from '../utils';

export const legacyEditorPackageExportSubpaths = [
  '.',
  './core',
  './extensions',
  './plugins',
  './ui',
  './utils',
] as const;

export const legacyEditorCssExportSubpaths = [
  './styles/bubble-menu.css',
  './styles/button-bubble-menu.css',
  './styles/image-bubble-menu.css',
  './styles/inspector.css',
  './styles/link-bubble-menu.css',
  './styles/slash-command.css',
  './themes/default.css',
] as const;

export type LegacyEditorPackageExportSubpath =
  (typeof legacyEditorPackageExportSubpaths)[number];

export type LegacyEditorCssExportSubpath =
  (typeof legacyEditorCssExportSubpaths)[number];

type LegacyEditorReferenceGroup = Readonly<Record<string, unknown>>;

export interface LegacyReactEmailEditorBoundary {
  readonly packageName: '@react-email/editor';
  readonly maturity: 'phase-4-internal-boundary';
  readonly runtime: 'browser-react';
  readonly serializer: 'composeReactEmail';
  readonly publicExportSubpaths: typeof legacyEditorPackageExportSubpaths;
  readonly cssExportSubpaths: typeof legacyEditorCssExportSubpaths;
  readonly references: {
    readonly core: LegacyEditorReferenceGroup;
    readonly extensions: LegacyEditorReferenceGroup;
    readonly plugins: LegacyEditorReferenceGroup;
    readonly root: LegacyEditorReferenceGroup;
    readonly ui: LegacyEditorReferenceGroup;
    readonly utils: LegacyEditorReferenceGroup;
  };
}

export const legacyReactEmailEditorBoundary: LegacyReactEmailEditorBoundary = {
  packageName: '@react-email/editor',
  maturity: 'phase-4-internal-boundary',
  runtime: 'browser-react',
  serializer: 'composeReactEmail',
  publicExportSubpaths: legacyEditorPackageExportSubpaths,
  cssExportSubpaths: legacyEditorCssExportSubpaths,
  references: {
    core: {
      EmailMark,
      EmailNode,
      composeReactEmail,
      editorEventBus,
      isDocumentVisuallyEmpty,
    },
    extensions: {
      Body,
      Button,
      Heading,
      Link,
      Paragraph,
      Section,
      StarterKit,
      Table,
      Text,
    },
    plugins: {
      EmailTheming,
      useEditorImage,
    },
    root: {
      EmailEditor,
    },
    ui: {
      BubbleMenu,
      Inspector,
      SlashCommand,
    },
    utils: {
      setTextAlignment,
    },
  },
};
