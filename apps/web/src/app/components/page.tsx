import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import classNames from "classnames";
import { Topbar } from "../../components/topbar";
import { Spotlight } from "../../components/spotlight";
import { slugify } from "../../utils/slugify";
import { componentsStructure } from "../../../components/structure";

const title = "Components — React Email";
const description =
  "Open-source copy-paste components to use as building blocks with React Email";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  alternates: {
    canonical: "/components",
  },
};

const ComponentsPage = async () => {
  return (
    <div className="relative mx-auto flex max-w-full flex-col px-4 text-sm text-zinc-400 h-screen-ios md:max-w-7xl">
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
          <h1 className="text-2xl font-bold text-zinc-50">Components</h1>
          <p>
            Just copy and paste, populate with your own data, and you will be
            sending proper emails in no time.
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-x-4 pb-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="absolute left-1/2 top-0 h-px w-[100dvw] -translate-x-1/2 bg-zinc-900" />
          <div className="absolute bottom-0 left-1/2 h-px w-[100dvw] -translate-x-1/2 bg-zinc-900" />
          {componentsStructure.map((category, index) => {
            const slug = slugify(category.name);

            return (
              <Link
                className="group relative isolate mx-6 mt-7 cursor-pointer md:before:absolute md:before:inset-0 md:before:rounded-md md:before:border md:before:border-dashed md:before:border-zinc-900 md:before:transition-colors md:before:duration-[720ms] md:before:ease-[cubic-bezier(.24,.9,.32,1.4)] md:hover:before:border-zinc-800"
                href={`/components/${slug}`}
                key={category.name}
              >
                <Spotlight
                  className={classNames(
                    "relative isolate flex cursor-pointer flex-col justify-end rounded-md bg-black p-4 md:transition-transform md:duration-[240ms] md:ease-[cubic-bezier(.36,.66,.6,1)]",
                    {
                      "md:group-hover:-translate-x-2 md:group-hover:-translate-y-2":
                        index % 3 === 0,
                      "md:group-hover:-translate-y-2": index % 3 === 1,
                      "md:group-hover:-translate-y-2 md:group-hover:translate-x-2":
                        index % 3 === 2,
                    },
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 rounded-md border border-zinc-900 transition-colors duration-300 ease-[cubic-bezier(.36,.66,.6,1)] group-hover:border-zinc-800" />
                  <div className="relative flex aspect-[2/1] items-center justify-center overflow-hidden rounded-sm border border-dashed border-zinc-900">
                    <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),_radial-gradient(#27272A_.0313rem,transparent_.0313rem)] opacity-80 [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem]" />
                  </div>
                  <h3 className="mt-4 font-semibold capitalize leading-7 text-zinc-50">
                    {category.name}
                  </h3>
                  <span className="mt-1 text-xs text-zinc-500">
                    {category.components.length} component
                    {category.components.length > 1 && "s"}
                  </span>
                </Spotlight>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ComponentsPage;
