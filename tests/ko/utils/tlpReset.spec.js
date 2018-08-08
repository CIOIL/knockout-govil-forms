define(['common/ko/utils/tlpReset', 'common/ko/validate/utilities/phoneMethods', 'common/ko/globals/defferedObservable'],
    function (tlpReset, phoneMethods) {

        describe('Reset View Model', function () {
            beforeEach(function () {
                ko.utils.tlpReset.ignore = [];
            });
            //#region viewModel
            var setModel = function setModel(viewModel, model) {
                for (var key in model) {
                    if (model.hasOwnProperty(key)) {
                        viewModel[key] = model[key];
                    }
                }
            };
            /*eslint complexity: [2, 5]*/
            var Contact = function Contact(settings) {
                var vm = {};
                vm.model = {
                    type: ko.observable(settings.type || '').defaultValue('אזרח'),
                    identityNumber: ko.observable(settings.identityNumber || '').defaultValue('123456'),
                    name: ko.observable(settings.name || '')
                };

                vm.getModel = function () {
                    return vm.model;
                };
                setModel(vm, vm.model);
                return vm;
            };
            var deferred = phoneMethods.loadLists();

            var resetByRemoveRow = jasmine.createSpy();
            var viewModel = (function () {
                var vm = {};
                vm.model = {
                    userType: ko.observable('').defaultValue('company'),
                    userFirstName: ko.observable(''),
                    idnum: ko.observable(''),
                    city: ko.observable('').defaultValue('ישראל'),
                    cityCode: ko.observable('').defaultValue('900'),
                    street: ko.observable(''),
                    streetCode: ko.observable(''),
                    date: ko.observable('').defaultValue('01/03/2012'),
                    abc: ko.observable('abc'),
                    def: ko.observable('def'),
                    ghi: ko.observable('ghi'),
                    phone: ko.defferedObservable({ deferred: deferred }).extend({ phoneNumber: true }),
                    contactList: ko.observableArray([new Contact({ type: 'תייר', identityNumber: '44444444', name: 'qwe' }),
                    new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                    new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' })]),
                    contactListMinLength: ko.observableArray([new Contact({ type: 'תייר', identityNumber: '44444444', name: 'qwe' })]).minLength(2),
                    contactListAllowEmpty: ko.observableArray([new Contact({ type: 'תייר', identityNumber: '44444444', name: 'qwe' })]).allowEmptyTable(true),
                    cont: new Contact({ type: 'תייר', identityNumber: '44444444', name: 'qwe' }),
                    innerContact: new Contact({ type: 'תייר', identityNumber: '44444444', name: 'qwe' })
                };
                vm.typeList = ['אזרח', 'תייר', 'עולה חדש'];
                vm.numericArray = ko.observableArray(['1', '2', '3']);

                vm.getModel = function () {
                    return vm.model;
                };
                setModel(vm, vm.model);
                return vm;
            }());

            describe('resetObservableArray function', function () {
                var resetObsvArr = ko.utils.tlpReset.resetObservableArray;

                describe('observable array with simple values', function () {
                    it('length array', function () {
                        resetObsvArr(viewModel.numericArray);
                        expect(viewModel.numericArray()).toEqual([]);
                    });
                });

                describe('observable array with observables values', function () {
                    resetObsvArr(viewModel.contactList);
                    it('length array', function () {
                        expect(viewModel.contactList().length).toEqual(1);
                    });

                    it('undefined observable', function () {
                        expect(viewModel.contactList()[0].name()).toEqual(undefined);
                    });

                    it('default observable', function () {
                        expect(viewModel.contactList()[0].type()).toEqual('אזרח');
                    });

                    describe('ignore', function () {
                        beforeEach(function () {
                            ko.utils.tlpReset.ignore = [];
                            viewModel.contactList([]);
                            viewModel.contactList.push(new Contact({ type: 'תייר', identityNumber: '44444444', name: 'qwe' }),
                                new Contact({ type: 'יפה', identityNumber: '22222222', name: 'noa' }));
                        });
                        it('length of array with ignore from array', function () {
                            ko.utils.tlpReset.ignore.push(viewModel.contactList);
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList().length).toEqual(2);
                        });
                        it('observable in array', function () {
                            ko.utils.tlpReset.ignore.push(viewModel.contactList()[0].name);
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList()[0].name()).toEqual('qwe');
                        });
                        it('observable with default', function () {
                            ko.utils.tlpReset.ignore.push(viewModel.contactList()[0].identityNumber);
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList()[0].identityNumber()).toEqual('44444444');
                        });
                    });

                    describe('default', function () {
                        it('observable with default in array', function () {
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList()[0].identityNumber()).toEqual('123456');
                        });
                    });

                    describe('minLength', function () {
                        it('length array with min length bigger than 1', function () {
                            viewModel.contactListMinLength.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                                new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' }));
                            resetObsvArr(viewModel.contactListMinLength);
                            expect(viewModel.contactListMinLength().length).toEqual(2);
                        });
                        it('length array less than minLength', function () {
                            viewModel.contactListMinLength([]);
                            viewModel.contactListMinLength.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }));
                            expect(viewModel.contactListMinLength().length).toEqual(1);
                        });
                        it('length array when minLength equal to zero', function () {
                            viewModel.contactListMinLength.minLength(0);
                            viewModel.contactListMinLength.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }));
                            resetObsvArr(viewModel.contactListMinLength);
                            expect(viewModel.contactListMinLength().length).toEqual(1);
                        });
                        it('length array when minLength equal to one', function () {
                            viewModel.contactListMinLength.minLength(1);
                            viewModel.contactListMinLength.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }));
                            resetObsvArr(viewModel.contactListMinLength);
                            expect(viewModel.contactListMinLength().length).toEqual(1);
                        });
                    });

                    describe('allowEmptyTable', function () {
                        it('length array with positive allowEmptyTable', function () {
                            viewModel.contactListAllowEmpty.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                                new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' }));
                            resetObsvArr(viewModel.contactListAllowEmpty);
                            expect(viewModel.contactListAllowEmpty().length).toEqual(0);
                        });
                        it('length array with negative allowEmptyTable', function () {
                            viewModel.contactListAllowEmpty.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                                new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' }));
                            viewModel.contactListAllowEmpty.allowEmptyTable(false);
                            resetObsvArr(viewModel.contactListAllowEmpty);
                            expect(viewModel.contactListAllowEmpty().length).toEqual(1);
                        });
                    });

                    describe('minLength with allowEmptyTable', function () {
                        it('minLength = 0 & allowEmptyTable = true', function () {
                            viewModel.contactList.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                                new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' }));
                            viewModel.contactList.minLength(0).allowEmptyTable(true);
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList().length).toEqual(0);
                        });
                        it('minLength = 0 & allowEmptyTable = false', function () {
                            viewModel.contactList.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                                new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' }));
                            viewModel.contactList.minLength(0).allowEmptyTable(false);
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList().length).toEqual(1);
                        });
                        it('minLength = 1 & allowEmptyTable = true', function () {
                            viewModel.contactList.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                                new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' }));
                            viewModel.contactList.minLength(1).allowEmptyTable(true);
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList().length).toEqual(1);
                        });
                        it('minLength = 1 & allowEmptyTable = false', function () {
                            viewModel.contactList.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                                new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' }));
                            viewModel.contactList.minLength(1).allowEmptyTable(false);
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList().length).toEqual(1);
                        });
                        it('minLength = 2 & allowEmptyTable = true', function () {
                            viewModel.contactList.push(new Contact({ type: 'תייר', identityNumber: '111111111', name: 'abc' }),
                                new Contact({ type: 'עולה חדש', identityNumber: '2222222222', name: 'zxc' }));
                            viewModel.contactList.minLength(2).allowEmptyTable(true);
                            resetObsvArr(viewModel.contactList);
                            expect(viewModel.contactList().length).toEqual(2);
                        });

                    });
                });
            });
            describe('resetModel function', function () {
                beforeEach(function () {
                    viewModel.userType('user');
                    viewModel.userFirstName('noa');
                    ko.utils.tlpReset.ignore = [];
                });

                it('writable computed', function () {
                    ko.utils.tlpReset.resetModel(viewModel);
                    expect(viewModel.phone()).toEqual('');
                });

                it('simple observable', function () {
                    ko.utils.tlpReset.resetModel(viewModel);
                    expect(viewModel.userFirstName()).toEqual(undefined);
                });

                it('observable in object', function () {
                    ko.utils.tlpReset.resetModel(viewModel);
                    expect(viewModel.cont.name()).toEqual(undefined);
                });

                it('observable with default', function () {
                    ko.utils.tlpReset.resetModel(viewModel);
                    expect(viewModel.userType()).toEqual('company');
                });

                it('ignore observable', function () {
                    ko.utils.tlpReset.ignore.push(viewModel.userFirstName);
                    ko.utils.tlpReset.resetModel(viewModel);
                    expect(viewModel.userFirstName()).toEqual('noa');
                    expect(viewModel.userType()).toEqual('company');
                });

                it('ignore observable with default ', function () {
                    ko.utils.tlpReset.ignore.push(viewModel.userType);
                    ko.utils.tlpReset.resetModel(viewModel);
                    expect(viewModel.userFirstName()).toEqual(undefined);
                    expect(viewModel.userType()).toEqual('user');

                });

                it('ignore should not be shared between resetModel calls ', function () {
                    var obj = {
                        a: ko.observable('voila!'),
                        b: ko.observable('voila!')
                    };
                    var model = {
                        zebra: ko.observable('zebra'),
                        innerContact: new Contact({ type: 'תייר', identityNumber: '44444444', name: 'qwe' }),
                        giraffe: ko.observable('giraffe')
                    };

                    model.innerContact.name.subscribe(function (newVal) {
                        if (!newVal) {
                            ko.utils.tlpReset.resetModel(obj);
                        }
                    });
                    // ko.utils.tlpReset.ignore.push(model.giraffe);
                    ko.utils.tlpReset.resetModel(model, [model.giraffe]);
                    expect(model.giraffe()).toEqual('giraffe');
                    expect(model.zebra()).toEqual(undefined);
                });


                it('silent reset validatable observable', function () {
                    viewModel.idnum.extend({ required: true });
                    viewModel.idnum('111111118');
                    ko.utils.tlpReset.resetModel(viewModel, [], true);
                    expect(viewModel.idnum()).toEqual(undefined);
                    expect(viewModel.idnum.isModified()).toEqual(false);

                });
                describe('observable array with silent reset for validatable observable', function () {
                    it('with silent reset', function () {
                        viewModel.idnum.extend({ required: true });
                        viewModel.idnum('111111118');
                        ko.utils.tlpReset.resetModel(viewModel, [], true);
                        expect(viewModel.idnum()).toEqual(undefined);
                        expect(viewModel.idnum.isModified()).toEqual(false);
                    });
                    it('without silent reset', function () {
                        viewModel.idnum.extend({ required: true });
                        viewModel.idnum('111111118');
                        ko.utils.tlpReset.resetModel(viewModel, [], false);
                        expect(viewModel.idnum()).toEqual(undefined);
                        expect(viewModel.idnum.isModified()).toEqual(true);

                    });
                });
            });
            describe('resetByRemoveRow function', function () {
                beforeEach(function () {
                    viewModel.userType('user');
                    viewModel.userType.resetByRemoveRow = resetByRemoveRow;
                });
                it('call resetByRemoveRow function of object if exist', function () {
                    ko.utils.tlpReset.resetByRemoveRow(viewModel);
                    expect(resetByRemoveRow).toHaveBeenCalled();
                }); 

            });
            describe('with custom reset function', function () {
                describe('in object, types:', function () {
                    viewModel.resetObj = {
                        reset: function () {
                            var x = 1; x++;
                        },
                        aaa: ko.observable('aaa'),
                        bbb: 'bbb',
                        ccc: 1,
                        ddd: undefined,
                        eee: null,
                        fff: true,
                        ggg: ['111', 'aaa'],
                        hhh: [{ a: 'aaa', b: 'bbb' }, { a: true, x: 1 }]
                    };
                    ko.utils.tlpReset.resetModel(viewModel.resetObj);
                    it('observable', function () {
                        expect(viewModel.resetObj.aaa()).toEqual(undefined);
                    });
                    it('string', function () {
                        expect(viewModel.resetObj.bbb).toEqual('bbb');
                    });
                    it('number', function () {
                        expect(viewModel.resetObj.ccc).toEqual(1);
                    });
                    it('undefined', function () {
                        expect(viewModel.resetObj.ddd).toEqual(undefined);
                    });
                    it('null', function () {
                        expect(viewModel.resetObj.eee).toEqual(null);
                    });
                    it('boolean', function () {
                        expect(viewModel.resetObj.fff).toEqual(true);
                    });
                    it('simple array', function () {
                        expect(viewModel.resetObj.ggg[1]).toEqual('aaa');
                    });
                    it('array of objects', function () {
                        expect(viewModel.resetObj.hhh[0].b).toEqual('bbb');
                    });
                });

                it('in model', function () {
                    viewModel.userFirstName('noa');
                    viewModel.reset = function () {
                    };
                    ko.utils.tlpReset.resetModel(viewModel);
                    expect(viewModel.userFirstName()).toEqual('noa');
                });
            });
            describe('with all types', function () {
                viewModel.reset = null;
                ko.extenders.logChange = function (target) {
                    target.subscribe(function (newValue) {
                        return newValue;
                    });
                    return target;
                };
                viewModel.resetObj = {
                    abc: function () {
                        var x = 1; x++;
                    },
                    aaa: ko.observable('aaa'),
                    withEmpty: ko.observable(''),
                    withEmptyAndDefault: ko.observable('').defaultValue('123'),
                    bbb: 'bbb',
                    ccc: 1,
                    ddd: undefined,
                    eee: null,
                    fff: true,
                    ggg: ['111', 'aaa'],
                    hhh: [{ a: 'aaa', b: 'bbb' }, { a: true, x: 1 }],
                    extender: ko.observable('Bob').extend({ logChange: 'first name' })
                };
                ko.utils.tlpReset.resetModel(viewModel.resetObj);

                it('function', function () {
                    expect(typeof (viewModel.resetObj.abc)).toEqual('function');
                });
                it('obsevable', function () {
                    expect(viewModel.resetObj.aaa()).toEqual(undefined);
                });
                it('string', function () {
                    expect(viewModel.resetObj.bbb).toEqual('bbb');
                });
                it('number', function () {
                    expect(viewModel.resetObj.ccc).toEqual(1);
                });
                it('undefined', function () {
                    expect(viewModel.resetObj.ddd).toEqual(undefined);
                });
                it('null', function () {
                    expect(viewModel.resetObj.eee).toEqual(null);
                });
                it('boolean', function () {
                    expect(viewModel.resetObj.fff).toEqual(true);
                });
                it('simple array', function () {
                    expect(viewModel.resetObj.ggg[1]).toEqual('aaa');
                });
                it('array of objects', function () {
                    expect(viewModel.resetObj.hhh[0].b).toEqual('bbb');
                });
                it('extender', function () {
                    expect(viewModel.resetObj.extender()).toEqual(undefined);
                });
                it('withEmpty', function () {
                    expect(viewModel.resetObj.withEmpty()).toEqual('');
                });
                it('withEmptyAndDefault', function () {
                    expect(viewModel.resetObj.withEmptyAndDefault()).toEqual('123');
                });
            });
            describe('ignore', function () {
                describe('params and public property', function () {
                    beforeEach(function () {
                        viewModel.reset = null;
                        viewModel.userFirstName('noa');
                        viewModel.userType('user');
                        viewModel.abc('abc');
                        viewModel.def('def');
                        viewModel.ghi('ghi');
                        viewModel.dina = { a: 'A', b: 'B' };
                        ko.utils.tlpReset.ignore.push(viewModel.userFirstName);

                        ko.utils.tlpReset.ignore.push(viewModel.dina);
                        viewModel.cont.name('qwe');
                        ko.utils.tlpReset.resetModel(viewModel, [viewModel.abc, viewModel.def, viewModel.cont]);
                    });
                    it('public property', function () {
                        expect(viewModel.userFirstName()).toEqual('noa');
                    });
                    it('default', function () {
                        expect(viewModel.userType()).toEqual('company');
                    });
                    it('param', function () {
                        expect(viewModel.abc()).toEqual('abc');
                    });
                    it('simple', function () {
                        expect(viewModel.ghi()).toEqual(undefined);
                    });
                    it('object', function () {
                        expect(viewModel.dina).toEqual({ a: 'A', b: 'B' });
                    });
                    it('subModel', function () {
                        expect(viewModel.cont.name()).toEqual('qwe');
                    });
                    it('invalid ignore param', function () {
                        expect(function () { ko.utils.tlpReset.resetModel(viewModel, viewModel.abc, viewModel.def); })
                            .toThrowError('the parameter "optinalIgnore" must be of array type');
                    });
                });

            });

        });

    });
