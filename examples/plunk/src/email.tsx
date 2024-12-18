import { Button, Html } from '@react-email/components';

interface EmailProps {
  url: string;
}

export const Email: React.FC<Readonly<EmailProps>> = ({ url }) => {
  return (
    <Html lang="en">
      <Button href={url}>Click me</Button>
    </Html>
  );
};
