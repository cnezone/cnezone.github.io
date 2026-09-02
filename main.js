/* =====================================================
   CNE ZONE — Global Frontend Controller
   Re-coded with event delegation for reliable mobile taps
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ===== 0. Safety net: every <button> must be type="button" =====
       A <button> with no explicit type defaults to type="submit".
       If it ever ends up inside (or gets moved into) a <form>, a tap
       submits/reloads the page instead of running our JS — which looks
       exactly like "click nahi ho raha". This makes every button safe,
       on every page, automatically. */
    document.querySelectorAll("button:not([type])").forEach(function (btn) {
        btn.setAttribute("type", "button");
    });

    /* ===== 1. Font Awesome fallback loader ===== */
    function checkFontAwesome() {
        const testIcon = document.createElement("i");
        testIcon.className = "fas fa-check";
        testIcon.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;";
        document.body.appendChild(testIcon);

        const fontFamily = window.getComputedStyle(testIcon).getPropertyValue("font-family");
        document.body.removeChild(testIcon);

        if (!fontFamily || !fontFamily.includes("Font Awesome")) {
            console.warn("Font Awesome not loaded. Loading now...");
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
            link.crossOrigin = "anonymous";
            document.head.appendChild(link);
        }
    }
    checkFontAwesome();

    /* ===== 2. Header scroll effect ===== */
    const header = document.querySelector(".main-header");
    if (header) {
        window.addEventListener("scroll", function () {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }, { passive: true });
    }

    /* =====================================================
       3. MOBILE NAVIGATION — event delegation
       No cloning, no per-element binding. Listener lives on
       `document` forever, so it can never be "lost".
       ===================================================== */
    const navMenu = document.getElementById("navMenu");

    function setToggleIcon(isOpen) {
        const icon = document.querySelector("#mobileToggle i");
        if (icon) icon.className = isOpen ? "fas fa-times" : "fas fa-bars";
    }

    function closeMobileMenu() {
        if (navMenu && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            setToggleIcon(false);
            document.body.style.overflow = "";
            document.body.classList.remove("mobile-nav-open");
        }
    }

    function openMobileMenu() {
        if (navMenu) {
            navMenu.classList.add("active");
            setToggleIcon(true);
            document.body.style.overflow = "hidden";
            document.body.classList.add("mobile-nav-open");
        }
    }

    document.addEventListener("click", function (e) {
        // --- Toggle button ---
        const toggleBtn = e.target.closest("#mobileToggle");
        if (toggleBtn) {
            e.preventDefault();
            e.stopPropagation();
            if (navMenu && navMenu.classList.contains("active")) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
            return;
        }

        // --- Tapping a nav link inside the open menu closes it ---
        if (navMenu && e.target.closest(".nav-link") && navMenu.contains(e.target)) {
            closeMobileMenu();
            return;
        }

        // --- Tapping outside the open menu / toggle closes it ---
        if (navMenu && navMenu.classList.contains("active")) {
            const clickedInsideMenu = navMenu.contains(e.target);
            const clickedToggle = !!e.target.closest("#mobileToggle");
            if (!clickedInsideMenu && !clickedToggle) {
                closeMobileMenu();
            }
        }
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMobileMenu();
    });

    // Close automatically if the viewport grows back to desktop size
    window.addEventListener("resize", function () {
        if (window.innerWidth > 767) closeMobileMenu();
    });

    /* ===== 4. Active nav link highlighting ===== */
    const navLinks = document.querySelectorAll(".nav-link");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(function (link) {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
            link.classList.add("active");
        }
    });

    /* ===== 5. Scroll reveal ===== */
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".scroll-reveal").forEach(function (el) {
        revealObserver.observe(el);
    });

    /* =====================================================
       6. TAB SWITCHER — event delegation, multi-group safe
       Supports any number of independent tab groups on the
       same page (e.g. About page technical tabs, Services
       page tabs, etc.) — each group only affects its own
       buttons/panes, scoped to the nearest shared wrapper.
       ===================================================== */
    document.addEventListener("click", function (e) {
        const tabBtn = e.target.closest(".tab-btn");
        if (!tabBtn) return;

        e.preventDefault();

        const target = tabBtn.getAttribute("data-tab");
        if (!target) return;

        // Scope to the nearest common wrapper so multiple tab
        // groups on one page never interfere with each other.
        const scope =
            tabBtn.closest(".tabs-wrapper") ||
            tabBtn.closest("section") ||
            document;

        const groupNav = tabBtn.closest(".tabs-nav") || scope;
        groupNav.querySelectorAll(".tab-btn").forEach(function (b) {
            b.classList.remove("active");
        });
        tabBtn.classList.add("active");

        scope.querySelectorAll(".tab-pane").forEach(function (p) {
            p.classList.remove("active");
        });
        const pane = scope.querySelector("#" + CSS.escape(target)) || document.getElementById(target);
        if (pane) pane.classList.add("active");
    });

    /* =====================================================
       7. ASSISTANT CHATBOT — event delegation
       ===================================================== */
    const assistantChatWindow = document.getElementById("assistantChatWindow");
    const acwMessages = document.getElementById("acwMessages");

    function closeAssistant() {
        if (assistantChatWindow) assistantChatWindow.classList.remove("active");
        const toggle = document.getElementById("assistantToggleBtn");
        if (toggle) toggle.style.display = "flex";
    }

    document.addEventListener("click", function (e) {
        // --- Toggle open/close ---
        const toggleBtn = e.target.closest("#assistantToggleBtn");
        if (toggleBtn && assistantChatWindow) {
            e.preventDefault();
            e.stopPropagation();
            assistantChatWindow.classList.toggle("active");
            toggleBtn.style.display = assistantChatWindow.classList.contains("active") ? "none" : "flex";
            return;
        }

        // --- Close button ---
        if (e.target.closest("#assistantCloseBtn")) {
            e.preventDefault();
            e.stopPropagation();
            closeAssistant();
            return;
        }

        // --- Quick-question buttons ---
        const qBtn = e.target.closest(".acw-q-btn");
        if (qBtn && acwMessages) {
            if (qBtn.style.pointerEvents === "none") return; // already answered, mid-animation

            const questionText = qBtn.textContent;
            const answerText = qBtn.getAttribute("data-answer");

            const userMsg = document.createElement("div");
            userMsg.className = "acw-msg user";
            userMsg.textContent = questionText;
            acwMessages.appendChild(userMsg);

            qBtn.style.opacity = "0.5";
            qBtn.style.pointerEvents = "none";
            acwMessages.scrollTop = acwMessages.scrollHeight;

            setTimeout(function () {
                const botMsg = document.createElement("div");
                botMsg.className = "acw-msg bot";
                botMsg.textContent = answerText;
                acwMessages.appendChild(botMsg);

                qBtn.style.opacity = "";
                qBtn.style.pointerEvents = "";
                acwMessages.scrollTop = acwMessages.scrollHeight;
            }, 500);
            return;
        }

        // --- Close on outside click ---
        if (assistantChatWindow && assistantChatWindow.classList.contains("active")) {
            const isChat = assistantChatWindow.contains(e.target);
            const isToggle = !!e.target.closest("#assistantToggleBtn");
            if (!isChat && !isToggle) closeAssistant();
        }
    });

    /* ===== 8. Copyright year ===== */
    const yearSpans = document.querySelectorAll(".footer-bottom p");
    const currentYear = new Date().getFullYear();
    yearSpans.forEach(function (span) {
        if (span.textContent.includes("CNE Zone")) {
            span.innerHTML = "&copy; " + currentYear + " CNE Zone. All Rights Reserved.";
        }
    });

    /* ===== 9. Counter animation for stats ===== */
    const statsSection = document.querySelector(".transparent-stats-section");
    if (statsSection) {
        const counters = statsSection.querySelectorAll(".stat-number-wrap[data-target]");
        if (counters.length > 0) {
            const statsObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        counters.forEach(function (counter) {
                            const target = parseInt(counter.getAttribute("data-target"), 10);
                            const duration = 1500;
                            const startTime = performance.now();
                            const unitSpan = counter.querySelector(".stat-unit-orange");
                            const unitText = unitSpan ? unitSpan.outerHTML : "";

                            function updateCounter(currentTime) {
                                const elapsed = currentTime - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                const eased = 1 - Math.pow(1 - progress, 3);
                                const currentVal = Math.round(target * eased);
                                counter.innerHTML = currentVal + unitText;
                                if (progress < 1) requestAnimationFrame(updateCounter);
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

    /* ===== 10. Services step cards animation ===== */
    const serviceCards = document.querySelectorAll(".service-step-card.fade-hidden");
    if (serviceCards.length > 0) {
        const serviceObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("fade-hidden");
                    entry.target.classList.add("visible");
                    serviceObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        serviceCards.forEach(function (card) { serviceObserver.observe(card); });
    }

    /* ===== 11. Tab card animation ===== */
    const tabCards = document.querySelectorAll(".tab-card-item");
    if (tabCards.length > 0) {
        const tabCardObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    tabCardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        tabCards.forEach(function (card) { tabCardObserver.observe(card); });
    }

    console.log("🚀 CNE Zone - Website Loaded Successfully!");
});
