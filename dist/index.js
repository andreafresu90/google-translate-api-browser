"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = exports.setHTTPService = exports.setCORS = void 0;
var querystring_1 = require("querystring");
var axios_1 = __importDefault(require("axios"));
var sM_1 = __importDefault(require("./sM"));
var languages_1 = require("./languages");
function token(text) {
    return new Promise(function (resolve) {
        resolve({ name: "tk", value: sM_1.default(text) });
    });
}
var CORSService = "";
// setup your own cors-anywhere server
exports.setCORS = function (CORSURL) {
    CORSService = CORSURL;
    return translate;
};
var HTTPService = axios_1.default;
// setup your own httpService (like @ionic-native/http/ngx )
exports.setHTTPService = function (customHTTPService) {
    HTTPService = customHTTPService;
    return translate;
};
// function translate(text: string, to: string, from: string, tld: string) {
function translate(text, opts_) {
    if (opts_ === void 0) { opts_ = {}; }
    var opts = {
        from: opts_.from || "auto",
        to: opts_.to || "en",
        hl: opts_.hl || "en",
        raw: opts_.raw || false,
        tld: opts_.tld || "com"
    };
    var e = null;
    [opts.from, opts.to].forEach(function (lang) {
        if (lang && !languages_1.isSupported(lang)) {
            e = new Error();
            e.message = "The language '" + lang + "' is not supported";
        }
    });
    if (e) {
        return new Promise(function (resolve, reject) {
            reject(e);
        });
    }
    return token(text)
        .then(function (token) {
        var _a;
        var url = "https://translate.google." + opts.tld + "/translate_a/single";
        var data = (_a = {
                client: "gtx",
                sl: languages_1.getCode(opts.from),
                tl: languages_1.getCode(opts.to),
                hl: languages_1.getCode(opts.hl),
                dt: ["at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"],
                ie: "UTF-8",
                oe: "UTF-8",
                otf: 1,
                ssel: 0,
                tsel: 0,
                kc: 7,
                q: text
            },
            _a[token.name] = token.value,
            _a);
        var fullUrl = url + "?" + querystring_1.stringify(data);
        /*
          if (fullUrl.length > 2083) {
              delete data.q;
              return [
                  url + '?' + stringify(data),
                  {method: 'POST', body: {q: text}}
              ];
          }
          */
        return fullUrl;
    })
        .then(function (url) {
        return HTTPService
            .get(CORSService + url, {}, {})
            .then(function (res_) {
            var _a;
            var res = {
                body: JSON.stringify(res_.data)
            };
            var result = {
                text: "",
                pronunciation: "",
                from: {
                    language: {
                        didYouMean: false,
                        iso: ""
                    },
                    text: {
                        autoCorrected: false,
                        value: "",
                        didYouMean: false
                    }
                },
                raw: opts.raw ? res.body : ""
            };
            var body = JSON.parse(res.body);
            (_a = body[0]) === null || _a === void 0 ? void 0 : _a.forEach(function (obj) {
                if (obj[0]) {
                    result.text += obj[0];
                }
                else if (obj[2]) {
                    result.pronunciation += obj[2];
                }
            });
            // if (body[2] === body[8][0][0]) {
            //   result.from.language.iso = body[2];
            // } else {
            //   result.from.language.didYouMean = true;
            //   result.from.language.iso = body[8][0][0];
            // }
            if (body[7] && body[7][0]) {
                var str = body[7][0];
                str = str.replace(/<b><i>/g, "[");
                str = str.replace(/<\/i><\/b>/g, "]");
                result.from.text.value = str;
                if (body[7][5] === true) {
                    result.from.text.autoCorrected = true;
                }
                else {
                    result.from.text.didYouMean = true;
                }
            }
            return result;
        })
            .catch(function (err) {
            var e = new Error();
            if (err.statusCode !== undefined && err.statusCode !== 200) {
                e.message = "BAD_REQUEST";
            }
            else {
                e.message = "BAD_NETWORK";
            }
            throw e;
        });
    });
}
exports.translate = translate;
exports.default = translate;
