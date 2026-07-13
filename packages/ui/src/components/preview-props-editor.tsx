'use client';

import * as React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { isBuilding } from '../app/env';
import { usePreviewContext } from '../contexts/preview';
import { cn } from '../utils';
import { JsonEditor } from './json-editor';

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

  // Without an override active, the editor mirrors the template's own props
  // (initial load, hot reload, reset). Pending edits are cancelled so a stale
  // draft cannot apply afterwards.
  React.useEffect(() => {
    if (!hasOverride) {
      applyValue.cancel();
      setValue(renderedPropsJson);
      setParseError(undefined);
    }
  }, [hasOverride, renderedPropsJson, applyValue]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        {isBuilding ? (
          <p className="text-slate-11">
            Read-only. This preview was rendered at build time.
          </p>
        ) : (
          <button
            className={cn(
              'ml-auto shrink-0 rounded-md border border-slate-6 px-2 py-1 text-slate-11 transition-colors',
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
        )}
      </div>
      <JsonEditor
        aria-invalid={parseError !== undefined}
        aria-label="Preview props JSON"
        className={cn(
          parseError !== undefined && 'border-red-9 focus-within:border-red-9',
        )}
        disabled={isBuilding}
        onChange={(newValue) => {
          setValue(newValue);
          applyValue(newValue);
        }}
        value={value}
      />
      {parseError !== undefined ? (
        <p className="pb-3 text-red-11">{parseError}</p>
      ) : null}
    </div>
  );
};
