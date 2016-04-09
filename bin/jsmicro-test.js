#! /usr/bin/env node

'use strict';

// Load the tester
let JSMicroTest = require('../index');
let path = require('path');

// Export to global.
global.JSMicroTest = JSMicroTest;

// Load the file.
var file = process.argv[ 2 ];

// Load the file to test.
if ( file ) {
    require(path.join(process.cwd(), file));
}