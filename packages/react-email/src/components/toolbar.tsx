'use client';
import * as Tabs from '@radix-ui/react-tabs';
import { LayoutGroup } from 'framer-motion';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect } from 'react';
import type { CompatibilityCheckingResult } from '../actions/email-validation/check-compatibility';
import { isBuilding } from '../app/env';
import { PreviewContext } from '../contexts/preview';
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

const ToolbarInner = ({
  serverLintingRows,
  serverSpamCheckingResult,
  serverCompatibilityResults,

  markup,
  reactMarkup,
  plainText,
  emailPath,
  emailSlug,
}: ToolbarProps & {
  markup: string;
  reactMarkup: string;
  plainText: string;
  emailSlug: string;
  emailPath: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeTab = (searchParams.get('toolbar-panel') ?? undefined) as
    | ToolbarTabValue
    | undefined;

  const toggled = activeTab !== undefined;

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
      markup,
      plainText,

      initialResult: serverSpamCheckingResult ?? cachedSpamCheckingResult,
    });

  const [cachedLintingRows, setCachedLintingRows] = useCachedState<
    LintingRow[]
  >(`linter-${emailSlug.replaceAll('/', '-')}`);
  const [lintingRows, { load: loadLinting, loading: lintLoading }] = useLinter({
    markup,

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
    useEffect(() => {
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

  return (
    <div
      data-toggled={toggled}
      className={cn(
        'absolute bottom-0 left-0 right-0',
        'bg-black group/toolbar text-xs text-slate-11 h-52 transition-transform',
        'data-[toggled=false]:translate-y-[170px]',
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
            <LayoutGroup id="toolbar">
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
                      'animate-spin opacity-60 animate-spin-fast':
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

          <div className="flex-grow transition-opacity opacity-100 group-data-[toggled=false]/toolbar:opacity-0 overflow-y-auto px-2 pt-3">
            <Tabs.Content value="linter">
              {lintLoading ? (
                <div className="animate-pulse text-slate-11 text-sm pt-1">
                  Running linting...
                </div>
              ) : lintingRows?.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-8">
                  <SuccessIcon />
                  <SuccessTitle>All good</SuccessTitle>
                  <SuccessDescription>
                    No linting issues found.
                  </SuccessDescription>
                </div>
              ) : (
                <Linter rows={lintingRows ?? []} />
              )}
            </Tabs.Content>
            <Tabs.Content value="compatibility">
              {compatibilityLoading ? (
                <div className="animate-pulse text-slate-11 text-sm pt-1">
                  Running compatibility check...
                </div>
              ) : compatibilityCheckingResults?.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-8">
                  <SuccessIcon />
                  <SuccessTitle>Great compatibility</SuccessTitle>
                  <SuccessDescription>
                    Template should render properly everywhere.
                  </SuccessDescription>
                </div>
              ) : (
                <Compatibility results={compatibilityCheckingResults ?? []} />
              )}
            </Tabs.Content>
            <Tabs.Content value="spam-assassin">
              {spamLoading ? (
                <div className="animate-pulse text-slate-11 text-sm pt-1">
                  Running spam check...
                </div>
              ) : spamCheckingResult?.isSpam === false ? (
                <div className="flex flex-col items-center justify-center pt-8">
                  <SuccessIcon />
                  <SuccessTitle>10/10</SuccessTitle>
                  <SuccessDescription>
                    Your email is clean of abuse indicators.
                  </SuccessDescription>
                </div>
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
  const { emailPath, emailSlug, renderedEmailMetadata } = use(PreviewContext)!;

  if (renderedEmailMetadata === undefined) return null;
  const { markup, plainText, reactMarkup } = renderedEmailMetadata;

  return (
    <ToolbarInner
      emailPath={emailPath}
      emailSlug={emailSlug}
      markup={markup}
      reactMarkup={reactMarkup}
      plainText={plainText}
      serverLintingRows={serverLintingRows}
      serverSpamCheckingResult={serverSpamCheckingResult}
      serverCompatibilityResults={serverCompatibilityResults}
    />
  );
};
