const enforce = require('../dist').default;

let name = 'not okay';

enforce`${{ name }} as an optional string, with 4 to 12 characters, and matches /^okay$/i`;