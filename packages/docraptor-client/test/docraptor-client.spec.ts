import {
  createDocRaptorClient,
  DocRaptorClientError,
} from '@asym/docraptor-client';
import { describe, expect, it, vi } from 'vitest';

type FetchCall = {
  readonly url: string;
  readonly init: RequestInit;
  readonly payload: Record<string, unknown>;
};

type MockFetch = ((
  input: string | URL,
  init?: RequestInit,
) => Promise<Response>) & {
  readonly calls: FetchCall[];
};

const apiKey = 'docraptor_test_key';
const pdfBytes = new Uint8Array([37, 80, 68, 70]);

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
      ...init?.headers,
    },
    status: init?.status ?? 200,
  });
}

function textResponse(
  body: string,
  init?: ResponseInit & { readonly contentType?: string },
): Response {
  return new Response(body, {
    headers: {
      'content-type': init?.contentType ?? 'text/plain',
      ...init?.headers,
    },
    status: init?.status ?? 200,
  });
}

function pdfResponse(init?: ResponseInit): Response {
  return new Response(pdfBytes, {
    headers: {
      'content-type': 'application/pdf',
      'x-docraptor-num-pages': '3',
      ...init?.headers,
    },
    status: init?.status ?? 200,
  });
}

function failingArrayBufferResponse(): Response {
  const response = pdfResponse();

  Object.defineProperty(response, 'arrayBuffer', {
    value: vi.fn(async () => {
      throw new Error('PDF body stream failed');
    }),
  });

  return response;
}

function failingTextResponse(): Response {
  const response = jsonResponse({ status: 'completed' });

  Object.defineProperty(response, 'text', {
    value: vi.fn(async () => {
      throw new Error('JSON body stream failed');
    }),
  });

  return response;
}

function createMockFetch(responses: readonly Response[]): MockFetch {
  const queue = [...responses];
  const calls: FetchCall[] = [];
  const fetchMock = vi.fn(async (input: string | URL, init?: RequestInit) => {
    const requestInit = init ?? {};
    const payload =
      typeof requestInit.body === 'string'
        ? (JSON.parse(requestInit.body) as Record<string, unknown>)
        : {};
    calls.push({
      url: String(input),
      init: requestInit,
      payload,
    });

    const nextResponse = queue.shift();
    if (!nextResponse) {
      throw new Error('No mock response queued');
    }

    return nextResponse;
  }) as unknown as MockFetch;

  Object.defineProperty(fetchMock, 'calls', {
    value: calls,
  });

  return fetchMock;
}

function createNeverResolvingFetch(): MockFetch {
  const calls: FetchCall[] = [];
  const fetchMock = vi.fn(
    (input: string | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        const requestInit = init ?? {};
        const payload =
          typeof requestInit.body === 'string'
            ? (JSON.parse(requestInit.body) as Record<string, unknown>)
            : {};
        calls.push({
          url: String(input),
          init: requestInit,
          payload,
        });

        requestInit.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }),
  ) as unknown as MockFetch;

  Object.defineProperty(fetchMock, 'calls', {
    value: calls,
  });

  return fetchMock;
}

function expectBasicAuthHeader(
  headers: RequestInit['headers'],
  expectedApiKey: string,
): void {
  const authorization = new Headers(headers).get('authorization');
  const expected = Buffer.from(`${expectedApiKey}:`).toString('base64');

  expect(authorization).toBe(`Basic ${expected}`);
}

function expectJsonContentTypeHeader(headers: RequestInit['headers']): void {
  expect(new Headers(headers).get('content-type')).toBe('application/json');
}

