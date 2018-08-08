/*globals AgatAttachment*/
/** module that holds utility functions for attachments. 
 * providing information and giving access to elements auto-created by the infrastructure.
 * </br> 
 * infrastructure attachment:
 * </br>
 * <ul>
 *  <li>div class="attachment-wrapper"<b>wrapper element - </b> </li>
 *  <ul>
 *      <li> div class="attachment-inner"</li>
 *      <ul>
 *          <li>a onclick="return (AgatAttachment.openFileDialog(this, event));" title="לחץ להוספת קובץ" href="http://localhost/AGFormSite/#"</li>
 *          <ul>
 *              <li><b>your input</b> input tabindex="-1" id="attachment" class="tfsInputText" style="DIRECTION: rtl" tfsextensions="*.gif;*.bmp" placeholder="לחץ להוספת קובץ" tfsname="מסמכים בכרטיסית אנשי קשר" tfsdatatype="attachment" tfsdata="" tfsuploaded="false"</li>
 *              <li><b>img</b> img title="הוסף צרופה" alt="הוסף צרופה" src="attachmentImg" tfsaction="addAttachment" tfssrc="attachEmpty.gif"</li>
 *          </ul>
 *      </ul>
 *      <li>input onchange="AgatAttachment.handleChange(this);" id="_form_attachment" class="attachment" oncontextmenu="return false;" type="file"<b>cover element</b></li>
 *  </ul>
 * </ul>
@module attachmentMethods  
*/

