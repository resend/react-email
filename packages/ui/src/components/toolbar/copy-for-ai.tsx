'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { toast } from 'sonner';
import { nicenames } from '../../actions/email-validation/caniemail-data';
import type { CompatibilityCheckingResult } from '../../actions/email-validation/check-compatibility';
import { cn, sanitize } from '../../utils';
import { IconArrowUpRight } from '../icons/icon-arrow-up-right';
import { IconClipboard } from '../icons/icon-clipboard';
import { ChatGPTLogo, ClaudeLogo, CursorLogo } from '../icons/llm-logos';
import type { LintingRow } from './linter';
import type { SpamCheckingResult } from './spam-assassin';

type ActiveTab =
  | 'linter'
  | 'compatibility'
  | 'spam-assassin'
  | 'resend'
  | undefined;

interface CopyForAIProps {
  lintingRows: LintingRow[] | undefined;
  compatibilityResults: CompatibilityCheckingResult[] | undefined;
  spamResult: SpamCheckingResult | undefined;
  reactMarkup: string;
  activeTab: ActiveTab;
}

function buildLinterPrompt(rows: LintingRow[]): string {
  const issues = rows
    .filter((row) => row.result.status !== 'success')
    .map((row) => {
      if (row.source === 'link') {
        const failingCheck = row.result.checks.find((c) => !c.passed);
        if (!failingCheck) return null;

        let description = '';
        if (failingCheck.type === 'security')
          description = 'Insecure URL (HTTP instead of HTTPS)';
        else if (
          failingCheck.type === 'fetch_attempt' &&
          failingCheck.metadata.fetchStatusCode &&
          failingCheck.metadata.fetchStatusCode >= 400
        )
          description = `Broken link (HTTP ${failingCheck.metadata.fetchStatusCode})`;
        else if (
          failingCheck.type === 'fetch_attempt' &&
          failingCheck.metadata.fetchStatusCode &&
          failingCheck.metadata.fetchStatusCode >= 300
        )
          description = `Redirect detected (HTTP ${failingCheck.metadata.fetchStatusCode})`;
        else if (failingCheck.type === 'fetch_attempt')
          description = 'Link could not be reached';
        else if (failingCheck.type === 'syntax')
          description = 'Invalid link syntax';

        return `- [${sanitize(failingCheck.type).toUpperCase()}] ${description} → ${row.result.link} (line ${row.result.codeLocation.line})`;
      }

      if (row.source === 'image') {
        const failingCheck = row.result.checks.find((c) => !c.passed);
        if (!failingCheck) return null;

        let description = '';
        if (failingCheck.type === 'accessibility')
          description = 'Missing alt text';
        else if (failingCheck.type === 'security')
          description = 'Insecure image URL (HTTP instead of HTTPS)';
        else if (
          failingCheck.type === 'image_size' &&
          failingCheck.metadata.byteCount
        )
          description = `Image too large (${Math.round(failingCheck.metadata.byteCount / 1024)}KB, keep under 1MB)`;
        else if (
          failingCheck.type === 'fetch_attempt' &&
          failingCheck.metadata.fetchStatusCode &&
          failingCheck.metadata.fetchStatusCode >= 400
        )
          description = `Broken image (HTTP ${failingCheck.metadata.fetchStatusCode})`;
        else if (failingCheck.type === 'fetch_attempt')
          description = 'Image could not be reached';
        else if (failingCheck.type === 'syntax')
          description = 'Invalid image source';

        return `- [${sanitize(failingCheck.type).toUpperCase()}] ${description} → ${row.result.source} (line ${row.result.codeLocation.line})`;
      }

      return null;
    })
    .filter(Boolean);

  if (issues.length === 0) return '';

  return `I have a React Email template with the following linting issues found by the email preview tool. Please help me fix each one:

${issues.join('\n')}

For each issue:
1. Explain what the problem is and why it matters for email deliverability
2. Provide the corrected code
3. If an image is missing alt text, suggest descriptive alt text based on the image URL/context
4. If a link or image is broken, suggest how to verify and fix the URL
5. If using HTTP instead of HTTPS, update to the secure version`;
}

