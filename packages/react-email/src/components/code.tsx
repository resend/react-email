'use client';
import type { Language } from 'prism-react-renderer';
import { Highlight } from 'prism-react-renderer';
import * as React from 'react';
import { cn } from '../utils';
import { useLocationHash } from '../hooks/use-location-hash';

interface CodeProps {
  children: string;
  className?: string;
  language?: Language;
}

const theme = {
  plain: {
    color: '#EDEDEF',
    fontSize: 13,
    fontFamily: 'MonoLisa, Menlo, monospace',
  },
  styles: [
    {
      types: ['comment'],
      style: {
        color: '#706F78',
      },
    },
    {
      types: ['atrule', 'keyword', 'attr-name', 'selector'],
      style: {
        color: '#7E7D86',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: '#706F78',
      },
    },
    {
      types: ['class-name', 'function', 'tag', 'key-white'],
      style: {
        color: '#EDEDEF',
      },
    },
  ],
};

const lineHashRegex = /#L(?<start>\d+)(?:,(?<end>\d+))?/;

export const Code: React.FC<Readonly<CodeProps>> = ({
  children,
  language = 'html',
}) => {
  const locationHash = useLocationHash();
  const highlight = (() => {
    if (locationHash) {
      const match = locationHash.match(lineHashRegex);
      if (match?.groups?.start) {
        const start = Number.parseInt(match.groups.start);
        const end = match.groups.end
          ? Number.parseInt(match.groups.end)
          : start;
        return [start, end] as const;
      }
    }
  })();

  const isHighlighting = (line: number) => {
    if (!highlight) return false;

    return highlight[0] <= line && highlight[1] >= line;
  }

  const value = children.trim();

  return (
    <Highlight code={value} language={language} theme={theme}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          <div
            className="absolute right-0 top-0 h-px w-[200px]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
            }}
          />
          <div className="flex h-[650px] p-4 max-h-[calc(100vh-10rem)] after:w-full after:static after:block after:h-4 after:content-[''] overflow-auto">
            <div className="text-[#49494f] text-[13px] font-light font-[MonoLisa,_Menlo,_monospace]">
              {tokens.map((_, i) => (
                <div
                  id={`L${i + 1}`}
                  key={i}
                  className={cn(
                    'align-middle rounded-l-sm select-none pr-3',
                    isHighlighting(i + 1) && 'text-cyan-11 bg-cyan-5',
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <pre>
              {tokens.map((line, i) => {
                const lineProps = getLineProps({
                  line,
                  key: i,
                });
                return (
                  <div
                    {...lineProps}
                    data-hightlight={
                      highlight
                        ? highlight[0] <= i + 1 && highlight[1] >= i + 1
                        : false
                    }
                    className={cn(
                      'whitespace-pre flex transition-colors rounded-r-sm',
                      isHighlighting(i + 1) && 'bg-cyan-5',
                      {
                        "before:mr-2 before:text-slate-11 before:content-['$']":
                          language === 'bash' && tokens.length === 1,
                      },
                    )}
                    key={i}
                  >
                    {line.map((token, key) => {
                      const tokenProps = getTokenProps({
                        token,
                      });
                      const isException =
                        token.content === 'from' &&
                        line[key + 1]?.content === ':';
                      const newTypes = isException
                        ? [...token.types, 'key-white']
                        : token.types;
                      token.types = newTypes;

                      return (
                        <React.Fragment key={key}>
                          <span {...tokenProps} />
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              })}
            </pre>
            <div
              className="absolute bottom-0 left-0 h-px w-[200px]"
              style={{
                background:
                  'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
              }}
            />
          </div>
        </>
      )}
    </Highlight>
  );
};
