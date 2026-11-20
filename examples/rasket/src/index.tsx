import { Rasket } from 'rasket';
import { render } from 'react-email';
import { Email } from './email';

const rasket = new Rasket({ apiKey: process.env.RASKET_API_KEY || '' });

const emailHtml = await render(<Email url="https://example.com" />);

await rasket.emails.send({
  from: 'you@example.com',
  to: ['user@gmail.com'],
  subject: 'hello world',
  html: emailHtml,
});
