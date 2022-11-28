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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Topbar } from './topbar';
import { Sidebar } from './sidebar';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import classnames from 'classnames';
export const Layout = React.forwardRef((_a, forwardedRef) => {
    var { className, title, navItems, children, viewMode, setViewMode } = _a, props = __rest(_a, ["className", "title", "navItems", "children", "viewMode", "setViewMode"]);
    return (_jsx(_Fragment, { children: _jsxs("div", Object.assign({ className: "flex justify-between h-screen" }, { children: [_jsx(Sidebar, { navItems: navItems }), _jsxs("main", Object.assign({ className: "w-full bg-slate-2" }, { children: [title && _jsx(Topbar, { title: title }), _jsxs("div", Object.assign({ className: "pt-16 relative h-[calc(100vh_-_70px)] overflow-auto" }, { children: [setViewMode && (_jsxs(ToggleGroup.Root, Object.assign({ className: "items-center bg-slate-2 p-1.5 flex gap-1 border border-slate-6 rounded-md absolute top-4 right-4", type: "single", value: viewMode, "aria-label": "View mode", onValueChange: (value) => {
                                        if (!value) {
                                            return setViewMode('desktop');
                                        }
                                        setViewMode(value);
                                    } }, { children: [_jsx(ToggleGroup.Item, Object.assign({ className: classnames('text-sm text-slate-11 rounded px-1.5 py-0.5', {
                                                'text-slate-12 bg-slate-3 font-medium': viewMode === 'desktop',
                                            }), value: "desktop" }, { children: "Desktop" })), _jsx(ToggleGroup.Item, Object.assign({ className: classnames('text-sm text-slate-11 rounded px-1.5 py-0.5', {
                                                'text-slate-12 bg-slate-3 font-medium': viewMode === 'source',
                                            }), value: "source" }, { children: "Source" }))] }))), _jsx("div", Object.assign({ className: "max-w-[600px] mx-auto" }, { children: children }))] }))] }))] })) }));
});
Layout.displayName = 'Layout';
