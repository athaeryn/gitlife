/* jshint undef:false, unused:false, strict:false */
describe("The Grid", function () {
    it("should throw an error when not initialized with a height, width, and canvas.", function () {
        expect(function () { new Grid(); }).toThrow(new Error("Missing argument(s): width,height,canvas"));
    });
});
