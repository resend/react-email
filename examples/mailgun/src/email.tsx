import { Button, Html } from 'react-email';

interface EmailProps {
  url: string;
}

export function Email({ url }: EmailProps) {
  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  );
}
