// Get references to the calculator's DOM elements
const calculator = document.querySelector('.calculator');
const expressionDisplay = calculator.querySelector('.calculator-expression');
const resultDisplay = calculator.querySelector('.calculator-result');
const keys = calculator.querySelector('.calculator-keys');

// State variables to manage the calculator's logic
let currentExpression = ''; // Stores the full expression string (e.g., "12 + 5 * 3")
let lastInputIsOperator = false; // Flag to prevent multiple operators from being entered consecutively

// Add a single event listener to the parent container of all the keys
keys.addEventListener('click', event => {
    // Get the clicked button and its attributes
    const { target } = event;
    const { action, operator } = target.dataset;
    const keyContent = target.textContent;

    // ----- The main logic is handled in a sequence of checks -----

    // 1. Handle the "AC" (clear) button first.
    // The data-action="clear" attribute is crucial for this check.
    if (action === 'clear') {
        clearCalculator();
        return; // Stop execution to prevent any other logic from running
    }

    // 2. Handle the "x" (delete) button.
    if (action === 'delete') {
        if (currentExpression.length > 0) {
            currentExpression = currentExpression.slice(0, -1); // Remove the last character
            resultDisplay.textContent = currentExpression === '' ? '0' : currentExpression;
        }
        return;
    }

    // 3. Handle the "=" (calculate) button.
    if (action === 'calculate') {
        if (currentExpression === '') {
            return; // Do nothing if there is no expression to evaluate
        }

        try {
            // Evaluate the expression using a safe function to avoid security risks
            const result = safeEvaluate(currentExpression);
            
            // Display the full expression and the final result
            expressionDisplay.textContent = currentExpression + ' =';
            resultDisplay.textContent = parseFloat(result.toFixed(7)); // Limit decimal places

            // Reset the expression for a new calculation
            currentExpression = '';
            lastInputIsOperator = false;
        } catch (e) {
            // Handle any errors during evaluation (e.g., division by zero, invalid expression)
            resultDisplay.textContent = 'Error';
            expressionDisplay.textContent = '';
            currentExpression = '';
        }
        return;
    }

    // 4. Handle operator buttons (+, -, *, /, %)
    if (operator) {
        // Replace the last operator if a new one is pressed
        if (lastInputIsOperator) {
            currentExpression = currentExpression.slice(0, -1) + getOperatorSymbol(operator);
        } else if (currentExpression !== '') {
            // Append the operator to the expression
            currentExpression += getOperatorSymbol(operator);
        }
        resultDisplay.textContent = currentExpression;
        lastInputIsOperator = true; // Set flag to indicate the last input was an operator
        return;
    }

    // 5. Handle all other buttons (numbers and decimal point)
    // This is the final block, and it runs for any button that isn't an operator or action button.
    currentExpression += keyContent;
    resultDisplay.textContent = currentExpression;
    lastInputIsOperator = false;
});

/**
 * Resets all calculator state variables and clears the display.
 */
function clearCalculator() {
    expressionDisplay.textContent = '';
    resultDisplay.textContent = '0'; // Display '0' as the initial state
    currentExpression = '';
    lastInputIsOperator = false;
}

/**
 * A helper function to convert the operator's data attribute to its symbol.
 * @param {string} operator - The data-operator attribute value (e.g., "add", "multiply").
 * @returns {string} The corresponding mathematical symbol.
 */
function getOperatorSymbol(operator) {
    switch (operator) {
        case 'add': return '+';
        case 'subtract': return '-';
        case 'multiply': return '*';
        case 'divide': return '/';
        case 'percent': return '%';
        default: return '';
    }
}

/**
 * A function to safely evaluate a mathematical expression string.
 * It's safer than using the built-in eval() function directly.
 * @param {string} expression - The mathematical expression to evaluate.
 * @returns {number|string} The result of the calculation or an error message.
 */
function safeEvaluate(expression) {
    // Replace percentage operator with a division by 100 for proper calculation
    const safeExpression = expression.replace(/(\d+)%/g, '($1 / 100)');
    
    // Regular expression to check for invalid characters, preventing code injection
    const allowedChars = /^[0-9+\-*/.() ]+$/;
    if (!allowedChars.test(safeExpression)) {
        throw new Error('Invalid characters in expression');
    }

    // Use the Function constructor, which is a safer alternative to direct eval()
    return Function('"use strict";return (' + safeExpression + ')')();
}

