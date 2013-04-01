/*jslint undef: false, sloppy: true*/
/*global describe, it, expect, Grid */
describe("The Grid", function () {
    it("should throw an error when not initialized with a height, width, and canvas.", function () {
        expect(function () { var derp = new Grid(); }).toThrow(new Error("Missing argument(s): width,height,canvas"));
    });
});
