/* jshint undef:false, unused:false, strict:false */
describe("The Grid", function () {
    it("should complain when not initialized with a height.", function () {
        expect(function () { new Grid({width: 10}); }).toThrow(new Error("Missing argument(s): height"));
    });
    it("should complain when not initialized with a width.", function () {
        expect(function () { new Grid({height: 10}); }).toThrow(new Error("Missing argument(s): width"));
    });
    it("should complain when not initialized with a height and width.", function () {
        expect(function () { new Grid(); }).toThrow(new Error("Missing argument(s): width,height"));
    });
});
