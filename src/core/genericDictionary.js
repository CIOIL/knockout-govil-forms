/** Data structure for storing,retreiving and checking the existance of key-value pairs in a dictionary  
 * @module genericDictionary
 */

define(['common/utilities/conversion']
    , function (conversionMethods) {

        var applyCase = function (key) {
            return ($.type(key) === 'string' && this.lowercase) ? key.toLowerCase() : key;
        };


        /**  
         * @class Dictionary 
         * @param {object} startValues - the initial values of the dictionary
         * */
        function Dictionary(startValues) {
            this.values = startValues || {};
            this.lowercase = false;
        }

        /** Stores the specified key and value in the dictionary   
        * @method store
        * @param {string} key -  the key underwhich the value is stored
        * @param {string} value -  the value that is associated with the specified key, undefined if the key doesn't exist   
        * @returns {object} the updated dictionary
        * @example Example usage of store.
        * var dictionary = new Dictionary();
        * dictionary.store('game', 'football');
        */
        Dictionary.prototype.store = function (key, value) {

            this.values[applyCase.call(this, key)] = value;

            return this;
        };

        /** Gets the value associated with the specified key  
        * @method get
        * @param {string} key - the key of the value to get.  
        * @returns {string} the value which is associated with the given key  
        * @example Example usage of get with lowercase option.
        * var dictionary = new Dictionary();
        * dictionary.lowercase = true;
        * dictionary.store('Game', 'football');
        * dictionary.get('game'); //Returns 'football'
        */
        Dictionary.prototype.get = function (key) {
            return this.values[applyCase.call(this, key)];
        };

        /** Determines wether the dictionary has an entry for the specified key 
        * @method contains
        * @param {string} key -  the key to search in the dictionary.  
        * @returns {boolean} true if there is an entry in the dictionary for the specified key, false otherwise.
        */
        Dictionary.prototype.contains = function (key) {
            return Object.prototype.hasOwnProperty.call(this.values, applyCase.call(this, key)) &&
              Object.prototype.propertyIsEnumerable.call(this.values, applyCase.call(this, key));
        };

        /** populate the dictionary with keys and corresponding values  
       * @method populateFromKeyValuePairs
       * @param {string} keyValuePairs -  The input keys and their corresponding values in format like "key1:value1;key2:value2". 
       *                                  The separator between the key and the value (i.e. the delimiter within each pair) must be ":".
       * @param {string} delimiter - the delimiter between the pairs  
       * @returns {Dictionary} - the popualted dictionary (for chaining).
       */
        Dictionary.prototype.populateFromKeyValuePairs = function (keyValuePairs, delimiter) {
            var attributes = conversionMethods.keyValuePairsToObject(keyValuePairs, delimiter);
            for (var key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    this.store(applyCase.call(this, key), attributes[key]);
                }
            }
            return this;
        };

        return {
            Dictionary: Dictionary
        };

    });
