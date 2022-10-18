import { Ol } from '@react-email/ol';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageOlProps {}

export const PackageOl: React.FC<Readonly<PackageOlProps>> = () => {
  return (
    <Html>
      <Head />
      <Ol>
        <li>foo</li>
        <li>bar</li>
      </Ol>
    </Html>
  );
};

export default PackageOl;
