![React Email container cover](https://react.email/static/covers/container.png)

<div align="center"><strong>@react-email/container</strong></div>
<div align="center">A layout component that centers all the email content.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://github.com/resendlabs/react-email">GitHub</a> 
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

## Install

Install component from your command line.

#### With yarn

```sh
yarn add @react-email/container -E
```

#### With npm

```sh
npm install @react-email/container -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";

const Email = () => {
  return (
    <Container>
      <Button href="https://example.com" style={{ color: "#61dafb" }}>
        Click me
      </Button>
    </Container>
  );
};
```

## License

MIT License
