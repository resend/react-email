import type * as React from 'react';
import { useRenderingOptions } from '../useRenderingOptions';

interface TemplateProps {
  firstName: string;
}

export const Template: React.FC<Readonly<TemplateProps>> = ({ firstName }) => (
  <>
    <h1>Welcome, {firstName}!</h1>
    <img alt="test" src="img/test.png" />
    <p>Thanks for trying our product. We're thrilled to have you on board!</p>
  </>
);

export const TemplateWithCustomPlainText: React.FC<Readonly<TemplateProps>> = ({ firstName }) => {
  const options = useRenderingOptions();

  if (options.plainText)
    return (
      <>
        <h1>Hello, {firstName}!</h1>
        <img alt="test" src="img/test.png" />
        <p>Thanks for trying our product.</p>
      </>
    )

  return (
    <>
      <h1>Welcome, {firstName}!</h1>
      <img alt="test" src="img/test.png" />
      <p>Thanks for trying our product. We're thrilled to have you on board!</p>
    </>
  )
};
