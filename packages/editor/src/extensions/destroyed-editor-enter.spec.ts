import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { AlignmentAttribute } from './alignment-attribute';
import { ClassAttribute } from './class-attribute';
import { StyleAttribute } from './style-attribute';

describe('Enter handlers on a destroyed editor', () => {
  let frames: FrameRequestCallback[];

  beforeEach(() => {
    frames = [];
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function createEditor(content: string) {
    return new Editor({
      extensions: [
        StarterKit,
        ClassAttribute.configure({ types: ['paragraph'] }),
        StyleAttribute.configure({ types: ['paragraph'] }),
        AlignmentAttribute.configure({ types: ['paragraph'] }),
      ],
      content,
    });
  }

  function runFrames() {
    for (const frame of frames) {
      frame(performance.now());
    }
  }

  it('skips the class and style resets when the editor is destroyed before the frame', () => {
    const editor = createEditor(
      '<p class="intro" style="color: red">hello</p>',
    );
    editor.commands.setTextSelection(editor.state.doc.content.size - 1);
    editor.commands.keyboardShortcut('Enter');
    expect(frames.length).toBeGreaterThan(0);

    editor.destroy();

    expect(runFrames).not.toThrow();
  });

  it('skips the alignment reset when the editor is destroyed before the frame', () => {
    const editor = createEditor('<p alignment="center">hello</p>');
    editor.commands.setNodeSelection(0);
    expect(editor.state.doc.nodeAt(0)?.attrs.alignment).toBe('center');
    editor.commands.keyboardShortcut('Enter');
    expect(frames.length).toBeGreaterThan(0);

    editor.destroy();

    expect(runFrames).not.toThrow();
  });
});
