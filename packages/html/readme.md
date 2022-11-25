![React Email HTML cover](https://assets.react.email/covers/html.png)

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

## Support

This component was tested using the most popular email clients.

| <img src="https://assets.react.email/icons/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://assets.react.email/icons/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://assets.react.email/icons/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://assets.react.email/icons/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://assets.react.email/icons/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://assets.react.email/icons/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Gmail ✔                                                                                            | Apple Mail ✔                                                                                            | Outlook ✔                                                                                              | Yahoo! Mail ✔                                                                                                 | HEY ✔                                                                                          | Superhuman ✔                                                                                                 |

## License

MIT License
