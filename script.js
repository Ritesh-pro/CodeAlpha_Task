class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.isError = false;
        
        this.currentOperandElement = document.getElementById('current-operand');
        this.previousOperandElement = document.getElementById('previous-operand');
        this.calculatorElement = document.querySelector('.calculator');
        
        this.initializeEventListeners();
        this.updateDisplay();
    }
    
    initializeEventListeners() {
        // Button click events
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleButtonClick(e.target.closest('.btn'));
            });
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
        
        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    handleButtonClick(button) {
        if (!button) return;
        
        // Add click animation
        this.addClickAnimation(button);
        
        // Special effect for equals button
        if (button.classList.contains('btn-equals')) {
            this.addEqualsButtonEffect(button);
        }
        
        const action = button.dataset.action;
        const number = button.dataset.number;
        
        if (number !== undefined) {
            this.appendNumber(number);
        } else if (action) {
            this.handleAction(action);
        }
    }
    
    addEqualsButtonEffect(button) {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: 100px;
            height: 100px;
            top: 50%;
            left: 50%;
            margin-top: -50px;
            margin-left: -50px;
        `;
        
        button.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
        
        // Vibration effect for mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    handleKeyboardInput(e) {
        e.preventDefault();
        
        // Find corresponding button for visual feedback
        const key = e.key;
        const button = document.querySelector(`[data-key="${key}"]`);
        
        if (button) {
            this.addClickAnimation(button);
        }
        
        // Handle number keys
        if (/[0-9]/.test(key)) {
            this.appendNumber(key);
        }
        // Handle decimal point
        else if (key === '.') {
            this.appendNumber('.');
        }
        // Handle operators
        else if (['+', '-', '*', '/'].includes(key)) {
            const actionMap = {
                '+': 'add',
                '-': 'subtract',
                '*': 'multiply',
                '/': 'divide'
            };
            this.handleAction(actionMap[key]);
        }
        // Handle equals
        else if (key === 'Enter' || key === '=') {
            this.handleAction('equals');
        }
        // Handle clear
        else if (key === 'Escape') {
            this.handleAction('clear');
        }
        // Handle delete
        else if (key === 'Backspace') {
            this.handleAction('delete');
        }
        // Handle percent
        else if (key === '%') {
            this.handleAction('percent');
        }
        // Handle new function keys
        else if (key === 's') {
            this.handleAction('sqrt');
        }
        else if (key === 'q') {
            this.handleAction('square');
        }
        else if (key === 'p') {
            this.handleAction('power');
        }
        else if (key === 'f') {
            this.handleAction('factorial');
        }
        else if (key === 'r') {
            this.handleAction('reciprocal');
        }
    }
    
    addClickAnimation(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
    
    appendNumber(number) {
        if (this.isError) {
            this.clear();
        }
        
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        
        this.updateDisplay();
    }
    
    handleAction(action) {
        if (this.isError) {
            this.clear();
        }
        
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'percent':
                this.percent();
                break;
            case 'sqrt':
                this.sqrt();
                break;
            case 'square':
                this.square();
                break;
            case 'power':
                this.power();
                break;
            case 'factorial':
                this.factorial();
                break;
            case 'reciprocal':
                this.reciprocal();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.chooseOperation(action);
                break;
            case 'equals':
                this.compute();
                break;
        }
    }
    
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.isError = false;
        this.calculatorElement.classList.remove('error');
        this.updateDisplay();
    }
    
    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }
    
    percent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }
    
    sqrt() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        if (current < 0) {
            this.handleError('Invalid input for square root');
            return;
        }
        
        this.currentOperand = Math.sqrt(current).toString();
        this.updateDisplay();
    }
    
    square() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        this.currentOperand = (current * current).toString();
        this.updateDisplay();
    }
    
    power() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        // Store current number and wait for exponent
        this.previousOperand = this.currentOperand;
        this.operation = 'power';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    factorial() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        if (current < 0 || !Number.isInteger(current)) {
            this.handleError('Invalid input for factorial');
            return;
        }
        if (current > 170) {
            this.handleError('Number too large for factorial');
            return;
        }
        
        let result = 1;
        for (let i = 2; i <= current; i++) {
            result *= i;
        }
        
        this.currentOperand = result.toString();
        this.updateDisplay();
    }
    
    reciprocal() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        if (current === 0) {
            this.handleError('Division by zero');
            return;
        }
        
        this.currentOperand = (1 / current).toString();
        this.updateDisplay();
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
        this.updateDisplay();
    }
    
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        try {
            switch (this.operation) {
                case 'add':
                    computation = prev + current;
                    break;
                case 'subtract':
                    computation = prev - current;
                    break;
                case 'multiply':
                    computation = prev * current;
                    break;
                case 'divide':
                    if (current === 0) {
                        throw new Error('Division by zero');
                    }
                    computation = prev / current;
                    break;
                case 'power':
                    computation = Math.pow(prev, current);
                    break;
                default:
                    return;
            }
            
            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            this.shouldResetScreen = true;
            this.isError = false;
            this.calculatorElement.classList.remove('error');
            
            // Add special equals button effect
            this.addEqualsEffect();
            
        } catch (error) {
            this.handleError(error.message);
        }
        
        this.updateDisplay();
    }
    
    addEqualsEffect() {
        // Add success animation to calculator
        this.calculatorElement.style.animation = 'equalsSuccess 0.5s ease-in-out';
        
        // Add sparkle effect to equals button
        const equalsButton = document.querySelector('.btn-equals');
        if (equalsButton) {
            equalsButton.style.animation = 'equalsSuccess 0.5s ease-in-out';
            
            // Show calculating effect
            this.showCalculatingEffect(equalsButton);
            
            // Create sparkle particles
            this.createSparkles(equalsButton);
        }
        
        // Remove animation after completion
        setTimeout(() => {
            this.calculatorElement.style.animation = '';
            if (equalsButton) {
                equalsButton.style.animation = '';
            }
        }, 500);
    }
    
    showCalculatingEffect(button) {
        const calcText = button.querySelector('.btn-text-secondary');
        if (calcText) {
            const originalText = calcText.textContent;
            calcText.textContent = 'CALC...';
            calcText.style.color = '#fff';
            calcText.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
            
            setTimeout(() => {
                calcText.textContent = originalText;
                calcText.style.color = '';
                calcText.style.textShadow = '';
            }, 300);
        }
    }
    
    createSparkles(button) {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const colors = ['#28a745', '#20c997', '#17a2b8', '#6f42c1', '#fd7e14'];
        
        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Random direction for each sparkle
            const angle = (i / 12) * 2 * Math.PI;
            const distance = 60 + Math.random() * 40;
            const sparkleX = Math.cos(angle) * distance;
            const sparkleY = Math.sin(angle) * distance;
            
            sparkle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: ${3 + Math.random() * 3}px;
                height: ${3 + Math.random() * 3}px;
                background: ${colors[i % colors.length]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: sparkleAnim 0.8s ease-out forwards;
                --sparkle-x: ${sparkleX}px;
                --sparkle-y: ${sparkleY}px;
            `;
            
            document.body.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 800);
        }
    }
    
    handleError(message) {
        this.isError = true;
        this.calculatorElement.classList.add('error');
        this.currentOperand = 'Error';
        this.previousOperand = '';
        this.operation = undefined;
        
        // Remove error state after 2 seconds
        setTimeout(() => {
            if (this.isError) {
                this.clear();
            }
        }, 2000);
    }
    
    getDisplayNumber(number) {
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
        // Add animation class for smooth transitions
        this.currentOperandElement.style.opacity = '0.7';
        this.previousOperandElement.style.opacity = '0.7';
        
        setTimeout(() => {
            this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
            this.previousOperandElement.textContent = this.formatPreviousOperand();
            
            this.currentOperandElement.style.opacity = '1';
            this.previousOperandElement.style.opacity = '1';
        }, 50);
    }
    
    formatPreviousOperand() {
        if (this.operation == null || this.previousOperand === '') return '';
        
        const operationSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷',
            'power': '^'
        };
        
        return `${this.getDisplayNumber(this.previousOperand)} ${operationSymbols[this.operation]}`;
    }
    
    // Add some fun Easter eggs and additional features
    addFunFeatures() {
        // Konami code easter egg
        let konamiCode = [];
        const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        
        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.code);
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.join(',') === konamiSequence.join(',')) {
                this.activateEasterEgg();
                konamiCode = [];
            }
        });
    }
    
    activateEasterEgg() {
        // Add rainbow effect to calculator
        this.calculatorElement.style.animation = 'rainbow 2s ease-in-out infinite';
        
        // Add rainbow keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Remove effect after 5 seconds
        setTimeout(() => {
            this.calculatorElement.style.animation = '';
        }, 5000);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    calculator.addFunFeatures();
    
    // Add loading animation
    const calculatorElement = document.querySelector('.calculator');
    calculatorElement.classList.add('loading');
    
    setTimeout(() => {
        calculatorElement.classList.remove('loading');
    }, 1000);
    
    // Add some interactive background effects
    document.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.particle');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
});

