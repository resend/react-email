![React Email img cover](https://react-email-assets.vercel.app/a.png)

<div align="center"><strong>@react-email/a</strong></div>
<div align="center">A hyperlink to web pages, files, email addresses, or anything else a URL can address.</div>
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
yarn add @react-email/a -E
```

#### With npm

```sh
npm install @react-email/a -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { A } from '@react-email/a';

const Email = () => {
  return (
    <A href="https://example.com">Example</A>
  );
};
```

## Props

| Name   | Type   | Default  | Description |
| --     | --     | --       | --          |
| href   | string |          | Link to be triggered when the button is clicked |
| target | string | `_blank` | Specify the target attribute for the button link	 |

## License

MIT License
