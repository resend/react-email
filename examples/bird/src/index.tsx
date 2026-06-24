import { BirdClient } from '@messagebird/sdk';
import { render } from 'react-email';
import { Email } from './email';

const bird = new BirdClient({ apiKey: process.env.BIRD_API_KEY || '' });

const emailHtml = await render(<Email url="https://example.com" />);

await bird.email.send({
  from: { email: 'you@example.com', name: 'You' },
  to: ['user@gmail.com'],
  subject: 'hello world',
  html: emailHtml,
});
