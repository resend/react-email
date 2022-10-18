import { Img } from '@react-email/img';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

interface PackageImgProps {}

export const PackageImg: React.FC<Readonly<PackageImgProps>> = () => {
  return (
    <Html>
      <Head />
      <Img
        src="https://github.com/zenorocha.png"
        alt="Zeno Rocha"
        width="300"
        height="300"
      />
    </Html>
  );
};

export default PackageImg;
