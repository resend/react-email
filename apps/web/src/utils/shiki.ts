import { bundledLanguages, createHighlighter } from "shiki/bundle/web";

export const codeToHtml = async ({
  code,
  lang,
}: {
  code: string;
  lang: string;
}) => {
  const highlighter = await createHighlighter({
    langs: [...Object.keys(bundledLanguages)],
    themes: ["catppuccin-mocha"],
  });

  return highlighter.codeToHtml(code, {
    lang,
    theme: "catppuccin-mocha",
  });
};
