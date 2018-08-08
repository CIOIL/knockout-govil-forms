define(['common/components/groups/identificationInfo/IdentificationInfo',
    'common/components/groups/identificationInfo/IdentificationInfoExtended'],

function (IdentificationInfo, IdentificationInfoExtended) {//eslint-disable-line no-unused-vars

    describe('IdentificationInfo', function () {
        var identificationInfo;
        var settings;
        var getRule = function (rules, ruleName) {
            return ko.utils.arrayFilter(rules, function (item) {
                return item.ruleName === ruleName || item.rule === ruleName;
            });
        };
        it('should be defined', function () {
            expect(IdentificationInfo).toBeDefined();
        });

        describe('create an instance', function () {

            it('fdd', function () {
                identificationInfo = new IdentificationInfo({});

                expect(identificationInfo instanceof IdentificationInfo).toBeTruthy();
                expect(identificationInfo.idNum).toBeDefined();
                expect(identificationInfo.firstName).toBeDefined();
                expect(identificationInfo.lastName).toBeDefined();
            });

            describe('no settings sent', function () {

                it('expect defaultSettings', function () {
                    identificationInfo = new IdentificationInfo({});

                    expect(identificationInfo.idNum.rules).toBeDefined();
                    expect(identificationInfo.idNum.defaultValue).toBeDefined();
                    expect(identificationInfo.isEnabledIdNum()).toBeTruthy();
                });
            });

            describe('settings provided', function () {

                //beforeEach(function () {
                //    settings = {
                //        idNum: {
                //            applyExtenders: true,
                //            extenders: {
                //                required: true
                //            }, value: '111111118',
                //            isEnabled: false
                //        }
                //    };
                //    identificationInfo = new IdentificationInfo(settings);
                //});

                it('extenders applied', function () {
                    settings = {
                        idNum: {
                            extenders: {
                                required: true
                            }, defaultValue: '111111118',
                            isEnabled: false
                        }
                    };
                    identificationInfo = new IdentificationInfo(settings);

                    expect(getRule(identificationInfo.idNum.rules(), 'idNumRule')).not.toBeNull();
                    expect(getRule(identificationInfo.idNum.rules(), 'foreignPassport')).not.toBeNull();
                    expect(typeof getRule(identificationInfo.idNum.rules(), 'idNumRule')[0].condition).toEqual('function');
                    expect(typeof getRule(identificationInfo.idNum.rules(), 'foreignPassport')[0].condition).toEqual('function');
                });

                it('not sent rule to be taken from defaultSettings', function () {
                    identificationInfo = new IdentificationInfo();
                    expect(identificationInfo.idNum.rules().indexOf).toBeDefined();
                });

                it('defaultValue taken from settings', function () {
                    settings = {
                        idNum: {
                            extenders: {
                                required: true
                            }, defaultValue: '111111118',
                            isEnabled: false
                        }
                    };
                    identificationInfo = new IdentificationInfo(settings);
                    expect(identificationInfo.idNum()).toEqual('111111118');
                });
                it('isEnabled taken from settings', function () {
                    settings = {
                        idNum: {
                            extenders: {
                                required: true
                            }, defaultValue: '111111118',
                            isEnabled: false
                        }
                    };
                    identificationInfo = new IdentificationInfo(settings);
                    expect(identificationInfo.isEnabledIdNum()).toBeFalsy();
                });


            });

        });
    });

});

define('spec/IdentificationInfoeSpec.js', function () { });