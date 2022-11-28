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
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import classnames from 'classnames';
import { unreachable } from '../utils';
import * as SlotPrimitive from '@radix-ui/react-slot';
export const Button = React.forwardRef((_a, forwardedRef) => {
    var { asChild, appearance = 'white', className, children, size = '2' } = _a, props = __rest(_a, ["asChild", "appearance", "className", "children", "size"]);
    const classNames = classnames(getSize(size), getAppearance(appearance), 'inline-flex items-center justify-center border font-medium', className);
    return asChild ? (_jsx(SlotPrimitive.Slot, Object.assign({ ref: forwardedRef }, props, { className: classNames }, { children: _jsx(SlotPrimitive.Slottable, { children: children }) }))) : (_jsx("button", Object.assign({ ref: forwardedRef, className: classNames }, props, { children: children })));
});
Button.displayName = 'Button';
const getAppearance = (appearance) => {
    switch (appearance) {
        case undefined:
        case 'white':
            return [
                'bg-white text-black',
                'hover:bg-white/90',
                'focus:ring-2 focus:ring-white/20 focus:outline-none focus:bg-white/90',
            ];
        case 'gradient':
            return [
                'bg-gradient backdrop-blur-[20px] border-[#34343A]',
                'hover:bg-gradientHover',
                'focus:ring-2 focus:ring-white/20 focus:outline-none focus:bg-gradientHover',
            ];
        default:
            unreachable(appearance);
    }
};
const getSize = (size) => {
    switch (size) {
        case '1':
            return '';
        case undefined:
        case '2':
            return 'text-[14px] h-8 px-3 rounded-md gap-2';
        case '3':
            return 'text-[14px] h-10 px-4 rounded-md gap-2';
        case '4':
            return 'text-base h-11 px-4 rounded-md gap-2';
        default:
            unreachable(size);
    }
};
