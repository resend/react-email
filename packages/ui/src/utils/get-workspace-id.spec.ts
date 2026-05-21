import { describe, expect, it } from 'vitest';
import { getWorkspaceId } from './get-workspace-id';

describe('getWorkspaceId()', () => {
  it('returns a stable id for the same path', () => {
    const id1 = getWorkspaceId('/Users/jane/code/my-emails');
    const id2 = getWorkspaceId('/Users/jane/code/my-emails');
    expect(id1).toBe(id2);
  });

  it('returns different ids for different project paths', () => {
    const id1 = getWorkspaceId('/Users/jane/code/project-a/emails');
    const id2 = getWorkspaceId('/Users/jane/code/project-b/emails');
    expect(id1).not.toBe(id2);
  });

  it('is sensitive to trailing path differences', () => {
    // Different inputs should produce different ids; we don't try to normalize
    // upstream-provided paths.
    const id1 = getWorkspaceId('/Users/jane/code/project-a');
    const id2 = getWorkspaceId('/Users/jane/code/project-a/');
    expect(id1).not.toBe(id2);
  });

  it('returns a short hex string', () => {
    const id = getWorkspaceId('/Users/jane/code/my-emails');
    expect(id).toMatch(/^[0-9a-f]{12}$/);
  });
});
