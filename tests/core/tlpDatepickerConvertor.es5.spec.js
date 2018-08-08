define(['common/core/tlpDatepickerConvertor', 'common/external/jquery-ui'], function (datepickerConvertor) {
    describe('relpace agat input date with tlpDatepicker', function () {
        $.datepicker.regional = {
            ar: {},
            he: {
                closeText: 'סגור',
                prevText: '&#x3C;הקודם',
                nextText: 'הבא&#x3E;',
                currentText: 'היום',
                monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
                monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
                dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
                dayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'שבת'],
                dayNamesMin: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'שבת'],
                weekHeader: 'Wk',
                dateFormat: 'dd/mm/yy',
                firstDay: 0,
                isRTL: true,
                showMonthAfterYear: false,
                yearSuffix: ''
            }
        };
        beforeEach(function () {
            jasmine.getFixtures().fixturesPath = 'base/Tests/core/templates';
            loadFixtures('tlpDatepickerConvertor.html');
        });

        it('field with tfsdatatype=date ', function () {
            expect($('.tfsCalendar').length).toEqual(1);
            datepickerConvertor.convertAgatDateFieldsToTlpDatepicker();
            expect($('.tfsCalendar').length).toEqual(0);
            expect($('#migrationDate')[0].hasAttribute('tfsdatatype')).toBeFalsy();
            //expect($('#migrationDate').hasClass('hasDatepicker')).toBeTruthy();
        });
    });
});