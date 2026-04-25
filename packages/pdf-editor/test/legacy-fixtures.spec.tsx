import {
  composeReactEmailReference,
  ReactEmailEditorReference,
} from '@asym/pdf-editor';
import { ReactEmailEditorReference as ReactEmailEditorSubpathReference } from '@asym/pdf-editor/react-email-compat';
import { describe, expect, it } from 'vitest';
import { legacyEditorDocumentFixture } from './fixtures/legacy-editor-document';

describe('@asym/pdf-editor legacy fixture boundary', () => {
  it('keeps the legacy editor JSON fixture deterministic', () => {
    expect(legacyEditorDocumentFixture).toEqual({
      description:
        'Minimal legacy React Email editor JSON used to guard the Phase 4 boundary.',
      document: {
        type: 'doc',
        content: [
          {
            type: 'globalContent',
            attrs: {
              data: {
                css: '',
                theme: 'basic',
                styles: {
                  colors: {
                    background: '#ffffff',
                    foreground: '#111111',
                    primary: '#2563eb',
                    secondary: '#f8fafc',
                  },
                  fontSize: {
                    base: '16px',
                    large: '20px',
                    small: '14px',
                  },
                },
              },
            },
          },
          {
            type: 'body',
            attrs: {
              class: 'legacy-document-body',
            },
            content: [
              {
                type: 'heading',
                attrs: {
                  level: 1,
                },
                content: [
                  {
                    type: 'text',
                    text: 'Donation Receipt',
                  },
                ],
              },
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'Thank you, ',
                  },
                  {
                    type: 'text',
                    text: '{{ donor.full_name }}',
                    marks: [
                      {
                        type: 'bold',
                      },
                    ],
                  },
                  {
                    type: 'text',
                    text: ', for your gift.',
                  },
                ],
              },
            ],
          },
        ],
      },
      name: 'legacy-donation-receipt-editor-json',
    });
  });

  it('keeps the React Email reference adapter reachable', () => {
    expect(ReactEmailEditorReference).toBeDefined();
    expect(ReactEmailEditorSubpathReference).toBe(ReactEmailEditorReference);
    expect(composeReactEmailReference).toBeDefined();
  });
});
