import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
      }, { status: 400 });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
