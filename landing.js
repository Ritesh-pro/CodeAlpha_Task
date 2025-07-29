// Landing page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add sparkle effect to enter button
    const enterButton = document.querySelector('.enter-button');
    const buttonSparkles = document.querySelector('.button-sparkles');
    
    // Create sparkles on button hover
    enterButton.addEventListener('mouseenter', function() {
        createSparkles(buttonSparkles);
    });
    
    // Add click sound effect (if supported)
    enterButton.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        // Vibration feedback for mobile
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            enterCalculator();
        }
    });
    
    // Add mouse movement parallax effect
    document.addEventListener('mousemove', function(e) {
        const instruments = document.querySelectorAll('.instrument');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        instruments.forEach((instrument, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            instrument.style.transform += ` translate(${x}px, ${y}px)`;
        });
    });
    
    // Add scroll-triggered animations
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.landing-container');
        const speed = scrolled * 0.5;
        
        parallax.style.transform = `translateY(${speed}px)`;
    });
});

// Function to create sparkles
function createSparkles(container) {
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            animation: sparkleAnim 0.8s ease-out forwards;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 800);
    }
}

// Function to enter calculator
function enterCalculator() {
    // Add exit animation
    const landingContainer = document.querySelector('.landing-container');
    landingContainer.style.animation = 'fadeOut 0.5s ease-out forwards';
    
    // Add loading effect
    const enterButton = document.querySelector('.enter-button');
    const buttonText = enterButton.querySelector('.button-text');
    buttonText.textContent = 'Loading...';
    enterButton.style.pointerEvents = 'none';
    
    // Redirect to calculator after animation
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

// Add CSS for fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleAnim {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: scale(1) rotate(180deg);
            opacity: 0;
        }
    }
    
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
document.head.appendChild(style);

// Add interactive hover effects for instruments
document.addEventListener('DOMContentLoaded', function() {
    const instruments = document.querySelectorAll('.instrument');
    
    instruments.forEach(instrument => {
        instrument.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.2)';
            this.style.zIndex = '100';
            
            // Add glow effect
            this.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))';
        });
        
        instrument.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.2)', '');
            this.style.zIndex = '2';
            this.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))';
        });
    });
});

// Add typing effect for title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('.main-title');
    const originalText = title.textContent;
    
    // Uncomment the line below to enable typing effect
    // typeWriter(title, originalText, 150);
});

// Add particle interaction
document.addEventListener('DOMContentLoaded', function() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach(particle => {
        particle.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.8)';
            this.style.transform = 'scale(2)';
        });
        
        particle.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.3)';
            this.style.transform = 'scale(1)';
        });
    });
});

// Add equation hover effects
document.addEventListener('DOMContentLoaded', function() {
    const equations = document.querySelectorAll('.equation');
    
    equations.forEach(equation => {
        equation.addEventListener('mouseenter', function() {
            this.style.color = 'rgba(255, 255, 255, 1)';
            this.style.transform += ' scale(1.1)';
            this.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        });
        
        equation.addEventListener('mouseleave', function() {
            this.style.color = 'rgba(255, 255, 255, 0.6)';
            this.style.transform = this.style.transform.replace(' scale(1.1)', '');
            this.style.textShadow = 'none';
        });
    });
}); 