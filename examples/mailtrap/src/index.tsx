import { MailtrapClient } from 'mailtrap';
import { render } from 'react-email';
import { Email } from './email';

const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN || '',
});

const emailHtml = await render(<Email url="https://example.com" />);

await mailtrap.send({
  from: { name: 'Acme', email: 'hello@example.com' },
  to: [{ email: 'hello@example.com' }],
  subject: 'Hello world',
  html: emailHtml,
});
