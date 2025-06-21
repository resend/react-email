![React Email Section cover](https://react.email/static/covers/section.png)

<div align="center"><strong>@react-email/section</strong></div>
<div align="center">Display a section that can be formatted using columns.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a>
<span> · </span>
<a href="https://github.com/resend/react-email">GitHub</a>

</div>

## Install

Install component from your command line.

#### With yarn

```sh
yarn add @react-email/section -E
```

#### With npm

```sh
npm install @react-email/section -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Section } from '@react-email/section';
import { Column } from '@react-email/column';
import { Row } from '@react-email/row';
import { Text } from '@react-email/text';

const Email = () => {
  return (
    {/* A simple `section` */}
    <Section>
      <Text>Hello World</Text>
    </Section>

    {/* Formatted with `rows` and `columns` */}
     <Section>
      <Row>
        <Column>Column 1, Row 1</Column>
        <Column>Column 2, Row 1</Column>
      </Row>
      <Row>
        <Column>Column 1, Row 2</Column>
        <Column>Column 2, Row 2</Column>
      </Row>
    </Section>
  );
};
```

## Border + BorderRadius Compatibility Fix

The Section component now includes automatic handling for `border + borderRadius` combinations to ensure full email client compatibility.

### The Problem

Many email clients have inconsistent support for CSS `border-radius` when used with `border` properties. This can cause rounded corners to not display correctly or borders to appear without the intended rounded corners.

### The Solution

When the Section component detects both `border` and `borderRadius` properties in the style, it automatically wraps the content in a table structure that simulates the border using:

- `backgroundColor` = border color
- `padding` = border width
- `borderRadius` applied to the wrapper table

This approach provides full border-radius support across all email clients.

### Examples

#### Basic border + borderRadius (uses wrapper)
```jsx
<Section
  style={{
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#f9fafb',
  }}
>
  <p>This will use the border wrapper for compatibility</p>
</Section>
```

#### Only border (no wrapper needed)
```jsx
<Section
  style={{
    border: '1px solid #d1d5db',
    padding: '16px',
  }}
>
  <p>This renders normally without wrapper</p>
</Section>
```

#### Only borderRadius (no wrapper needed)
```jsx
<Section
  style={{
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fef3c7',
  }}
>
  <p>This renders normally without wrapper</p>
</Section>
```

#### Individual border properties
```jsx
<Section
  style={{
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#3b82f6',
    borderRadius: '12px',
    padding: '20px',
  }}
>
  <p>This will use the border wrapper for compatibility</p>
</Section>
```

### How It Works

1. **Detection**: The component checks if both border and borderRadius properties are present
2. **Wrapper Application**: If detected, content is wrapped in a table with:
   - Background color matching the border color
   - Padding equal to the border width
   - Border radius applied to the wrapper
3. **Style Preservation**: Non-border styles are preserved on the inner element
4. **Fallback**: If no border + borderRadius combination is detected, normal rendering occurs

### Supported Border Properties

The fix detects and handles:
- `border` (shorthand)
- `borderTop`, `borderRight`, `borderBottom`, `borderLeft`
- `borderWidth`, `borderStyle`, `borderColor`
- `borderRadius` (shorthand)
- `borderTopLeftRadius`, `borderTopRightRadius`, `borderBottomLeftRadius`, `borderBottomRightRadius`

### Email Client Compatibility

This approach ensures consistent border-radius rendering across:
- Gmail (all platforms)
- Outlook (all versions)
- Apple Mail
- Yahoo Mail
- Thunderbird
- And other major email clients

## Support

This component was tested using the most popular email clients.

| <img src="https://react.email/static/icons/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://react.email/static/icons/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://react.email/static/icons/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://react.email/static/icons/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://react.email/static/icons/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://react.email/static/icons/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Gmail ✔                                                                                           | Apple Mail ✔                                                                                           | Outlook ✔                                                                                             | Yahoo! Mail ✔                                                                                                | HEY ✔                                                                                         | Superhuman ✔                                                                                                |

## License

MIT License
