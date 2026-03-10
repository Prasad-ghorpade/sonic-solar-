/**
 * Sonic Distributors - Main JavaScript
 * UPS & Power Solutions Landing Page
 * Author: Sonic Distributors
 * Version: 1.0.0
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. Load Content from JSON
    // ==========================================================================
    let contentData = null;

    // Load JSON data
    fetch('assets/data/content.json')
        .then(response => response.json())
        .then(data => {
            contentData = data;
            console.log('Content data loaded successfully');
            // You can use this data to dynamically populate content if needed
        })
        .catch(error => {
            console.warn('Could not load content.json, using default content:', error);
        });

    // ==========================================================================
    // 2. Initialize AOS (Animate On Scroll)
    // ==========================================================================
    AOS.init({
        duration: 800,
        once: true,
        disable: 'mobile'
    });

    // ==========================================================================
    // 2. Navbar Scroll Effect
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    const passiveScroll = { passive: true };

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, passiveScroll);

    // ==========================================================================
    // 3. Smooth Scroll for Navigation Links
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    // ==========================================================================
    // 4. Active Navigation Link on Scroll
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // 5. Scroll to Top Button
    // ==========================================================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }, passiveScroll);

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================================================
    // 6. Stats Counter Animation
    // ==========================================================================
    const stats = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsSection = document.querySelector('.stat-item');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible) {
            statsAnimated = true;

            stats.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target;
                    }
                };

                updateCounter();
            });
        }
    }

    window.addEventListener('scroll', animateStats, passiveScroll);
    animateStats(); // Check on page load

    // ==========================================================================
    // 7. Hero Contact Form Handling - NEW
    // ==========================================================================
    const heroContactForm = document.getElementById('heroContactForm');
    const heroFormSuccess = document.getElementById('heroFormSuccess');

    if (heroContactForm) {
        heroContactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('heroName').value;
            const phone = document.getElementById('heroPhone').value;
            const email = document.getElementById('heroEmail').value;
            const company = document.getElementById('heroCompany').value;
            const requirement = document.getElementById('heroRequirement').value;

            // Show loading state
            const submitBtn = heroContactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...';
            submitBtn.disabled = true;
            heroContactForm.classList.add('loading');

            // Prepare CRM params
            const params = {
                name: name,
                email: email || "",
                phone: phone,
                requirement: requirement,
                address: company || "",
            };

            console.log('Hero Form params:', params);

            // Build BizPlus CRM API URL with proper encoding
            let url = `https://sonic.triocorporation.in/api/Leads/Website?user=Website&pass=WebsiteAPI&name=${encodeURIComponent(params.name)}&phone=${encodeURIComponent(params.phone)}&email=${encodeURIComponent(params.email)}&address=${encodeURIComponent(params.address)}&requirement=${encodeURIComponent(params.requirement)}`;

            // Send to BizPlus CRM
            fetch(url, {
                mode: "no-cors",
                method: "POST",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("HTTP status " + response.status);
                    }
                    return response.text();
                })
                // .then((message) => {
                //     // Hide form and show success message
                //     heroContactForm.classList.add('d-none');
                //     heroFormSuccess.classList.remove('d-none');
                //     console.log('Hero Form Success:', message);

                //     // Reset form after 5 seconds and show form again
                //     setTimeout(() => {
                //         heroContactForm.reset();
                //         heroContactForm.classList.remove('d-none', 'loading');
                //         heroFormSuccess.classList.add('d-none');
                //         submitBtn.innerHTML = originalBtnText;
                //         submitBtn.disabled = false;
                //     }, 5000);
                // })
                // .catch((error) => {
                //     console.error("Error:", error);
                //     // Show success even on error (no-cors limitation)
                //     heroContactForm.classList.add('d-none');
                //     heroFormSuccess.classList.remove('d-none');
                //     console.log('Hero Form Thank You:', name);

                //     // Reset form after 5 seconds and show form again
                //     setTimeout(() => {
                //         heroContactForm.reset();
                //         heroContactForm.classList.remove('d-none', 'loading');
                //         heroFormSuccess.classList.add('d-none');
                //         submitBtn.innerHTML = originalBtnText;
                //         submitBtn.disabled = false;
                //     }, 5000);
                // });
                .then((message) => {
                    window.location.href = 'thank-you.php';
                    console.log('AMC Form Success:', message);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    window.location.href = 'thank-you.php';
                });
        });
    }

    // ==========================================================================
    // 8. Power Calculator Form Handling
    // ==========================================================================
    const calculatorForm = document.getElementById('powerCalculatorForm');
    const successMessage = document.getElementById('successMessage');

    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('fullName').value;
            const mobile = document.getElementById('mobile').value;
            const email = document.getElementById('email').value;
            const companyName = document.getElementById('companyName').value;
            const workstations = document.getElementById('workstations').value;
            const serverLoad = document.querySelector('input[name="serverLoad"]:checked')?.value;
            const backupTime = document.getElementById('backupTime').value;

            // Validate form
            if (!serverLoad) {
                alert('Please select if you have server load');
                return;
            }

            // Show loading state
            const submitBtn = calculatorForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
            submitBtn.disabled = true;

            // Build requirement message for CRM
            const requirementMsg = `Power Calculator: ${workstations} workstations, Server Load: ${serverLoad}, Backup Time: ${backupTime}`;

            // Prepare CRM params
            const params = {
                name: name,
                email: email || "",
                phone: mobile,
                requirement: requirementMsg,
                address: companyName || "",
            };

            console.log('Calculator Form params:', params);

            // Build BizPlus CRM API URL with proper encoding
            let url = `https://sonic.triocorporation.in/api/Leads/Website?user=Website&pass=WebsiteAPI&name=${encodeURIComponent(params.name)}&phone=${encodeURIComponent(params.phone)}&email=${encodeURIComponent(params.email)}&address=${encodeURIComponent(params.address)}&requirement=${encodeURIComponent(params.requirement)}`;

            // Send to BizPlus CRM
            fetch(url, {
                mode: "no-cors",
                method: "POST",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("HTTP status " + response.status);
                    }
                    return response.text();
                })
                // .then((message) => {
                //     // Hide form and show success message
                //     calculatorForm.classList.add('d-none');
                //     successMessage.classList.remove('d-none');
                //     console.log('Calculator Form Success:', message);

                //     // Reset form after 5 seconds
                //     setTimeout(() => {
                //         calculatorForm.reset();
                //         calculatorForm.classList.remove('d-none');
                //         successMessage.classList.add('d-none');
                //         submitBtn.innerHTML = originalBtnText;
                //         submitBtn.disabled = false;
                //     }, 5000);
                // })
                // .catch((error) => {
                //     console.error("Error:", error);
                //     // Show success even on error (no-cors limitation)
                //     calculatorForm.classList.add('d-none');
                //     successMessage.classList.remove('d-none');
                //     console.log('Calculator Form Thank You:', name);

                //     // Reset form after 5 seconds
                //     setTimeout(() => {
                //         calculatorForm.reset();
                //         calculatorForm.classList.remove('d-none');
                //         successMessage.classList.add('d-none');
                //         submitBtn.innerHTML = originalBtnText;
                //         submitBtn.disabled = false;
                //     }, 5000);
                // });
                .then((message) => {
                    window.location.href = 'thank-you.php';
                    console.log('AMC Form Success:', message);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    window.location.href = 'thank-you.php';
                });
        });
    }

    // ==========================================================================
    // 9. AMC Form Handling
    // ==========================================================================
    const amcForm = document.getElementById('amcForm');

    if (amcForm) {
        amcForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = amcForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...';
            submitBtn.disabled = true;

            // Get form data
            const name = document.getElementById('amcName').value;
            const phone = document.getElementById('amcPhone').value;
            const email = document.getElementById('amcEmail').value;
            const upsCapacity = document.getElementById('amcCapacity').value;

            // Prepare CRM params
            const params = {
                name: name,
                email: email || "",
                phone: phone,
                requirement: `AMC Request - UPS Capacity: ${upsCapacity}`,
                address: "",
            };

            console.log('AMC Form params:', params);

            // Build BizPlus CRM API URL with proper encoding
            let url = `https://sonic.triocorporation.in/api/Leads/Website?user=Website&pass=WebsiteAPI&name=${encodeURIComponent(params.name)}&phone=${encodeURIComponent(params.phone)}&email=${encodeURIComponent(params.email)}&address=${encodeURIComponent(params.address)}&requirement=${encodeURIComponent(params.requirement)}`;

            // Send to BizPlus CRM
            fetch(url, {
                mode: "no-cors",
                method: "POST",
            })
                .then((response) => {
                    return response.text();
                })
                // .then((message) => {
                //     alert('Thank you! We will contact you shortly with your AMC quote.');
                //     amcForm.reset();
                //     submitBtn.innerHTML = originalBtnText;
                //     submitBtn.disabled = false;
                //     console.log('AMC Form Success:', message);
                // })
                // .catch((error) => {
                //     console.error("Error:", error);
                //     alert('Thank you! We will contact you shortly with your AMC quote.');
                //     amcForm.reset();
                //     submitBtn.innerHTML = originalBtnText;
                //     submitBtn.disabled = false;
                // });
                .then((message) => {
                    window.location.href = 'thank-you.php';
                    console.log('AMC Form Success:', message);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    window.location.href = 'thank-you.php';
                });
        });
    }

    // ==========================================================================
    // 10. Contact Form Handling
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('contactName').value;
            const phone = document.getElementById('contactMobile').value;
            const location = document.getElementById('contactLocation').value;
            const requirement = document.getElementById('contactRequirement').value;

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
            submitBtn.disabled = true;

            // Prepare CRM params
            const params = {
                name: name,
                email: "",
                phone: phone,
                requirement: requirement,
                address: location || "",
            };

            console.log('Contact Form params:', params);

            // Build BizPlus CRM API URL with proper encoding
            let url = `https://sonic.triocorporation.in/api/Leads/Website?user=Website&pass=WebsiteAPI&name=${encodeURIComponent(params.name)}&phone=${encodeURIComponent(params.phone)}&email=${encodeURIComponent(params.email)}&address=${encodeURIComponent(params.address)}&requirement=${encodeURIComponent(params.requirement)}`;

            // Send to BizPlus CRM
            fetch(url, {
                mode: "no-cors",
                method: "POST",
            })
                .then((response) => {
                    return response.text();
                })
                // .then((message) => {
                //     alert('Thank you for your inquiry! Our team will contact you within 24 hours.');
                //     contactForm.reset();
                //     submitBtn.innerHTML = originalBtnText;
                //     submitBtn.disabled = false;
                //     console.log('Contact Form Success:', message);
                // })
                // .catch((error) => {
                //     console.error("Error:", error);
                //     alert('Thank you for your inquiry! Our team will contact you within 24 hours.');
                //     contactForm.reset();
                //     submitBtn.innerHTML = originalBtnText;
                //     submitBtn.disabled = false;
                // });
                .then((message) => {
                    window.location.href = 'thank-you.php';
                    console.log('AMC Form Success:', message);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    window.location.href = 'thank-you.php';
                });
        });
    }

    // ==========================================================================
    // 11. Form Validation - Phone Number
    // ==========================================================================
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach(input => {
        input.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });

        input.addEventListener('blur', function (e) {
            if (this.value.length > 0 && this.value.length !== 10) {
                this.setCustomValidity('Please enter a valid 10-digit mobile number');
                this.reportValidity();
            } else {
                this.setCustomValidity('');
            }
        });
    });

    // ==========================================================================
    // 12. Gallery Image Loading with Placeholder
    // ==========================================================================
    const galleryImages = document.querySelectorAll('.gallery-item img');

    galleryImages.forEach(img => {
        img.addEventListener('load', function () {
            this.classList.add('loaded');
        });

        img.addEventListener('error', function () {
            // Set placeholder image if image fails to load
            this.src = 'https://via.placeholder.com/400x300/0066cc/ffffff?text=Sonic+Distributors';
        });
    });

    // ==========================================================================
    // 13. Lazy Loading for Images
    // ==========================================================================
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

    // ==========================================================================
    // 14. Add Hover Effect to Cards
    // ==========================================================================
    const cards = document.querySelectorAll('.solution-card, .why-card, .testimonial-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // ==========================================================================
    // 15. Mobile Menu Close on Outside Click
    // ==========================================================================
    document.addEventListener('click', function (e) {
        const navbar = document.querySelector('.navbar');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');

        if (navbarCollapse.classList.contains('show') &&
            !navbar.contains(e.target) &&
            !navbarToggler.contains(e.target)) {
            navbarCollapse.classList.remove('show');
        }
    });

    // ==========================================================================
    // 16. Print Functionality
    // ==========================================================================
    window.addEventListener('beforeprint', function () {
        // Hide unnecessary elements before printing
        document.querySelectorAll('.whatsapp-float, .scroll-top-btn, .navbar').forEach(el => {
            el.style.display = 'none';
        });
    });

    window.addEventListener('afterprint', function () {
        // Restore elements after printing
        document.querySelectorAll('.whatsapp-float, .scroll-top-btn, .navbar').forEach(el => {
            el.style.display = '';
        });
    });

    // ==========================================================================
    // 17. Performance Optimization - Debounce Scroll Events
    // ==========================================================================
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

    // Apply debounce to scroll-heavy functions
    const debouncedHighlightNav = debounce(highlightNavigation, 100);
    window.addEventListener('scroll', debouncedHighlightNav, passiveScroll);

    // ==========================================================================
    // 18. Page Load Analytics (Optional)
    // ==========================================================================
    window.addEventListener('load', function () {
        console.log('Sonic Distributors Landing Page Loaded Successfully');

        // Track page load time
        const loadTime = window.performance.timing.domContentLoadedEventEnd -
            window.performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');

        // You can send this data to your analytics service
        // trackPageLoad(loadTime);
    });

    // ==========================================================================
    // 19. Easter Egg - Konami Code
    // ==========================================================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                alert('🎉 You found the secret! Call us now for an exclusive 10% discount! 9021244333');
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // ==========================================================================
    // 20. Handle Browser Back Button
    // ==========================================================================
    window.addEventListener('popstate', function (e) {
        // Handle navigation state
        if (e.state) {
            console.log('Navigation state:', e.state);
        }
    });

    // ==========================================================================
    // 21. Initialize Everything on DOM Ready
    // ==========================================================================
    console.log('🔋 Sonic Distributors - Power Solutions Initialized');
    console.log('📞 Contact: 9021244333');
    console.log('📧 Email: info@sonicdistributors.com');

})();

// ==========================================================================
// Helper Functions for CRM Integration (Add your API endpoints)
// ==========================================================================

/**
 * Send lead data to BizPlusCRM
 * @param {Object} data - Form data to send
 */
