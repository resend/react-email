import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';
import { componentsStructure } from '../../../components/structure';
import { Spotlight } from '../../components/spotlight';
import { slugify } from '../../utils/slugify';

const PatternsSection = () => {
  return (
    <section className="relative py-20 my-40">
      <div className="max-w-full flex flex-col gap-4">
        <Content component="Heading" />
        <Content component="Text" />
        <Content component="Button" />
        <div className="relative grid grid-cols-1 gap-y-4 gap-x-1 pb-5 md:grid-cols-2 lg:grid-cols-3 -ml-5">
          <div
            aria-hidden
            className="-translate-x-1/2 absolute bottom-0 left-1/2 h-px w-[100dvw] border-slate-4 border-b"
          />
          {componentsStructure.slice(0, 6).map((category, index) => {
            const slug = slugify(category.name);
            const Illustration = dynamic(
              () =>
                import(
                  `@/illustrations/${category.name
                    .toLowerCase()
                    .replace(/ /g, '-')}`
                ),
            );

            return (
              <Link
                className={classNames(
                  'group relative isolate cursor-pointer scroll-m-6 rounded-lg focus:outline-none focus:ring focus:ring-slate-2 md:before:absolute md:before:inset-0 md:before:rounded-lg md:before:border md:before:border-slate-4 md:before:border-dashed md:before:transition-colors md:before:duration-[720ms] md:before:ease-[cubic-bezier(.24,.9,.32,1.4)] md:focus:before:border-slate-6 md:hover:before:border-slate-6',
                  {
                    'md:ml-6': index % 3 === 0,
                    'md:mx-3': index % 3 === 1,
                    'md:mr-6': index % 3 === 2,
                  },
                )}
                href={`/components/${slug}`}
                key={category.name}
                tabIndex={0}
              >
                <Spotlight
                  className={classNames(
                    'relative isolate flex cursor-pointer flex-col justify-end rounded-lg bg-black p-4 group-focus:ring group-focus:ring-slate-2 md:transition-transform md:duration-[240ms] md:ease-[cubic-bezier(.36,.66,.6,1)]',
                    {
                      'md:group-hover:-translate-x-2 md:group-hover:-translate-y-2 md:group-focus:-translate-x-2 md:group-focus:-translate-y-2':
                        index % 3 === 0,
                      'md:group-hover:-translate-y-2 md:group-focus:-translate-y-2':
                        index % 3 === 1,
                      'md:group-hover:-translate-y-2 md:group-focus:-translate-y-2 md:group-focus:translate-x-2 md:group-hover:translate-x-2':
                        index % 3 === 2,
                    },
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-lg border border-slate-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:border-slate-6 group-focus:border-slate-6" />
                  <div className="relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-sm text-slate-300">
                    <div className="absolute inset-0 bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),_radial-gradient(#27272A_.0313rem,transparent_.0313rem)] bg-transparent opacity-80 [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem]" />
                    <Illustration />
                  </div>
                  <h3 className="relative z-[2] mt-4 font-semibold text-slate-12 capitalize leading-7 tracking-wide">
                    {category.name}
                  </h3>
                  <span className="relative z-[2] text-slate-11 text-xs">
                    {category.components.length} component
                    {category.components.length > 1 && 's'}
                  </span>
                </Spotlight>
              </Link>
            );
          })}
        </div>
      </div>
      <BgGradient direction="left" />
      <BgGradient direction="right" />
      <Image
        alt=""
        className="pointer-events-none absolute -translate-x-96 -top-40 z-[3] select-none mix-blend-lighten"
        fill
        priority
        src="/static/bg.png"
      />
    </section>
  );
};

const Content = ({ component }: { component: string }) => {
  return (
    <div className="relative">
      <ContentComponent component={component} />
      <div
        aria-hidden
        className="absolute pointer-events-none inset-0 border-y border-slate-4 w-[200dvw] -left-[100dvw]"
      />
    </div>
  );
};

const ContentComponent = ({ component }: { component: string }) => {
  switch (component) {
    case 'Heading':
      return (
        <Heading size="8" weight="medium" className="text-white/80">
          Ready-to-use Components
        </Heading>
      );
    case 'Text':
      return (
        <Text size="5" className="block max-w-[500px]">
          Just copy and paste, populate with your own data, and you will be
          sending proper emails in no time.
        </Text>
      );
    case 'Button':
      return (
        <Button asChild size="4" className="w-fit my-1.5 rounded-xl">
          <Link href="/components">View all patterns</Link>
        </Button>
      );
    default:
      return null;
  }
};

const BgGradient = ({ direction }: { direction: 'left' | 'right' }) => {
  if (direction === 'left') {
    return (
      <div
        aria-hidden
        className="absolute pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] -left-12 top-0 w-8 h-full border-x border-x-slate-4 bg-[image:repeating-linear-gradient(315deg,_rgba(255,255,255,0.08)_0,_rgba(255,255,255,0.08)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] -right-12 top-0 w-8 h-full border-x border-x-slate-4 bg-[image:repeating-linear-gradient(315deg,_rgba(255,255,255,0.08)_0,_rgba(255,255,255,0.08)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"
    />
  );
};

export default PatternsSection;
