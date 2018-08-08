define(['common/utilities/reflection',
    'common/ko/validate/koValidationSpecMatchers',
    'common/utilities/stringExtension',
    'common/resources/texts/personalDetails',
    'common/resources/texts/basicValidation',
    'common/resources/texts/language',
    'common/components/formInformation/formInformationViewModel',
    'common/infrastructureFacade/tfsMethods',
    'common/ko/validate/extensionRules/personalDetails',
    'common/ko/globals/multiLanguageObservable'],

    function (reflection, matchers, stringExtension, personalDetailsTexts, basicTexts, languageTexts, formInformation, tfsMethods) {//eslint-disable-line max-params
        var resources = reflection.extend(reflection.extend(personalDetailsTexts, basicTexts), languageTexts);

        var messages = ko.multiLanguageObservable({ resource: resources });
        var hasRule = function (rules, ruleName) {
            return ko.utils.arrayFirst(rules, function (item) {
                return item.ruleName === ruleName || item.rule === ruleName;
            });
        };
        var customMessage = 'ערך לא תקין!!!';
        describe('validate', function () {

            var testObj;
            var identificationType;
            beforeEach(function () {
                jasmine.addMatchers(matchers);
            });
            describe('extensionRules PersonalDetails', function () {
                describe('hebrewName', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ hebrewName: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ hebrewName: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "hebrewName"', function () {
                        expect(hasRule(testObj.rules(), 'hebrewName')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ hebrewName: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('אב bbb');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().hebrewName.letters);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('value too long', function () {
                        testObj('אבגדה וזחטי כלמנסדדדדדדדדד');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().maxLength, 25));//eslint-disable-line no-magic-numbers
                    });
                    it('value too short', function () {
                        testObj('ר');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().minLength, 2));
                    });
                    it('value with english letters', function () {
                        testObj('אב bbb');
                        expect(testObj).observableIsNotValid(messages().hebrewName.letters);
                        testObj('ddddd');
                        expect(testObj).observableIsNotValid(messages().hebrewName.letters);
                    });
                    it('value not valid apostropheAfterLetters', function () {
                        testObj("עהבא'"); //eslint-disable-line quotes
                        expect(testObj).observableIsNotValid(messages().hebrewName.apostropheAfterLetters);
                    });
                    it('value not valid finalLetters', function () {
                        testObj("שךל גגג"); //eslint-disable-line quotes
                        expect(testObj).observableIsNotValid(messages().hebrewName.finalLetters);
                    });
                    it('value valid', function () {
                        testObj('שלום וברכה');
                        expect(testObj).observableIsValid();
                        testObj('משה (ארנולד)');
                        expect(testObj).observableIsValid();
                        testObj('אמנון-משה');
                        expect(testObj).observableIsValid();
                        testObj('אצ"ג');
                        expect(testObj).observableIsValid();
                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ hebrewName: { params: true, message: customMessage } });
                        testObj('text');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                    it('validation message changes according to form language', function () {
                        spyOn(tfsMethods, 'setFormLanguage').and.callFake(function () {
                            return;
                        });
                        testObj('שךל גגג');
                        formInformation.language('hebrew');
                        expect(testObj).observableIsNotValid(resources['hebrew'].hebrewName.finalLetters);
                        formInformation.language('english');
                        testObj('שךל גגג');
                        expect(testObj).observableIsNotValid(resources['english'].hebrewName.finalLetters);
                    });
                });
                describe('englishName', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ englishName: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ englishName: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "englishName"', function () {
                        expect(hasRule(testObj.rules(), 'englishName')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ englishName: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('חיחיחי');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().englishName);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('value too long', function () {
                        testObj('aaaaa bbbbb ccccc ddddd fffff');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().maxLength, 25));//eslint-disable-line no-magic-numbers
                    });
                    it('value too short', function () {
                        testObj('a');
                        expect(testObj).observableIsNotValid(stringExtension.format(messages().minLength, 2));
                    });
                    it('value with invalid letters', function () {
                        testObj('אב bbb');
                        expect(testObj).observableIsNotValid(messages().englishName);
                        testObj('חיחיחי');
                        expect(testObj).observableIsNotValid(messages().englishName);
                        testObj("aaa'aa");//eslint-disable-line quotes
                        expect(testObj).observableIsNotValid(messages().noApostrophe);
                        testObj('th"r');//eslint-disable-line quotes
                        expect(testObj).observableIsNotValid(messages().englishName);
                    });
                    it('value  valid ', function () {
                        testObj('rachel');
                        expect(testObj).observableIsValid();
                        testObj('Rachel Ester');
                        expect(testObj).observableIsValid();
                        testObj('Rachel-Ester');
                        expect(testObj).observableIsValid();
                        testObj('Rachel (Ester)');
                        expect(testObj).observableIsValid();
                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ englishName: { params: true, message: customMessage } });
                        testObj('רררר');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                });
                describe('idNum', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ idNum: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ idNum: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "idNum"', function () {
                        expect(hasRule(testObj.rules(), 'idNumRule')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ idNum: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('021357644');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().idNum);
                    });
                    it('all id rules applied', function () {
                        expect(ko.utils.arrayFirst(testObj.rules, function (item) { return item.rule === 'minLength'; })
                        ).toBeDefined();
                        expect(ko.utils.arrayFirst(testObj.rules, function (item) { return item.rule === 'maxLength'; })
                        ).toBeDefined();
                        expect(ko.utils.arrayFirst(testObj.rules, function (item) { return item.rule === 'idNumOrPassportRule'; })
                        ).toBeDefined();
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('value too long', function () {
                        testObj('0213576458');
                        expect(testObj).observableIsNotValid(messages().idNum);
                    });
                    it('value too short', function () {
                        testObj('2135764');
                        expect(testObj).observableIsNotValid(messages().idNum);
                    });
                    it('value contains invalid chars', function () {
                        testObj('213576-42');
                        expect(testObj).observableIsNotValid(messages().number);
                    });
                    it('value  valid ', function () {
                        testObj('021357645');
                        expect(testObj).observableIsValid();
                    });
                    it('value not valid ', function () {
                        testObj('021357644');
                        expect(testObj).observableIsNotValid(messages().idNum);
                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ idNum: { params: true, message: customMessage } });
                        testObj('021357644');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                });
                describe('soleTrader', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ soleTrader: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ soleTrader: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "soleTrader"', function () {
                        expect(hasRule(testObj.rules(), 'soleTrader')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ soleTrader: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('021357644');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().soleTrader);
                    });
                    it('all id rules applied', function () {
                        expect(ko.utils.arrayFirst(testObj.rules, function (item) { return item.rule === 'minLength'; })
                        ).toBeDefined();
                        expect(ko.utils.arrayFirst(testObj.rules, function (item) { return item.rule === 'maxLength'; })
                        ).toBeDefined();
                        expect(ko.utils.arrayFirst(testObj.rules, function (item) { return item.rule === 'soleTraderOrPassportRule'; })
                        ).toBeDefined();
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('value too long', function () {
                        testObj('0213576458');
                        expect(testObj).observableIsNotValid(messages().soleTrader);
                    });
                    it('value too short', function () {
                        testObj('2135764');
                        expect(testObj).observableIsNotValid(messages().soleTrader);
                    });
                    it('value contains invalid chars', function () {
                        testObj('213576-42');
                        expect(testObj).observableIsNotValid(messages().number);
                    });
                    it('value  valid ', function () {
                        testObj('021357645');
                        expect(testObj).observableIsValid();
                    });
                    it('value not valid ', function () {
                        testObj('021357644');
                        expect(testObj).observableIsNotValid(messages().soleTrader);
                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ soleTrader: { params: true, message: customMessage } });
                        testObj('021357644');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                });
                describe('israeliPassport', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ israeliPassport: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ israeliPassport: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "israeliPassport"', function () {
                        expect(hasRule(testObj.rules(), 'israeliPassport')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ israeliPassport: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('test.test');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().israeliPassport);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('length 7-8 chars', function () {
                        testObj('1234567');
                        expect(testObj).observableIsValid();
                        testObj('12345678');
                        expect(testObj).observableIsValid();
                        testObj('123456789');
                        expect(testObj).observableIsNotValid(messages().israeliPassport);
                        testObj('1234');
                        expect(testObj).observableIsNotValid(messages().israeliPassport);
                    });
                    it('numeric chars', function () {
                        testObj(1234567); //eslint-disable-line no-magic-numbers
                        expect(testObj).observableIsValid();
                        testObj('12345678');
                        expect(testObj).observableIsValid();
                        testObj('2345678a');
                        expect(testObj).observableIsNotValid(messages().israeliPassport);
                        testObj('234567.9');
                        expect(testObj).observableIsNotValid(messages().israeliPassport);
                        testObj('234567 9');
                        expect(testObj).observableIsNotValid(messages().israeliPassport);
                        testObj('234567ג9');
                        expect(testObj).observableIsNotValid(messages().israeliPassport);

                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ israeliPassport: { params: true, message: customMessage } });
                        testObj('2345678a');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                });
                describe('foreignPassport', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ foreignPassport: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ foreignPassport: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "foreignPassport"', function () {
                        expect(hasRule(testObj.rules(), 'foreignPassport')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ foreignPassport: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('1ff2 re ter');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().foreignPassport);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('max length', function () {
                        testObj('12345678901');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                    });
                    it('value invalid', function () {
                        testObj('1ff2 re ter');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                        testObj('1ff2#re@er');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                        testObj('ffהכג5435');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                    });
                    it('value valid', function () {
                        testObj('sgffggrtrr');
                        expect(testObj).observableIsValid();
                        testObj(123); //eslint-disable-line no-magic-numbers
                        expect(testObj).observableIsValid();
                        testObj('1ff2reter3');
                        expect(testObj).observableIsValid();
                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ foreignPassport: { params: true, message: customMessage } });
                        testObj('1ff2#re@er');
                        expect(testObj).observableIsNotValid(customMessage);
                    });

                });
                describe('idNum or passport', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        identificationType = ko.observable('1');
                        testObj.extend({ idNumOrPassport: identificationType });
                    });
                    it('obserbale has rules "idNum" & "foreignPassport"', function () {
                        expect(hasRule(testObj.rules(), 'idNum')).toBeTruthy();
                        expect(hasRule(testObj.rules(), 'foreignPassport')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ idNumOrPassport: { onlyIf: con, params: identificationType } });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('111111111');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().idNum);
                    });
                    it('type id', function () {
                        testObj('0213576458');
                        expect(testObj).observableIsNotValid(messages().idNum);
                        testObj('213576aaa');
                        expect(testObj).observableIsNotValid(messages().number);
                        testObj('1ff2 re t');
                        expect(testObj).observableIsNotValid(messages().number);
                        testObj('111111118');
                        expect(testObj).observableIsValid();
                    });
                    it('type passport', function () {
                        identificationType('2');
                        testObj('12345678901');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                        testObj('1ff2 re ter');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                        testObj('213576aaa');
                        expect(testObj).observableIsValid();
                        testObj('111111118');
                        expect(testObj).observableIsValid();
                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ idNumOrPassport: { params: identificationType, message: customMessage } });
                        identificationType('1');
                        testObj('111111114');
                        expect(testObj).observableIsNotValid(customMessage);
                        identificationType('2');
                        testObj('1ff2#re@er');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                });
                describe('cp', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ cp: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ cp: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "cp"', function () {
                        expect(hasRule(testObj.rules(), 'cp')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ cp: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('test.test');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().cp);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('value starts with digit 5', function () {
                        testObj('523456789');
                        expect(testObj).observableIsValid();
                        testObj('123456789');
                        expect(testObj).observableIsNotValid(messages().cp);
                    });
                    it('length- 9 chars', function () {
                        testObj('523456789');
                        expect(testObj).observableIsValid();
                        testObj('52345678');
                        expect(testObj).observableIsNotValid(messages().cp);
                        testObj('5234567890');
                        expect(testObj).observableIsNotValid(messages().cp);
                    });
                    it('numeric chars', function () {
                        testObj(523456789); //eslint-disable-line no-magic-numbers
                        expect(testObj).observableIsValid();
                        testObj('523456789');
                        expect(testObj).observableIsValid();
                        testObj('52345678a');
                        expect(testObj).observableIsNotValid(messages().cp);
                        testObj('5234567.9');
                        expect(testObj).observableIsNotValid(messages().cp);
                        testObj('5234567 9');
                        expect(testObj).observableIsNotValid(messages().cp);
                        testObj('5234567ג9');
                        expect(testObj).observableIsNotValid(messages().cp);

                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ cp: { params: true, message: customMessage } });
                        testObj('52345678a');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                });
                describe('npo', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ npo: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ npo: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "npo"', function () {
                        expect(hasRule(testObj.rules(), 'npo')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ npo: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('test.test');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().npo);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('value starts with 580', function () {
                        testObj('580456789');
                        expect(testObj).observableIsValid();
                        testObj('555555555');
                        expect(testObj).observableIsNotValid(messages().npo);
                        testObj('123456789');
                        expect(testObj).observableIsNotValid(messages().npo);
                    });
                    it('length- 9 chars', function () {
                        testObj('580456789');
                        expect(testObj).observableIsValid();
                        testObj('58045678');
                        expect(testObj).observableIsNotValid(messages().npo);
                        testObj('5804567890');
                        expect(testObj).observableIsNotValid(messages().npo);
                    });
                    it('numeric chars', function () {
                        testObj(580456789); //eslint-disable-line no-magic-numbers
                        expect(testObj).observableIsValid();
                        testObj('580456789');
                        expect(testObj).observableIsValid();
                        testObj('58045678a');
                        expect(testObj).observableIsNotValid(messages().npo);
                        testObj('5804567.9');
                        expect(testObj).observableIsNotValid(messages().npo);
                        testObj('5804567 9');
                        expect(testObj).observableIsNotValid(messages().npo);
                        testObj('5804567ג9');
                        expect(testObj).observableIsNotValid(messages().npo);

                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ npo: { params: true, message: customMessage } });
                        testObj('52345678a');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                });
                describe('passport', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ passport: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ passport: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "foreignPassport"', function () {
                        expect(hasRule(testObj.rules(), 'foreignPassport')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ passport: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('1ff2 re ter');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().foreignPassport);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });

                    it('max length', function () {
                        testObj('12345678901');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                    });

                    it('value invalid', function () {
                        testObj('1ff2 re ter');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                        testObj('1ff2#re@er');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                        testObj('ffהכג5435');
                        expect(testObj).observableIsNotValid(messages().foreignPassport);
                    });

                    it('value valid', function () {
                        testObj('sgffggrtrr');
                        expect(testObj).observableIsValid();
                        testObj(123); //eslint-disable-line no-magic-numbers
                        expect(testObj).observableIsValid();
                        testObj('1ff2reter3');
                        expect(testObj).observableIsValid();
                    });
                });
                describe('militaryIdNumber', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ militaryIdNumber: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ militaryIdNumber: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "militaryIdNumber"', function () {
                        expect(hasRule(testObj.rules(), 'militaryIdNumber')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ militaryIdNumber: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('test.test');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().militaryIdNumber);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('length- 7 chars', function () {
                        testObj('1234567');
                        expect(testObj).observableIsValid();
                        testObj('123456');
                        expect(testObj).observableIsNotValid(messages().militaryIdNumber);
                        testObj('12345678');
                        expect(testObj).observableIsNotValid(messages().militaryIdNumber);
                    });
                    it('numeric chars', function () {
                        testObj(1234567); //eslint-disable-line no-magic-numbers
                        expect(testObj).observableIsValid();
                        testObj('1234567');
                        expect(testObj).observableIsValid();
                        testObj('1234ד67');
                        expect(testObj).observableIsNotValid(messages().militaryIdNumber);
                        testObj('12345.7');
                        expect(testObj).observableIsNotValid(messages().militaryIdNumber);
                        testObj('12345 7');
                        expect(testObj).observableIsNotValid(messages().militaryIdNumber);
                        testObj('12345d7');
                        expect(testObj).observableIsNotValid(messages().militaryIdNumber);

                    });

                });
                describe('carNumber', function () {
                    beforeEach(function () {
                        testObj = ko.observable();
                        testObj.extend({ carNumber: true });
                    });
                    it('apply validation with null', function () {
                        testObj.extend({ validatable: false });
                        expect(function () {
                            testObj.extend({ carNumber: null });
                        }).not.toThrow();
                    });
                    it('obserbale has rule or ruleName "carNumber"', function () {
                        expect(hasRule(testObj.rules(), 'carNumber')).toBeTruthy();
                    });
                    it('conditional validation', function () {
                        var con = ko.observable(false);
                        var conditionalTestObj = ko.observable().extend({ carNumber: { onlyIf: con } });
                        testObj.rules().forEach(function (rule) {
                            expect(rule.condition).toBeUndefined();
                        });
                        conditionalTestObj.rules().forEach(function (rule) {
                            expect(typeof rule.condition).toEqual('function');
                        });
                        conditionalTestObj('test.test');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().carNumber);
                    });
                    it('value undefined, null or empty', function () {
                        testObj(undefined);
                        expect(testObj).observableIsValid();
                        testObj(null);
                        expect(testObj).observableIsValid();
                        testObj('');
                        expect(testObj).observableIsValid();
                    });
                    it('length 5-8 chars', function () {
                        testObj('12345');
                        expect(testObj).observableIsValid();
                        testObj('12345678');
                        expect(testObj).observableIsValid();
                        testObj('123456789');
                        expect(testObj).observableIsNotValid(messages().carNumber);
                        testObj('1234');
                        expect(testObj).observableIsNotValid(messages().carNumber);
                    });
                    it('numeric chars', function () {
                        testObj(1234567); //eslint-disable-line no-magic-numbers
                        expect(testObj).observableIsValid();
                        testObj('12345678');
                        expect(testObj).observableIsValid();
                        testObj('2345678a');
                        expect(testObj).observableIsNotValid(messages().carNumber);
                        testObj('234567.9');
                        expect(testObj).observableIsNotValid(messages().carNumber);
                        testObj('234567 9');
                        expect(testObj).observableIsNotValid(messages().carNumber);
                        testObj('234567ג9');
                        expect(testObj).observableIsNotValid(messages().carNumber);
                        testObj('2345679$');
                        expect(testObj).observableIsNotValid(messages().carNumber);

                    });
                    it('value not valid with custom message', function () {
                        testObj.extend({ validatable: false });
                        testObj.extend({ carNumber: { params: true, message: customMessage } });
                        testObj('2345678a');
                        expect(testObj).observableIsNotValid(customMessage);
                    });
                });
            });
        });
    });
define('spec/validatePersonalDetailsSpec.js', function () { });