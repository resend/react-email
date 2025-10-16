import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useFragmentIdentifier = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [fragmentIdentifier, setFragmentIdentifier] = useState<string>();

  useEffect(() => {
    setFragmentIdentifier(global.location?.hash);
  }, [pathname, searchParams]);

  return fragmentIdentifier;
};
