import { render } from '@react-email/render';
import sendgrid from '@sendgrid/mail';
import * as React from 'react';
import { Email } from './email';

// eslint-disable-next-line turbo/no-undeclared-env-vars
sendgrid.setApiKey(process.env.SENDGRID_API_KEY || '');

const emailHtml = render(<Email url="https://example.com" />);

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: emailHtml,
};

sendgrid.send(options);
