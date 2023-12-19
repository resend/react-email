![React Email button cover](https://react.email/static/covers/render.png)

<div align="center"><strong>@react-email/render</strong></div>
<div align="center">Transform React components into HTML email templates.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://github.com/resend/react-email">GitHub</a> 
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

## Install

Install component from your command line.

#### With yarn

```sh
yarn add @react-email/render -E
```

#### With npm

```sh
npm install @react-email/render -E
```

## Getting started

Convert React components into a HTML string.

```jsx
import { MyTemplate } from "../components/MyTemplate";
import { render } from "@react-email/render";

const html = render(<MyTemplate firstName="Jim" />);
```

## License

MIT License
