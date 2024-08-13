import { codeToHtml } from "../utils/shiki";

interface CodeRenderer {
  code: string;
  lang: string;
}

export const CodeRenderer = async ({ code, lang }: CodeRenderer) => {
  const html = await codeToHtml({
    code,
    lang,
  });

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
