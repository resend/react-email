import {
  DocumentEditor,
  type DocumentEditorProps,
  type DocumentEditorRef,
  DocumentMark,
  DocumentNode,
  PdfEditor,
  type PdfEditorProps,
  type PdfEditorRef,
  ReactEmailEditorReference,
  ReactEmailMarkReference,
  ReactEmailNodeReference,
} from '@asym/pdf-editor';
import type { EmailEditorProps, EmailEditorRef } from '@react-email/editor';
import type {
  EmailMark as LegacyEmailMark,
  EmailNode as LegacyEmailNode,
} from '@react-email/editor/core';
import { describe, expect, expectTypeOf, it } from 'vitest';

describe('Phase 08 document and PDF naming compatibility', () => {
  it('keeps old React Email references and new document/PDF aliases available', () => {
    expect(ReactEmailEditorReference).toBeDefined();
    expect(PdfEditor).toBe(ReactEmailEditorReference);
    expect(DocumentEditor).toBe(ReactEmailEditorReference);
  });

  it('keeps document node and mark names as exact runtime aliases', () => {
    expect(DocumentNode).toBe(ReactEmailNodeReference);
    expect(DocumentMark).toBe(ReactEmailMarkReference);
  });

  it('keeps Phase 08 editor alias types aligned with legacy editor types', () => {
    expectTypeOf<PdfEditorProps>().toEqualTypeOf<EmailEditorProps>();
    expectTypeOf<DocumentEditorProps>().toEqualTypeOf<EmailEditorProps>();
    expectTypeOf<PdfEditorRef>().toEqualTypeOf<EmailEditorRef>();
    expectTypeOf<DocumentEditorRef>().toEqualTypeOf<EmailEditorRef>();
  });

  it('keeps Phase 08 document node and mark alias types aligned with legacy core types', () => {
    expectTypeOf<typeof DocumentNode>().toEqualTypeOf<typeof LegacyEmailNode>();
    expectTypeOf<typeof DocumentMark>().toEqualTypeOf<typeof LegacyEmailMark>();
  });
});
