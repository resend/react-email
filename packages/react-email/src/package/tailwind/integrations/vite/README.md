This is a Vite React project bootstrapped with `npm create vite@latest` that contains a Tailwind
email using most of the features we provide that will be auto-built on testing to
make sure this new release works properly with the latest version of Vite when being built.

We do this testing so that things are more reliable before we get to publishing. This
couldn't be done using pnpm workspaces as they link code instead of actually copying the content into node_modules.
The solution we use to copy the code, in a way that mimics the actual `npm install @react-email/tailwind`, is `yalc`.

Se [the test file](../_tests/vite.spec.ts) for more info.
