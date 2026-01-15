---
name: react-email
description: Create beautiful, responsive HTML emails using React components with React Email. Build transactional emails with modern components, support internationalization, and integrate with email service providers like Resend.
---

# React Email

Build and send HTML emails using React components with React Email - a modern, component-based approach to email development.

## When to Use This Skill

Use this skill when you need to:
- Create transactional email templates (welcome emails, password resets, notifications, order confirmations)
- Build responsive emails that work across Gmail, Outlook, Apple Mail, and other email clients
- Implement multi-language email support with internationalization
- Send emails through Resend or other email service providers
- Convert existing email templates to use React components
- Test and preview emails during development

## Prerequisites

Install React Email components:

```bash
npm install @react-email/components -E
# or
yarn add @react-email/components -E
# or
pnpm install @react-email/components -E
```

For rendering emails to HTML:

```bash
npm install @react-email/render -E
```

## Core Components

React Email provides components that handle the complexities of email HTML rendering.

### Structural Components

**Html** - Root wrapper for the email
```jsx
import { Html } from '@react-email/components';

<Html lang="en">
  {/* email content */}
</Html>
```

**Head** - Contains meta elements, styles, and fonts
```jsx
import { Head } from '@react-email/components';

<Head>
  <title>Email Title</title>
</Head>
```

**Body** - Main email body wrapper
```jsx
import { Body } from '@react-email/components';

<Body style={{ backgroundColor: '#f6f9fc' }}>
  {/* email content */}
</Body>
```

**Container** - Centers email content (max-width layout)
```jsx
import { Container } from '@react-email/components';

<Container style={{ maxWidth: '600px', margin: '0 auto' }}>
  {/* centered content */}
</Container>
```

**Section** - Layout section that can contain rows/columns
```jsx
import { Section } from '@react-email/components';

<Section style={{ padding: '20px' }}>
  {/* section content */}
</Section>
```

**Row & Column** - Multi-column layouts
```jsx
import { Row, Column } from '@react-email/components';

<Section>
  <Row>
    <Column style={{ width: '50%' }}>Column 1</Column>
    <Column style={{ width: '50%' }}>Column 2</Column>
  </Row>
</Section>
```

### Content Components

**Preview** - Text shown in email inbox preview
```jsx
import { Preview } from '@react-email/components';

<Preview>Welcome to our platform - Get started today!</Preview>
```

**Heading** - Heading text (h1-h6)
```jsx
import { Heading } from '@react-email/components';

<Heading as="h1" style={{ fontSize: '24px', fontWeight: 'bold' }}>
  Welcome!
</Heading>
```

**Text** - Paragraph text
```jsx
import { Text } from '@react-email/components';

<Text style={{ fontSize: '16px', lineHeight: '24px' }}>
  Your paragraph content here.
</Text>
```

**Button** - Styled link button
```jsx
import { Button } from '@react-email/components';

<Button
  href="https://example.com/verify"
  style={{
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '4px'
  }}
>
  Verify Email
</Button>
```

**Link** - Hyperlink
```jsx
import { Link } from '@react-email/components';

<Link href="https://example.com" style={{ color: '#007bff' }}>
  Visit our website
</Link>
```

**Img** - Images
```jsx
import { Img } from '@react-email/components';

<Img
  src="https://example.com/logo.png"
  alt="Company Logo"
  width="150"
  height="50"
/>
```

**Hr** - Horizontal divider
```jsx
import { Hr } from '@react-email/components';

<Hr style={{ borderColor: '#e6e6e6', margin: '20px 0' }} />
```

### Specialized Components

**CodeBlock** - Syntax-highlighted code blocks
```jsx
import { CodeBlock, dracula } from '@react-email/components';

<CodeBlock
  code={`const greeting = "Hello World";`}
  language="javascript"
  theme={dracula}
  lineNumbers
/>
```

**CodeInline** - Inline code
```jsx
import { CodeInline } from '@react-email/components';

<Text>Run <CodeInline>npm install</CodeInline> to get started.</Text>
```

**Markdown** - Render Markdown content
```jsx
import { Markdown } from '@react-email/components';

<Markdown>{`
# Hello World
This is **bold** and this is *italic*.
`}</Markdown>
```

**Font** - Custom web fonts
```jsx
import { Font } from '@react-email/components';

<Head>
  <Font
    fontFamily="Roboto"
    fallbackFontFamily="Arial"
    webFont={{
      url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
      format: "woff2"
    }}
  />
</Head>
```

**Tailwind** - Use Tailwind CSS classes
```jsx
import { Tailwind } from '@react-email/components';

<Tailwind
  config={{
    theme: {
      extend: {
        colors: {
          brand: '#007bff'
        }
      }
    }
  }}
>
  <Button className="bg-brand text-white px-4 py-2 rounded">
    Click Me
  </Button>
</Tailwind>
```

