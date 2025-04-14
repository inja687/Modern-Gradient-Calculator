class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }
        this.currentOperand = String(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    percent() {
        this.currentOperand = parseFloat(this.currentOperand) / 100;
        this.updateDisplay();
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { 
                maximumFractionDigits: 0 
            });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

const previousOperandElement = document.querySelector('.previous-operand');
const currentOperandElement = document.querySelector('.current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Event listeners for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height) * 2}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        setTimeout(() => {
            ripple.remove();
        }, 500);
        
        // Calculator logic
        if (button.hasAttribute('data-number')) {
            calculator.appendNumber(button.getAttribute('data-number'));
        } else if (button.hasAttribute('data-action')) {
            const action = button.getAttribute('data-action');
            
            switch (action) {
                case 'clear':
                    calculator.clear();
                    break;
                case 'delete':
                    calculator.delete();
                    break;
                case 'add':
                    calculator.chooseOperation('+');
                    break;
                case 'subtract':
                    calculator.chooseOperation('-');
                    break;
                case 'multiply':
                    calculator.chooseOperation('×');
                    break;
                case 'divide':
                    calculator.chooseOperation('÷');
                    break;
                case 'percent':
                    calculator.percent();
                    break;
                case 'calculate':
                    calculator.calculate();
                    break;
            }
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') calculator.appendNumber(e.key);
    if (e.key === '.') calculator.appendNumber(e.key);
    if (e.key === '+') calculator.chooseOperation('+');
    if (e.key === '-') calculator.chooseOperation('-');
    if (e.key === '*') calculator.chooseOperation('×');
    if (e.key === '/') calculator.chooseOperation('÷');
    if (e.key === '%') calculator.percent();
    if (e.key === 'Enter' || e.key === '=') calculator.calculate();
    if (e.key === 'Backspace') calculator.delete();
    if (e.key === 'Escape') calculator.clear();
});