define(function () {
    /**     
   * @memberof ko         
   * @function "ko.bindingHandlers.tlpMoveFocus"
   * @description custom bindings for moving focus to another filed.
   * @param {object} allBindings.characters - number of characters that after be typed- the focus will move to the next element
   * @param {object} allBindings.nextObject - selector of the element that the focus will be moved to
   * @example 
   * <input type='text' data-bind="tlpMoveFocus: viewModel.first, characters: 3, nextObject: '#thirdInput' "/>
   *  } 
   */
    ko.bindingHandlers.tlpMoveFocus = {
        update: function update(element, valueAccessor, allBindings) {
            var value = ko.unwrap(valueAccessor());
            var characters = allBindings().characters;
            var next = allBindings().nextObject;

            var canMove = function canMove() {
                return (value !== undefined && characters !== undefined && characters === value.length);
            };

            var moveToNext = function moveToNext() {
                if (next && $(next).length > 0 && !$(next).is(':disabled')) {//if next object was sent
                    $(next).focus();
                }
            };

            if (canMove()) {
                moveToNext();
            }
        }
    };
});
