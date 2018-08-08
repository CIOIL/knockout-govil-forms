define(['common/core/exceptions'],
        function (formExceptions) {
            var getUniqe = function getUniqe() {
                var base36 = 36;
                return Math.random().toString(base36).slice(2);
            };

            ko.bindingHandlers.radioLabelAccessibility = {
                init: function (element) {

                    var enterKeyCode = 13; // ENTER
                    var spaceKeyCode = 32; // SPACE

                    var currentDiv = $(element).closest('div');
                    var label = currentDiv.find('label[data-for=' + element.id + ']');
                    if (!label[0]) {
                        formExceptions.throwFormError('HTML wrong structure.');
                    }

                    $(label).on('click', function () {
                        if ($(element).attr('disabled')) {
                            return false;
                        }
                        else {
                            $(element)[0].click();
                            return true;
                        }
                    });

                    $(label).keypress(function (event) {
                        var keyCode = (event.which ? event.which : event.keyCode);
                        if (keyCode === enterKeyCode || keyCode === spaceKeyCode) {
                            $(label).click();
                            return false;
                        }
                        return true;
                    });
                }
            };

            ko.bindingHandlers.tlpRadio = {
                init: function init(element) {
                    var uniqeName = getUniqe();
                    $(element).find('[type=radio]').each(function (index, elem) {
                        var elementID = getUniqe();
                        $(elem).attr('id', elem.name + elementID);
                        $(elem).next('label').attr('data-for', elem.name + elementID);
                        $(elem).attr('name', elem.name + uniqeName);
                        ko.applyBindingsToNode(elem, { 'radioLabelAccessibility': true });

                    });
                }
            };
        });
