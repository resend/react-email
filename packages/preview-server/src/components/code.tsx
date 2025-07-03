'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Language } from 'prism-react-renderer';
import { Highlight } from 'prism-react-renderer';
import { Fragment, useEffect, useRef } from 'react';
import { useFragmentIdentifier } from '../hooks/use-fragment-identifier';
import { cn } from '../utils';

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
  const locationHash = useFragmentIdentifier();
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
  };

  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (highlight && scroller) {
      const lineElement = scroller.querySelector(`#L${highlight[0]}`);
      if (lineElement instanceof HTMLAnchorElement) {
        scroller.scrollTo({
          top: Math.max(lineElement.offsetTop - 325, 0),
          behavior: 'smooth',
        });
      }
    }
  }, [highlight]);

  const searchParams = useSearchParams();

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
          <div
            ref={scrollerRef}
            className="max-h-[650px] h-full p-4 after:w-full after:static after:block after:h-4 after:content-[''] overflow-auto"
          >
            <div className="grid grid-cols-[auto_1fr] w-full">
              {tokens.map((line, i) => {
                const lineProps = getLineProps({
                  line,
                  key: i,
                });
                const isHighlighted = isHighlighting(i + 1);
                const isHighlightStart = highlight && highlight[0] === i + 1;
                const isHighlightEnd = highlight && highlight[1] === i + 1;

                return (
                  <Fragment key={i}>
                    {/* Line number cell */}
                    <Link
                      id={`L${i + 1}`}
                      href={{
                        hash: `#L${i + 1}`,
                        search: searchParams.toString(),
                      }}
                      scroll={false}
                      aria-selected={isHighlighted}
                      className={cn(
                        'text-[#49494f] relative text-[13px] font-light font-[MonoLisa,_Menlo,_monospace] align-middle scroll-mt-[325px] select-none pr-3 cursor-pointer hover:text-slate-12 transition-colors',
                        'aria-selected:text-cyan-11 aria-selected:hover:text-cyan-11 aria-selected:bg-cyan-5 [&+*]:aria-selected:bg-cyan-5',
                        isHighlightStart && 'rounded-tl-sm',
                        isHighlightEnd && 'rounded-bl-sm',
                      )}
                      type="button"
                    >
                      {i + 1}
                    </Link>

                    {/* Code content cell */}
                    <div
                      {...lineProps}
                      className={cn('whitespace-pre transition-colors', {
                        "before:mr-2 before:text-slate-11 before:content-['$']":
                          language === 'bash' && tokens.length === 1,
                      })}
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
                          <Fragment key={key}>
                            <span {...tokenProps} />
                          </Fragment>
                        );
                      })}
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
          <div
            className="absolute bottom-0 left-0 h-px w-[200px]"
            style={{
              background:
                'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
            }}
          />
        </>
      )}
    </Highlight>
  );
};
