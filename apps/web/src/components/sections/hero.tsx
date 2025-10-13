import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { Code } from "@/components/code";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { HeroCanvas } from "./hero-canvas";

const HeroSection = () => {
  return (
    <>
      <HeroCanvas />

      <section className="flex flex-col h-[calc(100dvh-11.5rem)] lg:max-w-7xl mx-auto max-lg:items-center justify-center relative w-full pt-12 lg:pt-0 pointer-events-none">
        {/* Left Column - Content */}
        <div className="w-full lg:w-[44rem] z-10 px-4 lg:px-12 pointer-events-auto">
          <div className="mb-8 flex justify-center lg:justify-start">
            <Image
              alt="React Email Logo"
              height="100"
              src="/brand/logo.png"
              width="100"
            />
          </div>
          <Heading
            className="!text-white/80 relative mb-8 text-center lg:text-left before:absolute before:top-0 before:left-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-[length:200%] before:bg-shine before:bg-clip-text before:text-transparent before:content-['The_next_generation_of_writing_emails'] before:select-none before:pointer-events-none text-balance"
            weight="medium"
            size="10"
          >
            The next generation of writing emails
          </Heading>
          <div className="max-w-xl max-lg:mx-auto text-center lg:text-left">
            <Text size="5" className="text-pretty">
              React Email is a next-generation collection of unstyled components
              for creating beautiful emails using React, Tailwind, and
              TypeScript.
            </Text>
          </div>
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 flex-wrap">
            <Button asChild size="4">
              <Link href="/components">
                Explore components
                <ArrowRightIcon size={16} />
              </Link>
            </Button>
            <Code className="lg:!inline-flex hidden max-w-max">
              npx create-email@latest
            </Code>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