describe('Phase 11 DocRaptor client', () => {
  it('requires an API key before creating a client', () => {
    expect(() => createDocRaptorClient({ apiKey: '' })).toThrow(
      DocRaptorClientError,
    );

    try {
      createDocRaptorClient({ apiKey: '   ' });
    } catch (error) {
      expect(error).toBeInstanceOf(DocRaptorClientError);
      expect((error as DocRaptorClientError).code).toBe('missing_api_key');
      expect((error as DocRaptorClientError).retryable).toBe(false);
    }
  });

  it('forms a deterministic sync render request in test mode by default', async () => {
    const fetch = createMockFetch([pdfResponse()]);
    const client = createDocRaptorClient({ apiKey, fetch });

    const result = await client.renderSync({
      callbackUrl: 'https://app.example.test/docraptor/sync-callback',
      html: '<!doctype html><html><body>Receipt</body></html>',
      name: 'Donation receipt',
      baseUrl: 'https://assets.example.test/receipts/',
      idempotency: {
        key: 'tenant-1/template-2/data-3/final',
        scope: 'render_job',
      },
    });

    expect(result).toMatchObject({
      kind: 'sync',
      contentType: 'application/pdf',
      pageCount: 3,
      idempotency: {
        key: 'tenant-1/template-2/data-3/final',
        scope: 'render_job',
      },
    });
    expect(result.pdf).toEqual(pdfBytes);
    expect(fetch.calls).toHaveLength(1);
    expect(fetch.calls[0]?.url).toBe('https://api.docraptor.com/docs');
    expect(fetch.calls[0]?.payload).toEqual({
      document_content: '<!doctype html><html><body>Receipt</body></html>',
      name: 'Donation receipt',
      prince_options: {
        baseurl: 'https://assets.example.test/receipts/',
        media: 'print',
      },
      tag: 'tenant-1/template-2/data-3/final',
      test: true,
      type: 'pdf',
    });
    expect(fetch.calls[0]?.payload).not.toHaveProperty('async');
    expect(fetch.calls[0]?.payload).not.toHaveProperty('callback_url');
    expectBasicAuthHeader(fetch.calls[0]?.init.headers, apiKey);
    expectJsonContentTypeHeader(fetch.calls[0]?.init.headers);
  });

  it('forms production mode and explicit tag payloads without fake idempotency headers', async () => {
    const fetch = createMockFetch([pdfResponse()]);
    const client = createDocRaptorClient({
      apiKey,
      fetch,
      mode: 'production',
    });

    await client.renderSync({
      html: '<html><body>Production</body></html>',
      media: 'screen',
      tag: 'explicit-docraptor-tag',
      idempotency: {
        key: 'do-not-send-as-header',
        scope: 'preview',
      },
    });

    const call = fetch.calls[0];

    expect(call?.payload).toMatchObject({
      prince_options: {
        media: 'screen',
      },
      tag: 'explicit-docraptor-tag',
      test: false,
      type: 'pdf',
    });
    expect(new Headers(call?.init.headers).has('idempotency-key')).toBe(false);
  });

  it('normalizes DocRaptor JSON and XML errors without leaking the API key', async () => {
    const jsonFetch = createMockFetch([
      jsonResponse(
        { error: `Invalid credentials for ${apiKey}` },
        { status: 401 },
      ),
    ]);
    const jsonClient = createDocRaptorClient({ apiKey, fetch: jsonFetch });

    let jsonError: DocRaptorClientError | undefined;

    try {
      await jsonClient.renderSync({
        html: '<html><body>Bad auth</body></html>',
      });
    } catch (error) {
      jsonError = error as DocRaptorClientError;
    }

    expect(jsonError).toMatchObject({
      code: 'docraptor_error',
      retryable: false,
      status: 401,
    });
    expect(String(jsonError?.message)).not.toContain(apiKey);
    expect(JSON.stringify(jsonError?.details)).not.toContain(apiKey);

    const xmlFetch = createMockFetch([
      textResponse(
        '<?xml version="1.0"?><errors><error>HTML is invalid</error></errors>',
        { contentType: 'application/xml', status: 422 },
      ),
    ]);
    const xmlClient = createDocRaptorClient({ apiKey, fetch: xmlFetch });

    await expect(
      xmlClient.renderSync({ html: '<html><body>Invalid</body></html>' }),
    ).rejects.toMatchObject({
      code: 'docraptor_error',
      details: {
        errors: ['HTML is invalid'],
      },
      retryable: false,
      status: 422,
    });
  });

  it('marks rate-limit and server failures as retryable HTTP errors', async () => {
    const fetch = createMockFetch([
      textResponse('rate limited', { status: 429 }),
    ]);
    const client = createDocRaptorClient({ apiKey, fetch });

    await expect(
      client.renderSync({ html: '<html><body>Retry</body></html>' }),
    ).rejects.toMatchObject({
      code: 'http_error',
      retryable: true,
      status: 429,
    });
  });

  it('creates async render jobs and maps status responses', async () => {
    const fetch = createMockFetch([
      jsonResponse({ status_id: 'status-123' }),
      jsonResponse({
        message: 'Queued',
        status: 'queued',
      }),
      jsonResponse({
        download_url: 'https://docraptor.com/download/status-123',
        message: 'Completed',
        number_of_pages: 4,
        status: 'completed',
      }),
      jsonResponse({
        status: 'failed',
        validation_errors: 'Name cannot be blank',
      }),
    ]);
    const client = createDocRaptorClient({ apiKey, fetch });

    const job = await client.createAsyncRender({
      callbackUrl: 'https://app.example.test/docraptor/callback',
      html: '<html><body>Long report</body></html>',
      name: 'Long report',
    });

    expect(job).toMatchObject({
      kind: 'async_job',
      statusId: 'status-123',
      statusUrl: 'https://docraptor.com/status/status-123',
    });
    expect(fetch.calls[0]?.payload).toMatchObject({
      async: true,
      callback_url: 'https://app.example.test/docraptor/callback',
      document_content: '<html><body>Long report</body></html>',
      name: 'Long report',
      prince_options: {
        media: 'print',
      },
      test: true,
      type: 'pdf',
    });
    expectJsonContentTypeHeader(fetch.calls[0]?.init.headers);

    await expect(client.getAsyncRenderStatus('status-123')).resolves.toEqual({
      downloadUrl: undefined,
      message: 'Queued',
      numberOfPages: undefined,
      raw: {
        message: 'Queued',
        status: 'queued',
      },
      status: 'queued',
      statusId: 'status-123',
      validationErrors: undefined,
    });

    await expect(
      client.getAsyncRenderStatus('status-123'),
    ).resolves.toMatchObject({
      downloadUrl: 'https://docraptor.com/download/status-123',
      numberOfPages: 4,
      status: 'completed',
    });

    await expect(
      client.getAsyncRenderStatus('status-123'),
    ).resolves.toMatchObject({
      status: 'failed',
      validationErrors: ['Name cannot be blank'],
    });
    expect(fetch.calls[1]?.url).toBe('https://docraptor.com/status/status-123');
    expect(new Headers(fetch.calls[1]?.init.headers).get('accept')).toBe(
      'application/json',
    );
    expectBasicAuthHeader(fetch.calls[1]?.init.headers, apiKey);
    expect(new Headers(fetch.calls[1]?.init.headers).has('content-type')).toBe(
      false,
    );
  });

  it('polls async status until completion', async () => {
    const fetch = createMockFetch([
      jsonResponse({ status: 'queued' }),
      jsonResponse({ status: 'working' }),
      jsonResponse({
        download_url: 'https://docraptor.com/download/done',
        number_of_pages: 2,
        status: 'completed',
      }),
    ]);
    const client = createDocRaptorClient({ apiKey, fetch });

    const result = await client.pollAsyncRenderStatus('status-456', {
      intervalMs: 1,
      maxAttempts: 5,
    });

    expect(result).toMatchObject({
      downloadUrl: 'https://docraptor.com/download/done',
      numberOfPages: 2,
      status: 'completed',
    });
    expect(fetch.calls).toHaveLength(3);
  });

  it('uses the remaining wall-clock timeout budget for poll status requests', async () => {
    let now = 1_000;
    const dateSpy = vi.spyOn(Date, 'now').mockImplementation(() => now);
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');
    const responses = [
      jsonResponse({ status: 'queued' }),
      jsonResponse({ status: 'completed' }),
    ];
    const calls: FetchCall[] = [];
    const fetch = vi.fn(async (input: string | URL, init?: RequestInit) => {
      const requestInit = init ?? {};
      const payload =
        typeof requestInit.body === 'string'
          ? (JSON.parse(requestInit.body) as Record<string, unknown>)
          : {};
      calls.push({
        url: String(input),
        init: requestInit,
        payload,
      });

      const response = responses.shift();

      if (!response) {
        throw new Error('No mock response queued');
      }

      if (calls.length === 1) {
        now = 1_090;
      }

      return response;
    }) as unknown as MockFetch;

    Object.defineProperty(fetch, 'calls', {
      value: calls,
    });

    try {
      const client = createDocRaptorClient({ apiKey, fetch });

      await client.pollAsyncRenderStatus('status-budget', {
        intervalMs: 0,
        maxAttempts: 2,
        timeoutMs: 100,
      });

      const timeoutDelays = setTimeoutSpy.mock.calls
        .map((call) => call[1])
        .filter((delay): delay is number => typeof delay === 'number');

      expect(timeoutDelays).toContain(100);
      expect(timeoutDelays).toContain(10);
      expect(fetch.calls).toHaveLength(2);
    } finally {
      dateSpy.mockRestore();
      setTimeoutSpy.mockRestore();
    }
  });

  it('supports timeout and caller-provided abort signals', async () => {
    const timeoutFetch = createNeverResolvingFetch();
    const timeoutClient = createDocRaptorClient({
      apiKey,
      defaultTimeoutMs: 1,
      fetch: timeoutFetch,
    });

    await expect(
      timeoutClient.renderSync({ html: '<html><body>Timeout</body></html>' }),
    ).rejects.toMatchObject({
      code: 'timeout',
      retryable: true,
    });

    const abortFetch = createNeverResolvingFetch();
    const abortClient = createDocRaptorClient({
      apiKey,
      defaultTimeoutMs: 60_000,
      fetch: abortFetch,
    });
    const controller = new AbortController();
    const renderPromise = abortClient.renderSync({
      html: '<html><body>Abort</body></html>',
      signal: controller.signal,
    });

    controller.abort();

    await expect(renderPromise).rejects.toMatchObject({
      code: 'aborted',
      retryable: false,
    });
  });

  it('normalizes malformed async responses as invalid responses', async () => {
    const missingStatusFetch = createMockFetch([jsonResponse({})]);
    const missingStatusClient = createDocRaptorClient({
      apiKey,
      fetch: missingStatusFetch,
    });

    await expect(
      missingStatusClient.createAsyncRender({
        html: '<html><body>Missing status</body></html>',
      }),
    ).rejects.toMatchObject({
      code: 'invalid_response',
      retryable: false,
    });

    const invalidJsonFetch = createMockFetch([
      textResponse('{not valid json', { contentType: 'application/json' }),
    ]);
    const invalidJsonClient = createDocRaptorClient({
      apiKey,
      fetch: invalidJsonFetch,
    });

    await expect(
      invalidJsonClient.createAsyncRender({
        html: '<html><body>Invalid JSON</body></html>',
      }),
    ).rejects.toMatchObject({
      code: 'invalid_response',
      retryable: false,
    });
  });

  it('normalizes successful response body read failures as retryable network errors', async () => {
    const syncFetch = createMockFetch([failingArrayBufferResponse()]);
    const syncClient = createDocRaptorClient({ apiKey, fetch: syncFetch });

    await expect(
      syncClient.renderSync({
        html: '<html><body>Unreadable PDF</body></html>',
      }),
    ).rejects.toMatchObject({
      code: 'network_error',
      retryable: true,
    });

    const asyncFetch = createMockFetch([failingTextResponse()]);
    const asyncClient = createDocRaptorClient({ apiKey, fetch: asyncFetch });

    await expect(
      asyncClient.createAsyncRender({
        html: '<html><body>Unreadable async JSON</body></html>',
      }),
    ).rejects.toMatchObject({
      code: 'network_error',
      retryable: true,
    });

    const statusFetch = createMockFetch([failingTextResponse()]);
    const statusClient = createDocRaptorClient({ apiKey, fetch: statusFetch });

    await expect(
      statusClient.getAsyncRenderStatus('status-unreadable'),
    ).rejects.toMatchObject({
      code: 'network_error',
      retryable: true,
    });
  });
});
