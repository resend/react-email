import { render } from '@react-email/components';
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend';
import { Email } from './email';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || '',
});

const emailHtml = await render(<Email url="https://example.com" />);

const sentFrom = new Sender('you@yourdomain.com', 'Your name');
const recipients = [new Recipient('your@client.com', 'Your Client')];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setSubject('This is a Subject')
  .setHtml(emailHtml);

await mailerSend.email.send(emailParams);
