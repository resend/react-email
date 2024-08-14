import * as Tabs from "@radix-ui/react-tabs";
import { slugify } from "../../../utils/slugify";
import { Topbar } from "../../../components/topbar";
import { CodePreview } from "../../../components/code-preview";
import { CodeRenderer } from "../../../components/code-renderer";
import { ComponentPreview } from "../../../components/component-preview";
import { getCategories } from "../get-categories";
import { getPatternsIn } from "../get-patterns";

interface PatternPageParams {
  params: {
    slug: string;
  };
}

export const generateStaticParams = async () => {
  const categories = await getCategories();

  return categories.map((category) => ({
    params: { slug: slugify(category.name) },
  }));
};

const PatternPage: React.FC<PatternPageParams> = async ({ params }) => {
  const slug = decodeURIComponent(params.slug);
  const categories = await getCategories();
  const foundCategory = categories.find(
    (category) => slugify(category.name) === slug,
  );

  if (!foundCategory) return <p>Pattern category not found.</p>;

  const patterns = await getPatternsIn(foundCategory.name);

  return (
    <div className="relative mx-auto flex min-h-[100dvh] max-w-full flex-col px-4 text-sm font-normal text-zinc-400 h-screen-ios md:max-w-7xl">
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
          <h1 className="text-2xl font-bold text-zinc-50">
            {patterns[0].title}
          </h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad,
            laudantium. Accusantium, exercitationem!
          </p>
        </div>
        <div className="relative flex flex-col gap-8 pt-4">
          {Object.entries(patterns[0].codePerVariant).map(
            ([variant, fileContent]) => {
              const Component = patterns[0].component;

              return (
                <Tabs.Root
                  className="relative flex flex-col gap-2 border-b border-t border-zinc-900 pb-1"
                  defaultValue="preview"
                  key={variant}
                >
                  <div className="absolute right-0 top-0 h-px w-[100dvw] bg-zinc-900" />
                  <div className="flex w-full items-center gap-4 px-8 py-1">
                    <div className="flex shrink grow basis-0 truncate text-base font-medium leading-7 text-zinc-200">
                      <span>{patterns[0].title}</span>
                    </div>
                    <Tabs.List className="flex w-fit items-center gap-4">
                      <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
                      <Tabs.Trigger value="code">Code</Tabs.Trigger>
                      <div className="ml-2 hidden h-5 w-px bg-zinc-900 sm:block" />
                      <button tabIndex={0} type="button">
                        <span>Copy</span>
                      </button>
                    </Tabs.List>
                  </div>
                  <Tabs.Content
                    className="relative mx-8 my-4 h-fit rounded-md border border-zinc-900"
                    value="preview"
                  >
                    <div className="absolute inset-0 bg-transparent bg-[radial-gradient(#27272A_.0313rem,transparent_.0313rem),_radial-gradient(#27272A_.0313rem,transparent_.0313rem)] opacity-80 [background-position:0_0,.625rem_.625rem] [background-size:1.25rem_1.25rem]" />
                    <ComponentPreview component={<Component />} />
                  </Tabs.Content>
                  <Tabs.Content
                    className="relative mx-8 my-4 rounded-md border border-zinc-900"
                    value="code"
                  >
                    <CodePreview code={fileContent || ""}>
                      <CodeRenderer code={fileContent || ""} lang="tsx" />
                    </CodePreview>
                  </Tabs.Content>
                </Tabs.Root>
              );
            },
          )}
        </div>
      </main>
    </div>
  );
};

export default PatternPage;
