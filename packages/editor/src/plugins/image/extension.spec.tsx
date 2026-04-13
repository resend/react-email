import { render } from 'react-email';
import { describe, expect, it, vi } from 'vitest';
import { createImageExtension } from './extension';

describe('Image extension', () => {
  const uploadImage = async () => ({ url: '' });
  const extension = createImageExtension({ uploadImage });
  const renderToReactEmail =
    (extension.options as any).renderToReactEmail ??
    extension.config.renderToReactEmail;

  it('renders basic image', async () => {
    const Component = () =>
      renderToReactEmail({
        node: {
          type: { name: 'image' },
          attrs: {
            src: 'https://example.com/img.png',
            alt: 'Test image',
            width: '600',
            height: 'auto',
            alignment: 'center',
            href: null,
          },
        },
        style: {},
        extension,
      });

    const html = await render(<Component />, { pretty: true });
    expect(html).toContain('src="https://example.com/img.png"');
    expect(html).toContain('alt="Test image"');
  });

  it('wraps image in link when href is set', async () => {
    const Component = () =>
      renderToReactEmail({
        node: {
          type: { name: 'image' },
          attrs: {
            src: 'https://example.com/img.png',
            alt: '',
            width: 'auto',
            height: 'auto',
            alignment: 'center',
            href: 'https://example.com',
          },
        },
        style: {},
        extension,
      });

    const html = await render(<Component />, { pretty: true });
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('src="https://example.com/img.png"');
  });

  it('defines expected attributes', () => {
    const attrs = extension.config.addAttributes?.call(extension) ?? {};
    expect(attrs).toHaveProperty('src');
    expect(attrs).toHaveProperty('alt');
    expect(attrs).toHaveProperty('width');
    expect(attrs).toHaveProperty('height');
    expect(attrs).toHaveProperty('alignment');
    expect(attrs).toHaveProperty('href');
  });

  it('returns correct node config', () => {
    const ext = createImageExtension({
      uploadImage: vi.fn().mockResolvedValue({ url: '' }),
    });

    expect(ext.name).toBe('image');
    expect(ext.config.atom).toBe(true);
    expect(ext.config.draggable).toBe(true);
    expect(ext.config.group).toBe('block');
  });

  it('has setImage and uploadImage commands', () => {
    const commands = extension.config.addCommands?.call(extension);
    expect(commands).toHaveProperty('setImage');
    expect(commands).toHaveProperty('uploadImage');
  });

  it('registers paste and drop ProseMirror plugins', () => {
    expect(extension.config.addProseMirrorPlugins).toBeDefined();
  });
});
