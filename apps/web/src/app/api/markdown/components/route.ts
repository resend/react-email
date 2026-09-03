import { NextResponse } from 'next/server';
import { componentsStructure } from '../../../../../components/structure';
import { componentsIndexMarkdown, markdownHeaders } from './markdown';

export const dynamic = 'force-static';

export function GET() {
  return new NextResponse(componentsIndexMarkdown(componentsStructure), {
    headers: markdownHeaders,
  });
}
