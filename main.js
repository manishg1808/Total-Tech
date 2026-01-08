// TotalTech Website JavaScript
// Handles navigation, forms, animations, and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeMobileMenu();
    initializeContactForm();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeScrollEffects();
    initializeFormValidation();
    initializeLoader();
});

// Page Loader Functionality
function initializeLoader() {
    const loader = document.getElementById('page-loader');

    // Function to show loader
    function showLoader() {
        if (loader) {
            loader.style.display = 'flex';
            loader.style.opacity = '1';
        }
    }

    // Function to hide loader
    function hideLoader() {
        setTimeout(function() {
            if (loader) {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.5s ease-out';

                // Remove loader from DOM after fade out
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 500);
            }
        }, 1000); // Show loader for at least 1 second
    }

    // Check if this is the very first visit to the website
    function isFirstVisit() {
        const firstVisit = sessionStorage.getItem('firstVisit');
        if (firstVisit === null) {
            // This is the first visit - set flag and return true
            sessionStorage.setItem('firstVisit', 'done');
            return true;
        }
        return false;
    }

    // Only show loader on the VERY FIRST visit to the website
    // No loader on navigation clicks or refreshes
    if (isFirstVisit()) {
        showLoader();
    }

    // Track if page has loaded
    let pageLoaded = false;

    // Hide loader when page is fully loaded, but ensure minimum show time
    window.addEventListener('load', function() {
        pageLoaded = true;
        // Always wait at least 1.5 seconds before hiding loader
        setTimeout(function() {
            if (pageLoaded) {
                hideLoader();
            }
        }, 500);
    });

    // Fallback: hide loader after minimum 2 seconds, maximum 5 seconds
    setTimeout(function() {
        if (loader && loader.style.display !== 'none') {
            // If page still hasn't loaded after 2 seconds, wait for load event
            if (!pageLoaded) {
                // Wait for load event, but don't exceed 5 seconds total
                const remainingTime = 3000; // 5 seconds total - 2 seconds already passed
                setTimeout(function() {
                    if (loader && loader.style.display !== 'none') {
                        loader.style.opacity = '0';
                        loader.style.transition = 'opacity 0.5s ease-out';
                        setTimeout(function() {
                            loader.style.display = 'none';
                        }, 500);
                    }
                }, remainingTime);
            } else {
                // Page already loaded, hide immediately
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.5s ease-out';
                setTimeout(function() {
                    loader.style.display = 'none';
                }, 500);
            }
        }
    }, 1500);
}

// Mobile Menu Functionality
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');

            // Animate hamburger icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('ri-menu-line');
                icon.classList.toggle('ri-close-line');
            }
        });

        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                }
            });
        });
    }
}

// Contact Form Handling
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Validate required fields
            if (!data.firstName || !data.lastName || !data.email || !data.message) {
                showFormMessage('error', 'Please fill in all required fields.');
                return;
            }

            // Construct WhatsApp message
            let message = `*New Contact Form Submission*\n\n`;
            message += `*Name:* ${data.firstName} ${data.lastName}\n`;
            message += `*Email:* ${data.email}\n`;

            if (data.phone) {
                message += `*Phone:* ${data.phone}\n`;
            }

            if (data.service) {
                message += `*Service Needed:* ${data.service}\n`;
            }

            if (data.printerBrand) {
                message += `*Printer Brand/Model:* ${data.printerBrand}\n`;
            }

            message += `\n*Message:*\n${data.message}`;

            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);

            // WhatsApp URL
            const whatsappUrl = `https://wa.me/14079462705?text=${encodedMessage}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Show success message
            showFormMessage('success');

            // Reset form
            contactForm.reset();
        });
    }
}

function showFormMessage(type, customMessage = null) {
    const formMessage = document.getElementById('formMessage');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (formMessage) {
        formMessage.classList.remove('hidden');

        if (type === 'success') {
            successMessage.classList.remove('hidden');
            errorMessage.classList.add('hidden');
        } else {
            errorMessage.classList.remove('hidden');
            successMessage.classList.add('hidden');
            if (customMessage) {
                errorMessage.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${customMessage}`;
            }
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 5000);
    }
}

function resetSubmitButton(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animation on Scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .feature-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Scroll Effects
function initializeScrollEffects() {
    let lastScrollTop = 0;
    let ticking = false;
    const navbar = document.querySelector('nav');
    const parallaxBg = document.querySelector('.parallax-bg');
    const parallaxSection = document.querySelector('.parallax-bg-contact');

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar hide/show on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;

        // Add scrolled class for background change
        if (scrollTop > 50) {
            navbar.classList.add('bg-white', 'shadow-lg');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-white', 'shadow-lg');
            navbar.classList.add('bg-transparent');
        }

        // Throttled parallax effect for better performance
        if (!ticking) {
            requestAnimationFrame(function() {
                // Parallax effect for hero banner background
                if (parallaxBg) {
                    const parallaxOffset = scrollTop * 0.4; // Adjust speed (0.4 = 40% of scroll speed)
                    parallaxBg.style.transform = `translateY(${parallaxOffset}px)`;
                }

                // Parallax effect for contact section background
                if (parallaxSection) {
                    const parallaxOffset = scrollTop * 0.3; // Slightly slower for section parallax
                    parallaxSection.style.backgroundPositionY = `${parallaxOffset}px`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Form Validation
function initializeFormValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error styling
    field.classList.remove('error', 'border-red-500');
    field.classList.add('border-gray-300');

    // Check if field is required and empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    if (!isValid) {
        field.classList.add('error', 'border-red-500');
        field.classList.remove('border-gray-300');

        // Show error message
        showFieldError(field, errorMessage);
    } else {
        hideFieldError(field);
    }

    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error message
    hideFieldError(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-600 text-sm mt-1';
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
}

function hideFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        let current = 0;
        const increment = target / 100;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 20);
    });
}

// Initialize counters when they come into view
function initializeCounters() {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(statsSection);
    }
}

