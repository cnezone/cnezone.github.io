/* =====================================================
   CNE ZONE — Global Frontend Controller (Fully Fixed)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

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
        window.addEventListener("scroll", function() {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }, { passive: true });
    }

    /* ===== 3. Mobile Navigation (FIXED) ===== */
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu = document.getElementById("navMenu");

    if (mobileToggle && navMenu) {
        // Remove existing listeners by cloning to prevent duplicates
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
        const newMobileToggle = document.getElementById("mobileToggle");
        
        if (newMobileToggle) {
            newMobileToggle.addEventListener("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                navMenu.classList.toggle("active");
                const icon = this.querySelector("i");
                if (icon) {
                    icon.className = navMenu.classList.contains("active") ? "fas fa-times" : "fas fa-bars";
                }
                document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
            });
        }

        // Close on link click using event delegation
        navMenu.addEventListener("click", function(e) {
            const link = e.target.closest(".nav-link");
            if (link) {
                navMenu.classList.remove("active");
                const icon = document.querySelector("#mobileToggle i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            }
        });

        // Close on outside click
        document.addEventListener("click", function(e) {
            if (navMenu.classList.contains("active")) {
                const isHeader = header && header.contains(e.target);
                const isToggle = document.getElementById("mobileToggle") && document.getElementById("mobileToggle").contains(e.target);
                if (!isHeader && !isToggle) {
                    navMenu.classList.remove("active");
                    const icon = document.querySelector("#mobileToggle i");
                    if (icon) icon.className = "fas fa-bars";
                    document.body.style.overflow = "";
                }
            }
        });

        // Close on escape key
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                const icon = document.querySelector("#mobileToggle i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            }
        });

        // Handle resize - close menu on desktop
        window.addEventListener("resize", function() {
            if (window.innerWidth > 767 && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                const icon = document.querySelector("#mobileToggle i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            }
        });
    }

    /* ===== 4. Active nav link highlighting ===== */
    const navLinks = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(function(link) {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html") ||
            (currentPage === "index.html" && linkPage === "index.html")) {
            link.classList.add("active");
        }
    });

    /* ===== 5. Scroll Reveal ===== */
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".scroll-reveal").forEach(function(el) {
        revealObserver.observe(el);
    });

    /* ===== 6. Tab Switcher ===== */
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");
    if (tabBtns.length > 0) {
        tabBtns.forEach(function(btn) {
            btn.addEventListener("click", function() {
                const target = this.getAttribute("data-tab");
                tabBtns.forEach(function(b) { b.classList.remove("active"); });
                tabPanes.forEach(function(p) { p.classList.remove("active"); });
                this.classList.add("active");
                const pane = document.getElementById(target);
                if (pane) pane.classList.add("active");
            });
        });
    }

    /* ===== 7. Assistant Chatbot (FIXED) ===== */
    const assistantToggleBtn = document.getElementById("assistantToggleBtn");
    const assistantCloseBtn = document.getElementById("assistantCloseBtn");
    const assistantChatWindow = document.getElementById("assistantChatWindow");
    const acwMessages = document.getElementById("acwMessages");
    const questionButtons = document.querySelectorAll(".acw-q-btn");

    if (assistantToggleBtn && assistantChatWindow && acwMessages) {
        // Remove existing listeners by cloning
        const newToggle = assistantToggleBtn.cloneNode(true);
        assistantToggleBtn.parentNode.replaceChild(newToggle, assistantToggleBtn);
        const newAssistantToggle = document.getElementById("assistantToggleBtn");
        
        if (newAssistantToggle) {
            newAssistantToggle.addEventListener("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                assistantChatWindow.classList.toggle("active");
                this.style.display = assistantChatWindow.classList.contains("active") ? "none" : "flex";
            });
        }

        const closeChat = function() {
            assistantChatWindow.classList.remove("active");
            const toggle = document.getElementById("assistantToggleBtn");
            if (toggle) toggle.style.display = "flex";
        };
        
        if (assistantCloseBtn) {
            const newClose = assistantCloseBtn.cloneNode(true);
            assistantCloseBtn.parentNode.replaceChild(newClose, assistantCloseBtn);
            document.getElementById("assistantCloseBtn").addEventListener("click", closeChat);
        }

        // Close on outside click
        document.addEventListener("click", function(e) {
            if (assistantChatWindow.classList.contains("active")) {
                const isChat = assistantChatWindow.contains(e.target);
                const isToggle = document.getElementById("assistantToggleBtn") && document.getElementById("assistantToggleBtn").contains(e.target);
                if (!isChat && !isToggle) {
                    closeChat();
                }
            }
        });

        questionButtons.forEach(function(btn) {
            btn.addEventListener("click", function() {
                const questionText = this.textContent;
                const answerText = this.getAttribute("data-answer");

                const userMsg = document.createElement("div");
                userMsg.className = "acw-msg user";
                userMsg.textContent = questionText;
                acwMessages.appendChild(userMsg);

                this.style.opacity = "0.5";
                this.style.pointerEvents = "none";

                acwMessages.scrollTop = acwMessages.scrollHeight;

                setTimeout(function() {
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
    yearSpans.forEach(function(span) {
        if (span.textContent.includes('CNE Zone')) {
            span.innerHTML = '&copy; ' + currentYear + ' CNE Zone. All Rights Reserved.';
        }
    });

    /* ===== 9. Counter Animation for Stats ===== */
    const statsSection = document.querySelector('.transparent-stats-section');
    if (statsSection) {
        const counters = statsSection.querySelectorAll('.stat-number-wrap[data-target]');
        if (counters.length > 0) {
            const statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        counters.forEach(function(counter) {
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
        const serviceObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('fade-hidden');
                    entry.target.classList.add('visible');
                    serviceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        serviceCards.forEach(function(card) { serviceObserver.observe(card); });
    }

    /* ===== 11. Tab Card Animation ===== */
    const tabCards = document.querySelectorAll('.tab-card-item');
    if (tabCards.length > 0) {
        const tabCardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    tabCardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        tabCards.forEach(function(card) { tabCardObserver.observe(card); });
    }

    /* ===== 12. Fix: Touch events for mobile ===== */
    document.querySelectorAll('.qca-btn, .nav-link, .btn, .tab-btn, .acw-q-btn, .project-card, .feature-card, .product-card, .service-step-card, .sla-card').forEach(function(el) {
        el.addEventListener('touchstart', function() {
            // Passive touch to trigger hover states on mobile
        }, { passive: true });
    });

    console.log("🚀 CNE Zone - Website Loaded Successfully!");
});
