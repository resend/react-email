import * as React from 'react';

interface PreviewProps {}

export const Preview: React.VFC<Readonly<PreviewProps>> = () => (
  <>
    <div id="__react-email-preview">This should be hidden from plain text</div>
    <h1>This should be rendered in plain text</h1>
  </>
);
