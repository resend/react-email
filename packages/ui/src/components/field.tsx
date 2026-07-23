'use client';

import * as React from 'react';
import { cn } from '../utils';
import { IconArrowDown } from './icons/icon-arrow-down';

// Shared form-field primitives. They only own the field look; spacing
// between fields is left to the caller.

const fieldClasses =
  'w-full appearance-none rounded-lg border border-slate-6 bg-slate-3 px-2 py-1 text-sm text-slate-12 placeholder-slate-10 outline-hidden transition duration-300 ease-in-out focus:ring-1 focus:ring-slate-10 disabled:opacity-60';

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

// forwardRef so the ref reaches the <input> on React 18, where function
// components do not receive ref as a regular prop.
export const TextInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'input'>
>(({ className, ...props }, forwardedRef) => (
  <input
    className={cn(fieldClasses, className)}
    ref={forwardedRef}
    {...props}
  />
));

TextInput.displayName = 'TextInput';

export const SelectInput = ({
  className,
  children,
  ...props
}: React.ComponentProps<'select'>) => (
  <div className="relative">
    <select className={cn(fieldClasses, 'pr-7', className)} {...props}>
      {children}
    </select>
    <IconArrowDown
      className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-slate-10"
      size={16}
    />
  </div>
);
