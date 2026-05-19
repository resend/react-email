interface PropRowProps {
  children: React.ReactNode;
  className?: string;
}

export function PropRow({ children, className }: PropRowProps) {
  return (
    <div data-re-inspector-prop-row="" className={className}>
      {children}
    </div>
  );
}
