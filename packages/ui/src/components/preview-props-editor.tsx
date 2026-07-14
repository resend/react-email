'use client';

import * as React from 'react';
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

  // The applied override is the source of truth for what renders; the draft
  // only preserves the user's raw text, which can be momentarily invalid
  // JSON or formatted differently than the applied value.
  const [draft, setDraft] = React.useState<string | undefined>(undefined);
  const [parseError, setParseError] = React.useState<string | undefined>(
    undefined,
  );

  const hasOverride = previewPropsOverride !== undefined;

  const handleChange = (newValue: string) => {
    setDraft(newValue);
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
  };

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
            disabled={!hasOverride && draft === undefined}
            onClick={() => {
              setDraft(undefined);
              setParseError(undefined);
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
        onChange={handleChange}
        value={draft ?? renderedPropsJson}
      />
      {parseError !== undefined ? (
        <p className="pb-3 text-red-11">{parseError}</p>
      ) : null}
    </div>
  );
};
