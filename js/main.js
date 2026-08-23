// ============================================
// AOS INITIALIZATION
// ============================================

AOS.init({
    duration: 1000,
    once: false,
    mirror: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// ============================================
// THEME TOGGLER (DARK / LIGHT MODE)
// ============================================

function initThemeToggler() {
    const toggler = document.getElementById('toggler');
    const root = document.documentElement;

    // Retrieve saved theme or fallback to user system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Apply the initial theme state
    applyTheme(initialTheme);

    if (toggler) {
        toggler.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Spin animation for the icon
            toggler.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            toggler.style.transform = 'rotate(360deg) scale(1.2)';

            // Reset icon scale and rotation transform after animation completes
            setTimeout(() => {
                toggler.style.transform = 'none';
            }, 500);

            // Set new theme and persist to localStorage
            applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
            if (toggler) {
                toggler.classList.remove('fa-moon');
                toggler.classList.add('fa-sun');
            }
        } else {
            root.removeAttribute('data-theme');
            root.setAttribute('data-theme', 'light');
            if (toggler) {
                toggler.classList.remove('fa-sun');
                toggler.classList.add('fa-moon');
            }
        }
    }
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

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

// ============================================
// NAVBAR ACTIVE STATE & STICKY EFFECT
// ============================================

function updateNavbar() {
    // Resolve the current page's filename (default to index.html for "/" or "")
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const dropdownItems = document.querySelectorAll('.navbar-nav .dropdown-item');

    // Reset all active states first
    navLinks.forEach(link => link.classList.remove('active'));
    dropdownItems.forEach(item => item.classList.remove('active'));

    // Top-level links (Home, Contact, etc.) — exact filename match only
    document.querySelectorAll('.navbar-nav > .nav-item > .nav-link:not(.dropdown-toggle)').forEach(link => {
        const href = (link.getAttribute('href') || '').split('/').pop();
        if (href && href === currentFile) {
            link.classList.add('active');
        }
    });

    // Dropdown items — exact filename match, and light up the parent toggle too
    dropdownItems.forEach(item => {
        const href = (item.getAttribute('href') || '').split('/').pop();
        if (href && href === currentFile) {
            item.classList.add('active');
            const parentDropdown = item.closest('.dropdown');
            const parentToggle = parentDropdown ? parentDropdown.querySelector('.dropdown-toggle') : null;
            if (parentToggle) {
                parentToggle.classList.add('active');
            }
        }
    });
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.premium-nav');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ============================================
// BUTTON HOVER EFFECT
// ============================================

const buttons = document.querySelectorAll('.btn-custom');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function createScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #d4af37, #e5c158);
        color: #0a0a0a;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
        display: none;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
    `;

    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
        } else {
            button.style.display = 'none';
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

createScrollToTopButton();

// ============================================
// ANIMATE PROGRESS BARS ON SCROLL
// ============================================

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `none`;
                setTimeout(() => {
                    entry.target.style.animation = ``;
                }, 10);
                observer.unobserve(entry.target);
            }
        });
    });

    progressBars.forEach(bar => observer.observe(bar));
}

if (document.querySelectorAll('.progress-fill').length > 0) {
    animateProgressBars();
}

// ============================================
// FORM VALIDATION AND SUBMISSION
// ============================================

function setupFormValidation() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            if (!data.name || !data.email || !data.subject || !data.message) {
                showFormMessage('Please fill in all required fields', 'danger');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showFormMessage('Please enter a valid email address', 'danger');
                return;
            }
            
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            console.log('Form Data:', data);
        });
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `mt-3 alert alert-${type === 'danger' ? 'danger' : 'success'}`;
        messageDiv.style.display = 'block';
        
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================

function addInteractiveFeatures() {
    const cards = document.querySelectorAll('.feature-card, .education-card, .value-card, .skill-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    const techTags = document.querySelectorAll('.tech-tag, .tag');
    
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.background = 'var(--accent-gold)';
            this.style.color = 'var(--primary-dark)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.background = 'var(--tertiary-dark)';
            this.style.color = 'var(--accent-gold)';
        });
    });
}

// ============================================
// LAZY LOADING IMAGES
// ============================================

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ============================================
// PAGE LOAD ANIMATION
// ============================================

function pageLoadAnimation() {
    document.body.style.animation = 'fadeIn 0.5s ease-in';
}

// ============================================
// COUNTER ANIMATION
// ============================================

function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Add escape key handler if needed
        }
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
        }
    });
}

// ============================================
// MOBILE MENU & DROPDOWN HANDLING
// Hover on desktop (≥992px) | Click on mobile (<992px)
// ============================================

function setupMobileMenuClose() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle), .dropdown-item');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }
        });
    });
}

/**
 * Hybrid dropdown behaviour:
 * - Desktop (≥ 992px): open on hover, close on mouse leave
 * - Mobile  (< 992px): normal Bootstrap click toggle (accordion style via CSS)
 */
function setupHybridDropdowns() {
    const dropdownToggles = document.querySelectorAll('.navbar-nav .dropdown-toggle');
    const isDesktop = () => window.innerWidth >= 992;

    dropdownToggles.forEach(toggle => {
        const parent = toggle.closest('.dropdown');
        if (!parent) return;

        // Get or create Bootstrap Dropdown instance
        let dropdownInstance = bootstrap.Dropdown.getInstance(toggle);
        if (!dropdownInstance) {
            dropdownInstance = new bootstrap.Dropdown(toggle, {
                // Prevent auto-close on outside click only if needed; default is fine
                autoClose: true
            });
        }

        // ---- Desktop hover behaviour ----
        parent.addEventListener('mouseenter', () => {
            if (isDesktop()) {
                dropdownInstance.show();
            }
        });

        parent.addEventListener('mouseleave', () => {
            if (isDesktop()) {
                dropdownInstance.hide();
            }
        });

        // ---- Mobile: let Bootstrap handle the click normally ----
        // We only need to prevent the default link navigation (#)
        // Bootstrap already listens for the click via data-bs-toggle
        toggle.addEventListener('click', (e) => {
            if (!isDesktop()) {
                // On mobile we still want the # prevented so the page doesn't jump
                e.preventDefault();
                // Do NOT stopPropagation – let Bootstrap receive the event and toggle
            }
        });
    });

    // Close any open dropdown when resizing across the breakpoint
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            dropdownToggles.forEach(toggle => {
                const instance = bootstrap.Dropdown.getInstance(toggle);
                if (instance) {
                    instance.hide();
                }
            });
        }, 150);
    });
}

// Ensure event listeners are bound only ONCE on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggler();
    pageLoadAnimation();
    setupFormValidation();
    addInteractiveFeatures();
    lazyLoadImages();
    animateCounters();
    setupKeyboardNavigation();
    setupMobileMenuClose();
    setupHybridDropdowns();   // ← replaced old setupMobileDropdowns
    updateNavbar();
    handleNavbarScroll();
});
// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

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

// Achievements Filter
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filters .gallery-filter-btn');
  const cards = document.querySelectorAll('#achievementsGrid .achievement-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          card.classList.remove('filtered-out');
        } else {
          card.style.display = 'none';
          card.classList.add('filtered-out');
        }
      });
    });
  });
});
// ============================================
// ACCESSIBILITY IMPROVEMENTS
// ============================================

function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #d4af37;
        padding: 8px;
        z-index: 100;
        text-decoration: none;
        color: #0a0a0a;
        font-weight: 600;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

addSkipLink();

console.log('Portfolio loaded successfully!');