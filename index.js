'use strict';

// Getting string color maker.
let color = require('./util/color');

// Exporting Test instance maker.
module.exports = Test;

/**
 * JSMicroTest Instance Maker
 *
 * @param {function} [fn] - Function to test. Required when running a simple tests.
 * @param {string} [name] - String function name.
 * @returns {JSMicroTest}
 */
function Test( fn, name ) {
    // Return new JSMicroTest instance.
    return new JSMicroTest(fn, name);
}

// Get function arguments to pass to function parameter.
Test.args = function () {
    return arguments;
};

// Wrapping color maker to Instance Maker.
Test.color = color;

/**
 * JSMicroTest Constructor.
 *
 * @param {function} [fn] - Function to handle the test. Required when running simple tests.
 * @param {string} [name] - Function name to show on the console logs.
 * @returns {JSMicroTest}
 * @constructor
 */
function JSMicroTest( fn, name ) {
    if ( 'function' === typeof fn ) {
        // Save the function if the fn is a function.
        this.fn = fn;
    } else {
        // Create anonimous function if no function given.
        this.fn = function () {};
    }

    if ( 'string' === typeof name ) {
        // Save the name if given.
        this.name = name;
    } else {
        // Use function name if not given.
        this.name = this.fn.name;
    }

    // Creating spces list.
    this.specs = [];

    // Creating errors list.
    this.errors = [];

    // Creating the spec run position.
    this.cursor = 0;

    // Create the spec status.
    this.passed = true;

    // Create the trhow error status.
    this.throws = true;

    // Add the test to the Queue.
    JSMicroTestQueue.list.push(this);

    return this;
}

/**
 * Complicated Spec Maker
 * Add spec with more complicated execution to test the spec.
 *
 * @param {string} message - String message about the spec.
 * @param {function} handler - Function to handle the spec test. Tester will give accept and reject function to the handler to mark the spec as success or failed.
 * @returns {JSMicroTest}
 */
JSMicroTest.prototype.try = function ( message, handler ) {
    this.specs.push({ message, handler });

    return this;
};

/**
 * Simple Spec Maker
 * Add spec with simple execution to test the spec.
 *
 * @param {string} message  - String message about the spec.
 * @param {any} given       - Variable to pass to the Test handler.
 * @param {any} expected    - Expected value to match to the Test handler call result.
 * @returns {JSMicroTest}
 */
JSMicroTest.prototype.test = function ( message, given, expected, negative ) {
    var self = this;

    self.specs.push({ message, handler });

    // Creating simple test handler.
    function handler( accept, reject ) {
        // Get the raw arguments.
        let fn = getArgs(given);

        try {
            // Call the Test handler by giving array arguments as an arguments.
            let rs = self.fn.apply(null, fn.args);

            // Mark as accepted if the result is match with the expected result, and the test is negative test.
            if ( negative ) {
                if ( rs !== expected ) {
                    accept();
                }
                // Mark as rejected if the result is not match with the expected result.
                else {
                    reject();
                }
            }
            // Mark as accepted if the result is match with the expected result, and the test is not negative test.
            else {
                if ( rs === expected ) {
                    accept();
                }
                // Mark as rejected if the result is not match with the expected result.
                else {
                    reject();
                }
            }
        }
        catch ( err ) {
            // Mark as rejected if some error occurs when running the test.
            reject(err);
        }
    }

    return this;
};

/**
 * Matching Spec Maker
 * Add spec to match the given value to the expected value.
 *
 * @param {any} given     - Single variable or function to pass to the Test handler.
 * @param {any} expected  - Single variable to match with Test handler call result.
 * @returns {JSMicroTest}
 */
JSMicroTest.prototype.expected = function ( given, expected ) {
    let fn = getArgs(given);

    return this.test(`${color.yellow(this.name)}(${color.cyan(String(fn.raws))}) should return ${color.green(expected)}.`, given, expected);
};

