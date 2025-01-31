"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
// BEGIN
function sM(a) {
    var e = [];
    var f = 0;
    for (var g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g);
        128 > l
            ? (e[f++] = l)
            : (2048 > l
                ? (e[f++] = (l >> 6) | 192)
                : (55296 == (l & 64512) &&
                    g + 1 < a.length &&
                    56320 == (a.charCodeAt(g + 1) & 64512)
                    ? ((l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023)),
                        (e[f++] = (l >> 18) | 240),
                        (e[f++] = ((l >> 12) & 63) | 128))
                    : (e[f++] = (l >> 12) | 224),
                    (e[f++] = ((l >> 6) & 63) | 128)),
                (e[f++] = (l & 63) | 128));
    }
    var a_ = 0;
    for (f = 0; f < e.length; f++) {
        a_ += e[f];
        a_ = xr(a_, "+-a^+6");
    }
    a_ = xr(a_, "+-3^+b+-f");
    a_ ^= 0;
    0 > a_ && (a_ = (a_ & 2147483647) + 2147483648);
    a_ %= 1e6;
    return a_.toString() + "." + a_.toString();
}
exports.default = sM;
var xr = function (a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d : a ^ d;
    }
    return a;
};
// END
/* eslint-enable */
