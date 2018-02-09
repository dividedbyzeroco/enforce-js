# Enforce JS
Data enforcer syntax for verbose validations

## Introduction

`enforce` allows you to assert validation rules on variables and function parameters using a verbose and self-explanatory syntax.

## Getting Started

To install `enforce`, simple run the following script in your project.

```javascript
npm install --save enforce-js
```
After installing, you can import the library just like any es6 module.

```javascript
import enforce from 'enforce-js';
```

## Syntax

To `enforce` validation on a parameter, simply follow the following syntax:

```javascript
enforce`${{ PARAMETER }} as DATA_TYPE, RULE_1, RULE_2, ...`
```

### Available Data Types:
- a string
- a number
- a boolean
- an array
- an object
- a value
- any value
- an optional string
- an optional number
- an optional boolean
- an optional array
- an optional object

### Available Rules:
- with MIN to MAX characters
- greater than MIN
- greater than or equal to MIN
- less than MAX
- less than or equal to MAX
- and matches REGEXP

## Examples

```javascript
// Import module
import enforce from 'enforce-js';

// Validate a variable
const message = 'Hello, world!';
enforce`${{ message }} as a string, with 5 to 20 characters`;

// Validate function parameters
const create = ({ username, name, password, age, options }) => {
    enforce`${{ username }} as an optional string`;
    enforce`${{ name }} as a string`;
    enforce`${{ password }} as a string, with 6 to 8 characters`;
    enforce`${{ password }} as either a string or number, with 6 to 8 characters`;
    enforce`${{ password }} as a password, with 6 to 8 characters, and matches /asfdjqeg/i}`;
    enforce`${{ age }} as a number, greater than 18`;
    enforce`${{ options }} as an object`;

    const { messages } = options;
    enforce`${{ messages }} as a boolean`;
}
```