## Creating Email Templates

### Step 1: Create the Email Component

Create a new file for your email template (e.g., `emails/welcome.tsx`):

```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  verificationUrl: string;
}

export default function WelcomeEmail({
  name,
  verificationUrl
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to our platform - Verify your email</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={h1}>Welcome to Acme!</Heading>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thanks for signing up! Please verify your email address to get started.
            </Text>
            <Button href={verificationUrl} style={button}>
              Verify Email Address
            </Button>
            <Hr style={hr} />
            <Text style={footer}>
              If you didn't create this account, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Preview props for development/testing
WelcomeEmail.PreviewProps = {
  name: 'John Doe',
  verificationUrl: 'https://example.com/verify/abc123'
} as WelcomeEmailProps;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const section = {
  padding: '0 48px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#007bff',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '24px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '20px',
};
```

### Step 2: Add TypeScript Types

Always define TypeScript interfaces for your email props to ensure type safety:

```tsx
interface EmailProps {
  name: string;
  email?: string;
  // ... other props
}

export default function MyEmail({ name, email }: EmailProps) {
  // ...
}
```

### Step 3: Test with Preview Props

Add preview props to see your email during development:

```tsx
MyEmail.PreviewProps = {
  name: 'Test User',
  email: 'test@example.com'
} as EmailProps;
```

## Rendering and Sending Emails

### Converting React to HTML

Use `@react-email/render` to convert your React email component to HTML:

```tsx
import { render } from '@react-email/render';
import WelcomeEmail from './emails/welcome';

const html = await render(
  <WelcomeEmail name="John" verificationUrl="https://example.com/verify/abc" />
);
```

### Integration with Email Providers

**Nodemailer**
```tsx
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import WelcomeEmail from './emails/welcome';

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const emailHtml = await render(
  <WelcomeEmail name="John" verificationUrl="https://example.com/verify" />
);

await transporter.sendMail({
  from: 'noreply@example.com',
  to: 'user@example.com',
  subject: 'Welcome to Acme',
  html: emailHtml,
});
```

**SendGrid**
```tsx
import { render } from '@react-email/render';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailHtml = await render(<WelcomeEmail name="John" verificationUrl="..." />);

await sgMail.send({
  to: 'user@example.com',
  from: 'noreply@example.com',
  subject: 'Welcome to Acme',
  html: emailHtml,
});
```

## Sending with Resend

Resend is the recommended email service provider with first-class React Email support.

### Method 1: Using Resend MCP Tool

When you have access to the Resend MCP (Model Context Protocol) tool, you can send emails directly:

```typescript
// First, render your React Email template to HTML
import { render } from '@react-email/render';
import WelcomeEmail from './emails/welcome';

const html = await render(
  <WelcomeEmail name="John" verificationUrl="https://example.com/verify" />
);

// Generate plain text version (required by MCP tool)
const text = `Welcome to Acme!\n\nHi John,\n\nThanks for signing up! Please verify your email address: https://example.com/verify`;

// Then use the Resend MCP send-email tool with:
// - to: recipient email address
// - subject: email subject
// - html: rendered HTML from React Email
// - text: plain text version (required)
```

The MCP tool will send the email through the user's configured Resend account.

### Method 2: Using Resend SDK with React Parameter

The Resend Node.js SDK supports passing React components directly:

```tsx
import { Resend } from 'resend';
import WelcomeEmail from './emails/welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['user@example.com'],
  subject: 'Welcome to Acme',
  react: <WelcomeEmail name="John" verificationUrl="https://example.com/verify" />
});
```

This is the most convenient method as Resend handles rendering automatically.

### Method 3: Using Resend Templates

For frequently used emails, create reusable templates in Resend:

**Create a Template in Resend:**
1. Use Resend dashboard or API to create a template
2. Define template variables (e.g., `NAME`, `VERIFY_URL`)
3. Publish the template to get a template ID

**Send Using Template:**
```tsx
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: ['user@example.com'],
  template: {
    id: 'welcome-email-template',
    variables: {
      NAME: 'John',
      VERIFY_URL: 'https://example.com/verify/abc123'
    }
  }
});
```

**Template Variables Best Practices:**
- Use UPPERCASE for variable names (e.g., `USER_NAME`, `PRODUCT_PRICE`)
- Each template can have up to 50 variables
- Variable types: `string` or `number`
- Provide fallback values in template definition when possible
- Reserved names: `FIRST_NAME`, `LAST_NAME`, `EMAIL`, `RESEND_UNSUBSCRIBE_URL`, `contact`, `this`

### Resend Integration Best Practices

1. **Development vs Production**: Use different API keys for development and production
2. **Error Handling**: Always check for errors in the response
   ```tsx
   const { data, error } = await resend.emails.send({...});
   if (error) {
     console.error('Failed to send email:', error);
     return;
   }
   ```
3. **From Address**: Use verified domains in your `from` address
4. **Testing**: Use Resend's testing domain for development: `onboarding@resend.dev`
5. **Rate Limits**: Be aware of rate limits on your Resend plan
6. **Templates vs React**: Use templates for high-volume transactional emails; use `react` parameter for dynamic or one-off emails

## Internationalization (i18n)

React Email supports multiple internationalization libraries for multi-language email support.

### Option 1: next-intl

**Install:**
```bash
npm install next-intl
```

**Create message files:**

```json
// messages/en.json
{
  "welcome-email": {
    "subject": "Welcome to Acme",
    "greeting": "Hi",
    "body": "Thanks for signing up!",
    "cta": "Get Started"
  }
}
```

```json
// messages/es.json
{
  "welcome-email": {
    "subject": "Bienvenido a Acme",
    "greeting": "Hola",
    "body": "¡Gracias por registrarte!",
    "cta": "Comenzar"
  }
}
```

**Update email template:**

```tsx
import { createTranslator } from 'next-intl';
import { Html, Body, Container, Text, Button } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  locale: string;
}

