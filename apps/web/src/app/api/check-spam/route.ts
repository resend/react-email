import { ZodError, z } from 'zod';
import { checkSpam } from './check-spam';

export function OPTIONS() {
  return Promise.resolve(Response.json({}));
}

const bodySchema = z.object({
  html: z.string(),
  plainText: z.string(),
});

export async function POST(req: Request) {
  try {
    const { html, plainText } = bodySchema.parse(await req.json());

    return Response.json(await checkSpam(html, plainText));
  } catch (exception) {
    if (exception instanceof Error) {
      return Response.json(
        { error: exception.message },
        { status: exception instanceof ZodError ? 400 : 500 },
      );
    }

    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
