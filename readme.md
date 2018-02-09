# Enforce JS
Enforcing data validations through readable definitions

## Introduction
`enforce` is a data validation tool that allows you to assert rules on supplied variables and parameters, using a human-friendly format.

## Getting Started
To install `enforce`, run the following code in your npm project.

```javascript
npm install --save enforce-js
```
After installing, simply import the module.

```javascript
import enforce from 'enforce-js';
```

## Syntax
To `enforce` validation on a variable, simply follow the syntax below.

```javascript
enforce`${{ variable }} as dataType, rule1, rule2, ...`;
```

> NOTE: `enforce` uses double brackets as a shortcut to `{ variable: variable }`

## Regular Data Types
`enforce` supports primitive javascript data types, which by default, are __non-nullable__. To explictly define a variable to be nullable, use the `optional` keyword.

> NOTE: Non-nullable in `enforce` means the value can either be `undefined` or the specified data type. It cannot be a javascript `null` object.

- 'a string'
- 'a number'
- 'a boolean'
- 'an array'
- 'an object'
- 'a function'
- 'an optional string'
- 'an optional number'
- 'an optional boolean'
- 'an optional array'
- 'an optional object'
- 'an optional function'
- 'a value'
- 'any value'

## Rules
Additional rules can help further validate a supplied variable. If the below rules do not meet the requirements of what may be needed, you may use the `and matches REGEXP` rule in order to fill the gap.

- 'with `MIN` to `MAX` characters' (MIN: number, MAX: number)
- 'with `MIN` or more characters' (MIN: number)
- 'with up to `MAX` characters' (MAX: number)
- 'greater than `MIN`' (MIN: number)
- 'greater than or equal to `MIN`' (MIN: number)
- 'less than `MAX`' (MAX: number)
- 'less than or equal to `MAX`' (MAX: number)
- 'and matches `REGEXP`' (REGEXP: regular expression)

## Validating Classes

`enforce` also supports validating class-type objects. To validate whether a supplied variable or parameter is an instance of a class, you can directly supply the class as a data type.

```javascript
class Animal { /* class definition */ }
const dog = new Animal();

enforce`${{ dog }} as an ${{ Animal }}`; // ok

class Dog extends Animal { /* class definition */ }
const corgi = new Dog();

enforce`${{ corgi }} as a ${{ Dog }}`; // ok
enforce`${{ corgi }} as an ${{ Animal }}`; // ok
enforce`${{ dog }} as a ${{ Dog }}`; // error!
```

## Catching Errors

By default, if a given parameter does not meet the rules provided, a `ValidationError` will be thrown with a message containing the original definition. To better handle the error, an additional `name` parameter is also supplied to let you know which parameter was invalid.

```javascript
const countingNumber = -1;

enforce`${{ countingNumber }} as a number, greater than or equal to 0`;

// OUTPUT
// error.message: 'countingNumber' must be a number, greater than or equal to 0
// error.name: countingNumber
```

The recommended approach is to have a try-catch block that retrieves the invalid parameter.

```javascript
import enforce, { ValidationError } from 'enforce-js';

try {
    const countingNumber = -1;
    enforce`${{ countingNumber }} as a number, greater than or equal to 0`;
}
catch(err) {
    if(err instanceof ValidationError) {
        console.error(`The error message was: ${err.message}, and the invalid parameter is: ${err.name}`);
    }
}
```

> NOTE: `enforce` format is also validated and throws a `FormatError` when the supplied definition is invalid.

```javascript
import enforce, { FormatError } from 'enforce-js';

try {
    const countingNumber = -1;
    enforce`${{ countingNumber }} as a postive number, and is the square root of 4`;
}
catch(err) {
    if(err instanceof FormatError) {
        console.error(`The error message was: ${err.message}, and the invalid parameter is: ${err.name}`);
    }
}
```

## Examples

```javascript
// Import module
import enforce, { ValidationError } from 'enforce-js';

// Validate a variable
const message = 'Hello, world!';
enforce`${{ message }} as a string, with 5 to 20 characters`; // ok

// Validate function parameters
const register = ({ username, name, password, age, options }) => {
    try {
        enforce`${{ username }} as a string`;
        enforce`${{ name }} as an optional string`;
        enforce`${{ password }} as a string, with 6 to 8 characters`;
        enforce`${{ password }} as a password, with 6 to 8 characters, and matches /^\\d{6,8}$/i`;
        enforce`${{ age }} as a number, greater than 18`;
        enforce`${{ options }} as an optional object`;

        const { messages } = options;
        enforce`${{ messages }} as a boolean`;

        /* function definition */
    }
    catch(err) {
        if(err instanceof ValidationError) {
            return `Invalid Parameter: ${err.name}`;
        }
    }
}

// Use function
const result = register({
    username: 'tardisblue', // ok
    name: 'Amy Pond', // ok
    password: '1234', // error!
    age: 21 // ok
});

// result: `Invalid Parameter: password`

// Validate if an object is an instance of a class
class Post { /* class definition */ }
const post = new Post();

enforce`${{ post }} as a ${{ Post }}`; // ok
```
