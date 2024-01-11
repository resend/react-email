'use server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { renderAsync } from '@react-email/render';
import { getEmailComponent } from '../utils/get-email-component';
import { emailsDirectoryAbsolutePath } from '../utils/emails-directory-absolute-path';
import type { EmailTemplate } from '../utils/types/email-template';

export type EmailRenderingResult =
  | {
      markup: string;
      plainText: string;
      reactMarkup: string;
    }
  | {
      error: {
        name: string;
        stack: string | undefined;
        cause: unknown;
        message: string;
      };
    };

export const renderEmailBySlug = async (
  emailSlug: string,
): Promise<EmailRenderingResult> => {
  const emailPath = path.join(emailsDirectoryAbsolutePath, emailSlug);

  let Email: EmailTemplate;

  try {
    Email = await getEmailComponent(emailPath);
  } catch (exception) {
    const error = exception as Error;
    return {
      error: {
        name: error.name,
        stack: error.stack,
        message: error.message,
        cause: error.cause,
      },
    };
  }

  const previewProps = Email.PreviewProps || {};
  const markup = await renderAsync(<Email {...previewProps} />, {
    pretty: true,
  });
  const plainText = await renderAsync(<Email {...previewProps} />, {
    plainText: true,
  });

  const reactMarkup = await fs.readFile(emailPath, 'utf-8');

  return {
    markup,
    plainText,
    reactMarkup,
  };
};
