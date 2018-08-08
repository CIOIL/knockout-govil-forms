
define(['common/components/date/basePartViewModel',
        'common/entities/entityBase',
        'common/resources/exeptionMessages',
        'common/utilities/stringExtension',
        'common/infrastructureFacade/tfsMethods',
        'common/utilities/reflection',
        'common/ko/fn/defineType'
],
    function (BasePart, entityBase, exeptionMessages, stringExtension, tfsMethods, reflection) {//eslint-disable-line max-params

        /** A view model of base hebrew date part.
     * @class HebrewBasePartViewModel
     *   @param {json} settings - object that contain the params.
       * @param {promise} settings.request - request to list from server.
       *  @param {boolean} [settings.isRequired=false] - parameter means if this part should be required
        * @param {string/computed/observable} [settings.title= empty string] - the title to display
     
     */
        var HebrewBasePartViewModel = function (settings) {

            var model = function () {
                var data = new entityBase.DeferredEntityBase({ deferred: settings.request });
                data.dataCode.defineType('number');
                return {
                    data: data
                };
            }();

            var self = this;
            BasePart.call(self, settings);

            var extendModel = reflection.extend(model, self.getModel());
            self.setModel(extendModel);

            model.data.dataCode.extend({
                required: {
                    onlyIf: function () {
                        return ko.unwrap(settings.isRequired);
                    }
                }
            });

            self.data.dataCode.subscribe(function (newValue) {
                if (self && self.list().length > 0) {
                    self.data.dataText(entityBase.utils.getTextByCode(self.list(), newValue));
                }
            });
        };

        HebrewBasePartViewModel.prototype = Object.create(BasePart.prototype);
        HebrewBasePartViewModel.prototype.constructor = HebrewBasePartViewModel;

        /**
         * Listeninig to request and handle it's result
         * @memberof HebrewBasePartViewModel
         * @param {promise} request - the promise that the function listen to it
         * @example Example usage of handleRequest:
         * month.handleRequest(request)
         * @returns {undefined} void.
         */
        HebrewBasePartViewModel.prototype.handleRequest = function (request) {
            var self = this;
            request.then(function (result) {
                self.handleRequestResult(result);
            }
            , function (error) {
                throw stringExtension.format(exeptionMessages.serverCallFailed, error.url);
            })
            .catch(function (error) {
                tfsMethods.dialog.alert(error);

            });
        };
        /**
    * handle request result - update list property with new result
    * @memberof HebrewBasePartViewModel
    * @param {list} result - new result to update the list
    * @example Example usage of handleRequestResult:
    * hebrewBasePartViewModel.handleRequestResult(list)
    * @returns {undefined} void.
    */
        HebrewBasePartViewModel.prototype.handleRequestResult = function (result) {
            this.list(result);
        };
        /**
     * Static function - Check if the received part date is valid
     * @memberof HebrewBasePartViewModel
     * @param {HebrewBasePartViewModel} value - the value to check
     * @example Example usage of isFullPart:
     * HebrewBasePartViewModel.isFullPart(month)
     * @returns {boolean} true if the received part is valid.
     */
        HebrewBasePartViewModel.isFull = function (value) {
            return value instanceof HebrewBasePartViewModel && typeof value.data.dataCode() === 'number';
        };

        return HebrewBasePartViewModel;

    });

