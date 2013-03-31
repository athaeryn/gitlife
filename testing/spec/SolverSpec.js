/*global describe, it, expect, Solver */
describe("The Solver", function () {
    "use strict";
    it("should throw an error when not initialized with a height, width, and data.", function () {
        var expectedError = "Missing argument(s) for Solver: height,width,data";
        expect(function () { var derp = new Solver(); }).toThrow(new Error(expectedError));
    });
});
