import { describe, expect, it, vi } from 'vitest';
import { createImageExtension } from './extension';

describe('useEditorImage integration', () => {
  it('createImageExtension returns an extension with image node config', () => {
    const extension = createImageExtension({
      uploadImage: vi.fn().mockResolvedValue({ url: '' }),
    });

    expect(extension.name).toBe('image');
    expect(extension.config.atom).toBe(true);
    expect(extension.config.draggable).toBe(true);
    expect(extension.config.group).toBe('block');
  });

  it('extension has setImage and uploadImage commands', () => {
    const extension = createImageExtension({
      uploadImage: vi.fn().mockResolvedValue({ url: '' }),
    });

    const commands = extension.config.addCommands?.call(extension);
    expect(commands).toHaveProperty('setImage');
    expect(commands).toHaveProperty('uploadImage');
  });

  it('extension registers paste and drop ProseMirror plugins', () => {
    const extension = createImageExtension({
      uploadImage: vi.fn().mockResolvedValue({ url: '' }),
    });

    expect(extension.config.addProseMirrorPlugins).toBeDefined();
  });
});
