/* jshint unused:false */
function validateArgs(given, expected, what) {
    "use strict";
    var missing = [], i, error;
    for (i = 0; i < expected.length; i += 1) {
        if (!given[expected[i]]) {
            missing.push(expected[i]);
        }
    }
    if (missing.length > 0) {
        error = "Missing argument(s)";
        if (what) { error += " for " + what; }
        error += ": " + String(missing);
        throw new Error(error);
    }
}
