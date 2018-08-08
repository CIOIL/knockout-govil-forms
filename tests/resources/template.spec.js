define(['common/resources/template'],
    function (templateResources) {
        describe('template resources', function () {
            describe('autocomplete', function () {

                it('is define', function () {
                    expect(templateResources.autocomplete).toBeDefined();
                });
                it('.arrowTemplate is define', function () {
                    expect(templateResources.autocomplete.arrowTemplate).toBeDefined();
                });

            });
        });
    });