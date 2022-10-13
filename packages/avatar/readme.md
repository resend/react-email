![React Email avatar cover](https://react.email/static/images/readme/covers/avatar.png)

<div align="center"><strong>@react-email/avatar</strong></div>
<div align="center">Displays a profile picture or a fallback to the user initials.</div>
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
yarn add @react-email/avatar -E
```

#### With npm

```sh
npm install @react-email/avatar -E
```

## Getting started

Add the component to your email template. Include styles where needed.

Avatar

```jsx
import { Avatar, AvatarImage, AvatarFallback } from '@react-email/avatar';

const Email = () => {
  return (
    <Avatar>
      <AvatarImage src="cat.jpg" />
      <AvatarFallback>My Cat</AvatarFallback>
    </Avatar>
  );
};
```

## Props

| Name | Type   | Default | Description           |
| ---- | ------ | ------- | --------------------- |
| src  | string |         | The path to the image |

## Support

This component was tested using the most popular email clients.

| <img src="https://react.email/static/images/readme/icons/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://react.email/static/images/readme/icons/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://react.email/static/images/readme/icons/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://react.email/static/images/readme/icons/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://react.email/static/images/readme/icons/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://react.email/static/images/readme/icons/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
| ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Gmail ✔                                                                                                          | Apple Mail ✔                                                                                                          | Outlook ✔                                                                                                            | Yahoo! Mail ✔                                                                                                               | HEY ✔                                                                                                        | Superhuman ✔                                                                                                               |

## License

MIT License
