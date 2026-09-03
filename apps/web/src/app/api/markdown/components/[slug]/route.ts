import { NextResponse } from 'next/server';
import { componentsStructure } from '../../../../../../components/structure';
import { slugify } from '../../../../../utils/slugify';
import { getImportedComponentsFor } from '../../../../components/get-imported-components-for';
import { categoryMarkdown, markdownHeaders } from '../markdown';

export const dynamic = 'force-static';

export const generateStaticParams = () =>
  componentsStructure.map((category) => ({ slug: slugify(category.name) }));

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const category = componentsStructure.find(
    (candidate) => slugify(candidate.name) === slug,
  );
  if (!category) {
    return new NextResponse(
      `No component category "${slug}". The list of categories is at https://react.email/components.md`,
      {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      },
    );
  }

  const components = await getImportedComponentsFor(category);
  return new NextResponse(categoryMarkdown(category, components), {
    headers: markdownHeaders,
  });
}
