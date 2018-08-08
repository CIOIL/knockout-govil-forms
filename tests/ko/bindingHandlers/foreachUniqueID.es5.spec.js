define(['common/ko/fn/config', 'common/external/jquery-ui', 'common/ko/bindingHandlers/foreachUniqueID'], function () {

    describe('foreachUniqueID', function () {
        var Person = function Person() {
            var self = this;
            self.dynamicText = ko.observable('');
            self.dynamicDate = ko.observable('');
            self.attach = ko.observable('');
        };

        var viewModel, inputWithID, inputWithoutID;

        beforeEach(function () {

            viewModel = {
                contactsList: ko.observableArray([new Person()]).config({ type: Person })
            };
            jasmine.getFixtures().fixturesPath = '/base/Tests/ko/bindingHandlers/templates';
            loadFixtures('foreachUniqueID.html');
        });

        afterEach(function () {
            ko.cleanNode(document.body);
        });

        describe('bafore binding', function () {

            it('input should not has data-id attribute', function () {
                var input = $('[id="dynamicText"]')[0];
                var inputID = input.id;
                expect($(input)).not.toHaveAttr('data-id');
                expect($(input).attr('id')).toEqual(inputID);
            });

            it('input without id should not has id attribute', function () {
                var input = $('.without-id')[0];
                expect($(input)).not.toHaveAttr('id');
            });
        });

        describe('after binding', function () {
            beforeEach(function () {
                origInputID = $('.with-id').attr('id');
                ko.applyBindings(viewModel, $('#outerDtable')[0]);
                inputWithID = $('.with-id')[0];
                inputWithoutID = $('.without-id')[0];
            });
            it('input id should be changed and contains data-id', function () {
                expect($(inputWithID).attr('data-id')).toEqual(origInputID);
                expect($(inputWithID).attr('id')).not.toEqual(origInputID);
            });

            it('input without id should not contains data-id', function () {
                expect($(inputWithoutID)).not.toHaveAttr('data-id');
                expect($(inputWithoutID)).not.toHaveAttr('id');
            });
        });
    });
});