/**
 * Negative Matchin Spec Maker
 * Add spec to test the unmatch result with the expected value.
 *
 * @param {any} given     - Single variable or function to pass to the Test handler.
 * @param {any} expected  - Single variable to match with Test handler call result.
 * @returns {JSMicroTest}
 */
JSMicroTest.prototype.unexpected = function ( given, expected ) {
    let fn = getArgs(given);

    return this.test(`${color.yellow(this.name)}(${color.cyan(String(fn.raws))}) should not return ${color.green(expected)}.`, given, expected, true);
};

/**
 * Positive Spec Maker
 * Add spec that should return true.
 *
 * @param {any} given - Single variable or function arguments to pass to the Test handler.
 * @returns {JSMicroTest}
 */
JSMicroTest.prototype.accept = function ( given ) {
    let fn = getArgs(given);

    return this.test(`${color.yellow(this.name)}(${color.cyan(String(fn.raws))}) should return true.`, given, true);
};

/**
 * Negative Spec Maker
 * Add spec that should return false.
 *
 * @param {any} given - Single variable or function arguments to pass to the Test handler.
 * @returns {JSMicroTest}
 */
JSMicroTest.prototype.reject = function ( given ) {
    // Get the arguments raws.
    let fn = getArgs(given);

    // Add the specs.
    return this.test(`${color.yellow(this.name)}(${color.cyan(String(fn.raws))}) should return false.`, given, false);
};

/**
 * Test Runner
 * Run the test specs to check does the spec is passed or failed.
 *
 * @param {function} done - Function to mark the queue as done.
 * @returns {JSMicroTest}
 */
JSMicroTest.prototype.run = function ( done ) {
    // Wrap the test.
    var self = this;

    // Show the Test instance title.
    console.log(`\r\n${color.bold('[JSMicro Test]')}[Function ${color.yellow(this.name)}]\r\n`);

    // Process the test specs.
    next();

    // Function to process the next specs.
    function next() {
        // Process only when the specs cursor is less than the specs length.
        if ( self.cursor < self.specs.length ) {
            // Get the current spec.
            let spec = self.specs[ self.cursor ];

            // Show the current spec message.
            console.log(` ${self.cursor + 1}) ${spec.message}`);

            // Increase the cursor.
            self.cursor += 1;

            try {
                // Try to run the spec with giving function to accept or reject the spec.
                spec.handler(accept, reject);
            }
            catch ( err ) {
                // Reject the spec if the spec call ocurring error.
                reject(err);
            }
        }
        // Mark as done if the cursor is equal to or greater than specs length.
        else {
            // Show success message if no error when running the specs.
            if ( self.passed ) {
                console.log(`\r\nRunning ${color.bold(self.specs.length)} tests completed with no errors.\r\n`);
            }
            // Show the failed message if error occurs when running the specs.
            else {
                console.log(color.redBright(`\r\nRunning ${color.bold(self.specs.length)} tests completed with errors.\r\n`));

                // Show the errors and exit the process if the throw is not ignored.
                if ( self.throws ) {
                    self.errors.forEach(
                        err => {
                            console.log(`${err.index})`, err.error.stack);
                        }
                    );

                    process.exit(500);
                } else {
                    // Add the errors to the queue errors to show the errors when all queues done.
                    self.errors.forEach(
                        err => {
                            // Add spec name to the error to show them later.
                            err.group = self.name;

                            // Push the error to queue errors.
                            JSMicroTestQueue.errs.push(err);
                        }
                    );
                }
            }

            // Call the queue done function if given.
            if ( 'function' === typeof done ) {
                done();
            }
        }
    }

    // Function to mark the test as passed, and process the next specs.
    function accept() {
        // Show the passed message.
        console.log(color.greenBright(`    [✓] Passed`));

        // Process the next specs.
        next();
    }

    // Function to mark the test as failed, and process the next specs.
    function reject( err ) {
        // Push the error to the error list.
        self.errors.push({ error: err || new Error('Unknow Error'), index: self.cursor });

        // Mark the test as failed.
        self.passed = false;

        // Show the failed message.
        console.log(color.redBright(`    [!] Failed`));

        // Process the next specs.
        next();
    }

    return this;
};

