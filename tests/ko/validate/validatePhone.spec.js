
define(['common/utilities/stringExtension',
        'common/ko/validate/koValidationSpecMatchers',
        'common/resources/texts/phone',
        'common/networking/services',
        'common/external/q',
        'common/ko/validate/utilities/phoneMethods',
        'common/ko/validate/extensionRules/phone',
        'common/ko/globals/multiLanguageObservable',
        'common/ko/globals/defferedObservable'],

function (stringExtension, matchers, resources, services, Q, phoneMethods) { //eslint-disable-line max-params

    var messages = ko.multiLanguageObservable({ resource: resources });
    var customMessage = 'ערך לא תקין!!!';
    describe('validate', function () {
        beforeAll(function () {//eslint-disable-line no-undef
            jasmine.addMatchers(matchers);
        });
        var testObj;
        var areaCodesPromise;
        var areaCodes = '[{"RowNumber":1,"id":"1","AreaCode":"02","Type":"1"},{"RowNumber":2,"id":"2","AreaCode":"03","Type":"1"},{"RowNumber":3,"id":"3","AreaCode":"04","Type":"1"},{"RowNumber":4,"id":"4","AreaCode":"050","Type":"2"},{"RowNumber":5,"id":"5","AreaCode":"053","Type":"2"},{"RowNumber":6,"id":"6","AreaCode":"052","Type":"2"},{"RowNumber":7,"id":"8","AreaCode":"054","Type":"2"},{"RowNumber":8,"id":"9","AreaCode":"055","Type":"2"},{"RowNumber":9,"id":"11","AreaCode":"057","Type":"2"},{"RowNumber":10,"id":"12","AreaCode":"058","Type":"2"},{"RowNumber":11,"id":"13","AreaCode":"059","Type":"2"},{"RowNumber":12,"id":"18","AreaCode":"072","Type":"1"},{"RowNumber":13,"id":"19","AreaCode":"073","Type":"1"},{"RowNumber":14,"id":"20","AreaCode":"074","Type":"1"},{"RowNumber":15,"id":"21","AreaCode":"076","Type":"1"},{"RowNumber":16,"id":"22","AreaCode":"077","Type":"1"},{"RowNumber":17,"id":"23","AreaCode":"078","Type":"1"},{"RowNumber":18,"id":"24","AreaCode":"08","Type":"1"},{"RowNumber":19,"id":"25","AreaCode":"09","Type":"1"},{"RowNumber":20,"id":"26","AreaCode":"153","Type":"1"},{"RowNumber":21,"id":"27","AreaCode":"159","Type":"1"},{"RowNumber":22,"id":"28","AreaCode":"170","Type":"1"},{"RowNumber":23,"id":"29","AreaCode":"180","Type":"1"},{"RowNumber":24,"id":"30","AreaCode":"190","Type":"1"},{"RowNumber":25,"id":"31","AreaCode":"056","Type":"2"}]';//eslint-disable-line quotes
        function fakedLoadLists() {
            return Q.fcall(function () {
                return JSON.parse(areaCodes);
            });
        }


        describe('extensionRules Phone', function () {

            beforeEach(function () {//eslint-disable-line no-undef
                spyOn(services, 'govServiceListRequest').and.callFake(fakedLoadLists);
                ko.postbox.publish('documentReady');

                areaCodesPromise = phoneMethods.loadLists();

                testObj = ko.defferedObservable({ deferred: areaCodesPromise });
            });


            describe('phoneNumber', function () {

                beforeEach(function () {
                    // testObj.extend({ validatable: false });
                    areaCodesPromise = phoneMethods.loadLists();
                    testObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ phoneNumber: true });
                });
                it('apply validation with null', function (done) {
                    var testWithNull = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ phoneNumber: null });
                    testWithNull('089799909');
                    areaCodesPromise.then(function () {
                        expect(testWithNull).observableIsValid();
                        done();
                    });
                });

                it('conditional validation', function (done) {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ phoneNumber: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });

                    areaCodesPromise.then(function () {
                        conditionalTestObj('089799R09');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().phoneValidChars);
                        done();
                    });
                });

                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });

                it('value too short', function (done) {
                    testObj('0897990');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().nineDigitsLengthNumber);
                        done();
                    });
                });

                it('value too long', function (done) {
                    testObj('072202020012');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().tenDigitsLengthNumber);
                        done();
                    });
                });

                it('areaCode not exist', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('119799909');
                        expect(testObj).observableIsNotValid(messages().areaCodeNotExist);
                        testObj('0504173558');
                        expect(testObj).observableIsNotValid(messages().areaCodeNotExist);
                        done();
                    });
                });

                it('value contains chars', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('08979d909');
                        expect(testObj).observableIsNotValid(messages().phoneValidChars);
                        done();
                    });
                });

                it('value contains dash', function (done) {
                    testObj('08-9799909');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsValid();
                        done();
                    });
                });

                it('number displayed with hyphen', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('089799909');
                        expect(testObj()).toEqual('08-9799909');
                        testObj('0722020200');
                        expect(testObj()).toEqual('072-2020200');
                        testObj('08-9799909');
                        expect(testObj()).toEqual('08-9799909');
                        testObj('072-2020200');
                        expect(testObj()).toEqual('072-2020200');
                        done();
                    });
                });

                it('value valid', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('089799909');
                        expect(testObj).observableIsValid();
                        testObj('0722020200');
                        expect(testObj).observableIsValid();
                        testObj('08-9799909');
                        expect(testObj).observableIsValid();
                        testObj('072-2020200');
                        expect(testObj).observableIsValid();
                        done();
                    });
                });

                it('value not valid with custom message', function (done) {
                    testObj.extend({ validatable: false });
                    testObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ phoneNumber: { params: true, message: customMessage } });
                    areaCodesPromise.then(function () {
                        testObj('0505555R55');
                        expect(testObj).observableIsNotValid(customMessage);
                        testObj('189799909');
                        expect(testObj).observableIsNotValid(customMessage);
                        done();
                    });
                });
            });

            describe('mobile', function () {
                beforeEach(function () {
                    testObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ mobile: true });
                });
                it('apply validation with null', function (done) {
                    var testWithNull = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ mobile: null });
                    testWithNull('0505555555');
                    areaCodesPromise.then(function () {
                        expect(testWithNull).observableIsValid();
                        done();
                    });
                });
                it('conditional validation', function (done) {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ mobile: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });

                    areaCodesPromise.then(function () {
                        conditionalTestObj('0505555R55');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().phoneValidChars);
                        done();
                    });
                });

                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });

                it('value too short', function (done) {
                    testObj('050417');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().tenDigitsLengthNumber);
                        done();
                    });
                });

                it('value too long', function (done) {
                    testObj('050417355488');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().tenDigitsLengthNumber);
                        done();
                    });
                });

                it('areaCode not exist', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('0515555555');
                        expect(testObj).observableIsNotValid(messages().areaCodeNotExist);
                        testObj('089799909');
                        expect(testObj).observableIsNotValid(messages().areaCodeNotExist);
                        done();
                    });
                });

                it('value contains chars', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('0505555R55');
                        expect(testObj).observableIsNotValid(messages().phoneValidChars);
                        done();
                    });
                });

                it('value contains dash', function (done) {
                    testObj('050-5555555');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsValid(messages().phoneValidation);
                        done();
                    });
                });

                it('number displayed with hyphen', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('0505555555');
                        expect(testObj()).toEqual('050-5555555');
                        testObj('050-5555555');
                        expect(testObj()).toEqual('050-5555555');
                        done();
                    });
                });

                it('value valid', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('0505555555');
                        expect(testObj).observableIsValid();
                        testObj('050-5555555');
                        expect(testObj).observableIsValid();
                        done();
                    });
                });
                it('value not valid with custom message', function (done) {
                    testObj.extend({ validatable: false });
                    testObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ mobile: { params: true, message: customMessage } });
                    areaCodesPromise.then(function () {
                        testObj('0505555R55');
                        expect(testObj).observableIsNotValid(customMessage);
                        testObj('189799909');
                        expect(testObj).observableIsNotValid(customMessage);
                        done();
                    });
                });
            });

            describe('phoneOrMobile', function () {
                beforeEach(function () {
                    testObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ phoneOrMobile: true });
                });
                it('apply validation with null', function (done) {
                    var testWithNull = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ phoneOrMobile: null });
                    testWithNull('0505555555');
                    areaCodesPromise.then(function () {
                        expect(testWithNull).observableIsValid();
                        done();
                    });
                });
                it('conditional validation', function (done) {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ phoneOrMobile: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });

                    areaCodesPromise.then(function () {
                        conditionalTestObj('0505555R55');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().phoneValidChars);
                        done();
                    });
                });

                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });

                it('value too short', function (done) {
                    testObj('050417');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().tenDigitsLengthNumber);
                        done();
                    });
                });

                it('value too long', function (done) {
                    testObj('050417355588');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().tenDigitsLengthNumber);
                        done();
                    });
                });

                it('areaCode not exist', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('0515555555');
                        expect(testObj).observableIsNotValid(messages().areaCodeNotExist);
                        testObj('189799909');
                        expect(testObj).observableIsNotValid(messages().areaCodeNotExist);
                        done();
                    });
                });

                it('value contains chars', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('0505555R55');
                        expect(testObj).observableIsNotValid(messages().phoneValidChars);
                        done();
                    });
                });

                it('value valid', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('0505555555');
                        expect(testObj).observableIsValid();
                        testObj('050-5555555');
                        expect(testObj).observableIsValid();
                        testObj('089799909');
                        expect(testObj).observableIsValid();
                        testObj('08-9799909');
                        expect(testObj).observableIsValid();
                        testObj('0722020200');
                        expect(testObj).observableIsValid();
                        testObj('072-2020200');
                        expect(testObj).observableIsValid();
                        done();
                    });
                });

                it('value not valid with custom message', function (done) {
                    testObj.extend({ validatable: false });
                    testObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ phoneOrMobile: { params: true, message: customMessage } });
                    areaCodesPromise.then(function () {
                        testObj('0505555R55');
                        expect(testObj).observableIsNotValid(customMessage);
                        testObj('189799909');
                        expect(testObj).observableIsNotValid(customMessage);
                        done();
                    });
                });
            });

            describe('international', function () {

                beforeEach(function () {
                    testObj = ko.observable();
                    testObj.extend({ internationalPhone: true });

                });
                it('apply validation with null', function () {
                    testObj.extend({ validatable: false });
                    expect(function () {
                        testObj.extend({ internationalPhone: null });
                    }).not.toThrow();
                });
                it('value undefined', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                });
                it('value null', function () {
                    testObj(null);
                    expect(testObj).observableIsValid();
                });

                it('value contains invalid chars', function (done) {
                    testObj('02$271212u865');
                    expect(testObj).observableIsNotValid(messages().internationalPhone);
                    done();
                });
                it('value too short', function (done) {
                    testObj('052714');
                    expect(testObj).observableIsNotValid(messages().internationalPhone);
                    done();
                });
                it('value too long', function (done) {
                    testObj('054123456789123456');
                    expect(testObj).observableIsNotValid(messages().internationalPhone);
                    done();
                });
                it('value valid not mobile number', function (done) {
                    testObj('08799909');
                    expect(testObj).observableIsNotValid(messages().internationalPhone);
                    done();
                });
                it('value valid', function (done) {
                    testObj('61763462601');
                    expect(testObj).observableIsValid();
                    done();
                });
                it('value valid with characters', function (done) {
                    testObj('+176346-60-');
                    expect(testObj).observableIsValid();
                    done();
                });
            });

            describe('fax', function () {

                beforeEach(function () {
                    testObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ fax: true });

                });
                it('apply validation with null', function (done) {
                    var testWithNull = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ fax: null });
                    testWithNull('153849799909');
                    areaCodesPromise.then(function () {
                        expect(testWithNull).observableIsValid();
                        done();
                    });
                });
                it('conditional validation', function (done) {
                    var con = ko.observable(false);
                    var conditionalTestObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ fax: { onlyIf: con } });
                    testObj.rules().forEach(function (rule) {
                        expect(rule.condition).toBeUndefined();
                    });
                    conditionalTestObj.rules().forEach(function (rule) {
                        expect(typeof rule.condition).toEqual('function');
                    });

                    areaCodesPromise.then(function () {
                        conditionalTestObj('089799R09');
                        expect(conditionalTestObj).observableIsValid();
                        con(true);
                        expect(conditionalTestObj).observableIsNotValid(messages().phoneValidChars);
                        done();
                    });
                });


                it('value undefined, null or empty', function () {
                    testObj(undefined);
                    expect(testObj).observableIsValid();
                    testObj(null);
                    expect(testObj).observableIsValid();
                    testObj('');
                    expect(testObj).observableIsValid();
                });

                it('value too short', function (done) {
                    testObj('0720417');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().tenDigitsLengthNumber);
                        done();
                    });
                });

                it('value too long', function (done) {
                    testObj('0811111111111');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().phoneValidation);
                        done();
                    });
                });

                it('areaCode not exist', function (done) {
                    testObj('189799909');
                    areaCodesPromise.then(function () {
                        expect(testObj).observableIsNotValid(messages().areaCodeNotExist);
                        done();
                    });
                });

                it('value contains chars', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('089799R09');
                        expect(testObj).observableIsNotValid(messages().phoneValidChars);
                        done();
                    });
                });

                it('value valid', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('153849799909');
                        expect(testObj).observableIsValid();
                        testObj('153-897949909');
                        expect(testObj).observableIsValid();
                        testObj('089799909');
                        expect(testObj).observableIsValid();
                        testObj('08-9799909');
                        expect(testObj).observableIsValid();
                        testObj('0722020200');
                        expect(testObj).observableIsValid();
                        testObj('072-2020200');
                        expect(testObj).observableIsValid();
                        done();
                    });
                });

                it('value not valid with custom message', function (done) {
                    testObj.extend({ validatable: false });
                    testObj = ko.defferedObservable({ deferred: areaCodesPromise }).extend({ fax: { params: true, message: customMessage } });
                    areaCodesPromise.then(function () {
                        testObj('0505555R55');
                        expect(testObj).observableIsNotValid(customMessage);
                        testObj('189799909');
                        expect(testObj).observableIsNotValid(customMessage);
                        done();
                    });
                });

                it('number displayed with hyphen', function (done) {
                    areaCodesPromise.then(function () {
                        testObj('089799909');
                        expect(testObj()).toEqual('08-9799909');
                        testObj('0722020200');
                        expect(testObj()).toEqual('072-2020200');
                        testObj('08-9799909');
                        expect(testObj()).toEqual('08-9799909');
                        testObj('072-2020200');
                        expect(testObj()).toEqual('072-2020200');
                        done();
                    });
                });
            });

        });
    });
});