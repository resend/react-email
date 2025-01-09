"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return bigSign;
    }
});
function bigSign(bigIntValue) {
    return (bigIntValue > BigInt(0)) - (bigIntValue < BigInt(0));
}
