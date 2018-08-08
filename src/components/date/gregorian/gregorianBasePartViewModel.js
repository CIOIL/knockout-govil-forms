define(['common/components/date/basePartViewModel',
        'common/entities/entityBase',
        'common/utilities/reflection',
        'common/external/q',
        'common/ko/fn/defineType'],
function (BasePart, entityBase, reflection, Q) {//eslint-disable-line max-params
    /** A view model of base gregorian date part.
    * @class  GregorianBasePartViewModel
    * @param {json} settings - object that contain the params.
   *  @param {boolean} [settings.isRequired=false] - parameter means if this part should be required
    * @param {string/computed/observable} [settings.title= empty string] - the title to display
    */
    //   var texts = { required:'חובה להזין ערך בשדה '};
    var GregorianBasePartViewModel = function (settings) {
        settings = settings || {};
        settings.dateRequest = settings.dateRequest || Q(true);

        var model = function () {
            var data = new entityBase.DeferredEntityBase({ deferred: settings.dateRequest });
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

    GregorianBasePartViewModel.prototype = Object.create(BasePart.prototype);
    GregorianBasePartViewModel.prototype.constructor = GregorianBasePartViewModel;

    /**
 * Static function - Check if the received part date is full 
 * @memberof GregorianBasePartViewModel 
 * @param {GregorianBasePartViewModel} value - the value to check
 * @example Example usage of isFull:
 * GregorianBasePartViewModel.isFull(month)
 * @returns {boolean} true if the received part is full.
 */
    GregorianBasePartViewModel.isFull = function (value) {
        return value instanceof GregorianBasePartViewModel && typeof value.data.dataCode() === 'number';
    };

    return GregorianBasePartViewModel;

});

