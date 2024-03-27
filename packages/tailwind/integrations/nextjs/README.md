This is a NextJS project bootstraped with `create-next-app@latest` that contains a Tailwind
email using most of the features we provide that will be auto-built on testing to
make sure this new release works properly with the latest version of NextJS.

We do this testing so that things are more reliable and this couldn't be done using pnpm
workspaces as they link code instead of actually copying the content into node_modules.
The solution we use to copy the code is `yalc`.

Se [the test file](../works-on-next-app.spec.ts) for more info
