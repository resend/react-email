import { render } from '@react-email/render';

export async function GET() {
  try {
    const html = await render(<div>testing element</div>, { pretty: true });
    return new Response(html);
  } catch (exception) {
    let message = 'Some error ocurred';
    if (exception instanceof Error) {
      message = exception.toString();
    }
    return new Response(message, {
      status: 500,
    });
  }
}
