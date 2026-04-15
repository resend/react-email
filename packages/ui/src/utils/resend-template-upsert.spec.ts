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
      error: {
        message: 'Template not found',
        name: 'not_found',
        statusCode: 404,
      },
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
      error: {
        message: 'Template not found',
        name: 'not_found',
        statusCode: 404,
      },
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

  it('creates a new template when no existing match is found', async () => {
    const resend = createResendMock();
    const alias = getResendTemplateAlias('welcome');

    resend.templates.get.mockResolvedValue({
      data: null,
      error: {
        message: 'Template not found',
        name: 'not_found',
        statusCode: 404,
      },
    });
    resend.templates.list.mockResolvedValue({
      data: { data: [] },
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
