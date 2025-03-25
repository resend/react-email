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
              ) : (
                <Linter rows={lintingRows} />
              )}
            </Tabs.Content>
            <Tabs.Content value="spam-assassin">
              {spamLoading ? (
                <div className="animate-pulse text-slate-11 text-sm pt-1">
                  Running spam check...
                </div>
              ) : (
                <SpamAssassin result={spamCheckingResult} />
              )}
            </Tabs.Content>
            <Tabs.Content value="compatibility">
              {compatibilityLoading ? (
                <div className="animate-pulse text-slate-11 text-sm pt-1">
                  Running compatibility check...
                </div>
              ) : (
                <Compatibility results={compatibilityCheckingResults} />
              )}
            </Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </div>
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
