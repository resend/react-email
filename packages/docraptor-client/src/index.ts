export type DocRaptorClientPackageName = '@asym/docraptor-client';
export type DocRaptorClientMaturity = 'phase-3-boundary';
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

export const docraptorClientBoundary: DocRaptorClientBoundary = {
  packageName: '@asym/docraptor-client',
  maturity: 'phase-3-boundary',
  owns: 'docraptor-client',
  runtime: 'server-only',
  secretPolicy: 'credentials-stay-server-side',
};
