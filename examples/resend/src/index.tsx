import { Email } from './email';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend('re_123456789');

resend.sendEmail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  react: <Email url="https://example.com" />,
});
