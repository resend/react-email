import { render } from '@react-email/components';
import postmark from 'postmark';
import { Email } from './email';

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY || '');

const emailHtml = await render(<Email url="https://example.com" />);

const options = {
  From: 'you@example.com',
  To: 'user@gmail.com',
  Subject: 'hello world',
  HtmlBody: emailHtml,
};

await client.sendEmail(options);
