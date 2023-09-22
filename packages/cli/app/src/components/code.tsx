import classnames from 'classnames';
// import { Highlight, Language } from 'prism-react-renderer';
// import * as React from 'react';
import { getHighlighter } from 'shikiji';

import { PreviewLanguage } from '../helpers';

interface CodeProps {
  children: string;
  className?: string;
  language?: PreviewLanguage;
}

// const theme = {
//   plain: {
//     color: '#EDEDEF',
//     fontFamily: 'MonoLisa, Menlo, monospace',
//     fontSize: 13
//   },
//   styles: [
//     {
//       style: {
//         color: '#706F78'
//       },
//       types: ['comment']
//     },
//     {
//       style: {
//         color: '#7E7D86'
//       },
//       types: ['atrule', 'keyword', 'attr-name', 'selector']
//     },
//     {
//       style: {
//         color: '#706F78'
//       },
//       types: ['punctuation', 'operator']
//     },
//     {
//       style: {
//         color: '#EDEDEF'
//       },
//       types: ['class-name', 'function', 'tag', 'key-white']
//     }
//   ]
// };

const theme = 'dark-plus';
const shiki = await getHighlighter({
  langs: ['html', 'tsx'],
  themes: [theme]
});

export const Code = ({ children: value, language = 'html' }: CodeProps) => {
  // const [isCopied, setIsCopied] = React.useState(false);
  const lang = language === 'jsx' ? 'tsx' : language;
  const code = language === 'plainText' ? value : shiki.codeToHtml(value, { lang, theme });
  const lines = value.split('\n').length;
  const css = `
    .${language} .shiki .line:before {
      width: calc(${lines.toString().length} * 12px + 12px);
    }`;

  // const file = new File([value], `email.${language}`);
  // const url = URL.createObjectURL(file);

  return (
    <>
      <style>{css}</style>
      <div
        className={classnames(language, 'text-xs', { plain: language === 'plainText' })}
        dangerouslySetInnerHTML={{ __html: code }}
        style={{
          fontFamily:
            'SFMono-Regular,Consolas,"Liberation Mono",Menlo,Monaco,"Lucida Console","Liberation Mono","DejaVu Sans Mono","Bitstream Vera Sans Mono","Courier New"'
        }}
      ></div>
    </>
    // <Highlight code={value} language={language as Language}>
    //   {({ tokens, getLineProps, getTokenProps }) => (
    //     <>
    //       {/* <div
    //         className="absolute right-0 top-0 h-px w-[200px]"
    //         style={{
    //           background:
    //             'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)'
    //         }}
    //       /> */}
    //       {/* <div className="bg-code-bg p-4 h-[650px] overflow-auto"> */}
    //       {tokens.map((line, i) => {
    //         const { key: lineKey, ...lineProps } = getLineProps({ key: i, line });
    //         return (
    //           <div key={i} {...lineProps} className={classnames('whitespace-pre')}>
    //             {line.map((token, key) => {
    //               const { key: tokenKey, ...tokenProps } = getTokenProps({ key, token });
    //               const isException = token.content === 'from' && line[key + 1]?.content === ':';
    //               const newTypes = isException ? [...token.types, 'key-white'] : token.types;
    //               token.types = newTypes;

    //               return (
    //                 <React.Fragment key={key}>
    //                   <span {...tokenProps} />
    //                 </React.Fragment>
    //               );
    //             })}
    //           </div>
    //         );
    //       })}
    //       {/* </div> */}
    //       {/* <div
    //         className="absolute left-0 bottom-0 h-px w-[200px]"
    //         style={{
    //           background:
    //             'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)'
    //         }}
    //       /> */}
    //     </>
    //   )}
    // </Highlight>
  );
};
