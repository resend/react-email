import { useState } from 'react';
import { CodeBlock } from './code-block';
import { CopyButton } from './copy-button';
import { sections } from './examples';
import { Sidebar } from './sidebar';
import { useHashRoute } from './use-hash-route';

const allExamples = sections.flatMap((s) => s.examples);

type Tab = 'preview' | 'source';

export function App() {
  const [activeId, setActiveId] = useHashRoute(allExamples[0].id);
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const activeExample =
    allExamples.find((e) => e.id === activeId) ?? allExamples[0];
  const ActiveComponent = activeExample.component;

  const handleSelect = (id: string) => {
    setActiveId(id);
    setActiveTab('preview');
  };

  return (
    <div className="flex h-screen font-sans text-(--re-text)">
      <Sidebar
        sections={sections}
        activeId={activeId}
        onSelect={handleSelect}
      />
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 rounded-lg bg-(--re-hover)/50 p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border-0 cursor-pointer transition-colors ${
                activeTab === 'preview'
                  ? 'bg-(--re-bg) text-(--re-text) shadow-sm'
                  : 'bg-transparent text-(--re-text-muted) hover:text-(--re-text)'
              }`}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('source')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border-0 cursor-pointer transition-colors ${
                activeTab === 'source'
                  ? 'bg-(--re-bg) text-(--re-text) shadow-sm'
                  : 'bg-transparent text-(--re-text-muted) hover:text-(--re-text)'
              }`}
            >
              Source Code
            </button>
          </div>
          <div className="flex items-center gap-2">
            {activeTab === 'source' ? (
              <CopyButton code={activeExample.sourceCode} />
            ) : null}
            {activeExample.docsUrl ? (
              <a
                href={activeExample.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-(--re-text-muted) hover:text-(--re-text) transition-colors flex items-center gap-1"
              >
                Docs
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 2H2.5C1.95 2 1.5 2.45 1.5 3V9.5C1.5 10.05 1.95 10.5 2.5 10.5H9C9.55 10.5 10 10.05 10 9.5V8.5M7 1.5H10.5M10.5 1.5V5M10.5 1.5L5 7"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : null}
          </div>
        </div>

        {activeTab === 'preview' ? (
          <ActiveComponent key={activeId} />
        ) : (
          <div className="border border-(--re-border) rounded-xl overflow-hidden bg-[#1a1a1c] flex-1">
            <CodeBlock>{activeExample.sourceCode}</CodeBlock>
          </div>
        )}
      </main>
    </div>
  );
}
