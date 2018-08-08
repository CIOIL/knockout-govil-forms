define(['common/core/exceptions', 'common/utilities/loadWSList', 'common/external/q', 'common/entities/entityBase', 'common/networking/services'], function (formExceptions, loadWSList, Q, entityBase, services) {
    //eslint-disable-line
    describe('loadWSList', function () {

        describe('load all table using getList function', function () {
            beforeEach(function () {
                spyOn(services, 'govServiceListRequest').and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve([{ 'RowNumber': 1, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'גיוס/התנדבות', 'ID_Required': '1', 'Num_Sub_Subject': '1' }, { 'RowNumber': 2, 'NUM': '1', 'Subject': 'משטרת ישראל', 'Sub_Subject': 'דוחות תעבורה', 'ID_Required': '0', 'Num_Sub_Subject': '2' }]);
                    return deferred.promise;
                });
            });
            it('call getList with good paramters return all table', function (done) {
                var deffer1 = loadWSList.getList({ tableName: 'subjects_ContactUs' });
                deffer1.then(function (subjectsResponse) {
                    expect(subjectsResponse.length).toEqual(2);
                    done();
                });
            });
            it('call getList with empty string tableName  is fail', function (done) {
                expect(function () {
                    loadWSList.getList({ tableName: '' });
                }).toThrow(new formExceptions.FormError('missing required parameter'));
                done();
            });
            it('call getList without  any parameter is fail', function (done) {
                expect(function () {
                    loadWSList.getList();
                }).toThrow();
                done();
            });
            it('call getList with unknown parameter is fail', function (done) {
                expect(function () {
                    loadWSList.getList({ ff: 'subjects_ContactUs' });
                }).toThrow();
                done();
            });
        });

        describe('getListWithFilters function - load rows from table by filters settings', function () {
            var settignsWithFilter = {
                tableName: 'PniyotAttachments',
                columnsNames: ['AttachCode', 'AttachText', 'AttachTooltip'],
                filters: [{ 'key': 'PniyaSubjectCode', 'value': '2' }]
            };
            beforeEach(function () {
                spyOn(services, 'govServiceListRequest').and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve(["{ \"AttachCode\":\"2\" , \"AttachText\":\"טופס פניה ביחס להגבלה על רשיון נהיגה\" , \"AttachTooltip\":\" טופס פניה ביחס להגבלה על רשיון נהיגה- הטופס מיועד לנהגים אשר רשיונם לא חודש בהתאם לתקנה 172א לתקנות התעבורה. \" }"]); //eslint-disable-line
                    return deferred.promise;
                });
            });
            it('call getListWithFilters with good paramters return all table', function (done) {
                var deffer1 = loadWSList.getListWithFilters(settignsWithFilter);
                deffer1.then(function (subjectsResponse) {
                    expect(subjectsResponse.length).toEqual(1);
                    done();
                });
            });
            it('call getListWithFilters with empty string tableName  is fail', function (done) {
                expect(function () {
                    loadWSList.getListWithFilters({ tableName: '', columnsNames: [] });
                }).toThrow(new formExceptions.FormError('missing required parameter'));
                done();
            });
            it('call getListWithFilters without  any parameter is fail', function (done) {
                expect(function () {
                    loadWSList.getListWithFilters();
                }).toThrow();
                done();
            });
            it('call getListWithFilters without columnsNames parameter is fail', function (done) {
                expect(function () {
                    loadWSList.getListWithFilters({ table: 'PniyotAttachments' });
                }).toThrow(new formExceptions.FormError('missing required parameter'));
                done();
            });
        });
        describe('getEntityBaseList function - load columns as entityBase structure. filters is optional.', function () {

            beforeEach(function () {
                spyOn(services, 'govServiceListRequest').and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve([{ "dataText": "טופס פניות הציבור משמש לקבלת מידע על כל מקרה שבו השירות שלנו לא ענה על ציפיותיך.\nלתשומת ליבך באמצעות טופס זה לא ניתן להגיש בקשות בתיק ההוצעה לפועל. באתר רשות אכיפה וגביה ניתן למצוא את המדריך לזוכה בהוצאה לפועל.\nהמדריך לזוכה ינחה אתכם בכל הפעולות בהם אתם, הזוכים, רשאים לנקוט על מנת לקבל את המגיע לכם. כל התשלומים, ההליכים, הפעולות וההמלצות.\n", "dataCode": "1" }]); //eslint-disable-line
                    return deferred.promise;
                });
            });
            it('call getEntityBaseList with good paramters return filtered data', function (done) {
                var settings = {
                    tableName: 'PniyotHanchayot',
                    withFilter: true,
                    dataTextColumn: 'HanchayotText',
                    dataCodeColumn: 'NosePniyaCode',
                    filter: [{ 'key': 'HanchayotCode', 'value': '1' }]
                };
                var deffer1 = loadWSList.getEntityBaseList(settings);
                deffer1.then(function (subjectsResponse) {
                    expect(subjectsResponse.length).toEqual(1);
                    done();
                });
            });
            it('call getListWithFilters with dataTextColumn,dataCodeColumn as empty strings is fail', function () {
                expect(function () {
                    loadWSList.getEntityBaseList({ tableName: 'PniyotHanchayot', dataTextColumn: '', dataCodeColumn: '' });
                }).toThrow(new formExceptions.FormError('missing required parameter'));
            });
            it('call getListWithFilters without  any parameter is fail', function () {
                expect(function () {
                    loadWSList.getEntityBaseList();
                }).toThrow();
            });
            it('call getListWithFilters without dataTextColumn,dataCodeColumn parameters is fail', function () {
                expect(function () {
                    loadWSList.getEntityBaseList({ table: 'PniyotHanchayots' });
                }).toThrow(new formExceptions.FormError('missing required parameter'));
            });
        });
        describe('getListByWebServiceList function - get list using webServiceList', function () {

            beforeEach(function () {
                services.webServiceListRequest = jasmine.createSpy().and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve('﻿<root><City><dataCode>967</dataCode><dataText>אבו גווייעד (שבט)</dataText></City></root>'); //eslint-disable-line
                    return deferred.promise;
                });
            });
            it('call getListByWebServiceList with good paramters return xml data', function (done) {
                var settings = {
                    url: 'ExternalWS/justice/GETID.aspx/?ID=1'
                };
                var deffer1 = loadWSList.getListByWebServiceList(settings);
                deffer1.then(function (subjectsResponse) {
                    var xmlDoc = $.parseXML(subjectsResponse);
                    expect($(xmlDoc).find('City').length).toEqual(1);
                    done();
                });
            });
            it('call getListByWebServiceList with url as empty strings is fail', function () {
                expect(function () {
                    loadWSList.getListByWebServiceList({ url: '' });
                }).toThrow(new formExceptions.FormError('missing required parameter'));
            });
            it('call getListWithFilters without  any parameter is fail', function () {
                expect(function () {
                    loadWSList.getListByWebServiceList();
                }).toThrow();
            });
        });
        describe('getListByURL function - get list using govServiceList with free url and data', function () {
            var settings, response;
            beforeEach(function () {
                settings = {
                    dataType: 'json',
                    url: 'CleanlinessReport/GetModelDictionary',
                    method: 'POST',
                    data: {
                        manufactureId: '83648898-83fa-e211-9bbe-005056b108a6'
                    }
                };
                response = {
                    Data: {
                        Dictionary: [{ dataCode: 'ba170c77-84fa-e211-9bbe-005056b108a6', dataText: 'איווקו - 25S18' }, { dataCode: 'bc170c77-84fa-e211-9bbe-005056b108a6', dataText: 'איווקו - 35 C15D' }]
                    },
                    ResponseCode: 0,
                    ResponseText: 'success'
                };
                spyOn(services, 'govServiceListRequest').and.callFake(function () {
                    var deferred = Q.defer();
                    deferred.resolve(response); //eslint-disable-line
                    return deferred.promise;
                });
            });
            it('call getListByURL with good paramters return all data', function (done) {
                var deffer1 = loadWSList.getListByURL(settings);
                deffer1.then(function (subjectsResponse) {
                    expect(subjectsResponse.Data.Dictionary.length).toEqual(2);
                    expect(subjectsResponse.Data.Dictionary[0].dataCode).toEqual('ba170c77-84fa-e211-9bbe-005056b108a6');
                    done();
                });
            });
            it('call getListByURL with empty url  is fail', function (done) {
                expect(function () {
                    loadWSList.getListByURL({ url: '' });
                }).toThrow(new formExceptions.FormError('missing required parameter'));
                done();
            });
            it('call getListWithFilters without  any parameter is fail', function (done) {
                expect(function () {
                    loadWSList.getListByURL({});
                }).toThrow();
                done();
            });
        });
    });
});