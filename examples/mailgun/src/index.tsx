import { render } from '@react-email/components';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import { Email } from './email';

const mailgun = new Mailgun(FormData);
const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

const emailHtml = await render(<Email url="https://example.com" />);

await client.messages.create(process.env.MAILGUN_DOMAIN || '', {
  from: 'you@example.com',
  to: ['user@gmail.com'],
  subject: 'hello world',
  html: emailHtml,
});
