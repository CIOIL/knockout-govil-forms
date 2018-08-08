define(['common/viewModels/ModularViewModel',
        'common/utilities/array'],
function (ModularViewModel, array) {
    describe('array', () => {
        describe('filter', () => {
            const Person = function (args) {
                const self = this;
                const model = {
                    id: ko.observable(args.id),
                    firstName: ko.observable(args.firstName),
                    lastName: ko.observable(args.lastName),
                    age:ko.observable(args.age)
                };

                ModularViewModel.call(self, model);
            };
            const model = {
                contactsList: ko.observableArray([
                    new Person({ id: 0, firstName: 'Chana', lastName: 'Levi' ,age:8}),
                    new Person({ id: 1, firstName: 'Chana', lastName: 'Cohen' ,age:0}),
                    new Person({ id: 2, firstName: 'Chava', lastName: 'Cohen' ,age:5}),
                    new Person({ id: 2, firstName: 'Chaya sara', lastName: 'ben-david' ,age:6})
                ]),
                searchedText: ko.observable('')
            };
            const fullName = (row) => row.firstName() + ' ' + row.lastName();
            
            const settings = {
                sourceList: model.contactsList,
                columns: ['id', 'firstName', 'lastName', fullName],
                searchedText: model.searchedText
            };


            Person.prototype = Object.create(ModularViewModel.prototype);
            Person.prototype.constructor = Person;

            const foundByLength = [
                 { name: 'found one', searchedText: 'Chaya', equalLenght: 1 },
                 { name: 'not found by age', searchedText: '6', equalLenght: 0 },
                 { name: 'found by number', searchedText: '0', equalLenght: 1 },
                 { name: 'found all', searchedText: 'cha', equalLenght: model.contactsList().length },
                 { name: 'found with space', searchedText: 'a sa', equalLenght: 1 },
                 { name: 'found with hyphen', searchedText: 'en-', equalLenght: 1 },
                 { name: 'found with Capital letter', searchedText: 'Chaya', equalLenght: 1 },
                 { name: 'found with callBack function', searchedText: 'Chana le', equalLenght: 1 },
                 { name: 'not found', searchedText: 'Rachel', equalLenght: 0 }
            ];
            $.each(foundByLength, function (index, item) {
                it(item.name, function () {
                    model.searchedText(item.searchedText);
                    expect((array.filter(settings).length)).toEqual(item.equalLenght);
                });
            });

            it('filter when settings is undefined', function () {
                expect(array.filter()).toEqual([]);
            });
            it('fiter when searchedText is undefined', function () {
                settings.searchedText = undefined;
                expect(array.filter(settings)).toEqual(settings.sourceList);
            });
            it('fiter when searchedText is empty', function () {
                model.searchedText('');
                expect(array.filter(settings)).toEqual(settings.sourceList);
            });


        });
    });
});