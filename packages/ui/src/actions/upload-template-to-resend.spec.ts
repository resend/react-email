import type { Resend } from 'resend';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { uploadTemplateToResend } from './upload-template-to-resend';

type TemplatesMock = {
  list: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
};

const makeResend = (templates: TemplatesMock): Resend =>
  ({ templates }) as unknown as Resend;

const listSuccess = (templates: { id: string; name: string }[]) => ({
  data: { object: 'list', data: templates, has_more: false },
  error: null,
});

const errorResponse = {
  data: null,
  error: { name: 'application_error', message: 'boom' },
};

describe('uploadTemplateToResend()', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a new template when no existing template shares the name', async () => {
    const templates: TemplatesMock = {
      list: vi.fn().mockResolvedValue(listSuccess([])),
      create: vi
        .fn()
        .mockResolvedValue({ data: { id: 'tmpl_new' }, error: null }),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeResend(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result).toEqual({
      name: 'welcome',
      status: 'succeeded',
      id: 'tmpl_new',
    });
    expect(templates.create).toHaveBeenCalledWith({
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });
    expect(templates.update).not.toHaveBeenCalled();
  });

  it('updates in place when exactly one existing template matches the name', async () => {
    const templates: TemplatesMock = {
      list: vi
        .fn()
        .mockResolvedValue(
          listSuccess([{ id: 'tmpl_existing', name: 'welcome' }]),
        ),
      create: vi.fn(),
      update: vi
        .fn()
        .mockResolvedValue({ data: { id: 'tmpl_existing' }, error: null }),
    };

    const result = await uploadTemplateToResend(makeResend(templates), {
      name: 'welcome',
      html: '<h1>updated</h1>',
    });

    expect(result).toEqual({
      name: 'welcome',
      status: 'succeeded',
      id: 'tmpl_existing',
    });
    expect(templates.update).toHaveBeenCalledWith('tmpl_existing', {
      html: '<h1>updated</h1>',
    });
    expect(templates.create).not.toHaveBeenCalled();
  });

  it('falls back to create when several templates share the name', async () => {
    const templates: TemplatesMock = {
      list: vi.fn().mockResolvedValue(
        listSuccess([
          { id: 'tmpl_a', name: 'welcome' },
          { id: 'tmpl_b', name: 'welcome' },
        ]),
      ),
      create: vi
        .fn()
        .mockResolvedValue({ data: { id: 'tmpl_new' }, error: null }),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeResend(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result).toEqual({
      name: 'welcome',
      status: 'succeeded',
      id: 'tmpl_new',
    });
    expect(templates.create).toHaveBeenCalledTimes(1);
    expect(templates.update).not.toHaveBeenCalled();
  });

  it('ignores templates whose name does not match', async () => {
    const templates: TemplatesMock = {
      list: vi
        .fn()
        .mockResolvedValue(
          listSuccess([{ id: 'tmpl_other', name: 'password-reset' }]),
        ),
      create: vi
        .fn()
        .mockResolvedValue({ data: { id: 'tmpl_new' }, error: null }),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeResend(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result.status).toBe('succeeded');
    expect(templates.create).toHaveBeenCalledTimes(1);
    expect(templates.update).not.toHaveBeenCalled();
  });

  it('returns failed without writing when listing templates errors', async () => {
    const templates: TemplatesMock = {
      list: vi.fn().mockResolvedValue(errorResponse),
      create: vi.fn(),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeResend(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result).toEqual({ name: 'welcome', status: 'failed' });
    expect(templates.create).not.toHaveBeenCalled();
    expect(templates.update).not.toHaveBeenCalled();
  });

  it('returns failed when updating an existing template errors', async () => {
    const templates: TemplatesMock = {
      list: vi
        .fn()
        .mockResolvedValue(
          listSuccess([{ id: 'tmpl_existing', name: 'welcome' }]),
        ),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue(errorResponse),
    };

    const result = await uploadTemplateToResend(makeResend(templates), {
      name: 'welcome',
      html: '<h1>updated</h1>',
    });

    expect(result).toEqual({ name: 'welcome', status: 'failed' });
    expect(templates.create).not.toHaveBeenCalled();
  });

  it('returns failed when creating a new template errors', async () => {
    const templates: TemplatesMock = {
      list: vi.fn().mockResolvedValue(listSuccess([])),
      create: vi.fn().mockResolvedValue(errorResponse),
      update: vi.fn(),
    };

    const result = await uploadTemplateToResend(makeResend(templates), {
      name: 'welcome',
      html: '<h1>welcome</h1>',
    });

    expect(result).toEqual({ name: 'welcome', status: 'failed' });
  });
});