export default async function WelcomeEmail({ name, locale }: WelcomeEmailProps) {
  const t = createTranslator({
    messages: await import(`../messages/${locale}.json`),
    namespace: 'welcome-email',
    locale,
  });

  return (
    <Html lang={locale}>
      <Body>
        <Container>
          <Text>{t('greeting')} {name},</Text>
          <Text>{t('body')}</Text>
          <Button href="https://example.com/start">
            {t('cta')}
          </Button>
        </Container>
      </Body>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  name: 'John',
  locale: 'en'
} as WelcomeEmailProps;
```

### Option 2: react-i18next

**Install:**
```bash
npm install react-i18next i18next i18next-resources-to-backend
```

**Setup i18n:**

```js
// i18n.js
import i18next from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language, namespace) =>
    import(`./messages/${language}/${namespace}.json`)
  ))
  .init({
    supportedLngs: ['en', 'es', 'fr'],
    fallbackLng: 'en',
    lng: undefined,
    preload: ['en', 'es', 'fr'],
  });

export { i18next };
```

**Create helper:**

```js
// get-t.js
import { i18next } from './i18n';

export async function getT(namespace, locale) {
  if (locale && i18next.resolvedLanguage !== locale) {
    await i18next.changeLanguage(locale);
  }
  if (namespace && !i18next.hasLoadedNamespace(namespace)) {
    await i18next.loadNamespaces(namespace);
  }
  return {
    t: i18next.getFixedT(
      locale ?? i18next.resolvedLanguage,
      Array.isArray(namespace) ? namespace[0] : namespace
    ),
    i18n: i18next
  };
}
```

**Use in email:**

```tsx
import { getT } from '../get-t';

export default async function WelcomeEmail({ name, locale }) {
  const { t } = await getT('welcome-email', locale);

  return (
    <Html>
      <Body>
        <Text>{t('greeting')} {name}</Text>
        <Text>{t('body')}</Text>
        <Button href="https://example.com">{t('cta')}</Button>
      </Body>
    </Html>
  );
}
```

### Option 3: react-intl

**Install:**
```bash
npm install react-intl
```

**Use in email:**

```tsx
import { createIntl } from 'react-intl';

