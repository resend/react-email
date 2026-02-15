import { render } from '@react-email/render';
import { Barcode } from './index';

describe('<Barcode> component', () => {
  it('renders a QR code as an HTML table', async () => {
    const html = await render(
      <Barcode value="https://example.com" type="qrcode" />,
    );
    expect(html).toContain('data-id="react-email-barcode"');
    expect(html).toContain('<table');
    expect(html).toContain('role="presentation"');
    expect(html).toContain('border-collapse:collapse');
  });

  it('renders a Code128 barcode', async () => {
    const html = await render(
      <Barcode value="https://example.com" type="code128" />,
    );
    expect(html).toContain('<table');
    expect(html).toContain('data-id="react-email-barcode"');
  });

  it('renders an Aztec code', async () => {
    const html = await render(
      <Barcode value="https://example.com" type="azteccode" />,
    );
    expect(html).toContain('<table');
    expect(html).toContain('data-id="react-email-barcode"');
  });

  it('applies custom foreground and background colors', async () => {
    const html = await render(
      <Barcode
        value="test"
        type="qrcode"
        foregroundColor="#ff0000"
        backgroundColor="#00ff00"
      />,
    );
    expect(html).toContain('background:#f00');
    expect(html).toContain('background:#0f0');
  });

  it('respects custom cellSize', async () => {
    const html = await render(
      <Barcode value="test" type="qrcode" cellSize={8} />,
    );
    // Cell size should appear in width/height styles
    expect(html).toContain('height:8px');
  });

  it('renders without quiet zone when disabled', async () => {
    const withQuiet = await render(
      <Barcode value="test" type="qrcode" quietZone={true} />,
    );
    const withoutQuiet = await render(
      <Barcode value="test" type="qrcode" quietZone={false} />,
    );
    // Without quiet zone should have fewer rows (less HTML)
    expect(withoutQuiet.length).toBeLessThan(withQuiet.length);
  });

  it('renders with lossy compression enabled', async () => {
    const html = await render(
      <Barcode
        value="https://example.com"
        type="qrcode"
        lossy={true}
        lossyBudget={0.5}
        errorCorrection="H"
      />,
    );
    expect(html).toContain('<table');
    expect(html).toContain('data-id="react-email-barcode"');
  });

  it('includes Safari sizing cell in every row', async () => {
    const html = await render(
      <Barcode value="test" type="qrcode" cellSize={4} />,
    );
    // Each <tr> should have a zero-width sizing cell
    expect(html).toContain('width:0;height:4px;padding:0');
  });

  it('passes through extra props', async () => {
    const html = await render(
      <Barcode
        value="test"
        type="qrcode"
        data-testid="barcode-test"
        style={{ padding: '16px' }}
      />,
    );
    expect(html).toContain('data-testid="barcode-test"');
    expect(html).toContain('padding:16px');
  });
});
