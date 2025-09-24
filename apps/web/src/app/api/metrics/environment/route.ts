import { z } from 'zod';

export function OPTIONS() {
  return Promise.resolve(Response.json({}));
}

const bodyScheam = z.object({
  nodejsVersion: z.string(),
  reactVersion: z.string(),
  usesTailwind: z.boolean(),
  templatesCount: z.number(),
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
