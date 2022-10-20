import { Code } from '@react-email/code';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageCodeProps {}

export const PackageCode: React.FC<Readonly<PackageCodeProps>> = () => {
  return (
    <Html>
      <Head />
      <Code style={{ maxWidth: '300px' }}>const foo = 'bar';</Code>
    </Html>
  );
};

export default PackageCode;
