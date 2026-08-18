/* =====================================================
   CNE ZONE — Global Frontend Controller (Zain Style)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===== 1. Header Scroll Effect ===== */
    const header = document.querySelector(".main-header");
    if (header) {
        window.addEventListener("scroll", () => {
            header.classList.toggle("scrolled", window.scrollY > 50);
        }, { passive: true });
    }

    /* ===== 2. Mobile Navigation ===== */
    const mobileToggle = document.getElementById("mobileToggle");
    const navMenu      = document.getElementById("navMenu");
    const navLinks     = document.querySelectorAll(".nav-link");

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            const icon = mobileToggle.querySelector("i");
            icon.className = navMenu.classList.contains("active") ? "fas fa-times" : "fas fa-bars";
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                setTimeout(() => {
                    navMenu.classList.remove("active");
                    mobileToggle.querySelector("i").className = "fas fa-bars";
                }, 150);
            });
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (!header.contains(e.target) && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                mobileToggle.querySelector("i").className = "fas fa-bars";
            }
        });
    }

    /* ===== 3. Active nav link highlighting ===== */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
            link.classList.add("active");
        }
    });

    /* ===== 4. Scroll Reveal (Animation on scroll) ===== */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".scroll-reveal").forEach(el => revealObserver.observe(el));

    /* ===== 5. Tab Switcher (For Services/About pages) ===== */
    const tabBtns  = document.querySelectorAll(".tab-btn");
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

    /* ===== 6. Products/Solutions Slider ===== */
    const elevTrack    = document.getElementById("elevTrack");
    const elevPrev     = document.getElementById("elevPrev");
    const elevNext     = document.getElementById("elevNext");
    const elevDotsWrap = document.getElementById("elevDots");

    if (elevTrack && elevPrev && elevNext) {
        let currentIndex = 0;
        let autoPlayTimer = null;
        const AUTOPLAY_MS = 3500;

        function getVisible() {
            if (window.innerWidth <= 640) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }
        const slides = elevTrack.querySelectorAll(".elev-slide");
        const totalSlides = slides.length;

        function buildDots() {
            if (!elevDotsWrap) return;
            elevDotsWrap.innerHTML = "";
            const visible = getVisible();
            const totalPages = totalSlides - visible + 1;
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement("button");
                dot.className = "elev-dot" + (i === currentIndex ? " active" : "");
                dot.addEventListener("click", () => goTo(i));
                elevDotsWrap.appendChild(dot);
            }
        }

        function updateDots() {
            if (!elevDotsWrap) return;
            elevDotsWrap.querySelectorAll(".elev-dot").forEach((d, i) => {
                d.classList.toggle("active", i === currentIndex);
            });
        }

        function goTo(index) {
            const visible = getVisible();
            const maxIndex = Math.max(0, totalSlides - visible);
            currentIndex = Math.min(Math.max(index, 0), maxIndex);
            const slideEl = slides[0];
            const gap = window.innerWidth <= 640 ? 16 : 24;
            const slideWidth = slideEl.getBoundingClientRect().width;
            const offset = currentIndex * (slideWidth + gap);
            elevTrack.style.transform = `translateX(-${offset}px)`;
            elevPrev.disabled = currentIndex === 0;
            elevNext.disabled = currentIndex >= maxIndex;
            updateDots();
        }

        function next() {
            const visible = getVisible();
            const maxIndex = Math.max(0, totalSlides - visible);
            goTo(currentIndex < maxIndex ? currentIndex + 1 : 0);
        }

        function prev() {
            const visible = getVisible();
            const maxIndex = Math.max(0, totalSlides - visible);
            goTo(currentIndex > 0 ? currentIndex - 1 : maxIndex);
        }

        function startAutoPlay() { 
            stopAutoPlay(); 
            autoPlayTimer = setInterval(next, AUTOPLAY_MS); 
        }

        function stopAutoPlay() { 
            if (autoPlayTimer) { 
                clearInterval(autoPlayTimer); 
                autoPlayTimer = null; 
            } 
        }
        
        elevNext.addEventListener("click", () => { next(); startAutoPlay(); });
        elevPrev.addEventListener("click", () => { prev(); startAutoPlay(); });
        
        const sliderSection = document.getElementById("solutionSliderSection");
        if (sliderSection) {
            sliderSection.addEventListener("mouseenter", stopAutoPlay);
            sliderSection.addEventListener("mouseleave", startAutoPlay);
        }
        
        buildDots(); 
        goTo(0); 
        startAutoPlay();
    }

    /* ===== 7. Assistant Chatbot Widget Controller ===== */
    const assistantToggleBtn = document.getElementById("assistantToggleBtn");
    const assistantCloseBtn  = document.getElementById("assistantCloseBtn");
    const assistantChatWindow = document.getElementById("assistantChatWindow");
    const acwMessages         = document.getElementById("acwMessages");
    const questionButtons     = document.querySelectorAll(".acw-q-btn");

    if (assistantToggleBtn && assistantChatWindow && acwMessages) {
        // Toggle Open
        assistantToggleBtn.addEventListener("click", () => {
            assistantChatWindow.classList.add("active");
            assistantToggleBtn.style.display = "none";
        });

        // Toggle Close
        const closeChat = () => {
            assistantChatWindow.classList.remove("active");
            assistantToggleBtn.style.display = "flex";
        };
        if (assistantCloseBtn) {
            assistantCloseBtn.addEventListener("click", closeChat);
        }

        // Handle Pre-fed Questions
        questionButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const questionText = btn.textContent;
                const answerText   = btn.getAttribute("data-answer");

                // 1. Add User Message
                const userMsg = document.createElement("div");
                userMsg.className = "acw-msg user";
                userMsg.textContent = questionText;
                acwMessages.appendChild(userMsg);

                // Disable button momentarily
                btn.style.opacity = "0.5";
                btn.style.pointerEvents = "none";

                // Auto Scroll
                acwMessages.scrollTop = acwMessages.scrollHeight;

                // 2. Add Bot Answer with realistic delay
                setTimeout(() => {
                    const botMsg = document.createElement("div");
                    botMsg.className = "acw-msg bot";
                    botMsg.textContent = answerText;
                    acwMessages.appendChild(botMsg);

                    // Re-enable button
                    btn.style.opacity = "";
                    btn.style.pointerEvents = "";

                    // Auto Scroll
                    acwMessages.scrollTop = acwMessages.scrollHeight;
                }, 500);
            });
        });
    }

    /* ===== 8. Smooth Back to Top / Year Update (Bonus) ===== */
    // Update copyright year automatically
    const yearSpan = document.querySelector('.footer-bottom p:first-child');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = `&copy; ${currentYear} CNE Zone. All Rights Reserved.`;
    }

    console.log("🚀 CNE Zone - Website Loaded Successfully!");
});