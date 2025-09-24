import { z } from 'zod';
import { env } from '@/env.mjs';

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
    const timestamp = new Date();

    const response = await fetch(
      'https://api.tinybird.co/v0/events?name=feature_usage',
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${env.tinybirdToken}`,
        }),
        body: JSON.stringify({
          timestamp: timestamp.toISOString(),
          feature: body.feature,
        }),
      },
    );

    if (response.ok) {
      return new Response(null, { status: 201 });
    }
    return Response.json({ error: await response.json() }, { status: 500 });
  } catch (error) {
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
