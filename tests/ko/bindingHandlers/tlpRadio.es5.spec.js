define(['common/ko/bindingHandlers/tlpRadio', 'common/accessibility/radioGroupAccessibility', 'common/ko/bindingHandlers/accessibility', 'common/ko/validate/koValidationCustomizer', 'common/ko/validate/extensionRules/general'], function () {
    describe('bindingHandler tlpRadio', function () {
        var vm = {
            gender: ko.observable().extend({ requiredRadio: true })
        };
        var htmlStr = '<div><input id="Gender" data-bind="value: gender" tfsrowdata class="hide" />\n                                <div class="row">\n                                    <div class="col-md-4 required-wrapper" data-bind="requiredWrapper: gender">\n                                        <label id="genderLabel">\u05DE\u05D9\u05DF</label>\n                                        <div class="radio radiogroupContainer" data-bind="tlpRadio: gender" role="radiogroup" aria-labelledby="genderLabel">\n                                            <div class="inline-element">\n                                                <input class="tfsInputradio" id="a" type="radio" value="1" name="Gender" data-bind="checked: gender, radioGroupAccessibility: gender" />\n                                                <label class="label-radio-combined">\n                                                    <span>\u05D6\u05DB\u05E8</span>\n                                                </label>\n                                            </div>\n                                            <div class="inline-element">\n                                                <input class="tfsInputradio" id="b" type="radio" value="2" name="Gender" data-bind="checked: gender, radioGroupAccessibility: gender" />\n                                                <label class="label-radio-combined">\n                                                    <span>\u05E0\u05E7\u05D1\u05D4</span>\n                                                </label>\n                                            </div>\n\n                                        </div>\n                                        <span class="validationMessage" id="vmsg_requestorType1" aria-live="assertive" data-bind="validationMessage: gender"></span>\n                                    </div>\n                                </div>\n                            </div>';
        var htmlElement = void 0;
        var firstInput, secondInput;
        beforeEach(function () {
            vm.gender(undefined);
            htmlElement = $(htmlStr);
            ko.applyBindings(vm, htmlElement[0]);
            firstInput = htmlElement.find('.tfsInputradio').first();
            secondInput = $(htmlElement.find('.tfsInputradio')[1]);
        });
        it('exists bindingHandler tlpRadio', function () {
            expect(ko.bindingHandlers.tlpRadio).toBeDefined();
        });

        it('change id', function () {
            expect(firstInput.attr('id')).not.toEqual('a');
            expect(secondInput.attr('id')).not.toEqual('b');
        });
        it('change name', function () {
            expect(firstInput.attr('name')).not.toEqual('Gender');
            expect(secondInput.attr('name')).not.toEqual('Gender');
        });
        it('change all  radios in group to the same name', function () {
            expect(firstInput.attr('name')).toEqual(secondInput.attr('name'));
        });
        it('add to label data-for attribute with input id value', function () {
            expect(htmlElement.find('.label-radio-combined').first().attr('data-for')).toEqual(firstInput.attr('id'));
        });
        describe('radioLabelAccessibility -click label of radio - cause click on radio', function () {
            it('exists bindingHandler radioLabelAccessibility', function () {
                expect(ko.bindingHandlers.radioLabelAccessibility).toBeDefined();
            });
            it('radio without own label throw exeption', function () {
                var htmlRadio = '<div><input id="Gender" data-bind="value: gender" tfsrowdata class="hide" />\n                                <div class="row">\n                                    <div class="col-md-4 required-wrapper" data-bind="requiredWrapper: gender">\n                                        <label id="genderLabel">\u05DE\u05D9\u05DF</label>\n                                        <div class="radio radiogroupContainer" data-bind="tlpRadio: gender" role="radiogroup" aria-labelledby="genderLabel">\n                                            <div class="inline-element">\n                                                <input class="tfsInputradio" id="a" type="radio" value="1" name="Gender" data-bind="checked: gender, radioGroupAccessibility: gender" />\n                                            </div>\n                                        </div>\n                                        <span class="validationMessage" id="vmsg_requestorType1" aria-live="assertive" data-bind="validationMessage: gender"></span>\n                                    </div>\n                                </div>\n                            </div>';
                htmlElement = $(htmlRadio);
                expect(function () {
                    ko.applyBindings(vm, htmlElement[0]);
                }).toThrow();
            });
            xit('click on label - cause click on button', function () {
                htmlElement.find('.label-radio-combined').first().click();
                expect(vm.gender()).toEqual('1');
            });
            xit('keypress enter on label - cause click on button', function () {
                var e = jQuery.Event('keypress');
                e.which = 13;
                htmlElement.find('.label-radio-combined').first().trigger(e);
                expect(vm.gender()).toEqual('1');
            }); //fail i FF only
            xit('keypress space on label - cause click on button', function () {
                var e = jQuery.Event('keypress');
                e.which = 32;
                htmlElement.find('.label-radio-combined').first().trigger(e);
                expect(vm.gender()).toEqual('1');
            }); //fail i FF only
            xit('keypress other kay on label - not cause click on button', function () {
                var e = jQuery.Event('keypress');
                e.which = 432;
                htmlElement.find('.label-radio-combined').first().trigger(e);
                expect(vm.gender()).not.toBeDefined();
            }); //fail i FF only
        });
    });
});