const enforce = require('../dist').default;
const ValidationError = require('../dist').ValidationError;

let name = 'okay';
let carbonCopy = { primary: 'johndoe@email.com', secondary: 'janedoe@email.com' };
let blindCarbonCopy = ['johndoe@email.com', 'janedoe@email.com'];

try {
    enforce`${{ name }} as an optional string, with 4 to 12 characters, and matches /^okay$/i`;
    enforce`${{ carbonCopy }} as an object`;
    enforce`${{ blindCarbonCopy }} as an object`;
}
catch(err) {
    if(err instanceof ValidationError) {
        console.error(`The message was: ${ err.message }, invalid parameter is: ${ err.name }`);
    }
}

class Post {
    // A definition of post
}

class NotPost {
    // A definition of not post
}

let post = new Post();

enforce`${{ post }} as a ${{ Post }}`;

// Extending enforce
enforce.extend(/^is one$/i, val => {
    return val === 1;
});

let check = 1;

enforce`${{ check }} as a number, is one`;