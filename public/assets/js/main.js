// ============================================
// Main JavaScript - Multilingual & RTL Support
// ============================================

// Get current language from localStorage or default to German
let currentLanguage = localStorage.getItem('language') || 'de';

// RTL Languages
const rtlLanguages = ['ar'];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    setupLanguageSwitchers();
    setupFormSubmission();
    setupSmoothScrolling();
});

// ============================================
// Language Initialization
// ============================================

function initializeLanguage() {
    setLanguage(currentLanguage);
    updateLanguageButton();
}

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Set RTL or LTR
    if (rtlLanguages.includes(lang)) {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }

    // Update all translatable elements
    updatePageTranslations(lang);
}

function updatePageTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        
        if (translations[lang] && translations[lang][key]) {
            const translation = translations[lang][key];
            
            // For input placeholders and button text
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.tagName === 'OPTION') {
                element.textContent = translation;
            } else if (element.tagName === 'LABEL') {
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        }
    });

    // Update page title
    const titleKey = 'hero_title';
    if (translations[lang] && translations[lang][titleKey]) {
        document.title = translations[lang][titleKey] + ' - Die Bodenschmiede';
    }
}

// ============================================
// Language Switcher Setup
// ============================================

function setupLanguageSwitchers() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            setLanguage(selectedLang);
            updateLanguageButton();
        });
    });
}

function updateLanguageButton() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-lang') === currentLanguage) {
            button.classList.add('active');
        }
    });
}

// ============================================
// Form Submission
// ============================================

function setupFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitForm();
        });
    }
}

function submitForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email) {
        alert(currentLanguage === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 
              currentLanguage === 'nl' ? 'Vul alstublieft alle verplichte velden in' : 
              'Please fill in all required fields');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert(currentLanguage === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح' : 
              currentLanguage === 'nl' ? 'Voer alstublieft een geldig e-mailadres in' : 
              'Please enter a valid email address');
        return;
    }

    // Prepare email body
    const emailBody = `
Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
Message: ${message}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:info@die-bodenschmiede.de?subject=Quote Request from ${name}&body=${encodeURIComponent(emailBody)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
    if (modal) {
        modal.hide();
    }

    // Reset form
    document.getElementById('contactForm').reset();

    // Show success message
    showSuccessMessage();
}

function showSuccessMessage() {
    const messages = {
        nl: 'Bedankt! We nemen spoedig contact met u op.',
        en: 'Thank you! We will contact you soon.',
        ar: 'شكراً لك! سنتواصل معك قريباً.'
    };

    const message = messages[currentLanguage] || messages.en;
    alert(message);
}

// ============================================
// Smooth Scrolling
// ============================================

function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's a modal trigger
            if (this.hasAttribute('data-bs-toggle')) {
                return;
            }

            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 80; // Account for sticky navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Additional Utilities
// ============================================

// Collapse navbar on link click (mobile)
document.addEventListener('click', function(event) {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        if (!event.target.closest('.navbar')) {
            navbarToggler.click();
        }
    }
});

// Add scroll animation for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.service-card, .why-card, .portfolio-card, .contact-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ============================================
// Responsive Navigation
// ============================================

// Handle window resize for navbar
window.addEventListener('resize', function() {
    if (window.innerWidth > 992) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    }
});

// ============================================
// Accessibility Enhancements
// ============================================

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            bootstrap.Modal.getInstance(modal).hide();
        }
    }
});

// ============================================
// Performance Optimizations
// ============================================

// Lazy load images if supported
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('Die Bodenschmiede Website Loaded - Language: ' + currentLanguage);