define(['common/core/exceptions',
'common/resources/exeptionMessages',
'common/utilities/stringExtension',
'common/resources/tfsAttributes',
'common/resources/infrastructureEnums'
],
    function (exceptions, exceptionsMessages, stringExtension, tfsAttributes, infrastructureEnums) // eslint-disable-line max-params 
    {
        /* eslint-disable consistent-return */
        function throwInvalidElementTypeException() {
            exceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', infrastructureEnums.dataTypes.attachment));
        }

        function throwUndefinedElementException(paramName) {
            exceptions.throwFormError(stringExtension.format(exceptionsMessages.undefinedParam, paramName));
        }

        var resources = {
            dataAttributes: {
                backUpFilename: 'backUpNewfilename',
                backUpFsize: 'backUpFsize'
            },
            actions: {
                displayAttachment: 'displayAttachment',
                addAttachment: 'addAttachment'
            },
            types: {
                file: 'file'
            },
            attributes: {
                readonly: 'readonly',
                _title: '_title',
                title: 'title',
                type: 'type',
                placeholder: 'placeholder'
            },
            mobileDefaults: {
                maxfilesize: '5120',
                extensions: ['*.jpeg', '*.jpg', '*.gif', '*.png']
            }
        };

        var texts = {
            hebrew: {
                addAttachment: 'בחר קובץ',
                displayAttachment: 'שם קובץ: {0}'
            },
            arabic: {
                addAttachment: 'حدد ملف',
                displayAttachment: 'فلنام: {0}'
            },
            english: {
                addAttachment: 'select file',
                displayAttachment: 'file name:{0}'
            }
        };

        var isExist = function isExist(element) {
            return ($(element) && $(element).length);
        };

        var getCover = function getCoverElement(element) {
            return $(element).closest('.' + infrastructureEnums.classes.attachmentWrapper).find('.' + infrastructureEnums.dataTypes.attachment);
        };

        var innerIsAttachment = function innerIsAttachment(element) {
            if ($(element).attr(tfsAttributes.TFSDATATYPE) === infrastructureEnums.dataTypes.attachment
            && getCover(element).length > 0) {
                return true;
            }
            return false;
        };

        var isAttachment = function isAttachment(element) {
            if (isExist(element)) {
                if (innerIsAttachment(element)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                throwUndefinedElementException('element');
            }
        };

        var globalFunction = function globalFunction(callback, param) {
            if (isExist(param)) {
                if (innerIsAttachment(param)) {
                    return callback(param);
                }
                else {
                    throwInvalidElementTypeException();
                }
            }
            else {
                throwUndefinedElementException('element');
            }
        };

        var getAttachmentIndexInTable = function getAttachmentIndexInTable(element) {
            var innerGetAttachmentIndexInTable = function (element) {
                var table = $(element).closest('table[' + tfsAttributes.TFSDATA + ']');
                var allAttachmentInTable = table.find('input[' + tfsAttributes.TFSDATATYPE + '=' + infrastructureEnums.dataTypes.attachment + ']');
                return allAttachmentInTable.index(element);
            };
            return globalFunction(innerGetAttachmentIndexInTable, element);
        };

        var getCoverElement = function getCoverElement(element) {
            var innerGetCover = function (element) {
                var cover = getCover(element);
                if (cover.length > 0) {
                    return cover;
                }
                else {
                    throwInvalidElementTypeException();
                }
            };
            return globalFunction(innerGetCover, element);
        };

        var getWrapperElement = function getWrapperElement(element) {
            var getWrapper = function getWrapper(element) {
                var wrapper = $(element).closest('.' + infrastructureEnums.classes.attachmentWrapper);
                if (wrapper.length > 0) {
                    return wrapper;
                }
                else {
                    throwInvalidElementTypeException();
                }
            };
            return globalFunction(getWrapper, element);
        };

        var getLinkElement = function getLinkElement(element) {
            var getLink = function getLink(element) {
                var wrapper = $(element).closest('.attachment-inner');
                var link;
                if (wrapper.length > 0) {
                    link = wrapper.find('a');
                }
                if (link.length > 0) {
                    return link;
                }
                else {
                    throwInvalidElementTypeException();
                }
            };
            return globalFunction(getLink, element);
        };

        var isAttachmentInTable = function isAttachmentInTable(element) {
            var isInTable = function (element) {
                return $(element).attr(tfsAttributes.TFSROWDATA) !== undefined;
            };
            return globalFunction(isInTable, element);
        };

        var getAgatDataAttributes = function () {
            if (AgatAttachment) {
                return AgatAttachment.dataAttributes;
            }
        };

        var getAttachmentsUniqueNames = function getAttachmentsUniqueNames(element, isTable) {

            isTable = isTable && isTable.toString().toLowerCase() === 'true';

            var isAttachmentsTable = function () {
                return element.find('input[' + tfsAttributes.TFSDATATYPE + '=' + infrastructureEnums.dataTypes.attachment + ']').length > 0;
            };

            var getTableAttachmentsUniqueNames = function () {
                if (isAttachmentsTable()) {
                    return element.data(getAgatDataAttributes().filename.dynamictable) || [];
                }
                else {
                    exceptions.throwFormError(stringExtension.format(exceptionsMessages.invalidElementTypeParam, 'element', 'table of attachments element'));
                }
            };

            var getInputAttachmentUniqueName = function () {
                if (isAttachment(element)) {
                    return element.data(getAgatDataAttributes().filename.elementAttribute) || '';
                }
                else {
                    throwInvalidElementTypeException();
                }
            };

            if (isExist(element)) {
                if (isTable) {
                    return getTableAttachmentsUniqueNames();
                }
                return getInputAttachmentUniqueName();
            }
            else {
                throwUndefinedElementException('element');
            }
        };

        var getFileSizeAttr = function getFileSizeAttr(element, isTable) {
            if (isExist(element)) {
                if (isTable) {
                    return $(element).data(getAgatDataAttributes().fileSizeAttr.dynamictable);
                }
                return $(element).data(getAgatDataAttributes().fileSizeAttr.elementAttribute);
            }
            else {
                throwUndefinedElementException('element');
            }
        };

        var getClosestTable = function getClosestTable(element) {
            var innerGetClosestTable = function (element) {
                return ($(element).closest('table[' + tfsAttributes.TFSDATA + ']'));
            };
            return globalFunction(innerGetClosestTable, element);
        };

        var getExtensions = function getExtensions(element) {
            var innerGetExtensions = function (element) {
                return ($(element).attr(tfsAttributes.TFSEXTENSIONS));
            };
            return globalFunction(innerGetExtensions, element);
        };

        var hasImgTFSAction = function hasImgTFSAction(element) {
            var innerHasImgTFSAction = function (element) {
                return $(element).next().attr(tfsAttributes.TFSACTION) !== undefined;
            };
            return globalFunction(innerHasImgTFSAction, element);
        };

        var getImg = function getImg(element) {
            var innerGetImg = function (element) {
                return $(element).next();
            };
            return globalFunction(innerGetImg, element);
        };


        var getLabelElement = function getLabelElement(element) {
            var noLabelFound = 'no label element has been found for "{0}"';
            var getLabel = function getLabel(element) {
                var label = $(element).closest('div[class^="col-"]').find('label');
                if (label.length > 0) {
                    return label.get(0);
                }
                else {
                    if (console) {
                        /*eslint no-console: ["error", { allow: ["warn"] }] */
                        console.warn(noLabelFound);
                    }
                }
            };
            return globalFunction(getLabel, element);

        };

        /* eslint-enable consistent-return */
        return {
            /**
            * @public
            * @function <b>getWrapperElement</b>
            * @description Get the created infrastructure wrapper input of attachment element
            * @param {object} element jQuery input element //your input element
            * @returns {object} created infrastructure wrapper input of attachment element as jQuery element
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists
            */
            getWrapperElement: getWrapperElement,
            /**
            * @public
            * @function <b>getLinkElement</b>
            * @description Get the created infrastructure a element input of attachment element
            * @param {object} element jQuery input element //your input element
            * @returns {object} created infrastructure wrapper input of attachment element as jQuery element
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists
            */
            getLinkElement: getLinkElement,
            /**
            * @public
            * @function <b>getCoverElement</b>
            * @description Get the <a> element that wraps the attachment input.
            * @param {object} element jQuery input element //your input element
            * @returns {object} the <a> element that wraps the attachment input
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists
           */
            getCoverElement: getCoverElement,
            /**
           * @public
           * @function <b>getLabelElement</b>
           * @description Get the label element that's pushed aside by infrastructure elements
           * @param {object} element jQuery input element //your input element
           * @returns {object} label element
           * @throws {FormError} element not valid attachment
           * @throws {FormError} element not exists
          */
            getLabelElement: getLabelElement,
            /**
            * @public
            * @function <b>isAttachment</b>
            * @description return element is infrastructure attachment of attachment element
            * @param {object} element jQuery input element  //your input element
            * @returns {bool} is infrastructure input of attachment element
            * @throws {FormError} element not exists
            */
            isAttachment: isAttachment,
            /**
            * @public
            * @function <b>isAttachmentInTable</b>
            * @description return element is attachment in table
            * @param {object} element jQuery input element //your input element
            * @returns {bool} is attachment in table
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists
            */
            isAttachmentInTable: isAttachmentInTable,
            /**
            * @public
            * @function <b>getAttachmentIndexInTable</b>
            * @description Get the index of attachment in table 
            * @param {object} element jQuery input element //your input element
            * @returns {number} index of attachment in table 
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists
            */
            getAttachmentIndexInTable: getAttachmentIndexInTable,
            /**
            * @public
            * @function <b>getAttachmentsUniqueNames</b>
            * @description Get the unique name(s) of attachment(s) from the saved attribute on the table element/attachment input
            * @param {object} element jQuery element //your input element or table of attachments
            * @param {boolean} isTable the method refer to names of table attachments or single attachment input 
            * @returns {object} array of unique names or single string name (depending on isTable param)// ['attachment1', 'attachment2']- isTable = true||'attachment1' -isTable =false
            * @throws {FormError} element not exists
            */
            getAttachmentsUniqueNames: getAttachmentsUniqueNames,
            /**
            * @public
            * @function <b>getFileSizeAttr</b>
            * @description Get the size attribute of attachment(s) from the saved attribute on the table element/attachment input
            * @param {object} element jQuery element //your input element or table of attachments
            * @param {boolean} isTable the method refer to sizes of table attachments or single attachment input 
            * @returns {object} array of sizes or single size (depending on isTable param)//['123', '456', '789']- isTable = true||'123'-isTable =false
            * @throws {FormError} element not exists
            */
            getFileSizeAttr: getFileSizeAttr,
            /**
           * @public
           * @function <b>getAgatDataAttributes</b>
           * @description Get the dataAttributes of AgatAttachment - infrastructure object
           * @returns {object} object of dataAttributes
           */
            getAgatDataAttributes: getAgatDataAttributes,
            /**
            * @public
            * @function <b>getClosestTable</b>
            * @description Get the closest table of attachment. 
            * @param {object} element jQuery input element //your input element
            * @returns {object} closest table of attachment as jQuery element
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists
            */
            getClosestTable: getClosestTable,
            /**
            * @public
            * @function <b>getExtensions</b>
            * @description Get tfsExtensions of attachment element. 
            * @param {object} element jQuery input element //your input element
            * @returns {string} tfsExtensions of attachment element.//'*.gif;*.bmp'
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists
            */
            getExtensions: getExtensions,
            /**
            * @public
            * @function <b>hasImgTFSAction</b>
            * @description return if created infrastructure img of attachment element 
            * @param {object} element jQuery input element  //your input element
            * @returns {bool} is created infrastructure img of attachment element
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists 
            */
            hasImgTFSAction: hasImgTFSAction,
            /**
            * @public
            * @function <b>getImg</b>
            * @description Get the created infrastructure img of attachment element
            * @param {object} element jQuery input element //your input element
            * @returns {object} created infrastructure img of attachment element as jQuery element
            * @throws {FormError} element not valid attachment
            * @throws {FormError} element not exists
            */
            getImg: getImg,
            /**
            * object <b>resources</b>
            * @description object for attachment resoures
            */
            resources: resources,
            /**
            * object <b>texts</b>
            * @description object for attachment texts
            */
            texts: texts
        };

    });


