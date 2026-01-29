import { render } from '@react-email/render';
import WelcomeEmail from './email';

// Example usage - render the email to HTML
const emailHtml = render(
  <WelcomeEmail
    userName="John Doe"
    companyName="Acme Corp"
    dashboardUrl="https://app.acmecorp.com/dashboard"
    logoUrl="https://your-domain.com/assets/logo.png"
  />
);

console.log(emailHtml);

// To send with Resend (example):
// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);
//
// await resend.emails.send({
//   from: 'onboarding@example.com',
//   to: 'user@example.com',
//   subject: 'Welcome to Acme Corp!',
//   html: emailHtml,
// });
