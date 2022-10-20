import { Link } from '@react-email/link';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageLinkProps {}

export const PackageLink: React.FC<Readonly<PackageLinkProps>> = () => {
  return (
    <Html>
      <Head />
      <Link href="https://example.com">Example</Link>
    </Html>
  );
};

export default PackageLink;
