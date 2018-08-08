define(['common/ko/bindingHandlers/govRadio'], function () {
    describe('bindingHandler govRadio', function () {
        var vm = {
            gender: ko.observable().extend({ requiredRadio: true })
        };
        var htmlStr = '<div><input id="Gender" data-bind="value: gender" tfsrowdata class="hide" />\n                                <div class="row">\n                                    <div class="col-md-4 required-wrapper" data-bind="requiredWrapper: gender">\n                                        <label id="genderLabel">\u05DE\u05D9\u05DF</label>\n                                        <div class="radio radiogroupContainer" data-bind="govRadio: gender" role="radiogroup" aria-labelledby="genderLabel">\n                                            <div class="inline-element">\n                                                <input class="tfsInputradio" id="a" type="radio" value="1" name="Gender" data-bind="checked: gender, radioGroupAccessibility: gender" />\n                                                <label class="label-radio-combined">\n                                                    <span>\u05D6\u05DB\u05E8</span>\n                                                </label>\n                                            </div>\n                                            <div class="inline-element">\n                                                <input class="tfsInputradio" id="b" type="radio" value="2" name="Gender" data-bind="checked: gender, radioGroupAccessibility: gender" />\n                                                <label class="label-radio-combined">\n                                                    <span>\u05E0\u05E7\u05D1\u05D4</span>\n                                                </label>\n                                            </div>\n\n                                        </div>\n                                        <span class="validationMessage" id="vmsg_requestorType1" aria-live="assertive" data-bind="validationMessage: gender"></span>\n                                    </div>\n                                </div>\n                            </div>';
        var htmlElement = void 0;
        var firstInput, secondInput;
        beforeEach(function () {
            vm.gender(undefined);
            htmlElement = $(htmlStr);
            ko.applyBindings(vm, htmlElement[0]);
            firstInput = htmlElement.find('.tfsInputradio').first();
            secondInput = $(htmlElement.find('.tfsInputradio')[1]);
        });
        it('exists bindingHandler govRadio', function () {
            expect(ko.bindingHandlers.govRadio).toBeDefined();
        });

        it('change name', function () {
            expect(firstInput.attr('name')).not.toEqual('Gender');
            expect(secondInput.attr('name')).not.toEqual('Gender');
        });

        it('change all radios in group to the same name', function () {
            expect(firstInput.attr('name')).toEqual(secondInput.attr('name'));
        });

        it('keep original name in data-name attribute', function () {
            expect(firstInput.attr('data-name')).toEqual('Gender');
            expect(secondInput.attr('data-name')).toEqual('Gender');
        });
    });
});