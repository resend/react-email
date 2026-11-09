import { BrevoClient } from '@getbrevo/brevo';
import { render } from 'react-email';
import { Email } from './email';

const brevo = new BrevoClient({ apiKey: process.env.BREVO_API_KEY || '' });

const emailHtml = await render(<Email url="https://example.com" />);

await brevo.transactionalEmails.sendTransacEmail({
  sender: { name: 'Acme', email: 'hello@example.com' },
  to: [{ email: 'hello@example.com' }],
  subject: 'Hello world',
  htmlContent: emailHtml,
});
