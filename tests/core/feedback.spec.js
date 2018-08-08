define(['common/resources/exeptionMessages', 'common/utilities/stringExtension', 'common/core/generalAttributes', 'common/resources/domains', 'common/core/feedback'],
    function (exeptionMessages, stringExtension, generalAttributesManager, domains, feedback) { //eslint-disable-line max-params

        describe('feedback', function () {
            describe('getFeedbackUrl', function () {

                var serveyParams = '?param1=moital&param2=dc5@moital.gov.il&param3=2';

                beforeEach(function () {
                    spyOn(generalAttributesManager, 'get').and.returnValue('dc5@moital.gov.il');
                    spyOn(generalAttributesManager, 'getOfficeName').and.returnValue('moital');
                });

                it('should be defined', function () {
                    expect(feedback.getFeedbackUrl).toBeDefined();
                });

                it('should return production servey url in production form', function () {
                    spyOn(generalAttributesManager, 'getTargetServerName').and.returnValue('production');
                    var url = feedback.getFeedbackUrl(generalAttributesManager);
                    expect(url).toEqual(domains.govFeedbackSurveys['production'] + serveyParams);
                });

                it('should open default servey when not in production form', function () {
                    spyOn(generalAttributesManager, 'getTargetServerName').and.returnValue('test');
                    var url = feedback.getFeedbackUrl(generalAttributesManager);
                    expect(url).toEqual(domains.govFeedbackSurveys['default'] + serveyParams);
                });

                it('should throw if no parameters are sent', function () {
                    spyOn(generalAttributesManager, 'getTargetServerName').and.returnValue('test');
                    expect(function () {
                        feedback.getFeedbackUrl();
                    }).toThrowError(stringExtension.format(exeptionMessages.funcInvalidParams, 'getFeedbackUrl'));
                });

                it('should throw if empty object parameter is sent', function () {
                    spyOn(generalAttributesManager, 'getTargetServerName').and.returnValue('test');
                    expect(function () {
                        feedback.getFeedbackUrl({});
                    }).toThrowError(stringExtension.format(exeptionMessages.funcInvalidParams, 'getFeedbackUrl'));
                });

                it('should throw if none object parameter is sent', function () {
                    spyOn(generalAttributesManager, 'getTargetServerName').and.returnValue('test');
                    expect(function () {
                        feedback.getFeedbackUrl('some text');
                    }).toThrowError(stringExtension.format(exeptionMessages.funcInvalidParams, 'getFeedbackUrl'));
                });

            });
        });

        
    });

define('spec/feedbackSpec.js', function () { });