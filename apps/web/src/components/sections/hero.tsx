import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Code } from '@/components/code';
import { Heading } from '@/components/heading';
import { Text } from '@/components/text';

const HeroSection = () => {
  return (
    <>
      <section className="relative mx-auto flex max-w-3xl flex-col justify-center h-[calc(100vh-11rem)]">
        <Image
          alt=""
          className="pointer-events-none absolute inset-0 -top-40 z-[3] scale-150 select-none mix-blend-lighten"
          fill
          priority
          src="/static/bg.png"
        />
        <div className="max-w-full text-center md:max-w-[45rem] md:mx-auto">
          <div className="mb-8 flex items-center justify-center">
            <Image
              alt="React Email Logo"
              height="120"
              src="/brand/logo.png"
              width="120"
            />
          </div>
          <Heading
            className="!text-white/80 relative mb-8 before:absolute before:top-0 before:left-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-[length:200%] before:bg-shine before:bg-clip-text before:text-transparent before:content-['Write_emails_as_modern_as_your_stack'] before:select-none before:pointer-events-none text-balance"
            weight="medium"
            size="10"
          >
            Write emails as modern as your stack
          </Heading>
          <div className="sm:px-16">
            <Text size="5" className="text-pretty">
              React Email is a next-generation collection of unstyled components for creating
              beautiful emails using React, Tailwind, and TypeScript.
            </Text>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Button asChild size="4">
            <Link href="/components">
              Explore components
              <ArrowRightIcon size={16} />
            </Link>
          </Button>
          <Code className="md:!inline-flex hidden max-w-max">
            npx create-email@latest
          </Code>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
