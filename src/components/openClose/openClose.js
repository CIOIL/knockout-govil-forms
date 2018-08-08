/**
 * @module openClose
 * @description module for custom bindings that manage minimizing & maximizing elements
 */
define(['common/components/openClose/texts',
        'common/ko/globals/multiLanguageObservable'
],
    function (texts) {

        var labels = ko.multiLanguageObservable({ resource: texts });
        /** 
    *  @function 
    * <b> openRow </b>
    * @description custom binding that hides and displays the element.<br />
    * to be put on the element itself 
    * @example 
    *  <div class="row content" data-bind="openRow:isOpenContent">
    */
        ko.bindingHandlers.openRow = {
            init: function (element, valueAccessor) {
                var isOpenContent = valueAccessor();

                var negIsOpenContent = ko.computed(function () {
                    return !isOpenContent();
                });

                ko.applyBindingsToNode(element, { css: { minimized: negIsOpenContent, open: isOpenContent } });
            }
        };

        /** 
    *  @function 
    * <b> tlpOpenClose </b>
    * @description custom binding that operates the minimize/maximize button, also toggles the icon (+/-).<br />
    * to be put on the component wrapper element 
    * @example 
    * <div id="openClose" tfsinclude="CDN\builder\src\components\openClose\openClose.html" data-bind="tlpOpenClose:isOpenContent"></div>
    */
        ko.bindingHandlers.tlpOpenClose = {
            init: function (element, valueAccessor) {
                var isOpenContent = valueAccessor();
                var toggleValue = function () {
                    isOpenContent(!isOpenContent());
                };
                var ariaLabel = ko.computed(function () {
                    if (ko.unwrap(isOpenContent)) {
                        return labels().open;
                    }
                    return labels().close;
                });
                var ariaExpanded = ko.computed(function () {
                    return isOpenContent().toString();
                });
                ko.applyBindingsToNode($(element).find('i')[0], {
                    css: { 'close-row': isOpenContent }
                });
                ko.applyBindingsToNode($(element).find('button')[0], {
                    click: toggleValue,
                    attr: { 'aria-label': ariaLabel, 'aria-expanded': ariaExpanded }
                });

            }
        };
    });