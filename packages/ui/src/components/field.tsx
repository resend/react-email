'use client';

import type * as React from 'react';
import { cn } from '../utils';

// Shared form-field primitives. They only own the field look; spacing
// between fields is left to the caller.

export const FieldLabel = ({
  className,
  htmlFor,
  children,
  ...props
}: React.ComponentProps<'label'> & { htmlFor: string }) => (
  <label
    className={cn('block text-xs uppercase text-slate-10', className)}
    htmlFor={htmlFor}
    {...props}
  >
    {children}
  </label>
);

export const TextInput = ({
  className,
  ...props
}: React.ComponentProps<'input'>) => (
  <input
    className={cn(
      'w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10 disabled:opacity-60',
      className,
    )}
    {...props}
  />
);
