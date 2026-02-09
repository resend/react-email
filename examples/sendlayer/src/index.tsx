import { render } from '@react-email/components';
import { SendLayer } from 'sendlayer';
import { Email } from './email';

const sendlayer = new SendLayer(process.env.SENDLAYER_API_KEY || '');

const emailHtml = await render(<Email url="https://example.com" />);

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: emailHtml,
};

await sendlayer.Emails.send(options);
