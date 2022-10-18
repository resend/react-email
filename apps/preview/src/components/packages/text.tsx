import { Text } from '@react-email/text';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageTextProps {}

export const PackageText: React.FC<Readonly<PackageTextProps>> = () => {
  return (
    <Html>
      <Head />
      <Text>Lorem ipsum</Text>
    </Html>
  );
};

export default PackageText;
