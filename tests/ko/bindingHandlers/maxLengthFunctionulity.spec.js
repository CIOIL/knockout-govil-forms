define(['common/ko/bindingHandlers/maxLengthFunctionality'],

function (maxLengthFunctionalityUtils) {

    describe('maxLengthFunctionality', function () {
        describe('maxLengthFunctionality behavior', function () {

            var element, isValid;
            var specialChars = [8, 46, 37, 38, 39, 40]; //eslint-disable-line no-magic-numbers
            var maxLength = 5;

            var insertChar = function (char) {
                var e = $.Event('keydown');
                e.which = char;
                isValid = maxLengthFunctionalityUtils.handleKeydownEvent(e, maxLength, element);//eslint-disable-line no-magic-numbers
                if (isValid && specialChars.indexOf(char) === -1) {  //eslint-disable-line no-magic-numbers
                    $(element).val($(element).val() + String.fromCharCode(e.which));
                }
            };

            beforeEach(function () {
                element = document.createElement('input');
                ko.bindingHandlers.maxLengthFunctionality.init(element, maxLength);
            });

            it('to be defined', function () {
                expect(ko.bindingHandlers.maxLengthFunctionality.init).toBeDefined();
            });

            it('to be called', function () {
                spyOn(ko.bindingHandlers.maxLengthFunctionality, 'init').and.callThrough();
                ko.bindingHandlers.maxLengthFunctionality.init();
                expect(ko.bindingHandlers.maxLengthFunctionality.init).toHaveBeenCalled();
            });

            it('value with valid length', function () {
                for (var i = 0; i < maxLength; i++) {
                    insertChar(49); //eslint-disable-line no-magic-numbers
                }
                expect($(element).val().length).toBe(maxLength);
            });

            it('value with not valid length', function () {
                for (var i = 0; i < 7; i++) {
                    insertChar(49);//eslint-disable-line no-magic-numbers
                }
                expect($(element).val().length).toBe(maxLength);
            });

            it('value bigger than maxlength include special char', function () {
                var charsArray = [49, 49, 49, 8, 49, 50]; //eslint-disable-line no-magic-numbers
                for (var i = 0; i < 6; i++) {
                    insertChar(charsArray[i]);
                }
                expect($(element).val()).toEqual('11112');
            });

            it('value with not valid chars', function () {
                for (var i = 0; i < 6; i++) {
                    insertChar(specialChars[i]);
                }
                expect($(element).val()).toEqual('');
            });
          
        });

    });
});
define('spec/maxLengthFunctionality.js', function () { });