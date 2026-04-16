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
    <div className="flex h-full w-full flex-col bg-slate-3">
      <div className="relative flex w-full items-center justify-between border-slate-4 border-b border-solid p-4 text-xs">
        <span className="font-mono text-slate-11">example.tsx</span>
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
      <div className="h-full w-full overflow-auto">
        <CodeBlock language="tsx" isGradientLine={false}>
          {code}
        </CodeBlock>
      </div>
    </div>
  );
}
