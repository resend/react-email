'use server';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { renderAsync } from '@react-email/render';
import { emailsDirPath } from '../get-email-slugs';
import { getEmailComponent } from '../get-email-component';

export const renderEmailBySlug = async (emailSlug: string) => {
  const emailPath = path.join(emailsDirPath, emailSlug);

  const Email = await getEmailComponent(emailPath);
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
