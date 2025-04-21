import { render } from '@react-email/render';

export async function GET() {
  try {
    const html = await render(<div>testing element</div>, { pretty: true });
    return new Response(html);
  } catch (exception) {
    return new Response(JSON.stringify(exception), {
      status: 500,
    });
  }
}
