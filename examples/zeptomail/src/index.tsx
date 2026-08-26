import { SendMailClient } from 'zeptomail';
import { render } from 'react-email';
import { Email } from './email';

const client = new SendMailClient({
  url: 'api.zeptomail.com/',
  token: process.env.ZEPTOMAIL_TOKEN || '',
});

const emailHtml = await render(<Email url="https://example.com" />);

await client.sendMail({
  from: { name: 'Acme', address: 'hello@example.com' },
  to: [{ email_address: { name: 'Acme', address: 'hello@example.com' } }],
  subject: 'Hello world',
  htmlbody: emailHtml,
});
