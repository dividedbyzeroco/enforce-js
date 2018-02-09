const enforce = require('../dist').default;
const EnforceError = require('../dist').EnforceError;

let name = 'not okay';

try {
    enforce`${{ name }} as an optional string, with 4 to 12 characters, and matches /^okay$/i`;
}
catch(err) {
    if(err instanceof EnforceError) {
        console.error(`The message was: ${ err.message }, invalid parameter is: ${ err.name }`);
    }
}

class Post {
    // A definition of post
}

let post = new Post();

enforce`${{ post }} as a ${ Post }`;