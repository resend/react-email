import { renderAsync } from "@react-email/components";
import { notFound } from "next/navigation";
import { slugify } from "../../../utils/slugify";
import { Layout } from "../../../../components/_components/layout";
import { componentsStructure } from "../../../../components/structure";
import type { ImportedComponent } from "../get-components";
import { getImportedComponentsFor } from "../get-components";
import PageTransition from "../../../components/page-transition";
import type { RenderedComponent } from "../../../components/components-view";
import { ComponentsView } from "../../../components/components-view";

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

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const slug = decodeURIComponent(params.slug);
  const foundCategory = componentsStructure.find(
    (category) => slugify(category.name) === slug,
  );

  if (!foundCategory) {
    notFound();
  }

  return {
    title: foundCategory.name,
    description:
      "Open-source copy-paste components to use as building blocks with React Email.",
    alternates: {
      canonical: `/components/${params.slug}`,
    },
  };
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
        html: await renderAsync(<Layout withTailwind={false}>{component.element}</Layout>),
      } as RenderedComponent;
    }),
  );

  return (
    <>
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="hidden h-full w-full max-w-7xl grid-cols-3 gap-4 px-4 lg:grid">
          <div className="border-x border-l-slate-4 border-r-slate-3 [border-right-style:dashed]" />
          <div className="border-x border-dashed border-slate-3" />
          <div className="border-x border-l-slate-3 border-r-slate-4 [border-left-style:dashed]" />
        </div>
      </div>
      <PageTransition className="pb-10" key="about" tag="main">
        <div className="flex w-full flex-col gap-4 px-8 pb-10 pt-16">
          <h1 className="text-2xl font-bold text-slate-12">
            {foundCategory.name} Components
          </h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad,
            laudantium. Accusantium, exercitationem!
          </p>
        </div>
        <div className="relative flex w-full flex-col gap-4 border-y border-slate-4 pt-3">
          <ComponentsView components={renderedComponents} />
        </div>
      </PageTransition>
    </>
  );
};

export default ComponentPage;
