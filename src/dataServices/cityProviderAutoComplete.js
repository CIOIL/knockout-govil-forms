/** 
  @description module that provide the city list Only one instance for a form 
  @module cityProvider
 */
define(['common/dataServices/listProvider',
        'common/components/dialog/dialog',
         'common/utilities/resourceFetcher',
         'common/resources/texts/indicators'
], function (listProvider, dialog, resourceFetcher, indicatorsTexts) {//eslint-disable-line max-params

    const cityList = ko.observableArray();

    const listParams = {
        listName: 'City',
        dataTextColumn: 'city_name_he',
        dataCodeColumn: 'city_code'
    };

    const request = listProvider.getEntityBase(listParams);
    request.then((response) => {
        cityList(response.Data.List);
    }).fail((error) => {//eslint-disable-line
        dialog.alert({ message: resourceFetcher.get(indicatorsTexts.errors).callServiceError });//eslint-disable-line

    });
    return {
        /** 
        * @property cityList -
        * @description list of cities 
        */
        cityList

    };
});