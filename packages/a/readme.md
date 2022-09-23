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

## Support

This component was tested using the most popular email clients.

| <img src="https://react.email/static/images/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://react.email/static/images/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://react.email/static/images/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://react.email/static/images/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://react.email/static/images/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://react.email/static/images/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
|-----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| Gmail ✔                                                                                             | Apple Mail ✔                                                                                             | Outlook ✔                                                                                               | Yahoo! Mail ✔                                                                                                  | HEY ✔                                                                                           | Superhuman ✔                                                                                                  |

## License

MIT License
