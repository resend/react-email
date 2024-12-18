import Link from 'next/link';
import { notFound } from 'next/navigation';
import { componentsStructure } from '../../../../components/structure';
import { ComponentsView } from '../../../components/components-view';
import { IconArrowLeft } from '../../../components/icons/icon-arrow-left';
import PageTransition from '../../../components/page-transition';
import { slugify } from '../../../utils/slugify';
import { getImportedComponentsFor } from '../get-imported-components-for';

interface ComponentPageParams {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-static';

export const generateStaticParams = async () => {
  return componentsStructure.map((category) => ({
    params: { slug: slugify(category.name) },
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const foundCategory = componentsStructure.find(
    (category) => slugify(category.name) === slug,
  );

  if (!foundCategory) {
    notFound();
  }

  return {
    title: `${foundCategory.name} Components - React Email`,
    description: foundCategory.description,
    openGraph: {
      title: `${foundCategory.name} Components - React Email`,
      description: foundCategory.description,
      images: [
        {
          url: 'https://react.email/static/covers/patterns.png',
        },
      ],
    },
    alternates: {
      canonical: `/components/${rawSlug}`,
    },
  };
};

const ComponentPage: React.FC<ComponentPageParams> = async ({ params }) => {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const foundCategory = componentsStructure.find(
    (category) => slugify(category.name) === slug,
  );

  if (!foundCategory) return <p>Component category not found.</p>;

  const importedComponents = await getImportedComponentsFor(foundCategory);
  return (
    <>
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="hidden h-full w-full max-w-7xl grid-cols-2 gap-4 px-4 lg:grid">
          <div className="border-l border-l-slate-4 border-r-slate-3" />
          <div className="border-r border-r-slate-4" />
        </div>
      </div>
      <PageTransition className="pb-10" key="about" tag="main">
        <div className="flex w-full flex-col gap-4 px-6 pb-10 pt-16 md:px-8">
          <div className="flex-inline flex">
            <Link
              className="mr-2 flex scroll-m-2 items-center justify-center gap-2 self-start rounded-md px-2 py-1 text-slate-11 transition transition-colors duration-200 ease-in-out hover:text-slate-12 focus:bg-slate-6 focus:outline-none focus:ring focus:ring-slate-3"
              href="/components"
            >
              <IconArrowLeft className="mt-[.0625rem]" size={14} />
              <span>Back</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-12">
            {foundCategory.name}
          </h1>
        </div>
        <div className="relative flex w-full flex-col gap-4 border-y border-slate-4 pt-3">
          <ComponentsView components={importedComponents} />
        </div>
      </PageTransition>
    </>
  );
};

export default ComponentPage;
