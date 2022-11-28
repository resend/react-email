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
import * as React from 'react';
import classnames from 'classnames';
import { Heading } from './heading';
import { Text } from './text';
export const Topbar = React.forwardRef((_a, forwardedRef) => {
    var { className, title } = _a, props = __rest(_a, ["className", "title"]);
    return (_jsx("header", Object.assign({ ref: forwardedRef, className: classnames('bg-black flex relative items-center px-6 justify-between h-[70px] border-b border-slate-6', className) }, props, { children: _jsxs("div", Object.assign({ className: "flex items-center" }, { children: [_jsx(Text, Object.assign({ size: "2", color: "gray", weight: "medium" }, { children: "All emails" })), _jsx("svg", Object.assign({ className: "text-slate-11", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: _jsx("path", { d: "M10.75 8.75L14.25 12L10.75 15.25", stroke: "currentColor", "stroke-opacity": "0.615", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })), _jsx(Heading, Object.assign({ as: "h2", size: "2", weight: "medium" }, { children: title }))] })) })));
});
Topbar.displayName = 'Topbar';
