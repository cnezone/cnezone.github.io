/* =====================================================
   CNE ZONE — Global Frontend Controller (Fully Fixed)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===== 1. FIX: Font Awesome Icons Check ===== */
    function checkFontAwesome() {
        const testIcon = document.createElement('i');
        testIcon.className = 'fas fa-check';
        testIcon.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
        document.body.appendChild(testIcon);
        
        const computedStyle = window.getComputedStyle(testIcon);
        const fontFamily = computedStyle.getPropertyValue('font-family');
        document.body.removeChild(testIcon);
        
        if (!fontFamily || !fontFamily.includes('Font Awesome')) {
            console.warn('Font Awesome not loaded. Loading now...');
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            link.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        }
    }
    checkFontAwesome();

    /* ===== 2. Header Scroll Effect ===== */
    const header = document.querySelector(".main-header");
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }, { passive: true });
    }

    /* ===== 3. Mobile Navigation (FIXED) ===== */
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (mobileToggle && navMenu) {
        // Toggle menu
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navMenu.classList.toggle("active");
            const icon = mobileToggle.querySelector("i");
            if (icon) {
                icon.className = navMenu.classList.contains("active") ? "fas fa-times" : "fas fa-bars";
            }
            document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                const icon = mobileToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            });
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (navMenu.classList.contains("active")) {
                const isHeader = header && header.contains(e.target);
                const isToggle = mobileToggle && mobileToggle.contains(e.target);
                if (!isHeader && !isToggle) {
                    navMenu.classList.remove("active");
                    const icon = mobileToggle.querySelector("i");
                    if (icon) icon.className = "fas fa-bars";
                    document.body.style.overflow = "";
                }
            }
        });

        // Close on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                const icon = mobileToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            }
        });

        // Handle resize - close menu on desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 767 && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                const icon = mobileToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            }
        });
    }

    /* ===== 4. Active nav link highlighting ===== */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html") ||
            (currentPage === "index.html" && linkPage === "index.html")) {
            link.classList.add("active");
        }
    });

    /* ===== 5. Scroll Reveal ===== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".scroll-reveal").forEach(el => revealObserver.observe(el));

    /* ===== 6. Tab Switcher ===== */
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const target = btn.getAttribute("data-tab");
                tabBtns.forEach(b => b.classList.remove("active"));
                tabPanes.forEach(p => p.classList.remove("active"));
                btn.classList.add("active");
                const pane = document.getElementById(target);
                if (pane) pane.classList.add("active");
            });
        });
    }

    /* ===== 7. Assistant Chatbot ===== */
    const assistantToggleBtn = document.getElementById("assistantToggleBtn");
    const assistantCloseBtn = document.getElementById("assistantCloseBtn");
    const assistantChatWindow = document.getElementById("assistantChatWindow");
    const acwMessages = document.getElementById("acwMessages");
    const questionButtons = document.querySelectorAll(".acw-q-btn");

    if (assistantToggleBtn && assistantChatWindow && acwMessages) {
        assistantToggleBtn.addEventListener("click", () => {
            assistantChatWindow.classList.add("active");
            assistantToggleBtn.style.display = "none";
        });

        const closeChat = () => {
            assistantChatWindow.classList.remove("active");
            assistantToggleBtn.style.display = "flex";
        };
        if (assistantCloseBtn) {
            assistantCloseBtn.addEventListener("click", closeChat);
        }

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (assistantChatWindow.classList.contains("active")) {
                const isChat = assistantChatWindow.contains(e.target);
                const isToggle = assistantToggleBtn.contains(e.target);
                if (!isChat && !isToggle) {
                    closeChat();
                }
            }
        });

        questionButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const questionText = btn.textContent;
                const answerText = btn.getAttribute("data-answer");

                const userMsg = document.createElement("div");
                userMsg.className = "acw-msg user";
                userMsg.textContent = questionText;
                acwMessages.appendChild(userMsg);

                btn.style.opacity = "0.5";
                btn.style.pointerEvents = "none";

                acwMessages.scrollTop = acwMessages.scrollHeight;

                setTimeout(() => {
                    const botMsg = document.createElement("div");
                    botMsg.className = "acw-msg bot";
                    botMsg.textContent = answerText;
                    acwMessages.appendChild(botMsg);

                    btn.style.opacity = "";
                    btn.style.pointerEvents = "";

                    acwMessages.scrollTop = acwMessages.scrollHeight;
                }, 500);
            });
        });
    }

    /* ===== 8. Copyright Year ===== */
    const yearSpans = document.querySelectorAll('.footer-bottom p');
    const currentYear = new Date().getFullYear();
    yearSpans.forEach(span => {
        if (span.textContent.includes('CNE Zone')) {
            span.innerHTML = `&copy; ${currentYear} CNE Zone. All Rights Reserved.`;
        }
    });

    /* ===== 9. Counter Animation for Stats ===== */
    const statsSection = document.querySelector('.transparent-stats-section');
    if (statsSection) {
        const counters = statsSection.querySelectorAll('.stat-number-wrap[data-target]');
        if (counters.length > 0) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counters.forEach(counter => {
                            const target = parseInt(counter.getAttribute('data-target'));
                            const duration = 1500;
                            const startTime = performance.now();
                            const unitSpan = counter.querySelector('.stat-unit-orange');
                            const unitText = unitSpan ? unitSpan.outerHTML : '';

                            function updateCounter(currentTime) {
                                const elapsed = currentTime - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                const eased = 1 - Math.pow(1 - progress, 3);
                                const currentVal = Math.round(target * eased);
                                counter.innerHTML = currentVal + unitText;
                                if (progress < 1) {
                                    requestAnimationFrame(updateCounter);
                                }
                            }
                            requestAnimationFrame(updateCounter);
                        });
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            statsObserver.observe(statsSection);
        }
    }

    /* ===== 10. Services Step Cards Animation ===== */
    const serviceCards = document.querySelectorAll('.service-step-card.fade-hidden');
    if (serviceCards.length > 0) {
        const serviceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('fade-hidden');
                    entry.target.classList.add('visible');
                    serviceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        serviceCards.forEach(card => serviceObserver.observe(card));
    }

    /* ===== 11. Tab Card Animation ===== */
    const tabCards = document.querySelectorAll('.tab-card-item');
    if (tabCards.length > 0) {
        const tabCardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    tabCardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        tabCards.forEach(card => tabCardObserver.observe(card));
    }

    /* ===== 12. Fix: Touch events for mobile ===== */
    document.querySelectorAll('.qca-btn, .nav-link, .btn, .tab-btn, .acw-q-btn, .project-card, .feature-card, .product-card, .service-step-card, .sla-card').forEach(el => {
        el.addEventListener('touchstart', function() {
            // Passive touch to trigger hover states on mobile
        }, { passive: true });
    });

    console.log("🚀 CNE Zone - Website Loaded Successfully!");
});
