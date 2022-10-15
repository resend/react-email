import { Avatar, AvatarFallback, AvatarImage } from '@react-email/avatar';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageAvatarImageProps {}

export const PackageAvatarImage: React.FC<
  Readonly<PackageAvatarImageProps>
> = () => {
  return (
    <Html>
      <Head />
      <Avatar>
        <AvatarImage src="https://github.com/zenorocha.png" />
        <AvatarFallback>Zeno Rocha</AvatarFallback>
      </Avatar>
    </Html>
  );
};

export default PackageAvatarImage;
