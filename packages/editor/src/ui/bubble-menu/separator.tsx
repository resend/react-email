export interface BubbleMenuSeparatorProps {
  className?: string;
}

export function BubbleMenuSeparator({ className }: BubbleMenuSeparatorProps) {
  return <hr className={className} data-re-bubble-menu-separator="" />;
}
