'use client';

import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { LayoutGroup } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ComponentProps } from 'react';
import * as React from 'react';
import { nicenames } from '../actions/email-validation/caniemail-data';
import type { CompatibilityCheckingResult } from '../actions/email-validation/check-compatibility';
import { isBuilding } from '../app/env';
import { usePreviewContext } from '../contexts/preview';
import { useToolbarContext } from '../contexts/toolbar';
import { useCachedWorkspaceState } from '../hooks/use-cached-workspace-state';
import { cn } from '../utils';
import CodeSnippet from './code-snippet';
import { IconArrowDown } from './icons/icon-arrow-down';
import { IconCheck } from './icons/icon-check';
import { IconInfo } from './icons/icon-info';
import { IconReload } from './icons/icon-reload';
import { Compatibility, useCompatibility } from './toolbar/compatibility';
import { CopyForAI } from './toolbar/copy-for-ai';
import { Linter, type LintingRow, useLinter } from './toolbar/linter';
import { PreviewPropsEditor } from './toolbar/preview-props-editor';
import { ResendIntegration } from './toolbar/resend';
import {
  SpamAssassin,
  type SpamCheckingResult,
  useSpamAssassin,
} from './toolbar/spam-assassin';
import { ToolbarButton } from './toolbar/toolbar-button';

