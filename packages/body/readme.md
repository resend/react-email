![React Email HTML cover](https://react.email/static/covers/html.png)

<div align="center"><strong>@react-email/body</strong></div>
<div align="center">A React body component to wrap emails.</div>
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
yarn add @react-email/body -E
```

#### With npm

```sh
npm install @react-email/body -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Html } from "@react-email/html";
import { Body } from "@react-email/body";
import { Section } from "@react-email/section";
import { Column } from "@react-email/section";

const Email = () => {
  return (
    <Html lang="en">
      <Body style={{ backgroundColor: "#61dafb" }}>
        <Section>
          <Column style={{ width: "50%" }}>{/* First column */}</Column>
          <Column style={{ width: "50%" }}>{/* Second column */}</Column>
        </Section>
      </Body>
    </Html>
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
