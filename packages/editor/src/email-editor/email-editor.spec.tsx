import { cleanup, render } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EmailEditor, type EmailEditorRef } from './email-editor';

vi.mock('@/actions/ai', () => ({
  uploadImageViaAI: vi.fn(),
}));

describe('EmailEditor', () => {
  afterEach(() => {
    cleanup();
  });

  it('exposes the imperative ref API', async () => {
    const ref = createRef<EmailEditorRef>();
    const onReady = vi.fn();

    render(
      <EmailEditor ref={ref} content="<p>hello</p>" onReady={onReady} />,
    );

    // Ready bridge runs in a layout effect.
    await vi.waitFor(() => expect(onReady).toHaveBeenCalled());

    expect(ref.current).not.toBeNull();
    expect(typeof ref.current?.getEmail).toBe('function');
    expect(typeof ref.current?.getEmailHTML).toBe('function');
    expect(typeof ref.current?.getEmailText).toBe('function');
    expect(typeof ref.current?.getJSON).toBe('function');
    // editor may briefly be null while initializing
    const json = ref.current?.getJSON();
    expect(json?.type).toBe('doc');
  });

  it('fires onReady exactly once after mount', async () => {
    const onReady = vi.fn();
    render(<EmailEditor content="<p>x</p>" onReady={onReady} />);
    await vi.waitFor(() => expect(onReady).toHaveBeenCalled());
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('calls onUpdate when the document changes', async () => {
    const ref = createRef<EmailEditorRef>();
    const onUpdate = vi.fn();
    render(
      <EmailEditor
        ref={ref}
        content="<p>start</p>"
        onUpdate={onUpdate}
      />,
    );
    await vi.waitFor(() => expect(ref.current?.editor).toBeTruthy());

    const editor = ref.current?.editor;
    expect(editor).toBeTruthy();
    editor?.commands.insertContent(' more');

    await vi.waitFor(() => expect(onUpdate).toHaveBeenCalled());
    // The ref passed to onUpdate must reflect the current editor state.
    const lastRef = onUpdate.mock.calls.at(-1)?.[0] as EmailEditorRef;
    const html = await lastRef.getEmailHTML();
    expect(html).toContain('more');
  });

  it('respects editable=false', async () => {
    const ref = createRef<EmailEditorRef>();
    render(
      <EmailEditor ref={ref} content="<p>x</p>" editable={false} />,
    );
    await vi.waitFor(() => expect(ref.current?.editor).toBeTruthy());
    expect(ref.current?.editor?.isEditable).toBe(false);
  });

  // The current implementation passes `key={JSON.stringify(theme)}` to
  // EditorProvider, which destroys and re-mounts the editor on every
  // theme change — wiping the undo stack, scroll, and selection. This
  // is the seam behind GRO-685 / GRO-353 / MES-378 / open P0
  // blank-and-scroll-to-top reports. Dropping the key in favor of an
  // imperative reconfigure is tracked separately because it touches
  // the EmailTheming extension's option lifecycle and needs careful
  // testing in the dashboard's collaborative session.
  it.skip('preserves the editor instance when theme changes', async () => {
    const ref = createRef<EmailEditorRef>();
    const { rerender } = render(
      <EmailEditor ref={ref} content="<p>x</p>" theme="basic" />,
    );
    await vi.waitFor(() => expect(ref.current?.editor).toBeTruthy());
    const editorBefore = ref.current?.editor;

    rerender(
      <EmailEditor ref={ref} content="<p>x</p>" theme="minimal" />,
    );

    await vi.waitFor(() => expect(ref.current?.editor).toBeTruthy());
    expect(ref.current?.editor).toBe(editorBefore);
  });
});
