"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/split-on-first@1.1.0";
exports.ids = ["vendor-chunks/split-on-first@1.1.0"];
exports.modules = {

/***/ "(ssr)/../../node_modules/.pnpm/split-on-first@1.1.0/node_modules/split-on-first/index.js":
/*!******************************************************************************************!*\
  !*** ../../node_modules/.pnpm/split-on-first@1.1.0/node_modules/split-on-first/index.js ***!
  \******************************************************************************************/
/***/ ((module) => {

eval("\nmodule.exports = (string, separator)=>{\n    if (!(typeof string === \"string\" && typeof separator === \"string\")) {\n        throw new TypeError(\"Expected the arguments to be of type `string`\");\n    }\n    if (separator === \"\") {\n        return [\n            string\n        ];\n    }\n    const separatorIndex = string.indexOf(separator);\n    if (separatorIndex === -1) {\n        return [\n            string\n        ];\n    }\n    return [\n        string.slice(0, separatorIndex),\n        string.slice(separatorIndex + separator.length)\n    ];\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3NwbGl0LW9uLWZpcnN0QDEuMS4wL25vZGVfbW9kdWxlcy9zcGxpdC1vbi1maXJzdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUVBQSxPQUFPQyxPQUFPLEdBQUcsQ0FBQ0MsUUFBUUM7SUFDekIsSUFBSSxDQUFFLFFBQU9ELFdBQVcsWUFBWSxPQUFPQyxjQUFjLFFBQU8sR0FBSTtRQUNuRSxNQUFNLElBQUlDLFVBQVU7SUFDckI7SUFFQSxJQUFJRCxjQUFjLElBQUk7UUFDckIsT0FBTztZQUFDRDtTQUFPO0lBQ2hCO0lBRUEsTUFBTUcsaUJBQWlCSCxPQUFPSSxPQUFPLENBQUNIO0lBRXRDLElBQUlFLG1CQUFtQixDQUFDLEdBQUc7UUFDMUIsT0FBTztZQUFDSDtTQUFPO0lBQ2hCO0lBRUEsT0FBTztRQUNOQSxPQUFPSyxLQUFLLENBQUMsR0FBR0Y7UUFDaEJILE9BQU9LLEtBQUssQ0FBQ0YsaUJBQWlCRixVQUFVSyxNQUFNO0tBQzlDO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZGV3b3JrL2Zyb250ZW5kLy4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zcGxpdC1vbi1maXJzdEAxLjEuMC9ub2RlX21vZHVsZXMvc3BsaXQtb24tZmlyc3QvaW5kZXguanM/ZTIyNCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKHN0cmluZywgc2VwYXJhdG9yKSA9PiB7XG5cdGlmICghKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnICYmIHR5cGVvZiBzZXBhcmF0b3IgPT09ICdzdHJpbmcnKSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHRoZSBhcmd1bWVudHMgdG8gYmUgb2YgdHlwZSBgc3RyaW5nYCcpO1xuXHR9XG5cblx0aWYgKHNlcGFyYXRvciA9PT0gJycpIHtcblx0XHRyZXR1cm4gW3N0cmluZ107XG5cdH1cblxuXHRjb25zdCBzZXBhcmF0b3JJbmRleCA9IHN0cmluZy5pbmRleE9mKHNlcGFyYXRvcik7XG5cblx0aWYgKHNlcGFyYXRvckluZGV4ID09PSAtMSkge1xuXHRcdHJldHVybiBbc3RyaW5nXTtcblx0fVxuXG5cdHJldHVybiBbXG5cdFx0c3RyaW5nLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KSxcblx0XHRzdHJpbmcuc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyBzZXBhcmF0b3IubGVuZ3RoKVxuXHRdO1xufTtcbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwic3RyaW5nIiwic2VwYXJhdG9yIiwiVHlwZUVycm9yIiwic2VwYXJhdG9ySW5kZXgiLCJpbmRleE9mIiwic2xpY2UiLCJsZW5ndGgiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../../node_modules/.pnpm/split-on-first@1.1.0/node_modules/split-on-first/index.js\n");

/***/ })

};
;