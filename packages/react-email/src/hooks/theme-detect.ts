import { useEffect, useState } from 'react';

const useThemeDetector = (): boolean => {
  const getCurrentTheme = (): boolean =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(getCurrentTheme());
  const mqListener = (e: MediaQueryListEvent): void => {
    setIsDarkTheme(e.matches);
  };

  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    darkThemeMq.addListener(mqListener);
    return () => darkThemeMq.removeListener(mqListener);
  }, []);

  return isDarkTheme;
};

export default useThemeDetector;
