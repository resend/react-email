import * as React from 'react';

export interface HtmlContextValue {
  lang?: string;
  dir?: string;
}

// React's react-server builds don't include createContext/useContext, so in
// server components there is no inheritance and Body keeps its own defaults.
export const HtmlContext: React.Context<HtmlContextValue> | undefined =
  'createContext' in React
    ? React.createContext<HtmlContextValue>({})
    : undefined;

export const useHtmlContext = (): HtmlContextValue => {
  if (HtmlContext === undefined || !('useContext' in React)) {
    return {};
  }
  // biome-ignore lint/correctness/useHookAtTopLevel: the branch is constant for a given React build, so hook order never changes between renders
  return React.useContext(HtmlContext);
};
