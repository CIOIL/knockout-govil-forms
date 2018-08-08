define([], () => {
    const toStringIfString = (value) => {
        return value ? value.toString() : value;
    };
    const isNotPrimitive=(obj) =>{
        return (obj === Object(obj));
    };
    const isStringEqual = (value, valueToCompare) => {         
        if (isNotPrimitive(value)) {
            throw new Error('Can not compare objects in function isStringEqual');
        }
        value = toStringIfString(value);
        valueToCompare = toStringIfString(valueToCompare);
        return (valueToCompare === value);
    };
    return {
        isStringEqual
    };
});