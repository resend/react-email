import React from 'react';

export function createErrorBoundary(reject: (error: unknown) => void) {
  // React Server Components don't support React.Component, so it's just not defined here
  if (!React.Component) {
    return (props: { children?: React.ReactNode }) => <>{props.children}</>;
  }

  return class ErrorBoundary extends React.Component<{
    children: React.ReactNode;
  }> {
    componentDidCatch(error: unknown) {
      reject(error);
    }
    render() {
      return this.props.children;
    }
  };
}
