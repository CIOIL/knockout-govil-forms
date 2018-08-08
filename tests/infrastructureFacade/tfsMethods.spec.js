/* global spyOn agform2Html jasmine*/

define(['common/infrastructureFacade/tfsMethods',
         'common/resources/infrastructureEnums',
         'common/core/exceptions',
         'common/resources/exeptionMessages'],
    function (tfsMethods, infrastructureEnum, formExceptions, exceptionsMessages) {//eslint-disable-line max-params

        function testGlobalISFuncCall(facadeFunc, globalFunc) {

            var getScopeAndFunction = function (rootScope, functionName) {
                var stack = functionName.split('.');
                for (var i = 0; i < stack.length - 1; i++) {
                    rootScope = rootScope[stack[i]];
                }
                functionName = stack[stack.length - 1];
                return { scope: rootScope, functionName: functionName };
            };

            var global = getScopeAndFunction(window, globalFunc);
            var globalScope = global.scope;
            var globalFunction = global.functionName;

            var facade = getScopeAndFunction(tfsMethods, facadeFunc);
            var facadeScope = facade.scope;
            var facadeFunction = facade.functionName;


            //create the infracture function 
            globalScope[globalFunction] = function () { };
            spyOn(globalScope, globalFunction);
            facadeScope[facadeFunction]();
            expect(globalScope[globalFunction]).toHaveBeenCalled();

            //check throw if the the infracture function is not defined           
            globalScope[globalFunction] = undefined;
            expect(function () {
                facadeScope[facadeFunction]();
            }).toThrowError('the function "' + globalFunction + '" does not exist');

            //check throw if the function throws
            globalScope[globalFunction] = jasmine.createSpy().and.callFake(function () {
                formExceptions.throwFormError('critical exception');
            });
            expect(function () {
                facadeScope[facadeFunction]();
            }).toThrowError('calling to function "' + globalFunction + '" threw exception: critical exception');
        }

        describe('Test global methods', function () {

            describe('"TFS" methods', function () {
                it('call "tfsAjaxRequest" function from "ajaxRequest" function', function () {
                    testGlobalISFuncCall('ajaxRequest', 'tfsAjaxRequest');
                });

                it('call "tfsCallServer" function from "callServer" function', function () {
                    testGlobalISFuncCall('callServer', 'tfsCallServer');
                });

                it('call "tfsDoBind" function from "doBind" function', function () {
                    testGlobalISFuncCall('lookup.doBind', 'tfsDoBind');
                });

                it('call "tfsGetElementById" function from "getElementById" function', function () {
                    testGlobalISFuncCall('getElementById', 'tfsGetElementById');
                });

                it('call "tfsGetElementsByName" function from "getElementsByName" function', function () {
                    testGlobalISFuncCall('getElementsByName', 'tfsGetElementsByName');
                });

                it('call "tfsGetValue" function from "getValue" function', function () {
                    testGlobalISFuncCall('getValue', 'tfsGetValue');
                });

                it('call "tfsImportData" function from "importData" function', function () {
                    testGlobalISFuncCall('importData', 'tfsImportData');
                });

                it('call "tfsLock" function from "lock" function', function () {
                    testGlobalISFuncCall('lock', 'tfsLock');
                });

                it('call "tfsLockForm" function from "lockForm" function', function () {
                    testGlobalISFuncCall('lockForm', 'tfsLockForm');
                });

                it('call "tfsResetFields" function from "resetFields" function', function () {
                    testGlobalISFuncCall('resetFields', 'tfsResetFields');
                });

                it('call "tfsResetForm" function from "resetForm" function', function () {
                    testGlobalISFuncCall('resetForm', 'tfsResetForm');
                });

                it('call "tfsSetValue" function from "setValue" function', function () {
                    testGlobalISFuncCall('setValue', 'tfsSetValue');
                });

                it('call "tfsUnLock" function from "unlock" function', function () {
                    testGlobalISFuncCall('unlock', 'tfsUnLock');
                });
            });

            describe('"Agat" methods', function () {
                window.AgatToolbar = undefined;
                beforeEach(function () {
                    window.AgatToolbar = jasmine.createSpyObj('AgatToolbar', ['submitForm', 'saveFormAsPDF', 'printForm']);
                });

                it('call "AgatToolbar.submitForm" function from "submitForm" function', function () {
                    testGlobalISFuncCall('submitForm', 'AgatToolbar.submitForm');
                });

                it('call "AgatToolbar.submitForm" function from "submitForm" function', function () {

                    tfsMethods.submitForm();

                    expect(window.AgatToolbar.submitForm).toHaveBeenCalled();

                    //check throw if the the infracture function is not defined  
                    window.AgatToolbar.submitForm = undefined;
                    expect(function () {
                        tfsMethods.submitForm();
                    }).toThrowError('the function "' + 'submitForm' + '" does not exist');

                    //check throw if the function throws
                    window.AgatToolbar.submitForm = jasmine.createSpy().and.callFake(function () {
                        formExceptions.throwFormError('critical exception');
                    });

                    expect(function () {
                        tfsMethods.submitForm();
                    }).toThrowError('calling to function "' + 'submitForm' + '" threw exception: critical exception');

                });

                it('call "AgatToolbar.submitFormSuccessCallbackHandler" function from "submitFormSuccessCallbackHandler" function', function () {
                    testGlobalISFuncCall('submitFormSuccessCallbackHandler', 'AgatToolbar.submitFormSuccessCallbackHandler');
                });

                it('call "AgatToolbar.saveFormAsPDF" function from "saveFormAsPDF" function', function () {
                    testGlobalISFuncCall('saveFormAsPDF', 'AgatToolbar.saveFormAsPDF');
                });

                it('call "AgatToolbar.printForm" function from "printForm" function', function () {
                    testGlobalISFuncCall('printForm', 'AgatToolbar.printForm');
                });

                it('call "AgatXML.getXML" function from "getXML" function', function () {
                    window.AgatXML = jasmine.createSpyObj('AgatXML', ['getXML']);
                    testGlobalISFuncCall('getXML', 'AgatXML.getXML');
                });

                it('call "AgatTables.clearTable" function from "clearTable" function', function () {
                    window.AgatTables = jasmine.createSpyObj('AgatTables', ['clearTable']);
                    testGlobalISFuncCall('clearTable', 'AgatTables.clearTable');
                });

                it('call "AgatEngine.setFormLanguage" function from "setFormLanguage" function', function () {
                    window.AgatEngine = jasmine.createSpyObj('AgatEngine', ['setFormLanguage']);
                    testGlobalISFuncCall('setFormLanguage', 'AgatEngine.setFormLanguage');
                });
            }); 
        });


        describe('"tfsMethods.attributes" functions - methods that are checking attributes', function () {

            describe('"tfsAction" methods', function () {

                describe('"getElementAction" function', function () {

                    beforeEach(function () {
                        jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                        loadFixtures('InfrastructureFacade.html');
                    });

                    it('call with valid tfsAction attribute of input', function () {
                        var input = $('#validAttachmentInput');
                        expect(tfsMethods.attributes.getElementAction(input)).toBe(infrastructureEnum.actions.addattachment);
                    });

                    it('call with invalid tfsAction attribute of input', function () {
                        var input = $('#unknownAttributesInput');
                        expect(tfsMethods.attributes.getElementAction(input)).toBe('');
                    });

                    it('call with undefined element', function () {
                        var input = $('#unknownAttributesInput1');
                        expect(function () { tfsMethods.attributes.getElementAction(input); }).toThrowError('the parameter "element" is undefined');
                    });

                    it('call with element that doesnt have "tfsAction" attribute', function () {
                        var input = $('#tfsValueInput');
                        expect(tfsMethods.attributes.getElementAction(input)).toBeUndefined();
                    });

                });
            });


            describe('"setElementAction" function', function () {

                beforeEach(function () {
                    jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                    loadFixtures('InfrastructureFacade.html');
                });

                it('set valid tfsAction attribute of input', function () {
                    var input = $('#validAttachmentInput');
                    tfsMethods.attributes.setElementAction(input, infrastructureEnum.actions.displayattachment);
                    expect(tfsMethods.attributes.getElementAction(input)).toBe(infrastructureEnum.actions.displayattachment);
                });

                it('call with invalid "tfsaction"', function () {
                    var input = $('#validAttachmentInput');
                    expect(function () { tfsMethods.attributes.setElementAction(input, 'xxx'); }).toThrowError('the parameter "action" is invalid');
                });

                it('call with undefined element', function () {
                    var input = $('#unknownAttributesInput1');
                    expect(function () { tfsMethods.attributes.setElementAction(input); }).toThrowError('the parameter "element" is undefined');
                });

            });
        });

        describe('"getElementType" function', function () {

            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                loadFixtures('InfrastructureFacade.html');
            });

            it('call with valid "tfsDataType" attribute of input', function () {
                var input = $('#validAttachmentInput');
                expect(tfsMethods.attributes.getElementType(input)).toBe(infrastructureEnum.dataTypes.attachment);
            });

            it('call with invalid "tfsDataType" attribute of input', function () {
                var input = $('#unknownAttributesInput');
                expect(tfsMethods.attributes.getElementType(input)).toBe('');
            });

            it('call with undefined element', function () {
                var input = $('#unknownAttributesInput1');
                expect(function () { tfsMethods.attributes.getElementType(input); }).toThrowError('the parameter "element" is undefined');
            });

            it('call with element that doesnt have "tfsDataType" attribute', function () {
                var input = $('#regularAttachment');
                expect(tfsMethods.attributes.getElementType(input)).toBeUndefined();
            });

        });

        describe('"getName" function', function () {

            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                loadFixtures('InfrastructureFacade.html');
            });

            it('call with valid tfsName attribute of input', function () {
                var input = $('#validAttachmentInput');
                expect(tfsMethods.attributes.getName(input)).toBe('צרופה');
            });

            it('call with element that doesnt have "tfsName" attribute', function () {
                var input = $('#tfsValueInput');
                expect(tfsMethods.attributes.getName(input)).toBeUndefined();
            });

            it('call with undefined element', function () {
                var input = $('#unknownAttributesInput1');
                expect(function () { tfsMethods.attributes.getName(input); }).toThrowError('the parameter "element" is undefined');
            });

        });

        describe('"setElementUploaded" function', function () {

            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                loadFixtures('InfrastructureFacade.html');
            });

            it('set valid tfsUploaded attribute of input', function () {
                var input = $('#validAttachmentInput');
                tfsMethods.attributes.setElementUploaded(input, 'true');
                expect(input.attr('tfsuploaded')).toBe('true');
                expect(tfsMethods.attributes.isUploadedElement(input)).toBeTruthy();
            });

            it('set valid tfsUploaded attribute of input - undefined(= false)', function () {
                var input = $('#validAttachmentInput');
                tfsMethods.attributes.setElementUploaded(input);
                expect(input.attr('tfsuploaded')).toBe('false');
                expect(tfsMethods.attributes.isUploadedElement(input)).toBeFalsy();
            });

            it('set valid tfsUploaded attribute of input - "vvv"(= true)', function () {
                var input = $('#validAttachmentInput');
                tfsMethods.attributes.setElementUploaded(input, 'vvv');
                expect(input.attr('tfsuploaded')).toBe('true');
                expect(tfsMethods.attributes.isUploadedElement(input)).toBeTruthy();
            });

            it('set valid tfsUploaded attribute of input - false(= false)', function () {
                var input = $('#validAttachmentInput');
                tfsMethods.attributes.setElementUploaded(input, false);
                expect(input.attr('tfsuploaded')).toBe('false');
                expect(tfsMethods.attributes.isUploadedElement(input)).toBeFalsy();
            });

            it('call with undefined element', function () {
                var input = $('#unknownAttributesInput1');
                expect(function () { tfsMethods.attributes.setElementUploaded(input); }).toThrowError('the parameter "element" is undefined');
            });

        });

        describe('"tfsMethods.attachment" functions', function () {


            beforeEach(function () {
                window.AgatAttachment = jasmine.createSpyObj('AgatAttachment', ['clearInpufFileElement', 'formAllAttachmentsTotalSize', 'displayAttachment','getAttachmentInfo']);
                jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                loadFixtures('InfrastructureFacade.html');
            });

            it('"removeAllAttachments" function - call "AgatToolbar.removeAllAttachments" function from "removeAllAttachments" function', function () {
                testGlobalISFuncCall('attachment.removeAllAttachments', 'AgatToolbar.removeAllAttachments');
            });

            it('"getTotalAttachmentsSize" function - call "AgatAttachment.formAllAttachmentsTotalSize" function from "getTotalAttachmentsSize" function', function () {
                testGlobalISFuncCall('attachment.getTotalAttachmentsSize', 'AgatAttachment.formAllAttachmentsTotalSize');
            });

            describe('"clearAttachment" function', function () {

                beforeEach(function () {
                    jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                    loadFixtures('InfrastructureFacade.html');
                });

                it('valid data - global function have been called', function () {
                    //Avoiding assignment to $.fn with jasmine.createSpy($.fn, 'tfsClear') hence the declartion of the tfsClear function
                    $.fn.tfsClear = function () { };
                    spyOn($.fn, 'tfsClear');
                    tfsMethods.attachment.clearAttachment($('#attachment'));
                    expect(window.AgatAttachment.clearInpufFileElement).toHaveBeenCalled();
                    expect($.fn.tfsClear).toHaveBeenCalled();
                });

                it('undefined element parameter', function () {
                    expect(function () { tfsMethods.attachment.clearAttachment(); }).toThrowError('the parameter "element" is undefined');
                });

                it('calling with element that is different from attachment input ', function () {
                    var input = $('body');
                    expect(function () { tfsMethods.attachment.clearAttachment(input); }).toThrowError('the parameter "element" must be of attachment type');
                });

            });


            describe('"viewAttachment" function', function () {

                it('undefined element parameter - call without param ', function () {
                    expect(function () { tfsMethods.attachment.viewAttachment(); }).toThrowError('the parameter "element" is undefined');
                });

                it('undefined element parameter - call with unexisting element', function () {
                    var input = $('#attachmentt');
                    expect(function () { tfsMethods.attachment.viewAttachment(input); }).toThrowError('the parameter "element" is undefined');
                });

                it('calling with element that is different from attachment input ', function () {
                    var input = $('body');
                    expect(function () { tfsMethods.attachment.viewAttachment(input); }).toThrowError('the parameter "element" must be of attachment type');
                });

                it('calling with valid parameter - uploaded attachment input', function () {
                    var input = $('#attachment');
                    tfsMethods.attachment.viewAttachment(input);
                    expect(window.AgatAttachment.displayAttachment).toHaveBeenCalled();
                });

                it('calling with unuploaded attachment input', function () {
                    var input = $('#validAttachmentInput');
                    tfsMethods.attachment.viewAttachment(input);
                    expect(window.AgatAttachment.displayAttachment).not.toHaveBeenCalled();
                });

            });

            describe('"getAttachmentInfo" function', function () {

                it('undefined element parameter - call without param ', function () {
                    expect(function () { tfsMethods.attachment.getAttachmentInfo(); }).toThrowError('the parameter "element" is undefined');
                });

                it('undefined element parameter - call with unexisting element', function () {
                    var input = $('#attachmentt');
                    expect(function () { tfsMethods.attachment.getAttachmentInfo(input); }).toThrowError('the parameter "element" is undefined');
                });

                it('calling with element that is different from attachment input ', function () {
                    var input = $('body');
                    expect(function () { tfsMethods.attachment.getAttachmentInfo(input); }).toThrowError('the parameter "element" must be of attachment type');
                });

                it('calling with valid parameter ', function () {
                    var input = $('#attachment');
                    tfsMethods.attachment.getAttachmentInfo(input);
                    expect(window.AgatAttachment.getAttachmentInfo).toHaveBeenCalled();
                });

          
            });
        });

        describe('getAttachmentsUniqueNames function', function () {

            beforeEach(function () {

                window.AgatAttachment = jasmine.createSpyObj('AgatAttachment', ['dataAttributes']);
                window.AgatAttachment.dataAttributes = jasmine.createSpyObj('AgatAttachment.dataAttributes', ['filename']);
                window.AgatAttachment.dataAttributes.filename.elementAttribute = 'newfilename';
                window.AgatAttachment.dataAttributes.filename.dynamictable = 'newfilenames';
                jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                loadFixtures('InfrastructureFacade.html');           
            });

            it('valid data', function () {
                $('#attachmentsTable').data('newfilenames', ['attachment1', 'attachment2']);
                var tableElement = $('#attachmentsTable');
                var uniqueNames = tfsMethods.attachment.getAttachmentsUniqueNames(tableElement, true);
                expect(uniqueNames).toEqual(['attachment1', 'attachment2']);
                $('#attachmentsTable').removeData('newfilenames');
            });

            it('invalid data', function () {
                var tableElement = $('#attachmentsTable');
                var uniqueNames = tfsMethods.attachment.getAttachmentsUniqueNames(tableElement, true);
                expect(uniqueNames).toEqual([]);
            });

            it('invalid data - not a table', function () {
                var element = $('#attachment');
                expect(function () { tfsMethods.attachment.getAttachmentsUniqueNames(element, true); }).toThrowError('the parameter "element" must be of table of attachments element type');
            });

            it('undefined element parameter - call with unexisting element', function () {
                var tableElement = $('#attachmentsTable1');
                expect(function () { tfsMethods.attachment.getAttachmentsUniqueNames(tableElement, true); }).toThrowError('the parameter "element" is undefined');
            });

            it('invalid "isTable" parameter', function () {
                var tableElement = $('#attachmentsTable');
                $('#attachmentsTable').data('newfilenames', ['attachment1', 'attachment2']);
                expect(function () { tfsMethods.attachment.getAttachmentsUniqueNames(tableElement, 'vv'); }).toThrowError('the parameter "element" must be of attachment type');
                $('#attachmentsTable').removeData('newfilenames');
            });

            it('valid data - attachment input', function () {              
                var element = $('#attachment');
                $('#attachment').data('newfilename', 'attachment1');
                var uniqueNames = tfsMethods.attachment.getAttachmentsUniqueNames(element, false);
                expect(uniqueNames).toEqual('attachment1');
            });

            it('invalid "isTable" parameter - so isTable equals to false', function () {             
                var element = $('#attachment');
                $('#attachment').data('newfilename', 'attachment1');
                var uniqueNames = tfsMethods.attachment.getAttachmentsUniqueNames(element, 'vv');
                expect(uniqueNames).toEqual('attachment1');
                $('#attachment').removeData('newfilename');
            });

            it('valid data - attachment input', function () {
                var tableElement = $('#attachmentsTable');
                $('#attachment').data('newfilename', 'attachment1');
                expect(function () { tfsMethods.attachment.getAttachmentsUniqueNames(tableElement, false); }).toThrowError('the parameter "element" must be of attachment type');
            });

        });

        describe('tfsMethods.isAttachmentInput function', function () {
            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                loadFixtures('InfrastructureFacade.html');
            });

            it('call with valid "tfsDataType" attribute of input - valid attachment', function () {
                var input = $('#validAttachmentInput');
                expect(tfsMethods.attachment.isAttachmentInput(input)).toBeTruthy();
            });

            it('call with not attachment element ', function () {
                var input = $('#tfsValueInput');
                expect(tfsMethods.attachment.isAttachmentInput(input)).toBeFalsy();
            });

            it('call with undefined element', function () {
                expect(function () { tfsMethods.attachment.isAttachmentInput(); }).toThrowError('the parameter "element" is undefined');
            });

        });

        //});
        describe('"tfsMethods.dialog" functions', function () {
            beforeEach(function () {
                window.AgatDialog = jasmine.createSpyObj('AgatDialog', ['openDialog']);
                window.AgatSubmitPopup = jasmine.createSpyObj('AgatSubmitPopup', ['open', 'close']);
            });
            it('"alert" function - call "tfsAlert" function from "alert" function', function () {
                testGlobalISFuncCall('dialog.alert', 'tfsAlert');
            });

            it('"confirm" function - call "tfsConfirm" function from "confirm" function', function () {
                testGlobalISFuncCall('dialog.confirm', 'tfsConfirm');
            });

            it('"openDialog" function - call "AgatDialog.openDialog" function from "openDialog" function', function () {
                testGlobalISFuncCall('dialog.openDialog', 'AgatDialog.openDialog');
            });

            it('"openPopup" function - call "AgatSubmitPopup.open" function from "openPopup" function', function () {
                testGlobalISFuncCall('dialog.openSubmitPopup', 'AgatSubmitPopup.open');
            });

            it('"closePopup" function - call "AgatSubmitPopup.close" function from "closePopup" function', function () {
                testGlobalISFuncCall('dialog.closeSubmitPopup', 'AgatSubmitPopup.close');
            });

        });

        describe('"tfsMethods.toolbar" functions', function () {

            it('call "tfsHideToolbar" function from "hideToolbar" function', function () {
                testGlobalISFuncCall('toolbar.hideToolbar', 'tfsHideToolbar');
            });

            it('call "tfsShowToolbar" function from "showToolbar" function', function () {
                testGlobalISFuncCall('toolbar.showToolbar', 'tfsShowToolbar');
            });

            it('call "AgatToolbar.initToolbarButtons" function from "initToolbar" function', function () {
                testGlobalISFuncCall('toolbar.initToolbar', 'AgatToolbar.initToolbarButtons');
            });

            it('call "AgatToolbar.handleToolbarButtonsClick" function from "handleToolbarButtonsClick" function', function () {
                testGlobalISFuncCall('toolbar.clickToolbarButton', 'AgatToolbar.handleToolbarButtonsClick');
            });

        });

        describe('"tfsMethods.browser" functions', function () {

            it('"getBrowserName" function', function () {
                if (tfsMethods.isAGForms2Html()) {
                    expect(agform2Html).toBeDefined();
                } else {
                    expect(function () { tfsMethods.browser.getName(); }).toThrowError('"AGForms2Html" must be running in order to call this function');
                }
            });

            it('"getBrowserVersion" function', function () {
                if (tfsMethods.isAGForms2Html()) {
                    expect(agform2Html).toBeDefined();
                } else {
                    expect(function () { tfsMethods.browser.getVersion(); }).toThrowError('"AGForms2Html" must be running in order to call this function');
                }
            });

            it('"getBrowserDocumentMode" function', function () {
                if (tfsMethods.isAGForms2Html()) {
                    expect(agform2Html).toBeDefined();
                } else {
                    expect(function () { tfsMethods.browser.getDocumentMode(); }).toThrowError('"AGForms2Html" must be running in order to call this function');
                }
            });

        });

        describe('"tfsMethods.toggleLanguageDiv" function', function () {

            var modalId;

            beforeEach(function () {
                jasmine.getFixtures().fixturesPath = '/base/Tests/infrastructureFacade/templates';
                loadFixtures('toggleLanguageDiv.html');
                modalId = $('#my_modal_id');
                tfsMethods.toggleLanguageDiv();
            });

            it('show the toggle language div', function () {                                 
                expect((modalId).css('display')).toBe('block');
            });

            it('hide the toggle language div', function () {
                tfsMethods.toggleLanguageDiv();
                expect((modalId).css('display')).toBe('none');
            });

            it('should throw exeption if AGForms2Html Version does not cantain CSS of multi languages', function () {
                $('#toggleDiv').remove();
                expect(function () { tfsMethods.toggleLanguageDiv(); }).toThrowError(exceptionsMessages.AGForms2HtmlVersion);
            });
        });

       
    }
);
