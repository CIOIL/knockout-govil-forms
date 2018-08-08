define(['common/entities/entityBase', 'common/ko/bindingHandlers/tlpSelect'], function (entityBase) {

    var viewModel;

    var selectElement;

    function getBindingsForElement(element) {
        var node = element.get(0);
        var context = ko.contextFor(node);
        return ko.bindingProvider.instance.getBindings(node, context);
    }

    beforeEach(function () {
        var list = [{ 'dataCode': '1', 'dataText': 'משרד הרווחה' }, { 'dataCode': '2', 'dataText': 'משרד החינוך' }, { 'dataCode': '3', 'dataText': 'משרד הבריאות' }, { 'dataCode': '4', 'dataText': 'משרד הקליטה' }, { 'dataCode': '5', 'dataText': 'משרד לביטחון פנים' }, { 'dataCode': '6', 'dataText': 'משרד התמת' }];

        viewModel = {
            ministyList: ko.observableArray(list),
            ministy: new entityBase.ObservableEntityBase({})
        };

        ko.cleanNode(document.body);
        jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
        loadFixtures('tlpSelect.html');
        ko.applyBindings(viewModel);

        selectElement = $('#SelectElement');
    });

    describe('bindingHandler tlpSelect', function () {

        it('exists bindingHandler tlpSelect', function () {
            expect(ko.bindingHandlers.tlpSelect).toBeDefined();
        });

        it('bind node is select element', function () {
            expect(selectElement.is('select')).toBeTruthy();
        });

        describe('valid valueAccessor', function () {
            var bindings;

            beforeEach(function () {
                // TODO: beforeAll??
                bindings = getBindingsForElement(selectElement);
            });

            it('valueAccessor contain selectedObject', function () {
                expect(bindings.tlpSelect.selectedObject).toBeDefined();
            });

            it('valueAccessor contain options', function () {
                expect(bindings.tlpSelect.options).toBeDefined();
            });
        });

        it('empty list will fill option with selectedObject', function () {
            viewModel.ministy.dataCode('1');
            viewModel.ministyList([]);
            expect(viewModel.ministy.dataCode()).toEqual('1');
        });
    });

    describe('bindingHandler selectedObject', function () {

        it('exists bindingHandler selectedObject', function () {
            expect(ko.bindingHandlers.selectedObject).toBeDefined();
        });

        describe('valid valueAccessor', function () {
            var bindings;
            beforeEach(function () {
                // TODO: beforeAll??
                bindings = getBindingsForElement(selectElement);
            });

            it('valueAccessor contain dataCode', function () {
                expect(bindings.tlpSelect.selectedObject.dataCode).toBeDefined();
            });

            it('valueAccessor contain dataText', function () {
                expect(bindings.tlpSelect.selectedObject.dataText).toBeDefined();
            });
        });

        it('select option update its object respectively', function () {
            viewModel.ministy.dataCode('1');
            expect(viewModel.ministy.dataText()).toEqual('משרד הרווחה');
        });

        it('force to select value from options', function () {
            // TODO:rename to:  select value not from options is not allowed??
            viewModel.ministy.dataCode('999');
            expect(viewModel.ministy.dataCode()).toBeUndefined();
            expect(viewModel.ministy.dataText()).toBeUndefined();
        });
    });
});