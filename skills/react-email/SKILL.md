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
        <Body className="bg-gray-100 font-sans">
        <Preview>Welcome - Verify your email</Preview>
          <Container className="max-w-xl mx-auto p-5">
            <Heading className="text-2xl text-gray-800">
              Welcome!
            </Heading>
            <Text className="text-base text-gray-800">
              Hi {name}, thanks for signing up!
            </Text>
            <Button
              href={verificationUrl}
              className="bg-brand text-white px-5 py-3 rounded block text-center no-underline box-border"
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
- `Row` & `Column` - Multi-column layouts (table-based, won't stack on mobile)
- `Tailwind` - Enables Tailwind CSS utility classes

**Content:**
- `Preview` - Inbox preview text, place immediately after `Body` opening tag
- `Heading` - h1-h6 headings
- `Text` - Paragraphs
- `Button` - Styled link buttons
- `Link` - Hyperlinks
- `Img` - Images (use absolute URLs; copy local images to `/emails/static/` and use dev server BASE_URL in dev, ask user for production BASE_URL)
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

See [references/STYLING.md](references/STYLING.md) for complete styling documentation, including shared Tailwind config patterns for multiple templates.

**Key rules:**
- Use `pixelBasedPreset` - email clients don't support `rem` units
- Never use flexbox/grid - use `Row`/`Column` components
- Never use SVG/WEBP images - use PNG/JPEG only
- Never use media queries (`sm:`, `md:`) or theme selectors (`dark:`)
- Always specify border type (`border-solid`, `border-dashed`)
- Always use `box-border` on buttons

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

See [references/I18N.md](references/I18N.md) for complete i18n documentation with examples for next-intl, react-i18next, and react-intl.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using flexbox/grid | Use `Row` and `Column` components or tables |
| Using `rem` units | Use `pixelBasedPreset` with Tailwind |
| Using SVG images | Use PNG or JPG instead |
| Using media queries (sm:, md:) | Design mobile-first with stacked layouts |
| Template vars in JSX (`{{name}}`) | Use props: `{props.name}` |
| Missing border type | Always specify: `border-solid`, `border-dashed`, etc. |
| Fixed image dimensions on content images | Use responsive: `w-full h-auto` (fixed OK for small icons) |
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
