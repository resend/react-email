![React Email button cover](https://react.email/static/covers/button.png)

<div align="center"><strong>@react-email/button</strong></div>
<div align="center">A link that is styled to look like a button.</div>
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
yarn add @react-email/button -E
```

#### With npm

```sh
npm install @react-email/button -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Button } from "@react-email/button";

const Email = () => {
  return (
    <Button href="https://example.com" style={{ color: "#61dafb" }}>
      Click me
    </Button>
  );
};
```

## Props

| Name   | Type   | Default  | Description                                      |
| ------ | ------ | -------- | ------------------------------------------------ |
| href   | string |          | Link to be triggered when the button is clicked  |
| target | string | `_blank` | Specify the target attribute for the button link |

## Support

This component was tested using the most popular email clients.

| <img src="https://react.email/static/icons/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://react.email/static/icons/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://react.email/static/icons/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://react.email/static/icons/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://react.email/static/icons/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://react.email/static/icons/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Gmail ✔                                                                                           | Apple Mail ✔                                                                                           | Outlook ✔                                                                                             | Yahoo! Mail ✔                                                                                                | HEY ✔                                                                                         | Superhuman ✔                                                                                                |

## License

MIT License
