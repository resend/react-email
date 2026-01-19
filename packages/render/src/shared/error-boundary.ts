import React from 'react';

export function createErrorBoundary(reject: (error: unknown) => void) {
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
