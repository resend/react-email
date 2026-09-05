import { NextResponse } from 'next/server';
import {
  communityItems,
  officialItems,
} from '../../../../components/template-list-data';
import { markdownHeaders } from '../components/markdown';
import { templatesMarkdown } from './markdown';

export const dynamic = 'force-static';

export function GET() {
  return new NextResponse(templatesMarkdown(officialItems, communityItems), {
    headers: markdownHeaders,
  });
}
