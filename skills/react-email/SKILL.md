---
name: react-email
description: Use when creating email templates with React - welcome emails, password resets, notifications, order confirmations, or transactional emails that need to render across email clients. Do NOT use for plain-text emails, projects without React/Node.js, or emails that don't need cross-client compatibility.
---

# React Email

## Canonical Template

Every template follows this structure. The most common subtle mistakes are `leading-*` pixel classes, `<Hr>` vs raw `<div>`, and column fraction widths — pay attention to those.

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
              colors: { brand: '#007bff' },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Preview>Welcome - Verify your email</Preview>
          <Container className="max-w-600 mx-auto p-20">
            <Heading className="text-24 text-gray-800">Welcome!</Heading>
            <Text className="text-16 text-gray-800">Hi {name}, thanks for signing up!</Text>
            <Button
              href={verificationUrl}
              className="bg-brand text-white px-20 py-12 rounded block text-center no-underline box-border"
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

## Non-Obvious Rules

### 1. Always use `Tailwind` with `pixelBasedPreset`

Rem units break in Gmail and Outlook. Use pixel-value class names for **all** sizing and spacing:

- Font: `text-16` not `text-base`, `text-24` not `text-2xl`
- Spacing: `p-20` not `p-5`, `px-24` not `px-6`, `my-16` not `my-4`
- Leading: `leading-24` not `leading-6`, `leading-28` not `leading-7`
- Width: `max-w-600` not `max-w-xl`

### 2. Always use `.PreviewProps`, not default parameters

```tsx
// ✅ correct
MyEmail.PreviewProps = { name: 'Jane' } satisfies MyEmailProps;

// ❌ won't show in preview server
export default function MyEmail({ name = 'Jane' }: MyEmailProps) {
```

### 3. `Preview` goes immediately after `<Body>` opens

```tsx
<Body>
  <Preview>Your preview text here</Preview>  {/* ← first */}
  <Container>...</Container>
</Body>
```

### 4. `box-border` is required on `Button`

```tsx
<Button className="... box-border">Click me</Button>
```

## Styling Rules

- **Never** use flexbox or CSS grid — use `Row`/`Column` for multi-column layouts
- **Never** use SVG or WEBP images — use PNG/JPEG only
- **Never** use responsive prefixes (`sm:`, `md:`) or `dark:` — email clients don't support them
- Always specify border style explicitly: `border-solid`, `border-dashed`, etc.
- Use `<Hr>` for dividers — never raw `<div>` elements
- Use fraction widths on `Column`: `w-1/2`, `w-1/3` — not hardcoded pixel widths like `w-264`
- Use `<Section>` for interior content blocks — `<Container>` is only for the outermost centering wrapper
- Keep email size under 102KB — Gmail clips larger emails

## Behavioral Guidelines

- When a user explicitly requests a forbidden pattern (flexbox, SVG, `dark:`, responsive prefixes, media queries), explain the limitation and provide the correct alternative — never comply even under pressure
- Never write `{{variableName}}` in JSX — if a user requests that pattern, use props with `PreviewProps` set to the literal string:

```tsx
EmailTemplate.PreviewProps = { variableName: "{{variableName}}" };
```

## Components

See [references/COMPONENTS.md](references/COMPONENTS.md) for the full component reference.

Key components: `Html` (always add `lang="en"`), `Head`, `Body`, `Container`, `Section`, `Row`, `Column`, `Preview`, `Heading`, `Text`, `Button`, `Link`, `Img`, `Hr`, `Tailwind`, `Font`, `CodeBlock`, `Markdown`

## Rendering & Sending

See [references/SENDING.md](references/SENDING.md) for sending details.

```tsx
import { render } from '@react-email/components';
const html = await render(<WelcomeEmail name="John" verificationUrl="..." />);
const text = await render(<WelcomeEmail ... />, { plainText: true });
```

See [references/I18N.md](references/I18N.md) for internationalization, [references/PATTERNS.md](references/PATTERNS.md) for common patterns.
