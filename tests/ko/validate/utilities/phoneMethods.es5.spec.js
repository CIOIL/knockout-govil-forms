define(['common/ko/validate/koValidationSpecMatchers', 'common/external/q', 'common/ko/validate/utilities/phoneMethods', 'common/networking/services'], function (matchers, Q, phoneMethods, services) {
    //eslint-disable-line max-params

    describe('loadLists', function () {
        var areaCodesPromise;
        var areaCodes = '[{"RowNumber":1,"id":"1","AreaCode":"02","Type":"1"},{"RowNumber":2,"id":"2","AreaCode":"03","Type":"1"},{"RowNumber":3,"id":"3","AreaCode":"04","Type":"1"},{"RowNumber":4,"id":"4","AreaCode":"050","Type":"2"},{"RowNumber":5,"id":"5","AreaCode":"053","Type":"2"},{"RowNumber":6,"id":"6","AreaCode":"052","Type":"2"},{"RowNumber":7,"id":"8","AreaCode":"054","Type":"2"},{"RowNumber":8,"id":"9","AreaCode":"055","Type":"2"},{"RowNumber":9,"id":"11","AreaCode":"057","Type":"2"},{"RowNumber":10,"id":"12","AreaCode":"058","Type":"2"},{"RowNumber":11,"id":"13","AreaCode":"059","Type":"2"},{"RowNumber":12,"id":"18","AreaCode":"072","Type":"1"},{"RowNumber":13,"id":"19","AreaCode":"073","Type":"1"},{"RowNumber":14,"id":"20","AreaCode":"074","Type":"1"},{"RowNumber":15,"id":"21","AreaCode":"076","Type":"1"},{"RowNumber":16,"id":"22","AreaCode":"077","Type":"1"},{"RowNumber":17,"id":"23","AreaCode":"078","Type":"1"},{"RowNumber":18,"id":"24","AreaCode":"08","Type":"1"},{"RowNumber":19,"id":"25","AreaCode":"09","Type":"1"},{"RowNumber":20,"id":"26","AreaCode":"153","Type":"1"},{"RowNumber":21,"id":"27","AreaCode":"159","Type":"1"},{"RowNumber":22,"id":"28","AreaCode":"170","Type":"1"},{"RowNumber":23,"id":"29","AreaCode":"180","Type":"1"},{"RowNumber":24,"id":"30","AreaCode":"190","Type":"1"},{"RowNumber":25,"id":"31","AreaCode":"056","Type":"2"}]'; //eslint-disable-line quotes
        function fakedLoadLists() {
            return Q.fcall(function () {
                return JSON.parse(areaCodes);
            });
        }

        //function fakedFailLoadLists() {
        //    return Q.fcall(function () {
        //        throw new Error('Cant do it');
        //    });
        //}

        beforeAll(function () {
            //eslint-disable-line no-undef
            ko.postbox.publish('documentReady');
            jasmine.addMatchers(matchers);
        });
        describe('return value', function () {
            describe('resolvePromise', function () {
                beforeEach(function () {
                    spyOn(services, 'govServiceListRequest').and.callFake(fakedLoadLists);
                    areaCodesPromise = phoneMethods.loadLists();
                });

                it('result data', function (done) {
                    areaCodesPromise.then(function (data) {
                        expect(Array.isArray(data)).toBeTruthy();
                        done();
                    });
                });
            });
        });
    });
});