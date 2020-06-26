"use strict";
function combine(inp1, inp2, resultConversion) {
    var result;
    if (typeof inp1 === 'number' &&
        typeof inp2 === 'number' &&
        resultConversion) {
        result = inp1 + inp2;
    }
    else {
        result = inp1.toString() + inp2.toLocaleString;
    }
    return result;
}
var combinedAges = combine(30, 24, 'as-text');
var combinedNames = combine('max', 'anna', 'as-text');
