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
import { Heading } from '../components';
import { Layout } from '../components/layout';
export const CONTENT_DIR = 'emails';
const getEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    const emailsDirectory = path.join(process.cwd(), CONTENT_DIR);
    const filenames = yield fs.readdir(emailsDirectory);
    const emails = filenames.map((file) => file.replace('.tsx', ''));
    return emails;
});
export function getStaticProps({ params }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const emails = yield getEmails();
            return emails ? { props: { navItems: emails } } : { notFound: true };
        }
        catch (error) {
            console.error(error);
            return { notFound: true };
        }
    });
}
const Home = ({ navItems }) => {
    return (_jsx(Layout, Object.assign({ navItems: navItems }, { children: _jsx(Heading, { children: "Hi" }) })));
};
export default Home;
