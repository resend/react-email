import { Pre } from '@react-email/pre';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

export default function Email() {
  return (
    <Html>
      <Head />
      <Pre>{`body {
  color: red;
}`}</Pre>
    </Html>
  );
}
