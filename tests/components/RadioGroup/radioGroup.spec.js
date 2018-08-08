define(['common/components/RadioGroup/radioGroup', 'common/viewModels/ModularViewModel'],
function (radioGroup,ModularViewModel) {
    describe('radioGroup', function () {

        describe('RadioViewModel', function () {

            it('should be defined', function () {
                expect(radioGroup.RadioViewModel).toBeDefined();
            });
            var radioViewModel;
           
            beforeEach(function () {
                var settings = { code: 1, text: 'yes',title:'yes answer' };
                radioViewModel = new radioGroup.RadioViewModel(settings);
            });

            it('properties shuold be defined', function () {
                expect(radioViewModel.dataText).toBeDefined();
                expect(radioViewModel.dataCode).toBeDefined();
                expect(radioViewModel.dataTitle).toBeDefined();
            });

            it('properties shuold be get values', function () {
                expect(radioViewModel.dataText()).toEqual('yes');
                expect(radioViewModel.dataCode).toEqual(1);
                expect(radioViewModel.dataTitle()).toEqual('yes answer');
            });

            it('properties shuold be defined as computed', function () {
                var yes = ko.computed(function () { return 'yes'; });
                radioViewModel = new radioGroup.RadioViewModel({ code:1, text: yes });
                expect(radioViewModel.dataText()).toEqual('yes');
            });

            it('missing args', function () {
                expect(function () { new radioGroup.RadioViewModel({ text: 'yes' }); }).toThrowError('One or more of the parameters sent to function "code" are missing or have the wrong type');
                expect(function () { new radioGroup.RadioViewModel({ code: 1 }); }).toThrowError('One or more of the parameters sent to function "text" are missing or have the wrong type');
            });
        });

        describe('RadioGroupViewModel', function () {

            it('should be defined', function () {
                expect(radioGroup.RadioGroupViewModel).toBeDefined();
            });

            var radioGroupViewModel;
            var args = { radioArray: [new radioGroup.RadioViewModel({code:1, text:'yes'}), new radioGroup.RadioViewModel({code:2, text:'no'})] };
            beforeEach(function () {
                radioGroupViewModel = new radioGroup.RadioGroupViewModel(args);
            });

            it('should be innherited from ModularViewModel class', function () {
                expect(Object.getPrototypeOf(radioGroupViewModel) instanceof ModularViewModel).toBeTruthy();
            });

            it('prototype.constructor is  RadioGroupViewModel class', function () {
                expect(Object.getPrototypeOf(radioGroupViewModel).constructor).toBe(radioGroup.RadioGroupViewModel);
            });

            it('properties shuold be definde', function () {
                expect(radioGroupViewModel.selectedValue).toBeDefined();
                expect(radioGroupViewModel.setSelectedValue).toBeDefined();
                expect(radioGroupViewModel.isSelected).toBeDefined();
                expect(radioGroupViewModel.radioArray).toBeDefined();
            });
            
            it('without radio array', function () {
                expect(function () { new radioGroup.RadioGroupViewModel({}); }).toThrowError('the parameter "radioArray" is invalid');
                expect(function () { new radioGroup.RadioGroupViewModel({ radioArray: [1, 2] }); }).toThrowError('the parameter "radioArray" is invalid');
            });

            it('with extend', function () {
                var args = { extend:{required:true}, radioArray: [new radioGroup.RadioViewModel({ code: 1, text: 'yes' }), new radioGroup.RadioViewModel({ code: 2, text: 'no' })] };
                radioGroupViewModel = new radioGroup.RadioGroupViewModel(args);
                expect(radioGroupViewModel.selectedValue.rules()[0].rule).toEqual('required');
            });

            describe('selectedValue functions', function () {

                it('selectedValue should get default value', function () {
                    var args = {defaultValue:1, radioArray: [new radioGroup.RadioViewModel({ code: 1, text: 'yes' }), new radioGroup.RadioViewModel({ code: 2, text: 'no' })] };
                    radioGroupViewModel = new radioGroup.RadioGroupViewModel(args);
                    expect(radioGroupViewModel.selectedValue()).toEqual(1);
                });
                it('selectedValue should get value', function () {
                    radioGroupViewModel.setSelectedValue(radioGroupViewModel.radioArray[0]);
                    expect(radioGroupViewModel.selectedValue()).toEqual(1);
                });

                it('isSelected should be true when equal selected', function () {
                    radioGroupViewModel.setSelectedValue(radioGroupViewModel.radioArray[0]);
                    expect(radioGroupViewModel.isSelected(radioGroupViewModel.radioArray[0])).toEqual(true);
                });

                it('isSelected should be false when equal selected', function () {
                    radioGroupViewModel.setSelectedValue(radioGroupViewModel.radioArray[0]);
                    expect(radioGroupViewModel.isSelected(radioGroupViewModel.radioArray[1])).toEqual(false);
                });
            });
        });

        describe('RadioGroupFieldViewModel', function () {

            it('should be defined', function () {
                expect(radioGroup.RadioGroupFieldViewModel).toBeDefined();
            });

            var radioGroupFieldViewModel;
            var args = { radioArray: [new radioGroup.RadioViewModel({ code: 1, text: 'yes' }), new radioGroup.RadioViewModel({ code: 2, text: 'no' })] };
            beforeEach(function () {
                radioGroupFieldViewModel = new radioGroup.RadioGroupFieldViewModel(args);
            });

            it('should be innherited from RadioGroupViewModel class', function () {
                expect(Object.getPrototypeOf(radioGroupFieldViewModel) instanceof radioGroup.RadioGroupViewModel).toBeTruthy();
            });

            it('prototype.constructor is  RadioGroupFieldViewModel class', function () {
                expect(Object.getPrototypeOf(radioGroupFieldViewModel).constructor).toBe(radioGroup.RadioGroupFieldViewModel);
            });

            it('properties shuold be definde', function () {
                expect(radioGroupFieldViewModel.text).toBeDefined();
            });

        });
        describe('options binding - adding bindings that not defined as default radio behavior', function () {
            var viewModel;
            var addDisabledAttribute = ko.observable(false);
            var addSecondClass = ko.observable(false);
            var addFirstClass = ko.observable(false);
            var firstRadio;

            beforeEach(function () {
                ko.cleanNode(document.body);
                var radioArray = [
                    new radioGroup.RadioViewModel({ code: 1, text: 'זכר', optionsBinding: { attr: { 'disabled': addDisabledAttribute }, css: { 'first': addFirstClass, 'second': addSecondClass } } }),
                    new radioGroup.RadioViewModel({ code: 2, text: 'נקבה' })
                ];
                var gender = new radioGroup.RadioGroupFieldViewModel({
                    text: 'מין הילד',
                    radioArray: radioArray,
                    extend: { required: true }
                });
                viewModel = {
                    gender: gender
                };
                jasmine.getFixtures().fixturesPath = 'base/Tests/components/RadioGroup/templates';
                loadFixtures('radioGroup.html');
                ko.applyBindings(viewModel, $('#radioGroupContainer')[0]);
            });
            it('adding optionsBinding to RadioViewModel params - adding the optionsBinding object to the radio button bindings', function () {
                addDisabledAttribute(true);
                addSecondClass(true);
                addFirstClass(true);
                firstRadio = $('.radio-button')[0];
                expect($(firstRadio).attr('disabled')).toEqual('disabled');
                expect($(firstRadio).hasClass('first')).toEqual(true);
                expect($(firstRadio).hasClass('second')).toEqual(true);
            });
        });
    });
   
});
