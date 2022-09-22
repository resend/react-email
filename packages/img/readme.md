![React Email img cover](https://react-email-assets.vercel.app/img.png)

<div align="center"><strong>@react-email/img</strong></div>
<div align="center">Display an image in your email.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://github.com/zenorocha/react-email">GitHub</a> 
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

## Install

Install component from your command line.

#### With yarn

```sh
yarn add @react-email/img -E
```

#### With npm

```sh
npm install @react-email/img -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Img } from '@react-email/img';

const Email = () => {
  return (
    <Img src="cat.jpg" alt="Cat" width="300" height="300" />
  );
};
```

## Props

| Name   | Type   | Default  | Description |
| --     | --     | --       | --          |
| alt    | string |          | Alternate description for an image |
| src    | string |          | The path to the image |
| width  | string |          | The width of an image in pixels |
| height | string |          | The height of an image in pixels |

## License

MIT License
