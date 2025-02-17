import { IndiePitcher } from 'indiepitcher';
import { render } from '@react-email/components';
import { Email } from './email';

const indiePitcher = new IndiePitcher(process.env.INDIEPITCHER_API_KEY || '');

const emailHtml = await render(<Email url="https://example.com" />);

await indiePitcher.sendEmail({
  to: 'hello@indiepitcher.com',
  subject: 'Hello world',
  body: emailHtml,
  bodyFormat: 'html',
});
