import { cn } from '@/lib/cn';

interface PropRowProps {
  children: React.ReactNode;
  className?: string;
}

export function PropRow({ children, className }: PropRowProps) {
  return (
    <div
      className={cn(
        'flex flex-row items-center justify-between [&>label]:mt-1.5 [&>label]:min-w-[calc(100%-150px)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
