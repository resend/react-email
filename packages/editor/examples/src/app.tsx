import { sections } from './examples';
import { Sidebar } from './sidebar';
import { useHashRoute } from './use-hash-route';

const allExamples = sections.flatMap((s) => s.examples);

export function App() {
  const [activeId, setActiveId] = useHashRoute(allExamples[0].id);
  const activeExample =
    allExamples.find((e) => e.id === activeId) ?? allExamples[0];
  const ActiveComponent = activeExample.component;

  return (
    <div className="flex h-screen font-sans text-(--re-text)">
      <Sidebar sections={sections} activeId={activeId} onSelect={setActiveId} />
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto p-8">
        {activeExample.docsUrl ? (
          <div className="flex justify-end mb-2">
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
          </div>
        ) : null}
        <ActiveComponent key={activeId} />
      </main>
    </div>
  );
}
