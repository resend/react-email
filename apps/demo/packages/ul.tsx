import { Ul } from '@react-email/ul';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

export default function Email() {
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