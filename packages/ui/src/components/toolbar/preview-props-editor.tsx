'use client';

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePreviewContext } from '../../contexts/preview';
import { cn } from '../../utils';

/**
 * JSON editor for the props the preview renders with. Edits apply live and
 * only affect the preview; the template's `PreviewProps` are not modified.
 */
export const PreviewPropsEditor = () => {
  const {
    renderedEmailMetadata,
    previewPropsOverride,
    setPreviewPropsOverride,
  } = usePreviewContext();

  const renderedPropsJson = JSON.stringify(
    renderedEmailMetadata?.previewProps ?? {},
    null,
    2,
  );

  const [value, setValue] = React.useState(renderedPropsJson);
  const [parseError, setParseError] = React.useState<string | undefined>(
    undefined,
  );

  const hasOverride = previewPropsOverride !== undefined;

  // Without an override active, the rendered props follow the template file
  // (initial load, hot reload, reset), so the editor mirrors them.
  React.useEffect(() => {
    if (!hasOverride) {
      setValue(renderedPropsJson);
      setParseError(undefined);
    }
  }, [hasOverride, renderedPropsJson]);

  const applyValue = useDebouncedCallback((newValue: string) => {
    try {
      const parsed = JSON.parse(newValue) as unknown;
      if (
        parsed === null ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      ) {
        setParseError('Props must be a JSON object');
        return;
      }
      setParseError(undefined);
      setPreviewPropsOverride(parsed as Record<string, unknown>);
    } catch (exception) {
      setParseError((exception as Error).message);
    }
  }, 400);

  return (
    <div className="flex h-full flex-col gap-2 pb-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-slate-11">
          Edit the JSON props this preview renders with. Changes apply live and
          do not modify the template&apos;s <code>PreviewProps</code>.
        </p>
        <button
          className={cn(
            'shrink-0 rounded-md border border-slate-6 px-2 py-1 text-slate-11 transition-colors',
            'hover:border-slate-8 hover:text-slate-12',
            'disabled:opacity-40 disabled:hover:border-slate-6 disabled:hover:text-slate-11',
          )}
          disabled={!hasOverride}
          onClick={() => {
            applyValue.cancel();
            setPreviewPropsOverride(undefined);
          }}
          type="button"
        >
          Reset to defaults
        </button>
      </div>
      <textarea
        aria-invalid={parseError !== undefined}
        aria-label="Preview props JSON"
        className={cn(
          'grow resize-none rounded-md border border-slate-6 bg-transparent p-2 font-mono text-xs text-slate-12 outline-none',
          'focus:border-slate-8',
          parseError !== undefined && 'border-red-9 focus:border-red-9',
        )}
        onChange={(event) => {
          setValue(event.currentTarget.value);
          applyValue(event.currentTarget.value);
        }}
        spellCheck={false}
        value={value}
      />
      {parseError !== undefined ? (
        <p className="text-red-11">{parseError}</p>
      ) : null}
    </div>
  );
};