function sendToCRM(data) {
    // Replace with your actual CRM API endpoint
    const apiEndpoint = 'https://your-crm-api.com/leads';

    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

/**
 * Track page analytics
 * @param {number} loadTime - Page load time in milliseconds
 */
function trackPageLoad(loadTime) {
    // Add your analytics tracking code here
    // Example: Google Analytics, Mixpanel, etc.
    console.log('Tracking page load:', loadTime);
}

/**
 * Track form submissions
 * @param {string} formType - Type of form submitted
 * @param {Object} data - Form data
 */
function trackFormSubmission(formType, data) {
    // Add your form tracking code here
    console.log(`Form submitted: ${formType}`, data);
}

function calculateSolar() {

    let bill = parseInt(document.getElementById("solarBill").value);

    if (!bill) return;

    /* Recommended solar system size */
    let size = (bill / 1500).toFixed(1);

    /* Monthly savings (realistic 70%) */
    let savings = Math.round(bill * 0.7);

    /* Yearly energy generation */
    let energy = Math.round(size * 1500);

    /* Government subsidy calculation */
    let kw = parseFloat(size);
    let subsidy = 0;

    if (kw <= 2) {
        subsidy = kw * 30000;
    } 
    else if (kw <= 3) {
        subsidy = (2 * 30000) + ((kw - 2) * 18000);
    } 
    else {
        subsidy = 78000;
    }

    subsidy = Math.round(subsidy / 1000);

    /* Update UI */
    document.getElementById("solarSize").innerText = size + " KW";
    document.getElementById("solarSavings").innerText = savings;
    document.getElementById("solarEnergy").innerText = energy;
    document.getElementById("solarSubsidy").innerText = subsidy + "K";

    document.getElementById("solarResult").style.display = "block";

}