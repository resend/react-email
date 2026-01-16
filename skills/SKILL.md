---
name: react-email
description: Create beautiful, responsive HTML emails using React components with React Email. Build transactional emails with modern components, support internationalization, and integrate with email service providers like Resend. Use when creating welcome emails, password resets, notifications, order confirmations, or any HTML email templates.
license: MIT
metadata:
  author: Resend
  repository: https://github.com/resend/react-email
---

# React Email

Build and send HTML emails using React components - a modern, component-based approach to email development that works across all major email clients.

## Quick Start

Install React Email components:

```bash
npm install @react-email/components -E
```

## Basic Email Template

Create an email component with proper structure:

```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  verificationUrl: string;
}

export default function WelcomeEmail({ name, verificationUrl }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome - Verify your email</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Heading style={{ fontSize: '24px', color: '#333' }}>
            Welcome!
          </Heading>
          <Text style={{ fontSize: '16px', color: '#333' }}>
            Hi {name}, thanks for signing up!
          </Text>
          <Button 
            href={verificationUrl}
            style={{ 
              backgroundColor: '#007bff', 
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '4px',
              textDecoration: 'none',
              display: 'block',
              textAlign: 'center'
            }}
          >
            Verify Email
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

// Preview props for testing
WelcomeEmail.PreviewProps = {
  name: 'John Doe',
  verificationUrl: 'https://example.com/verify/abc123'
} satisfies WelcomeEmailProps;

export { WelcomeEmail };
```

## Essential Components

See [references/COMPONENTS.md](references/COMPONENTS.md) for complete component documentation.

**Core Structure:**
- `Html` - Root wrapper with `lang` attribute
- `Head` - Meta elements, styles, fonts
- `Body` - Main content wrapper
- `Container` - Centers content (max-width layout)
- `Section` - Layout sections
- `Row` & `Column` - Multi-column layouts

**Content:**
- `Preview` - Inbox preview text, always first in `Body`
- `Heading` - h1-h6 headings
- `Text` - Paragraphs
- `Button` - Styled link buttons
- `Link` - Hyperlinks
- `Img` - Images (use absolute URLs)
- `Hr` - Horizontal dividers

**Specialized:**
- `CodeBlock` - Syntax-highlighted code
- `CodeInline` - Inline code
- `Markdown` - Render markdown
- `Font` - Custom web fonts
- `Tailwind` - Tailwind CSS support

## Rendering and Sending

### Convert to HTML

```tsx
import { render } from '@react-email/components';
import { WelcomeEmail } from './emails/welcome';

const html = await render(
  <WelcomeEmail name="John" verificationUrl="https://example.com/verify" />
);
```

### Send with Resend (Recommended)

**Method 1: MCP Tool**

When you have access to the Resend MCP tool:

```typescript
import { render } from '@react-email/components';
import { WelcomeEmail } from './emails/welcome';

// Render to HTML
const html = await render(
  <WelcomeEmail name="John" verificationUrl="https://example.com/verify" />
);

// Create plain text version
const text = `Welcome!\n\nHi John, thanks for signing up!\n\nVerify: https://example.com/verify`;

// Use Resend MCP send-email tool with:
// - to: recipient@example.com
// - subject: Welcome to Acme
// - html: <rendered html>
// - text: <plain text version>
```

**Method 2: Resend SDK with React**

The most convenient method - pass React components directly:

```tsx
import { Resend } from 'resend';
import { WelcomeEmail } from './emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['user@example.com'],
  subject: 'Welcome to Acme',
  react: <WelcomeEmail name="John" verificationUrl="https://example.com/verify" />
});

if (error) {
  console.error('Failed to send:', error);
}
```

This handles the plain-text rendering and HTML rendering for you.

### Send with Other Providers

**Nodemailer:**

```tsx
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const html = await render(<WelcomeEmail name="John" verificationUrl="https://example.com/verify" />);

await transporter.sendMail({
  from: 'noreply@example.com',
  to: 'user@example.com',
  subject: 'Welcome',
  html
});
```

**SendGrid:**

```tsx
import { render } from '@react-email/components';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const html = await render(<WelcomeEmail name="John" verificationUrl="https://example.com/verify" />);

await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@example.com',
  subject: 'Welcome',
  html
});
```

## Internationalization

See [references/I18N.md](references/I18N.md) for complete i18n documentation.

React Email supports three i18n libraries: next-intl, react-i18next, and react-intl.

### Quick Example (next-intl)

```tsx
import { createTranslator } from 'next-intl';
import { Html, Body, Container, Text, Button } from '@react-email/components';

interface EmailProps {
  name: string;
  locale: string;
}

export default async function WelcomeEmail({ name, locale }: EmailProps) {
  const t = createTranslator({
    messages: await import(`../messages/${locale}.json`),
    namespace: 'welcome-email',
    locale
  });

  return (
    <Html lang={locale}>
      <Body>
        <Container>
          <Text>{t('greeting')} {name},</Text>
          <Text>{t('body')}</Text>
          <Button href="https://example.com">{t('cta')}</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

Message files (`messages/en.json`, `messages/es.json`, etc.):

```json
{
  "welcome-email": {
    "greeting": "Hi",
    "body": "Thanks for signing up!",
    "cta": "Get Started"
  }
}
```

## Email Best Practices

1. **Always use inline styles** - Email clients have poor CSS class support. Use the `style` prop on all components. The `Tailwind` component automatically inlines styles.

2. **Test across email clients** - Test in Gmail, Outlook, Apple Mail, Yahoo Mail. Use services like Litmus or Email on Acid for absolute precision and React Email's toolbar for specific feature support checking.

3. **Keep it responsive** - Max-width around 600px, test on mobile devices.

4. **Use absolute image URLs** - Host on reliable CDN, always include `alt` text.

5. **Provide plain text version** - Required for accessibility and some email clients.

6. **Keep file size under 102KB** - Gmail clips larger emails.

7. **Add proper TypeScript types** - Define interfaces for all email props.

8. **Include preview props** - Add `.PreviewProps` to components for development testing.

9. **Handle errors** - Always check for errors when sending emails.

10. **Use verified domains** - For production, use verified domains in `from` addresses.

## Common Patterns

See [references/PATTERNS.md](references/PATTERNS.md) for complete examples including:
- Password reset emails
- Order confirmations with product lists
- Notification emails with code blocks
- Multi-column layouts
- Email templates with custom fonts

## Additional Resources

- [React Email Documentation](https://react.email)
- [React Email GitHub](https://github.com/resend/react-email)
- [Resend Documentation](https://resend.com/docs)
- [Email Client CSS Support](https://www.caniemail.com)
- Component Reference: [references/COMPONENTS.md](references/COMPONENTS.md)
- Internationalization Guide: [references/I18N.md](references/I18N.md)
- Common Patterns: [references/PATTERNS.md](references/PATTERNS.md)
