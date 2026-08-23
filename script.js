/* ==========================================================================
   LALIT GULABRAO PATIL — PORTFOLIO JAVASCRIPT
   Vanilla JS, no dependencies
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ── Utility: Throttle ──────────────────────────────────────────
    const throttle = (fn, wait) => {
        let last = 0;
        return (...args) => {
            const now = Date.now();
            if (now - last >= wait) {
                last = now;
                fn(...args);
            }
        };
    };

    // ══════════════════════════════════════════════════════════════
    // 1. NAVBAR — SCROLL BACKGROUND & ACTIVE SECTION
    // ══════════════════════════════════════════════════════════════
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const onScroll = () => {
        const scrollY = window.scrollY;

        // Navbar solid bg after scrolling
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }

        // Active section highlight
        const navHeight = navbar ? navbar.offsetHeight : 70;
        let currentSection = '';
        sections.forEach(section => {
            const top = section.offsetTop - navHeight - 60;
            if (scrollY >= top) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.classList.toggle('visible', scrollY > 500);
        }

        // Parallax on landing
        const landingContent = document.querySelector('.landing-content');
        if (landingContent && scrollY < window.innerHeight) {
            landingContent.style.transform = `translateY(${scrollY * 0.25}px)`;
            landingContent.style.opacity = Math.max(0, 1 - (scrollY / window.innerHeight) * 1.2);
        }
    };

    window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
    onScroll(); // Initial call

    // ══════════════════════════════════════════════════════════════
    // 2. MOBILE NAVIGATION
    // ══════════════════════════════════════════════════════════════
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close on link click
        navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // ══════════════════════════════════════════════════════════════
    // 3. SMOOTH SCROLL
    // ══════════════════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ══════════════════════════════════════════════════════════════
    // 4. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
    // ══════════════════════════════════════════════════════════════
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay');
                if (delay) {
                    el.style.animationDelay = `${parseFloat(delay) * 0.15}s`;
                }
                el.classList.add('animated');
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => animationObserver.observe(el));

    // ══════════════════════════════════════════════════════════════
    // 5. SKILL PROGRESS BARS + PERCENTAGE COUNTER
    // ══════════════════════════════════════════════════════════════
    const skillsSection = document.getElementById('skills');
    let skillsAnimated = false;

    const animateSkills = () => {
        if (skillsAnimated) return;
        skillsAnimated = true;

        const skillFills = document.querySelectorAll('.skill-fill');
        const skillPercents = document.querySelectorAll('.skill-percent');

        skillFills.forEach((fill, index) => {
            const percent = parseInt(fill.getAttribute('data-percent'), 10);
            const percentEl = fill.closest('.skill-item')?.querySelector('.skill-percent');

            setTimeout(() => {
                fill.style.width = `${percent}%`;

                // Counter animation
                if (percentEl) {
                    const duration = 1200;
                    const start = performance.now();

                    const update = (now) => {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                        const current = Math.round(eased * percent);
                        percentEl.textContent = `${current}%`;
                        if (progress < 1) requestAnimationFrame(update);
                        else percentEl.textContent = `${percent}%`;
                    };
                    requestAnimationFrame(update);
                }
            }, index * 60);
        });
    };

    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }

    // ══════════════════════════════════════════════════════════════
    // 6. STAT COUNTERS (Achievements)
    // ══════════════════════════════════════════════════════════════
    const statsRow = document.querySelector('.stats-row');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        statsAnimated = true;

        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(target) || target === 0) {
                counter.textContent = '0';
                return;
            }

            const duration = 2000;
            const start = performance.now();

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                counter.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target;
            };
            requestAnimationFrame(update);
        });
    };

    if (statsRow) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsRow);
    }

    // ══════════════════════════════════════════════════════════════
    // 7. CERTIFICATION CARD TILT EFFECT
    // ══════════════════════════════════════════════════════════════
    document.querySelectorAll('.cert-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        });
    });

    // ══════════════════════════════════════════════════════════════
    // 8. CONTACT FORM
    // ══════════════════════════════════════════════════════════════
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('formName')?.value || '';
            const email = document.getElementById('formEmail')?.value || '';
            const subject = document.getElementById('formSubject')?.value || 'Portfolio Contact';
            const message = document.getElementById('formMessage')?.value || '';

            const body = `Hi Lalit,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`;
            const mailto = `mailto:lalitpatil1672@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailto;

            // Success message
            if (formSuccess) {
                formSuccess.style.display = 'block';
                setTimeout(() => { formSuccess.style.display = 'none'; }, 4000);
            }

            contactForm.reset();
            // Remove active classes from form groups
            contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('active'));
        });
    }

    // ══════════════════════════════════════════════════════════════
    // 9. FLOATING LABEL + UNDERLINE ANIMATION
    // ══════════════════════════════════════════════════════════════
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        // Add placeholder for CSS :not(:placeholder-shown) trick
        if (!input.hasAttribute('placeholder')) {
            input.setAttribute('placeholder', ' ');
        }

        input.addEventListener('focus', () => input.closest('.form-group').classList.add('active'));
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.closest('.form-group').classList.remove('active');
            }
        });
    });

    // ══════════════════════════════════════════════════════════════
    // 10. EDUCATION — TYPEWRITER LIST REVEAL
    // ══════════════════════════════════════════════════════════════
    const educationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.typewriter-list li').forEach((li, i) => {
                    setTimeout(() => li.classList.add('revealed'), i * 250);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.education-card').forEach(card => educationObserver.observe(card));

    // ══════════════════════════════════════════════════════════════
    // 11. EXPERIENCE — CURTAIN PANEL EFFECT
    // ══════════════════════════════════════════════════════════════
    const expObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('curtain-open');
                // Stagger list items
                entry.target.querySelectorAll('.stagger-list li').forEach((li, i) => {
                    setTimeout(() => {
                        li.style.opacity = '1';
                        li.style.transform = 'translateY(0)';
                    }, 300 + i * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.experience-card').forEach(card => expObserver.observe(card));

    // ══════════════════════════════════════════════════════════════
    // 12. PROJECTS — OUTCOME CARD DEAL EFFECT
    // ══════════════════════════════════════════════════════════════
    const projectObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.card-deal').forEach((box, i) => {
                    setTimeout(() => box.classList.add('pop-in'), i * 150);
                });
                // Tech pills bounce
                entry.target.querySelectorAll('.tech-pill').forEach((pill, i) => {
                    setTimeout(() => {
                        pill.style.opacity = '1';
                        pill.style.transform = 'scale(1)';
                    }, 400 + i * 80);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.project-card').forEach(card => projectObserver.observe(card));

    // ══════════════════════════════════════════════════════════════
    // 13. BACK TO TOP
    // ══════════════════════════════════════════════════════════════
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ══════════════════════════════════════════════════════════════
    // 14. FOOTER YEAR
    // ══════════════════════════════════════════════════════════════
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ══════════════════════════════════════════════════════════════
    // 15. SEND BUTTON PULSE AFTER FORM RENDERS
    // ══════════════════════════════════════════════════════════════
    const sendBtn = document.querySelector('.btn-send');
    if (sendBtn) {
        const sendBtnObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        sendBtn.style.animation = 'pulseGlow 1.5s ease 1';
                        setTimeout(() => { sendBtn.style.animation = ''; }, 1500);
                    }, 1200);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        sendBtnObserver.observe(sendBtn);
    }
});
