/// <reference path="template/openCloseSpec.html" />
define([
    'common/components/openClose/openClose',
    'common/components/formInformation/formInformationViewModel'
],

function (tlpOpenClose, formInformation) {//eslint-disable-line no-unused-vars


    describe('validate', function () {
        var viewModel;
        describe('extensionRules Address', function () {

            beforeAll(function () {
                formInformation.language('hebrew');
                viewModel = {//eslint-disable-line no-unused-vars
                    isOpenContent: ko.observable(true)
                };
            });

            it('should be defined in the binding handlers', function () {
                expect(ko.bindingHandlers.tlpOpenClose).toBeDefined();
            });

            describe('close using isOpenContent', function () {
                beforeEach(function () {
                    jasmine.getFixtures().fixturesPath = '/base/Tests/components/openClose/templates';
                    loadFixtures('openCloseSpec.html');
                    ko.cleanNode($('body')[0]);
                    ko.applyBindings(viewModel);
                    viewModel.isOpenContent(false);
                });

                //$('.open-close-button').trigger('click');

                it('button should have aria-label "הרחב שורה"', function () {
                    expect($('.open-close-button')).toHaveAttr('aria-label', 'הרחב שורה');
                });
                it('button should have aria-expanded false', function () {
                    expect($('.open-close-button')).toHaveAttr('aria-expanded', 'false');
                });

                it('content should be displayed', function () {
                    expect($('#row')).toHaveClass('minimized');
                });
            });

            describe('open using isOpenContent', function () {
                beforeEach(function () {
                    jasmine.getFixtures().fixturesPath = '/base/Tests/components/openClose/templates';
                    loadFixtures('openCloseSpec.html');
                    ko.cleanNode($('body')[0]);
                    ko.applyBindings(viewModel);
                    viewModel.isOpenContent(true);
                });
                //$('.open-close-button').trigger('click');

                it('button should have aria-label "מזער שורה"', function () {
                    expect($('.open-close-button')).toHaveAttr('aria-label', 'מזער שורה');
                });

                it('button should have aria-expanded true', function () {
                    expect($('.open-close-button')).toHaveAttr('aria-expanded', 'true');
                });

                it('content should be displayed', function () {
                    expect($('#row')).not.toHaveClass('minimized');
                });

            });

        });
    });

});

define('spec/openCloseSpec.js', function () { });