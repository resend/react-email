import path from 'path';
import copy from 'cpy';
import {
  CLIENT_EMAILS_PATH,
  DOT_EMAIL_DEV,
  NODE_MODULES_PREVIEW_PATH,
  PACKAGE_EMAILS_PATH,
} from './contants';

export const copyFiles = async () => {
  try {
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'pages', 'preview'),
      path.join(DOT_EMAIL_DEV, 'src', 'pages', 'preview'),
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'pages', '_app.tsx'),
      path.join(DOT_EMAIL_DEV, 'src', 'pages'),
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'pages', '_document.tsx'),
      path.join(DOT_EMAIL_DEV, 'src', 'pages'),
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'pages', 'index.tsx'),
      path.join(DOT_EMAIL_DEV, 'src', 'pages'),
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'styles'),
      path.join(DOT_EMAIL_DEV, 'src', 'styles'),
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'components'),
      path.join(DOT_EMAIL_DEV, 'src', 'components'),
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'utils'),
      path.join(DOT_EMAIL_DEV, 'src', 'utils'),
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'next-env.d.ts'),
      DOT_EMAIL_DEV,
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'package.json'),
      DOT_EMAIL_DEV,
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'postcss.config.js'),
      DOT_EMAIL_DEV,
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'tailwind.config.js'),
      DOT_EMAIL_DEV,
    );
    await copy(
      path.join(NODE_MODULES_PREVIEW_PATH, 'tsconfig.json'),
      DOT_EMAIL_DEV,
    );
    await copy(CLIENT_EMAILS_PATH, PACKAGE_EMAILS_PATH);
  } catch (error) {
    console.error({ error });
  }
};
