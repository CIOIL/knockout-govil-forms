var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/utilities/stringExtension', 'common/ko/validate/koValidationSpecMatchers', 'common/resources/texts/language', 'common/resources/texts/basicValidation', 'common/ko/validate/extensionRules/language', 'common/ko/globals/multiLanguageObservable'], function (stringExtension, matchers, resources, basicResource) {
    //eslint-disable-line max-params

    var messages = ko.multiLanguageObservable({ resource: resources });
    var basicMessages = ko.multiLanguageObservable({ resource: basicResource });

    describe('extensionRules Languages', function () {

        var testObj;
        var customMessage = 'ערך לא תקין!!!';
        beforeEach(function () {
            jasmine.addMatchers(matchers);
        });
        describe('hebrew', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ hebrew: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ hebrew: null });
                testWithNull('רקןכו');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ hebrew: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('ddd');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().hebrew);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });

            it('value valid', function () {
                testObj('רקןכו');
                expect(testObj).observableIsValid();
                testObj('רו ירקןכו');
                expect(testObj).observableIsValid();
            });
            it('value not valid', function () {
                testObj('רו 1231ירקןכו');
                expect(testObj).observableIsNotValid(messages().hebrew);
                testObj('ארט- ארט ?ר:ט;א');
                expect(testObj).observableIsNotValid(messages().hebrew);
                testObj(' טאר טארvfd');
                expect(testObj).observableIsNotValid(messages().hebrew);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ hebrew: { params: true, message: customMessage } });
                testObj('רו 1231ירקןכו');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });
        describe('hebrew with digits', function () {
            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ hebrewNumber: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ hebrewNumber: null });
                testWithNull('אבג7');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ hebrewNumber: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('ddd');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().hebrewNumber);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });
            it('value valid', function () {
                testObj('א בג7');
                expect(testObj).observableIsValid();
                testObj('אבג7');
                expect(testObj).observableIsValid();
            });
            it('value not valid with Characters ', function () {
                testObj('ארט- א92רט ?ר:ט;א');
                expect(testObj).observableIsNotValid(messages().hebrewNumber);
                testObj(' ט14אר טארvfd');
                expect(testObj).observableIsNotValid(messages().hebrewNumber);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ hebrewNumber: { params: true, message: customMessage } });
                testObj('aaa');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });
        describe('hebrew digits & special chars', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ hebrewExtended: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ hebrewExtended: null });
                testWithNull('א92רט ?רא');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ hebrewExtended: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('ddd');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().hebrewExtended);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });
            it('value valid with ', function () {
                testObj('א**א56 66');
                expect(testObj).observableIsValid();
            });
            it('value valid with Characters ', function () {
                testObj('ארט- א92רט ?רא');
                expect(testObj).observableIsValid();
            });
            it('value not valid with english ', function () {
                testObj(' ט14אר ט$ארvfd');
                expect(testObj).observableIsNotValid(messages().hebrewExtended);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ hebrewExtended: { params: true, message: customMessage } });
                testObj(' ט14אר ט$ארvfd');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });

        describe('free hebrew digits & special chars', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ freeHebrew: true });
            });
            it('value valid', function () {
                testObj('שששש גגגגג');
                expect(testObj).observableIsValid();
                testObj('א888- בג7');
                expect(testObj).observableIsValid();
                testObj('(א:()בג7');
                expect(testObj).observableIsValid();
            });
            it('value valid with undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });
            it('value not valid with some characters ', function () {
                testObj('ארט- א92ר@#ט @רא');
                expect(testObj).observableIsNotValid(messages().freeHebrew);
            });
            it('value not valid with english letters', function () {
                testObj('אב bbb');
                expect(testObj).observableIsNotValid(messages().freeHebrew);
                testObj('ddddd');
                expect(testObj).observableIsNotValid(messages().freeHebrew);
            });

            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ freeHebrew: { params: true, message: customMessage } });
                testObj(' ט14אר טארvfd');
                expect(testObj).observableIsNotValid(customMessage);
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ freeHebrew: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('ddd');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().freeHebrew);
            });
        });
        describe('english', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ english: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ english: null });
                testWithNull('abc');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ english: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('גכד');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().english);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });

            it('value valid with ', function () {
                testObj('abc bca');
                expect(testObj).observableIsValid();
            });
            it('value not valid with number', function () {
                testObj('fifty five 55');
                expect(testObj).observableIsNotValid(messages().english);
            });
            it('value not valid with Characters ', function () {
                testObj('fifty five!!');
                expect(testObj).observableIsNotValid(messages().english);
            });
            it('value not valid with hebrew ', function () {
                testObj(' טאר טארvfd');
                expect(testObj).observableIsNotValid(messages().english);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ english: { params: true, message: customMessage } });
                testObj(' ט14אר ט$ארvfd');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });
        describe('english with digits', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ englishNumber: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ englishNumber: null });
                testWithNull('ss56');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ englishNumber: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('וטוט');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().englishNumber);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });

            it('value valid with ', function () {
                testObj('ss56 66');
                expect(testObj).observableIsValid();
            });
            it('value not valid with Characters ', function () {
                testObj('arbitrary #!');
                expect(testObj).observableIsNotValid(messages().englishNumber);
            });
            it('value not valid with hebrew ', function () {
                testObj('arbitrary שרירותי');
                expect(testObj).observableIsNotValid(messages().englishNumber);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ englishNumber: { params: true, message: customMessage } });
                testObj(' ט14אר ט$ארvfd');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });
        describe('english digits & special chars', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ englishExtended: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ englishExtended: null });
                testWithNull('arGb15');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ englishExtended: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj(' ט14אר ט$ארvfd');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().englishExtended);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });
            it('value valid with digits', function () {
                testObj('arGb15');
                expect(testObj).observableIsValid();
            });
            it('value valid with Characters ', function () {
                testObj('!-arGb-!');
                expect(testObj).observableIsValid();
            });
            it('value not valid with hebrew ', function () {
                testObj(' ט14אר ט$ארvfd');
                expect(testObj).observableIsNotValid(messages().englishExtended);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ englishExtended: { params: true, message: customMessage } });
                testObj(' ט14אר ט$ארvfd');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });

        describe('no hebrew letters', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ noHebrewLetters: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ noHebrewLetters: null });
                testWithNull('arGb15');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ noHebrewLetters: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('כדגכ');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().noHebrewLetters);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });
            it('value valid with characters', function () {
                testObj('grh@$!~," ;+');
                expect(testObj).observableIsValid();
            });
            it('value valid with digits', function () {
                testObj('grh 4545');
                expect(testObj).observableIsValid();
            });
            it('value not valid with hebrew', function () {
                testObj('grhכית');
                expect(testObj).observableIsNotValid(messages().noHebrewLetters);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ noHebrewLetters: { params: true, message: customMessage } });
                testObj(' ט14אר ט$ארvfd');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });

        describe('englishHebrew', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ englishHebrew: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ englishHebrew: null });
                testWithNull('arGbאאב');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ englishHebrew: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('arGb15רר');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().englishHebrew);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });
            it('value valid', function () {
                testObj('arGbאאב');
                expect(testObj).observableIsValid();
            });
            it('value valid with allowed chars', function () {
                testObj('arGb- -אאב');
                expect(testObj).observableIsValid();
            });
            it('value not valid with digits', function () {
                testObj('arGb15רר');
                expect(testObj).observableIsNotValid(messages().englishHebrew);
            });
            it('value not valid with Characters ', function () {
                testObj('#-arGb-$');
                expect(testObj).observableIsNotValid(messages().englishHebrew);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ englishHebrew: { params: true, message: customMessage } });
                testObj('#-arGb-$');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });

        describe('englishHebrewNumber', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ englishHebrewNumber: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ englishHebrewNumber: null });
                testWithNull('arGbא123אב');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ englishHebrewNumber: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('arGb1-5רר');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().englishHebrewNumber);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });
            it('value valid', function () {
                testObj('arGb123אאב');
                expect(testObj).observableIsValid();
            });
            it('value not valid with Characters ', function () {
                testObj('#-arGb-$');
                expect(testObj).observableIsNotValid(messages().englishHebrewNumber);
            });
            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ englishHebrewNumber: { params: true, message: customMessage } });
                testObj('#-arGb-$');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });

        describe('fileName', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ fileName: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ fileName: null });
                testWithNull('arGbאאב');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ fileName: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('da>Ddd');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().fileName);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });

            it('value valid', function () {
                testObj('ttt.ff');
                expect(testObj).observableIsValid();
                testObj('אכאכ.ff');
                expect(testObj).observableIsValid();
                testObj('t.tt.ff');
                expect(testObj).observableIsValid();
                testObj('ttt,ff');
                expect(testObj).observableIsValid();
                testObj('1243.ff');
                expect(testObj).observableIsValid();
                testObj('ttt{}}ff');
                expect(testObj).observableIsValid();
                testObj('ttt())ff');
                expect(testObj).observableIsValid();
                testObj('t#t.ff');
                expect(testObj).observableIsValid();
            });
            it('value not valid', function () {
                testObj('rer>rr');
                expect(testObj).observableIsNotValid(messages().fileName);
                testObj('fff<Fff');
                expect(testObj).observableIsNotValid(messages().fileName);
                testObj('dd?dd');
                expect(testObj).observableIsNotValid(messages().fileName);
                testObj('dd|ss');
                expect(testObj).observableIsNotValid(messages().fileName);
                testObj('ss:dd');
                expect(testObj).observableIsNotValid(messages().fileName);
                testObj('d/dd');
                expect(testObj).observableIsNotValid(messages().fileName);
                testObj('d\\ddd');
                expect(testObj).observableIsNotValid(messages().fileName);
            });

            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ fileName: { params: true, message: customMessage } });
                testObj('#><b-$');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });
        describe('freeText', function () {

            beforeEach(function () {
                testObj = ko.observable();
                testObj.extend({ freeText: true });
            });
            it('apply validation with null', function () {
                var testWithNull = ko.observable().extend({ freeText: null });
                testWithNull('arGbאאב');
                expect(testWithNull).observableIsValid();
            });
            it('conditional validation', function () {
                var con = ko.observable(false);
                var conditionalTestObj = ko.observable().extend({ freeText: { params: true, onlyIf: con } });
                testObj.rules().forEach(function (rule) {
                    expect(rule.condition).toBeUndefined();
                });
                conditionalTestObj.rules().forEach(function (rule) {
                    expect(_typeof(rule.condition)).toEqual('function');
                });
                conditionalTestObj('fff&ff');
                expect(conditionalTestObj).observableIsValid();
                con(true);
                expect(conditionalTestObj).observableIsNotValid(messages().freeText);
            });
            it('value undefined, null or empty', function () {
                testObj(undefined);
                expect(testObj).observableIsValid();
                testObj(null);
                expect(testObj).observableIsValid();
                testObj('');
                expect(testObj).observableIsValid();
            });
            it('min length', function () {
                testObj('t');
                expect(testObj).observableIsNotValid(stringExtension.format(basicMessages().minLength, 2));
                testObj('tt');
                expect(testObj).observableIsValid();
            });
            it('finalLetters', function () {
                testObj('בךכ');
                expect(testObj).observableIsNotValid(messages().finalLetters);
                testObj('באך');
                expect(testObj).observableIsValid();
                testObj('כף.');
                expect(testObj).observableIsValid();
                testObj('אץ, ');
                expect(testObj).observableIsValid();
                testObj('אץ\'');
                expect(testObj).observableIsValid();
            });
            it('value valid', function () {
                testObj('fdfds');
                expect(testObj).observableIsValid();
                testObj('כגגדכ432');
                expect(testObj).observableIsValid();
                testObj('432');
                expect(testObj).observableIsValid();
                testObj('ds/sf');
                expect(testObj).observableIsValid();
                testObj('ds\sf');
                expect(testObj).observableIsValid();
                testObj('ddsd\ndfsd');
                expect(testObj).observableIsValid();
                testObj('^([-.:,\'s_$@;=^?+![] *%# ()"]*)$*\s');
                expect(testObj).observableIsValid();
            });
            it('value not valid', function () {
                testObj('{}dsda}');
                expect(testObj).observableIsNotValid(messages().freeText);
                testObj('ff&ff');
                expect(testObj).observableIsNotValid(messages().freeText);
                testObj('<GG>');
                expect(testObj).observableIsNotValid(messages().freeText);
            });

            it('value not valid with custom message', function () {
                testObj.extend({ validatable: false });
                testObj.extend({ freeText: { params: true, message: customMessage } });
                testObj('#><b-$');
                expect(testObj).observableIsNotValid(customMessage);
            });
        });
    });
});
define('spec/validateLanguageSpec.js', function () {});