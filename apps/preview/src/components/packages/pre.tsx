import { Pre } from '@react-email/pre';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackagePreProps {}

export const PackagePre: React.FC<Readonly<PackagePreProps>> = () => {
  return (
    <Html>
      <Head />
      <Pre>{`body {
  color: red;
}`}</Pre>
    </Html>
  );
};

export default PackagePre;
