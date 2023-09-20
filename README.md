![React email cover](https://react.email/static/covers/react-email.png)

<div align="center"><strong>React Email</strong></div>
<div align="center">The next generation of writing emails.<br />High-quality, unstyled components for creating emails.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a>
<span> · </span>
<a href="https://github.com/resendlabs/react-email">GitHub</a>
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

## Fork Information

This is a soft fork of `@react-email`. The information below is accurate, however when using this fork, substitute `@jsx-email` for `@react-email` in instructions.

Users can expect that this project is in line with the upstream project. The intent of this project to provide an up to date channel, merging PRs from the upstream project quickly and rolling out fixes and new features faster than the `react-email` project can currently tackle.

## Introduction

A collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript.
It reduces the pain of coding responsive emails with dark mode support. It also takes care of inconsistencies between Gmail, Outlook, and other email clients for you.

## Why

We believe that email is an extremely important medium for people to communicate. However, we need to stop developing emails like 2010, and rethink how email can be done in 2022 and beyond. Email development needs a revamp. A renovation. Modernized for the way we build web apps today.

## Install

Install one of the components from your command line.

#### With yarn

```sh
yarn add @react-email/button -E
```

#### With npm

```sh
npm install @react-email/button -E
```

## Getting started

Add the component to your email template. Include styles where needed.

```jsx
import { Button } from '@react-email/button';

const Email = () => {
  return (
    <Button href="https://example.com" style={{ color: '#61dafb' }}>
      Click me
    </Button>
  );
};
```

## Components

A set of standard components to help you build amazing emails without having to deal with the mess of creating table-based layouts and maintaining archaic markup.

- [Html](https://github.com/resendlabs/react-email/tree/main/packages/html)
- [Head](https://github.com/resendlabs/react-email/tree/main/packages/head)
- [Heading](https://github.com/resendlabs/react-email/tree/main/packages/heading)
- [Button](https://github.com/resendlabs/react-email/tree/main/packages/button)
- [Link](https://github.com/resendlabs/react-email/tree/main/packages/link)
- [Image](https://github.com/resendlabs/react-email/tree/main/packages/img)
- [Divider](https://github.com/resendlabs/react-email/tree/main/packages/hr)
- [Paragraph](https://github.com/resendlabs/react-email/tree/main/packages/text)
- [Container](https://github.com/resendlabs/react-email/tree/main/packages/container)
- [Preview](https://github.com/resendlabs/react-email/tree/main/packages/preview)
- [Body](https://github.com/resendlabs/react-email/tree/main/packages/body)
- [Column](https://github.com/resendlabs/react-email/tree/main/packages/column)
- [Section](https://github.com/resendlabs/react-email/tree/main/packages/section)
- [Font](https://github.com/resendlabs/react-email/tree/main/packages/font)

## Integrations

Emails built with React Email can be converted into HTML and sent using any email service provider. Here are some examples:

- [Resend](https://github.com/resendlabs/react-email/tree/main/examples/resend)
- [Nodemailer](https://github.com/resendlabs/react-email/tree/main/examples/nodemailer)
- [SendGrid](https://github.com/resendlabs/react-email/tree/main/examples/sendgrid)
- [Postmark](https://github.com/resendlabs/react-email/tree/main/examples/postmark)
- [AWS SES](https://github.com/resendlabs/react-email/tree/main/examples/aws-ses)

## Support

All components were tested using the most popular email clients.

| <img src="https://react.email/static/icons/gmail.svg" width="48px" height="48px" alt="Gmail logo"> | <img src="https://react.email/static/icons/apple-mail.svg" width="48px" height="48px" alt="Apple Mail"> | <img src="https://react.email/static/icons/outlook.svg" width="48px" height="48px" alt="Outlook logo"> | <img src="https://react.email/static/icons/yahoo-mail.svg" width="48px" height="48px" alt="Yahoo! Mail logo"> | <img src="https://react.email/static/icons/hey.svg" width="48px" height="48px" alt="HEY logo"> | <img src="https://react.email/static/icons/superhuman.svg" width="48px" height="48px" alt="Superhuman logo"> |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Gmail ✔                                                                                           | Apple Mail ✔                                                                                           | Outlook ✔                                                                                             | Yahoo! Mail ✔                                                                                                | HEY ✔                                                                                         | Superhuman ✔                                                                                                |

## Contributing, Working With This Repo

The `jsx-email` repository is a [Monorepo](https://en.wikipedia.org/wiki/Monorepo) that uses two primary tools; [`pnpm`](https://pnpm.io/) and [`Moon`](https://moonrepo.dev/). `pnpm` is used for package management and [workspace management](https://pnpm.io/workspaces) of the repo. `Moon` is used as our task runner for the repo - all commands to work with the packages and code in the repo go through `Moon`. We also assume that you have Node.js installed, because this is a project that leverages React.

### Getting Started

If you're new to either `pnpm` or `Moon` you'll want to run the `bootstrap.sh` script first. It will install everything you'll need to get started, and bootstrap your environment:

```console
$ ./shared/bootstrap.sh
```

Next we'll want to get dependencies installed, and get everything built. _(Note: One of the benefits of `Moon` is that it uses intelligent caching to assert that dependencies are always up to date before running any command. We don't techincally have to install dependencies first)_:

```console
$ pnpm install
```

And build all of the packages in the repo:

```console
$ moon run jsx-email:build.packages
```

Read more on our [Contribution Guide](https://react.email/docs/contributing).

## Attribution 🧡

This package was built upon prior work for `react-email` by Bu Kinoshita ([@bukinoshita](https://twitter.com/bukinoshita)) and Zeno Rocha ([@zenorocha](https://twitter.com/zenorocha)).

## License

[MIT License](./LICENSE.md)
