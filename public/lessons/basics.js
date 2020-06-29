"use strict";
function combine(inp1, inp2, resultConversion) {
    let result;
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
const combinedAges = combine(30, 24, 'as-text');
const combinedNames = combine('max', 'anna', 'as-text');