/**
 * Test Queue Starter
 * Start the test after collecting test specs.
 *
 * @param {boolean} ignore - Ignore the errors and continue to the next specs.
 * @returns {JSMicroTest}
 */
JSMicroTest.prototype.queue = function ( ignore ) {
    // Ignore throwing error if the ignore argument is true.
    if ( ignore ) {
        this.throws = false;
    }

    // Process the Test Queues.
    nextQueue();

    return this;
};

/**
 * Function Arguments to Raw Converter
 *
 * @param {any} param - Variables to be converted as an argument.
 * @returns {{args: *, raws: Array}}
 */
function getArgs( param ) {
    let args;

    // Convert function arguments to Array if the given rable is an arguments.
    if ( '[object Arguments]' === toString.call(param) ) {
        args = [];

        Object.keys(param).forEach(i => args.push(param[ i ]));
    }
    // Wrap general variable to array if the given variable is not an arguments.
    else {
        args = [ param ];
    }

    // Create agruments raw strings holder.
    let raws = [];

    // Iterating each array agruments to get the argument string.
    args.forEach(
        ( arg, i ) => {
            // Save the raw argument.
            raws[ i ] = arg;

            // Convert to string-like if the argument is a string.
            if ( arg && arg.__jmtname__ ) {
                raws[ i ] = arg.__jmtname__;
            } else if ( 'string' === typeof arg ) {
                raws[ i ] = `'${arg}'`;
            } else if ( 'function' === typeof arg ) {
                // Convert to string function if the argument is a function.
                raws[ i ] = arg.toString();
            } else if ( 'undefined' === typeof(arg) ) {
                raws[ i ] = 'undefined';
            } else if ( arg === null ) {
                raws[ i ] = 'null';
            } else if ( '[object Arguments]' === toString.call(arg) ) {
                raws[ i ] = 'arguments';
            } else {
                // Convert to JSON String if the argument is an array or an object.
                [ 'Array', 'Object' ].forEach(
                    type => {
                        if ( `[object ${type}]` === toString.call(arg) ) {
                            raws[ i ] = JSON.stringify(arg);
                        }
                    }
                );
            }
        }
    );

    // Return the array arguments and raw arguments.
    return { args, raws };
}

// Create JSMicro Test Queue if not exist.
if ( !global.hasOwnProperty('JSMicroTestQueue') ) {
    global.JSMicroTestQueue = {
        list: [],
        stat: 'free',
        errs: []
    };
}

// Function to process the test queues.
function nextQueue() {
    // Process the next queues if the queues length is more than 0.
    if ( JSMicroTestQueue.list.length > 0 ) {
        // Process only when the queue status is free.
        if ( JSMicroTestQueue.stat === 'free' ) {
            // Get the task.
            let queue = JSMicroTestQueue.list[ 0 ];

            // Change the queue status to running.
            JSMicroTestQueue.stat = 'running';

            // Call the queue with providing function to mark queue as done.
            queue.run(done);
        }
    }
    // Finalize the queue if no more queue left.
    else {
        // Log the errors if exist, and then exit the process with 500 as exit code.
        if ( JSMicroTestQueue.errs.length > 0 ) {
            console.log(color.redBright(`[JSMicro TEST:ERROR] An errors occurs when running the test. Below is the errors that happen when test running.\r\n`));

            // Iterate each errors to show them.
            JSMicroTestQueue.errs.forEach(
                err => {
                    console.log(`[${color.yellow(err.group)}](${color.redBright(err.index)})`, err.error.stack, '\r\n');
                }
            );

            // Exit the process.
            process.exit(500);
        }
    }

    // Mark queue as done.
    function done() {
        // Set queue status to free.
        JSMicroTestQueue.stat = 'free';

        // Remove the current queue.
        JSMicroTestQueue.list.shift();

        // Process the next queues.
        nextQueue();
    }
}