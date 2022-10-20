import { Button } from '@react-email/button';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageButtonProps {}

export const PackageButton: React.FC<Readonly<PackageButtonProps>> = () => {
  return (
    <Html>
      <Head />
      <Button
        pX={20}
        pY={12}
        href="https://example.com"
        style={{ background: '#000', color: '#fff' }}
      >
        Click me
      </Button>
    </Html>
  );
};

export default PackageButton;
