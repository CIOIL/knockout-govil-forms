define(['common/external/uuidv4'],
        function (uuidv4) {

            /**     
        * @memberof ko         
        * @function "ko.bindingHandlers.govRadio"
        * @description custom binding to radio in dynamic table
          generate unique name to group of radio (using uuid libary - https://github.com/kelektiv/node-uuid version 4)
          keep the original name in data-name attribute.
        * @example should be on div with class 'radiogroupContainer'
         <div class="radio radiogroupContainer" data-bind="govRadio: dynamicRadio" role="radiogroup" aria-labelledby="dynamicRadioLabel" >
        *  }
        */
            ko.bindingHandlers.govRadio = {
                init: function init(element) {
                    var uniqeName = uuidv4();
                    $(element).find('[type=radio]').each(function (index, elem) {
                        $(elem).attr('data-name', elem.name);
                        $(elem).attr('name', uniqeName);
                    });
                }
            };
        });
