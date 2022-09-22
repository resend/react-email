![React Email button cover](https://react-email-assets.vercel.app/button.png)

<div align="center"><strong>@react-email/head</strong></div>
<div align="center">Contains head components, related to the document such as style and meta elements.</div>
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
yarn add @react-email/head -E
```

#### With npm

```sh
npm install @react-email/head -E
```

## Getting started

Add the component to your email template. Include children tags where needed.

```jsx
import { Head } from '@react-email/head';

const Email = () => {
  return (
    <Head>
      <title>My email title</title>
    </Head>
  );
};
```

## License

MIT License
