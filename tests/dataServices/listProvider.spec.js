define(['common/dataServices/listProvider',
        'common/networking/services',
        'common/external/q'
],
function (listProvider, services, Q) {

    describe('listProvider - ', function () {
        let requestSettings = {};
        beforeEach(function () {
            spyOn(services, 'govServiceListRequest').and.callFake(function (settings) {
                requestSettings = settings;
                var deferred = Q.defer();
                deferred.resolve([{ 'dataText': 'משטרת ישראל', 'dataCode': '0' }, { 'dataCode': '1', 'dataText': ' 1משטרת ישראל' }]);
                return deferred.promise;
            });
        });
        describe('getList - ', function () {
            it('missing require param listName should throw error', function () {
                expect(function () { listProvider.getList({}); }).toThrow();
            });
            describe('correct params - ', function () {
                it('should creste request to ListProvider/GetList', function (done) {
                    const list = listProvider.getList({ listName: 'Police' });
                    list.then(() => {
                        expect(requestSettings.route).toEqual('ListProvider/GetList');
                        done();
                    });
                });
                it('should pass data include listName', function (done) {
                    const list = listProvider.getList({ listName: 'Police' });
                    list.then(() => {
                        expect(requestSettings.data).toEqual({ listName: 'Police' });
                        done();
                    });
                });
                it('avaliable to add/run over settings', function (done) {
                    const list = listProvider.getList({ listName: 'Police' }, { method: 'GET', abc: 'fff' });
                    list.then(() => {
                        expect(requestSettings.method).toEqual('GET');
                        expect(requestSettings.abc).toEqual('fff');
                        done();
                    });
                });
            });
        });
        describe('getLists - ', function () {
            it('missing require param paramsList should throw error', function () {
                expect(function () { listProvider.getLists({}); }).toThrow();
            });
            it('missing require param listName should throw error', function () {
                expect(function () { listProvider.getLists({ paramsList: [{ sortColumn: 'Police' }] }); }).toThrow();
            });
            describe('correct params - ', function () {
                it('should create request to ListProvider/GetLists', function (done) {
                    const list = listProvider.getLists({ paramsList: [{ listName: 'Police' }] });
                    list.then(() => {
                        expect(requestSettings.route).toEqual('ListProvider/GetLists');
                        done();
                    });
                });
                it('should pass data include paramsList', function (done) {
                    const list = listProvider.getLists({ paramsList: [{ listName: 'Police' }] });
                    list.then(() => {
                        expect(requestSettings.data).toEqual({ paramsList: [{ listName: 'Police' }] });
                        done();
                    });
                });
                it('avaliable to add/run over settings', function (done) {
                    const list = listProvider.getLists({ paramsList: [{ listName: 'Police' }] }, { method: 'GET', abc: 'fff' });
                    list.then(() => {
                        expect(requestSettings.method).toEqual('GET');
                        expect(requestSettings.abc).toEqual('fff');
                        done();
                    });
                });
            });
        });
        describe('getEntityBase - ', function () {
            it('missing require param listName should throw error', function () {
                expect(function () { listProvider.getEntityBase({ dataCodeColumn: 'code', dataTextColumn: 'name' }); }).toThrow();
            });
            it('missing require param dataCodeColumn should throw error', function () {
                expect(function () { listProvider.getEntityBase({ listName: 'Police', dataTextColumn: 'name' }); }).toThrowError('missing required param dataCodeColumn, listName: Police in GetAsEntityBase function (listProvider module)');
            });
            it('missing require param dataTextColumn should throw error', function () {
                expect(function () { listProvider.getEntityBase({ listName: 'Police', dataCodeColumn: 'code' }); }).toThrowError('missing required param dataTextColumn, listName: Police. in GetAsEntityBase function (listProvider module)');
            });
            describe('correct params - ', function () {
                it('should creste request to ListProvider/GetList', function (done) {
                    const list = listProvider.getEntityBase({ listName: 'Police', dataCodeColumn: 'code', dataTextColumn: 'name' });
                    list.then(() => {
                        expect(requestSettings.route).toEqual('ListProvider/GetAsEntityBase');
                        done();
                    });
                });
                it('should pass data include listName', function (done) {
                    const list = listProvider.getEntityBase({ listName: 'Police', dataCodeColumn: 'code', dataTextColumn: 'name' });
                    list.then(() => {
                        expect(requestSettings.data).toEqual({ listName: 'Police', dataCodeColumn: 'code', dataTextColumn: 'name' });
                        done();
                    });
                });
                it('avaliable to add/run over settings', function (done) {
                    const list = listProvider.getEntityBase({ listName: 'Police', dataCodeColumn: 'code', dataTextColumn: 'name' }, { method: 'GET', abc: 'fff' });
                    list.then(() => {
                        expect(requestSettings.method).toEqual('GET');
                        expect(requestSettings.abc).toEqual('fff');
                        done();
                    });
                });
            });
        });
        describe('getEntityBase - ', function () {
            it('missing require param paramsList should throw error', function () {
                expect(function () { listProvider.getEntityBaseLists({}); }).toThrow();
            });
            it('missing require param listName should throw error', function () {
                expect(function () { listProvider.getEntityBaseLists({ paramsList: [{ dataCodeColumn: 'code', dataTextColumn: 'name' }] }); }).toThrow();
            });
            it('missing require param dataCodeColumn should throw error', function () {
                expect(function () { listProvider.getEntityBaseLists({ paramsList: [{ listName: 'Police', dataTextColumn: 'name' }] }); }).toThrowError('missing required param dataCodeColumn, listName: Police in GetAsEntityBaseLists function (listProvider module)');
            });
            it('missing require param dataTextColumn should throw error', function () {
                expect(function () {
                    listProvider.getEntityBaseLists({ paramsList: [{ listName: 'Police', dataCodeColumn: 'code' }] });
                }).toThrowError('missing required param dataTextColumn, listName: Police. in GetAsEntityBaseLists function (listProvider module)');
            });
            describe('correct params - ', function () {
                it('should creste request to ListProvider/getEntityBaseLists', function (done) {
                    const list = listProvider.getEntityBaseLists({ paramsList: [{ listName: 'Police', dataCodeColumn: 'code', dataTextColumn: 'name' }] });
                    list.then(() => {
                        expect(requestSettings.route).toEqual('ListProvider/GetAsEntityBaseLists');
                        done();
                    });
                });
                it('should pass data include paramsList', function (done) {
                    const list = listProvider.getEntityBaseLists({ paramsList: [{ listName: 'Police', dataCodeColumn: 'code', dataTextColumn: 'name' }] });
                    list.then(() => {
                        expect(requestSettings.data).toEqual({ paramsList: [{ listName: 'Police', dataCodeColumn: 'code', dataTextColumn: 'name' }] });
                        done();
                    });
                });
                it('avaliable to add/run over settings', function (done) {
                    const list = listProvider.getEntityBaseLists({ paramsList: [{ listName: 'Police', dataCodeColumn: 'code', dataTextColumn: 'name' }] }, { method: 'GET', abc: 'fff' });
                    list.then(() => {
                        expect(requestSettings.method).toEqual('GET');
                        expect(requestSettings.abc).toEqual('fff');
                        done();
                    });
                });
            });
        });

        describe('getFirstItem - ', function () {

            it('missing require param listName should throw error', function () {
                expect(function () { listProvider.getFirstItem({}); }).toThrow();
            });
            describe('correct params - ', function () {
                it('should creste request to ListProvider/GetList', function (done) {
                    const list = listProvider.getFirstItem({ listName: 'Police' });
                    list.then(() => {
                        expect(requestSettings.route).toEqual('ListProvider/GetFirstItem');
                        done();
                    });
                });
                it('should pass data include listName', function (done) {
                    const list = listProvider.getList({ listName: 'Police' });
                    list.then(() => {
                        expect(requestSettings.data).toEqual({ listName: 'Police' });
                        done();
                    });
                });
                it('avaliable to add/run over settings', function (done) {
                    const list = listProvider.getList({ listName: 'Police' }, { method: 'GET', abc: 'fff' });
                    list.then(() => {
                        expect(requestSettings.method).toEqual('GET');
                        expect(requestSettings.abc).toEqual('fff');
                        done();
                    });
                });
            });
        });
        describe('IsExistItem - ', function () {
            it('missing require param listName should throw error', function () {
                expect(function () { listProvider.IsExistItem({ filters: [{}] }); }).toThrow();
            });
            it('missing require param filters should throw error', function () {
                expect(function () { listProvider.IsExistItem({ listName: 'City' }); }).toThrow();
            });
            describe('correct params - ', function () {
                it('should creste request to ListProvider/GetList', function (done) {
                    const list = listProvider.IsExistItem({ listName: 'Police', filters: [{}] });
                    list.then(() => {
                        expect(requestSettings.route).toEqual('ListProvider/IsExistItem');
                        done();
                    });
                });
                it('should pass data include listName', function (done) {
                    const list = listProvider.IsExistItem({ listName: 'Police', filters: [{}] });
                    list.then(() => {
                        expect(requestSettings.data).toEqual({ listName: 'Police', filters: [{}] });
                        done();
                    });
                });
                it('avaliable to add/run over settings', function (done) {
                    const list = listProvider.IsExistItem({ listName: 'Police', filters: [{}] }, { method: 'GET', abc: 'fff' });
                    list.then(() => {
                        expect(requestSettings.method).toEqual('GET');
                        expect(requestSettings.abc).toEqual('fff');
                        done();
                    });
                });
            });
        });
    });
});
