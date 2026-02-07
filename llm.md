# React Email Core Components API Documentation

## Component: Body
**Import:** `import { Body } from '@react-email/body'`
**Props:** `React.HtmlHTMLAttributes<HTMLBodyElement>`
**Description:** A React body component to wrap email content. Accepts all standard HTML body element attributes.

## Component: Button
**Import:** `import { Button } from '@react-email/button'`
**Props:** `React.ComponentPropsWithoutRef<'a'>`
**Description:** A button component that renders as an anchor tag with email-client-optimized styling. Includes MSO-specific padding handling for Outlook compatibility. Default target is '_blank'.

## Component: CodeBlock
**Import:** `import { CodeBlock } from '@react-email/code-block'`
**Props:** 
```typescript
interface CodeBlockProps extends React.ComponentPropsWithoutRef<'pre'> {
  lineNumbers?: boolean;
  fontFamily?: string;
  theme: Theme;
  language: PrismLanguage;
  code: string;
}
```
**Description:** Display code with syntax highlighting using Prism.js. Supports various programming languages and themes with optional line numbers.

## Component: CodeInline
**Import:** `import { CodeInline } from '@react-email/code-inline'`
**Props:** `React.ComponentPropsWithoutRef<'code'> & React.ComponentPropsWithoutRef<'span'>`
**Description:** Inline code component with special handling for Orange.fr email client. Requires meta tags in head for proper rendering.

## Component: Column
**Import:** `import { Column } from '@react-email/column'`
**Props:** `React.ComponentPropsWithoutRef<'td'>`
**Description:** A table cell component for creating email layouts. Renders as a `<td>` element with email-specific data attributes.

## Component: Container
**Import:** `import { Container } from '@react-email/container'`
**Props:** `React.ComponentPropsWithoutRef<'table'>`
**Description:** A centered container component with max-width of 37.5em. Renders as a table for email client compatibility.

## Component: Font
**Import:** `import { Font } from '@react-email/font'`
**Props:**
```typescript
interface FontProps {
  fontFamily: string;
  fallbackFontFamily: FallbackFont | FallbackFont[];
  webFont?: {
    url: string;
    format: FontFormat;
  };
  fontStyle?: FontStyle;
  fontWeight?: FontWeight;
}
```
**Description:** Font component for defining custom fonts. Must be placed inside `<head>` tag. Supports web fonts and fallback fonts with MSO compatibility.

## Component: Head
**Import:** `import { Head } from '@react-email/head'`
**Props:** `React.ComponentPropsWithoutRef<'head'>`
**Description:** HTML head component with default meta tags for email compatibility, including UTF-8 charset and Apple message reformatting prevention.

## Component: Heading
**Import:** `import { Heading } from '@react-email/heading'`
**Props:**
```typescript
type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  m?: number | string;
  mx?: number | string;
  my?: number | string;
  mt?: number | string;
  mr?: number | string;
  mb?: number | string;
  ml?: number | string;
} & React.ComponentPropsWithRef<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>
```
**Description:** Flexible heading component that can render as h1-h6 elements with margin utilities. Default is h1.

## Component: Hr
**Import:** `import { Hr } from '@react-email/hr'`
**Props:** `React.ComponentPropsWithoutRef<'hr'>`
**Description:** Horizontal rule component with email-optimized default styling (1px solid #eaeaea border).

## Component: Html
**Import:** `import { Html } from '@react-email/html'`
**Props:** `React.ComponentPropsWithoutRef<'html'>`
**Description:** HTML root component with default lang="en" and dir="ltr" attributes.

## Component: Img
**Import:** `import { Img } from '@react-email/img'`
**Props:** `React.ComponentPropsWithoutRef<'img'>`
**Description:** Image component with email-optimized default styles (display: block, no border, no outline).

## Component: Link
**Import:** `import { Link } from '@react-email/link'`
**Props:** `React.ComponentPropsWithoutRef<'a'>`
**Description:** Link component with default blue color (#067df7) and no text decoration. Default target is '_blank'.

## Component: Markdown
**Import:** `import { Markdown } from '@react-email/markdown'`
**Props:**
```typescript
interface MarkdownProps {
  children: string;
  markdownCustomStyles?: StylesType;
  markdownContainerStyles?: React.CSSProperties;
}
```
**Description:** Renders markdown content as HTML using md-to-react-email parser. Supports custom styling for markdown elements.

## Component: Preview
**Import:** `import { Preview } from '@react-email/preview'`
**Props:**
```typescript
interface PreviewProps extends React.ComponentPropsWithoutRef<'div'> {
  children: string | string[];
}
```
**Description:** Email preview text component (max 150 characters). Hidden in email body but shows in email client previews.

## Component: Row
**Import:** `import { Row } from '@react-email/row'`
**Props:** `React.ComponentPropsWithoutRef<'table'> & { children: React.ReactNode }`
**Description:** Table row component for email layouts. Renders as a table with a single row containing the children.

## Component: Section
**Import:** `import { Section } from '@react-email/section'`
**Props:** `React.ComponentPropsWithoutRef<'table'>`
**Description:** Section component that renders as a table for email client compatibility. Used for grouping content.

## Component: Text
**Import:** `import { Text } from '@react-email/text'`
**Props:** `React.ComponentPropsWithoutRef<'p'>`
**Description:** Paragraph component with default font size (14px), line height (24px), and margins (16px top/bottom).

## Key Features:
- All components are forwardRef-compatible
- Email client compatibility (especially Outlook/MSO)
- TypeScript support with proper prop types
- Optimized default styling for email rendering
- Consistent API patterns across components

## Usage Examples:

### Basic Email Structure
```tsx
import { Html, Head, Body, Container, Section, Text } from '@react-email/components';

export default function Email() {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Section>
            <Text>Hello World!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

### Button with Link
```tsx
import { Button } from '@react-email/button';

<Button href="https://example.com" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 24px' }}>
  Click me
</Button>
```

### Code Block with Syntax Highlighting
```tsx
import { CodeBlock } from '@react-email/code-block';
import { dracula } from '@react-email/code-block/themes';

<CodeBlock
  code="const hello = 'world';"
  language="javascript"
  theme={dracula}
  lineNumbers
/>
```

### Layout with Rows and Columns
```tsx
import { Row, Column } from '@react-email/components';

<Row>
  <Column style={{ width: '50%' }}>
    <Text>Left column</Text>
  </Column>
  <Column style={{ width: '50%' }}>
    <Text>Right column</Text>
  </Column>
</Row>
```
