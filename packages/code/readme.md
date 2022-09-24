![React Email code cover](https://react-email-assets.vercel.app/code.png)

<div align="center"><strong>@react-email/code</strong></div>
<div align="center">A block of code to be rendered in your email.</div>
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
yarn add @react-email/code -E
```

#### With npm

```sh
npm install @react-email/code -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Container } from '@react-email/container';
import { Code } from '@react-email/code';

const Email = () => {
  return (
    <Container>
      <Code style={{ color: '#000' }}>const foo = 'bar';</Code>
    </Container>
  );
};
```

## License

MIT License
