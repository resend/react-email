![React Email pre cover](https://react.email/static/images/readme/covers/pre.png)

<div align="center"><strong>@react-email/pre</strong></div>
<div align="center">A block of preformatted text in your email</div>
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
yarn add @react-email/pre -E
```

#### With npm

```sh
npm install @react-email/pre -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Html } from '@react-email/html';
import { Pre } from '@react-email/pre';

const Email = () => {
  return (
    <Html lang="en">
      <Pre>{'foo          bar'}</Pre>
    </Html>
  );
};
```

## License

MIT License