// Add touch support for mobile devices
document.addEventListener('touchstart', (e) => {
    const button = e.target.closest('.btn');
    if (button) {
        button.style.transform = 'scale(0.95)';
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const button = e.target.closest('.btn');
    if (button) {
        setTimeout(() => {
            button.style.transform = '';
        }, 100);
    }
}, { passive: true });

// Add performance optimization
let animationFrameId;
function optimizeAnimations() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
        // Smooth animations here if needed
    });
}

// Add window resize handling
window.addEventListener('resize', () => {
    optimizeAnimations();
});

// Add visibility change handling for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }
});

// Scroll to top functionality
class ScrollToTop {
    constructor() {
        this.scrollButton = document.getElementById('scroll-to-top');
        this.init();
    }
    
    init() {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            this.toggleScrollButton();
        });
        
        // Scroll to top when button is clicked
        this.scrollButton.addEventListener('click', () => {
            this.scrollToTop();
        });
        
        // Add keyboard support (Space or Enter)
        this.scrollButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });
    }
    
    toggleScrollButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            this.scrollButton.classList.add('show');
        } else {
            this.scrollButton.classList.remove('show');
        }
    }
    
    scrollToTop() {
        // Add click animation
        this.scrollButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.scrollButton.style.transform = '';
        }, 150);
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add success effect
        this.addScrollEffect();
    }
    
    addScrollEffect() {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: 100px;
            height: 100px;
            top: 50%;
            left: 50%;
            margin-top: -50px;
            margin-left: -50px;
        `;
        
        this.scrollButton.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
        
        // Vibration effect for mobile
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    }
}

// Initialize scroll to top when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollToTop();
});

// Function to go back to landing page
function goToLanding() {
    // Add exit animation
    document.body.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    // Redirect to landing page after animation
    setTimeout(() => {
        window.location.href = 'landing.html';
    }, 500);
}

// Add CSS for fade out animation
const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.9);
        }
    }
`;
document.head.appendChild(fadeOutStyle); 