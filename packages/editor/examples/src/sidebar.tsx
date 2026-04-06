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
    <aside className="w-56 shrink-0 border-r border-(--re-border) h-screen overflow-y-auto flex flex-col">
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
      <div className="mt-auto p-4 border-t border-(--re-border)">
        <a
          href="https://react.email/docs/editor/overview"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-(--re-text-muted) hover:text-(--re-text) transition-colors no-underline"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2.5 1.75H5.25C5.71413 1.75 6.15925 1.93437 6.48744 2.26256C6.81563 2.59075 7 3.03587 7 3.5V12.25C7 11.9185 6.8683 11.6005 6.63388 11.3661C6.39946 11.1317 6.08152 11 5.75 11H2.5V1.75Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.5 1.75H8.75C8.28587 1.75 7.84075 1.93437 7.51256 2.26256C7.18437 2.59075 7 3.03587 7 3.5V12.25C7 11.9185 7.1317 11.6005 7.36612 11.3661C7.60054 11.1317 7.91848 11 8.25 11H11.5V1.75Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Documentation
        </a>
      </div>
    </aside>
  );
}