function buildCompatibilityPrompt(
  results: CompatibilityCheckingResult[],
): string {
  const issues = results
    .filter((r) => r.status === 'error')
    .map((result) => {
      const unsupported = Object.entries(result.statsPerEmailClient)
        .filter(([, stats]) => stats.status === 'error')
        .map(
          ([client]) =>
            nicenames.family[client as keyof typeof nicenames.family] || client,
        );

      return `- "${sanitize(result.entry.title)}" is not supported in: ${unsupported.join(', ')} (line ${result.location.start.line} in JSX)`;
    });

  if (issues.length === 0) return '';

  return `I have a React Email template with CSS/HTML compatibility issues detected by Can I Email. These features don't work in certain email clients:

${issues.join('\n')}

For each compatibility issue:
1. Explain which email clients are affected and how they'll render it
2. Provide a fallback or alternative approach that works across all email clients
3. Use only email-safe CSS properties and HTML elements
4. If a CSS property has no good fallback, suggest a different visual approach that achieves the same result
5. Prefer table-based layouts and inline styles for maximum compatibility`;
}

function buildSpamPrompt(result: SpamCheckingResult): string {
  const failingChecks = result.checks
    .filter((c) => c.points > 0)
    .sort((a, b) => b.points - a.points);

  if (failingChecks.length === 0) return '';

  const checksList = failingChecks
    .map(
      (check) =>
        `- [${sanitize(check.name)}] (penalty: -${check.points.toFixed(1)}) ${check.description}`,
    )
    .join('\n');

  return `I have a React Email template that scored ${(10 - result.points).toFixed(1)}/10 on SpamAssassin's spam check. Here are the spam indicators found:

${checksList}

Current total penalty: ${result.points.toFixed(1)} points (lower is better, 5+ is flagged as spam)

For each spam indicator:
1. Explain why this pattern triggers spam filters
2. Suggest specific changes to the email content or structure to fix it
3. Provide rewritten sections if the issue is with copy/wording
4. If the issue is structural (e.g., HTML-to-text ratio, missing headers), explain the fix
5. Prioritize fixes by impact — tackle highest-penalty items first`;
}

function getPromptForTab(
  activeTab: ActiveTab,
  lintingRows: LintingRow[] | undefined,
  compatibilityResults: CompatibilityCheckingResult[] | undefined,
  spamResult: SpamCheckingResult | undefined,
  reactMarkup: string,
): string {
  let issuePrompt = '';

  if (activeTab === 'linter' && lintingRows) {
    issuePrompt = buildLinterPrompt(lintingRows);
  } else if (activeTab === 'compatibility' && compatibilityResults) {
    issuePrompt = buildCompatibilityPrompt(compatibilityResults);
  } else if (activeTab === 'spam-assassin' && spamResult) {
    issuePrompt = buildSpamPrompt(spamResult);
  } else {
    const parts: string[] = [];
    if (lintingRows) {
      const p = buildLinterPrompt(lintingRows);
      if (p) parts.push(p);
    }
    if (compatibilityResults) {
      const p = buildCompatibilityPrompt(compatibilityResults);
      if (p) parts.push(p);
    }
    if (spamResult) {
      const p = buildSpamPrompt(spamResult);
      if (p) parts.push(p);
    }
    issuePrompt = parts.join('\n\n---\n\n');
  }

  if (!issuePrompt) {
    return `Here is the source code of my React Email template:\n\n\`\`\`tsx\n${reactMarkup}\n\`\`\`\n\nHelp me review and improve this email template.`;
  }

  return `${issuePrompt}\n\nHere is the source code of my email template:\n\n\`\`\`tsx\n${reactMarkup}\n\`\`\``;
}

function getLinkDescription(activeTab: ActiveTab): string {
  switch (activeTab) {
    case 'linter':
      return 'Fix linting issues';
    case 'compatibility':
      return 'Fix compatibility issues';
    case 'spam-assassin':
      return 'Fix spam issues';
    default:
      return 'Ask about this email';
  }
}

