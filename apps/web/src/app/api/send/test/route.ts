import { createClient } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit } from '@vercel/firewall';
import { z } from 'zod';

export function OPTIONS() {
  return Promise.resolve(NextResponse.json({}));
}

const bodySchema = z.object({
  to: z.string(),
  subject: z.string(),
  html: z.string(),
});

export async function POST(req: NextRequest) {
  const { rateLimited, error } = await checkRateLimit('test-email-sending', {
    request: req,
  });

  if (error === 'not-found') {
    throw new Error(
      'Firewall rule not found, failing all requests going forward to guard our reputation.',
    );
  }
  if (rateLimited) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
      },
      {
        status: 429,
      },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabaseTable = process.env.SUPABASE_TABLE_NAME;
  if (!supabaseUrl || !supabaseKey || !supabaseTable) {
    throw new Error('Supabase URL and key are required');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { to, subject, html } = bodySchema.parse(await req.json());

    const ip = req.headers.get('x-vercel-forwarded-for');
    const latitude = req.headers.get('x-vercel-ip-latitude');
    const longitude = req.headers.get('x-vercel-ip-longitude');
    const city = req.headers.get('x-vercel-ip-city');
    const country = req.headers.get('x-vercel-ip-country');
    const countryRegion = req.headers.get('x-vercel-ip-country-region');

    const savePromise = supabase.from(supabaseTable).insert({
      to: [to],
      subject,
      html,
      ip,
      latitude,
      longitude,
      city,
      country,
      country_region: countryRegion,
    });

    const sendPromise = resend.emails.send({
      from: 'React Email <preview@react.email>',
      to: [to],
      subject,
      html,
    });

    await Promise.all([savePromise, sendPromise]);

    return NextResponse.json({ message: 'Test email sent' });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
