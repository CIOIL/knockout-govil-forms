define(['common/external/jquery-ui', 'common/ko/bindingHandlers/tlpDatepicker'], function () {
    var datepickerSettings;
    describe('tlpDatepicker', function () {
        beforeAll(function () {
            $.datepicker.regional.ar = {
                closeText: 'إغلاق',
                prevText: '&#x3C;السابق',
                nextText: 'التالي&#x3E;',
                currentText: 'اليوم',
                monthNames: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
                monthNamesShort: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                dayNames: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
                dayNamesShort: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
                dayNamesMin: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
                weekHeader: 'أسبوع',
                dateFormat: 'dd/mm/yy',
                firstDay: 0,
                isRTL: true,
                showMonthAfterYear: false,
                yearSuffix: ''
            };
            $.datepicker.regional.he = {
                closeText: 'סגור',
                prevText: '&#x3C;הקודם',
                nextText: 'הבא&#x3E;',
                currentText: 'היום',
                monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
                'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
                monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני',
                'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
                dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
                dayNamesShort: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'שבת'],
                dayNamesMin: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'שבת'],
                weekHeader: 'Wk',
                dateFormat: 'dd/mm/yy',
                firstDay: 0,
                isRTL: true,
                showMonthAfterYear: false,
                yearSuffix: ''
            };
        });
        beforeEach(function () {
            ko.cleanNode(document.body);
            jasmine.getFixtures().fixturesPath = 'base/Tests/ko/bindingHandlers/templates';
            loadFixtures('tlpDatepicker.html');
        });
        describe('params', function () {
            describe('default params', function () {
                it('throw error when settings is undefined', function () {
                    expect(function () {
                        ko.applyBindings({ datepickerSettings: datepickerSettings });
                    }).toThrow();
                });
                it('not throw when settings is empty object', function () {
                    expect(function () {
                        ko.applyBindings({ datepickerSettings: {} });
                    }).not.toThrow();
                });
                it('not throw when settings include unknown key', function () {
                    expect(function () {
                        ko.applyBindings({ datepickerSettings: { aaa: '1' } });
                    }).not.toThrow();
                });

                it('added butoon', function () {
                    ko.applyBindings({ datepickerSettings: {} });
                    expect($('.col-md-4').find('.ui-datepicker-trigger').length).toEqual(1);
                });
            });
        });
        describe('date in dynamic', function () {
            it('should generate unique id when have parent with foreachUniqueID bindimg', function () {
                $('.col-md-4').attr('data-bind', 'foreachUniqueID:list');                
                ko.applyBindings({ list: ko.observableArray([{datepickerSettings: {}}]) });
                expect($('.datepicker-input').attr('id')).not.toEqual('datepicker1');
                expect($('.datepicker-input').attr('data-id')).toEqual('datepicker1');
            });
        });
        afterEach(function () {
            ko.cleanNode(document.body);
        });

    });
});


