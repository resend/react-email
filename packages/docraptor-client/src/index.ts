import { assertDocRaptorServerRuntime } from './server-only';

assertDocRaptorServerRuntime();

export { createDocRaptorClient } from './client';

export {
  DocRaptorClientError,
  type DocRaptorClientErrorCode,
} from './errors';
export type {
  DocRaptorAsyncRenderJob,
  DocRaptorAsyncRenderStatus,
  DocRaptorAsyncRenderStatusValue,
  DocRaptorClient,
  DocRaptorClientBoundary,
  DocRaptorClientConfig,
  DocRaptorClientMaturity,
  DocRaptorClientOwnership,
  DocRaptorClientPackageName,
  DocRaptorClientRuntime,
  DocRaptorFetch,
  DocRaptorIdempotencyMetadata,
  DocRaptorMedia,
  DocRaptorMode,
  DocRaptorPollAsyncRenderStatusOptions,
  DocRaptorRenderRequest,
  DocRaptorRequestMetadata,
  DocRaptorRequestOptions,
  DocRaptorSecretPolicy,
  DocRaptorSyncRenderResult,
} from './types';

export const docraptorClientBoundary = {
  packageName: '@asym/docraptor-client',
  maturity: 'phase-11-client',
  owns: 'docraptor-client',
  runtime: 'server-only',
  secretPolicy: 'credentials-stay-server-side',
} as const;
