// DOM elements
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const typedTextElement = document.getElementById('typed-text');
const contactForm = document.getElementById('contact-form');

// Typing animation data
const typingTexts = [
    'Bioinformatics Researcher',
    'Computational Biologist',
    'Machine Learning Expert',
    'Genomics Specialist'
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeScrollAnimations();
    initializeNavigation();
    initializeTypingAnimation();
    initializeContactForm();
    initializeNavbarScroll();
    animateSkillItems();
    animateCounters();
});

// Smooth scroll function
function smoothScrollTo(targetId) {
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for navbar height
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        return true;
    }
    return false;
}

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add staggered animation for skill items and timeline items
                if (entry.target.classList.contains('skill-category')) {
                    const skillItems = entry.target.querySelectorAll('.skill-item');
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `fadeInUp 0.6s ease-out forwards`;
                        }, index * 100);
                    });
                }

                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.animationDelay = `${Array.from(document.querySelectorAll('.timeline-item')).indexOf(entry.target) * 200}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    const elementsToAnimate = document.querySelectorAll('.fade-in-up');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Handle navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            
            // Get target section and scroll
            const targetId = link.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });

    // Handle all anchor links with href starting with #
    document.addEventListener('click', function(e) {
        // Check if the clicked element is an anchor with href starting with #
        if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            smoothScrollTo(targetId);
        }
        
        // Also check parent elements in case of nested elements (like buttons with text/icons)
        let parent = e.target.parentElement;
        while (parent && parent.tagName !== 'BODY') {
            if (parent.tagName === 'A' && parent.getAttribute('href') && parent.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = parent.getAttribute('href');
                smoothScrollTo(targetId);
                break;
            }
            parent = parent.parentElement;
        }
    });

    // Update active nav link based on scroll position
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Navbar scroll effects
function initializeNavbarScroll() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Typing animation
function initializeTypingAnimation() {
    function typeText() {
        const currentText = typingTexts[currentTextIndex];
        
        if (!isDeleting && currentCharIndex < currentText.length) {
            // Typing
            typedTextElement.textContent = currentText.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 150;
        } else if (isDeleting && currentCharIndex > 0) {
            // Deleting
            typedTextElement.textContent = currentText.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 75;
        } else if (!isDeleting && currentCharIndex === currentText.length) {
            // Pause before deleting
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && currentCharIndex === 0) {
            // Move to next text
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
            typingSpeed = 500;
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    // Start typing animation after a delay
    setTimeout(typeText, 1000);
}

// Contact form handling
function initializeContactForm() {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Create mailto link (since we can't actually send emails in a static site)
        const subject = 'Contact from Portfolio Website';
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
        const mailtoLink = `mailto:pyareemohandash@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Simulate processing time
        setTimeout(() => {
            window.location.href = mailtoLink;
            
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Clear form
            contactForm.reset();
            
            showNotification('Your message has been prepared! Please send it via your email client.', 'success');
        }, 1000);
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-surface);
        color: var(--color-text);
        padding: 16px 20px;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    if (type === 'error') {
        notification.style.borderColor = 'var(--color-error)';
        notification.style.backgroundColor = 'rgba(var(--color-error-rgb), 0.1)';
    } else if (type === 'success') {
        notification.style.borderColor = 'var(--color-success)';
        notification.style.backgroundColor = 'rgba(var(--color-success-rgb), 0.1)';
    }
    
    // Add notification styles to head if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 16px;
            }
            .notification-message {
                flex: 1;
                font-size: 14px;
                line-height: 1.5;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: var(--color-text-secondary);
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }
            .notification-close:hover {
                background-color: var(--color-secondary);
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (hero && scrolled < hero.offsetHeight) {
        // Subtle parallax effect
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        
        // Fade out scroll indicator
        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - (scrolled / 300));
            scrollIndicator.style.opacity = opacity;
        }
    }
});

// Add loading animation to skill items
function animateSkillItems() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItems = entry.target.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px) scale(0.8)';
                        item.style.transition = 'all 0.4s ease-out';
                        
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) scale(1)';
                        }, 50);
                    }, index * 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillCategories.forEach(category => {
        skillObserver.observe(category);
    });
}

// Add hover effects to timeline items
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Add click effect to buttons
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            // Add ripple keyframes if not already added
            if (!document.querySelector('#ripple-styles')) {
                const styles = document.createElement('style');
                styles.id = 'ripple-styles';
                styles.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                    .btn {
                        position: relative;
                        overflow: hidden;
                    }
                `;
                document.head.appendChild(styles);
            }
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

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

// Add entrance animation to hero elements
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroCta = document.querySelector('.hero-cta');
    const heroSocial = document.querySelector('.hero-social');
    
    // Staggered entrance animations
    if (heroTitle) setTimeout(() => heroTitle.style.animation = 'fadeInUp 0.8s ease-out forwards', 200);
    if (heroSubtitle) setTimeout(() => heroSubtitle.style.animation = 'fadeInUp 0.8s ease-out forwards', 400);
    if (heroDescription) setTimeout(() => heroDescription.style.animation = 'fadeInUp 0.8s ease-out forwards', 600);
    if (heroCta) setTimeout(() => heroCta.style.animation = 'fadeInUp 0.8s ease-out forwards', 800);
    if (heroSocial) setTimeout(() => heroSocial.style.animation = 'fadeInUp 0.8s ease-out forwards', 1000);
});

// Intersection observer for counters (if any numeric values need animation)
function animateCounters() {
    const counters = document.querySelectorAll('.highlight-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                let currentValue = 0;
                const increment = 1;
                const duration = 2000;
                const steps = duration / 50;
                
                // Only animate if it contains numbers
                if (finalValue.match(/\d/)) {
                    const numericValue = parseInt(finalValue.match(/\d+/)[0]);
                    const stepValue = numericValue / steps;
                    
                    const timer = setInterval(() => {
                        currentValue += stepValue;
                        if (currentValue >= numericValue) {
                            target.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(currentValue) + (finalValue.includes('%') ? '%' : '+');
                        }
                    }, 50);
                }
                
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.7 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}