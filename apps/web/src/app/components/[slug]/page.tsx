"use server";
import { renderAsync } from "@react-email/components";
import { slugify } from "../../../utils/slugify";
import { Topbar } from "../../../components/topbar";
import type { RenderedComponent } from "../../../components/component-view-wrapper";
import { ComponentViewWrapper } from "../../../components/component-view-wrapper";
import { Layout } from "../../../../components/_components/layout";
import { componentsStructure } from "../../../../components/structure";
import type { ImportedComponent} from "../get-components";
import { getImportedComponentsFor } from "../get-components";

interface ComponentPageParams {
  params: {
    slug: string;
  };
}

export const generateStaticParams = async () => {
  return componentsStructure.map((category) => ({
    params: { slug: slugify(category.name) },
  }));
};

const ComponentPage: React.FC<ComponentPageParams> = async ({ params }) => {
  const slug = decodeURIComponent(params.slug);
  const foundCategory = componentsStructure.find(
    (category) => slugify(category.name) === slug,
  );

  if (!foundCategory) return <p>Component category not found.</p>;

  const renderedComponents: RenderedComponent[] = await Promise.all(
    (await getImportedComponentsFor(foundCategory)).map(async (component) => {
      const componentWithoutElement: Omit<ImportedComponent, "element"> = {
        ...component,
      };
      delete (
        componentWithoutElement as Omit<ImportedComponent, "element"> & {
          element?: React.ReactElement;
        }
      ).element;
      return {
        ...componentWithoutElement,
        html: await renderAsync(<Layout>{component.element}</Layout>),
      } as RenderedComponent;
    }),
  );

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
            {foundCategory.name} Components
          </h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad,
            laudantium. Accusantium, exercitationem!
          </p>
        </div>
        <ComponentViewWrapper components={renderedComponents} />
      </main>
    </div>
  );
};

export default ComponentPage;
