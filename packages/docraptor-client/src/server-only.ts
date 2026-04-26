const serverOnlyMessage =
  '@asym/docraptor-client is server-only and must not be imported in browser bundles.';

export function assertDocRaptorServerRuntime(): void {
  const runtime = globalThis as typeof globalThis & {
    readonly document?: unknown;
    readonly window?: unknown;
  };

  if (runtime.window !== undefined && runtime.document !== undefined) {
    throw new Error(serverOnlyMessage);
  }
}
