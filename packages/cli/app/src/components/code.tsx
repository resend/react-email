import classnames from 'classnames';
import { getHighlighter } from 'shikiji';

import { PreviewLanguage } from '../helpers';

interface CodeProps {
  children: string;
  className?: string;
  language?: PreviewLanguage;
}

const theme = 'dark-plus';
const shiki = await getHighlighter({
  langs: ['html', 'tsx'],
  themes: [theme]
});

export const Code = ({ children: value, language = 'html' }: CodeProps) => {
  // const [isCopied, setIsCopied] = React.useState(false);
  const lang = language === 'jsx' ? 'tsx' : language;
  const code = language === 'plain' ? value : shiki.codeToHtml(value, { lang, theme });
  const lines = value.split('\n').length;
  const css = `
    .${language} .shiki .line:before {
      width: calc(${lines.toString().length} * 12px + 12px);
    }`;

  return (
    <>
      <style>{css}</style>
      <div
        className={classnames(language)}
        dangerouslySetInnerHTML={{ __html: code }}
        style={{
          fontFamily:
            'SFMono-Regular,Consolas,"Liberation Mono",Menlo,Monaco,"Lucida Console","Liberation Mono","DejaVu Sans Mono","Bitstream Vera Sans Mono","Courier New"'
        }}
      ></div>
    </>
  );
};
