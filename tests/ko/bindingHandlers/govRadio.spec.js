define(['common/ko/bindingHandlers/govRadio'
],
function () {
    describe('bindingHandler govRadio', function () {
        var vm = {
            gender: ko.observable().extend({ requiredRadio: true })
        };
        let htmlStr = `<div><input id="Gender" data-bind="value: gender" tfsrowdata class="hide" />
                                <div class="row">
                                    <div class="col-md-4 required-wrapper" data-bind="requiredWrapper: gender">
                                        <label id="genderLabel">מין</label>
                                        <div class="radio radiogroupContainer" data-bind="govRadio: gender" role="radiogroup" aria-labelledby="genderLabel">
                                            <div class="inline-element">
                                                <input class="tfsInputradio" id="a" type="radio" value="1" name="Gender" data-bind="checked: gender, radioGroupAccessibility: gender" />
                                                <label class="label-radio-combined">
                                                    <span>זכר</span>
                                                </label>
                                            </div>
                                            <div class="inline-element">
                                                <input class="tfsInputradio" id="b" type="radio" value="2" name="Gender" data-bind="checked: gender, radioGroupAccessibility: gender" />
                                                <label class="label-radio-combined">
                                                    <span>נקבה</span>
                                                </label>
                                            </div>

                                        </div>
                                        <span class="validationMessage" id="vmsg_requestorType1" aria-live="assertive" data-bind="validationMessage: gender"></span>
                                    </div>
                                </div>
                            </div>`;
        let htmlElement;
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