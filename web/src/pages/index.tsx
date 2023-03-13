import { Button } from '../components/button';
import { Code } from '../components/code';
import { Footer } from '../components/footer';
import { Heading } from '../components/heading';
import { IconArrowRight } from '../components/icons';
import { Text } from '../components/text';
import { Topbar } from '../components/topbar';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Web() {
  const title = 'React Email';
  const description =
    'A collection of high-quality, unstyled components for creating beautiful emails.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </Head>
      <div className="h-screen-ios relative z-20 mx-auto flex h-screen max-w-7xl flex-col justify-between px-4">
        <Topbar />
        <div className="relative mx-auto flex max-w-3xl flex-col justify-center">
          <div className="max-w-[725px] text-center">
            <Heading
              className="before:bg-shine relative mb-8 !text-white/80 before:absolute before:left-0 before:top-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-[length:200%] before:bg-clip-text before:text-transparent before:content-['The_next_generation_of_writing_emails'] "
              size="10"
            >
              The next generation of writing emails
            </Heading>
            <div className="sm:px-20">
              <Text size="5">
                A collection of high-quality, unstyled components for creating
                beautiful emails using React and TypeScript.
              </Text>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="4">
              <Link href="https://react.email/docs">
                Explore components
                <IconArrowRight />
              </Link>
            </Button>
            <Code language="bash" className="hidden max-w-max md:!inline-flex">
              npx create-email@latest
            </Code>
          </div>
        </div>
        <Footer />
      </div>
      <Image
        className="absolute top-[220px] left-0 z-[10] h-full w-full select-none md:top-0"
        fill
        priority
        src="/static/bg.png"
        alt={''}
        style={{ position: 'absolute' }}
      />
    </>
  );
}
