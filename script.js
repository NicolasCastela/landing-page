// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Typing animation
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.getAttribute('data-text');
        setTimeout(() => {
            typeWriter(typingElement, text, 150);
        }, 1000);
    }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    updateCounter();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate counters when stats section is visible
            if (entry.target.classList.contains('stats')) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .stats, .about-text, .contact-form');
    animateElements.forEach(el => observer.observe(el));
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.particles');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Add glow effect to cards on hover
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 20px 40px rgba(0, 255, 255, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

// Cursor trail effect
let mouseX = 0;
let mouseY = 0;
let trail = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function createTrail() {
    trail.push({ x: mouseX, y: mouseY });
    
    if (trail.length > 10) {
        trail.shift();
    }
    
    const trailElements = document.querySelectorAll('.cursor-trail');
    trailElements.forEach(el => el.remove());
    
    trail.forEach((point, index) => {
        const trailElement = document.createElement('div');
        trailElement.className = 'cursor-trail';
        trailElement.style.cssText = `
            position: fixed;
            width: ${10 - index}px;
            height: ${10 - index}px;
            background: rgba(0, 255, 255, ${0.5 - index * 0.05});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${point.x}px;
            top: ${point.y}px;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(trailElement);
    });
    
    requestAnimationFrame(createTrail);
}

// Start cursor trail
createTrail();

// Add loading animation
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-text">GUNIC</div>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
        </div>
    `;
    
    const loaderStyles = `
        .loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeOut 0.5s ease 2s forwards;
        }
        
        .loader-content {
            text-align: center;
        }
        
        .loader-text {
            font-family: 'Orbitron', monospace;
            font-size: 3rem;
            font-weight: 900;
            background: linear-gradient(45deg, #00ffff, #ff0080);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
            animation: pulse 1s ease-in-out infinite;
        }
        
        .loader-bar {
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .loader-progress {
            width: 0;
            height: 100%;
            background: linear-gradient(90deg, #00ffff, #ff0080);
            border-radius: 2px;
            animation: loading 2s ease-in-out forwards;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 1; }
        }
        
        @keyframes loading {
            0% { width: 0; }
            100% { width: 100%; }
        }
        
        @keyframes fadeOut {
            to { opacity: 0; visibility: hidden; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = loaderStyles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.remove();
    }, 2500);
});