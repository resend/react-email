var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from 'path';
import copy from 'cpy';
import { CLIENT_EMAILS_PATH, DOT_EMAIL_DEV, NODE_MODULES_PREVIEW_PATH, PACKAGE_EMAILS_PATH, } from './contants';
export const copyFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'pages', 'preview'), path.join(DOT_EMAIL_DEV, 'src', 'pages', 'preview'));
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'pages', '_app.tsx'), path.join(DOT_EMAIL_DEV, 'src', 'pages'));
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'pages', '_document.tsx'), path.join(DOT_EMAIL_DEV, 'src', 'pages'));
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'pages', 'index.tsx'), path.join(DOT_EMAIL_DEV, 'src', 'pages'));
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'styles'), path.join(DOT_EMAIL_DEV, 'src', 'styles'));
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'components'), path.join(DOT_EMAIL_DEV, 'src', 'components'));
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'src', 'utils'), path.join(DOT_EMAIL_DEV, 'src', 'utils'));
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'next-env.d.ts'), DOT_EMAIL_DEV);
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'package.json'), DOT_EMAIL_DEV);
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'postcss.config.js'), DOT_EMAIL_DEV);
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'tailwind.config.js'), DOT_EMAIL_DEV);
        yield copy(path.join(NODE_MODULES_PREVIEW_PATH, 'tsconfig.json'), DOT_EMAIL_DEV);
        yield copy(CLIENT_EMAILS_PATH, PACKAGE_EMAILS_PATH);
    }
    catch (error) {
        console.error({ error });
    }
});
