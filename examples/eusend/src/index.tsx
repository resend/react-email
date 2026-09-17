import { Eusend } from '@eusend_dev/sdk';
import { render } from 'react-email';
import { Email } from './email';

const eusend = new Eusend(process.env.EUSEND_API_KEY);

const emailHtml = await render(<Email url="https://example.com" />);

await eusend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: emailHtml,
});
