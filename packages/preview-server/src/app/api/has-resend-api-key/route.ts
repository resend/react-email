import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.RESEND_API_KEY || '';

    return NextResponse.json(
      {
        ok: !!apiKey,
        error: null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error checking Resend API key', error);
    return NextResponse.json(
      { ok: false, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
