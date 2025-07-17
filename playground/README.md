# React Email Playground

This is a playground for React Email made to experiment with components in realtime.

It includes all components directly from source with a path alias import of `@react-email/components` and hot reloading in the `dev` script.

## Development workflow

### 1. Create an email template

Create a new file at `playground/emails/testing.tsx` 

```tsx emails/testing.tsx
import { Html, Head, Body, Tailwind, Text } from '@react-email/components';

export default function Testing() {
  return <Tailwind>
    <Html>
      <Head/>

      <Body className="bg-black text-white">
        <Text className="m-0 my-4 bg-cyan-200 text-slate-800">
          This is a testing email template.
        </Text>
      </Body>
    </Html>
  </Tailwind>;
}
```

### 2. Run playground server

```sh
pnpm dev
```

### 3. Open in your browser

Go to http://localhost:3000

