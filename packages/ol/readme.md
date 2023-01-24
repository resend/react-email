![React Email li cover](https://react.email/static/covers/ol.png)

<div align="center"><strong>@react-email/li</strong></div>
<div align="center">An ordered list generated.</div>
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
yarn add @react-email/lo -E
```

#### With npm

```sh
npm install @react-email/li -E
```

## Getting started

Add the component to your email template. Include styles where needed. This component is to be used inside the `Ul` or `Ol` elements.

```jsx
import { Ol } from '@react-email/ol';
import { Ul } from '@react-email/ul';

import { Li } from '@react-email/li';

const OrderedList = () => {
  return (
    <Ol>
      <Li>Lorem ipsum</Li>
    </Ol>
  );
};

const UnOrderedList = () => {
  return (
    <Ul>
      <Li>Lorem ipsum</Li>
    </Ul>
  );
};
```

## Support

This component was tested using the most popular email clients.

| <img src="https://react.email/static/icons/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://react.email/static/icons/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://react.email/static/icons/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://react.email/static/icons/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://react.email/static/icons/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://react.email/static/icons/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Gmail ✔                                                                                            | Apple Mail ✔                                                                                            | Outlook ✔                                                                                              | Yahoo! Mail ✔                                                                                                 | HEY ✔                                                                                          | Superhuman ✔                                                                                                 |

## License

MIT License
