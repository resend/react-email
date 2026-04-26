import { Buffer } from 'node:buffer';
import {
  DocRaptorClientError,
  type DocRaptorClientErrorCode,
  isRetryableHttpStatus,
} from './errors';
import { assertDocRaptorServerRuntime } from './server-only';
import type {
  DocRaptorAsyncRenderJob,
  DocRaptorAsyncRenderStatus,
  DocRaptorAsyncRenderStatusValue,
  DocRaptorClient,
  DocRaptorClientConfig,
  DocRaptorDocumentPayload,
  DocRaptorFetch,
  DocRaptorMode,
  DocRaptorPollAsyncRenderStatusOptions,
  DocRaptorRenderRequest,
  DocRaptorRequestMetadata,
  DocRaptorRequestOptions,
  DocRaptorSyncRenderResult,
} from './types';

const defaultApiBaseUrl = 'https://api.docraptor.com';
const defaultStatusBaseUrl = 'https://docraptor.com';
const defaultTimeoutMs = 60_000;
const defaultPollIntervalMs = 1_000;
const defaultMaxPollAttempts = 60;
const completedStatuses = new Set<DocRaptorAsyncRenderStatusValue>([
  'completed',
  'failed',
]);

interface NormalizedConfig {
  readonly apiKey: string;
  readonly mode: DocRaptorMode;
  readonly apiBaseUrl: string;
  readonly statusBaseUrl: string;
  readonly fetch: DocRaptorFetch;
  readonly defaultTimeoutMs: number;
}

interface RequestContext extends DocRaptorRequestOptions {
  readonly url: string;
  readonly method: 'POST' | 'GET';
  readonly headers: Readonly<Record<string, string>>;
  readonly body?: string;
  readonly apiKey: string;
  readonly defaultTimeoutMs: number;
}

interface DocRaptorErrorDetails extends Readonly<Record<string, unknown>> {
  readonly errors?: readonly string[];
}

interface AbortState {
  readonly signal: AbortSignal;
  readonly cleanup: () => void;
  readonly getReason: () => 'timeout' | 'aborted' | undefined;
}

export function createDocRaptorClient(
  config: DocRaptorClientConfig,
): DocRaptorClient {
  assertDocRaptorServerRuntime();

  const normalizedConfig = normalizeConfig(config);

  return {
    createAsyncRender: (input) => createAsyncRender(normalizedConfig, input),
    getAsyncRenderStatus: (statusId, options) =>
      getAsyncRenderStatus(normalizedConfig, statusId, options),
    pollAsyncRenderStatus: (statusId, options) =>
      pollAsyncRenderStatus(normalizedConfig, statusId, options),
    renderSync: (input) => renderSync(normalizedConfig, input),
  };
}

async function renderSync(
  config: NormalizedConfig,
  input: DocRaptorRenderRequest,
): Promise<DocRaptorSyncRenderResult> {
  const payload = createDocumentPayload(config, input, false);
  const url = createEndpointUrl(config.apiBaseUrl, '/docs');
  const request = createRequestMetadata(config, input, url, 'POST');
  const response = await sendJsonRequest(config, {
    apiKey: config.apiKey,
    body: JSON.stringify(payload),
    defaultTimeoutMs: config.defaultTimeoutMs,
    headers: createJsonHeaders(config.apiKey, 'application/pdf'),
    method: 'POST',
    signal: input.signal,
    timeoutMs: input.timeoutMs,
    url,
  });

  const pdf = new Uint8Array(await readResponseArrayBuffer(response));
  const contentType = response.headers.get('content-type') ?? 'application/pdf';
  const pageCount = readPositiveIntegerHeader(
    response.headers,
    'x-docraptor-num-pages',
  );

  return {
    contentType,
    idempotency: input.idempotency,
    kind: 'sync',
    pageCount,
    pdf,
    request,
  };
}

async function createAsyncRender(
  config: NormalizedConfig,
  input: DocRaptorRenderRequest,
): Promise<DocRaptorAsyncRenderJob> {
  const payload = createDocumentPayload(config, input, true);
  const url = createEndpointUrl(config.apiBaseUrl, '/docs');
  const request = createRequestMetadata(config, input, url, 'POST');
  const response = await sendJsonRequest(config, {
    apiKey: config.apiKey,
    body: JSON.stringify(payload),
    defaultTimeoutMs: config.defaultTimeoutMs,
    headers: createJsonHeaders(config.apiKey, 'application/json'),
    method: 'POST',
    signal: input.signal,
    timeoutMs: input.timeoutMs,
    url,
  });
  const body = await readJsonObject(response, config.apiKey);
  const statusId = readString(body, 'status_id');

  if (!statusId) {
    throw new DocRaptorClientError({
      code: 'invalid_response',
      details: {
        response: sanitizeUnknown(body, config.apiKey),
      },
      message: 'DocRaptor async render response did not include status_id.',
      retryable: false,
    });
  }

  return {
    idempotency: input.idempotency,
    kind: 'async_job',
    request,
    statusId,
    statusUrl: createStatusUrl(config.statusBaseUrl, statusId),
  };
}

