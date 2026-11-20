import { Sendora } from '@sendora/sdk';
import { render, toPlainText } from 'react-email';
import { Email } from './email';

const sendora = new Sendora({ token: process.env.SENDORA_API_TOKEN });

const html = await render(<Email url="https://example.com" />);

await sendora.email.send({
  from: 'you@example.com',
  to: ['user@gmail.com'],
  subject: 'hello world',
  html,
  text: toPlainText(html),
});
