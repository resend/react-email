var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Logo } from './logo';
import * as React from 'react';
import classnames from 'classnames';
import Link from 'next/link';
import { Heading } from './heading';
import { useRouter } from 'next/router';
import * as Collapsible from '@radix-ui/react-collapsible';
export const Sidebar = React.forwardRef((_a, forwardedRef) => {
    var { className, navItems } = _a, props = __rest(_a, ["className", "navItems"]);
    const { query } = useRouter();
    return (_jsxs("aside", Object.assign({ ref: forwardedRef, className: "px-6 w-[275px] flex flex-col gap-4 border-r border-slate-6" }, props, { children: [_jsx("div", Object.assign({ className: "h-[70px] flex items-center" }, { children: _jsx(Logo, {}) })), _jsx(Heading, Object.assign({ as: "h2", color: "gray", size: "1", weight: "medium" }, { children: "Email" })), _jsx("nav", Object.assign({ className: "flex flex-col gap-4" }, { children: _jsxs(Collapsible.Root, Object.assign({ defaultOpen: true }, { children: [_jsxs(Collapsible.Trigger, Object.assign({ className: "flex items-center gap-1 w-full" }, { children: [_jsxs("svg", Object.assign({ className: "text-slate-11", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: [_jsx("path", { d: "M19.25 17.25V9.75C19.25 8.64543 18.3546 7.75 17.25 7.75H4.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M13.5 7.5L12.5685 5.7923C12.2181 5.14977 11.5446 4.75 10.8127 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V11", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] })), _jsxs("div", Object.assign({ className: "flex items-center" }, { children: [_jsx(Heading, Object.assign({ as: "h3", color: "white", size: "2", weight: "medium" }, { children: "All emails" })), _jsx("svg", Object.assign({ className: "text-slate-11", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: _jsx("path", { d: "M12 15L8.5359 9.75L15.4641 9.75L12 15Z", fill: "currentColor" }) }))] }))] })), _jsxs(Collapsible.Content, Object.assign({ className: "relative mt-3" }, { children: [_jsx("div", { className: "absolute left-2.5  w-px h-full bg-slate-6" }), _jsx("div", Object.assign({ className: "py-2 flex flex-col gap-1.5" }, { children: navItems &&
                                        navItems.map((item) => (_jsx(Link, Object.assign({ href: `/preview/${item}` }, { children: _jsxs("span", Object.assign({ className: classnames('text-[14px] flex items-center font-medium gap-2 h-8 w-full pl-4 pr-2 rounded-md text-slate-11', {
                                                    'bg-cyan-3 text-cyan-11': query.slug === item,
                                                    'hover:text-slate-12': query.slug !== item,
                                                }) }, { children: [query.slug === item && (_jsx("div", { className: "h-5 bg-cyan-11 w-px absolute left-2.5" })), _jsxs("svg", Object.assign({ width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: [_jsx("path", { d: "M7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V9L14 4.75H7.75C6.64543 4.75 5.75 5.64543 5.75 6.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25Z", stroke: "currentColor", strokeOpacity: "0.927", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M18 9.25H13.75V5", stroke: "currentColor", strokeOpacity: "0.927", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })] })), item] })) }), item))) }))] }))] })) }))] })));
});
Sidebar.displayName = 'Sidebar';
