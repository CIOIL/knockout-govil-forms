define(['common/ko/bindingHandlers/tlpTooltip', 'common/external/jquery-ui'], function () {
    //eslint-disable-line no-unused-varsapplyBindingsToNode
    describe('tooltip bindings', function () {

        var tooltipMark;

        var viewModel = {
            description: ko.observable('tooltip content')
        };

        beforeEach(function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('tlpTooltip.html');
            ko.cleanNode(document.body);
            tooltipMark = $('#desc_input');
            viewModel.description('tooltip content');
        });

        it('should create the binding handler', function () {
            expect(ko.bindingHandlers.tlpTooltip).toBeDefined();
        });
        describe('before init', function () {
            it('initial settings by bindingHandlers option', function () {
                ko.bindingHandlers.tlpTooltip.options.disabled = true;
                var tooltipBindings = { tlpTooltip: viewModel.description };
                ko.applyBindingsToNode(tooltipMark.get(0), tooltipBindings);
                expect(tooltipMark.tooltip('option', 'disabled')).toEqual(true);
            });
        });
        describe('init', function () {
            beforeEach(function () {
                var tooltipBindings = { tlpTooltip: viewModel.description, tooltipSettings: { tooltipClass: 'red' } };
                ko.applyBindingsToNode(tooltipMark.get(0), tooltipBindings);
            });
            it('tooltipcontent', function () {
                expect(tooltipMark.tooltip('option', 'content')).toEqual(viewModel.description());
            });
            it('tooltipSettings', function () {
                expect(tooltipMark.tooltip('option', 'tooltipClass')).toEqual('red');
            });
        });
        describe('update', function () {
            it('tooltipcontent updates with valueAccessor', function () {
                var tooltipBindings = { tlpTooltip: viewModel.description, tooltipSettings: { tooltipClass: 'red' } };
                ko.applyBindingsToNode(tooltipMark.get(0), tooltipBindings);
                viewModel.description('content changed');
                expect(tooltipMark.tooltip('option', 'content')).toEqual('content changed');
            });
            it('tooltipcontent = computed', function () {
                var computedContent = ko.computed(function () {
                    return viewModel.description() + '!!!';
                });
                var tooltipBindings = { tlpTooltip: computedContent };
                ko.applyBindingsToNode(tooltipMark.get(0), tooltipBindings);
                viewModel.description('TOOLTIP');
                expect(tooltipMark.tooltip('option', 'content')).toEqual('TOOLTIP!!!');
            });
        });
        describe('accessibility', function () {
            it('tooltipcontent', function () {
                var tooltipBindings = { tlpTooltip: viewModel.description, tooltipSettings: { tooltipClass: 'red' } };
                ko.applyBindingsToNode(tooltipMark.get(0), tooltipBindings);
                expect(tooltipMark.attr('aria-label')).toEqual('tooltip content');
                expect($('div').hasClass('has-description')).toBeTruthy();
                expect(tooltipMark).toHaveAttr('tabIndex', '0');
            });
        });
    });
});