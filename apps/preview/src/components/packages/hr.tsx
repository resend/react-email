import { Hr } from '@react-email/hr';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageHrProps {}

export const PackageHr: React.FC<Readonly<PackageHrProps>> = () => {
  return (
    <Html>
      <Head />
      <Hr />
    </Html>
  );
};

export default PackageHr;
