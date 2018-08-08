/// <reference path='../../lib/jasmine-2.0.0/boot.js' />
/// <reference path='../../lib/jasmine-2.0.0/jasmine.js' />
define([
    'common/ko/fn/config',
    'common/elements/dynamicTable',
    'common/ko/bindingHandlers/accessibility',
    'common/ko/bindingHandlers/checkbox'],
    function() {
       
        //jasmine.getFixtures().fixturesPath = './accessibility/templates';

        describe('Dynamic table', function () {
            var Person = function () {
                var self = this;
                self.firstName = ko.observable('');
                self.lastName = ko.observable('');
                self.newUser = ko.observable('');
                self.attach = ko.observable('');
            };

            var viewModel;

            var delay = 500;

            beforeEach(function () {
                
                viewModel = {
                    contactsList: ko.observableArray([new Person()]).config({ type: Person }),
                    test : ko.observable(''),
                    testArray : ko.observableArray(['test1'])
                };
                jasmine.getFixtures().fixturesPath = '/base/Tests/accessibility/templates';
                loadFixtures('dynamicTableAccessibility.html');
                ko.applyBindings(viewModel, $('#accessibilityDiv')[0]);
               
            });

            afterEach(function () {
                ko.cleanNode(document.body);
            });

            describe('accessibility input', function () {
                
                it('bafore input binding', function (done) {
                    setTimeout(function () {
                        expect($('label')).not.toHaveAttr('id');
                        expect($('input')).not.toHaveAttr('aria-labelledby');
                        done();
                    }, delay);
                });

                it('after input binding', function (done) {
                    $('#addRow').click();
                    setTimeout(function () {
                        var accessibilityBind = { accessibility: {} };
                        var input = $('[id="accessibilityFirstName"]').get(1);
                        var label = $('[data-for="accessibilityFirstName"]').get(1);
                        ko.applyBindingsToNode(input, accessibilityBind);
                        expect($(input)).toHaveAttr('aria-labelledby');
                        expect($(label)).toHaveAttr('id');
                        done();
                    }, delay);
                });

                it('after inner input binding', function (done) {
                    $('#addRow').click();
                    setTimeout(function () {
                        var accessibilityBind = { accessibility: {} };
                        var input = $('[id="accessibilityLastName"]').get(1);
                        var label = $('[data-for="accessibilityLastName"]').get(1);
                        ko.applyBindingsToNode(input, accessibilityBind);
                        expect($(input)).toHaveAttr('aria-labelledby');
                        expect($(label)).toHaveAttr('id');
                        done();
                    }, delay);
                });

                it('throw an error when input not found in two traversing hierarchies', function (done) {
                    setTimeout(function () {
                        expect(function () { ko.bindingHandlers.accessibility.init($('[for="ID"]'.get(1))); }).toThrow();
                        done();
                    }, delay);
                });
        
            });

            var notFound = -1, myCheckbox, checkboxOfArray1, checkboxOfArray2, lbl, lblArray;
            var findMyLabel = function (element) {
                var parentElement = element.parent();
                var lbl = $(parentElement).find('label').get(0);
                return lbl;
            };

            describe('accessibility checkbox', function () {
              
                it('before bind with checkbox', function (done) {
                    $('#addRow').click();
                    setTimeout(function () {
                        myCheckbox = $('[id="test"]').get(1);
                        lbl = findMyLabel($(myCheckbox));
                        expect($(lbl)).not.toHaveAttr('id');

                        expect($(myCheckbox)).not.toHaveAttr('aria-labelledby');

                        expect(viewModel.test()).toEqual('');
                        done();
                    }, delay);
                });             

                it('checkbox binding whith observableArray', function (done) {
                    $('#addRow').click();
                    setTimeout(function () {
                        var checkboxBind = { checkbox: viewModel.testArray };
                        checkboxOfArray1 = $('[id="testarray1"]').get(1);
                        checkboxOfArray2 = $('[id="testarray2"]').get(1);
                        lblArray = findMyLabel($(checkboxOfArray2));

                        ko.applyBindingsToNode(checkboxOfArray1, checkboxBind);
                        ko.applyBindingsToNode(checkboxOfArray2, checkboxBind);

                        expect($(checkboxOfArray1)).toHaveAttr('checked');
                        expect($(checkboxOfArray2)).not.toHaveAttr('checked');

                        $(lblArray)[0].click();
                        expect($(checkboxOfArray2)).toHaveAttr('checked');
                        expect(viewModel.testArray.indexOf('test2') !== notFound).toBeTruthy();
                        done();
                    }, delay);
                });

            });
            describe('focus', function () {

                it('when click on label input', function () {
                    var input = $('[id="accessibilityFirstName"]')[0];
                    var inputLabel = $('[data-for="accessibilityFirstName"]')[0];
                    spyOn(input, 'focus');
                    ko.applyBindingsToNode(input, { accessibility: {} });
                    inputLabel.click();
                    expect(input.focus).toHaveBeenCalled();
                });

                it('when click on disabled label input', function () {
                    var input = $('[id="accessibilityFirstName"]')[0];
                    var inputLabel = $('[data-for="accessibilityFirstName"]')[0];
                    spyOn(input, 'focus');
                    ko.applyBindingsToNode(input, { accessibility: {},attr:{disabled:'disabled' }});
                    inputLabel.click();
                    expect(input.focus).not.toHaveBeenCalled();
                });

                it('when click on Attachment', function () {
                    var attachment = $('[id="attach"]')[0];
                    var attachmentLabel = $('[data-for="attach"]')[0];
                    spyOn(attachment, 'focus');
                    spyOn(attachment, 'click');
                    ko.applyBindingsToNode(attachment, { accessibility: {} });
                    attachmentLabel.click();
                    expect(attachment.focus).toHaveBeenCalled();
                    expect(attachment.click).toHaveBeenCalled();
                });

            });

        });
        //$(document).ready(function () {
        //    window.executeTests();
        //});
    });