define(['common/components/formInformation/formInformationViewModel', 'common/utilities/stringExtension', 'common/ko/validate/koValidationMethods', 'common/ko/validate/extensionRules/general', 'common/ko/validate/koValidationCustomizer'], function (formInformation, stringExtension) {

    var viewModel,
        isMultiLanguageMock = ko.observable(true),
        messageSpan;

    describe('ko validation customizer', function () {
        beforeAll(function () {
            viewModel = {
                input1: ko.observable('111').extend({ required: true }),
                input2: ko.observable('111').extend({ required: true }),
                input3: ko.observable('111').extend({ required: true }),
                input4: ko.observable('111').extend({ required: true }),
                label1: ko.observable('שם'),
                radioLabel: ko.observable('האם הבדיקה מוצלחת?'),
                radioInput: ko.observable('1').extend({ requiredRadio: true }),
                input5: ko.observable('111').extend({ required: true }),
                radioInput2: ko.observable('1').extend({ requiredRadio: true })
            };
        });

        beforeEach(function () {
            viewModel.input1.elementName = undefined;
            viewModel.input2.elementName = undefined;
            viewModel.input3.elementName = undefined;
            viewModel.input4.elementName = undefined;
            viewModel.radioInput.elementName = undefined;
            viewModel.input5.elementName = 'שליחת הודעה מהטופס';
            viewModel.radioInput2.elementName = 'שליחת הודעה מהטופס לשדה רדיו';
            spyOn(formInformation, 'isMultiLanguage').and.callFake(function () {
                return isMultiLanguageMock();
            });
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/validate/templates';
            loadFixtures('koValidationCustomizer.html');
            // ko.cleanNode(document.body);
            // ko.applyBindings(viewModel);
        });

        describe('validation message init', function () {
            beforeEach(function () {
                spyOn(ko.bindingHandlers.notifyTextContent, 'init').and.callThrough();
            });
            it('should not assign change handler when isMultiLanguage false', function () {
                isMultiLanguageMock(false);
                ko.cleanNode(document.body);
                ko.applyBindings(viewModel);
                expect(ko.bindingHandlers.notifyTextContent.init).not.toHaveBeenCalled();
            });
            it('should assign change handler when isMultiLanguage true', function () {
                isMultiLanguageMock(true);
                ko.cleanNode(document.body);
                ko.applyBindings(viewModel);
                expect(ko.bindingHandlers.notifyTextContent.init).toHaveBeenCalled();
            });
        });

        describe('validation message update', function () {
            beforeEach(function () {
                viewModel.label1 = ko.observable('שם');
                viewModel.radioLabel = ko.observable('האם הבדיקה מוצלחת?');
                formInformation.language('hebrew');
                viewModel.input1('121');
                viewModel.input2('121');
                viewModel.input3('121');
                viewModel.input4('121');
                viewModel.radioInput('1');
                viewModel.input5('121');
                viewModel.radioInput2('1');
                ko.cleanNode(document.body);
                ko.applyBindings(viewModel);
                messageSpan = $('.validationMessage');
            });
            it('', function () {
                viewModel.input1('');
                viewModel.input2('');
                viewModel.input3('');
                viewModel.input4('');
                viewModel.radioInput('');
                // expect(messageSpan[0].textContent).toEqual('חובה להזין ערך בשדה שם');
                expect(messageSpan[0].textContent).toEqual(stringExtension.format(viewModel.input1.error(), $('label')[0].textContent));
                expect(messageSpan[1].textContent).toEqual(stringExtension.format(viewModel.input1.error(), $('label')[1].textContent));
                expect(messageSpan[2].textContent).toEqual('חובה להזין ערך בשדה שם');
                expect(messageSpan[3].textContent).toEqual(stringExtension.format(viewModel.input1.error(), $('label')[3].textContent));
                expect(messageSpan[4].textContent).toEqual(stringExtension.format(viewModel.radioInput.error(), $('label')[4].textContent));
            });
            it('should update when labels changes', function () {
                viewModel.input1('');
                viewModel.input2('');
                viewModel.input3('');
                viewModel.input4('');
                viewModel.label1('שם פרטי');
                viewModel.radioLabel('מין');
                viewModel.radioInput('');
                expect(messageSpan[0].textContent).toEqual(stringExtension.format(viewModel.input1.error(), $('label')[0].textContent));
                expect(messageSpan[1].textContent).toEqual(stringExtension.format(viewModel.input1.error(), $('label')[1].textContent));
                expect(messageSpan[2].textContent).toEqual('חובה להזין ערך בשדה שם פרטי');
                expect(messageSpan[3].textContent).toEqual(stringExtension.format(viewModel.input1.error(), $('label')[3].textContent));
                expect(messageSpan[4].textContent).toEqual(stringExtension.format(viewModel.radioInput.error(), $('label')[4].textContent));
            });
            it('should use default when label is empty', function () {
                viewModel.input1('');
                viewModel.input2('');
                viewModel.input3('');
                viewModel.input4('');
                viewModel.radioInput('');
                viewModel.label1('');
                viewModel.radioLabel('');
                expect(messageSpan[0].textContent).toEqual('חובה להזין ערך בשדה זה');
                expect(messageSpan[1].textContent).toEqual('חובה להזין ערך בשדה זה');
                expect(messageSpan[2].textContent).toEqual('חובה להזין ערך בשדה זה');
                expect(messageSpan[3].textContent).toEqual(stringExtension.format(viewModel.input1.error(), $('label')[3].textContent));
                expect(messageSpan[4].textContent).toEqual('חובה לבחור באחת מן האפשרויות בשדה זה');
            });
            it('should use elementName when it defined', function () {
                viewModel.input5('');
                viewModel.radioInput2('');
                expect(messageSpan[5].textContent).toEqual(stringExtension.format(viewModel.input5.error(), viewModel.input5.elementName));
                expect(messageSpan[6].textContent).toEqual(stringExtension.format(viewModel.radioInput2.error(), viewModel.radioInput2.elementName));
            });
        });
    });
});