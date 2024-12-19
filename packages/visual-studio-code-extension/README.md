![React email cover](https://react.email/static/covers/react-email.png)

<div align="center"><strong>React Email Preview for VS Code</strong></div>
<div align="center">The next generation of writing emails.<br />High-quality, unstyled components for creating emails.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://github.com/resendlabs/react-email">GitHub</a> 
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

A easy way to have a preview of an email written with [react-email](https://github.com/resendlabs/react-email) from your editor.

## How to use?

To use it, you will need to run the command from the command pallete, or you will need
to use the keybinding that is by default `CTRL + SHIFT + E` (or `CMD + SHIFT + E` for Mac).

Once you run the command, a split will appear with a welcome message, once you focus a email
written with react-email, it will auto-detect and render it automatically for you showing a preview of
how it looks.

Something important is that the `vsce` doesn't play well with workspaces so the `package` script might break
when trying to run with the extension included in the monorepo.

## Found a bug?

If you have found a bug, even if small, please open a issue [here](https://github.com/resendlabs/react-email/issues).
We want for `react-email` to bring the best developer experience possible and your feedback is very welcome.

## What is react-email?

React Email is a collection of high-quality, unstyled components for creating beautiful emails using React and TypeScript. It reduces the pain of coding responsive emails with dark mode support. It also takes care of inconsistencies between Gmail, Outlook, and other email clients for you.

Find out more [here](https://react.email/).
