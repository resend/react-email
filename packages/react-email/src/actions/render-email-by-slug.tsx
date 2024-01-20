'use server';
import fs from 'node:fs';
import path from 'node:path';
import { renderAsync } from '@react-email/render';
import { getEmailComponent } from '../utils/get-email-component';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';
import type { ErrorObject } from '../utils/types/error-object';
import { improveErrorWithSourceMap } from '../utils/improve-error-with-sourcemap';

export interface RenderedEmailMetadata {
  markup: string;
  plainText: string;
  reactMarkup: string;
}

export type EmailRenderingResult =
  | RenderedEmailMetadata
  | {
      error: ErrorObject;
    };

export const renderEmailBySlug = async (
  emailSlug: string,
): Promise<EmailRenderingResult> => {
  const emailPathWithoutExtension = path.join(
    emailsDirectoryAbsolutePath,
    emailSlug,
  );

  let emailPath: string;
  if (
    ['.tsx', '.jsx', '.js'].includes(path.extname(emailPathWithoutExtension)) &&
    fs.existsSync(emailPathWithoutExtension)
  ) {
    emailPath = emailPathWithoutExtension;
  } else if (fs.existsSync(`${emailPathWithoutExtension}.tsx`)) {
    emailPath = `${emailPathWithoutExtension}.tsx`;
  } else if (fs.existsSync(`${emailPathWithoutExtension}.jsx`)) {
    emailPath = `${emailPathWithoutExtension}.jsx`;
  } else if (fs.existsSync(`${emailPathWithoutExtension}.js`)) {
    emailPath = `${emailPathWithoutExtension}.jsx`;
  } else {
    throw new Error(
      `Could not find your email file based on the slug by guessing the file extension. Tried .tsx, .jsx and .js.

This is most likely not an issue with the preview server. It could be that the email doesn't exist.`,
    );
  }

  const result = await getEmailComponent(emailPath);

  if ('error' in result) {
    return { error: result.error };
  }

  const { emailComponent: Email, sourceMapToOriginalFile } = result;

  const previewProps = Email.PreviewProps || {};
  const EmailComponent = Email as React.FC;
  try {
    const markup = await renderAsync(<EmailComponent {...previewProps} />, {
      pretty: true,
    });
    const plainText = await renderAsync(<EmailComponent {...previewProps} />, {
      plainText: true,
    });

    const reactMarkup = await fs.promises.readFile(emailPath, 'utf-8');

    return {
      markup,
      plainText,
      reactMarkup,
    };
  } catch (exception) {
    const error = exception as Error;

    return {
      error: improveErrorWithSourceMap(
        error,
        emailPath,
        sourceMapToOriginalFile,
      ),
    };
  }
};
