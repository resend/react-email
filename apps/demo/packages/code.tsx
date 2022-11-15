import { Code } from '@react-email/code';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

export default function Email() {
  return (
    <Html>
      <Head />
      <Code style={{ maxWidth: '300px' }}>const foo = 'bar';</Code>
    </Html>
  );
}
