"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return parseObjectStyles;
    }
});
const _processor = /*#__PURE__*/ _interop_require_default(require("postcss/lib/processor"));
const _postcssnested = /*#__PURE__*/ _interop_require_default(require("postcss-nested"));
const _postcssjs = /*#__PURE__*/ _interop_require_default(require("postcss-js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function parseObjectStyles(styles) {
    if (!Array.isArray(styles)) {
        return parseObjectStyles([
            styles
        ]);
    }
    return styles.flatMap((style)=>{
        return new _processor.default([
            (0, _postcssnested.default)({
                bubble: [
                    "screen"
                ]
            })
        ]).process(style, {
            parser: _postcssjs.default
        }).root.nodes;
    });
}
