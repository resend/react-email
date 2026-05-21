import { createHash } from 'node:crypto';

/**
 * Derives a short, stable identifier for a React Email project from its
 * absolute path. Used to namespace browser-side persistence (e.g. localStorage)
 * so multiple projects served on the same preview origin (typically
 * `http://localhost:3000`) don't share each other's cached state.
 *
 * The output is deterministic for a given path and short enough to embed in
 * storage keys without being noisy. It's not security-sensitive — collisions
 * would only cause a single bad UX (mixed caches), not a vulnerability.
 */
export const getWorkspaceId = (projectAbsolutePath: string): string =>
  createHash('sha1').update(projectAbsolutePath).digest('hex').slice(0, 12);
