'use client';

import { Highlight } from 'prism-react-renderer';
import { cn } from '../utils';
import { codeTheme } from './code';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  'aria-label': string;
  'aria-invalid'?: boolean;
}

// Text metrics must match between the highlighted <pre> and the transparent
// <textarea> on top of it, or the caret drifts from the characters.
const sharedTextClasses =
  'whitespace-pre-wrap break-words p-2 text-[13px] leading-5 font-[MonoLisa,Menlo,monospace]';

/**
 * Syntax-highlighted JSON editing surface: a highlighted render with an
 * invisible textarea overlaid, so it looks like the source view but types
 * like a plain input.
 */
export const JsonEditor = ({
  value,
  onChange,
  disabled = false,
  className,
  ...ariaProps
}: JsonEditorProps) => {
  return (
    <div
      className={cn(
        'relative min-h-40 rounded-md border border-slate-6 transition-colors',
        'focus-within:border-slate-8',
        disabled && 'opacity-60',
        className,
      )}
    >
      <Highlight code={value} language="json" theme={codeTheme}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre aria-hidden className={sharedTextClasses}>
            {tokens.map((line, lineIndex) => (
              <div {...getLineProps({ line })} key={lineIndex}>
                {line.map((token, tokenIndex) => (
                  <span {...getTokenProps({ token })} key={tokenIndex} />
                ))}
                {line.length === 1 && line[0]?.empty ? '​' : null}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <textarea
        {...ariaProps}
        className={cn(
          sharedTextClasses,
          'absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent text-transparent caret-slate-12 outline-none',
        )}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.currentTarget.value);
        }}
        spellCheck={false}
        value={value}
      />
    </div>
  );
};
