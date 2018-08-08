var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define(['common/utilities/reflection', 'common/utilities/stringExtension', 'common/ko/validate/koValidationSpecMatchers', 'common/resources/texts/address', 'common/resources/texts/basicValidation', 'common/resources/texts/language', 'common/ko/validate/extensionRules/address', 'common/ko/globals/multiLanguageObservable'], function (reflection, stringExtension, matchers, AddressTexts, basicTexts, languageTexts) {
    //eslint-disable-line max-params
    var resources = reflection.extend(reflection.extend(AddressTexts, basicTexts), languageTexts);

    var messages = ko.multiLanguageObservable({ resource: resources });
    var customMessage = 'ערך לא תקין!!!';

    describe('validate', function () {
        var testObj;
        beforeEach(function () {
            jasmine.addMatchers(matchers);
        });
        describe('extensionRules Address', function () {
            describe('email', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ email: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ email: null });
                    testWithNull('text@example.com');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ email: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsNotValid(messages().email);
                });
                it('value too short', function () {
                    testObj('d@s.s');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().minLength, 6)); //eslint-disable-line no-magic-numbers
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
                    testObj('text@example.com');
                    expect(testObj).observableIsValid();
                    testObj('text@example1.com');
                    expect(testObj).observableIsValid();
                    testObj('text1@example.com');
                    expect(testObj).observableIsValid();
                    testObj('text@example-dd.com');
                    expect(testObj).observableIsValid();
                });
                it('value not valid', function () {
                    testObj('text#example.com');
                    expect(testObj).observableIsNotValid(messages().email);
                    testObj('text@exam ple.com');
                    expect(testObj).observableIsNotValid(messages().email);
                    testObj('text@examp@le.com');
                    expect(testObj).observableIsNotValid(messages().email);
                    testObj('text@exa%mple.com');
                    expect(testObj).observableIsNotValid(messages().email);
                    testObj('text#example');
                    expect(testObj).observableIsNotValid(messages().email);
                });
                it('invalid domain', function () {
                    testObj('john@abc.com123');
                    expect(testObj).observableIsNotValid(messages().email);
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj.extend({ email: { params: true, message: customMessage } });
                    testObj('text#example');
                    expect(testObj).observableIsNotValid(customMessage);
                });
            });
            describe('url', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ url: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ url: null });
                    testWithNull('www.test.com');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ url: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsNotValid(messages().url);
                });

                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });
                it('value too short', function () {
                    testObj('hey');
                    expect(testObj).observableIsNotValid(messages().url);
                });
                it('value not valid', function () {
                    testObj('test.test');
                    expect(testObj).observableIsNotValid(messages().url);
                    testObj('http://te>t.test.com');
                    expect(testObj).observableIsNotValid(messages().url);
                    testObj("http://te't.test.com"); //eslint-disable-line
                    expect(testObj).observableIsNotValid(messages().url);
                    testObj('http://te{st.test.com');
                    expect(testObj).observableIsNotValid(messages().url);
                    testObj('http://t!est.test.com');
                    expect(testObj).observableIsNotValid(messages().url);
                    testObj('http://te^st.test.com');
                    expect(testObj).observableIsNotValid(messages().url);
                    testObj('http://te,st.test.com');
                    expect(testObj).observableIsNotValid(messages().url);
                    testObj('http://te*st.test.com');
                    expect(testObj).observableIsNotValid(messages().url);
                });
                it('value valid', function () {
                    testObj('http://test.test.com');
                    expect(testObj).observableIsValid();
                    testObj('https://test.test.com');
                    expect(testObj).observableIsValid();
                    testObj('www.test.com');
                    expect(testObj).observableIsValid();
                    testObj('WWW.TEST.COM');
                    expect(testObj).observableIsValid();
                    testObj('HTTP://WWW.TEST.COM');
                    expect(testObj).observableIsValid();
                    testObj('HTTPS://WWW.TEST.COM');
                    expect(testObj).observableIsValid();
                    testObj('wWw.TeSt.CoM');
                    expect(testObj).observableIsValid();
                    testObj('HtTp://WwW.tEsT.cOm');
                    expect(testObj).observableIsValid();
                    testObj('hTtPs://WWW.test.COM');
                    expect(testObj).observableIsValid();
                });

                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj = ko.observable().extend({ url: { message: 'no such url' } });
                    testObj('john@abc.com123');
                    expect(testObj).observableIsNotValid('no such url');
                });
            });
            describe('IPAddresses', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ IPAddress: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ IPAddress: null });
                    testWithNull('10.110.112.123');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ IPAddress: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('156460640');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('156460640');
                    expect(conditionalTestObj).observableIsNotValid(messages().IPAddress);
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
                    testObj('10.110.112.123');
                    expect(testObj).observableIsValid();
                });
                it('value not valid', function () {
                    testObj('156460640');
                    expect(testObj).observableIsNotValid(messages().IPAddress);
                });

                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj = ko.observable().extend({ IPAddress: { message: 'no such IP' } });
                    testObj('john@abc.com123');
                    expect(testObj).observableIsNotValid('no such IP');
                });
            });
            describe('houseNumber', function () {
                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ houseNumber: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ houseNumber: null });
                    testWithNull('20');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ houseNumber: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('1 -1');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('1 -1');
                    expect(conditionalTestObj).observableIsNotValid(messages().houseNumber);
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
                    testObj('12345');
                    expect(testObj).observableIsNotValid(messages().houseNumber);
                });

                it('value not valid', function () {
                    testObj('א1');
                    expect(testObj).observableIsNotValid(messages().startWithDigit);
                    testObj('1 -1');
                    expect(testObj).observableIsNotValid(messages().houseNumber);
                    testObj('20 אן');
                    expect(testObj).observableIsNotValid(messages().noFinalLetters);
                    testObj('ן5');
                    expect(testObj).observableIsNotValid(messages().noFinalLetters);
                });
                it('value start with zero digit', function () {
                    testObj('01');
                    expect(testObj).observableIsNotValid(messages().startWithZero);
                    testObj('010');
                    expect(testObj).observableIsNotValid(messages().startWithZero);
                    testObj('00010');
                    expect(testObj).observableIsNotValid(messages().startWithZero);
                    testObj('0001');
                    expect(testObj).observableIsNotValid(messages().startWithZero);
                });
                it('value is zero digits', function () {
                    testObj('0');
                    expect(testObj).observableIsNotValid(messages().zeroDigits);
                    testObj('00');
                    expect(testObj).observableIsNotValid(messages().zeroDigits);
                    testObj('0000');
                    expect(testObj).observableIsNotValid(messages().zeroDigits);
                    testObj('000');
                    expect(testObj).observableIsNotValid(messages().zeroDigits);
                });
                it('value valid', function () {
                    testObj("11א'"); //eslint-disable-line quotes
                    expect(testObj).observableIsValid();
                    testObj('20');
                    expect(testObj).observableIsValid();
                    testObj('11-א');
                    expect(testObj).observableIsValid();
                    testObj('11/א');
                    expect(testObj).observableIsValid();
                    testObj('11\א');
                    expect(testObj).observableIsValid();
                    testObj('17ss');
                    expect(testObj).observableIsValid();
                    testObj('11א"');
                    expect(testObj).observableIsValid();
                });

                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj = ko.observable().extend({ houseNumber: { message: 'no such houseNumber' } });
                    testObj('ן5');
                    expect(testObj).observableIsNotValid('no such houseNumber');
                });
            });
            describe('city', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ city: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ city: null });
                    testWithNull('יישוב יישוב');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ city: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('test.test');
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
                it('value too long', function () {
                    testObj('אבגדה וזחטי כלמנסדדדדדדדדד');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().maxLength, 25)); //eslint-disable-line no-magic-numbers
                });
                it('value too short', function () {
                    testObj('ר');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().minLength, 2));
                });
                it('value with english letters', function () {
                    testObj('אב bbb');
                    expect(testObj).observableIsNotValid(messages().hebrew);
                    testObj('ddddd');
                    expect(testObj).observableIsNotValid(messages().hebrew);
                });
                it('value with apostrophe', function () {
                    testObj("עהבא'"); //eslint-disable-line quotes
                    expect(testObj).observableIsNotValid(messages().apostropheAfterLetters);
                    testObj("רחוב נג'ארה"); //eslint-disable-line quotes
                    expect(testObj).observableIsValid();
                    testObj("רחוב נצ'ארה"); //eslint-disable-line quotes
                    expect(testObj).observableIsValid();
                    testObj("רחוב נז'ארה"); //eslint-disable-line quotes
                    expect(testObj).observableIsValid();
                });
                it('value with finalLetters', function () {
                    testObj('רחוב הגפןים');
                    expect(testObj).observableIsNotValid(messages().finalLetters);
                    testObj('רחוב הגפךים');
                    expect(testObj).observableIsNotValid(messages().finalLetters);
                    testObj('רחוב הגפםים');
                    expect(testObj).observableIsNotValid(messages().finalLetters);
                    testObj('רחוב הגפץים');
                    expect(testObj).observableIsNotValid(messages().finalLetters);
                    testObj('רחוב הגפן');
                    expect(testObj).observableIsValid();
                    testObj('רחוב הגפם');
                    expect(testObj).observableIsValid();
                    testObj('רחוב הגפך');
                    expect(testObj).observableIsValid();
                    testObj('רחוב הגפץ');
                    expect(testObj).observableIsValid();
                });

                it('value valid', function () {
                    testObj('יישוב (יישוב)');
                    expect(testObj).observableIsValid();
                    testObj('יישוב-יישוב');
                    expect(testObj).observableIsValid();
                    testObj('יישוב יישוב');
                    expect(testObj).observableIsValid();
                });

                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj = ko.observable().extend({ city: { message: 'no such houseNumber' } });
                    testObj('ddddd');
                    expect(testObj).observableIsNotValid('no such houseNumber');
                });
            });
            describe('street', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ street: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ street: null });
                    testWithNull('רחוב-רחוב');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ street: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsNotValid(messages().street);
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
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().maxLength, 25)); //eslint-disable-line no-magic-numbers
                });
                it('value too short', function () {
                    testObj('ר');
                    expect(testObj).observableIsNotValid(stringExtension.format(messages().minLength, 2));
                });
                it('value with english letters', function () {
                    testObj('אב bbb');
                    expect(testObj).observableIsNotValid(messages().street);
                    testObj('ddddd');
                    expect(testObj).observableIsNotValid(messages().street);
                });
                it('value with apostrophe', function () {
                    testObj("עהבא'"); //eslint-disable-line quotes
                    expect(testObj).observableIsNotValid(messages().apostropheAfterLetters);
                    testObj("רחוב נג'ארה"); //eslint-disable-line quotes
                    expect(testObj).observableIsValid();
                    testObj("רחוב נצ'ארה"); //eslint-disable-line quotes
                    expect(testObj).observableIsValid();
                    testObj("רחוב נז'ארה"); //eslint-disable-line quotes
                    expect(testObj).observableIsValid();
                });
                it('value with finalLetters', function () {
                    testObj('רחוב הגפןים');
                    expect(testObj).observableIsNotValid(messages().finalLetters);
                    testObj('רחוב הגפךים');
                    expect(testObj).observableIsNotValid(messages().finalLetters);
                    testObj('רחוב הגפםים');
                    expect(testObj).observableIsNotValid(messages().finalLetters);
                    testObj('רחוב הגפץים');
                    expect(testObj).observableIsNotValid(messages().finalLetters);
                    testObj('רחוב הגפן');
                    expect(testObj).observableIsValid();
                    testObj('רחוב הגפם');
                    expect(testObj).observableIsValid();
                    testObj('רחוב הגפך');
                    expect(testObj).observableIsValid();
                    testObj('רחוב הגפץ');
                    expect(testObj).observableIsValid();
                });

                it('value valid', function () {
                    testObj('3 א');
                    expect(testObj).observableIsValid();
                    testObj('רחוב (רחוב)');
                    expect(testObj).observableIsValid();
                    testObj('רחוב-רחוב');
                    expect(testObj).observableIsValid();
                    testObj('רחוב רחוב');
                    expect(testObj).observableIsValid();
                    testObj('רחוב 3');
                    expect(testObj).observableIsValid();
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj = ko.observable().extend({ street: { message: 'no such houseNumber' } });
                    testObj('ddddd');
                    expect(testObj).observableIsNotValid('no such houseNumber');
                });
            });
            describe('zipCode', function () {

                beforeAll(function () {
                    testObj = ko.observable().extend({ zipCode: true });
                });
                it('value is zero digits', function () {
                    testObj('0');
                    expect(testObj).observableIsNotValid(messages().zeroDigits);
                    testObj('00');
                    expect(testObj).observableIsNotValid(messages().zeroDigits);
                    testObj('0000');
                    expect(testObj).observableIsNotValid(messages().zeroDigits);
                    testObj('000');
                    expect(testObj).observableIsNotValid(messages().zeroDigits);
                    testObj('010');
                    expect(testObj).observableIsNotValid(messages().zipCode);
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ zipCode: null });
                    testWithNull('1234567');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ zipCode: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsNotValid(messages().zipCode);
                });

                it('relevant rules applied', function () {
                    expect(ko.utils.arrayFirst(testObj.rules, function (item) {
                        return item.rule === 'minLength';
                    })).toBeDefined();
                    expect(ko.utils.arrayFirst(testObj.rules, function (item) {
                        return item.rule === 'maxLength';
                    })).toBeDefined();
                    expect(ko.utils.arrayFirst(testObj.rules, function (item) {
                        return item.rule === 'integer';
                    })).toBeDefined();
                });

                it('value too long', function () {
                    testObj('12345678');
                    expect(testObj).observableIsNotValid(messages().zipCode);
                });
                it('value too short', function () {
                    testObj('12');
                    expect(testObj).observableIsNotValid(messages().zipCode);
                });
                it('value not numeric', function () {
                    testObj('hahahah');
                    expect(testObj).observableIsNotValid(messages().zipCode);
                });
                it('value not integer', function () {
                    testObj('12.555');
                    expect(testObj).observableIsNotValid(messages().zipCode);
                });
                it('value valid', function () {
                    testObj('1234567');
                    expect(testObj).observableIsValid();
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj = ko.observable().extend({ zipCode: { message: 'no such zipCode' } });
                    testObj('ddddd');
                    expect(testObj).observableIsNotValid('no such zipCode');
                });
            });
            describe('apartment', function () {

                beforeAll(function () {
                    testObj = ko.observable().extend({ apartment: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ apartment: null });
                    testWithNull('12');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ apartment: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsNotValid(messages().apartment);
                });

                it('relevant rules applied', function () {
                    expect(ko.utils.arrayFirst(testObj.rules, function (item) {
                        return item.rule === 'maxLength';
                    })).toBeDefined();
                    expect(ko.utils.arrayFirst(testObj.rules, function (item) {
                        return item.rule === 'integer';
                    })).toBeDefined();
                });

                it('value too long', function () {
                    testObj('12345');
                    expect(testObj).observableIsNotValid(messages().apartment);
                });

                it('value not numeric', function () {
                    testObj('hahahah');
                    expect(testObj).observableIsNotValid(messages().apartment);
                });
                it('value not integer', function () {
                    testObj('12.555');
                    expect(testObj).observableIsNotValid(messages().apartment);
                });
                it('value valid', function () {
                    testObj('12');
                    expect(testObj).observableIsValid();
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj = ko.observable().extend({ apartment: { message: 'no such apartment' } });
                    testObj('ddddd');
                    expect(testObj).observableIsNotValid('no such apartment');
                });
            });
            describe('mailbox', function () {

                beforeAll(function () {
                    testObj = ko.observable().extend({ mailbox: true });
                });
                it('apply validation with null', function () {
                    var testWithNull = ko.observable().extend({ mailbox: null });
                    testWithNull('12');
                    expect(testWithNull).observableIsValid();
                });
                it('conditional validation', function () {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.observable().extend({ mailbox: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(_typeof(rule.condition)).toEqual('function');
                    });
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsValid();
                    con(true);
                    conditionalTestObj('test.test');
                    expect(conditionalTestObj).observableIsNotValid(messages().mailbox);
                });

                it('relevant rules applied', function () {
                    expect(ko.utils.arrayFirst(testObj.rules, function (item) {
                        return item.rule === 'maxLength';
                    })).toBeDefined();
                    expect(ko.utils.arrayFirst(testObj.rules, function (item) {
                        return item.rule === 'integer';
                    })).toBeDefined();
                });

                it('value too long', function () {
                    testObj('123456');
                    expect(testObj).observableIsNotValid(messages().mailbox);
                });

                it('value not numeric', function () {
                    testObj('hahahah');
                    expect(testObj).observableIsNotValid(messages().mailbox);
                });
                it('value not integer', function () {
                    testObj('12.555');
                    expect(testObj).observableIsNotValid(messages().mailbox);
                });
                it('value valid', function () {
                    testObj('12');
                    expect(testObj).observableIsValid();
                });
                it('value not valid with custom message', function () {
                    testObj.extend({ validatable: false });
                    testObj = ko.observable().extend({ mailbox: { message: 'no such mailbox' } });
                    testObj('ddddd');
                    expect(testObj).observableIsNotValid('no such mailbox');
                });
            });
        });
    });
});