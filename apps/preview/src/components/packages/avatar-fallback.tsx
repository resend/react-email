import { Avatar, AvatarFallback } from '@react-email/avatar';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageAvatarFallbackProps {}

export const PackageAvatarFallback: React.FC<
  Readonly<PackageAvatarFallbackProps>
> = () => {
  return (
    <Html>
      <Head />
      <Avatar>
        <AvatarFallback>Zeno Rocha</AvatarFallback>
      </Avatar>
    </Html>
  );
};

export default PackageAvatarFallback;
