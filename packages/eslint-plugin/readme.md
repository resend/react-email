![React Email eslint plugin cover](https://react.email/static/covers/render.png)

<div align="center"><strong>eslint-plugin-react-email</strong></div>
<div align="center">Lint your React Email templates for the highest standard and support.</div>
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
pnpm add @react-email/eslint-plugin -D -E
```

#### With npm

```sh
npm install @react-email/eslint-plugin -D -E
```

## Attribution

This eslint plugin could not be possible in any means without the great work done on
[caniemail](https://www.caniemail.com/) and [their API](https://www.caniemail.com/api/data.json) 
for foraging data. Please go and [give them a star](https://github.com/hteumeuleu/caniemail).

## Getting started

### 1. Create a config file inside of your emails folder

Since the plugin can't detect properly what React component is an email
or if weather it is inside the emails folder, you will need to create a new config file
inside of your `emails` directory. Here's an example using our recommended configurations:

```json
{
  "plugins": ["@react-email"],
  "extends": ["plugin:@react-email/recommended", "PATH_TO_YOUR_DEFAULT_ESLINT_CONFIG"]
}
```

From here you can activate or deactivate rules as you prefer. We have a rule for each
email client + platform combination for both unsupported and partially supported features,
by default, the major email clients + all their platforms will error for unsupported properties
and warn for partially supported properties.

These default settings get making the email templates into a really good flow since 
you now get in-the-editor errors that point into what issues your email template has.

### 2. Run eslint

```sh
eslint .
```

## License

MIT License
