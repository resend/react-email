interface SidebarSection {
  title: string;
  examples: { id: string; label: string }[];
}

interface SidebarProps {
  sections: SidebarSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ sections, activeId, onSelect }: SidebarProps) {
  return (
    <aside className="w-56 shrink-0 border-r border-(--re-border) h-screen overflow-y-auto">
      <div className="p-4 border-b border-(--re-border)">
        <span className="text-sm font-semibold text-(--re-text)">
          @react-email/editor
        </span>
      </div>
      <nav className="p-2">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-2 pt-4 pb-1 text-[0.625rem] uppercase tracking-wider text-(--re-text-muted) font-medium">
              {section.title}
            </p>
            {section.examples.map((example) => (
              <button
                key={example.id}
                type="button"
                onClick={() => onSelect(example.id)}
                className={`w-full text-left px-2 py-1.5 rounded-md text-[0.8125rem] cursor-pointer border-0 bg-transparent ${
                  activeId === example.id
                    ? 'bg-(--re-hover) text-(--re-text) font-medium'
                    : 'text-(--re-text-muted) hover:bg-(--re-hover)/50'
                }`}
              >
                {example.label}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
