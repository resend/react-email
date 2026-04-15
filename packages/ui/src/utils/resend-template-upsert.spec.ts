import {
  getResendTemplateAlias,
  upsertResendTemplate,
} from './resend-template-upsert';

describe('getResendTemplateAlias()', () => {
  it('creates a stable alias from the template name', () => {
    expect(getResendTemplateAlias('welcome-email')).toBe(
      getResendTemplateAlias('welcome-email'),
    );
  });

  it('normalizes the template name and strips the extension', () => {
    expect(getResendTemplateAlias('Néwsletters/welcome-email.tsx')).toMatch(
      /^react-email-newsletters-welcome-email-[a-f0-9]{8}$/,
    );
  });

  it('avoids collisions when different names sanitize to the same slug', () => {
    expect(getResendTemplateAlias('welcome/email')).not.toBe(
      getResendTemplateAlias('welcome-email'),
    );
  });
});

describe('upsertResendTemplate()', () => {
  const createResendMock = () => {
    return {
      templates: {
        create: vi.fn(),
        get: vi.fn(),
        list: vi.fn(),
        update: vi.fn(),
      },
    };
  };

  const notFoundError = {
    message: 'Template not found',
    name: 'not_found',
    statusCode: 404,
  } as const;

  it('updates the template directly when the alias already exists', async () => {
    const resend = createResendMock();
    const alias = getResendTemplateAlias('welcome');

    resend.templates.get.mockResolvedValue({
      data: { id: 'tmpl_alias' },
      error: null,
    });
    resend.templates.update.mockResolvedValue({
      data: { id: 'tmpl_alias' },
      error: null,
    });

    const result = await upsertResendTemplate({
      resend,
      name: 'welcome',
      html: '<p>Hello</p>',
    });

    expect(result).toEqual({
      id: 'tmpl_alias',
      operation: 'updated',
    });
    expect(resend.templates.update).toHaveBeenCalledWith(alias, {
      alias,
      html: '<p>Hello</p>',
      name: 'welcome',
    });
    expect(resend.templates.list).not.toHaveBeenCalled();
    expect(resend.templates.create).not.toHaveBeenCalled();
  });

  it('updates the oldest exact name match and assigns the alias', async () => {
    const resend = createResendMock();
    const alias = getResendTemplateAlias('welcome');

    resend.templates.get.mockResolvedValue({
      data: null,
      error: notFoundError,
    });
    resend.templates.list.mockResolvedValue({
      data: {
        data: [
          {
            alias: null,
            created_at: '2026-04-10T00:00:00.000Z',
            id: 'tmpl_newer',
            name: 'welcome',
          },
          {
            alias: null,
            created_at: '2026-04-01T00:00:00.000Z',
            id: 'tmpl_original',
            name: 'welcome',
          },
        ],
        has_more: false,
      },
      error: null,
    });
    resend.templates.update.mockResolvedValue({
      data: { id: 'tmpl_original' },
      error: null,
    });

    const result = await upsertResendTemplate({
      resend,
      name: 'welcome',
      html: '<p>Hello</p>',
    });

    expect(result).toEqual({
      id: 'tmpl_original',
      operation: 'updated',
    });
    expect(resend.templates.update).toHaveBeenCalledWith('tmpl_original', {
      alias,
      html: '<p>Hello</p>',
      name: 'welcome',
    });
    expect(resend.templates.create).not.toHaveBeenCalled();
  });

  it('falls back to the legacy single-upload name when migrating old templates', async () => {
    const resend = createResendMock();
    const alias = getResendTemplateAlias('welcome');

    resend.templates.get.mockResolvedValue({
      data: null,
      error: notFoundError,
    });
    resend.templates.list.mockResolvedValue({
      data: {
        data: [
          {
            alias: null,
            created_at: '2026-04-01T00:00:00.000Z',
            id: 'tmpl_legacy',
            name: 'welcome.tsx',
          },
        ],
        has_more: false,
      },
      error: null,
    });
    resend.templates.update.mockResolvedValue({
      data: { id: 'tmpl_legacy' },
      error: null,
    });

    const result = await upsertResendTemplate({
      resend,
      name: 'welcome',
      legacyName: 'welcome.tsx',
      html: '<p>Hello</p>',
    });

    expect(result).toEqual({
      id: 'tmpl_legacy',
      operation: 'updated',
    });
    expect(resend.templates.update).toHaveBeenCalledWith('tmpl_legacy', {
      alias,
      html: '<p>Hello</p>',
      name: 'welcome',
    });
  });

  it('keeps searching later template pages before creating a new template', async () => {
    const resend = createResendMock();
    const alias = getResendTemplateAlias('welcome');

    resend.templates.get.mockResolvedValue({
      data: null,
      error: notFoundError,
    });
    resend.templates.list
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              alias: null,
              created_at: '2026-04-01T00:00:00.000Z',
              id: 'tmpl_page_1',
              name: 'other-template',
            },
          ],
          has_more: true,
        },
        error: null,
      })
      .mockResolvedValueOnce({
        data: {
          data: [
            {
              alias: null,
              created_at: '2026-04-02T00:00:00.000Z',
              id: 'tmpl_page_2',
              name: 'welcome',
            },
          ],
          has_more: false,
        },
        error: null,
      });
    resend.templates.update.mockResolvedValue({
      data: { id: 'tmpl_page_2' },
      error: null,
    });

    const result = await upsertResendTemplate({
      resend,
      name: 'welcome',
      html: '<p>Hello</p>',
    });

    expect(result).toEqual({
      id: 'tmpl_page_2',
      operation: 'updated',
    });
    expect(resend.templates.list).toHaveBeenNthCalledWith(1, {
      after: undefined,
      limit: 100,
    });
    expect(resend.templates.list).toHaveBeenNthCalledWith(2, {
      after: 'tmpl_page_1',
      limit: 100,
    });
    expect(resend.templates.update).toHaveBeenCalledWith('tmpl_page_2', {
      alias,
      html: '<p>Hello</p>',
      name: 'welcome',
    });
    expect(resend.templates.create).not.toHaveBeenCalled();
  });

  it('returns the lookup error when fetching an existing alias fails unexpectedly', async () => {
    const resend = createResendMock();
    const permissionError = {
      message: 'Missing permissions',
      name: 'invalid_access',
      statusCode: 403,
    } as const;

    resend.templates.get.mockResolvedValue({
      data: null,
      error: permissionError,
    });

    const result = await upsertResendTemplate({
      resend,
      name: 'welcome',
      html: '<p>Hello</p>',
    });

    expect(result).toEqual({
      error: permissionError,
    });
    expect(resend.templates.list).not.toHaveBeenCalled();
    expect(resend.templates.update).not.toHaveBeenCalled();
    expect(resend.templates.create).not.toHaveBeenCalled();
  });

  it('creates a new template when no existing match is found', async () => {
    const resend = createResendMock();
    const alias = getResendTemplateAlias('welcome');

    resend.templates.get.mockResolvedValue({
      data: null,
      error: notFoundError,
    });
    resend.templates.list.mockResolvedValue({
      data: {
        data: [],
        has_more: false,
      },
      error: null,
    });
    resend.templates.create.mockResolvedValue({
      data: { id: 'tmpl_created' },
      error: null,
    });

    const result = await upsertResendTemplate({
      resend,
      name: 'welcome',
      html: '<p>Hello</p>',
    });

    expect(result).toEqual({
      id: 'tmpl_created',
      operation: 'created',
    });
    expect(resend.templates.create).toHaveBeenCalledWith({
      alias,
      html: '<p>Hello</p>',
      name: 'welcome',
    });
  });
});
