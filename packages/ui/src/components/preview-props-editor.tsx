'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import * as React from 'react';
import { isBuilding } from '../app/env';
import { usePreviewContext } from '../contexts/preview';
import { useCachedWorkspaceState } from '../hooks/use-cached-workspace-state';
import { usePreviewPropsCommit } from '../hooks/use-preview-props-commit';
import { cn } from '../utils';
import { tabTransition } from '../utils/constants';
import { JsonEditor } from './json-editor';
import { PreviewPropsControls } from './preview-props-controls';

type PropsEditorMode = 'controls' | 'json';

const editorModes: { value: PropsEditorMode; label: string }[] = [
  { value: 'controls', label: 'Controls' },
  { value: 'json', label: 'JSON' },
];

export const PreviewPropsEditor = () => {
  const {
    renderedEmailMetadata,
    previewPropsOverride,
    setPreviewPropsOverride,
  } = usePreviewContext();

  const [cachedMode, setCachedMode] =
    useCachedWorkspaceState<PropsEditorMode>('props-panel-mode');
  const [mode, setMode] = React.useState<PropsEditorMode>(
    cachedMode === 'json' ? 'json' : 'controls',
  );

  const appliedProps =
    previewPropsOverride ?? renderedEmailMetadata?.previewProps ?? {};

  const renderedPropsJson = JSON.stringify(appliedProps, null, 2);

  // The applied override is the source of truth for what renders; the draft
  // only preserves the user's raw text, which can be momentarily invalid
  // JSON or formatted differently than the applied value.
  const [draft, setDraft] = React.useState<string | undefined>(undefined);

  const hasOverride = previewPropsOverride !== undefined;

  const { parseError, commitProp, commitJson, flushJson, reset } =
    usePreviewPropsCommit({
      appliedProps,
      applyOverride: setPreviewPropsOverride,
    });

  const handleJsonChange = (newValue: string) => {
    setDraft(newValue);
    commitJson(newValue);
  };

  const handleChangeProp = (key: string, value: unknown) => {
    // A leftover JSON draft would mask this edit on the JSON tab.
    setDraft(undefined);
    commitProp(key, value);
  };

  const handleReset = () => {
    setDraft(undefined);
    reset();
  };

  const handleModeChange = (newMode: PropsEditorMode) => {
    setMode(newMode);
    setCachedMode(newMode);
    flushJson();
    setDraft(undefined);
  };

  return (
    <Tabs.Root
      className="flex h-full flex-col gap-3"
      onValueChange={(value) => {
        handleModeChange(value as PropsEditorMode);
      }}
      value={mode}
    >
      <div className="flex items-center justify-between gap-3">
        <Tabs.List
          aria-label="Props editing mode"
          className="flex overflow-hidden rounded-md border border-slate-6 bg-slate-2"
        >
          {editorModes.map(({ value, label }) => (
            <Tabs.Trigger
              className={cn(
                'relative px-2 py-1 transition ease-in-out duration-200 hover:text-slate-12',
                mode === value ? 'text-slate-12' : 'text-slate-11',
              )}
              key={value}
              value={value}
            >
              {mode === value ? (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-slate-4"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  layoutId="props-editor-active-mode"
                  transition={tabTransition}
                />
              ) : null}
              <span className="relative">{label}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {isBuilding ? null : (
          <button
            className={cn(
              'ml-auto shrink-0 rounded-md border border-slate-6 px-2 py-1 text-slate-11 transition-colors',
              'hover:border-slate-8 hover:text-slate-12',
              'disabled:opacity-40 disabled:hover:border-slate-6 disabled:hover:text-slate-11',
            )}
            disabled={!hasOverride && draft === undefined}
            onClick={handleReset}
            type="button"
          >
            Reset to defaults
          </button>
        )}
      </div>
      {isBuilding ? (
        <p className="text-slate-11">
          Read-only. This preview was rendered at build time.
        </p>
      ) : null}
      <Tabs.Content value="controls">
        <PreviewPropsControls
          declaredControls={renderedEmailMetadata?.previewControls}
          disabled={isBuilding}
          onChangeProp={handleChangeProp}
          previewProps={appliedProps}
        />
      </Tabs.Content>
      <Tabs.Content value="json">
        <JsonEditor
          aria-invalid={parseError !== undefined}
          aria-label="Preview props JSON"
          className={cn(
            parseError !== undefined &&
              'border-red-9 focus-within:border-red-9',
          )}
          disabled={isBuilding}
          onChange={handleJsonChange}
          value={draft ?? renderedPropsJson}
        />
        {parseError !== undefined ? (
          <p className="pb-3 text-red-11">{parseError}</p>
        ) : null}
      </Tabs.Content>
    </Tabs.Root>
  );
};
