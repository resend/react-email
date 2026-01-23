---
name: react-email
description: Use when creating email templates with React - welcome emails, password resets, notifications, order confirmations, or transactional emails that need to render across email clients.
---

# React Email

## Overview

Build and send HTML emails using React components. A modern, component-based approach to email development that works across all major email clients by compiling to compatible HTML.

## When to Use

- Creating transactional emails (welcome, password reset, order confirmation)
- Building notification or marketing email templates
- Need consistent rendering across Gmail, Outlook, Apple Mail, Yahoo
- Want component reusability and TypeScript support in emails
- Integrating with email providers like Resend, SendGrid, Postmark

**When NOT to use:**
- Simple plain-text emails
- Emails that don't need cross-client compatibility
- Projects without React/Node.js

## Installation

Scaffold a new React Email project:

```sh
npx create-email@latest
```

Equivalent commands: `yarn create email`, `pnpm create email`, `bun create email`

Then install dependencies and start the dev server:

```sh
cd react-email-starter
npm install
npm run dev
```

The server runs at localhost:3000 with a preview interface for templates in the `emails` folder.

### Adding to an Existing Project

Add dependencies to run the email server:

```bash
npm install react-email @react-email/preview-server -D -E
npm install @react-email/components react react-dom -E
```

Add a script to your package.json:

```json
{
  "scripts": {
    "email:dev": "email dev"
  }
}
```

If the emails are in a different folder, you can specify the directory:

```json
{
  "scripts": {
    "email:dev": "email dev --dir src/emails"
  }
}
```

Ensure tsconfig.json includes proper JSX support.

## Basic Email Template

Create an email component with proper structure using the Tailwind component for styling:

```tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Tailwind,
  pixelBasedPreset
} from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
  verificationUrl: string;
}

export default function WelcomeEmail({ name, verificationUrl }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: '#007bff',
              },
            },
          },
        }}
      >
        <Head />
        <Preview>Welcome - Verify your email</Preview>
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-xl mx-auto p-5">
            <Heading className="text-2xl text-gray-800">
              Welcome!
            </Heading>
            <Text className="text-base text-gray-800">
              Hi {name}, thanks for signing up!
            </Text>
            <Button
              href={verificationUrl}
              className="bg-brand text-white px-5 py-3 rounded block text-center no-underline"
            >
              Verify Email
            </Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

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
- `Tailwind` - Enables Tailwind CSS utility classes

**Content:**
- `Preview` - Inbox preview text, always first in `Body`
- `Heading` - h1-h6 headings
- `Text` - Paragraphs
- `Button` - Styled link buttons
- `Link` - Hyperlinks
- `Img` - Images (use absolute URLs; use dev server BASE_URL in dev, ask user for production BASE_URL)
- `Hr` - Horizontal dividers

**Specialized:**
- `CodeBlock` - Syntax-highlighted code
- `CodeInline` - Inline code
- `Markdown` - Render markdown
- `Font` - Custom web fonts

## Behavioral Guidelines

- When re-iterating over code, only update what the user asked for
- If the user asks for media queries, inform them email clients don't support them and suggest alternatives
- Never use template variables (like `{{name}}`) directly in TypeScript code - reference props directly

For example, if the user explicitly asks for a variable following the pattern `{{variableName}}`:

```typescript
const EmailTemplate = (props) => {
  return (
    <h1>Hello, {props.variableName}!</h1>
  );
}

EmailTemplate.PreviewProps = {
  variableName: "{{variableName}}",
};

export default EmailTemplate;
```

Never write the `{{variableName}}` pattern directly in the component structure - explain this makes the template invalid.

## Styling

Use the Tailwind component if the user's project uses Tailwind CSS. Otherwise, use inline styles.

**Key rules:**
- Use `pixelBasedPreset` - email clients don't support `rem` units
- Never use flexbox or grid - use table-based layouts (Row/Column components)
- Each component must use inline styles or utility classes

### Email Client Limitations

- **Never use** SVG or WEBP - rendering issues across clients
- **Never use** flexbox - use Row/Column components or tables
- **Never use** CSS media queries (sm:, md:, lg:, xl:) - not supported
- **Never use** theme selectors (dark:, light:) - not supported
- **Always specify** border type (border-solid, border-dashed, etc.)
- **When defining** borders for one side, reset others (e.g., `border-none border-l`)

### Component Structure

- Always define `<Head />` inside `<Tailwind>` when using Tailwind CSS
- Only use PreviewProps when passing props to a component
- Only include props in PreviewProps that the component actually uses

```tsx
const Email = (props) => {
  return (
    <div>
      <a href={props.source}>Click here</a>
    </div>
  );
}

