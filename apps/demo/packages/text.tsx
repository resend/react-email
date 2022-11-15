import { Text } from '@react-email/text';
import { Html } from '@react-email/html';
import { Head } from '@react-email/head';
import * as React from 'react';

export default function Email() {
  return (
    <Html>
      <Head />
      <Text>Lorem ipsum</Text>
    </Html>
  );
};