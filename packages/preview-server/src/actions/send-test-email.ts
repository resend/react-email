'use server';

export async function sendTestEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ ok: boolean; status: number }> {
  const response = await fetch('https://react.email/api/send/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      subject,
      html,
    }),
  });

  return { ok: response.ok, status: response.status };
}
