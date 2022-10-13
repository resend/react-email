![React Email link cover](https://react.email/static/images/readme/covers/link.png)

<div align="center"><strong>@react-email/link</strong></div>
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
yarn add @react-email/link -E
```

#### With npm

```sh
npm install @react-email/link -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Link } from '@react-email/link';

const Email = () => {
  return <Link href="https://example.com">Example</Link>;
};
```

## Props

| Name   | Type   | Default  | Description                                      |
| ------ | ------ | -------- | ------------------------------------------------ |
| href   | string |          | Link to be triggered when the button is clicked  |
| target | string | `_blank` | Specify the target attribute for the button link |

## Support

This component was tested using the most popular email clients.

| <img src="https://react.email/static/images/readme/icons/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://react.email/static/images/readme/icons/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://react.email/static/images/readme/icons/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://react.email/static/images/readme/icons/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://react.email/static/images/readme/icons/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://react.email/static/images/readme/icons/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Gmail ✔                                                                                             | Apple Mail ✔                                                                                             | Outlook ✔                                                                                               | Yahoo! Mail ✔                                                                                                  | HEY ✔                                                                                           | Superhuman ✔                                                                                                  |

## License

MIT License
