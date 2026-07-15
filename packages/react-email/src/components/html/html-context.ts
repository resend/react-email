import * as React from 'react';

export interface HtmlContextValue {
  lang?: string;
  dir?: string;
}

export const HtmlContext = React.createContext<HtmlContextValue>({});
