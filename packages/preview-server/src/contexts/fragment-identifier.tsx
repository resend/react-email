'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, use, useEffect, useState } from 'react';

export const FragmentIdentifierContext = createContext<
  | {
      identifier: string | undefined;

      update(value: string): void;
    }
  | undefined
>(undefined);

export const useFragmentIdentifier = () => {
  const value = use(FragmentIdentifierContext);
  return value?.identifier;
};

export const FragmentIdentifierProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fragmentIdentifier, setFragmentIdentifier] = useState<string>();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = () => {
    setFragmentIdentifier(location.hash);
  };

  useEffect(() => {
    update();
  }, [pathname, searchParams]);

  return (
    <FragmentIdentifierContext.Provider
      value={{
        identifier: fragmentIdentifier,
        update(value: string) {
          setFragmentIdentifier(value);
        },
      }}
    >
      {children}
    </FragmentIdentifierContext.Provider>
  );
};
