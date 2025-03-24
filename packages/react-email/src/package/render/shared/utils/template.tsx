import type * as React from 'react';

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
