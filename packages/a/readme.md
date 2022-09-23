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

| <img src="https://user-images.githubusercontent.com/398893/191876837-b18f9fe6-03d3-45b5-8e9a-b65f11e89c0d.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://user-images.githubusercontent.com/398893/191876835-8b7aac96-2828-417b-a42e-289ad10fe003.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://user-images.githubusercontent.com/398893/191876838-5fb588ca-7049-484a-a39e-b066cea0d4bf.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://user-images.githubusercontent.com/398893/191876840-a09aa330-ffa2-40bf-9571-778569507002.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://user-images.githubusercontent.com/398893/191876839-c1f6a5d4-a7d1-452b-9a74-8484f149c1d9.svg" width="48px" height="48px" alt="Superhuman logo"> |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Gmail ✔                                                                                                                                                     | Apple Mail ✔                                                                                                                                                | Outlook ✔                                                                                                                                                     | Yahoo! Mail ✔                                                                                                                                                     | Superhuman ✔                                                                                                                                                     |


## License

MIT License
