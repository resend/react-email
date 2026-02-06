![React Email Section cover](https://react.email/static/covers/section.png)

<div align="center"><strong>@react-email/columns</strong></div>
<div align="center">A multi-column layout component with equal or custom widths and optional gap.</div>
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
yarn add @react-email/columns -E
```

#### With npm

```sh
npm install @react-email/columns -E
```

## Getting started

Add the component inside a Section. Include styles where needed.

```jsx
import { Section } from '@react-email/section';
import { Columns } from '@react-email/columns';
import { Text } from '@react-email/text';

const Email = () => {
  return (
    <Section>
      <Columns gap={16}>
        <Text>Left column</Text>
        <Text>Right column</Text>
      </Columns>
    </Section>
  );
};
```

## Support

This component was tested using the most popular email clients.

| <img src="https://react.email/static/icons/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://react.email/static/icons/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://react.email/static/icons/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://react.email/static/icons/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://react.email/static/icons/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://react.email/static/icons/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Gmail ✔                                                                                           | Apple Mail ✔                                                                                           | Outlook ✔                                                                                             | Yahoo! Mail ✔                                                                                                | HEY ✔                                                                                         | Superhuman ✔                                                                                                |

## License

MIT License
