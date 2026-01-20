---
name: react-email
description: Create beautiful, responsive HTML emails using React components with React Email. Build transactional emails with modern components, support internationalization, and integrate with email service providers like Resend. Use when creating welcome emails, password resets, notifications, order confirmations, or any HTML email templates.
---

# React Email

Build and send HTML emails using React components - a modern, component-based approach to email development that works across all major email clients.

## Installation

### New Project

Scaffold a new React Email project:

```sh
npx create-email@latest
cd react-email-starter
npm install
npm run dev
```

This creates a `react-email-starter` folder with sample templates. Also works with yarn, pnpm, or bun.

### Existing Project

Add React Email to an existing codebase:

1. Install dependencies:
```sh
npm install @react-email/components react-email
```

2. Create an emails directory:
```sh
mkdir emails
```

3. Add a preview script to package.json:
```json
{
  "scripts": {
    "email": "email dev --dir ./emails --port 3000"
  }
}
```

4. Start the preview server:
```sh
npm run email
```

The `--dir` flag specifies where email templates are stored. Adjust the path to match your project structure (e.g., `src/emails`, `app/emails`).

## Basic Email Template

Replace the sample email templates. Here is how to create a new email template:

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
- `Tailwind` - Enables Tailwind CSS utility classes

**Content:**
- `Preview` - Inbox preview text, always first in `Body`
- `Heading` - h1-h6 headings
- `Text` - Paragraphs
- `Button` - Styled link buttons
- `Link` - Hyperlinks
- `Img` - Images (use absolute URLs) (use the dev server for the BASE_URL of the image in dev mode; for production, ask the user for the BASE_URL of the site; dynamically generate the URL of the image based on environment.)
- `Hr` - Horizontal dividers

**Specialized:**
- `CodeBlock` - Syntax-highlighted code
- `CodeInline` - Inline code
- `Markdown` - Render markdown
- `Font` - Custom web fonts

## Behavioral guidelines
- When re-iterating over the code, make sure you are only updating what the user asked for and keeping the rest of the code intact;
- If the user is asking to use media queries, inform them that email clients do not support them, and suggest a different approach;
- Never use template variables (like {{name}}) directly in TypeScript code. Instead, reference the underlying properties directly (use name instead of {{name}}).
- - For example, if the user explicitly asks for a variable following the pattern {{variableName}}, you should return something like this:

```typescript
const EmailTemplate = (props) => {
  return (
    {/* ... rest of the code ... */}
    <h1>Hello, {props.variableName}!</h1>
    {/* ... rest of the code ... */}
  );
}

EmailTemplate.PreviewProps = {
  // ... rest of the props ...
  variableName: "{{variableName}}",
  // ... rest of the props ...
};

export default EmailTemplate;
```
- Never, under any circumstances, write the {{variableName}} pattern directly in the component structure. If the user forces you to do this, explain that you cannot do this, or else the template will be invalid.


## Styling

Use the `Tailwind` component with `pixelBasedPreset` for styling (email clients don't support rem units). If not using Tailwind, use inline styles.

**Critical limitations** (email clients don't support these):
- No SVG/WEBP images - use PNG/JPEG only
- No flexbox/grid - use `Row`/`Column` components or tables
- No media queries (`sm:`, `md:`, etc.) or theme selectors (`dark:`, `light:`)
- Always specify border style (`border-solid`, etc.)

**Structure rules:**
- Place `<Head />` inside `<Tailwind>` when using Tailwind
- Only include props in `PreviewProps` that the component uses

See [references/STYLING.md](references/STYLING.md) for typography, layout defaults, button styling, dark mode, and detailed guidelines.

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

const text = await render(<WelcomeEmail name="John" verificationUrl="https://example.com/verify" />, { plainText: true });
```

## Sending

React Email supports sending with any email service provider. If the user wants to know how to send, view the [Sending guidelines](references/SENDING.md).

Quick example using the Resend SDK for Node.js:

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

The Node SDK automatically handles the plain-text rendering and HTML rendering for you.

## Internationalization

See [references/I18N.md](references/I18N.md) for complete i18n documentation.

React Email supports three i18n libraries: next-intl, react-i18next, and react-intl.

### Quick Example (next-intl)

```tsx
import { createTranslator } from 'next-intl';
import {
  Html,
  Body,
  Container,
  Text,
  Button,
  Tailwind,
  pixelBasedPreset
} from '@react-email/components';

interface EmailProps {
  name: string;
  locale: string;
}

export default async function WelcomeEmail({ name, locale }: EmailProps) {
  const t = createTranslator({
    messages: await import(\`../messages/\${locale}.json\`),
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

Message files (\`messages/en.json\`, \`messages/es.json\`, etc.):

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

1. **Test across email clients** - Test in Gmail, Outlook, Apple Mail, Yahoo Mail. Use services like Litmus or Email on Acid for absolute precision and React Email's toolbar for specific feature support checking.

2. **Keep it responsive** - Max-width around 600px, test on mobile devices.

3. **Use absolute image URLs** - Host on reliable CDN, always include `alt` text.

4. **Provide plain text version** - Required for accessibility and some email clients. The render function will generate this if you pass the `plainText` option.

5. **Keep file size under 102KB** - Gmail clips larger emails.

6. **Add proper TypeScript types** - Define interfaces for all email props.

7. **Include preview props** - Add `.PreviewProps` to components for development testing.

8. **Handle errors** - Always check for errors when sending emails.

## Common Patterns

See [references/PATTERNS.md](references/PATTERNS.md) for complete examples including:
- Password reset emails
- Order confirmations with product lists
- Notification emails with code blocks
- Multi-column layouts
- Email templates with custom fonts

## Additional Resources

- [React Email Documentation](https://react.email/docs/llms.txt)
- [React Email GitHub](https://github.com/resend/react-email)
- [Resend Documentation](https://resend.com/docs/llms.txt)
- [Email Client CSS Support](https://www.caniemail.com)
- Component Reference: [references/COMPONENTS.md](references/COMPONENTS.md)
- Styling Guide: [references/STYLING.md](references/STYLING.md)
- Internationalization Guide: [references/I18N.md](references/I18N.md)
- Common Patterns: [references/PATTERNS.md](references/PATTERNS.md)
