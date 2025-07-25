const calculator = document.querySelector('.calculator');
const expressionDisplay = calculator.querySelector('.calculator-expression');
const resultDisplay = calculator.querySelector('.calculator-result');
const keys = calculator.querySelector('.calculator-keys');

let currentExpression = '';
let lastInputIsOperator = false;

keys.addEventListener('click', event => {
    const { target } = event;
    const { action, operator } = target.dataset;
    const keyContent = target.textContent;

    // The AC button is handled first to ensure it's a complete reset
    if (action === 'clear') {
        clearCalculator();
        return; // Important: Stop processing after a clear action
    }

    // Handle delete (x) button
    if (action === 'delete') {
        if (currentExpression.length > 0) {
            currentExpression = currentExpression.slice(0, -1);
            if (currentExpression === '') {
                resultDisplay.textContent = '0';
            } else {
                resultDisplay.textContent = currentExpression;
            }
        }
        return;
    }

    // Handle equals (=) button
    if (action === 'calculate') {
        if (currentExpression === '') {
            return;
        }

        try {
            const result = safeEvaluate(currentExpression);
            
            expressionDisplay.textContent = currentExpression + ' =';
            resultDisplay.textContent = parseFloat(result.toFixed(7));

            currentExpression = '';
            lastInputIsOperator = false;
        } catch (e) {
            resultDisplay.textContent = 'Error';
            expressionDisplay.textContent = '';
            currentExpression = '';
        }
        return;
    }

    // Handle operator buttons
    if (operator) {
        if (lastInputIsOperator) {
            currentExpression = currentExpression.slice(0, -1) + getOperatorSymbol(operator);
        } else if (currentExpression !== '') {
            currentExpression += getOperatorSymbol(operator);
        }
        resultDisplay.textContent = currentExpression;
        lastInputIsOperator = true;
        return;
    }

    // Handle all other buttons (numbers and decimal)
    // This now serves as the final catch-all for non-action/non-operator buttons
    if (keyContent === '.') {
        if (!currentExpression.includes('.')) {
            currentExpression += keyContent;
        }
    } else {
        currentExpression += keyContent;
    }
    
    resultDisplay.textContent = currentExpression;
    lastInputIsOperator = false;
});

function clearCalculator() {
    expressionDisplay.textContent = '';
    resultDisplay.textContent = '0';
    currentExpression = '';
    lastInputIsOperator = false;
}

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

function safeEvaluate(expression) {
    const safeExpression = expression.replace(/(\d+)%/g, '($1 / 100)');
    
    const allowedChars = /^[0-9+\-*/.() ]+$/;
    if (!allowedChars.test(safeExpression)) {
        throw new Error('Invalid characters in expression');
    }

    return Function('"use strict";return (' + safeExpression + ')')();
}

