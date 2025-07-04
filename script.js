// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize Particles.js
particlesJS('particles-js', {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: '#00ffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00ffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        },
        modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200, duration: 0.4 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
        }
    },
    retina_detect: true
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Smooth scrolling for nav links
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

// Enhanced typing animation with cursor blink
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML = text.substring(0, i + 1) + '<span class="cursor-blink">|</span>';
            i++;
            setTimeout(type, speed);
        } else {
            // Remove cursor after typing is complete
            setTimeout(() => {
                element.innerHTML = text;
            }, 1000);
        }
    }
    
    // Add cursor blink styles
    if (!document.querySelector('#cursor-styles')) {
        const cursorStyles = document.createElement('style');
        cursorStyles.id = 'cursor-styles';
        cursorStyles.textContent = `
            .cursor-blink {
                animation: blink 1s infinite;
            }
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(cursorStyles);
    }
    
    type();
}

// Enhanced typing animation
window.addEventListener('load', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.getAttribute('data-text');
        setTimeout(() => {
            typeWriter(typingElement, text, 120);
        }, 4000); // Start after loader
    }
});

// Enhanced counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const current = Math.floor(start + (target - start) * easeOutQuart);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize Swiper for projects carousel
const projectsSwiper = new Swiper('.projects-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    },
});

// Dynamic Banner Animation
function initDynamicBanner() {
    const bannerItems = document.querySelectorAll('.banner-item');
    let currentIndex = 0;

    function showNextBanner() {
        bannerItems[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % bannerItems.length;
        bannerItems[currentIndex].classList.add('active');
    }

    setInterval(showNextBanner, 4000);
}

// Enhanced intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Add staggered animation for service cards
            if (entry.target.classList.contains('services-grid')) {
                const cards = entry.target.querySelectorAll('.service-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, index * 200);
                });
            }
            
            // Add staggered animation for innovation cards
            if (entry.target.classList.contains('innovations-grid')) {
                const cards = entry.target.querySelectorAll('.innovation-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, index * 150);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.services-grid, .innovations-grid, .about-text, .contact-form');
    animateElements.forEach(el => observer.observe(el));
});

// Add intersection observer for counter animations
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-target]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target, 2000);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe stats section
const statsSection = document.querySelector('.stats');
if (statsSection) {
    counterObserver.observe(statsSection);
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const particles = document.getElementById('particles-js');
    if (particles) {
        particles.style.transform = `translateY(${rate}px)`;
    }
    
    const header = document.querySelector('.header');
    if (header) {
        const opacity = Math.min(scrolled / 100, 0.95);
        header.style.background = `rgba(10, 10, 10, ${opacity})`;
    }
    
    // Update scroll progress
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
}, 16);

window.addEventListener('scroll', throttledScroll);

// Enhanced mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            animation: slideInRight 0.3s ease, slideOutRight 0.3s ease 3s forwards;
            backdrop-filter: blur(10px);
        }
        
        .notification.success {
            background: rgba(0, 255, 128, 0.9);
            border: 1px solid rgba(0, 255, 128, 0.3);
        }
        
        .notification.error {
            background: rgba(255, 0, 128, 0.9);
            border: 1px solid rgba(255, 0, 128, 0.3);
        }
        
        .notification.info {
            background: rgba(124, 58, 237, 0.9);
            border: 1px solid rgba(124, 58, 237, 0.3);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3500);
}

// Enhanced form submission with AI integration
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Enhanced validation
        if (!name || !email || !message) {
            showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Por favor, insira um email válido.', 'error');
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simulate AI analysis of the message
        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Nossa IA analisou sua solicitação e nossa equipe entrará em contato em breve.', 'success');
            
            // Add to chatbot context
            conversationHistory.push({
                sender: 'system',
                text: `Novo contato: ${name} (${email}) - ${message}`,
                timestamp: new Date()
            });
            
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Suggest opening chatbot
            setTimeout(() => {
                if (!chatbotOpen) {
                    showNotification('💬 Quer continuar a conversa? Nossa IA pode responder suas dúvidas agora!', 'info');
                    document.getElementById('chatbotToggle').style.animation = 'pulse 1s infinite';
                }
            }, 3000);
        }, 2000);
    });
}

// Enhanced Service Cards Interaction
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) rotateX(5deg)';
        this.style.boxShadow = '0 25px 50px rgba(0, 255, 255, 0.4)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotateX(0)';
        this.style.boxShadow = 'none';
    });
});

// Enhanced project cards interaction
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        this.style.boxShadow = '0 25px 50px rgba(0, 255, 255, 0.4)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = 'none';
    });
});

// Innovation Cards 3D Effect
document.querySelectorAll('.innovation-card').forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Enhanced cursor trail effect
let mouseX = 0;
let mouseY = 0;
let trail = [];
let isMoving = false;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    
    setTimeout(() => {
        isMoving = false;
    }, 100);
});

function createTrail() {
    if (isMoving) {
        trail.push({ 
            x: mouseX, 
            y: mouseY, 
            time: Date.now() 
        });
    }
    
    // Remove old trail points
    trail = trail.filter(point => Date.now() - point.time < 1000);
    
    const trailElements = document.querySelectorAll('.cursor-trail');
    trailElements.forEach(el => el.remove());
    
    trail.forEach((point, index) => {
        const age = Date.now() - point.time;
        const opacity = Math.max(0, 1 - age / 1000);
        const size = Math.max(2, 12 - index * 0.8);
        
        const trailElement = document.createElement('div');
        trailElement.className = 'cursor-trail';
        trailElement.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(0, 255, 255, ${opacity * 0.8}), rgba(255, 0, 128, ${opacity * 0.4}));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            left: ${point.x}px;
            top: ${point.y}px;
            transform: translate(-50%, -50%);
            transition: all 0.1s ease;
        `;
        document.body.appendChild(trailElement);
    });
    
    requestAnimationFrame(createTrail);
}

