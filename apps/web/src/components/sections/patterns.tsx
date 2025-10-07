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
    <section className="relative py-20 my-24 md:my-40">
      <div className="flex flex-col gap-4 max-md:px-6">
        <Content component="Heading" />
        <Content component="Text" />
        <Content component="Button" />
        <div className="relative grid grid-cols-1 gap-y-4 gap-x-4 lg:gap-x-1 pb-5 md:grid-cols-2 lg:grid-cols-3 lg:-ml-5">
          <div
            aria-hidden
            className="-translate-x-1/2 absolute bottom-0 left-1/2 h-px w-[100dvw] border-slate-4 border-dashed border-b [mask-image:linear-gradient(to_right,transparent_0%,black_90%)] max-lg:hidden"
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
                  'group relative isolate cursor-pointer scroll-m-6 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-2 md:before:absolute md:before:inset-0 md:before:rounded-lg md:before:border md:before:border-slate-4 md:before:border-dashed md:before:transition-colors md:before:duration-[720ms] md:before:ease-[cubic-bezier(.24,.9,.32,1.4)] md:focus-visible:before:border-slate-6 md:hover:before:border-slate-6',
                  {
                    'lg:ml-6': index % 3 === 0,
                    'lg:mx-3': index % 3 === 1,
                    'lg:mr-6': index % 3 === 2,
                  },
                )}
                href={`/components/${slug}`}
                key={category.name}
                tabIndex={0}
              >
                <Spotlight
                  className={classNames(
                    'relative isolate flex cursor-pointer flex-col justify-end rounded-lg bg-black p-4 group-focus-visible:ring group-focus-visible:ring-slate-2 md:transition-transform md:duration-[240ms] md:ease-[cubic-bezier(.36,.66,.6,1)]',
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
                  <div className="pointer-events-none absolute inset-0 rounded-lg border border-slate-4 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] md:group-hover:border-slate-6 md:group-focus:border-slate-6" />
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
        className="pointer-events-none absolute md:-translate-x-96 -top-40 z-[3] select-none mix-blend-lighten"
        fill
        priority
        src="/static/bg.png"
      />
    </section>
  );
};

const Content = ({ component }: { component: string }) => {
  return (
    <div className="relative flex flex-col max-md:items-center max-md:justify-center">
      <ContentComponent component={component} />
      <div
        aria-hidden
        className="absolute pointer-events-none inset-0 border-y border-slate-4 border-dashed w-[200dvw] -left-[100dvw] [mask-image:linear-gradient(-45deg,transparent_0%,black_40%,black_90%,transparent_100%)]"
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
        <Text size="5" className="block max-w-[400px] text-balance">
          Copy and paste. Add your own data. Send.
        </Text>
      );
    case 'Button':
      return (
        <Button asChild size="4" className="w-fit my-1.5 rounded-xl">
          <Link href="/components">View all components</Link>
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
        className="absolute pointer-events-none [mask-image:linear-gradient(45deg,transparent_0%,black_40%,black_90%,transparent_100%)] -left-12 -top-10 w-8 h-1/2 border-x border-dashed border-x-slate-3 bg-[size:10px_10px] bg-fixed max-lg:hidden"
      />
    );
  }

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none [mask-image:linear-gradient(-45deg,transparent_0%,black_40%,black_90%,transparent_100%)] -right-12 -bottom-40 w-8 h-2/3 border-x border-x-slate-3 border-dashed bg-[size:10px_10px] bg-fixed max-lg:hidden"
    />
  );
};

export default PatternsSection;
