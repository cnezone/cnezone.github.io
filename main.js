/* =====================================================
   CNE ZONE — Global Frontend Controller (FULLY FIXED)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function() {

    console.log("CNE Zone - Initializing...");

    /* ===== 1. FIX: Font Awesome Icons Check ===== */
    function checkFontAwesome() {
        var testIcon = document.createElement('i');
        testIcon.className = 'fas fa-check';
        testIcon.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
        document.body.appendChild(testIcon);

        var computedStyle = window.getComputedStyle(testIcon);
        var fontFamily = computedStyle.getPropertyValue('font-family');
        document.body.removeChild(testIcon);

        if (!fontFamily || !fontFamily.includes('Font Awesome')) {
            console.warn('Font Awesome not loaded. Loading now...');
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            link.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        }
    }
    checkFontAwesome();

    /* ===== 2. Header Scroll Effect ===== */
    var header = document.querySelector(".main-header");
    if (header) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    /* ===== 3. MOBILE NAVIGATION - FULLY FIXED ===== */
    var mobileToggle = document.getElementById("mobileToggle");
    var navMenu = document.getElementById("navMenu");
    var navLinks = document.querySelectorAll(".nav-link");

    console.log("Mobile Toggle found:", !!mobileToggle);
    console.log("Nav Menu found:", !!navMenu);

    if (mobileToggle && navMenu) {

        // Toggle menu on button click
        mobileToggle.addEventListener("click", function(e) {
            e.stopPropagation();
            e.preventDefault();

            navMenu.classList.toggle("active");

            // Change icon
            var icon = mobileToggle.querySelector("i");
            if (icon) {
                if (navMenu.classList.contains("active")) {
                    icon.className = "fas fa-times";
                    document.body.style.overflow = "hidden";
                } else {
                    icon.className = "fas fa-bars";
                    document.body.style.overflow = "";
                }
            }

            console.log("Menu toggled. Active:", navMenu.classList.contains("active"));
        });

        // Close menu when a link is clicked
        navLinks.forEach(function(link) {
            link.addEventListener("click", function() {
                navMenu.classList.remove("active");
                var icon = mobileToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", function(e) {
            if (navMenu.classList.contains("active")) {
                var isHeader = header && header.contains(e.target);
                var isToggle = mobileToggle && mobileToggle.contains(e.target);
                if (!isHeader && !isToggle) {
                    navMenu.classList.remove("active");
                    var icon = mobileToggle.querySelector("i");
                    if (icon) icon.className = "fas fa-bars";
                    document.body.style.overflow = "";
                }
            }
        });

        // Close menu on Escape key
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                var icon = mobileToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            }
        });

        // Close menu on window resize (desktop)
        window.addEventListener("resize", function() {
            if (window.innerWidth > 767 && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
                var icon = mobileToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
                document.body.style.overflow = "";
            }
        });

    } else {
        console.error("Mobile toggle or nav menu not found!");
    }

    /* ===== 4. Active nav link highlighting ===== */
    var currentPage = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(function(link) {
        var linkPage = link.getAttribute("href");
        if (linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html") ||
            (currentPage === "index.html" && linkPage === "index.html")) {
            link.classList.add("active");
        }
    });

    /* ===== 5. Scroll Reveal ===== */
    var revealObserver = new IntersectionObserver(function(entries) {
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
    var tabBtns = document.querySelectorAll(".tab-btn");
    var tabPanes = document.querySelectorAll(".tab-pane");
    if (tabBtns.length > 0) {
        tabBtns.forEach(function(btn) {
            btn.addEventListener("click", function() {
                var target = btn.getAttribute("data-tab");
                tabBtns.forEach(function(b) { b.classList.remove("active"); });
                tabPanes.forEach(function(p) { p.classList.remove("active"); });
                btn.classList.add("active");
                var pane = document.getElementById(target);
                if (pane) pane.classList.add("active");
            });
        });
    }

    /* ===== 7. Assistant Chatbot ===== */
    var assistantToggleBtn = document.getElementById("assistantToggleBtn");
    var assistantCloseBtn = document.getElementById("assistantCloseBtn");
    var assistantChatWindow = document.getElementById("assistantChatWindow");
    var acwMessages = document.getElementById("acwMessages");
    var questionButtons = document.querySelectorAll(".acw-q-btn");

    if (assistantToggleBtn && assistantChatWindow && acwMessages) {
        assistantToggleBtn.addEventListener("click", function() {
            assistantChatWindow.classList.add("active");
            assistantToggleBtn.style.display = "none";
        });

        var closeChat = function() {
            assistantChatWindow.classList.remove("active");
            assistantToggleBtn.style.display = "flex";
        };

        if (assistantCloseBtn) {
            assistantCloseBtn.addEventListener("click", closeChat);
        }

        document.addEventListener("click", function(e) {
            if (assistantChatWindow.classList.contains("active")) {
                var isChat = assistantChatWindow.contains(e.target);
                var isToggle = assistantToggleBtn.contains(e.target);
                if (!isChat && !isToggle) {
                    closeChat();
                }
            }
        });

        questionButtons.forEach(function(btn) {
            btn.addEventListener("click", function() {
                var questionText = btn.textContent;
                var answerText = btn.getAttribute("data-answer");

                var userMsg = document.createElement("div");
                userMsg.className = "acw-msg user";
                userMsg.textContent = questionText;
                acwMessages.appendChild(userMsg);

                btn.style.opacity = "0.5";
                btn.style.pointerEvents = "none";
                acwMessages.scrollTop = acwMessages.scrollHeight;

                setTimeout(function() {
                    var botMsg = document.createElement("div");
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
    var yearSpans = document.querySelectorAll('.footer-bottom p');
    var currentYear = new Date().getFullYear();
    yearSpans.forEach(function(span) {
        if (span.textContent.includes('CNE Zone')) {
            span.innerHTML = '&copy; ' + currentYear + ' CNE Zone. All Rights Reserved.';
        }
    });

    /* ===== 9. Counter Animation ===== */
    var statsSection = document.querySelector('.transparent-stats-section');
    if (statsSection) {
        var counters = statsSection.querySelectorAll('.stat-number-wrap[data-target]');
        if (counters.length > 0) {
            var statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        counters.forEach(function(counter) {
                            var target = parseInt(counter.getAttribute('data-target'));
                            var duration = 1500;
                            var startTime = performance.now();
                            var unitSpan = counter.querySelector('.stat-unit-orange');
                            var unitText = unitSpan ? unitSpan.outerHTML : '';

                            function updateCounter(currentTime) {
                                var elapsed = currentTime - startTime;
                                var progress = Math.min(elapsed / duration, 1);
                                var eased = 1 - Math.pow(1 - progress, 3);
                                var currentVal = Math.round(target * eased);
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

    /* ===== 10. Services Step Cards ===== */
    var serviceCards = document.querySelectorAll('.service-step-card.fade-hidden');
    if (serviceCards.length > 0) {
        var serviceObserver = new IntersectionObserver(function(entries) {
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
    var tabCards = document.querySelectorAll('.tab-card-item');
    if (tabCards.length > 0) {
        var tabCardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    tabCardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        tabCards.forEach(function(card) { tabCardObserver.observe(card); });
    }

    /* ===== 12. Projects Slider ===== */
    var projectWrappers = document.querySelectorAll('.project-media-wrapper');
    projectWrappers.forEach(function(wrapper) {
        var track = wrapper.querySelector('.media-slider-track');
        var thumbnailsContainer = wrapper.querySelector('.media-thumbnails');
        var folder = wrapper.getAttribute('data-folder');
        var count = parseInt(wrapper.getAttribute('data-count'));

        if (!track || !folder || !count) return;

        var mediaItems = [];

        for (var i = 1; i <= count; i++) {
            var slide = document.createElement('div');
            slide.className = 'media-slide';

            var imgPath = './' + folder + '_img_' + i + '.jpg';
            var vidPath = './' + folder + '_vid_' + i + '.mp4';

            var testImg = new Image();
            testImg.src = imgPath;

            (function(index, slideEl, imgSrc, vidSrc) {
                testImg.onload = function() {
                    slideEl.innerHTML = '<img src="' + imgSrc + '" alt="' + folder + ' Image ' + index + '" onclick="openLightbox(\'' + folder + '\', ' + count + ', ' + (index - 1) + ')">';
                    track.appendChild(slideEl);
                    mediaItems.push({ type: 'image', index: index - 1 });
                    updateThumbnails(thumbnailsContainer, count, track);
                };

                testImg.onerror = function() {
                    var testVideo = document.createElement('video');
                    testVideo.src = vidSrc;

                    testVideo.onloadeddata = function() {
                        slideEl.innerHTML = '<video autoplay loop muted playsinline onclick="openLightbox(\'' + folder + '\', ' + count + ', ' + (index - 1) + ')"><source src="' + vidSrc + '" type="video/mp4"></video><div class="play-btn-overlay"><i class="fas fa-play"></i></div>';
                        track.appendChild(slideEl);
                        mediaItems.push({ type: 'video', index: index - 1 });
                        updateThumbnails(thumbnailsContainer, count, track);
                    };

                    testVideo.onerror = function() {
                        slideEl.innerHTML = '<img src="https://placehold.co/600x400/07111f/ffffff?text=' + folder.toUpperCase() + '+' + index + '" alt="Placeholder ' + index + '" onclick="openLightbox(\'' + folder + '\', ' + count + ', ' + (index - 1) + ')">';
                        track.appendChild(slideEl);
                        mediaItems.push({ type: 'placeholder', index: index - 1 });
                        updateThumbnails(thumbnailsContainer, count, track);
                    };
                };
            })(i, slide, imgPath, vidPath);
        }
    });

    function updateThumbnails(container, count, track) {
        if (!container) return;
        container.innerHTML = '';
        for (var i = 0; i < count; i++) {
            var dot = document.createElement('button');
            dot.className = i === 0 ? 'media-thumbnail active' : 'media-thumbnail';
            dot.setAttribute('data-index', i);
            (function(index) {
                dot.addEventListener('click', function() {
                    var thumbnails = container.querySelectorAll('.media-thumbnail');
                    thumbnails.forEach(function(t) { t.classList.remove('active'); });
                    dot.classList.add('active');
                    track.style.transform = 'translateX(-' + (index * 100) + '%)';
                });
            })(i);
            container.appendChild(dot);
        }
    }

    /* ===== 13. Lightbox ===== */
    var lightboxOverlay = document.getElementById('lightboxOverlay');
    var lightboxContent = document.getElementById('lightboxContent');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');

    var currentLightboxFolder = '';
    var currentLightboxCount = 0;
    var currentLightboxIndex = 0;

    window.openLightbox = function(folder, count, index) {
        currentLightboxFolder = folder;
        currentLightboxCount = count;
        currentLightboxIndex = index;
        updateLightboxContent();
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    function updateLightboxContent() {
        var i = currentLightboxIndex + 1;
        var imgPath = './' + currentLightboxFolder + '_img_' + i + '.jpg';
        var vidPath = './' + currentLightboxFolder + '_vid_' + i + '.mp4';

        lightboxContent.innerHTML = '';
        var img = document.createElement('img');
        img.src = imgPath;
        img.alt = currentLightboxFolder + ' Image ' + i;
        img.style.cssText = 'width:100%;height:auto;max-height:85vh;object-fit:contain;border-radius:12px;';

        img.onerror = function() {
            var video = document.createElement('video');
            video.controls = true;
            video.autoplay = true;
            video.style.cssText = 'width:100%;max-height:85vh;border-radius:12px;background:black;';

            var source = document.createElement('source');
            source.src = vidPath;
            source.type = 'video/mp4';
            video.appendChild(source);

            video.onerror = function() {
                img.src = 'https://placehold.co/800x600/07111f/ffffff?text=' + currentLightboxFolder.toUpperCase() + '+' + i;
                img.onerror = null;
                lightboxContent.appendChild(img);
            };
            lightboxContent.appendChild(video);
        };

        img.onload = function() {
            lightboxContent.appendChild(img);
        };
    }

    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        var video = lightboxContent.querySelector('video');
        if (video) { video.pause(); }
    }

    function changeLightbox(direction) {
        if (direction === 'next') {
            currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxCount;
        } else if (direction === 'prev') {
            currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxCount) % currentLightboxCount;
        }
        updateLightboxContent();
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', function(e) {
            if (e.target === lightboxOverlay) closeLightbox();
        });
    }
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() { changeLightbox('prev'); });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() { changeLightbox('next'); });
    }

    document.addEventListener('keydown', function(e) {
        if (lightboxOverlay && lightboxOverlay.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') changeLightbox('next');
            if (e.key === 'ArrowLeft') changeLightbox('prev');
        }
    });

    /* ===== 14. Contact Form ===== */
    var contactForm = document.getElementById('contactFormEl');
    var contactStatus = document.getElementById('cf-status');
    if (contactForm && contactStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('cf-name') ? document.getElementById('cf-name').value.trim() : '';
            var phone = document.getElementById('cf-phone') ? document.getElementById('cf-phone').value.trim() : '';
            var email = document.getElementById('cf-email') ? document.getElementById('cf-email').value.trim() : '';
            var service = document.getElementById('cf-service') ? document.getElementById('cf-service').value : '';
            var message = document.getElementById('cf-message') ? document.getElementById('cf-message').value.trim() : '';

            if (!name || !email || !message) {
                contactStatus.style.display = 'block';
                contactStatus.style.color = '#ef4444';
                contactStatus.textContent = 'Please fill in all required fields.';
                return;
            }

            var lines = [
                'New Website Inquiry — CNE Zone',
                'Name: ' + name,
                phone ? 'Phone: ' + phone : null,
                'Email: ' + email,
                'Service Needed: ' + service,
                'Project Details: ' + message
            ].filter(Boolean);

            var waText = encodeURIComponent(lines.join('\n'));
            var waUrl = 'https://wa.me/923008005682?text=' + waText;

            contactStatus.style.display = 'block';
            contactStatus.style.color = 'var(--blue-500)';
            contactStatus.textContent = 'Opening WhatsApp to send your inquiry...';

            window.open(waUrl, '_blank');
            contactForm.reset();
        });
    }

    /* ===== 15. Logo Rain Animation ===== */
    var rainContainer = document.getElementById('logoRainContainer');
    if (rainContainer) {
        var logoList = [
            './logo1.png', './logo2.png', './logo3.png', './logo4.png', './logo5.png',
            './logo6.png', './logo7.png', './logo8.png', './logo9.png', './logo10.png'
        ];

        function createLogoDrop() {
            var img = document.createElement('img');
            var randomLogo = logoList[Math.floor(Math.random() * logoList.length)];
            img.src = randomLogo;
            img.className = 'logo-drop';
            var randomLeft = Math.random() * 90 + 5;
            img.style.left = randomLeft + '%';
            var randomDelay = Math.random() * 2;
            img.style.animationDelay = randomDelay + 's';
            rainContainer.appendChild(img);

            img.addEventListener('animationend', function() {
                img.remove();
                setTimeout(function() { createLogoDrop(); }, Math.random() * 2000 + 1000);
            });
        }

        for (var i = 0; i < 4; i++) {
            setTimeout(function() { createLogoDrop(); }, i * 800);
        }
    }

    console.log("🚀 CNE Zone - Website Loaded Successfully!");
});