async function getAsyncRenderStatus(
  config: NormalizedConfig,
  statusId: string,
  options: DocRaptorRequestOptions = {},
): Promise<DocRaptorAsyncRenderStatus> {
  const url = createStatusUrl(config.statusBaseUrl, statusId);
  const response = await sendJsonRequest(config, {
    apiKey: config.apiKey,
    defaultTimeoutMs: config.defaultTimeoutMs,
    headers: createJsonHeaders(config.apiKey, 'application/json'),
    method: 'GET',
    signal: options.signal,
    timeoutMs: options.timeoutMs,
    url,
  });
  const body = await readJsonObject(response, config.apiKey);
  const status = readAsyncStatusValue(body);

  return {
    downloadUrl: readString(body, 'download_url'),
    message: readString(body, 'message'),
    numberOfPages: readNumber(body, 'number_of_pages'),
    raw: body,
    status,
    statusId,
    validationErrors: normalizeValidationErrors(body.validation_errors),
  };
}

async function pollAsyncRenderStatus(
  config: NormalizedConfig,
  statusId: string,
  options: DocRaptorPollAsyncRenderStatusOptions = {},
): Promise<DocRaptorAsyncRenderStatus> {
  const maxAttempts = options.maxAttempts ?? defaultMaxPollAttempts;
  const intervalMs = options.intervalMs ?? defaultPollIntervalMs;
  const timeoutAt =
    options.timeoutMs === undefined
      ? undefined
      : Date.now() + options.timeoutMs;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    throwIfAborted(options.signal);
    throwIfPollTimedOut(timeoutAt);

    const status = await getAsyncRenderStatus(config, statusId, {
      signal: options.signal,
      timeoutMs: options.timeoutMs,
    });

    if (completedStatuses.has(status.status)) {
      return status;
    }

    if (attempt < maxAttempts) {
      await sleep(intervalMs, options.signal, timeoutAt);
    }
  }

  throw new DocRaptorClientError({
    code: 'timeout',
    details: {
      maxAttempts,
      statusId,
    },
    message: `DocRaptor async status polling exceeded ${maxAttempts} attempts.`,
    retryable: true,
  });
}

async function sendJsonRequest(
  config: NormalizedConfig,
  request: RequestContext,
): Promise<Response> {
  const abortState = createAbortState(request);

  try {
    const response = await config.fetch(request.url, {
      body: request.body,
      headers: request.headers,
      method: request.method,
      signal: abortState.signal,
    });

    if (!response.ok) {
      throw await createHttpError(response, request.apiKey);
    }

    return response;
  } catch (error) {
    if (error instanceof DocRaptorClientError) {
      throw error;
    }

    const abortReason = abortState.getReason();

    if (abortReason === 'timeout') {
      throw new DocRaptorClientError({
        code: 'timeout',
        message: 'DocRaptor request timed out.',
        retryable: true,
        cause: error,
      });
    }

    if (abortReason === 'aborted' || request.signal?.aborted) {
      throw new DocRaptorClientError({
        code: 'aborted',
        message: 'DocRaptor request was aborted.',
        retryable: false,
        cause: error,
      });
    }

    throw new DocRaptorClientError({
      code: 'network_error',
      message: 'DocRaptor request failed before receiving a response.',
      retryable: true,
      cause: error,
    });
  } finally {
    abortState.cleanup();
  }
}

function normalizeConfig(config: DocRaptorClientConfig): NormalizedConfig {
  const apiKey = config.apiKey.trim();

  if (!apiKey) {
    throw new DocRaptorClientError({
      code: 'missing_api_key',
      message: 'DocRaptor API key is required.',
      retryable: false,
    });
  }

  return {
    apiBaseUrl: config.apiBaseUrl ?? defaultApiBaseUrl,
    apiKey,
    defaultTimeoutMs: config.defaultTimeoutMs ?? defaultTimeoutMs,
    fetch: config.fetch ?? globalThis.fetch.bind(globalThis),
    mode: config.mode ?? 'test',
    statusBaseUrl: config.statusBaseUrl ?? defaultStatusBaseUrl,
  };
}

