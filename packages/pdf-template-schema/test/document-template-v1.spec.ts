import {
  ConditionalRuleSchema,
  DocumentPageSettingsSchema,
  DocumentTemplateV1Schema,
  VariableDefinitionSchema,
} from '@asym/pdf-template-schema';
import { describe, expect, it } from 'vitest';
import {
  documentTemplateFixtures,
  donationReceiptTemplate,
} from './fixtures/templates';

describe('DocumentTemplateV1Schema', () => {
  it('parses a valid structured template', () => {
    const parsed = DocumentTemplateV1Schema.parse(donationReceiptTemplate);

    expect(parsed.version).toBe(1);
    expect(parsed.engine).toBe('asym_pdf_document_builder');
    expect(parsed.content.type).toBe('doc');
    expect(parsed.pageSettings.pageSize).toBe('letter');
  });

  it('rejects raw HTML as template source of truth', () => {
    const invalidTemplate = {
      ...donationReceiptTemplate,
      html: '<p>raw html is only a render artifact</p>',
    };

    expect(() => DocumentTemplateV1Schema.parse(invalidTemplate)).toThrow();
  });

  it('rejects unsupported schema versions', () => {
    const invalidTemplate = {
      ...donationReceiptTemplate,
      version: 2,
    };

    expect(() => DocumentTemplateV1Schema.parse(invalidTemplate)).toThrow();
  });

  it('defaults page settings to Letter portrait with half-inch margins', () => {
    const parsed = DocumentPageSettingsSchema.parse({});

    expect(parsed).toEqual({
      pageSize: 'letter',
      orientation: 'portrait',
      margins: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in',
      },
    });
  });

  it('requires custom dimensions for custom page sizes', () => {
    expect(() =>
      DocumentPageSettingsSchema.parse({ pageSize: 'custom' }),
    ).toThrow();

    expect(
      DocumentPageSettingsSchema.parse({
        pageSize: 'custom',
        customSize: {
          width: 8,
          height: 10,
          unit: 'in',
        },
      }),
    ).toMatchObject({
      pageSize: 'custom',
      customSize: {
        width: 8,
        height: 10,
        unit: 'in',
      },
    });
  });

  it('validates variable definition keys and required fallback behavior', () => {
    expect(() =>
      VariableDefinitionSchema.parse({
        key: 'Recipient Name',
        label: 'Recipient Name',
        group: 'recipient',
        type: 'string',
        sampleValue: 'Jordan Lee',
      }),
    ).toThrow();

    expect(() =>
      VariableDefinitionSchema.parse({
        key: 'recipient.full_name',
        label: 'Recipient Name',
        group: 'recipient',
        type: 'string',
        sampleValue: 'Jordan Lee',
        required: true,
        fallback: { mode: 'omit' },
      }),
    ).toThrow();
  });

  it('keeps conditionals structured and value-aware', () => {
    expect(
      ConditionalRuleSchema.parse({
        fieldPath: 'donation.amount',
        operator: 'greater_than',
        value: 0,
      }),
    ).toMatchObject({
      fieldPath: 'donation.amount',
      operator: 'greater_than',
      value: 0,
    });

    expect(() =>
      ConditionalRuleSchema.parse({
        fieldPath: 'donation.amount',
        operator: 'greater_than',
      }),
    ).toThrow();

    expect(() =>
      ConditionalRuleSchema.parse({
        fieldPath: 'recipient.fullName',
        operator: 'exists',
        value: true,
      }),
    ).toThrow();
  });

  it('parses every Phase 6 product fixture', () => {
    const parsedTemplates = documentTemplateFixtures.map((template) =>
      DocumentTemplateV1Schema.parse(template),
    );

    expect(parsedTemplates.map((template) => template.category)).toEqual([
      'donation_receipt',
      'annual_giving_statement',
      'financial_report',
      'invoice',
      'certificate',
    ]);
  });
});
