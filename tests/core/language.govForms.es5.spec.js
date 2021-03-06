var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/core/language'], function (language) {

    describe('setFormLanguage', function () {

        it('should be function', function () {
            expect(language.setFormLanguage).toBeDefined();
            expect(_typeof(language.setFormLanguage)).toEqual('function');
        });
        describe('updateFormDirection', function () {
            it('change Form Direction to rtl', function () {
                language.setFormLanguage(true);
                expect($('body').hasClass('ltr')).toBeFalsy();
            });
            it('change Form Direction to ltr', function () {
                language.setFormLanguage(false);
                expect($('body').hasClass('ltr')).toBeTruthy();
            });
            it('undefined change Form Direction to ltr', function () {
                language.setFormLanguage(undefined);
                expect($('body').hasClass('ltr')).toBeTruthy();
            });
        });
    });
});