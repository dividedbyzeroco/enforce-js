// Basic Data Types
const dataTypes = {
    Void: val => typeof val === 'undefined',
    Null: val => val === null,
    String: val => typeof val === typeof '',
    Number: val => typeof val === typeof 0,
    Boolean: val => typeof val === typeof true,
    Array: val => val instanceof Array,
    Object: val => typeof val === typeof {} && !(val instanceof Array),
    Function: val => typeof val === typeof (() => {}),
    Class: (val, staticClass) => val instanceof staticClass
};

// Expressions
const expressions = {
    'an optional string': val => dataTypes.Void(val) || dataTypes.String(val),
    'a string': val => dataTypes.String(val),
    'an optional number': val => dataTypes.Void(val) || dataTypes.Number(val),
    'a number': val => dataTypes.Number(val),
    'an optional boolean': val => dataTypes.Void(val) || dataTypes.Boolean(val),
    'a boolean': val => dataTypes.Boolean(val),
    'an optional array': val => dataTypes.Void(val) || dataTypes.Array(val),
    'an array': val => dataTypes.Array(val),
    'an optional object': val => dataTypes.Void(val) || dataTypes.Object(val),
    'an object': val => dataTypes.Object(val),
    'any value': () => true,
    'a value': val => !dataTypes.Void(val),
    'an optional function': val => dataTypes.Void(val) || dataTypes.Function(val),
    'a function': val => dataTypes.Function(val)
};

// Partial expressions
const partialExpressions = [
    [/^with \d{1,} to \d{1,} characters$/i, (val, rule) => {
        const min = parseInt(rule.slice('with '.length - 1, rule.indexOf(' to')));
        const max = parseInt(rule.slice(rule.indexOf('to') + 'to '.length));
        return val.length >= min && val.length <= max;
    }],
    [/^with \d{1,} or more characters$/i, (val, rule) => {
        const min = parseInt(rule.slice('with '.length - 1, rule.indexOf(' to')));
        return val.length >= min;
    }],
    [/^with up to \d{1,} characters$/i, (val, rule) => {
        const min = parseInt(rule.slice('with '.length - 1, rule.indexOf(' to')));
        return val.length >= min;
    }],
    [/^greater than \d{1,}/i, (val, rule) => {
        const min = rule.slice(rule.lastIndexOf(' ') + 1);
        return val > min;
    }],
    [/^greater than or equal to \d{1,}/i, (val, rule) => {
        const min = rule.slice(rule.lastIndexOf(' ') + 1);
        return val >= min;
    }],
    [/^less than \d{1,}/i, (val, rule) => {
        const max = rule.slice(rule.lastIndexOf(' ') + 1);
        return val < max;
    }],
    [/^less than or equal to \d{1,}/i, (val, rule) => {
        const min = rule.slice(rule.lastIndexOf(' ') + 1);
        return val <= min;
    }],
    [/^(and )?matches \/.{1,}\/[i,g]$/i, (val, rule) => {
        const regEx = rule.slice(rule.indexOf('/') + 1, rule.length - '/*'.length);
        const regExScope = rule.slice(-1);
        return !dataTypes.Null(val.match(new RegExp(regEx, regExScope)));
    }]
];

// Search partial expressions
const searchPartialExpressions = (name, value, rule) => {
    for(let expression of Object.values({...partialExpressions})) {
        if(expression[0].test(rule)) {
            const checker = expression[1];
            return checker(value, rule);
        }
    }
    return;
};

// Define validation error
export class ValidationError extends Error {

    name;
    constructor(message, name) {
        super(message);
        this.name = name;
    }
}

// Define format error
export class FormatError extends Error {

    name;
    constructor(message, name) {
        super(message);
        this.name = name;
    }
}

// Fail validation
const failValidation = (name, rules) => {
    const message = `'${name}' must be ${rules.join(', ')}`;
    throw new ValidationError(message, name);
};

// Fail format
const failFormat = (name) => {
    const message = `[EnforceJS] Format for parameter '${name}' is invalid`;
    throw new FormatError(message, name);
};

const enforce = (definition, ...params) => {
    // Get item to be checked
    const name = Object.keys(params[0])[0];
    const value = Object.values(params[0])[0];

    // Get rules
    const rules = definition[1].trim()
        .replace('as ', '')    
        .split(',')
        .map(rule => rule.trim());
    
    // Check if definition uses a class
    if(definition.length === 3) {
        // Check if rule definition is correct
        if(rules[0] !== 'a' && rules[0] !== 'an' || params.length === 1) 
            failFormat(name);
        
        // Define readable class rules
        const classRules = [[rules[0], Object.keys(params[1])[0]].join(' ')];

        // Get the static class supplied
        const staticClass = Object.values(params[1])[0];
        if(!dataTypes.Class(value, staticClass))
            return failValidation(name, classRules);
        return;
    }

    // Check data type
    const dataTypeChecker = expressions[rules[0]];
    if(dataTypes.Void(dataTypeChecker)) failFormat(name);
    if(!dataTypeChecker(value)) failValidation(name, rules);

    // Check if void
    if(dataTypes.Void(value)) return;

    // Iterate through other rules
    for(let index = 1; index < rules.length; index++) {
        let rule = rules[index];
        let expression = expressions[rule];
        if(dataTypes.Void(expression)) {
            const partialExpression = searchPartialExpressions(name, value, rule);
            if(dataTypes.Void(partialExpression)) failFormat(name);
            if(partialExpression === false) failValidation(name, rules);
        }
    }
};

enforce.extend = (rule, validator) => {
    partialExpressions.push([rule, validator]);
};

export default enforce;