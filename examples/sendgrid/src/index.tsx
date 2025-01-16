import { render } from '@react-email/components';
import sendgrid from '@sendgrid/mail';
import { Email } from './email';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');

const emailHtml = await render(<Email url="https://example.com" />);

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: emailHtml,
};

await sendgrid.send(options);