// Service Worker Registration (for PWA features - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Lazy Loading Images (if needed in future)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to monitoring service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Could send error reports to monitoring service
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = document.querySelector('#mobile-menu-button i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }
});

// Service Selection Function
function selectService(serviceValue) {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.value = serviceValue;
        // Scroll to contact form
        document.getElementById('contactForm').scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        // Focus on message field
        document.getElementById('message').focus();
    }
}

// Phone Modal Functions
function openPhoneModal() {
    const modal = document.getElementById('phoneModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closePhoneModal() {
    const modal = document.getElementById('phoneModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// WhatsApp Modal Functions
function openWhatsAppModal() {
    const modal = document.getElementById('whatsappModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeWhatsAppModal() {
    const modal = document.getElementById('whatsappModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// WhatsApp Form Submission
function initializeWhatsAppForm() {
    const whatsappForm = document.getElementById('whatsappForm');
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(whatsappForm);
            const data = Object.fromEntries(formData.entries());

            // Validate required fields
            if (!data.waName || !data.waMobile || !data.waPrinterBrand || !data.waPrinterType || !data.waIssue) {
                alert('Please fill in all required fields.');
                return;
            }

            // Construct WhatsApp message
            let message = `*WhatsApp Support Request*\n\n`;
            message += `*Name:* ${data.waName}\n`;
            message += `*Mobile:* ${data.waMobile}\n`;
            message += `*Printer Brand:* ${data.waPrinterBrand}\n`;
            message += `*Printer Type:* ${data.waPrinterType}\n`;
            message += `*Issue:* ${data.waIssue}\n`;
            if (data.waLocation) {
                message += `*Location:* ${data.waLocation}\n`;
            }
            message += `\n*Contact requested via TotalTech website*`;

            // Encode message for URL
            const encodedMessage = encodeURIComponent(message);

            // WhatsApp URL
            const whatsappUrl = `https://wa.me/14079462705?text=${encodedMessage}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Close modal and reset form
            closeWhatsAppModal();
            whatsappForm.reset();
        });
    }
}

// SMS Modal Functions
function openSMSModal() {
    const modal = document.getElementById('smsModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        // Focus on textarea
        setTimeout(() => {
            document.getElementById('smsMessage').focus();
        }, 100);
    }
}

function closeSMSModal() {
    const modal = document.getElementById('smsModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Reset form
        document.getElementById('smsMessage').value = '';
        document.getElementById('charCount').textContent = '0';
        document.getElementById('smsSubmitBtn').disabled = true;
        document.getElementById('smsSubmitBtn').className = 'w-full bg-gray-300 text-gray-500 py-2.5 px-4 rounded-lg font-semibold cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm';
    }
}

function closeSMSDisplayModal() {
    const modal = document.getElementById('smsDisplayModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function sendSMS() {
    const message = document.getElementById('smsMessage').value.trim();
    if (message) {
        // Close SMS modal
        closeSMSModal();

        // Show SMS display modal with the message
        const smsContent = document.getElementById('smsContent');
        smsContent.textContent = message;

        const displayModal = document.getElementById('smsDisplayModal');
        displayModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// SMS Message Input Handler
function initializeSMSInput() {
    const smsMessage = document.getElementById('smsMessage');
    const charCount = document.getElementById('charCount');
    const submitBtn = document.getElementById('smsSubmitBtn');

    if (smsMessage && charCount && submitBtn) {
        smsMessage.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = length;

            if (length > 0) {
                submitBtn.disabled = false;
                submitBtn.className = 'w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-sm';
            } else {
                submitBtn.disabled = true;
                submitBtn.className = 'w-full bg-gray-300 text-gray-500 py-2.5 px-4 rounded-lg font-semibold cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm';
            }
        });
    }
}

// Close modals when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    // Phone modal
    const phoneModal = document.getElementById('phoneModal');
    if (phoneModal) {
        phoneModal.addEventListener('click', function(e) {
            if (e.target === phoneModal) {
                closePhoneModal();
            }
        });
    }

    // WhatsApp modal
    const whatsappModal = document.getElementById('whatsappModal');
    if (whatsappModal) {
        whatsappModal.addEventListener('click', function(e) {
            if (e.target === whatsappModal) {
                closeWhatsAppModal();
            }
        });
    }

    // SMS modal
    const smsModal = document.getElementById('smsModal');
    if (smsModal) {
        smsModal.addEventListener('click', function(e) {
            if (e.target === smsModal) {
                closeSMSModal();
            }
        });
    }

    // SMS Display modal
    const smsDisplayModal = document.getElementById('smsDisplayModal');
    if (smsDisplayModal) {
        smsDisplayModal.addEventListener('click', function(e) {
            if (e.target === smsDisplayModal) {
                closeSMSDisplayModal();
            }
        });
    }

    // Initialize forms
    initializeWhatsAppForm();
    initializeSMSInput();
});

// Customer Counter Animation
function initializeCustomerCounter() {
    const counterElement = document.querySelector('.customer-counter');
    if (counterElement) {
        let currentCount = 0;
        const targetCount = 5000;
        const duration = 3000; // 3 seconds
        const increment = targetCount / (duration / 16); // 60fps

        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= targetCount) {
                currentCount = targetCount;
                clearInterval(timer);
            }
            counterElement.textContent = Math.floor(currentCount) + '+';
        }, 16);
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeCounters();
    initializeCustomerCounter();
    initializePerformanceMonitoring();
    initializeLazyLoading();
});
