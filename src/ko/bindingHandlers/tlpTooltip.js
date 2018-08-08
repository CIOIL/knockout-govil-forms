
define(['common/utilities/reflection',
    'common/ko/bindingHandlers/accessibility'],
    function (reflection) {

        var valueAfterCheckIsFunction = function valueAfterCheckIsFunction(valueAccessor) {
            if (typeof (valueAccessor) === 'function') {
                return valueAccessor();
            }
            else {
                return valueAccessor;
            }
        };

        /**     
       * @memberof ko         
       * @function "ko.bindingHandlers.tlpTooltip"
       * @description custom binding that allows dynamic modification using the view model of the displayed text (title) in the tooltip 
       * and initializing all the overridable parameters of the jquery-ui tooltip.
       * @param {ko.observable} valueAccessor: tooltipContent
       * @param {allBindings} allBindings - tooltipSettings: additional bind -for initializing settings of tooltip.
       * @example  Example of usage
       * tooltipContent: ko.observable('<span>this title uses JQuery IU tooltip <a href='http://www.google.com' target='_blank'>click me</a></br><span>its HTML tags</span></span>')//initializing the content with link text, changing the observable will notify the tooltip
       * ko.bindingHandlers.tlpTooltip.options.position = { my: 'right bottom-10' }
       * settingTooltip = { tooltipClass: 'red' };
       * <label id='tooltip1' data-bind='tooltip:tooltipContent,tooltipSettings:settingTooltip'>tooltip</label>
       */
        ko.bindingHandlers.tlpTooltip = {
            options: {
                position: { my: 'right bottom-10' },
                open: function open(event, ui) { //eslint-disable-line consistent-return
                    if (typeof (event.originalEvent) === 'undefined') {
                        return false;
                    }
                    var $id = $(ui.tooltip).attr('id');
                    $(this).attr('title', '');
                    // close other tooltips (on mobile)
                    $('div.ui-tooltip').not('#' + $id).remove();
                },
                close: function (event, ui) {
                    ui.tooltip.hover(function () {
                        $(this).stop(true).fadeTo('400', 1);
                    },
                    function () {
                        $(this).fadeOut('400', function () {
                            $(this).remove();
                        });
                    });
                    ui.tooltip.click(function () {
                        if (typeof (agatMobile) !== 'undefined') {
                            //running with mobile scripts
                            $(this).fadeOut('400', function () {
                                $(this).remove();
                            });
                        }
                        else {
                            $(this).stop(true);
                        }
                    });
                }
            },

            init: function init(element, valueAccessor, allBindings) {

                var handelTitle = function handelTitle() {
                    var h = ko.utils.unwrapObservable(valueAccessor());
                    var title = ko.utils.unwrapObservable(h.title);
                    if (!title) {
                        ko.applyBindingsToNode(element, { attr: { title: '' } });
                    }
                };

                var value = ko.unwrap(ko.unwrap(valueAfterCheckIsFunction(valueAccessor)));

                handelTitle();

                var settings = allBindings().tooltipSettings || {};

                var getOptionsSettings = function initOptionsSettings() {//settings, value, element) {
                    var options = ko.bindingHandlers.tlpTooltip.options;
                    settings = reflection.extendSettingsWithDefaults(settings, options);
                    settings.content = value;
                    return settings;
                };

                if ($(element).tooltip) {
                    $(element).tooltip(getOptionsSettings());//settings, value, element));
                }

                $(element).parent().addClass('has-description');
                $(element).attr('tabIndex',0);
            },
            update: function update(element, valueAccessor) {
                var value = ko.unwrap(ko.unwrap(valueAfterCheckIsFunction(valueAccessor)));
                if ($(element).tooltip) {
                    $(element).tooltip('option', 'content', value);
                    $(element).attr('aria-label', value);
                }
            }
        };
    });


