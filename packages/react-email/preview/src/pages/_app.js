import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/globals.css';
import { Inter } from '@next/font/google';
import classnames from 'classnames';
import Head from 'next/head';
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});
function MyApp({ Component, pageProps }) {
    return (_jsxs("div", Object.assign({ className: classnames(inter.variable, 'font-sans') }, { children: [_jsxs(Head, { children: [_jsx("title", { children: "React Email" }), _jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), _jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com" }), _jsx("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap", rel: "stylesheet" })] }), _jsx(Component, Object.assign({}, pageProps))] })));
}
export default MyApp;
