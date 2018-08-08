define(['common/entities/entityBase',
        'common/utilities/resourceFetcher'
],
 function (entityBase, resourceFetcher) {
     const otherTexts = {
         english: 'other',
         hebrew: 'אחר',
         arabic: 'آخر'
     };     
     const dataCode = -11;
     return new entityBase.ObservableEntityBase({ key: dataCode, value: resourceFetcher.get(otherTexts) });
 });