// Scroll Progress Indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, #00ffff, #ff0080);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
}

// Add floating elements animation
function createFloatingElements() {
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    floatingContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    for (let i = 0; i < 5; i++) {
        const element = document.createElement('div');
        element.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: ${['#00ffff', '#ff0080', '#7c3aed'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s infinite linear;
            opacity: 0.6;
        `;
        floatingContainer.appendChild(element);
    }
    
    document.body.appendChild(floatingContainer);
}

// Add loading animation with enhanced effects
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">
                <div class="loader-text">GUNIC</div>
                <div class="loader-subtitle">Loading Innovation...</div>
            </div>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
            <div class="loader-percentage">0%</div>
        </div>
    `;
    
    const loaderStyles = `
        .loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0a, #1a0a1a);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeOut 0.8s ease 3s forwards;
        }
        
        .loader-content {
            text-align: center;
        }
        
        .loader-logo {
            margin-bottom: 3rem;
        }
        
        .loader-text {
            font-family: 'Orbitron', monospace;
            font-size: 4rem;
            font-weight: 900;
            background: linear-gradient(45deg, #00ffff, #ff0080, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        .loader-subtitle {
            color: #a0a0a0;
            font-size: 1.2rem;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .loader-bar {
            width: 400px;
            height: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 1rem;
        }
        
        .loader-progress {
            width: 0;
            height: 100%;
            background: linear-gradient(90deg, #00ffff, #ff0080, #7c3aed);
            border-radius: 3px;
            animation: loading 2.5s ease-in-out forwards;
        }
        
        .loader-percentage {
            color: #00ffff;
            font-family: 'Orbitron', monospace;
            font-size: 1.5rem;
            font-weight: 700;
        }
        
        @keyframes glow {
            from { text-shadow: 0 0 20px #00ffff; }
            to { text-shadow: 0 0 40px #00ffff, 0 0 60px #ff0080; }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.6; }
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
    
    // Animate percentage
    const percentage = loader.querySelector('.loader-percentage');
    let count = 0;
    const interval = setInterval(() => {
        count += Math.random() * 15;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
        }
        percentage.textContent = Math.floor(count) + '%';
    }, 100);
    
    setTimeout(() => {
        loader.remove();
        createScrollProgress();
    }, 3500);
});

// Start cursor trail
createTrail();

// Initialize dynamic banner
initDynamicBanner();

// Initialize floating elements
setTimeout(createFloatingElements, 4000);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Add focus management for accessibility
document.querySelectorAll('a, button, input, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid #00ffff';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Add resize handler for responsive adjustments
window.addEventListener('resize', throttle(() => {
    // Reinitialize Swiper on resize
    if (typeof projectsSwiper !== 'undefined') {
        projectsSwiper.update();
    }
    
    // Adjust particles.js on resize
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
}, 250));

// AI Chatbot Functionality
let chatbotOpen = false;
let conversationHistory = [];

// Toggle chatbot visibility
function toggleChatbot() {
    const chatbot = document.getElementById('aiChatbot');
    const toggle = document.getElementById('chatbotToggle');
    
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbot.style.display = 'flex';
        chatbot.style.animation = 'slideInUp 0.3s ease';
        toggle.querySelector('.notification-badge').style.display = 'none';
    } else {
        chatbot.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            chatbot.style.display = 'none';
        }, 300);
    }
}

// Handle chat input
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send message function
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        let response;
        if (isAIConfigured()) {
            // Use real AI
            response = await callAI(message);
        } else {
            // Fallback to simulated response
            await new Promise(resolve => setTimeout(resolve, 1500));
            response = generateAIResponse(message);
        }
        
        hideTypingIndicator();
        addMessage(response, 'bot');
        
    } catch (error) {
        hideTypingIndicator();
        addMessage('Desculpe, ocorreu um erro. Tente novamente! 🤖', 'bot');
        console.error('Chat error:', error);
    }
}

// Quick message function
function sendQuickMessage(message) {
    document.getElementById('chatInput').value = message;
    sendMessage();
}

// Add message to chat
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${avatar}
        </div>
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store in conversation history
    conversationHistory.push({ sender, text, timestamp: new Date() });
}

// Show/hide typing indicator
function showTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'flex';
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').style.display = 'none';
}

// AI Response Generator (Simulated)
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Predefined responses based on keywords
    const responses = {
        'serviços': 'Oferecemos serviços de IA & Machine Learning, Sistemas Médicos, Apps Mobile e Cloud Solutions. Qual área te interessa mais? 🚀',
        'orçamento': 'Ótimo! Para criar um orçamento personalizado, preciso saber mais sobre seu projeto. Pode me contar sobre: \n• Tipo de solução desejada\n• Prazo estimado\n• Orçamento aproximado\n\nOu prefere agendar uma conversa? 📞',
        'ia': 'A Inteligência Artificial é nossa especialidade! 🤖 Desenvolvemos:\n• Sistemas de diagnóstico médico\n• Chatbots inteligentes\n• Análise preditiva\n• Computer Vision\n• NLP (Processamento de Linguagem Natural)\n\nQual aplicação de IA você tem em mente?',
        'preço': 'Nossos preços variam conforme a complexidade do projeto. Temos opções desde R$ 5.000 para MVPs até projetos enterprise de R$ 100.000+. Quer discutir seu caso específico? 💰',
        'contato': 'Você pode entrar em contato conosco:\n📧 contato@gunic.com\n📱 +55 (11) 99999-9999\n📍 São Paulo, Brasil\n\nOu use o formulário na seção de contato! 😊',
        'portfolio': 'Confira alguns dos nossos projetos:\n• MedIA - Diagnóstico por IA (95% precisão)\n• HealthConnect - Telemedicina\n• DataViz Pro - Analytics em tempo real\n• SecureCloud - Segurança na nuvem\n\nQuer ver mais detalhes de algum projeto? 📂',
        'tecnologia': 'Trabalhamos com tecnologias de ponta:\n• Python, JavaScript, React, Node.js\n• TensorFlow, PyTorch para IA\n• AWS, Azure, Google Cloud\n• Docker, Kubernetes\n• MongoDB, PostgreSQL\n\nQual tecnologia te interessa? ⚡',
        'inovação': 'Estamos sempre inovando! 🚀 Nossos projetos futuristas incluem:\n• Realidade Virtual Médica\n• IA Genética Personalizada\n• IoT Espacial\n• Neural Interface\n• Blockchain Quântico\n\nQual inovação te chama atenção?'
    };
    
    // Find matching response
    for (const [keyword, response] of Object.entries(responses)) {
        if (message.includes(keyword)) {
            return response;
        }
    }
    
    // Default responses
    const defaultResponses = [
        'Interessante! Pode me dar mais detalhes sobre isso? 🤔',
        'Entendi! Como posso ajudar você com isso? 💡',
        'Ótima pergunta! Vou conectar você com nossa equipe especializada. Enquanto isso, posso te ajudar com mais alguma coisa? 🎯',
        'Hmm, não tenho certeza sobre isso. Que tal falarmos com um de nossos especialistas? Posso agendar uma conversa para você! 📅',
        'Posso te ajudar melhor se você me contar mais sobre seu projeto ou necessidade específica. O que você tem em mente? 🚀'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Code Generator with Real AI
async function generateCode() {
    const prompt = document.getElementById('codePrompt').value;
    const language = document.getElementById('codeLanguage').value;
    const output = document.getElementById('codeOutput');
    const codeElement = document.getElementById('generatedCode');
    
    if (!prompt.trim()) {
        showNotification('Por favor, descreva o que você quer criar!', 'error');
        return;
    }
    
    // Show loading
    codeElement.textContent = 'Gerando código com IA... 🤖';
    output.style.display = 'block';
    
    try {
        let generatedCode;
        if (isAIConfigured()) {
            generatedCode = await generateCodeWithAI(prompt, language);
        } else {
            await new Promise(resolve => setTimeout(resolve, 2000));
            generatedCode = simulateCodeGeneration(prompt, language);
        }
        
        codeElement.textContent = generatedCode;
        codeElement.style.animation = 'fadeIn 0.5s ease';
        
        showNotification('Código gerado com sucesso! 🎉', 'success');
        
    } catch (error) {
        codeElement.textContent = 'Erro ao gerar código. Tente novamente.';
        showNotification('Erro na geração de código', 'error');
        console.error('Code generation error:', error);
    }
}

// Simulate code generation based on prompt and language
function simulateCodeGeneration(prompt, language) {
    const codeTemplates = {
        javascript: {
            'validar cpf': `function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11 || /^(\d)\\1{10}$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf[i]) * (10 - i);
    }
    
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cpf[9]) !== digito1) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf[i]) * (11 - i);
    }
    
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;
    
    return parseInt(cpf[10]) === digito2;
}`,
            'api fetch': `async function fetchData(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        throw error;
    }
}`,
            default: `// Código JavaScript gerado pela IA da GUNIC
