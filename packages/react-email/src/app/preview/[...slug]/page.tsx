import path from 'node:path';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getEmailPathFromSlug } from '../../../actions/get-email-path-from-slug';
import { renderEmailByPath } from '../../../actions/render-email-by-path';
import { Shell } from '../../../components/shell';
import { Toolbar } from '../../../components/toolbar';
import type { LintingRow } from '../../../components/toolbar/linter';
import type { SpamCheckingResult } from '../../../components/toolbar/spam-assassin';
import { PreviewProvider } from '../../../contexts/preview';
import { getEmailsDirectoryMetadata } from '../../../utils/get-emails-directory-metadata';
import { getLintingSources, loadLintingRowsFrom } from '../../../utils/linting';
import { emailsDirectoryAbsolutePath, isBuilding } from '../../env';
import Home from '../../page';
import Preview from './preview';

export const dynamicParams = true;

export const dynamic = 'force-dynamic';

export interface PreviewParams {
  slug: string[];
}

const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<PreviewParams>;
}) => {
  const params = await paramsPromise;
  // will come in here as segments of a relative path to the email
  // ex: ['authentication', 'verify-password.tsx']
  const slug = decodeURIComponent(params.slug.join('/'));
  const emailsDirMetadata = await getEmailsDirectoryMetadata(
    emailsDirectoryAbsolutePath,
  );

  if (typeof emailsDirMetadata === 'undefined') {
    throw new Error(
      `Could not find the emails directory specified under ${emailsDirectoryAbsolutePath}!

This is most likely not an issue with the preview server. Maybe there was a typo on the "--dir" flag?`,
    );
  }

  let emailPath: string;
  try {
    emailPath = await getEmailPathFromSlug(slug);
  } catch (exception) {
    if (exception instanceof Error) {
      console.warn(exception.message);
      redirect('/');
    }
    throw exception;
  }

  const serverEmailRenderingResult = await renderEmailByPath(emailPath);

  if (isBuilding && 'error' in serverEmailRenderingResult) {
    throw new Error(serverEmailRenderingResult.error.message, {
      cause: serverEmailRenderingResult.error,
    });
  }

  let spamCheckingResult: SpamCheckingResult | undefined = undefined;
  let lintingRows: LintingRow[] | undefined = undefined;

  if (isBuilding && !('error' in serverEmailRenderingResult)) {
    const lintingSources = getLintingSources(
      serverEmailRenderingResult.markup,
      serverEmailRenderingResult.reactMarkup,
      emailPath,
      '',
    );
    lintingRows = [];
    for await (const row of loadLintingRowsFrom(lintingSources)) {
      lintingRows.push(row);
    }
    lintingRows.sort((a, b) => {
      if (a.result.status === 'error' && b.result.status === 'warning') {
        return -1;
      }

      if (a.result.status === 'warning' && b.result.status === 'error') {
        return 1;
      }

      return 0;
    });

    const response = await fetch('https://react.email/api/check-spam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html: serverEmailRenderingResult.markup,
        plainText: serverEmailRenderingResult.plainText,
      }),
    });
    if (response.ok) {
      const responseBody = (await response.json()) as
        | { error: string }
        | SpamCheckingResult;
      if ('error' in responseBody) {
        throw new Error('Failed doing Spam Check', {
          cause: responseBody.error,
        });
      }

      spamCheckingResult = responseBody;
    } else {
      throw new Error('Something went wrong during Spam Checking', {
        cause: await response.text(),
      });
    }
  }

  return (
    <PreviewProvider
      emailSlug={slug}
      emailPath={emailPath}
      serverRenderingResult={serverEmailRenderingResult}
    >
      <Shell currentEmailOpenSlug={slug}>
        {/* This suspense is so that this page doesn't throw warnings */}
        {/* on the build of the preview server de-opting into         */}
        {/* client-side rendering on build                            */}
        <Suspense fallback={<Home />}>
          <Preview emailTitle={path.basename(emailPath)} />

          <Toolbar
            serverLintingRows={lintingRows}
            serverSpamCheckingResult={spamCheckingResult}
          />
        </Suspense>
      </Shell>
    </PreviewProvider>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Promise<PreviewParams>;
}) {
  const { slug } = await params;

  return { title: `${path.basename(slug.join('/'))} — React Email` };
}

export default Page;
