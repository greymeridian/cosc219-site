/**
 * COSC219 Lab 4 - Part A: JavaScript Warm-up
 * 
 * Ronald Lorette
 * 300294189
 *
 * Predictions were recorded before executing the expressions.
 * Actual results were verified using console.log().
 */


console.log("7" + 3);             // Prediction: 73
                                  /* 
                                  Actual: "73", i expected a number but the '+' operator concatenates 
                                  strings and numbers when one operand is a string
                                  */

console.log("7" - 3);             // Prediction: 4
                                  /* Actual: 4, the - operator only works with numbers, 
                                  so the string "7" is coerced into a number
                                  */

console.log(7 + 3 + "1");         // Prediction: 111
                                  /* Actual: "101", the first two operands are numbers, so they are added 
                                  together first, then the result is concatenated with the string "1"
                                  */

console.log("7" * "2");           // Prediction: 14
                                  /* Actual: 14, the * operator only works with numbers, 
                                  so both operands are coerced into numbers
                                  */
console.log(10 / 3);              // Prediction: 3.333...
                                  // Actual: 3.333..., division always returns a floating-point number
                                  
console.log(typeof null);         // Prediction: unsure
                                  /* Actual: "object" i wasn't sure what type null would return.
                                    I found it surprising that JavaScript considers
                                    null an object rather than a separate type.
                                  */

console.log(typeof NaN);          // Prediction: unsure
                                  // Actual: "number", NaN is of type "number"

console.log(Boolean("false"));    // Prediction: unsure
                                  // Actual: true, any non-empty string is truthy

console.log(Boolean("0"));        // Prediction: unsure
                                  // Actual: true, any non-empty string is truthy
                                  
console.log(0 || "fallback");     // Prediction: "fallback"
                                  /* 
                                  Actual: "fallback", since 0 is falsy, the || operator 
                                  returns the second operand
                                  */

console.log(0 ?? "fallback");     // Prediction: 0
                                  /* Actual: 0, the ?? operator only returns the second operand if the first is null or undefined
                                  */

console.log("" || "empty");       // Prediction: "empty"
                                  /* Actual: "empty", since an empty string is falsy, the || operator returns the second operand
                                  */

console.log("10" == 10);          // Prediction: true
                                  /* Actual: true, the == operator performs type coercion
                                  */

console.log("10" === 10);         // Prediction: false
                                  // Actual: false, the === operator does not perform type coercion

console.log(Number("12abc"));     // Prediction: NaN
                                  // Actual: NaN, the Number constructor returns NaN for invalid numbers

console.log(parseInt("12abc"));   // Prediction: 12
                                  // Actual: 12, parseInt reads digits until it encounters a non-numeric character

console.log(" hi ".trim());       // Prediction: "hi"
                                  // Actual: "hi", the trim method removes whitespace from both ends of a string
                                  
console.log("cat".includes("a")); // Prediction: true
                                  // Actual: true, the includes method checks if a string contains a substring