// Baseado em: "${prompt}"

function solucaoPersonalizada() {
    // TODO: Implementar lógica específica
    console.log('Funcionalidade em desenvolvimento...');
    
    // Estrutura base para sua solução
    const config = {
        // Configurações aqui
    };
    
    // Lógica principal
    return {
        executar: () => {
            // Sua implementação aqui
        },
        config
    };
}

// Uso:
// const solucao = solucaoPersonalizada();
// solucao.executar();`
        },
        python: {
            default: `# Código Python gerado pela IA da GUNIC
# Baseado em: "${prompt}"

def solucao_personalizada():
    """Função gerada automaticamente pela IA"""
    
    # TODO: Implementar lógica específica
    print("Funcionalidade em desenvolvimento...")
    
    # Estrutura base para sua solução
    config = {
        # Configurações aqui
    }
    
    return config

if __name__ == "__main__":
    resultado = solucao_personalizada()
    print(f"Resultado: {resultado}")`
        },
        html: {
            default: `<!-- HTML gerado pela IA da GUNIC -->
<!-- Baseado em: "${prompt}" -->

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Personalizada</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Sua Página Personalizada</h1>
        <p>Conteúdo gerado automaticamente pela IA da GUNIC.</p>
        <!-- Adicione seu conteúdo aqui -->
    </div>
</body>
</html>`
        }
    };
    
    const langTemplates = codeTemplates[language] || codeTemplates.javascript;
    
    // Try to find a matching template
    for (const [key, template] of Object.entries(langTemplates)) {
        if (prompt.toLowerCase().includes(key)) {
            return template;
        }
    }
    
    return langTemplates.default || `// Código ${language} personalizado\n// Baseado em: "${prompt}"\n\n// TODO: Implementar funcionalidade`;
}

