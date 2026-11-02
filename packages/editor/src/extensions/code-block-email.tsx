import {
  a11yDark,
  atomDark,
  baseAteliersulphurpoolLight,
  CodeBlock,
  type CodeBlockProps,
  cb,
  coldarkCold,
  coldarkDark,
  coyWithoutShadows,
  darcula,
  dracula,
  duotoneDark,
  duotoneEarth,
  duotoneForest,
  duotoneLight,
  duotoneSea,
  duotoneSpace,
  ghcolors,
  gruvboxDark,
  gruvboxLight,
  holiTheme,
  hopscotch,
  laserwave,
  lucario,
  materialDark,
  materialLight,
  materialOceanic,
  nightOwl,
  nord,
  oneDark,
  oneLight,
  pojoaque,
  shadesOfPurple,
  solarizedDarkAtom,
  synthwave84,
  vesper,
  vs,
  vscDarkPlus,
  xonokai,
  zTouch,
} from 'react-email';

export const codeBlockThemes: Record<string, CodeBlockProps['theme']> = {
  a11yDark,
  atomDark,
  baseAteliersulphurpoolLight,
  cb,
  coldarkCold,
  coldarkDark,
  coyWithoutShadows,
  darcula,
  dracula,
  duotoneDark,
  duotoneEarth,
  duotoneForest,
  duotoneLight,
  duotoneSea,
  duotoneSpace,
  ghcolors,
  gruvboxDark,
  gruvboxLight,
  holiTheme,
  hopscotch,
  laserwave,
  lucario,
  materialDark,
  materialLight,
  materialOceanic,
  nightOwl,
  nord,
  oneDark,
  oneLight,
  pojoaque,
  shadesOfPurple,
  solarizedDarkAtom,
  synthwave84,
  vesper,
  vs,
  vscDarkPlus,
  xonokai,
  zTouch,
};

export interface CodeBlockEmailProps extends Omit<CodeBlockProps, 'theme'> {
  themeName?: string;
}

export function CodeBlockEmail({ themeName, ...props }: CodeBlockEmailProps) {
  const userTheme =
    themeName && Object.hasOwn(codeBlockThemes, themeName)
      ? codeBlockThemes[themeName]
      : undefined;

  // Without theme, render a gray code block
  const theme = userTheme
    ? {
        ...userTheme,
        base: {
          ...userTheme.base,
          borderRadius: '0.125rem',
          padding: '0.75rem 1rem',
        },
      }
    : {
        base: {
          color: '#1e293b',
          background: '#f1f5f9',
          lineHeight: '1.5',
          fontFamily:
            '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
          padding: '0.75rem 1rem',
          borderRadius: '0.125rem',
        },
      };

  return <CodeBlock {...props} theme={theme} />;
}
