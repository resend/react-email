import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { resend } from '../../../lib/resend';
import { getProperties } from '@react-email/render';

export async function POST(request: NextRequest) {
  try {
    const { reactMarkup, htmlMarkup, name } = await request.json();

    const extractedProperties = getProperties(reactMarkup) || [];

    const response = await resend.templates.create({
      name,
      html: htmlMarkup,
      variables: extractedProperties.map((variable) => ({
        key: variable.key,
        type: variable.type ?? 'string',
        fallback_value: variable.fallbackValue,
      })),
    });

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Failed to export template:', error);
    return NextResponse.json(
      { error: 'Failed to export template to Resend' },
      { status: 500 },
    );
  }
}
