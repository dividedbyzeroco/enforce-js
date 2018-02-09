const enforce = require('../dist').default;
const ValidationError = require('../dist').ValidationError;

let name = 'not okay';

try {
    enforce`${{ name }} as an optional string, with 4 to 12 characters, and matches /^okay$/i`;
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

let post = new NotPost();

enforce`${{ post }} as a ${{ Post }}`;