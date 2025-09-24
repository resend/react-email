'use client';
import * as Tabs from '@radix-ui/react-tabs';
import { LayoutGroup } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import type { CompatibilityCheckingResult } from '../actions/email-validation/check-compatibility';
import { isBuilding } from '../app/env';
import { usePreviewContext } from '../contexts/preview';
import { cn } from '../utils';
import { IconArrowDown } from './icons/icon-arrow-down';
import { IconCheck } from './icons/icon-check';
import { IconInfo } from './icons/icon-info';
import { IconReload } from './icons/icon-reload';
import { Compatibility, useCompatibility } from './toolbar/compatibility';
import { Linter, type LintingRow, useLinter } from './toolbar/linter';
import {
  SpamAssassin,
  type SpamCheckingResult,
  useSpamAssassin,
} from './toolbar/spam-assassin';
import { ToolbarButton } from './toolbar/toolbar-button';
import { useCachedState } from './toolbar/use-cached-state';

export type ToolbarTabValue = 'linter' | 'compatibility' | 'spam-assassin';

export const useToolbarState = () => {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('toolbar-panel') ?? undefined) as
    | ToolbarTabValue
    | undefined;

  return {
    activeTab,

    toggled: activeTab !== undefined,
  };
};

const ToolbarInner = ({
  serverLintingRows,
  serverSpamCheckingResult,
  serverCompatibilityResults,

  prettyMarkup,
  reactMarkup,
  plainText,
  emailPath,
  emailSlug,
}: ToolbarProps & {
  prettyMarkup: string;
  reactMarkup: string;
  plainText: string;
  emailSlug: string;
  emailPath: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { activeTab, toggled } = useToolbarState();

  const setActivePanelValue = (newValue: ToolbarTabValue | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (newValue === undefined) {
      params.delete('toolbar-panel');
    } else {
      params.set('toolbar-panel', newValue);
    }
    router.push(`${pathname}?${params.toString()}${location.hash}`);
  };

  const [cachedSpamCheckingResult, setCachedSpamCheckingResult] =
    useCachedState<SpamCheckingResult>(
      `spam-assassin-${emailSlug.replaceAll('/', '-')}`,
    );
  const [spamCheckingResult, { load: loadSpamChecking, loading: spamLoading }] =
    useSpamAssassin({
      markup: prettyMarkup,
      plainText,

      initialResult: serverSpamCheckingResult ?? cachedSpamCheckingResult,
    });

  const [cachedLintingRows, setCachedLintingRows] = useCachedState<
    LintingRow[]
  >(`linter-${emailSlug.replaceAll('/', '-')}`);
  const [lintingRows, { load: loadLinting, loading: lintLoading }] = useLinter({
    markup: prettyMarkup,

    initialRows: serverLintingRows ?? cachedLintingRows,
  });
  const [cachedCompatibilityResults, setCachedCompatibilityResults] =
    useCachedState<CompatibilityCheckingResult[]>(
      `compatibility-${emailSlug.replaceAll('/', '-')}`,
    );
  const [
    compatibilityCheckingResults,
    { load: loadCompatibility, loading: compatibilityLoading },
  ] = useCompatibility({
    emailPath,
    reactMarkup,

    initialResults: serverCompatibilityResults ?? cachedCompatibilityResults,
  });

  if (!isBuilding) {
    // biome-ignore lint/correctness/useHookAtTopLevel: This is fine since isBuilding does not change at runtime
    // biome-ignore lint/correctness/useExhaustiveDependencies: Setters don't need dependencies
    React.useEffect(() => {
      (async () => {
        const lintingRows = await loadLinting();
        setCachedLintingRows(lintingRows);

        const spamCheckingResult = await loadSpamChecking();
        setCachedSpamCheckingResult(spamCheckingResult);

        const compatibilityCheckingResults = await loadCompatibility();
        setCachedCompatibilityResults(compatibilityCheckingResults);
      })();
    }, []);
  }

  const id = React.useId();

  return (
    <div
      data-toggled={toggled}
      className={cn(
        'absolute bottom-0 left-0 right-0',
        'border-t border-slate-6 group/toolbar text-xs text-slate-11 h-52 transition-transform',
        'data-[toggled=false]:translate-y-[10.625rem]',
      )}
    >
      <Tabs.Root
        value={activeTab ?? ''}
        onValueChange={(newValue) => {
          setActivePanelValue(newValue as ToolbarTabValue);
        }}
        asChild
      >
        <div className="flex flex-col h-full">
          <Tabs.List className="flex gap-4 px-4 border-b border-solid border-slate-6 h-10 w-full flex-shrink-0">
            <LayoutGroup id={`toolbar-${id}`}>
              <Tabs.Trigger asChild value="linter">
                <ToolbarButton active={activeTab === 'linter'}>
                  Linter
                </ToolbarButton>
              </Tabs.Trigger>
              <Tabs.Trigger asChild value="compatibility">
                <ToolbarButton active={activeTab === 'compatibility'}>
                  Compatibility
                </ToolbarButton>
              </Tabs.Trigger>
              <Tabs.Trigger asChild value="spam-assassin">
                <ToolbarButton active={activeTab === 'spam-assassin'}>
                  Spam
                </ToolbarButton>
              </Tabs.Trigger>
            </LayoutGroup>
            <div className="flex gap-0.5 ml-auto">
              <ToolbarButton
                delayDuration={0}
                tooltip={
                  (activeTab === 'linter' &&
                    'The Linter tab checks all the images and links for common issues like missing alt text, broken URLs, insecure HTTP methods, and more.') ||
                  (activeTab === 'spam-assassin' &&
                    'The Spam tab will look at the content and use a robust scoring framework to determine if the email is likely to be spam. Powered by SpamAssassin.') ||
                  (activeTab === 'compatibility' &&
                    'The Compatibility tab shows how well the HTML/CSS is supported across mail clients like Outlook, Gmail, etc. Powered by Can I Email.') ||
                  'Info'
                }
              >
                <IconInfo size={24} />
              </ToolbarButton>
              {isBuilding ? null : (
                <ToolbarButton
                  tooltip="Reload"
                  disabled={lintLoading || spamLoading}
                  onClick={async () => {
                    if (activeTab === undefined) {
                      setActivePanelValue('linter');
                    }
                    if (activeTab === 'spam-assassin') {
                      await loadSpamChecking();
                    } else if (activeTab === 'linter') {
                      await loadLinting();
                    } else if (activeTab === 'compatibility') {
                      await loadCompatibility();
                    }
                  }}
                >
                  <IconReload
                    size={24}
                    className={cn({
                      'opacity-60 animate-spin-fast':
                        lintLoading || spamLoading,
                    })}
                  />
                </ToolbarButton>
              )}
              <ToolbarButton
                tooltip="Toggle toolbar"
                onClick={() => {
                  if (activeTab === undefined) {
                    setActivePanelValue('linter');
                  } else {
                    setActivePanelValue(undefined);
                  }
                }}
              >
                <IconArrowDown
                  size={24}
                  className="transition-transform group-data-[toggled=false]/toolbar:rotate-180"
                />
              </ToolbarButton>
            </div>
          </Tabs.List>

          <div className="flex-grow transition-opacity opacity-100 group-data-[toggled=false]/toolbar:opacity-0 overflow-y-auto pr-3 pl-4 pt-3">
            <Tabs.Content value="linter">
              {lintLoading ? (
                <LoadingState message="Analyzing your code for linting issues..." />
              ) : lintingRows?.length === 0 ? (
                <SuccessWrapper>
                  <SuccessIcon />
                  <SuccessTitle>All good</SuccessTitle>
                  <SuccessDescription>
                    No linting issues found.
                  </SuccessDescription>
                </SuccessWrapper>
              ) : (
                <Linter rows={lintingRows ?? []} />
              )}
            </Tabs.Content>
            <Tabs.Content value="compatibility">
              {compatibilityLoading ? (
                <LoadingState message="Checking email compatibility..." />
              ) : compatibilityCheckingResults?.length === 0 ? (
                <SuccessWrapper>
                  <SuccessIcon />
                  <SuccessTitle>Great compatibility</SuccessTitle>
                  <SuccessDescription>
                    Template should render properly everywhere.
                  </SuccessDescription>
                </SuccessWrapper>
              ) : (
                <Compatibility results={compatibilityCheckingResults ?? []} />
              )}
            </Tabs.Content>
            <Tabs.Content value="spam-assassin">
              {spamLoading ? (
                <LoadingState message="Evaluating your email for spam indicators..." />
              ) : spamCheckingResult?.isSpam === false ? (
                <SuccessWrapper>
                  <SuccessIcon />
                  <SuccessTitle>10/10</SuccessTitle>
                  <SuccessDescription>
                    Your email is clean of abuse indicators.
                  </SuccessDescription>
                </SuccessWrapper>
              ) : (
                <SpamAssassin result={spamCheckingResult} />
              )}
            </Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
};

const LoadingState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-8">
      <div className="relative mb-8 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400/80 to-cyan-600/80 opacity-10 blur-xl absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="h-12 w-12 rounded-full border border-slate-4 absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="h-10 w-10 rounded-full flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-5 w-5 rounded-full border-2 border-white/50 border-t-transparent animate-spin-fast" />
        </div>
      </div>
      <h3 className="text-slate-12 font-medium text-base mb-1">Processing</h3>
      <p className="text-slate-11 text-sm text-center max-w-[320px]">
        {message}
      </p>
    </div>
  );
};

const SuccessWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-8">
      {children}
    </div>
  );
};

const SuccessIcon = () => {
  return (
    <div className="relative mb-8 flex items-center justify-center">
      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-300/20 opacity-80 to-emerald-500/30 blur-md absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-400/80 opacity-10 to-emerald-600/80 absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg" />
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
        <IconCheck size={24} className="text-white drop-shadow-sm" />
      </div>
    </div>
  );
};

const SuccessTitle = ({ children }) => {
  return (
    <h3 className="text-slate-12 font-medium text-base mb-1">{children}</h3>
  );
};

const SuccessDescription = ({ children }) => {
  return (
    <p className="text-slate-11 text-sm text-center max-w-[320px]">
      {children}
    </p>
  );
};

interface ToolbarProps {
  serverSpamCheckingResult: SpamCheckingResult | undefined;
  serverLintingRows: LintingRow[] | undefined;
  serverCompatibilityResults: CompatibilityCheckingResult[] | undefined;
}

export const Toolbar = ({
  serverLintingRows,
  serverSpamCheckingResult,
  serverCompatibilityResults,
}: ToolbarProps) => {
  const { emailPath, emailSlug, renderedEmailMetadata } = usePreviewContext();

  if (renderedEmailMetadata === undefined) return null;
  const { prettyMarkup, plainText, reactMarkup } = renderedEmailMetadata;

  return (
    <ToolbarInner
      emailPath={emailPath}
      emailSlug={emailSlug}
      prettyMarkup={prettyMarkup}
      reactMarkup={reactMarkup}
      plainText={plainText}
      serverLintingRows={serverLintingRows}
      serverSpamCheckingResult={serverSpamCheckingResult}
      serverCompatibilityResults={serverCompatibilityResults}
    />
  );
};
