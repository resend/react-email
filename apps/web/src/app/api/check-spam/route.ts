import { type NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { checkSpam } from './check-spam';

export const dynamic = 'force-dynamic';

export function OPTIONS() {
  return Promise.resolve(NextResponse.json({}));
}

const bodySchema = z.object({
  html: z.string(),
  plainText: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { html, plainText } = bodySchema.parse(await req.json());

    return NextResponse.json(await checkSpam(html, plainText));
  } catch (exception) {
    if (exception instanceof Error) {
      return NextResponse.json(
        { error: exception.message },
        { status: exception instanceof ZodError ? 400 : 500 },
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
