/// <reference path="../../lib/jasmine-2.0.0/jasmine.js" />
define(['common/utilities/functionalPatterns'], function (functionalPatterns) {
    var exeptionMessages = require('common/resources/exeptionMessages');
    var exceptions = require('common/core/exceptions');

    it('should be defined', function () {
        expect(functionalPatterns).toBeDefined();
    });
    
    describe('once', function () { 
        it('should be defined', function () {
            expect(functionalPatterns.once).toBeDefined();
        });

        it('creatorFunction param is mandatory', function () {
            expect(function () { functionalPatterns.once(); }).toThrow(new exceptions.FormError(exeptionMessages.invalidElementTypeParam));
        });

        it('should return function', function () {
            expect(functionalPatterns.once(function(){})).toEqual(jasmine.any(Function));
        });
        it('should wrap the function that send as parameter', function () {
            var createViewModelSpy = jasmine.createSpy('createViewModel');
            var createViewModel = functionalPatterns.once(createViewModelSpy);
            var param1='param1',param2='param2';
            createViewModel(param1, param2);
            expect(createViewModelSpy).toHaveBeenCalledWith(param1, param2);
        });
        it('should throw error where executing more than one', function () {
            var createViewModel = functionalPatterns.once(jasmine.createSpy('createViewModel'));
            createViewModel();
            expect(function () { createViewModel(); }).toThrow(new exceptions.FormError(exeptionMessages.once));

        });
    });

});