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
import * as SlotPrimitive from '@radix-ui/react-slot';
import classnames from 'classnames';
import * as React from 'react';
import { unreachable } from '../utils';
export const Heading = React.forwardRef((_a, forwardedRef) => {
    var { as: Tag = 'h1', size = '3', className, color = 'white', children, weight = 'bold' } = _a, props = __rest(_a, ["as", "size", "className", "color", "children", "weight"]);
    return (_jsx(SlotPrimitive.Slot, Object.assign({ ref: forwardedRef, className: classnames(className, getSizesClassNames(size), getColorClassNames(color), getWeightClassNames(weight)) }, props, { children: _jsx(Tag, { children: children }) })));
});
const getSizesClassNames = (size) => {
    switch (size) {
        case '1':
            return 'text-xs';
        case '2':
            return 'text-sm';
        case undefined:
        case '3':
            return 'text-base';
        case '4':
            return 'text-lg';
        case '5':
            return 'text-xl tracking-[-0.16px]';
        case '6':
            return 'text-2xl tracking-[-0.288px]';
        case '7':
            return 'text-[28px] leading-[34px] tracking-[-0.416px]';
        case '8':
            return 'text-[35px] leading-[42px] tracking-[-0.64px]';
        case '9':
            return 'text-6xl leading-[73px] tracking-[-0.896px]';
        case '10':
            return [
                'text-[38px] leading-[46px]',
                'md:text-[70px] md:leading-[85px] tracking-[-1.024px;]',
            ];
        default:
            return unreachable(size);
    }
};
const getColorClassNames = (color) => {
    switch (color) {
        case 'gray':
            return 'text-slate-11';
        case 'white':
        case undefined:
            return 'text-slate-12';
        default:
            return unreachable(color);
    }
};
const getWeightClassNames = (weight) => {
    switch (weight) {
        case 'medium':
            return 'font-medium';
        case 'bold':
        case undefined:
            return 'font-bold';
        default:
            return unreachable(weight);
    }
};
Heading.displayName = 'Heading';
