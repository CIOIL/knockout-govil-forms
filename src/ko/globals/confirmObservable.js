/**
* @module ko
* @description wrapper to an observable that confirm it's changing and accept or reset the value
*/
define(['common/components/confirm',
    'common/ko/globals/multiLanguageObservable',
    'common/ko/globals/protectedObservable'
],
    function (confirmViewModel) {
        /**
       * @function confirmObservable
       * @description wrapper to an observable that confirm it's changing and accept or reset the value
       * @param {any} initialValue - value for init observable
       * @param {object} settings - value for init settings, there are default settings.
       * @param {object} settings.buttons - two buttons that can change them text
       * @param {object} settings.buttons.ok - text of ok button
       * @param {object} settings.buttons.cancel -text of cancel button
       * @param {object} settings.question - the text of question
       * @returns {ko.confirmObservable} observable contains reset and commit methods
       */
        ko.confirmObservable = function (initialValue, settings) {
            var _actual = ko.protectedObservable(initialValue);

            var result = ko.pureComputed({
                read: _actual,
                write: function (newValue) {
                    _actual(newValue);
                    var resources = {
                        hebrew: {
                            ok: 'אישור',
                            cancel: 'ביטול',
                            question: 'האם אתה בטוח שברצונך לשנות?'
                        },
                        arabic: {
                            ok: 'التأكيد',
                            cancel: 'الغاء',
                            question: 'are you sure you want to change?'
                        },
                        english: {
                            ok: 'ok',
                            cancel: 'cancel',
                            question: 'are you sure you want to change?'
                        }
                    };

                    resources = ko.multiLanguageObservable({ resource: resources });

                    var defaultSettings = {
                        buttons: {
                            ok: resources().ok,
                            cancel: resources().cancel
                        },
                        question: resources().question
                    };

                    $.extend(true, defaultSettings, settings);

                    confirmViewModel.handelDialog(defaultSettings).then(function () {
                        _actual.commit();
                    }).fail(function () { _actual.reset(); });
                }
            }).extend({ notify: 'always' });


            result.commit = function () {
                _actual.commit();
            };


            result.reset = function () {
                _actual.retet();
            };

            return result;
        };
    });