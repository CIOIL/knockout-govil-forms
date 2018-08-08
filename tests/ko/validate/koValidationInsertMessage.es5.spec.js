var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/ko/validate/koValidationInsertMessage'], function (koValidationInsertMessage) {
    describe('insertValidationMessage', function () {

        beforeEach(function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/validate/templates';
            loadFixtures('koValidationInsertMessage.html');
        });

        it('should be define', function () {
            expect(koValidationInsertMessage.insertValidationMessage).toBeDefined();
            expect(_typeof(koValidationInsertMessage.insertValidationMessage)).toEqual('function');
        });

        it('should not throw', function () {
            var elem = $('#regularInput');
            expect(function () {
                koValidationInsertMessage.insertValidationMessage(elem);
            }).not.toThrow();
        });
    });
});