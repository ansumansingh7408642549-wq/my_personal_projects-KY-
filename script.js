/* ========================================
   Updated JavaScript with Dynamic Screenshots
   Created for Urdu Calendar 2025
======================================== */

// Screenshot configuration - Add your screenshot filenames here
const screenshots = [
    'screenshot-1.jpg',
    'screenshot-2.jpg', 
    'screenshot-3.jpg',
    'screenshot-4.jpg',
    'screenshot-5.jpg',
    'screenshot-6.jpg',
    'screenshot-7.jpg',
    'screenshot-8.jpg'
    // Add more screenshots as needed
];

// Global variables for screenshot slider
let currentSlideIndex = 0;
let slidesPerView = 4; // Default slides per view
let totalSlides = 0;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initFAQ();
    initScrollTop();
    initScreenshotSlider();

    // Initialize screenshots after DOM is ready
    loadScreenshots();
});

/* ======================================== Dynamic Screenshot Loading
======================================== */
function loadScreenshots() {
    const slider = document.getElementById('screenshotSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!slider) return;

    // Clear existing screenshots
    slider.innerHTML = '';

    // Set total slides
    totalSlides = screenshots.length;

    // Create screenshot items
    screenshots.forEach((screenshot, index) => {
        const screenshotItem = document.createElement('div');
        screenshotItem.className = 'screenshot-item';
        screenshotItem.innerHTML = `
            <img src="screenshots/${screenshot}" 
                alt="Urdu Calendar 2025 Screenshot ${index + 1}" 
                loading="lazy"
                onerror="this.src='placeholder-screenshot.jpg'">
        `;
        slider.appendChild(screenshotItem);
    });

    // Update slider configuration based on screen size
    updateSlidesPerView();

    // Add event listeners for navigation
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => slideScreenshots('prev'));
        nextBtn.addEventListener('click', () => slideScreenshots('next'));
    }

    // Update navigation buttons
    updateNavigationButtons();

    // Auto-scroll functionality (optional)
    startAutoScroll();
}

function updateSlidesPerView() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 480) {
        slidesPerView = 1;
    } else if (screenWidth <= 768) {
        slidesPerView = 2;
    } else if (screenWidth <= 1024) {
        slidesPerView = 3;
    } else {
        slidesPerView = 4;
    }
}

function slideScreenshots(direction) {
    const slider = document.getElementById('screenshotSlider');
    if (!slider) return;

    const slideWidth = 280 + 32; // Item width + gap

    if (direction === 'next') {
        currentSlideIndex = Math.min(currentSlideIndex + 1, totalSlides - slidesPerView);
    } else {
        currentSlideIndex = Math.max(currentSlideIndex - 1, 0);
    }

    const translateX = -(currentSlideIndex * slideWidth);
    slider.style.transform = `translateX(${translateX}px)`;

    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!prevBtn || !nextBtn) return;

    // Disable/enable buttons based on current position
    prevBtn.disabled = currentSlideIndex === 0;
    nextBtn.disabled = currentSlideIndex >= totalSlides - slidesPerView;
}

function startAutoScroll() {
    // Auto-scroll every 5 seconds (optional feature)
    setInterval(() => {
        if (currentSlideIndex >= totalSlides - slidesPerView) {
            currentSlideIndex = -1; // Will become 0 after slideScreenshots('next')
        }
        slideScreenshots('next');
    }, 5000);
}

// Update slider on window resize
window.addEventListener('resize', function() {
    updateSlidesPerView();
    updateNavigationButtons();
});

/* ========================================
   Navbar Scroll Effect
======================================== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    function updateActiveNavLink() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }
}

/* ========================================
   Mobile Menu Toggle
======================================== */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileToggle) return;

    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ========================================
   Smooth Scroll for Anchor Links
