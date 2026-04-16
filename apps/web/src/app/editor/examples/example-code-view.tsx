'use client';

import { CodeBlock } from '@/components/code-block';
import { CopyCode } from '@/components/copy-code';
import { IconGitHub } from '@/components/icons/icon-github';

interface ExampleCodeViewProps {
  code: string;
  githubUrl: string;
}

export function ExampleCodeView({ code, githubUrl }: ExampleCodeViewProps) {
  return (
    <div className="flex h-full w-full flex-col rounded-xl border border-slate-4 bg-slate-3">
      <div className="flex w-full items-center justify-between border-slate-4 border-b p-4">
        <span className="font-mono text-xs text-slate-11">example.tsx</span>
        <div className="flex items-center gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-md p-1.5 text-slate-11 transition-colors hover:text-slate-12"
          >
            <IconGitHub size={16} />
          </a>
          <CopyCode className="shadow-none p-2 h-8 w-8" code={code} />
        </div>
      </div>
      <div className="w-full overflow-auto">
        <CodeBlock language="tsx" isGradientLine={false}>
          {code}
        </CodeBlock>
      </div>
    </div>
  );
}
