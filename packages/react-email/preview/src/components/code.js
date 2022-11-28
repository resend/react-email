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
import classnames from 'classnames';
import Highlight, { defaultProps } from 'prism-react-renderer';
import * as React from 'react';
const theme = {
    plain: {
        color: '#EDEDEF',
        fontSize: 13,
        fontFamily: 'MonoLisa, Menlo, monospace',
    },
    styles: [
        {
            types: ['comment'],
            style: {
                color: '#706F78',
            },
        },
        {
            types: ['atrule', 'keyword', 'attr-name', 'selector'],
            style: {
                color: '#7E7D86',
            },
        },
        {
            types: ['punctuation', 'operator'],
            style: {
                color: '#706F78',
            },
        },
        {
            types: ['class-name', 'function', 'tag', 'key-white'],
            style: {
                color: '#EDEDEF',
            },
        },
    ],
};
export const Code = (_a) => {
    var { children, className, language = 'html' } = _a, props = __rest(_a, ["children", "className", "language"]);
    const [isCopied, setIsCopied] = React.useState(false);
    const value = children.trim();
    return (_jsx(Highlight, Object.assign({}, defaultProps, { theme: theme, code: value, language: language }, { children: ({ tokens, getLineProps, getTokenProps }) => (_jsxs("pre", Object.assign({ className: classnames('border-slate-6 relative p-4 w-full items-center overflow-auto whitespace-pre rounded-md border text-sm backdrop-blur-md', className), style: {
                lineHeight: '130%',
                background: 'linear-gradient(145.37deg, rgba(255, 255, 255, 0.09) -8.75%, rgba(255, 255, 255, 0.027) 83.95%)',
                boxShadow: 'rgb(0 0 0 / 10%) 0px 5px 30px -5px',
            } }, { children: [_jsx("div", { className: "absolute right-0 top-0 h-px w-[200px]", style: {
                        background: 'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
                    } }), tokens.map((line, i) => {
                    return (_jsx("div", Object.assign({}, getLineProps({ line, key: i }), { className: classnames('whitespace-pre', {
                            "before:text-slate-11 before:mr-2 before:content-['$']": language === 'bash' && tokens.length === 1,
                        }) }, { children: line.map((token, key) => {
                            var _a;
                            const isException = token.content === 'from' && ((_a = line[key + 1]) === null || _a === void 0 ? void 0 : _a.content) === ':';
                            const newTypes = isException
                                ? [...token.types, 'key-white']
                                : token.types;
                            token.types = newTypes;
                            return (_jsx(React.Fragment, { children: _jsx("span", Object.assign({}, getTokenProps({ token, key }))) }, key));
                        }) }), i));
                }), _jsx("div", { className: "absolute left-0 bottom-0 h-px w-[200px]", style: {
                        background: 'linear-gradient(90deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0) 0%, rgba(232, 232, 232, 0.2) 33.02%, rgba(143, 143, 143, 0.6719) 64.41%, rgba(236, 72, 153, 0) 98.93%)',
                    } })] }))) })));
};
