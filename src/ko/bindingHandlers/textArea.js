/** module that manipulates textArea elements sizes. 
@module textAreaAdjuster  
*/
define([],

    function () {

        const cssArr = ['width', 'font'];

        // The function gets source and target elements
        // copy the styles in the cssArr from the source to the target.
        function copyCss(sourceElement, targetElement) {
            cssArr.forEach((style) => {
                let styleVal = sourceElement.css(style);
                if (styleVal) {
                    targetElement.css(style, styleVal);
                }
            });
        }

        // The function creates style classes and append them to the HTML page
        function createCssClasses() {
            let style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.noscrollTextarea { overflow: hidden; } .hiddendivTextarea {display: none; white-space: pre-wrap; word-wrap: break-word;}';
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        createCssClasses();

        // The function calculates min higth according to textarea rows.
        function calculateMinHeight(textarea) {
            const ROW_VS_PX = 20.666666666666667;
            const DEFAULT_TEXTAREA_ROWS = 2;
            const textareaRows = textarea.attr('rows');
            return (textareaRows ? parseInt(textareaRows, 10) : DEFAULT_TEXTAREA_ROWS) * ROW_VS_PX;
        }

        // The function gets textarea element and another element.
        // and set min-height to the other element.
        function setMinHeightAccordingToTextarea(textarea, minHeightElement) {
            const height = calculateMinHeight(textarea);
            minHeightElement.css('min-height', `${height}px`);
        }

        // The function gets an id of textarea element
        // and makes it a dynamic height textarea - 
        // according to the size of the text the user will enter.
        function autoResizeTextarea(element) {

            const textarea = $(element);
            const hiddenDiv = $(document.createElement('div'));

            hiddenDiv.attr('id', `${element.id}Div`);
            copyCss(textarea, hiddenDiv);
            textarea.addClass('noscrollTextarea');
            hiddenDiv.addClass('hiddendivTextarea');
            setMinHeightAccordingToTextarea(textarea, hiddenDiv);
            $('body').append(hiddenDiv);
        }

        // The function inserts the content of the textarea into the hiddenDiv
        // And updates the textarea height according to the hiddenDiv height
        function heightChanged(element, content) {
            const textarea = $(element);
            const hiddenDiv = $(`#${element.id}Div`);
            hiddenDiv.html(`${content} \n `);
            textarea.css('height', hiddenDiv.height());
        }

        /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.autoResizeTextarea"
        * @description custom binding that makes the textarea to be auto resize textarea.
           The textarea height will be updated according to th textarea content. 
        * @param {ko.observable} valueAccessor: the textarea value.
        * @example  Example of usage
        * <div class="row ">
                <div class="col-md-4">
                    <label for="comments">הערות</label>
                    <textarea class="tfsInputTextArea" data-bind="value: comments, autoResizeTextarea: comments" id="comments" rows="3" tfsData type="text"></textarea>
                </div>
            </div>
        */
        ko.bindingHandlers.autoResizeTextarea = {
            init: (element) => {
                autoResizeTextarea(element);
                $(element).bind('input', function () {
                    heightChanged(element, $(element).val());
                });
            },
            update: (element, valueAccessor) => {
                const content = ko.unwrap(valueAccessor());
                heightChanged(element, content);
            }
        };


        /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.adjustTextArea"
        * @description custom binding that display all of the textarea content in print mode.
        * @param {ko.observable} valueAccessor: the textarea value.
        * @example  Example of usage
        * <div class="row ">
                <div class="col-md-4">
                    <label for="comments">הערות</label>
                    <textarea class="tfsInputTextArea" data-bind="value: comments, adjustTextArea: comments" id="comments" rows="3" tfsData type="text"></textarea>
                </div>
            </div>
        */
        ko.bindingHandlers.adjustTextArea = {
            init: function (element, valueAccessor) {

                var textArea = $(element);
                textArea.after(function () {
                    return '<span class=\'pseudoTextArea invisibleElem\'></span>';
                });

                textArea.addClass('noPrint');

                var pseudoTextArea = $(element).next();

                setMinHeightAccordingToTextarea(textArea, pseudoTextArea);

                ko.applyBindingsToNode(pseudoTextArea[0], { text: valueAccessor() });

            }
        };
    });