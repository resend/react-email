import { z } from 'zod';

export function OPTIONS() {
  return Promise.resolve(Response.json({}));
}

const bodyScheam = z.object({
  feature: z.union([
    z.literal('toolbar'),
    z.literal('compatibility checking'),
    z.literal('spam checking'),
    z.literal('image/link checking'),
    z.literal('sending test email'),
  ]),
});

export default async function POST(request: Request) {
  try {
    const body = bodyScheam.parse(await request.json());

    // Save the usage of that specific feature
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
