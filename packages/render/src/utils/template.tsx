import * as React from 'react';

interface TemplateProps {
  firstName: string;
}

export const Template: React.VFC<Readonly<TemplateProps>> = ({ firstName }) => (
  <>
    <h1>Welcome, {firstName}!</h1>
    <img src="img/test.png" alt="test" />
    <p>Thanks for trying our product. We're thrilled to have you on board!</p>
  </>
);