Email.PreviewProps = {
  source: "https://example.com",
};
```

### Default Structure

- Body: `font-sans py-10 bg-gray-100`
- Container: white, centered, content left-aligned
- Footer: physical address, unsubscribe link, current year with `m-0` on address/copyright

### Typography

- Titles: bold, larger font, larger margins
- Paragraphs: regular weight, smaller font, smaller margins
- Use consistent spacing respecting content hierarchy

### Images

- Only include if user requests
- Never use fixed width/height - use responsive units (w-full, h-auto)
- Never distort user-provided images
- Never create or use SVG images (they are not supported in email clients) - only use provided or web images

### Buttons

- Always use `box-border` to prevent padding overflow

### Layout

- Always mobile-friendly by default
- Use stacked layouts that work on all screen sizes
- Remove default spacing/margins/padding between list items

### Dark Mode

When requested: container black (#000), background dark gray (#151516)

### Using Tailwind Config in Templates

```tsx
import * as React from "react";
import tailwindConfig, { brandAssets } from './tailwind.config';
import { Tailwind, Img, Body, Container, Button } from '@react-email/components';

<Tailwind config={tailwindConfig}>
  <Body className="bg-gray-100 font-sans">
    <Container className="max-w-xl mx-auto bg-white p-6">
      <Img
        src={brandAssets.logo.src}
        alt={brandAssets.logo.alt}
        width={brandAssets.logo.width}
        className="mx-auto mb-6"
      />
      <Button className="bg-brand-primary text-white rounded px-5 py-3">
        Call to Action
      </Button>
    </Container>
  </Body>
</Tailwind>
```

### Asset Locations

Direct users to place brand assets in appropriate locations:

- **Logo and images**: Host on a CDN or public URL. For local development, place in `emails/static/`.
- **Custom fonts**: Use the `Font` component with a web font URL (Google Fonts, Adobe Fonts, or self-hosted).

**Example prompt for gathering brand info:**
> "Before I create your email template, I need some brand information to ensure consistency. Could you provide:
> 1. Your primary brand color (hex code, e.g., #007bff)
> 2. Your logo URL (must be a publicly accessible PNG or JPEG)
> 3. Any secondary colors you'd like to use
> 4. Style preference (modern/minimal or classic/traditional)"

## Rendering

### Convert to HTML

```tsx
import { render } from '@react-email/components';
import { WelcomeEmail } from './emails/welcome';

const html = await render(
  <WelcomeEmail name="John" verificationUrl="https://example.com/verify" />
);
```

### Convert to Plain Text

```tsx
import { render } from '@react-email/components';
import { WelcomeEmail } from './emails/welcome';

const text = await render(
  <WelcomeEmail name="John" verificationUrl="https://example.com/verify" />,
  { plainText: true }
);
```

## Sending

React Email supports any email service provider. See [references/SENDING.md](references/SENDING.md) for details.

Quick example using Resend:

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

Resend can receive a React component directly. If not included in the call, Resend will automatically include a plain-text version of the email.

## Internationalization

See [references/I18N.md](references/I18N.md) for complete i18n documentation.

Supports: next-intl, react-i18next, react-intl.

### Quick Example (next-intl)

```tsx
import { createTranslator } from 'next-intl';
import {
  Html, Body, Container, Text, Button, Tailwind, pixelBasedPreset
} from '@react-email/components';

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
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="bg-gray-100 font-sans">
          <Container className="max-w-xl mx-auto p-5">
            <Text className="text-base text-gray-800">{t('greeting')} {name},</Text>
            <Text className="text-base text-gray-800">{t('body')}</Text>
            <Button href="https://example.com" className="bg-blue-600 text-white px-5 py-3 rounded">
              {t('cta')}
            </Button>
          </Container>
        </Body>
      </Tailwind>
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

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using flexbox/grid | Use `Row` and `Column` components or tables |
| Using `rem` units | Use `pixelBasedPreset` with Tailwind |
| Using SVG images | Use PNG or JPG instead |
| Using media queries (sm:, md:) | Design mobile-first with stacked layouts |
| Template vars in JSX (`{{name}}`) | Use props: `{props.name}` |
| Missing border type | Always specify: `border-solid`, `border-dashed`, etc. |
| Fixed image dimensions | Use responsive: `w-full h-auto` |
| Emails over 102KB | Gmail clips larger emails - reduce size |

## Best Practices

1. **Test across clients** - Gmail, Outlook, Apple Mail, Yahoo. Use Litmus or Email on Acid for precision.
2. **Keep it responsive** - Max-width ~600px, test on mobile.
3. **Use absolute image URLs** - Host on reliable CDN, always include `alt` text. If local development, copy to `emails/static/`.
4. **Provide plain text version** - Required for accessibility.
5. **Add TypeScript types** - Define interfaces for all email props.
6. **Include PreviewProps** - For development testing.
7. **Handle errors** - Always check for errors when sending.
8. **Use verified domains** - For production `from` addresses.

## Additional Resources

- [React Email Documentation](https://react.email/docs/llms.txt)
- [React Email GitHub](https://github.com/resend/react-email)
- [Resend Documentation](https://resend.com/docs/llms.txt)
- [Email Client CSS Support](https://www.caniemail.com)
- Component Reference: [references/COMPONENTS.md](references/COMPONENTS.md)
- Internationalization Guide: [references/I18N.md](references/I18N.md)
- Common Patterns: [references/PATTERNS.md](references/PATTERNS.md)
- Sending Guide: [references/SENDING.md](references/SENDING.md)
