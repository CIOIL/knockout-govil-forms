/** module that manipulates textArea elements sizes. 
@module textAreaAdjuster  
*/
define(['common/core/exceptions',
        'common/utilities/typeVerifier'
], function (exceptions, typeVerifier) {

    function isValidParameter(param) {
        if (!typeVerifier.domElement(param) && !typeVerifier.jQueryElement(param)) {
            return false;
        }
        return true;
    }

    function expandToFitContent(textAreaElements) {
        var elements = $('textArea');
        if (textAreaElements) {
            if (isValidParameter(textAreaElements)) {
                elements = $(textAreaElements);
            }
            else {
                return;
            }
        }
        elements.each(function () {
            if ($(this).is(':visible')) {
                var attr = $(this).attr('data-org-height');
                if (!(typeof attr !== typeof undefined && attr !== false)) {
                    $(this).attr('data-org-height', $(this).height());
                }
                $(this).height($(this)[0].scrollHeight);
            }
        });
    }

    function returnToOriginalSize(textAreaElements) {
        var elements = $('textArea');
        if (textAreaElements) {
            if (isValidParameter(textAreaElements)) {
                elements = $(textAreaElements);
            }
            else {
                return;
            }
        } elements.each(function () {
            if ($(this).is(':visible')) {
                $(this).css('height', $(this).attr('data-org-height'));
            }
        });
    }

    return {
        /**
       * @public
       * @function <b>expandTofitContent</b>
       * @description resize textArea element to display all content 
       * @param {object} element textArea element
       * @throws {FormError} element invalid or not exist
       */
        expandToFitContent: expandToFitContent,
        /**
      * @public
      * @function <b>returnToOriginalSize</b>
      * @description return textArea element to original size 
      * @param {object} element textArea element
      * @throws {FormError} element invalid or not exist
      */
        returnToOriginalSize: returnToOriginalSize
    };
});
