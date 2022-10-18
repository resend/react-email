import { Ul } from '@react-email/ul';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageUlProps {}

export const PackageUl: React.FC<Readonly<PackageUlProps>> = () => {
  return (
    <Html>
      <Head />
      <Ul>
        <li>foo</li>
        <li>bar</li>
      </Ul>
    </Html>
  );
};

export default PackageUl;
