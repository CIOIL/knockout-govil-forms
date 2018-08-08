define([],
    function () {
        
        class PersonClass {
            constructor(name) {  this.name = name;    }
            sayName() {return this.name; }
            static create(name) {
                return new PersonClass(name);
            }

        }
        
        class Rectangle {
            constructor(length, width) {
                this.length = length;
                this.width = width;
            }
            getArea() { return this.length * this.width; }
        }

        class Square extends Rectangle {
            constructor(length) {
                // same as Rectangle.call(this, length, length)
                super(length, length);
            }
        }

        const person = new PersonClass('Avi');
        const square = new Square(3);
        const name = 'Yael';
        const age = 25;
        const templateLiteralsWithParams = `hey ${name}`;
        const templateLiteralsWithUndeclaredVariables = function  (){
            return `there ara ${daysNumber} days in this month`;//eslint-disable-line
        };
        let multilineTemplateLiterals = `Hello
            world`,
            count = 10,
            price = 0.25,
            templateLiteralsWithExprresion =  `${count} items cost ${(count * price).toFixed(2)}.`;

        function getPersonParams (name1 = name, age1 = age) {
            return `name: ${name1}, age: ${age1}`;
        }
        function getValue() {
            return 5;
        }
        function add(first, second = getValue()) {
            return first + second;
        }
        function multiply(multiplier, ...theArgs) {
            return theArgs.map(function (element) {
                return multiplier * element;
            });
        }
        function spreadAction (x, y, z){
            return x + y + z;
        }

        function spread(args){
            return  spreadAction(...args);
        }
        function getNewArrayUseSpread(newArray, parts){
            return [...parts, ...newArray];
        }
        function copyArrayUSeSpread(originalArray, newItem){
            var newArray = [...originalArray];
            newArray.push(newItem);
            return newArray;
        }
        function assignObjects(a, b){
            Object.assign(a,b);
            return a;
        }    
        const simpleArrowFunction = (x, y) => x + y; 
        const arrowFunctionReturnObject = id => ({ id: id, name: 'Temp' });
        
        function setNodeObject (){
            let node = {
                type: 'Identifier',
                name1: 'foo'
            };  
            let type = 'Literal',
                name1 = 5;
            ({ type, name1 } = node);
            return {type,name1};
        }
        
               
        function getPerson (){
            let person= {       
                name2: 'foo',
                age2: 20,
                type: 'identifier'
            };
            let { name2, age2, gender = 'male', city} = person;
            return {name2,age2,gender,city};
        }
                
        function getPersonwithDifferentNames (){
            let node = {
                type: 'Identifier',
                name1: 'foo'
            };  
            let { type: localType, 
                name1: localName, 
                serelizable: shouldBeSaved = true } = node;
            return {localType,localName,shouldBeSaved};
        }
        function getNestedObjectDestructuring (){
            let node = {
                name: 'foo',
                loc: {
                    start: {
                        line: 1,
                        column: 1
                    }
                }
            };
            let { loc: { start }} = node;
            return start;
        }
        function destructuredParameters(a, b, {type, name, date, value} = {}){
            return {type, name, date, value};
        }

        return{
            multilineTemplateLiterals,
            templateLiteralsWithParams,
            templateLiteralsWithUndeclaredVariables,
            templateLiteralsWithExprresion,
            getPersonParams,
            add,
            multiply,
            spread,
            getNewArrayUseSpread,
            copyArrayUSeSpread,
            simpleArrowFunction,
            arrowFunctionReturnObject,
            assignObjects,
            setNodeObject,
            getPerson,
            getPersonwithDifferentNames,
            getNestedObjectDestructuring,
            destructuredParameters,
            person,
            square
        };

    });

