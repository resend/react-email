import { Lettermint } from 'lettermint';
import { render } from 'react-email';
import { Email } from './email';

const email = Lettermint.email(process.env.LETTERMINT_SENDING_TOKEN || '');

const emailHtml = await render(<Email url="https://example.com" />);

await email
  .from('you@example.com')
  .to('user@gmail.com')
  .subject('hello world')
  .html(emailHtml)
  .send();
