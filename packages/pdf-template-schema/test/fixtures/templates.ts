const receiptVariables = [
  {
    key: 'organization.name',
    label: 'Organization Name',
    group: 'organization',
    type: 'string',
    sampleValue: 'Asymmetric Giving',
    required: true,
    privacy: 'public',
  },
  {
    key: 'recipient.full_name',
    label: 'Donor Full Name',
    group: 'recipient',
    type: 'string',
    sampleValue: 'Jordan Lee',
    required: true,
    privacy: 'pii',
    sourcePath: 'recipient.fullName',
  },
  {
    key: 'donation.amount',
    label: 'Donation Amount',
    group: 'donation',
    type: 'currency',
    sampleValue: 125,
    required: true,
    formatter: 'currency.usd',
    privacy: 'financial',
    sourcePath: 'donation.amount',
  },
];

export const donationReceiptTemplate = {
  version: 1,
  id: 'template-donation-receipt',
  name: 'Donation Receipt',
  category: 'donation_receipt',
  pageSettings: {},
  theme: {
    name: 'Receipt Brand',
    colors: {
      primary: '#1f2937',
      accent: '#0f766e',
      text: '#111827',
      background: '#ffffff',
    },
  },
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Donation Receipt' }],
      },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Thank you, ' },
          {
            type: 'variable',
            attrs: { key: 'recipient.full_name' },
          },
          { type: 'text', text: ', for your gift.' },
        ],
      },
    ],
  },
  variables: receiptVariables,
  dataBindings: [
    {
      id: 'binding-donor-name',
      variableKey: 'recipient.full_name',
      sourcePath: 'recipient.fullName',
      required: true,
    },
  ],
  assets: [
    {
      id: 'asset-logo',
      role: 'logo',
      assetId: 'tenant-logo',
      altText: 'Organization logo',
      mimeType: 'image/png',
      renderSafe: true,
    },
  ],
  metadata: {
    description: 'Single gift receipt fixture.',
    tags: ['receipt'],
    createdAt: '2026-04-25T00:00:00.000Z',
  },
};

export const annualGivingStatementTemplate = {
  version: 1,
  id: 'template-annual-giving-statement',
  name: 'Annual Giving Statement',
  category: 'annual_giving_statement',
  pageSettings: {
    pageSize: 'letter',
    orientation: 'portrait',
  },
  theme: {},
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Annual Giving Statement' }],
      },
      {
        type: 'data_table',
        attrs: { bindingId: 'table-donations' },
      },
    ],
  },
  variables: [
    ...receiptVariables,
    {
      key: 'statement.period',
      label: 'Statement Period',
      group: 'statement',
      type: 'string',
      sampleValue: '2025',
      required: true,
      privacy: 'internal',
      sourcePath: 'statement.period',
    },
  ],
  tableBindings: [
    {
      id: 'table-donations',
      sourcePath: 'donations',
      columns: [
        {
          key: 'date',
          label: 'Date',
          sourcePath: 'date',
          formatter: 'date.short',
        },
        {
          key: 'amount',
          label: 'Amount',
          sourcePath: 'amount',
          formatter: 'currency.usd',
          align: 'right',
        },
      ],
      totals: [{ columnKey: 'amount', operation: 'sum', label: 'Total' }],
    },
  ],
  metadata: {
    description: 'Year-end donor statement fixture.',
    tags: ['statement', 'donation'],
  },
};

export const financialReportTemplate = {
  version: 1,
  id: 'template-financial-report',
  name: 'Financial Report',
  category: 'financial_report',
  pageSettings: {
    pageSize: 'legal',
    orientation: 'landscape',
    margins: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in',
    },
  },
  theme: {},
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Financial Report' }],
      },
      {
        type: 'data_table',
        attrs: { bindingId: 'table-financial-rows' },
      },
    ],
  },
  variables: [
    {
      key: 'financial_report.period',
      label: 'Report Period',
      group: 'financial_report',
      type: 'string',
      sampleValue: 'Q1 2026',
      required: true,
      privacy: 'internal',
      sourcePath: 'report.period',
    },
  ],
  tableBindings: [
    {
      id: 'table-financial-rows',
      sourcePath: 'report.rows',
      columns: [
        { key: 'account', label: 'Account', sourcePath: 'accountName' },
        {
          key: 'amount',
          label: 'Amount',
          sourcePath: 'amount',
          formatter: 'currency.usd',
          align: 'right',
        },
      ],
      totals: [{ columnKey: 'amount', operation: 'sum', label: 'Net' }],
    },
  ],
  metadata: {
    description: 'Financial report fixture.',
    tags: ['finance'],
  },
};

export const invoiceTemplate = {
  version: 1,
  id: 'template-invoice',
  name: 'Invoice',
  category: 'invoice',
  pageSettings: {},
  theme: {},
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Invoice' }],
      },
      {
        type: 'repeater',
        attrs: { bindingId: 'invoice-line-items' },
      },
    ],
  },
  variables: [
    {
      key: 'invoice.number',
      label: 'Invoice Number',
      group: 'invoice',
      type: 'id',
      sampleValue: 'INV-1001',
      required: true,
      privacy: 'internal',
      sourcePath: 'invoice.number',
    },
  ],
  repeaterBindings: [
    {
      id: 'invoice-line-items',
      sourcePath: 'invoice.items',
      itemAlias: 'invoice.item',
      emptyState: 'No invoice items.',
      maxItems: 100,
    },
  ],
  metadata: {
    description: 'Invoice fixture.',
    tags: ['invoice'],
  },
};

export const certificateTemplate = {
  version: 1,
  id: 'template-certificate',
  name: 'Certificate',
  category: 'certificate',
  pageSettings: {
    pageSize: 'letter',
    orientation: 'landscape',
  },
  theme: {},
  content: {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Certificate of Appreciation' }],
      },
      {
        type: 'image',
        attrs: { assetId: 'signature-asset' },
      },
    ],
  },
  variables: [
    {
      key: 'recipient.full_name',
      label: 'Recipient Name',
      group: 'recipient',
      type: 'string',
      sampleValue: 'Jordan Lee',
      required: true,
      privacy: 'pii',
      sourcePath: 'recipient.fullName',
    },
  ],
  assets: [
    {
      id: 'asset-signature',
      role: 'signature',
      assetId: 'signature-asset',
      altText: 'Authorized signature',
      mimeType: 'image/png',
      renderSafe: true,
    },
  ],
  metadata: {
    description: 'Certificate fixture.',
    tags: ['certificate'],
  },
};

export const documentTemplateFixtures = [
  donationReceiptTemplate,
  annualGivingStatementTemplate,
  financialReportTemplate,
  invoiceTemplate,
  certificateTemplate,
];
