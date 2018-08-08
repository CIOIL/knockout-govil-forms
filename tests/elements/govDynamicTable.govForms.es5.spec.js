define(['common/ko/fn/config', 'common/external/jquery-ui', 'common/elements/govDynamicTable'], function () {

    describe('Gov Dynamic Table', function () {
        var Person = function Person() {
            var self = this;
            self.dynamicText = ko.observable('');
            self.dynamicDate = ko.observable('');
            self.attach = ko.observable('');
        };

        var viewModel;

        beforeEach(function () {

            viewModel = {
                contactsList: ko.observableArray([new Person()]).config({ type: Person })
            };
            jasmine.getFixtures().fixturesPath = '/base/Tests/elements/templates';
            loadFixtures('dynamicTableGovForms.html');
            ko.applyBindings(viewModel, $('#outerDtable')[0]);
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

            it('date input ', function () {
                var input = $('[id="dynamicDate"]')[0];
                expect($(input)).not.toHaveClass('hasDatepicker');
            });
        });

        describe('after binding', function () {
            it('input id should be changed and contains data-id', function () {
                var dynamicTableBind = { govDynamicTable: viewModel.contactsList };
                var table = $('#outerDtable tbody')[0];
                var input = $('[id="dynamicText"]')[0];
                var inputID = input.id;
                ko.applyBindingsToNode(table, dynamicTableBind);
                expect($(input).attr('data-id')).toEqual(inputID);
                expect($(input).attr('id')).not.toEqual(inputID);
            });

            it('input without id should not contains data-id', function () {
                var dynamicTableBind = { govDynamicTable: viewModel.contactsList };
                var table = $('#outerDtable tbody')[0];
                var input = $('.without-id')[0];
                ko.applyBindingsToNode(table, dynamicTableBind);
                expect($(input)).not.toHaveAttr('data-id');
                expect($(input)).not.toHaveAttr('id');
            });

            it('date input should have tlpDatepicker customBinding', function () {
                var dynamicTableBind = { govDynamicTable: viewModel.contactsList };
                var table = $('#outerDtable tbody')[0];
                var input = $('[id="dynamicDate"]')[0];
                ko.applyBindingsToNode(table, dynamicTableBind);
                expect($(input)).toHaveClass('hasDatepicker');
            });
        });
    });
});