function createDocumentPayload(
  config: NormalizedConfig,
  input: DocRaptorRenderRequest,
  isAsyncRender: boolean,
): DocRaptorDocumentPayload {
  const media = input.media ?? 'print';
  const tag = input.tag ?? input.idempotency?.key;
  const princeOptions: DocRaptorDocumentPayload['prince_options'] = {
    media,
    ...(input.baseUrl ? { baseurl: input.baseUrl } : {}),
  };

  return {
    ...(isAsyncRender ? { async: true as const } : {}),
    ...(isAsyncRender && input.callbackUrl
      ? { callback_url: input.callbackUrl }
      : {}),
    ...(input.name ? { name: input.name } : {}),
    ...(tag ? { tag } : {}),
    document_content: input.html,
    prince_options: princeOptions,
    test: config.mode === 'test',
    type: 'pdf',
  };
}

function createRequestMetadata(
  config: NormalizedConfig,
  input: DocRaptorRenderRequest,
  url: string,
  method: 'POST' | 'GET',
): DocRaptorRequestMetadata {
  return {
    idempotency: input.idempotency,
    media: input.media ?? 'print',
    method,
    mode: config.mode,
    tag: input.tag ?? input.idempotency?.key,
    test: config.mode === 'test',
    url,
  };
}

function createJsonHeaders(
  apiKey: string,
  accept: string,
): Readonly<Record<string, string>> {
  return {
    accept,
    authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    'content-type': 'application/json',
  };
}

function createEndpointUrl(baseUrl: string, path: string): string {
  return new URL(path, ensureTrailingSlash(baseUrl)).toString();
}

function createStatusUrl(statusBaseUrl: string, statusId: string): string {
  return createEndpointUrl(
    statusBaseUrl,
    `/status/${encodeURIComponent(statusId)}`,
  );
}

