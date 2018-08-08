define(['common/infrastructureFacade/tfsMethods', 'common/ko/validate/extensionRules/general', 'common/ko/validate/extensionRules/personalDetails', 'common/ko/validate/extensionRules/address', 'common/ko/validate/extensionRules/phone', 'common/ko/validate/extensionRules/date'], function (tfsMethods) {

    //var viewModel = {
    //    requiredName: ko.observable().extend({ required: true }),
    //    requiredIsMarried: ko.observable().extend({ requiredCbx: true }),
    //    email: ko.observable().extend({ email: true }),
    //    date: ko.observable().extend({ date: true }),
    //    time: ko.observable().extend({ time: true }),
    //    url: ko.observable().extend({ url: true }),
    //    zipCode: ko.observable().extend({ zipCode: true })
    //}

    var GuineaPig = ko.observable();
    var sampleElement;
    var sampleLabel;

    describe('koValidationCustomizer', function () {

        beforeEach(function () {
            GuineaPig.extend({ validatable: false });
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/validate/templates';
            loadFixtures('customizeView.html');
            sampleElement = $('#input');
            sampleLabel = $('label');
            ko.cleanNode(document.body);
            spyOn(ko.bindingHandlers.tlpTooltip, 'init').and.callThrough();
            spyOn(tfsMethods.calendar, 'handleCalendarElements');
        });

        describe('required', function () {
            beforeEach(function () {
                GuineaPig.extend({ required: true });
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
            });
            it('asterisk prepend to label', function () {
                expect(sampleLabel).toHaveClass('required');
            });
            it('asterisk prepend to label in attachment', function () {
                expect(sampleLabel).toHaveClass('required');
            });
            it('asterisk prepend to label in lookup', function () {
                sampleElement = $('#lookup');
                sampleLabel = $('#lookup_lbl');
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
                expect(sampleLabel).toHaveClass('required');
            });
            it('asterisk prepend to label in lookup with tooltip', function () {
                sampleElement = $('#lookup');
                sampleLabel = $('#lookup_lbl');
                $('<span>tooltip</span>').insertAfter(sampleLabel);
                sampleLabel.append('<span></span>');
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
                expect(sampleLabel).toHaveClass('required');
            });
            it('attr aria-required added to attachment', function () {
                sampleElement = $('#attach');
                sampleLabel = $('#attach_lbl');
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
                expect(sampleElement).toHaveAttr('aria-required', 'true');
            });
            it('attr aria-required added to attachment with tooltip', function () {
                sampleElement = $('#attach');
                sampleLabel = $('#attach_lbl');
                $('<span>tooltip</span>').insertAfter(sampleLabel);

                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
                expect(sampleElement).toHaveAttr('aria-required', 'true');
            });
        });

        describe('email', function () {
            beforeEach(function () {
                GuineaPig.extend({ email: true });
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
            });
            it('element dir should be set to ltr', function () {
                expect(sampleElement).toHaveAttr('dir', 'ltr');
            });
        });

        describe('url', function () {
            beforeEach(function () {
                GuineaPig.extend({ url: true });
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
            });
            it('element dir should be set to ltr', function () {
                expect(sampleElement).toHaveAttr('dir', 'ltr');
            });
        });

        describe('date', function () {
            beforeEach(function () {
                $.fn.mask = jasmine.createSpy('mask').and.callFake(function () {
                    return;
                });
                GuineaPig.extend({ date: true });
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
            });
            it('tooltip should be embedded after label', function () {
                var tooltip = $('.tooltip-ui');
                expect(tooltip).toBeDefined();
                expect(ko.bindingHandlers.tlpTooltip.init).toHaveBeenCalled();
            });
            it('element dir should be set to ltr', function () {
                expect(sampleElement).toHaveAttr('dir', 'ltr');
            });
            it('element should have mask pattern of dd/mm/yyyy', function () {
                expect($.fn.mask).toHaveBeenCalledWith('99/99/9999', jasmine.anything());
            });
        });

        describe('zipCode', function () {
            beforeEach(function () {
                GuineaPig.extend({ zipCode: true });
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
            });
            it('find zip code link should be appeneded', function () {});
            it('tooltip should be embedded after label', function () {
                var tooltip = $('.tooltip-ui');
                expect(tooltip).toBeDefined();
                expect(ko.bindingHandlers.tlpTooltip.init).toHaveBeenCalled();
            });
        });

        describe('time', function () {
            beforeEach(function () {
                $.fn.mask = jasmine.createSpy('mask').and.callFake(function () {
                    return;
                });
                GuineaPig.extend({ time: true });
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
            });
            it('tooltip should be embedded after label', function () {
                var tooltip = $('.tooltip-ui');
                expect(tooltip).toBeDefined();
                expect(ko.bindingHandlers.tlpTooltip.init).toHaveBeenCalled();
            });
            //waiting for infrastructure newer version
            xit('element should have mask with pattern of hh:mm', function () {
                expect($.fn.mask).toHaveBeenCalled();
            });
        });

        describe('number', function () {
            beforeEach(function () {
                GuineaPig.extend({ number: true });
                spyOn(tfsMethods, 'isMobile').and.returnValue(true);
            });
            it('element receives type number in mobile', function () {
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
                expect(sampleElement).toHaveAttr('type', 'number');
            });
            it('element receives attribute pattern in mobile', function () {
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
                expect(sampleElement).toHaveAttr('pattern', '\\d*');
            });
        });

        describe('maxLength', function () {
            beforeEach(function () {
                GuineaPig.extend({ maxLength: 6 });
                ko.applyBindingsToNode(sampleElement.get(0), { value: GuineaPig });
            });
            it('element should have maxLength attribute', function () {
                expect(sampleElement).toHaveAttr('maxLength', '6');
            });
        });
    });
});