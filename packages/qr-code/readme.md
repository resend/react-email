---


<div align="center"><strong>@react-email/qr-code</strong></div>
<div align="center">A React component for rendering QR codes in emails.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<!-- <a href="https://react.email/qr-code">Documentation</a>  -->
<span> · </span>
<a href="https://twitter.com/reactemail">Twitter</a>
</div>

## Install

Install the component from your command line.

#### With yarn

```sh
yarn add @react-email/qr-code -E
```

#### With npm

```sh
npm install @react-email/qr-code -E
```

## Getting Started

Add the `QrCode` component to your email template. Configure it with the desired properties.

```jsx
import { QrCode } from "@react-email/qr-code";

const Email = () => {
  return (
    <QrCode 
      value="https://example.com"
      size={200}
      correctionLevel="L"
    />
  );
};
```

## Features

- **Customizable Size:** Adjust the size of the QR code to fit your design.
- **Flexible Rendering:** Choose between `canvas` and `svg` rendering.
- **Styling Options:** Customize background and foreground colors.
- **Error Correction:** Set the error correction level (L, M, H).
- **Optional Margin:** Include or exclude margin around the QR code.
- **Icon Support:** Embed a custom icon in the center of the QR code.

---

## `QrCode` Component Props
| Name               | Type                  | Default     | Required | Description |
|--------------------|-----------------------|-------------|----------|-------------|
| `value`            | string                |             | Yes      | A string that represents the data to be encoded in the QR code. Typically a URL or text. |
| `size`             | number                |             | Yes      | A number specifying the size of the QR code in pixels. Applies to both width and height. |
| `correctionLevel`  | Enum: 'L' \| 'M' \| 'H'                 |             | Yes      | A string that sets the error correction capability of the QR code. Accepts one of three values: `'L'` (Low), `'M'` (Medium), or `'H'` (High). Higher levels increase the QR code's resilience to damage but also increase its complexity. |
| `renderAs`         | `'canvas'` \| `'svg'` | `'canvas'`  | No       | Specifies the rendering mode of the QR code. Can be either `'canvas'` or `'svg'`. |
| `bgColor`          | string                | `'#FFFFFF'` | No       | Background color of the QR code. Accepts any valid CSS color string. |
| `fgColor`          | string                | `'#000000'` | No       | Foreground color of the QR code (i.e., the color of the pixels). Accepts any valid CSS color string. |
| `includeMargin`    | boolean               | `false`     | No       | A boolean that determines whether to include a margin around the QR code. |
| `iconSrc`          | string                |             | No       | URL of an icon to be placed in the center of the QR code. Optional. |
| `iconSize`         | number                |             | No       | Size of the icon in pixels. If not specified, it defaults to 1/10th of the `size` prop. |
| `iconBg`           | boolean               | `true`      | No       | A boolean that determines whether to include a background for the icon, masking parts of the QR code. |
| `style`            | `React.CSSProperties` |             | No       | An optional `React.CSSProperties` object to apply custom styles to the container of the QR code. |


### Example Usage

```jsx
<QrCode
  value="https://example.com"
  size={200}
  correctionLevel="M"
  bgColor="#FFFFFF"
  fgColor="#333333"
  includeMargin={true}
  iconSrc="https://example.com/icon.png"
  iconSize={40}
  iconBg={false}
  style={{ padding: "10px", backgroundColor: "#f0f0f0" }}
/>
```

This example creates a QR code with medium error correction level, with custom colors, margin, an icon, and additional styling.

---


## License

MIT License

