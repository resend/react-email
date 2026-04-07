'use client';

export function EditorThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark [&_.tiptap]:bg-white [&_.tiptap]:text-black [&_.tiptap]:rounded-lg [&_.tiptap]:p-4">
      {children}
    </div>
  );
}