function ensureTrailingSlash(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function readPositiveIntegerHeader(
  headers: Headers,
  name: string,
): number | undefined {
  const value = headers.get(name);

  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

async function createHttpError(
  response: Response,
  apiKey: string,
): Promise<DocRaptorClientError> {
  const details = await readDocRaptorErrorDetails(response, apiKey);
  const retryable = isRetryableHttpStatus(response.status);
  const code = selectHttpErrorCode(response.status, details.errors);
  const messageSuffix =
    details.errors && details.errors.length > 0
      ? `: ${details.errors.join('; ')}`
      : '';

  return new DocRaptorClientError({
    code,
    details,
    message: `DocRaptor request failed with HTTP ${response.status}${messageSuffix}.`,
    retryable,
    status: response.status,
  });
}

function selectHttpErrorCode(
  status: number,
  errors: readonly string[] | undefined,
): DocRaptorClientErrorCode {
  if (isRetryableHttpStatus(status)) {
    return 'http_error';
  }

  if (errors && errors.length > 0) {
    return 'docraptor_error';
  }

  return 'http_error';
}

async function readDocRaptorErrorDetails(
  response: Response,
  apiKey: string,
): Promise<DocRaptorErrorDetails> {
  const body = await response.text();
  const sanitizedBody = redactSecret(body, apiKey);
  const contentType = response.headers.get('content-type') ?? '';
  const errors = contentType.includes('json')
    ? readJsonErrors(sanitizedBody)
    : readXmlErrors(sanitizedBody);
  const details: {
    body: string;
    errors?: readonly string[];
    statusText: string;
  } = {
    body: sanitizedBody,
    statusText: response.statusText,
  };

  if (errors.length > 0) {
    details.errors = errors;
  }

  return details;
}

function readJsonErrors(body: string): readonly string[] {
  const parsed = parseJsonObject(body);

  if (!parsed) {
    return [];
  }

  const candidates = [
    parsed.error,
    parsed.errors,
    parsed.message,
    parsed.validation_errors,
  ];

  return normalizeValidationErrors(candidates.find(Boolean)) ?? [];
}

function readXmlErrors(body: string): readonly string[] {
  const matches = [...body.matchAll(/<error>([\s\S]*?)<\/error>/giu)];

  return matches
    .map((match) => decodeXmlEntities(match[1] ?? '').trim())
    .filter((message) => message.length > 0);
}

async function readJsonObject(
  response: Response,
  apiKey: string,
): Promise<Readonly<Record<string, unknown>>> {
  const body = await readResponseText(response);
  const parsed = parseJsonObject(redactSecret(body, apiKey));

  if (!parsed) {
    throw new DocRaptorClientError({
      code: 'invalid_response',
      details: {
        body: redactSecret(body, apiKey),
      },
      message: 'DocRaptor returned an invalid JSON response.',
      retryable: false,
    });
  }

  return parsed;
}

async function readResponseArrayBuffer(
  response: Response,
): Promise<ArrayBuffer> {
  try {
    return await response.arrayBuffer();
  } catch (error) {
    throw createBodyReadError(error);
  }
}

async function readResponseText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch (error) {
    throw createBodyReadError(error);
  }
}

function createBodyReadError(error: unknown): DocRaptorClientError {
  return new DocRaptorClientError({
    cause: error,
    code: 'network_error',
    message: 'DocRaptor response body could not be read.',
    retryable: true,
  });
}

function parseJsonObject(
  value: string,
): Readonly<Record<string, unknown>> | undefined {
  try {
    const parsed: unknown = JSON.parse(value);
    return isRecord(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function readString(
  value: Readonly<Record<string, unknown>>,
  key: string,
): string | undefined {
  const candidate = value[key];

  return typeof candidate === 'string' && candidate.length > 0
    ? candidate
    : undefined;
}

function readNumber(
  value: Readonly<Record<string, unknown>>,
  key: string,
): number | undefined {
  const candidate = value[key];

  return typeof candidate === 'number' && Number.isFinite(candidate)
    ? candidate
    : undefined;
}

function readAsyncStatusValue(
  value: Readonly<Record<string, unknown>>,
): DocRaptorAsyncRenderStatusValue {
  const status = readString(value, 'status');

  if (
    status === 'queued' ||
    status === 'working' ||
    status === 'completed' ||
    status === 'failed'
  ) {
    return status;
  }

  return 'unknown';
}

function normalizeValidationErrors(
  value: unknown,
): readonly string[] | undefined {
  if (Array.isArray(value)) {
    const errors = value
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return errors.length > 0 ? errors : undefined;
  }

  if (typeof value === 'string') {
    const errors = value
      .split(/\r?\n/u)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return errors.length > 0 ? errors : undefined;
  }

  return undefined;
}

function createAbortState(request: RequestContext): AbortState {
  const controller = new AbortController();
  const timeoutMs = request.timeoutMs ?? request.defaultTimeoutMs;
  let reason: 'timeout' | 'aborted' | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const abortFromCaller = () => {
    reason = 'aborted';
    controller.abort(request.signal?.reason);
  };

  if (request.signal?.aborted) {
    abortFromCaller();
  } else if (request.signal) {
    request.signal.addEventListener('abort', abortFromCaller, { once: true });
  }

  if (timeoutMs > 0) {
    timeout = setTimeout(() => {
      reason = 'timeout';
      controller.abort();
    }, timeoutMs);
  }

  return {
    cleanup: () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      request.signal?.removeEventListener('abort', abortFromCaller);
    },
    getReason: () => reason,
    signal: controller.signal,
  };
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) {
    throw new DocRaptorClientError({
      code: 'aborted',
      message: 'DocRaptor request was aborted.',
      retryable: false,
    });
  }
}

function throwIfPollTimedOut(timeoutAt: number | undefined): void {
  if (timeoutAt !== undefined && Date.now() >= timeoutAt) {
    throw new DocRaptorClientError({
      code: 'timeout',
      message: 'DocRaptor async status polling timed out.',
      retryable: true,
    });
  }
}

async function sleep(
  intervalMs: number,
  signal: AbortSignal | undefined,
  timeoutAt: number | undefined,
): Promise<void> {
  throwIfAborted(signal);
  throwIfPollTimedOut(timeoutAt);

  const remainingMs =
    timeoutAt === undefined
      ? intervalMs
      : Math.min(intervalMs, timeoutAt - Date.now());

  if (remainingMs <= 0) {
    throwIfPollTimedOut(timeoutAt);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      signal?.removeEventListener('abort', abort);
    };
    const timeout = setTimeout(() => {
      cleanup();
      resolve();
    }, remainingMs);
    const abort = () => {
      clearTimeout(timeout);
      cleanup();
      reject(
        new DocRaptorClientError({
          code: 'aborted',
          message: 'DocRaptor request was aborted.',
          retryable: false,
        }),
      );
    };

    signal?.addEventListener('abort', abort, { once: true });
  });
}

function sanitizeUnknown(value: unknown, apiKey: string): unknown {
  if (typeof value === 'string') {
    return redactSecret(value, apiKey);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeUnknown(item, apiKey));
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sanitizeUnknown(item, apiKey),
      ]),
    );
  }

  return value;
}

function redactSecret(value: string, apiKey: string): string {
  return value.split(apiKey).join('[redacted]');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function decodeXmlEntities(value: string): string {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}
