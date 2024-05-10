'use server';
import fs from 'node:fs';
import { getEmailComponent } from '../utils/get-email-component';
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

export const renderEmailByPath = async (
  emailPath: string,
): Promise<EmailRenderingResult> => {
  const result = await getEmailComponent(emailPath);

  if ('error' in result) {
    return { error: result.error };
  }

  const {
    emailComponent: Email,
    renderAsync,
    sourceMapToOriginalFile,
  } = result;

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
