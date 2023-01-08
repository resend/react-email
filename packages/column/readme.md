![React Email Column cover](https://react.email/static/covers/column.png)

<div align="center"><strong>@react-email/column</strong></div>
<div align="center">Display a column that separates content areas vertically in your email.</div>
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
yarn add @react-email/column -E
```

#### With npm

```sh
npm install @react-email/column -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Section } from '@react-email/section';
import { Column } from '@react-email/column';

const Email = () => {
  return(
    <Section>
      <Column>A<Column/>
      <Column>B<Column/>
      <Column>C<Column/>
    </Section>
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
