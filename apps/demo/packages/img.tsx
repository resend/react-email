import { Img } from '@react-email/img';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

export default function Email() {
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