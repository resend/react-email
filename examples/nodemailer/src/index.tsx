import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import * as React from 'react';
import { Email } from './email';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'my_user',
    pass: 'my_password',
  },
});

const emailHtml = render(<Email url="https://example.com" />);

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: emailHtml,
};

transporter.sendMail(options);
