import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../components/button';
import { Code } from '../components/code';
import { Heading } from '../components/heading';
import { Text } from '../components/text';

const sentence = "The next generation of writing emails";
const words = sentence.split(" ");
  
const Home = () => (
  <>
    <Image
      alt=""
      className="pointer-events-none absolute inset-0 z-[3] select-none mix-blend-lighten"
      fill
      priority
      src="/static/bg.png"
    />
    <main className="relative mx-auto flex max-w-3xl flex-col justify-center">
      <div className="max-w-full text-center md:max-w-[45rem]">
        <div className="mb-8 flex items-center justify-center">
          <Image
            alt="React Email Logo"
            height="120"
            src="/brand/logo.png"
            width="120"
          />
        </div>
        <Heading
          className="relative mb-8 !text-white/80 before:absolute before:left-0 before:top-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-shine before:bg-[length:200%] before:bg-clip-text before:text-transparent before:content-['The_next_generation_of_writing_emails']"
          size="10"
        >
          <div className="relative mb-8">
            {words.map((word, index) => (
            <span
            key={index}
            className={`text-white opacity-0 animate-fadeIn delay-${index * 300}`}
            style={{
              animation: `fadeIn 0.5s forwards ${index * 0.3}s`,
            }}
          >
            {word}{" "}
           </span>
           ))}
         </div>  
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
          <Link href="/components">
            Explore components
            <ArrowRightIcon size={16} />
          </Link>
        </Button>
        <Code className="hidden max-w-max md:!inline-flex">
          npx create-email@latest
        </Code>
      </div>
    </main>
  </>
);

export default Home;
