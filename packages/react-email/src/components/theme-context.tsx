import * as React from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: React.ReactNode;
  theme?: string;
  setTheme?: (theme: string) => void;
}

export const ThemeProvider = ({
  children,
  theme: externalTheme,
  setTheme: externalSetTheme,
}: ThemeProviderProps) => {
  // Internal state as fallback when props aren't provided
  const [internalTheme, setInternalTheme] = React.useState<Theme>('light');

  // Use external or internal state
  const theme = externalTheme ?? internalTheme;
  const setTheme = externalSetTheme ?? setInternalTheme;

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.colorScheme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme: theme as Theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
