// Basic Data Types
const dataTypes = {
    Void: val => typeof val == 'undefined',
    Null: val => val === null,
    String: val => typeof val === typeof '',
    Number: val => typeof val === typeof 0,
    Boolean: val => typeof val === typeof true,
    Array: val => typeof val === typeof [],
    Object: val => typeof val === typeof {},
    Function: val => typeof val === typeof (() => {})
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
    [/^greater than \d{1,}/i, (val, rule) => {
        const min = rule.slice(rule.lastIndexOf(' ') + 1);
        return val > min;
    }],
    [/^greater than or equal to \d{1,}/i, (val, rule) => {
        const min = rule.slice(rule.lastIndexOf(' ') + 1);
        return val > min;
    }],
    [/^less than \d{1,}/i, (val, rule) => {
        const max = rule.slice(rule.lastIndexOf(' ') + 1);
        return val < max;
    }],
    [/^less than or equalt to \d{1,}/i, (val, rule) => {
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
        if(rule.match(expression[0])) {
            const checker = expression[1];
            return checker(value, rule);
        }
    }
    return;
};

const failValidation = (name, rules) => {
    throw new Error(String.raw`'${name}' must be ${rules.join(', ')}`);
};

const failSyntax = (name) => {
    throw new Error(String.raw`[EnforceJS] Syntax for parameter '${name}' is invalid`);
};

export default (definition, ...params) => {
    // Get item to be checked
    const name = Object.keys(params[0])[0];
    const value = Object.values(params[0])[0];

    // Get rules
    const rules = definition[1].trim()
        .replace('as ', '')    
        .split(',')
        .map(rule => rule.trim());
    
    // Check data type
    const dataTypeChecker = expressions[rules[0]];
    if(!dataTypeChecker(value)) failValidation(name, rules);

    // Check if void
    if(dataTypes.Void(value)) return;

    // Iterate through other rules
    for(let index = 1; index < rules.length; index++) {
        let rule = rules[index];
        let expression = expressions[rule];
        if(dataTypes.Void(expression)) {
            const partialExpression = searchPartialExpressions(name, value, rule);
            if(dataTypes.Void(partialExpression)) failSyntax(name);
            if(partialExpression === false) failValidation(name, rules);
        }
    }
};