======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Scroll Animations (AOS Alternative)
======================================== */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    // Initial check for elements in viewport
    checkAnimations();

    // Check on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            checkAnimations();
        });
    });

    function checkAnimations() {
        animatedElements.forEach(element => {
            if (isElementInViewport(element)) {
                element.classList.add('aos-animate');
            }
        });
    }

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
            rect.top <= windowHeight * 0.85 &&
            rect.bottom >= 0
        );
    }
}

/* ========================================
   FAQ Accordion
======================================== */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ========================================
   Scroll to Top Button
======================================== */
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');

    if (!scrollTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    // Scroll to top on click
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ========================================
   Enhanced Screenshot Slider
======================================== */
function initScreenshotSlider() {
    const slider = document.querySelector('.screenshot-slider');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse events for desktop
    slider.addEventListener('mousedown', function(e) {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', function() {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', function() {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }, { passive: true });

    slider.addEventListener('touchmove', function(e) {
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    }, { passive: true });
}

/* ========================================
   Image Loading Error Handler
======================================== */
function handleImageError() {
    // Create placeholder image if screenshot fails to load
    const failedImages = document.querySelectorAll('img[src*="screenshots/"]');

    failedImages.forEach(img => {
        img.addEventListener('error', function() {
            // Create a placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'screenshot-placeholder';
            placeholder.innerHTML = `
                <i class="fas fa-image"></i>
                <p>Screenshot Preview</p>
            `;
            placeholder.style.cssText = `
                aspect-ratio: 9 / 16;
                background: var(--gradient-primary);
                border-radius: var(--radius-lg);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
            `;

            this.parentNode.replaceChild(placeholder, this);
        });
    });
}

/* ========================================
   Performance Optimization
======================================== */
// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
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

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/* ========================================
   Keyboard Navigation for Screenshots
======================================== */
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        slideScreenshots('prev');
    } else if (e.key === 'ArrowRight') {
        slideScreenshots('next');
    }
});

/* ========================================
   Touch/Swipe Support for Screenshots
======================================== */
function initTouchSupport() {
    const slider = document.getElementById('screenshotSlider');
    if (!slider) return;

    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeDistance = startX - endX;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swipe left - next slide
                slideScreenshots('next');
            } else {
                // Swipe right - previous slide
                slideScreenshots('prev');
            }
        }
    }
}

// Initialize touch support
initTouchSupport();

/* ========================================
   Analytics & Tracking
======================================== */
function trackEvent(category, action, label) {
    // Add your analytics code here
    console.log('Event tracked:', category, action, label);

    // Example for Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
}

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const buttonText = e.target.textContent.trim();
        trackEvent('Button', 'Click', buttonText);
    }

    if (e.target.classList.contains('slider-btn')) {
        trackEvent('Screenshot', 'Navigation', e.target.classList.contains('next-btn') ? 'Next' : 'Previous');
    }
});

/* ========================================
   Console Message
======================================== */
console.log('%c📱 Urdu Calendar 2025 Landing Page', 'background: linear-gradient(135deg, #2D7A3E 0%, #D4AF37 100%); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;');
console.log('%c💼 Developed by Sharp Mind Web Solutions', 'background: #0f172a; color: white; font-size: 14px; padding: 8px 15px; border-radius: 5px;');
console.log('%c🕌 Islamic Design • Responsive • High Performance', 'color: #2D7A3E; font-size: 12px; padding: 5px;');

/* ========================================
   Additional Helper Functions
======================================== */

// Function to add new screenshots dynamically
function addScreenshot(filename) {
    screenshots.push(filename);
    loadScreenshots(); // Reload the gallery
}

// Function to remove screenshot
function removeScreenshot(index) {
    if (index >= 0 && index < screenshots.length) {
        screenshots.splice(index, 1);
        loadScreenshots(); // Reload the gallery
    }
}

// Function to get screenshot count
function getScreenshotCount() {
    return screenshots.length;
}

// Export functions for external use if needed
window.UrduCalendarSlider = {
    addScreenshot,
    removeScreenshot,
    getScreenshotCount,
    slideScreenshots
};