function buildClaudeUrl(prompt: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}

function buildChatGPTUrl(prompt: string): string {
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}

const MAX_SAFE_CHATGPT_URL_LENGTH = 7500;

function buildCursorUrl(prompt: string): string {
  return `cursor://prompt?text=${encodeURIComponent(prompt)}`;
}

export const CopyForAI = ({
  lintingRows,
  compatibilityResults,
  spamResult,
  reactMarkup,
  activeTab,
}: CopyForAIProps) => {
  const markdown = React.useMemo(
    () =>
      getPromptForTab(
        activeTab,
        lintingRows,
        compatibilityResults,
        spamResult,
        reactMarkup,
      ),
    [activeTab, lintingRows, compatibilityResults, spamResult, reactMarkup],
  );

  const linkDescription = getLinkDescription(activeTab);

  const handleCopyMarkdown = React.useCallback(() => {
    navigator.clipboard.writeText(markdown).then(() => {
      toast.success('Prompt copied to clipboard');
    });
  }, [markdown]);

  const claudeUrl = buildClaudeUrl(markdown);
  const directChatGPTUrl = buildChatGPTUrl(markdown);
  const isChatGPTPromptTooLong =
    directChatGPTUrl.length > MAX_SAFE_CHATGPT_URL_LENGTH;
  const chatGPTUrl = isChatGPTPromptTooLong
    ? 'https://chatgpt.com/'
    : directChatGPTUrl;
  const cursorUrl = buildCursorUrl(markdown);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1 h-7 px-2.5 rounded-md text-xs font-medium self-center',
            'text-slate-11',
            'hover:text-slate-12 transition-colors',
            'outline-none',
          )}
        >
          Copy for AI
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[260px] rounded-xl p-1.5 shadow-2xl z-50 border border-white/10"
          style={{ backgroundColor: '#0c0c0c' }}
          sideOffset={8}
          align="end"
          side="top"
        >
          <DropdownMenu.Item
            onSelect={(e) => {
              e.preventDefault();
              handleCopyMarkdown();
            }}
            className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer outline-none transition-colors hover:bg-white/5"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10"
              style={{ backgroundColor: '#161616' }}
            >
              <IconClipboard size={16} className="text-slate-11" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-medium text-white">
                Copy prompt
              </span>
              <span className="text-xs text-white/40">
                Copy as Markdown for LLMs
              </span>
            </div>
            <div className="h-4 w-4 shrink-0" />
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <a
              href={cursorUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer outline-none transition-colors hover:bg-white/5"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10"
                style={{ backgroundColor: '#161616' }}
              >
                <CursorLogo size={18} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium text-white">
                  Open in Cursor
                </span>
                <span className="text-xs text-white/40">{linkDescription}</span>
              </div>
              <IconArrowUpRight size={16} className="shrink-0 text-white/30" />
            </a>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <a
              href={claudeUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer outline-none transition-colors hover:bg-white/5"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10"
                style={{ backgroundColor: '#161616' }}
              >
                <ClaudeLogo size={18} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium text-white">
                  Open in Claude
                </span>
                <span className="text-xs text-white/40">{linkDescription}</span>
              </div>
              <IconArrowUpRight size={16} className="shrink-0 text-white/30" />
            </a>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <a
              href={chatGPTUrl}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => {
                if (!isChatGPTPromptTooLong) return;
                void navigator.clipboard.writeText(markdown);
              }}
              className="flex items-center gap-2.5 p-2 rounded-lg cursor-pointer outline-none transition-colors hover:bg-white/5"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10"
                style={{ backgroundColor: '#161616' }}
              >
                <ChatGPTLogo size={18} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-sm font-medium text-white">
                  Open in ChatGPT
                </span>
                <span className="text-xs text-white/40">
                  {isChatGPTPromptTooLong
                    ? 'Long prompt: copied to clipboard. Paste with Ctrl+V / Cmd+V'
                    : linkDescription}
                </span>
              </div>
              <IconArrowUpRight size={16} className="shrink-0 text-white/30" />
            </a>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
