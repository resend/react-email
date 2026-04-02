import { sections } from './examples';
import { Sidebar } from './sidebar';
import { useHashRoute } from './use-hash-route';

const allExamples = sections.flatMap((s) => s.examples);

export function App() {
  const [activeId, setActiveId] = useHashRoute(allExamples[0].id);
  const ActiveExample =
    allExamples.find((e) => e.id === activeId)?.component ??
    allExamples[0].component;

  return (
    <div className="flex h-screen font-sans text-(--re-text)">
      <Sidebar sections={sections} activeId={activeId} onSelect={setActiveId} />
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto p-8">
        <ActiveExample key={activeId} />
      </main>
    </div>
  );
}
