var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { promises as fs } from 'fs';
import path from 'path';
import { render } from '@react-email/render';
import { Layout } from '../../components/layout';
import * as React from 'react';
import { Code } from '../../components';
export const CONTENT_DIR = 'emails';
const getEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);
    const filenames = yield fs.readdir(emailsDirectory);
    const emails = filenames.map((file) => file.replace('.tsx', ''));
    return emails;
});
export const getStaticPaths = () => __awaiter(void 0, void 0, void 0, function* () {
    const emails = yield getEmails();
    const paths = emails.map((email) => {
        return { params: { slug: email } };
    });
    return { paths, fallback: true };
});
export function getStaticProps({ params }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const emails = yield getEmails();
            const Email = (yield import(`../../../emails/${params.slug}`)).default;
            const markup = render(_jsx(Email, {}), { pretty: true });
            return emails
                ? { props: { navItems: emails, slug: params.slug, markup } }
                : { notFound: true };
        }
        catch (error) {
            console.error(error);
            return { notFound: true };
        }
    });
}
const Preview = ({ navItems, markup, slug, }) => {
    const [viewMode, setViewMode] = React.useState('desktop');
    return (_jsx(Layout, Object.assign({ navItems: navItems, title: slug, viewMode: viewMode, setViewMode: setViewMode }, { children: viewMode === 'desktop' ? (_jsx("iframe", { srcDoc: markup, width: "600", height: "800", frameBorder: "0" })) : (_jsx(Code, { children: markup })) })));
};
export default Preview;
