# React Email Components Reference

Complete reference for all React Email components.

## Structural Components

### Html

Root wrapper for the email. Always use as the outermost component.

```jsx
import { Html } from '@react-email/components';

<Html lang="en" dir="ltr">
  {/* email content */}
</Html>
```

**Props:**
- `lang` - Language code (e.g., "en", "es", "fr")
- `dir` - Text direction ("ltr" or "rtl")

### Head

Contains meta elements, styles, and fonts.

```jsx
import { Head } from '@react-email/components';

<Head>
  <title>Email Title</title>
</Head>
```

### Body

Main email body wrapper.

```jsx
import { Body } from '@react-email/components';

<Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
  {/* email content */}
</Body>
```

### Container

Centers email content with max-width constraint.

```jsx
import { Container } from '@react-email/components';

<Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
  {/* centered content */}
</Container>
```

### Section

Layout section that can contain rows and columns.

```jsx
import { Section } from '@react-email/components';

<Section style={{ padding: '20px', backgroundColor: '#fff' }}>
  {/* section content */}
</Section>
```

### Row & Column

Multi-column layouts using table-based rendering.

```jsx
import { Row, Column } from '@react-email/components';

<Section>
  <Row>
    <Column style={{ width: '50%', padding: '10px' }}>
      Left column content
    </Column>
    <Column style={{ width: '50%', padding: '10px' }}>
      Right column content
    </Column>
  </Row>
</Section>
```

**Column widths:**
- Use percentage widths (e.g., "50%", "33.33%")
- Or fixed pixel widths (e.g., "200px")
- Total should add up to 100% or container width

## Content Components

### Preview

Preview text shown in email inbox before opening.

```jsx
import { Preview } from '@react-email/components';

<Preview>Welcome to our platform - Get started today!</Preview>
```

**Best practices:**
- Keep under 140 characters
- Make it compelling and action-oriented
- Place near the top of your email (after `<Head>`)

### Heading

Heading text (h1-h6).

```jsx
import { Heading } from '@react-email/components';

<Heading as="h1" style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
  Welcome to Acme
</Heading>

<Heading as="h2" style={{ fontSize: '20px', fontWeight: '600', color: '#666' }}>
  Getting Started
</Heading>
```

**Props:**
- `as` - HTML heading level ("h1" through "h6")

### Text

Paragraph text component.

```jsx
import { Text } from '@react-email/components';

<Text style={{ fontSize: '16px', lineHeight: '24px', color: '#333' }}>
  Your paragraph content here.
</Text>
```

### Button

Styled link that looks like a button.

```jsx
import { Button } from '@react-email/components';

<Button 
  href="https://example.com/verify"
  target="_blank"
  style={{ 
    backgroundColor: '#007bff', 
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block'
  }}
>
  Verify Email Address
</Button>
```

**Props:**
- `href` (required) - URL to link to
- `target` - Default is "_blank"

**Styling tips:**
- Always set `display: block` for full-width buttons
- Use `textAlign: center` for centered text
- Set explicit `backgroundColor` and `color`
- Add `textDecoration: none` to remove underline

### Link

Standard hyperlink.

```jsx
import { Link } from '@react-email/components';

<Link href="https://example.com" target="_blank" style={{ color: '#007bff' }}>
  Visit our website
</Link>
```

**Props:**
- `href` (required) - URL to link to
- `target` - Default is "_blank"

### Img

Image component.

```jsx
import { Img } from '@react-email/components';

<Img 
  src="https://example.com/logo.png" 
  alt="Company Logo"
  width="150"
  height="50"
  style={{ display: 'block', margin: '0 auto' }}
/>
```

**Props:**
- `src` (required) - Image URL (must be absolute)
- `alt` (required) - Alt text for accessibility
- `width` - Image width in pixels
- `height` - Image height in pixels

**Best practices:**
- Always use absolute URLs hosted on CDN
- Always include alt text
- Specify width and height to prevent layout shift
- Use `display: block` to avoid spacing issues

### Hr

Horizontal divider line.

```jsx
import { Hr } from '@react-email/components';

<Hr style={{ borderColor: '#e6e6e6', margin: '20px 0' }} />
```

## Specialized Components

### CodeBlock

Syntax-highlighted code blocks using Prism.js.

```jsx
import { CodeBlock, dracula } from '@react-email/components';

<CodeBlock
  code={`const greeting = "Hello World";
console.log(greeting);`}
  language="javascript"
  theme={dracula}
  lineNumbers
/>
```

**Props:**
- `code` (required) - Code string to display
- `language` (required) - Programming language (e.g., "javascript", "python", "typescript")
- `theme` - Prism theme (dracula, github, etc.)
- `lineNumbers` - Boolean to show line numbers

**Available themes:**
Import from `@react-email/components`: dracula, github, nord, etc.

### CodeInline

Inline code within text.

```jsx
import { CodeInline } from '@react-email/components';

<Text>
  Run <CodeInline>npm install</CodeInline> to get started.
</Text>
```

**Default styling:**
Provides monospace font with subtle background.

### Markdown

Render Markdown content as HTML.

```jsx
import { Markdown } from '@react-email/components';

<Markdown
  markdownCustomStyles={{
    h1: { color: '#333', fontSize: '24px' },
    h2: { color: '#666', fontSize: '20px' },
    p: { fontSize: '16px', lineHeight: '24px' },
    a: { color: '#007bff' },
    code: { backgroundColor: '#f4f4f4', padding: '2px 4px' }
  }}
  markdownContainerStyles={{
    padding: '20px',
    backgroundColor: '#fff'
  }}
>
{`# Hello World

This is **bold** and this is *italic*.

- List item 1
- List item 2

[Link text](https://example.com)

\`inline code\`

\`\`\`javascript
const code = "block";
\`\`\`
`}
</Markdown>
```

**Props:**
- `children` (required) - Markdown string
- `markdownCustomStyles` - Style overrides for HTML elements
- `markdownContainerStyles` - Styles for container div

### Font

Custom web fonts.

```jsx
import { Font } from '@react-email/components';

<Head>
  <Font
    fontFamily="Roboto"
    fallbackFontFamily="Arial, sans-serif"
    webFont={{
      url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
      format: "woff2"
    }}
  />
</Head>
```

**Props:**
- `fontFamily` (required) - Font family name
- `fallbackFontFamily` - Fallback fonts
- `webFont` - Object with `url` and `format`

**Supported formats:**
- woff2 (recommended)
- woff
- truetype
- opentype

### Tailwind

Use Tailwind CSS utility classes.

```jsx
import { Tailwind } from '@react-email/components';

<Tailwind
  config={{
    theme: {
      extend: {
        colors: {
          brand: '#007bff',
          accent: '#28a745'
        },
        spacing: {
          '128': '32rem'
        }
      }
    }
  }}
>
  <Container className="max-w-2xl mx-auto p-4">
    <Heading className="text-2xl font-bold text-brand mb-4">
      Welcome!
    </Heading>
    <Text className="text-base text-gray-700 mb-4">
      Your content here.
    </Text>
    <Button className="bg-brand text-white px-6 py-3 rounded-lg">
      Get Started
    </Button>
  </Container>
</Tailwind>
```

**Props:**
- `config` - Tailwind configuration object

**How it works:**
- Tailwind classes are converted to inline styles automatically
- Media queries are extracted to `<style>` tag in `<head>`
- CSS variables are resolved
- RGB color syntax is normalized for email client compatibility

**Best practices:**
- Wrap your entire email content in `<Tailwind>`
- Custom config is optional - defaults work well
- All Tailwind utilities are supported
- Responsive classes (sm:, md:, lg:) work via media queries
