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

#### With yarn

```sh
yarn add @react-email/eslint-plugin -E
```

#### With npm

```sh
npm install @react-email/eslint-plugin -E
```

## Getting started

1. Create a config file inside of your emails folder

2. Extend whatever parent config you may want it to have

3. Add the following configuration to it:

```json
plugins: ['@react-email'],
extends: ['@react-email/recommended']
```

Activating or deactivating certain rules as you may prefer.
These rules are mostly generated with metadata taken from [caniemail](https://www.caniemail.com/).

Something important to note is that you create a eslint configuration
specific to *your* `emails` folder since the plugin does not filter out files
for those that are email templates.

## License

MIT License
