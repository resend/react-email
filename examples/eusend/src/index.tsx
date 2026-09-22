import { Eusend } from '@eusend_dev/sdk';
import { Email } from './email';

const eusend = new Eusend(process.env.EUSEND_API_KEY);

await eusend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  react: <Email url="https://example.com" />,
});
