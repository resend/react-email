import { render } from '@react-email/components';
import { Lettermint } from 'lettermint';
import { Email } from './email';

const lettermint = new Lettermint({
  apiToken: process.env.LETTERMINT_API_TOKEN || '',
});

const emailHtml = await render(<Email url="https://example.com" />);

await lettermint.email
  .from('you@example.com')
  .to('user@gmail.com')
  .subject('hello world')
  .html(emailHtml)
  .send();
