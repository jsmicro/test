# JSMicro Test

A simple **`NodeJS`** test runner. This module is super simple test runner with no dependencies, good for non-complicated testing. This module created to test the **`JSMicro`** Modules.

***

## Installation

To use as module, install and save as dev dependency.

```bash
npm install --save-dev @jsmicro/test
```

To use it as CLI app, install it to global.

```bash
npm install -g @jsmicro/test
```

## Usage

To use the tester, simply load the module and create the test instance, then add the test specs before running the test or adding the test to queue.

### **test(_optional_ HANDLER, _optional_ NAME)**

```js
// Load the tester.
var test = require('@jsmicro/test');

// Create test instance and add test specs.
test(HANDLER, NAME)[METHODS];
```

*   **`HANDLER`** - Function to be called when running simple test. E.g: **`accept()`**
*   **`NAME`** - String **`HANDLER`** alias name. If not given, **`HANDLER.name`** will be used.

If you want to run the test using CLI app, you'll get **`JSMicroTest`** on the global.

```js
// Create test instance and add test specs.
JSMicroTest(HANDLER, NAME)[METHODS];
```

and then run

```bash
jsmicro-test file-to-test.js
```

***

#### Example `(test.js)`

```js
'use strict';

var Test = require('@jsmicro/test');

function isString ( arg ) {
    return 'string' === typeof arg;
}

function count ( a, b, c ) {
    return (a + b + c);
}

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
    .try('Running isString() under async call customTest() should be passed.', customTest)
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



```

***

## Methos

To use multiple **`PARAMS`**, use **`test.args(ARGUMENTS)`**.

Example: **`expected(test.args('John', 'Smith'), 'John Smith')`**

### **`accept(PARAM)`**

Add test spec that return true when the **`PARAM`** passed to the **`HANDLER`**.

### **`reject(PARAM)`**

Add test spec that return false when the **`PARAM`** passed to the **`HANDLER`**.

### **`expected(PARAM, EXPECTED)`**

Add test spec that match the **`HANDLER`** call result by giving **`PARAM`** to the **`HANDLER`**.

### **`unexpected(PARAM, EXPECTED)`**

Add test spec that marked as correct when the **`EXPECTED`** value is unmatch with the **`HANDLER`** call result.

### **`test(MESSAGE, PARAM, EXPECTED, NEGATIVE)`**

Add custom test spec that act like **`accept()`**, **`reject()`**, or **`expected()`**. This method will allow yout to add custom spec message. Set **`NEGATIVE`** to true to mark as correct when the expected value is unmatch with the call result.

### **`try(MESSAGE, HANDLER)`**

Add custom spec test with more complicated execution. The tester will giving **`accept`** and **`reject`** function to the **`HANDLER`** to mark the test as correct or incorect. You need to call the **`accept`** or **`reject`** function after your test done, or the next specs will never tested.

### **`queue(IGNORE_ERROR)`**

Add the test to the queue. Running this will start the queues. Next test will be executed after the current test done. Set **`IGNORE_ERROR`** to true if you want the tests keep running even when some errors occured. The errors will be logged at the end of the tests.

### **`run()`**

Run the test directly without adding to the queue. Use this if you only need to run single test.

***

## Helpers

### **`test.args(ARGUMENTS)`**

Pass multiple arguments to the spec call. If you want to pass function `arguments` as spec call param, wrap it using this since tester will read the param as is.

### **`test.color`**

Object contains functions to colorize string.

*   **`.green(TEXT)`**
*   **`.greenBright(TEXT)`**
*   **`.red(TEXT)`**
*   **`.redBright(TEXT)`**
*   **`.blue(TEXT)`**
*   **`.blueBright(TEXT)`**
*   **`.cyan(TEXT)`**
*   **`.cyanBright(TEXT)`**
*   **`.magenta(TEXT)`**
*   **`.magentaBright(TEXT)`**
*   **`.yellow(TEXT)`**
*   **`.yellowBright(TEXT)`**
*   **`.bold(TEXT)`**

**Example**:

```js
var test = require('@jsmicro/test')

console.log(test.color.green('Green color'));
console.log(test.color.bold(test.color.green('Green bold text')));
```

***

## Changelog

#### **`v1.0.2 - Apr 8, 2016`

*   Improving simple test logs.
*   Added `OBJECT.__jmtname__` to give name for simple test logs.
*   Using JSCS for consitent code.

#### **`v1.0.1 - Mar 26, 2016`**
*   Read arguments for message as `arguments` instead `[object Arguments]`

#### **`v1.0.0 - Mar 26, 2016`**

*   Initial commit and first release.

***

## The MIT License **`(MIT)`**

Copyright © 2016 Nanang Mahdaen El Agung

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:


The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
