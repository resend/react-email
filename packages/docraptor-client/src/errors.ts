export type DocRaptorClientErrorCode =
  | 'missing_api_key'
  | 'http_error'
  | 'docraptor_error'
  | 'network_error'
  | 'timeout'
  | 'aborted'
  | 'invalid_response';

export interface DocRaptorClientErrorOptions {
  readonly code: DocRaptorClientErrorCode;
  readonly message: string;
  readonly retryable: boolean;
  readonly status?: number;
  readonly details?: Readonly<Record<string, unknown>>;
  readonly cause?: unknown;
}

export class DocRaptorClientError extends Error {
  readonly code: DocRaptorClientErrorCode;
  readonly retryable: boolean;
  readonly status?: number;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(options: DocRaptorClientErrorOptions) {
    super(options.message);

    this.name = 'DocRaptorClientError';
    this.code = options.code;
    this.retryable = options.retryable;
    this.status = options.status;
    this.details = options.details;

    if (options.cause !== undefined) {
      Object.defineProperty(this, 'cause', {
        configurable: true,
        enumerable: false,
        value: options.cause,
        writable: true,
      });
    }
  }
}

export function isRetryableHttpStatus(status: number): boolean {
  return status === 429 || status >= 500;
}
