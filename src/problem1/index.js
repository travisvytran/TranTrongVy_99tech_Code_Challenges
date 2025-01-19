/* Problem 1: Three ways to sum to n */

/* Solution 1: Using for loop */
const sum_to_n_a = (number) => {
    let result = 0;

    if (number === 1) {
        result = 1;
        return result;
    }

    /* Loop through every number from 1 to the assigned number, and make additions into result */
    for (let i = 1; i <= number; i++) {
        result += i;
    }

    return result;
}

/* Solution 2: Using recursion to calculate the sum of numbers from 1 to the given number
    Notice: This solution is not recommended to apply. If the given number is large, it would likely cause stack overflow error.
*/

const sum_to_n_b = (number) => {
    let result;

    if (number === 1) {
        result = 1;
        return result;
    }

    // Recursive applies
    result = number + sum_to_n_b(number - 1);
    return result;
}

/* Solution 3: Using arithmetic progression based on this arithmetic series formula sum = (n * (n + 1)) / 2 */
const sum_to_n_c = (number) => {
    let result;

    if (number === 1) {
        result = 1;
        return result
    }

    // Apply arithmetic series formula
    result = (number * (number + 1)) / 2;
    return result;
}

/* Log into the console all functions' results*/
console.log('Solution 1:',sum_to_n_a(5));
console.log('Solution 2:',sum_to_n_b(5));
console.log('Solution 3:',sum_to_n_c(5));