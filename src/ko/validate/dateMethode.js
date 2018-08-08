define(function () {
    var regExpSource = require('common/resources/regularExpressions');
    var validatorMethods = function () {
        var date = function (text) {
            return regExpSource.date.test(text);
        };

        var getToDateParameter = function (args) {
            var toDate = null;
            if (args && args.hasOwnProperty('compareTo')) {
                toDate = args.compareTo;
                if (toDate !== '')
                { checkIncorrectDateParameter(toDate, 'compareTo'); }//eslint-disable-line no-undef
            }
            return toDate;
        };

        var compareDate = function (dateValue, toDateValue) {
            var today;
            var vecDate = dateValue.toString().split('/');
            var theDate = new Date(vecDate[2], vecDate[1] - 1, vecDate[0], 0, 0, 0, 0);
            if (toDateValue) {
                vecDate = toDateValue.toString().split('/');
                today = new Date(vecDate[2], vecDate[1] - 1, vecDate[0], 0, 0, 0, 0);
            }
            else {
                today = new Date();
                today.setHours(0, 0, 0, 0);
            }

            return theDate - today;
        };

        var pastDate = function (text, args) {
            if (!date(text)) { return false; }
            return compareDate(text, getToDateParameter(args)) < 0;
        };

        var futureDate = function (text, args) {
            if (!date(text)) { return false; }
            return compareDate(text, getToDateParameter(args)) >= 0;
        };

        var untilDate = function (text, args) {
            if (!date(text)) { return false; }
            return compareDate(text, getToDateParameter(args)) <= 0;
        };

        var betweenDates = function (fromDateValue, toDateValue) {
            if (!date(fromDateValue) || !date(toDateValue)) { return false; }
            return compareDate(fromDateValue, toDateValue) <= 0;
        };

        var between2Dates = function (text, args) {
            if (!date(text)) { return false; }
            checkRequiredArgForFunction(args, 'fromDate', 'between2Dates');//eslint-disable-line no-undef
            checkIncorrectDateParameter(args.fromDate, 'fromDate');//eslint-disable-line no-undef
            checkRequiredArgForFunction(args, 'toDate', 'between2Dates');//eslint-disable-line no-undef
            checkIncorrectDateParameter(args.toDate, 'toDate');//eslint-disable-line no-undef
            return compareDate(text, args.fromDate) >= 0 && compareDate(text, args.toDate) <= 0;
        };


        return {
            date: date,
            pastDate: pastDate,
            futureDate: futureDate,
            untilDate: untilDate,
            betweenDates: betweenDates,
            between2Dates: between2Dates,
            compareDate: compareDate
        };
    }();
    return {
        validatorMethods: validatorMethods
    };
});