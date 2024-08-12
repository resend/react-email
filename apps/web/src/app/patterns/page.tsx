import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { Topbar } from "../../components/topbar";
import { Spotlight } from "../../components/spotlight";
import { getPatterns } from "./get-patterns";

const title = "Patterns — React Email";
const description =
  "Open-source copy-paste patterns to use as building blocks with React Email";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
};

const Patterns = async () => {
  const patterns = await getPatterns();

  return (
    <div className="h-screen-ios relative mx-auto flex max-w-full flex-col px-4 text-sm text-zinc-400 md:max-w-7xl">
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="hidden h-full w-full max-w-7xl grid-cols-3 gap-4 px-4 lg:grid">
          <div className="border-x border-zinc-900" />
          <div className="border-x border-zinc-900" />
          <div className="border-x border-zinc-900" />
        </div>
      </div>
      <Topbar />
      <main className="pb-10">
        <div className="flex w-full flex-col gap-4 px-8 pb-10 pt-16">
          <h1 className="text-2xl font-bold text-zinc-50">Patterns</h1>
          <p>
            Just copy and paste, populate with your own data, and you will be
            sending proper emails in no time.
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-x-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="absolute left-1/2 top-0 h-px w-[100dvw] -translate-x-1/2 bg-zinc-900" />
          <div className="absolute bottom-0 left-1/2 h-px w-[100dvw] -translate-x-1/2 bg-zinc-900" />
          {Object.values(patterns)
            .flat()
            .map((pattern) => {
              const componentCount = Object.keys(pattern.codePerVariant).length;

              return (
                <Link href={`/patterns/${pattern.title}`} key={pattern.title}>
                  <Spotlight
                    className="group relative isolate mx-4 mt-4 flex cursor-pointer flex-col justify-end rounded-md p-4"
                    key={pattern.title}
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-md border border-zinc-900 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:border-zinc-800" />
                    <div className="relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-sm border border-dashed border-zinc-900">
                      <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),_radial-gradient(#27272A_.0313rem,transparent_.0313rem)] opacity-80 [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem]" />
                    </div>
                    <span className="mt-4 text-xs text-zinc-500">
                      {componentCount} component{componentCount > 1 && "s"}
                    </span>
                    <h3 className="mt-1 font-semibold capitalize leading-7 text-zinc-50">
                      {pattern.title}
                    </h3>
                    <p className="mt-1">
                      Lorem ipsum dolor sit amet consectetur.
                    </p>
                  </Spotlight>
                </Link>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export default Patterns;
