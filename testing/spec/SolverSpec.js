/*global describe, it, expect, Solver */
describe("The Solver", function () {
    "use strict";
    it("should throw an error when not initialized with the right properties.", function () {
        var expectedError = "Missing argument(s) for Solver: height,width,data";
        expect(function () { var derp = new Solver(); }).toThrow(new Error(expectedError));
    });
    it("should be able to correctly advance the simulation.", function () {
        var input = [
                false, false, false, false, false,
                false, false, false, false, false,
                false, true, true, true, false,
                false, false, false, false, false,
                false, false, false, false, false],
            expected = {
                data: [
                    false, false, false, false, false,
                    false, false, true, false, false,
                    false, false, true, false, false,
                    false, false, true, false, false,
                    false, false, false, false, false],
                steps: 1
            },
            solver = new Solver({width: 5, height: 5, data: input}),
            output = solver.step();
        expect(output).toEqual(expected);
    });
    it("should throw an error if the data's length does not match the given dimensions.", function () {
        var expectedError = "Data size and dimensions do not match.";
        expect(function () {var z = new Solver({
            width: 10,
            height: 10,
            data: [0, 0, 0]
        }); }).toThrow(new Error(expectedError));

    });
});
