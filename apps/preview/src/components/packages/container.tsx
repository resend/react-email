import { Container } from '@react-email/container';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageContainerProps {}

export const PackageContainer: React.FC<
  Readonly<PackageContainerProps>
> = () => {
  return (
    <Html>
      <Head />
      <Container style={{ margin: '0 auto' }}>
        <p>hello world</p>
      </Container>
    </Html>
  );
};

export default PackageContainer;
