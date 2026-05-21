import { beforeEach, describe, expect, it } from 'vitest';
import {
  readWorkspaceValue,
  REACT_EMAIL_DATA_STORAGE_KEY,
  writeWorkspaceValue,
} from './workspace-storage';

const WORKSPACE_A = 'abcdef123456';
const WORKSPACE_B = 'fedcba654321';

const readBlob = () =>
  JSON.parse(
    window.localStorage.getItem(REACT_EMAIL_DATA_STORAGE_KEY) ?? 'null',
  );

describe('workspace-storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns undefined when nothing is stored', () => {
    expect(readWorkspaceValue(WORKSPACE_A, 'foo')).toBeUndefined();
  });

  it('stores and retrieves a value under a workspace + key', () => {
    writeWorkspaceValue(WORKSPACE_A, 'test-email-recipient', 'me@example.com');

    expect(readWorkspaceValue<string>(WORKSPACE_A, 'test-email-recipient')).toBe(
      'me@example.com',
    );
  });

  it('keeps non-string values intact (objects, arrays, numbers, booleans)', () => {
    writeWorkspaceValue(WORKSPACE_A, 'spam', { score: 1.5, ok: true });
    writeWorkspaceValue(WORKSPACE_A, 'rows', [1, 2, 3]);

    expect(readWorkspaceValue(WORKSPACE_A, 'spam')).toEqual({
      score: 1.5,
      ok: true,
    });
    expect(readWorkspaceValue(WORKSPACE_A, 'rows')).toEqual([1, 2, 3]);
  });

  it('isolates workspaces from one another', () => {
    writeWorkspaceValue(WORKSPACE_A, 'recipient', 'a@example.com');
    writeWorkspaceValue(WORKSPACE_B, 'recipient', 'b@example.com');

    expect(readWorkspaceValue(WORKSPACE_A, 'recipient')).toBe('a@example.com');
    expect(readWorkspaceValue(WORKSPACE_B, 'recipient')).toBe('b@example.com');
  });

  it('persists everything under the single `react-email-data` key', () => {
    writeWorkspaceValue(WORKSPACE_A, 'recipient', 'a@example.com');
    writeWorkspaceValue(WORKSPACE_A, 'subject-welcome', 'Welcome!');
    writeWorkspaceValue(WORKSPACE_B, 'recipient', 'b@example.com');

    expect(readBlob()).toEqual({
      [WORKSPACE_A]: {
        recipient: 'a@example.com',
        'subject-welcome': 'Welcome!',
      },
      [WORKSPACE_B]: {
        recipient: 'b@example.com',
      },
    });
  });

  it('removes a key when written with undefined', () => {
    writeWorkspaceValue(WORKSPACE_A, 'recipient', 'a@example.com');
    writeWorkspaceValue(WORKSPACE_A, 'subject', 'Hello');
    writeWorkspaceValue(WORKSPACE_A, 'recipient', undefined);

    expect(readWorkspaceValue(WORKSPACE_A, 'recipient')).toBeUndefined();
    expect(readWorkspaceValue(WORKSPACE_A, 'subject')).toBe('Hello');
  });

  it('drops a workspace bucket once its last key is removed', () => {
    writeWorkspaceValue(WORKSPACE_A, 'recipient', 'a@example.com');
    writeWorkspaceValue(WORKSPACE_A, 'recipient', undefined);

    expect(readBlob()).toBeNull();
  });

  it('does not affect another workspace when one is emptied', () => {
    writeWorkspaceValue(WORKSPACE_A, 'recipient', 'a@example.com');
    writeWorkspaceValue(WORKSPACE_B, 'recipient', 'b@example.com');

    writeWorkspaceValue(WORKSPACE_A, 'recipient', undefined);

    expect(readBlob()).toEqual({
      [WORKSPACE_B]: { recipient: 'b@example.com' },
    });
  });

  it('ignores corrupt stored payloads', () => {
    window.localStorage.setItem(REACT_EMAIL_DATA_STORAGE_KEY, 'not valid json');

    expect(readWorkspaceValue(WORKSPACE_A, 'recipient')).toBeUndefined();
  });

  it('ignores non-object workspace buckets', () => {
    window.localStorage.setItem(
      REACT_EMAIL_DATA_STORAGE_KEY,
      JSON.stringify({
        [WORKSPACE_A]: 'not an object',
        [WORKSPACE_B]: { recipient: 'b@example.com' },
      }),
    );

    expect(readWorkspaceValue(WORKSPACE_A, 'recipient')).toBeUndefined();
    expect(readWorkspaceValue(WORKSPACE_B, 'recipient')).toBe('b@example.com');
  });
});
