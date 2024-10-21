'use server';
import { z } from 'zod';

const SendTestEmailResponse = z.union([
  z.object({
    error: z.object({
      message: z.string(),
      code: z.string(),
      id: z.string(),
    }),
  }),
  z.object({
    message: z.string(),
  }),
]);

type SendTestEmailResponse = z.output<typeof SendTestEmailResponse>;

export async function sendTestEmail({
  to,
  subject,
  markup,
}: {
  to: string;
  subject: string;
  markup: string;
}) {
  const response = await fetch('https://react.email/api/send/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      subject,
      html: markup,
    }),
  });

  return {
    code: response.status,
    ok: response.ok,
    body: SendTestEmailResponse.parse(await response.json()),
  };
}