export type ToolbarTabValue =
  | 'linter'
  | 'compatibility'
  | 'spam-assassin'
  | 'props'
  | 'resend';

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
  serverCompatibilityClients,

  prettyMarkup,
  reactMarkup,
  plainText,
  emailPath,
  emailSlug,
  isRawHtmlEmail,
}: ToolbarProps & {
  prettyMarkup: string;
  reactMarkup: string;
  plainText: string;
  emailSlug: string;
  emailPath: string;
  isRawHtmlEmail: boolean;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { hasSetupResendIntegration } = useToolbarContext();

  const compatibilityClientsLabel = serverCompatibilityClients
    .map((client) => nicenames.family[client] ?? client)
    .join(', ');

  const { activeTab, toggled } = useToolbarState();

  const setActivePanelValue = (newValue: ToolbarTabValue | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (newValue === undefined) {
      params.delete('toolbar-panel');
    } else {
      params.set('toolbar-panel', newValue);
    }
    // Not router.push: on static builds it silently no-ops for query-only
    // navigation when the page was loaded with a query param.
    window.history.pushState(
      null,
      '',
      `${pathname}?${params.toString()}${location.hash}`,
    );
  };

  const [cachedSpamCheckingResult, setCachedSpamCheckingResult] =
    useCachedWorkspaceState<SpamCheckingResult>(`spam-assassin:${emailSlug}`);
  const [spamCheckingResult, { load: loadSpamChecking, loading: spamLoading }] =
    useSpamAssassin({
      markup: prettyMarkup,
      plainText,

      initialResult: serverSpamCheckingResult ?? cachedSpamCheckingResult,
    });

  const [cachedLintingRows, setCachedLintingRows] = useCachedWorkspaceState<
    LintingRow[]
  >(`linter:${emailSlug}`);
  const [lintingRows, { load: loadLinting, loading: lintLoading }] = useLinter({
    markup: prettyMarkup,

    initialRows: serverLintingRows ?? cachedLintingRows,
  });
  const [cachedCompatibilityResults, setCachedCompatibilityResults] =
    useCachedWorkspaceState<CompatibilityCheckingResult[]>(
      `compatibility:${emailSlug}`,
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
    React.useEffect(() => {
      (async () => {
        const lintingRows = await loadLinting();
        setCachedLintingRows(lintingRows);

        const spamCheckingResult = await loadSpamChecking();
        setCachedSpamCheckingResult(spamCheckingResult);

        // Compatibility checks rely on parsing JSX/TS, so they don't apply to
        // raw .html templates and would only produce noise.
        if (!isRawHtmlEmail) {
          const compatibilityCheckingResults = await loadCompatibility();
          setCachedCompatibilityResults(compatibilityCheckingResults);
        }
      })();
    }, []);
  }

  const id = React.useId();
  const [isToolbarInfoOpen, setIsToolbarInfoOpen] = React.useState(false);
  const infoPointerTypeRef = React.useRef('');
  React.useEffect(() => {
    if (!isToolbarInfoOpen) return;

    // Taps inside the email preview iframe do not reach Radix's dismiss layer.
    const closeWhenPreviewGetsFocus = () => {
      if (document.activeElement instanceof HTMLIFrameElement) {
        setIsToolbarInfoOpen(false);
      }
    };

    window.addEventListener('blur', closeWhenPreviewGetsFocus);
    return () => window.removeEventListener('blur', closeWhenPreviewGetsFocus);
  }, [isToolbarInfoOpen]);

  const toolbarPanelDescription =
    (activeTab === 'linter' &&
      'The Linter tab checks all the images and links for common issues like missing alt text, broken URLs, insecure HTTP methods, and more.') ||
    (activeTab === 'spam-assassin' &&
      'The Spam tab will look at the content and use a robust scoring framework to determine if the email is likely to be spam. Powered by SpamAssassin.') ||
    (activeTab === 'compatibility' &&
      'The Compatibility tab shows how well the HTML/CSS is supported across mail clients like Outlook, Gmail, etc. Powered by Can I Email.') ||
    (activeTab === 'props' &&
      'The Props tab lets you edit the props the preview renders with, to try out different content without changing the template.') ||
    (activeTab === 'resend' &&
      'The Resend tab allows you to upload your React Email code using the Resend Templates API.') ||
    'Info';

  return (
    <div
      data-toggled={toggled}
      className={cn(
        'absolute bottom-0 left-0 right-0',
        'border-t border-slate-6 group/toolbar text-xs text-slate-11 h-62 transition-transform sm:h-52',
        'data-[toggled=false]:translate-y-52.5 sm:data-[toggled=false]:translate-y-42.5',
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
          <div className="flex w-full shrink-0 flex-col border-b border-solid border-slate-6 px-2 sm:h-10 sm:flex-row sm:items-center sm:px-4">
            <Tabs.List className="flex h-10 w-full min-w-0 gap-3 overflow-x-auto [scrollbar-width:none] sm:h-full sm:w-auto sm:flex-1 sm:gap-4 [&::-webkit-scrollbar]:hidden">
              <LayoutGroup id={`toolbar-${id}`}>
                <Tabs.Trigger asChild value="linter">
                  <ToolbarButton active={activeTab === 'linter'}>
                    Linter
                  </ToolbarButton>
                </Tabs.Trigger>
                {isRawHtmlEmail ? null : (
                  <Tabs.Trigger asChild value="compatibility">
                    <ToolbarButton active={activeTab === 'compatibility'}>
                      Compatibility
                    </ToolbarButton>
                  </Tabs.Trigger>
                )}
                <Tabs.Trigger asChild value="spam-assassin">
                  <ToolbarButton active={activeTab === 'spam-assassin'}>
                    Spam
                  </ToolbarButton>
                </Tabs.Trigger>
                {isRawHtmlEmail || isBuilding ? null : (
                  <Tabs.Trigger asChild value="props">
                    <ToolbarButton active={activeTab === 'props'}>
                      Props
                    </ToolbarButton>
                  </Tabs.Trigger>
                )}
                <Tabs.Trigger asChild value="resend">
                  <ToolbarButton active={activeTab === 'resend'}>
                    Resend
                  </ToolbarButton>
                </Tabs.Trigger>
              </LayoutGroup>
            </Tabs.List>
            <div className="flex h-10 w-full shrink-0 items-center justify-end gap-1 border-t border-slate-6 sm:ml-4 sm:h-full sm:w-auto sm:border-t-0">
              <CopyForAI
                lintingRows={lintingRows}
                compatibilityResults={compatibilityCheckingResults}
                spamResult={spamCheckingResult}
                reactMarkup={reactMarkup}
                isRawHtmlEmail={isRawHtmlEmail}
                activeTab={activeTab}
              />
              <Popover.Root
                onOpenChange={setIsToolbarInfoOpen}
                open={isToolbarInfoOpen}
              >
                <Popover.Trigger asChild>
                  <ToolbarButton
                    aria-label="About the current toolbar panel"
                    delayDuration={0}
                    tooltip={
                      isToolbarInfoOpen ? undefined : toolbarPanelDescription
                    }
                    onPointerDown={(event) => {
                      infoPointerTypeRef.current = event.pointerType;
                    }}
                    onClick={(event) => {
                      // Mouse users already get this info on hover, so only
                      // touch and keyboard interactions open the popover.
                      if (infoPointerTypeRef.current === 'mouse') {
                        event.preventDefault();
                      }
                      infoPointerTypeRef.current = '';
                    }}
                  >
                    <IconInfo size={24} />
                  </ToolbarButton>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    align="end"
                    className="z-50 w-60 max-w-[calc(100vw-1rem)] rounded-md border border-slate-6 bg-black px-3 py-2 font-sans text-white text-xs"
                    collisionPadding={8}
                    side="top"
                    sideOffset={8}
                  >
                    {toolbarPanelDescription}
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
              {isBuilding ||
              activeTab === 'resend' ||
              activeTab === 'props' ? null : (
                <ToolbarButton
                  tooltip="Reload"
                  disabled={lintLoading || spamLoading || compatibilityLoading}
                  onClick={async () => {
                    if (activeTab === undefined) {
                      setActivePanelValue('linter');
                    }
                    if (activeTab === 'spam-assassin') {
                      await loadSpamChecking();
                    } else if (activeTab === 'linter') {
                      await loadLinting();
                    } else if (
                      activeTab === 'compatibility' &&
                      !isRawHtmlEmail
                    ) {
                      await loadCompatibility();
                    }
                  }}
                >
                  <IconReload
                    size={24}
                    className={cn({
                      'opacity-60 animate-spin-fast':
                        lintLoading || spamLoading || compatibilityLoading,
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
          </div>

          <div className="grow transition-opacity opacity-100 group-data-[toggled=false]/toolbar:opacity-0 overflow-y-auto pr-3 pl-4 pt-3">
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
              {isRawHtmlEmail ? (
                <SuccessWrapper>
                  <SuccessTitle>Compatibility unavailable</SuccessTitle>
                  <SuccessDescription>
                    Compatibility checks rely on the React Email source and are
                    skipped for raw HTML templates.
                  </SuccessDescription>
                </SuccessWrapper>
              ) : compatibilityLoading ? (
                <LoadingState message="Checking email compatibility..." />
              ) : compatibilityCheckingResults?.length === 0 ? (
                <SuccessWrapper>
                  <SuccessIcon />
                  <SuccessTitle>Great compatibility</SuccessTitle>
                  <SuccessDescription>
                    Template should render properly in{' '}
                    {compatibilityClientsLabel}.
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
            {isRawHtmlEmail || isBuilding ? null : (
              <Tabs.Content className="h-full" value="props">
                <PreviewPropsEditor />
              </Tabs.Content>
            )}
            <Tabs.Content value="resend">
              {hasSetupResendIntegration ? (
                <ResendIntegration
                  emailSlug={emailSlug}
                  htmlMarkup={prettyMarkup}
                />
              ) : (
                <SuccessWrapper>
                  <SuccessTitle>Connect to Resend</SuccessTitle>
                  <SuccessDescription className="max-w-lg">
                    Run{' '}
                    <CodeSnippet>
                      npx react-email@latest resend setup
                    </CodeSnippet>
                    <br /> on your terminal to connect your Resend account.
                  </SuccessDescription>
                </SuccessWrapper>
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
        <div className="h-12 w-12 rounded-full bg-linear-to-br from-cyan-400/80 to-cyan-600/80 opacity-10 blur-xl absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
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
      <div className="h-16 w-16 rounded-full bg-linear-to-br from-green-300/20 opacity-80 to-emerald-500/30 blur-md absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="h-12 w-12 rounded-full bg-linear-to-br from-green-400/80 opacity-10 to-emerald-600/80 absolute m-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg" />
      <div className="h-10 w-10 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
        <IconCheck size={24} className="text-white drop-shadow-xs" />
      </div>
    </div>
  );
};

const SuccessTitle = ({
  children,
  className,
  ...props
}: ComponentProps<'h3'>) => {
  return (
    <h3
      className={cn('text-slate-12 font-medium text-base mb-1', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

const SuccessDescription = ({
  children,
  className,
  ...props
}: ComponentProps<'p'>) => {
  return (
    <p
      className={cn(
        'text-slate-11 text-sm text-center max-w-[320px]',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

interface ToolbarProps {
  serverSpamCheckingResult: SpamCheckingResult | undefined;
  serverLintingRows: LintingRow[] | undefined;
  serverCompatibilityResults: CompatibilityCheckingResult[] | undefined;
  serverCompatibilityClients: readonly string[];
}

export function Toolbar({
  serverLintingRows,
  serverSpamCheckingResult,
  serverCompatibilityResults,
  serverCompatibilityClients,
}: ToolbarProps) {
  const { emailPath, emailSlug, renderedEmailMetadata } = usePreviewContext();

  if (renderedEmailMetadata === undefined) return null;
  const { prettyMarkup, plainText, reactMarkup, extname } =
    renderedEmailMetadata;

  return (
    <ToolbarInner
      emailPath={emailPath}
      emailSlug={emailSlug}
      prettyMarkup={prettyMarkup}
      reactMarkup={reactMarkup}
      plainText={plainText}
      isRawHtmlEmail={extname === 'html'}
      serverLintingRows={serverLintingRows}
      serverSpamCheckingResult={serverSpamCheckingResult}
      serverCompatibilityResults={serverCompatibilityResults}
      serverCompatibilityClients={serverCompatibilityClients}
    />
  );
}
