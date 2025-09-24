import { z } from 'zod';
import { env } from '@/env.mjs';

export function OPTIONS() {
  return Promise.resolve(Response.json({}));
}

const bodyScheam = z.object({
  nodeVersion: z.string(),
  reactVersion: z.string(),
  usesTailwind: z.boolean(),
  templatesCount: z.number(),
});

export async function POST(request: Request) {
  try {
    const body = bodyScheam.parse(await request.json());
    const timestamp = new Date();

    const response = await fetch(
      'https://api.us-east.aws.tinybird.co/v0/events?name=environments',
      {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${env.tinybirdToken}`,
        }),
        body: JSON.stringify({
          timestamp: timestamp.toISOString(),
          ...body,
        }),
      },
    );

    if (response.ok) {
      return new Response(null, { status: 201 });
    }
    console.log(await response.text());
    return Response.json({ error: await response.text() }, { status: 500 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
