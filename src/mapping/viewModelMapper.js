/**
 * @module viewModelMapper
 */
/// <reference path='../external/xml2json.js' />
define(['common/external/xml2json',
        'common/utilities/reflection',
        'common/mapping/metaDataBinder'
], function (xml2json, reflection) {

    var convertXml2Json = function (textXml) {
        var x2js = new xml2json();
        var jsonObject = x2js.xml_str2json(textXml);
        if (jsonObject && jsonObject.root) {
            return jsonObject.root;
        }
        return jsonObject;
    };

    var getText = function (obj) {//eslint-disable-line complexity
        if (obj) {
            if (typeof (obj) === 'string') {
                return obj;
            }
            if (obj.__text) {
                return obj.__text;
            }
            if (obj['_xsi:nil']) {
                return undefined;
            }
        }
        return undefined;
    };

    var getFileName = function (obj) {
        if (obj && (obj._fileName || obj._filename)) {
            return obj._fileName ? obj._fileName : obj._filename;
        }
        return undefined;
    };

    var isEmpty = function (obj) {
        return getText(obj) ? false : true;
    };

    var getNodeByKey = function (obj, key) {//eslint-disable-line complexity ,consistent-return
        if (typeof (obj) === 'object') {
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (property === key) {//eslint-disable-line max-depth
                        return obj[property];
                    }
                    else {
                        var foundObj = getNodeByKey(obj[property], key);
                        if (foundObj) {//eslint-disable-line max-depth
                            return foundObj;
                        }
                    }
                }
            }
        }
        else { return undefined; }
    };

    var getListByKey = function (obj, key) {
        var node = getNodeByKey(obj, key);
        if (node) {
            if (Array.isArray(node)) {
                return node;
            }
            else { return [node]; }
        }
        return undefined;
    };

    var findFirstFullObject = function (obj, keys) {
        var result;
        keys.some(function (key) {
            result = getNodeByKey(obj, key);
            return (!isEmpty(result) && typeof (result) !== 'object');
        });
        return result;
    };

    var isObservableArray = function (property) {
        return ko.isObservable(property) && Array.isArray(ko.unwrap(property));
    };

    var isNotIgnoreProperty = function (property) {
        if (property.config && property.config.ignoreMap) {
            return !(ko.unwrap(property.config.ignoreMap));
        }
        return true;
    };

    var mappingEngine = function () {
        var mapLookUp = function (source, destination) {
            var firstFullObject = getNodeByKey(source, destination.boundElementsTag[0].replace('select:', ''));
            if (firstFullObject) {
                destination.dataCode(getText(firstFullObject) || '');
                destination.dataText(firstFullObject._text || '');
            }
        };

        var mapValue = function (source, destination) {
            var firstFullObject = findFirstFullObject(source, destination.boundElementsTag);
            if (firstFullObject) {
                destination(getText(firstFullObject));
            }
        };

        var mapBoolian = function (source, destination) {
            var firstFullObject = getNodeByKey(source, destination.boundElementsTag[0].replace('checkbox:', ''));
            if (firstFullObject) {
                var boolValue = getText(firstFullObject) === 'true' ? true : false;
                destination(boolValue);
            }
        };

        var mapAttachment = function (source, destination) {
            var firstFullObject = getNodeByKey(source, destination.boundElementsTag[0].replace('attachment:', ''));
            if (firstFullObject) {
                destination(getFileName(firstFullObject));
            }
        };

        var createDefaultRow = function (table) {
            var type = table.config && table.config.type ? table.config.type : undefined;
            var params = table.config && table.config.params ? table.config.params : undefined;
            var newRow = type ? new type(params) : undefined;
            return newRow;
        };

        var createNewRow = function (table, mappingRule) {
            var newRow;
            if (mappingRule) {
                newRow = mappingRule.create({ data: {} });
            }
            else {
                newRow = createDefaultRow(table);
            }

            table.push(newRow);

        };

        var completeArrayBySourceData = function (itemsList, targetArray, mappingRule) {
            targetArray([]);
            itemsList.forEach(function () {
                createNewRow(targetArray, mappingRule);
            });
        };

        var setMapped = function (obj, mapped) {
            if (obj.mapped) {
                obj.mapped = mapped;
            }
            else {
                Object.defineProperty(obj, 'mapped', {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: mapped
                });
            }
        };

        var mapArray = function (source, destination, mapSettings) {
            var getMappingRuleByName = function (mapSettings) {
                return mapSettings && mapSettings.mappingRules ? mapSettings.mappingRules[mapSettings.mappingRuleName] : undefined;
            };

            var getMappingRuleForPermeation = function (mapSettings) {
                return (mapSettings && mapSettings.mappingRules && mapSettings.mappingRules.forPermeation) ? mapSettings.mappingRules : undefined;
            };

            var itemsList = getListByKey(source, destination.boundElementsTag[0]);

            if (itemsList) {
                completeArrayBySourceData(itemsList, destination, getMappingRuleByName(mapSettings));

                itemsList.forEach(function (item, index) {
                    mappingEngine.map(item, destination()[index], getMappingRuleForPermeation(mapSettings));
                });

                setMapped(destination, true);
            }
            else { setMapped(destination, false); }
        };

        var mapModelArrayByMapSettings = function (source, destination, mappingRules) {

            var getMappingRules = function (destination, mappingRules) {
                if (mappingRules) {
                    mappingRules.forPermeation = true;
                    return mappingRules;
                }
                return typeof (destination.getMappingRules) === 'function' ? destination.getMappingRules() : undefined;
            };

            mappingRules = getMappingRules(destination, mappingRules);

            if (mappingRules) {
                for (var property in mappingRules) {
                    if (mappingRules.hasOwnProperty(property) && isObservableArray(destination[property]) && destination[property].boundElementsTag && isNotIgnoreProperty(destination[property])) {
                        var mapSettings = { mappingRules: mappingRules, mappingRuleName: property };
                        mapArray(source, destination[property], mapSettings);
                    }
                }
            }
        };

        var deepMap = function (source, destination, mapSettings) {
            for (var property in destination) {
                if (destination.hasOwnProperty(property)) {
                    mappingEngine.map(source, destination[property], mapSettings);
                }
            }
        };

        var mapModel = function (source, destination, mappingRules) {
            mapModelArrayByMapSettings(source, destination, mappingRules);
            deepMap(source, destination.getModel(), mappingRules);
        };

        var mapPrimitiveArray = function (source, destination) {
            var rows = getListByKey(source, destination.boundElementsTag[0]);
            if (rows) {
                rows.forEach(function (row) {
                    for (var key in row) {
                        if (row.hasOwnProperty(key)) {
                            destination.push(row[key]);
                        }
                    }
                });
            }
        };

        function compareMappings(a, b) {
            var highPriority = -1;
            var lowPriority = 1;
            if (a.priority < b.priority) {
                return highPriority;
            }
            if (a.priority > b.priority) {
                return lowPriority;
            }
            return 0;
        }

        var mappings = [];

        var setMappings = function () {
            for (var type in mappingTypes) {//eslint-disable-line no-use-before-define
                if (mappingTypes.base.isPrototypeOf(mappingTypes[type])) {//eslint-disable-line no-use-before-define
                    mappings.push(mappingTypes[type]);//eslint-disable-line no-use-before-define
                }
            }
        };

        var map = function (source, destination, mapSettings) {
            if (mappings.length === 0) {
                setMappings();
            }

            var sortedMappings = mappings.sort(compareMappings);

            sortedMappings.some(function (mappingType) {
                if (mappingType.condition(destination)) {
                    mappingType.map(source, destination, mapSettings);
                    return true;
                }
                return false;
            });

        };

        return {
            mapLookUp: mapLookUp,
            mapValue: mapValue,
            mapBoolian: mapBoolian,
            mapAttachment:mapAttachment,
            mapModel: mapModel,
            mapPrimitiveArray: mapPrimitiveArray,
            mapArray: mapArray,
            map: map,
            setMappings: setMappings
        };
    }();

    var mappingTypes = function () {

        var isSpecialType = function (obj, type) {

            var getBoundElementsTag = function (obj) {
                if (obj) {
                    if (typeof (obj.boundElementsTag) === 'string') {
                        return obj.boundElementsTag;
                    }
                    if (Array.isArray(obj.boundElementsTag)) {
                        return obj.boundElementsTag[0];
                    }
                }
                return undefined;
            };

            var boundElement = getBoundElementsTag(obj);
            //console.log(boundElement);
            var notFoundIndex = -1;
            if (boundElement) {
                return (boundElement.indexOf(type) > notFoundIndex);
            }

            return false;
        };

        var typesSimbols = { lookUp: 'select:', attachment: 'attachment:', checkBox: 'checkbox:' };

        var base = {
            condition: function () { throw new Error('not implemented'); },
            map: function () { throw new Error('not implemented'); },
            priority: function () { throw new Error('not implemented'); }
        };


        var lookUp = reflection.extend(Object.create(base), {
            condition: function (property) {
                return isSpecialType(property, typesSimbols.lookUp);
            },
            map: function (source, destination) {
                return mappingEngine.mapLookUp(source, destination);
            },
            priority: 100
        });

        var checkBox = reflection.extend(Object.create(base), {
            condition: function (property) {
                return isSpecialType(property, typesSimbols.checkBox) && isNotIgnoreProperty(property);
            },
            map: function (source, destination) {
                return mappingEngine.mapBoolian(source, destination);
            },
            priority: 100
        });

        var attachment = reflection.extend(Object.create(base), {
            condition: function (property) {
                return isSpecialType(property, typesSimbols.attachment) && isNotIgnoreProperty(property);
            },
            map: function (source, destination) {
                return mappingEngine.mapAttachment(source, destination);
            },
            priority: 100
        });

        var observable = reflection.extend(Object.create(base), {
            condition: function (property) {
                return ko.isObservable(property)
                    && !isObservableArray(property)
                    && property.boundElementsTag
                    && isNotIgnoreProperty(property);
            },
            map: function (source, destination) {
                return mappingEngine.mapValue(source, destination);
            },
            priority: 200
        });

        var observableArray = reflection.extend(Object.create(base), {
            condition: function (property) {
                return isObservableArray(property)
                    && property.boundElementsTag
                    && !property.mapped && property.config
                    && property.config.type
                    && isNotIgnoreProperty(property);
            },
            map: function (source, destination, mapSettings) {
                return mappingEngine.mapArray(source, destination, mapSettings);
            },
            priority: 400
        });

        var primitiveArray = reflection.extend(Object.create(base), {
            condition: function (property) {
                return isObservableArray(property)
                    && property.boundElementsTag
                    && !property.mapped
                    && (!property.config || (property.config && !property.config.type))
                    && isNotIgnoreProperty(property);
            },
            map: function (source, destination) {
                return mappingEngine.mapPrimitiveArray(source, destination);
            },
            priority: 500
        });

        var model = reflection.extend(Object.create(base), {
            condition: function (property) {
                return typeof property === 'object'
                    && typeof property.getModel === 'function'
                    && typeof property.getModel() === 'object';
            },
            map: function (source, destination, mapSettings) {
                return mappingEngine.mapModel(source, destination, mapSettings);
            },
            priority: 300
        });

        return {
            base: base,
            lookUp: lookUp,
            checkBox: checkBox,
            attachment:attachment,
            observable: observable,
            observableArray: observableArray,
            primitiveArray: primitiveArray,
            model: model
        };
    }();
    
    var mapXmlToViewModel = function (textXml, viewModel, mapSettings) {
        var mapObject = convertXml2Json(textXml);
        return mappingEngine.map(mapObject, viewModel, mapSettings);
    };

    var register = function (name, map) {
        mappingTypes[name] = reflection.extend(Object.create(mappingTypes.base), map);
        mappingEngine.setMappings();
    };

    return {
        /**
         * @function <b> mapXmlToViewModel </b>
         * @description mapping xml data to viewModel by model properties metaData, There is an option to set on a spesipic observable :config({mapIgnore:boolian value or computed}), For that mapping ignore him.
         * @param {string} textXml - xml mapping source
         * @param {object | ko.observable | ko.observablearray} viewModel - mapping target model
         * @param {object} mapSettings - optional param, mapping settings - match common2 template
         * @example 
         * var xml = getXml();
         * viewModelMapper.mapXmlToViewModel(xml, viewModel);
         */
        mapXmlToViewModel: mapXmlToViewModel,

        /**
         * @function <b> register </b>
         * @description register new mapping type
         * @param {string} name - mapping type name
         * @param {object} map - Object contains the following parameters:
         * condition - Condition for apply mapping on the target object was sent
         * priority - One object can answer some conditions, this parameter determines the priority of the conditions
         * map - new mapping function
         * @example 
         * var viewMdel = (function () {
         *    var model = {
         *        firstName: ko.observable().config({ newMappingRule: true })
         *    };
         *
         *    this.getModel = function () {
         *        return model;
         *    }
         *
         *});
         * var var newMappingType = {
         *      condition: function (property) {
         *          return property.config.newMappingRule;
         *      },
         *      map: function (source, destination) {
         *          return destination('new');
         *      },
         *      priority: 100
         *  };
         *  mapXmlToViewModel.register("newMap",newMappingType);
         */
        register: register,

        utilities: {
         /**
         * @function <b> mapArray </b>
         * @description map json to observableArray after applyBindings
         * @param {object} source - contains json object that converted from xml form
         * @param {ko.observablearray} destination - destination of the mapping
         * @param {object} mapSettings - optional param,
         * Object contains the following parameters:
         * mappingRuleName - name of the observablearray
         * mappingRules - contains settings of observablearray mapping
         * @example 
         *  {
         *      mappingRuleName: "personsList",
         *      mappingRules: {
         *          personsList: {
         *              create: function (item) {
         *                  var person = new person({ fName: 'dani', lName: 'aviv' });
         *                  ko.mapping.fromJS(item.data, mappingRule, newDataModel);
         *                  return person;
         *              }
         *          }
         *      }
         *  }
         */
            mapArray: mappingEngine.mapArray
        }
    };
});

