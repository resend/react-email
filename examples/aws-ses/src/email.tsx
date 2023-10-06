import * as React from "react";
import { Html } from "@react-email/html";
import { Button } from "@react-email/button";

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
