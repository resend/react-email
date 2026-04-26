export type DocRaptorClientPackageName = '@asym/docraptor-client';
export type DocRaptorClientMaturity = 'phase-11-client';
export type DocRaptorClientRuntime = 'server-only';
export type DocRaptorClientOwnership = 'docraptor-client';
export type DocRaptorSecretPolicy = 'credentials-stay-server-side';

export interface DocRaptorClientBoundary {
  readonly packageName: DocRaptorClientPackageName;
  readonly maturity: DocRaptorClientMaturity;
  readonly owns: DocRaptorClientOwnership;
  readonly runtime: DocRaptorClientRuntime;
  readonly secretPolicy: DocRaptorSecretPolicy;
}

export type DocRaptorMode = 'test' | 'production';
export type DocRaptorMedia = 'print' | 'screen';

export type DocRaptorFetch = (
  input: string | URL,
  init?: RequestInit,
) => Promise<Response>;

export interface DocRaptorClientConfig {
  readonly apiKey: string;
  readonly mode?: DocRaptorMode;
  readonly apiBaseUrl?: string;
  readonly statusBaseUrl?: string;
  readonly fetch?: DocRaptorFetch;
  readonly defaultTimeoutMs?: number;
}

export interface DocRaptorIdempotencyMetadata {
  readonly key: string;
  readonly scope?: string;
  readonly templateId?: string;
  readonly templateVersion?: string | number;
  readonly dataSnapshotHash?: string;
  readonly renderIntent?: string;
  readonly recordId?: string;
}

export interface DocRaptorRequestOptions {
  readonly timeoutMs?: number;
  readonly signal?: AbortSignal;
}

export interface DocRaptorRenderRequest extends DocRaptorRequestOptions {
  readonly html: string;
  readonly name?: string;
  readonly baseUrl?: string;
  readonly media?: DocRaptorMedia;
  readonly tag?: string;
  readonly callbackUrl?: string;
  readonly idempotency?: DocRaptorIdempotencyMetadata;
}

export interface DocRaptorRequestMetadata {
  readonly url: string;
  readonly method: 'POST' | 'GET';
  readonly mode: DocRaptorMode;
  readonly test: boolean;
  readonly media: DocRaptorMedia;
  readonly tag?: string;
  readonly idempotency?: DocRaptorIdempotencyMetadata;
}

export interface DocRaptorSyncRenderResult {
  readonly kind: 'sync';
  readonly pdf: Uint8Array;
  readonly contentType: string;
  readonly pageCount?: number;
  readonly request: DocRaptorRequestMetadata;
  readonly idempotency?: DocRaptorIdempotencyMetadata;
}

export interface DocRaptorAsyncRenderJob {
  readonly kind: 'async_job';
  readonly statusId: string;
  readonly statusUrl: string;
  readonly request: DocRaptorRequestMetadata;
  readonly idempotency?: DocRaptorIdempotencyMetadata;
}

export type DocRaptorAsyncRenderStatusValue =
  | 'queued'
  | 'working'
  | 'completed'
  | 'failed'
  | 'unknown';

export interface DocRaptorAsyncRenderStatus {
  readonly statusId: string;
  readonly status: DocRaptorAsyncRenderStatusValue;
  readonly message?: string;
  readonly downloadUrl?: string;
  readonly numberOfPages?: number;
  readonly validationErrors?: readonly string[];
  readonly raw: Readonly<Record<string, unknown>>;
}

export interface DocRaptorPollAsyncRenderStatusOptions
  extends DocRaptorRequestOptions {
  readonly intervalMs?: number;
  readonly maxAttempts?: number;
}

export interface DocRaptorClient {
  renderSync(input: DocRaptorRenderRequest): Promise<DocRaptorSyncRenderResult>;
  createAsyncRender(
    input: DocRaptorRenderRequest,
  ): Promise<DocRaptorAsyncRenderJob>;
  getAsyncRenderStatus(
    statusId: string,
    options?: DocRaptorRequestOptions,
  ): Promise<DocRaptorAsyncRenderStatus>;
  pollAsyncRenderStatus(
    statusId: string,
    options?: DocRaptorPollAsyncRenderStatusOptions,
  ): Promise<DocRaptorAsyncRenderStatus>;
}

export interface DocRaptorDocumentPayload {
  readonly type: 'pdf';
  readonly document_content: string;
  readonly test: boolean;
  readonly name?: string;
  readonly tag?: string;
  readonly async?: true;
  readonly callback_url?: string;
  readonly prince_options: {
    readonly media: DocRaptorMedia;
    readonly baseurl?: string;
  };
}
