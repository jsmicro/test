'use strict';

// Load the tester.
var Test = require('../index');

// Create simple function to test.
function isString ( arg ) {
    return 'string' === typeof arg;
}

// Create simple expect function to test.
function count ( a, b, c ) {
    return (a + b + c);
}

// Create simple async function to test.
function customTest ( accept, reject ) {
    var name = null;

    setTimeout(() => {
        done()
    }, 1000);

    var done = function () {
        name = 'John Smith';

        if ( isString(name) ) {
            accept();
        }
        else {
            reject();
        }
    }
}

// Create simple Test instance.
Test(isString)
    // Add correct spec.
    .accept('String')		// Passed
    // Add incorrect specs.
    .reject(10)				// Passed
    .reject([])				// Passed
    .reject({})				// Passed
    // Add custom simple Test specs.
    .test('Running this should return false.', [], false)	// Passed
    // Add custom Test spec.
    .try(`Running ${Test.color.yellow('isString()')} under async call ${Test.color.green('customTest()')} should be passed.`, customTest)
    // Add to Test queue.
    .queue();

// Create expect Test instance.
Test(count)
    // Add correct specs.
    .expected(Test.args(10, 20, 30), 60) 	// Passed
    .expected(Test.args(5, 5, 10), 20)		// Passed
    // Add incorrect.
    .unexpected(Test.args(5, 5), 10)		// Passed
    // Add to Test queue.
    .queue();