// Copy code function
function copyCode() {
    const code = document.getElementById('generatedCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Código copiado para a área de transferência! 📋', 'success');
    }).catch(() => {
        showNotification('Erro ao copiar código', 'error');
    });
}

// Voice synthesis (Text-to-Speech)
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

// Add voice button to bot messages
function addVoiceButton(messageElement) {
    const voiceBtn = document.createElement('button');
    voiceBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    voiceBtn.className = 'voice-btn';
    voiceBtn.onclick = () => {
        const text = messageElement.querySelector('p').textContent;
        speakText(text);
    };
    messageElement.querySelector('.message-content').appendChild(voiceBtn);
}

// Initialize AI features
document.addEventListener('DOMContentLoaded', () => {
    // Carregar configuração de IA
    loadAIConfig();
    
    // Show AI status
    showAIStatus();
    // Add CSS for voice button
    const voiceStyles = `
        .voice-btn {
            background: rgba(0, 255, 255, 0.2);
            border: 1px solid var(--primary-color);
            color: var(--primary-color);
            padding: 0.3rem 0.6rem;
            border-radius: 15px;
            font-size: 0.8rem;
            cursor: pointer;
            margin-top: 0.5rem;
            transition: all 0.3s ease;
        }
        
        .voice-btn:hover {
            background: var(--primary-color);
            color: var(--bg-dark);
        }
        
        @keyframes slideInUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideOutDown {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = voiceStyles;
    document.head.appendChild(styleSheet);
    
    // Show notification about AI features
    setTimeout(() => {
        if (!chatbotOpen) {
            const aiStatus = isAIConfigured() ? 'IA Real' : 'IA Demo';
            showNotification(`🤖 ${aiStatus} disponível! Clique no botão para conversar`, 'info');
        }
    }, 5000);
});

console.log('🚀 GUNIC Company - Landing Page Loaded Successfully!');
console.log('💡 Enhanced with modern libraries and effects');
console.log('🎨 Featuring: AOS, Swiper, Particles.js, and custom animations');
console.log('🤖 NEW: AI Chatbot and Code Generator integrated!');