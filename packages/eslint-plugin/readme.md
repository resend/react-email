![React Email button cover](https://react.email/static/covers/render.png)

<div align="center"><strong>eslint-plugin-react-email</strong></div>
<div align="center">Lint your react-email templates for the highest standard and support.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://github.com/resendlabs/react-email">GitHub</a> 
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

## Install

Install the plugin from your command line

#### With pnpm

```sh
pnpm add @react-email/eslint-plugin -DE
```

#### With npm

```sh
npm install @react-email/eslint-plugin -DE
```

## Getting started

### 1. Create a config file inside of your emails folder

Since the plugin can't detect properly what React component is an email
or if weather it inside the emails folder, you will need to create a new config file
inside of it as follows:

```json
plugins: ['@react-email'],
extends: ['plugin:@react-email/recommended']
```

Activating or deactivating certain rules as you may prefer. These rules are mostly generated 
with metadata taken from [caniemail](https://www.caniemail.com/).

### 2. Run eslint

```sh
eslint .
```

## License

MIT License
