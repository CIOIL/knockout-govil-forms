
define(['common/components/feedback/feedbackViewModel',
        'common/components/feedback/texts',
        'common/core/feedback'],
    function (feedbackViewModel, texts, feedbackMethods) {
        //todo:   jsdoc
        var readyToRequestPromise = require('common/core/readyToRequestPromise');
        var languageViewModel = require('common/viewModels/languageViewModel');
        var infsMethods = require('common/infrastructureFacade/tfsMethods');
        var feedbackObj, pdfMode;
        var fakeFeedbackURL = 'http:feedback';
        describe('formInformationViewModel', function () {
            beforeAll(function () {
                pdfMode = function () {
                    return false;
                };
                ko.postbox.publish('documentReady');

                spyOn(feedbackMethods, 'getFeedbackUrl').and.returnValue(fakeFeedbackURL);
               
                feedbackObj = feedbackViewModel.createViewModel(pdfMode);
              
            });

            it('should be defined', function () {
                expect(feedbackViewModel).toBeDefined();
            });

            it('url should contain feedback url', function (done) {

                readyToRequestPromise.then()//eslint-disable-line
                    .done(function () {
                        expect(feedbackObj.url()).toEqual(fakeFeedbackURL);
                        done();
                    });
                
            });

            describe('texts', function () {
                beforeEach(function () {
                    spyOn(infsMethods, 'setFormLanguage');
                    languageViewModel.language('hebrew');
                });
                it('feedback', function () {
                    expect(feedbackObj.texts().feedback).toEqual(texts.hebrew.feedback);
                });
                it('fillIn', function () {
                    expect(feedbackObj.texts().fillIn).toEqual(texts.hebrew.fillIn);
                });
                it('title', function () {
                    expect(feedbackObj.texts().title).toEqual(texts.hebrew.title);
                });
                it('content', function () {
                    expect(feedbackObj.texts().content).toEqual(texts.hebrew.content);
                });
            });
        });

    });