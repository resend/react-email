![React Email HTML cover](https://react-email-assets.vercel.app/html.png)

<div align="center"><strong>@react-email/html</strong></div>
<div align="center">A React html component to wrap emails.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://react.email">Documentation</a> 
<span> · </span>
<a href="https://react.email">Twitter</a>
</div>

## Install

Install component from your command line.

#### With yarn

```sh
yarn add @react-email/html -E
```

#### With npm

```sh
npm install @react-email/html -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Button } from '@react-email/button';
import { Html } from '@react-email/html';

const Email = () => {
  return (
    <Html lang="en">
      <Button href="https://example.com" style={{ color: '#61dafb' }}>
        Click me
      </Button>
    </Html>
  );
};
```

## License

MIT License
