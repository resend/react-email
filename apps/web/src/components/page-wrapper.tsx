import { Footer } from '@/components/footer';
import { Topbar } from '@/components/topbar';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable page wrapper with Topbar and Footer for internal pages
 */
export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <div
      className={`relative mx-auto flex min-h-[100dvh] flex-col justify-between px-2 md:max-w-7xl md:px-4 ${className}`}
      vaul-drawer-wrapper=""
    >
      <Topbar />
      {children}
      <Footer />
    </div>
  );
}