export default async function WelcomeEmail({ name, locale }) {
  const { formatMessage } = createIntl({
    locale,
    messages: await import(`../messages/${locale}/welcome-email.json`),
  });

  return (
    <Html>
      <Body>
        <Text>{formatMessage({ id: 'greeting' })} {name}</Text>
        <Text>{formatMessage({ id: 'body' })}</Text>
        <Button href="https://example.com">
          {formatMessage({ id: 'cta' })}
        </Button>
      </Body>
    </Html>
  );
}
```

### i18n Best Practices

1. **Always pass locale as a prop** to your email components
2. **Use locale in lang attribute**: `<Html lang={locale}>`
3. **Organize messages by namespace** (one file per email template)
4. **Provide fallback values** for all translation keys
5. **Test all supported locales** before deploying
6. **Consider date/number formatting**: Use `Intl.DateTimeFormat` and `Intl.NumberFormat` for locale-specific formatting
7. **RTL support**: Set `dir="rtl"` on `<Html>` for right-to-left languages

## Best Practices

### Email-Specific Considerations

1. **Inline Styles**: Always use inline styles or the `style` prop. Email clients have poor CSS class support.

2. **Tables for Layout**: React Email components handle this automatically, but be aware complex layouts use table-based HTML under the hood.

3. **Image Hosting**: Always use absolute URLs for images, hosted on a reliable CDN.

4. **Testing**: Test your emails in multiple clients:
   - Gmail (web, iOS, Android)
   - Outlook (desktop, web)
   - Apple Mail (macOS, iOS)
   - Yahoo Mail
   - Use services like Litmus or Email on Acid for comprehensive testing

5. **Mobile Responsive**: Keep max-width around 600px for desktop, use responsive font sizes, and test on mobile devices.

6. **Dark Mode**: Consider adding dark mode support with appropriate color schemes.

7. **Accessibility**:
   - Use semantic HTML components (Heading vs div)
   - Always include `alt` text for images
   - Ensure sufficient color contrast
   - Use clear, descriptive link text

8. **Plain Text Version**: Always provide a plain text version for email clients that don't support HTML.

9. **File Size**: Keep total email size under 102KB to avoid Gmail clipping.

10. **Unsubscribe Links**: Include unsubscribe links for marketing emails (legal requirement in many jurisdictions).

## Common Patterns

### Password Reset Email

```tsx
import { Html, Body, Container, Heading, Text, Button, Hr } from '@react-email/components';

interface PasswordResetProps {
  resetUrl: string;
  email: string;
}

export default function PasswordReset({ resetUrl, email }: PasswordResetProps) {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset Your Password</Heading>
          <Text style={text}>
            A password reset was requested for your account: {email}
          </Text>
          <Text style={text}>
            Click the button below to reset your password. This link expires in 1 hour.
          </Text>
          <Button href={resetUrl} style={button}>
            Reset Password
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn't request this, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' };
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#333' };
const text = { fontSize: '16px', lineHeight: '26px', color: '#333' };
const button = {
  backgroundColor: '#dc3545',
  color: '#fff',
  padding: '12px 20px',
  borderRadius: '4px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  margin: '20px 0'
};
const hr = { borderColor: '#e6ebf1', margin: '20px 0' };
const footer = { fontSize: '14px', color: '#8898aa' };
```

### Order Confirmation with Multi-Column Layout

```tsx
import { Html, Body, Container, Section, Row, Column, Heading, Text, Img, Hr } from '@react-email/components';

interface OrderConfirmationProps {
  orderNumber: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
}

export default function OrderConfirmation({ orderNumber, items, total }: OrderConfirmationProps) {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmation</Heading>
          <Text style={text}>Order #{orderNumber}</Text>

          {items.map((item, index) => (
            <Section key={index}>
              <Row>
                <Column style={{ width: '64px' }}>
                  <Img src={item.image} alt={item.name} width="64" height="64" />
                </Column>
                <Column>
                  <Text style={productName}>{item.name}</Text>
                  <Text style={productDetails}>
                    Quantity: {item.quantity} × ${item.price}
                  </Text>
                </Column>
              </Row>
              <Hr style={hr} />
            </Section>
          ))}

          <Text style={total}>Total: ${total.toFixed(2)}</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '20px', maxWidth: '600px' };
const h1 = { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' };
const text = { fontSize: '16px', color: '#333', marginBottom: '10px' };
const productName = { fontSize: '16px', fontWeight: 'bold', margin: '0' };
const productDetails = { fontSize: '14px', color: '#666', margin: '4px 0 0 0' };
const hr = { borderColor: '#e6ebf1', margin: '16px 0' };
const total = { fontSize: '20px', fontWeight: 'bold', textAlign: 'right' as const };
```

### Notification Email with Code Block

```tsx
import { Html, Body, Container, Heading, Text, CodeBlock, dracula } from '@react-email/components';

interface NotificationProps {
  title: string;
  message: string;
  logData?: string;
}

export default function Notification({ title, message, logData }: NotificationProps) {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>{message}</Text>

          {logData && (
            <>
              <Text style={text}>Log details:</Text>
              <CodeBlock
                code={logData}
                language="json"
                theme={dracula}
                lineNumbers
              />
            </>
          )}
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' };
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '600px' };
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#333' };
const text = { fontSize: '16px', lineHeight: '26px', color: '#333', marginBottom: '16px' };
```

## Additional Resources

- [React Email Documentation](https://react.email)
- [React Email GitHub](https://github.com/resend/react-email)
- [Resend Documentation](https://resend.com/docs)
- [Email Client CSS Support](https://www.caniemail.com)
- [React Email Examples](https://github.com/resend/react-email/tree/main/examples)
