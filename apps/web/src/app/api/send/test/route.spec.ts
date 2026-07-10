import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  firewallMock,
  tryConsumeMock,
  resendSendMock,
  supabaseInsertMock,
  ipLimiterSentinel,
  recipientLimiterSentinel,
} = vi.hoisted(() => ({
  firewallMock: vi.fn().mockResolvedValue({ rateLimited: false, error: null }),
  tryConsumeMock: vi.fn().mockResolvedValue({ allowed: true }),
  resendSendMock: vi.fn().mockResolvedValue({ id: 'fake-id' }),
  supabaseInsertMock: vi.fn().mockResolvedValue({}),
  ipLimiterSentinel: Symbol('ipLimiter'),
  recipientLimiterSentinel: Symbol('recipientLimiter'),
}));

vi.mock('@vercel/firewall', () => ({ checkRateLimit: firewallMock }));
vi.mock('@vercel/functions', () => ({ ipAddress: () => '127.0.0.1' }));
vi.mock('@/lib/rate-limiter', () => ({
  sendTestIpRatelimit: ipLimiterSentinel,
  sendTestRecipientRatelimit: recipientLimiterSentinel,
  tryConsume: tryConsumeMock,
}));
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: resendSendMock };
  },
}));
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ from: () => ({ insert: supabaseInsertMock }) }),
}));

process.env.RESEND_API_KEY = 'fake-resend-key';
process.env.SUPABASE_URL = 'http://fake.supabase';
process.env.SUPABASE_ANON_KEY = 'fake-anon-key';
process.env.SUPABASE_TABLE_NAME = 'fake_table';

// Imported after vi.mock declarations so the mocks apply.
import { POST } from './route';

function createRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/send/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const validBody = {
  to: 'felipe@example.com',
  subject: 'hello',
  html: '<p>hi</p>',
};

describe('POST /api/send/test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firewallMock.mockResolvedValue({ rateLimited: false, error: null });
    tryConsumeMock.mockResolvedValue({ allowed: true });
    resendSendMock.mockResolvedValue({ id: 'fake-id' });
    supabaseInsertMock.mockResolvedValue({});
  });

  it('sends the email when firewall and both limiters pass', async () => {
    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Test email sent' });
    expect(resendSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'React Email <preview@react.email>',
        to: ['felipe@example.com'],
        subject: 'hello',
        html: '<p>hi</p>',
      }),
    );
  });

  it('returns 429 from the firewall pre-filter without parsing the body', async () => {
    firewallMock.mockResolvedValue({ rateLimited: true, error: null });

    const res = await POST(createRequest({ garbage: true }));

    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: 'Rate limit exceeded' });
    expect(tryConsumeMock).not.toHaveBeenCalled();
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('throws when firewall reports the rule is missing', async () => {
    firewallMock.mockResolvedValue({ rateLimited: false, error: 'not-found' });

    await expect(POST(createRequest(validBody))).rejects.toThrow(
      /Firewall rule not found/,
    );
  });

  it('returns 400 when the body is not a valid email', async () => {
    const res = await POST(createRequest({ ...validBody, to: 'not-an-email' }));

    expect(res.status).toBe(400);
    expect(tryConsumeMock).not.toHaveBeenCalled();
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 400 when a required body field is missing', async () => {
    const res = await POST(createRequest({ to: 'felipe@example.com' }));

    expect(res.status).toBe(400);
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 429 when the per-IP limiter denies', async () => {
    tryConsumeMock.mockImplementation((limiter) =>
      Promise.resolve({ allowed: limiter !== ipLimiterSentinel }),
    );

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: 'Rate limit exceeded' });
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 429 when the per-recipient limiter denies', async () => {
    tryConsumeMock.mockImplementation((limiter) =>
      Promise.resolve({ allowed: limiter !== recipientLimiterSentinel }),
    );

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(429);
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('returns 429 when both limiters deny', async () => {
    tryConsumeMock.mockResolvedValue({ allowed: false });

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(429);
    expect(resendSendMock).not.toHaveBeenCalled();
  });

  it('keys the recipient limiter on the lowercased address', async () => {
    await POST(createRequest({ ...validBody, to: 'Felipe@Example.COM' }));

    expect(tryConsumeMock).toHaveBeenCalledWith(
      recipientLimiterSentinel,
      'felipe@example.com',
    );
  });

  it('keys the ip limiter on the resolved request IP', async () => {
    await POST(createRequest(validBody));

    expect(tryConsumeMock).toHaveBeenCalledWith(ipLimiterSentinel, '127.0.0.1');
  });

  it('returns 500 when the underlying send throws', async () => {
    resendSendMock.mockRejectedValue(new Error('Resend down'));

    const res = await POST(createRequest(validBody));

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'Resend down' });
  });
});
