import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
    return (_jsxs(Html, Object.assign({ lang: "en" }, { children: [_jsx(Head, {}), _jsxs("body", Object.assign({ className: "bg-black text-slate-12 font-sans" }, { children: [_jsx(Main, {}), _jsx(NextScript, {})] }))] })));
}
