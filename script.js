/* ================================
   BIRTHDAY LANDING PAGE - SCRIPT
   by NguyenNhuHaiDang - 27NetTeam
   ================================ */

(() => {
    'use strict';

    // ========================
    // GALLERY IMAGES (LOCAL)
    // ========================
    const images = ["img/1.png", "img/2.png", "img/3.png", "img/4.png"];

    // ========================
    // DOM ELEMENTS
    // ========================
    const DOM = {
        introScreen: document.getElementById('intro-screen'),
        loadingPhase: document.getElementById('loading-phase'),
        stuckPhase: document.getElementById('stuck-phase'),
        errorPhase: document.getElementById('error-phase'),
        foundPhase: document.getElementById('found-phase'),
        progressFill: document.getElementById('progress-fill'),
        progressText: document.getElementById('progress-text'),
        btnExit: document.getElementById('btn-exit'),
        btnRetry: document.getElementById('btn-retry'),
        btnRealRetry: document.getElementById('btn-real-retry'),
        btnEnter: document.getElementById('btn-enter'),
        mainPage: document.getElementById('main-page'),
        galleryGrid: document.getElementById('gallery-grid'),
        lightbox: document.getElementById('lightbox'),
        lightboxImg: document.getElementById('lightbox-img'),
        lightboxClose: document.getElementById('lightbox-close'),
        lightboxPrev: document.getElementById('lightbox-prev'),
        lightboxNext: document.getElementById('lightbox-next'),
        lightboxCounter: document.getElementById('lightbox-counter'),
        typewriterText: document.getElementById('typewriter-text'),
        typewriterCursor: document.getElementById('typewriter-cursor'),
        giftBox: document.getElementById('gift-box'),
        giftMessage: document.getElementById('gift-message'),
        mouseGlow: document.getElementById('mouse-glow'),
        floatingHearts: document.getElementById('floating-hearts'),
        confettiCanvas: document.getElementById('confetti-canvas'),
        messageHearts: document.getElementById('message-hearts'),
        birthdayMusic: document.getElementById('birthday-music'),
        quackSound: document.getElementById('quack-sound'),
    };

    // ========================
    // STATE
    // ========================
    let currentLightboxIndex = 0;
    let typewriterStarted = false;
    let giftOpened = false;
    let confettiParticles = [];
    let confettiActive = false;

    // ========================
    // 1. TROLL INTRO SCREEN
    // ========================
    const initIntro = () => {
        let progress = 0;
        const loadingInterval = setInterval(() => {
            // Speed up initially, then slow down near 99
            if (progress < 70) {
                progress += Math.random() * 8 + 2;
            } else if (progress < 95) {
                progress += Math.random() * 2 + 0.5;
            } else if (progress < 99) {
                progress += Math.random() * 0.3;
            }

            if (progress >= 99) {
                progress = 99;
                clearInterval(loadingInterval);

                // After 5 seconds stuck at 99%, show stuck phase
                setTimeout(() => {
                    switchPhase('stuck');
                }, 5000);
            }

            const rounded = Math.min(Math.floor(progress), 99);
            DOM.progressFill.style.width = `${rounded}%`;
            DOM.progressText.textContent = `${rounded}%`;
        }, 100);
    };

    const switchPhase = (phase) => {
        // Hide all phases
        document.querySelectorAll('.intro-phase').forEach(p => {
            p.classList.remove('active');
        });

        // Show target phase
        const target = document.getElementById(`${phase}-phase`);
        if (target) {
            // Small delay for animation
            setTimeout(() => {
                target.classList.add('active');
            }, 100);
        }
    };

    // Exit button — runs away from mouse + quack sound
    const initExitButton = () => {
        DOM.btnExit.addEventListener('mouseover', (e) => {
            const rect = DOM.btnExit.parentElement.getBoundingClientRect();
            const maxX = rect.width - DOM.btnExit.offsetWidth;
            const maxY = rect.height - DOM.btnExit.offsetHeight;

            const randomX = Math.random() * 300 - 150;
            const randomY = Math.random() * 200 - 100;

            DOM.btnExit.style.position = 'relative';
            DOM.btnExit.style.left = `${Math.max(-maxX, Math.min(maxX, randomX))}px`;
            DOM.btnExit.style.top = `${Math.max(-maxY, Math.min(maxY, randomY))}px`;

            // Play quack sound each time
            try {
                DOM.quackSound.currentTime = 0;
                DOM.quackSound.play().catch(() => {});
            } catch (e) {}
        });
    };

    // Retry button → glitch + error
    const initRetryButton = () => {
        DOM.btnRetry.addEventListener('click', () => {
            // Glitch the whole screen
            DOM.introScreen.style.animation = 'glitch 0.3s ease 3';
            setTimeout(() => {
                DOM.introScreen.style.animation = '';
                switchPhase('error');
            }, 900);
        });
    };

    // Real retry → found message
    const initRealRetry = () => {
        DOM.btnRealRetry.addEventListener('click', () => {
            switchPhase('found');
            // Trigger some confetti on found
            launchConfetti(80);
        });
    };

    // Enter main page
    const initEnterButton = () => {
        DOM.btnEnter.addEventListener('click', () => {
            DOM.introScreen.classList.add('fade-out');
            setTimeout(() => {
                DOM.introScreen.style.display = 'none';
                DOM.mainPage.classList.remove('hidden');
                document.body.style.overflow = 'auto';
                initMainPageEffects();
            }, 800);
        });
    };

    // ========================
    // 2. MOUSE GLOW EFFECT
    // ========================
    const initMouseGlow = () => {
        let glowVisible = false;

        document.addEventListener('mousemove', (e) => {
            if (!glowVisible) {
                DOM.mouseGlow.style.opacity = '1';
                glowVisible = true;
            }
            DOM.mouseGlow.style.left = `${e.clientX}px`;
            DOM.mouseGlow.style.top = `${e.clientY}px`;
        });

        document.addEventListener('mouseleave', () => {
            DOM.mouseGlow.style.opacity = '0';
            glowVisible = false;
        });
    };

    // ========================
    // 3. FLOATING HEARTS
    // ========================
    const heartEmojis = ['💕', '💖', '💗', '💝', '💘', '🌸', '✨', '🎀', '💜', '🩷'];

    const spawnFloatingHeart = () => {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 14}px`;
        heart.style.animationDuration = `${Math.random() * 5 + 6}s`;

        DOM.floatingHearts.appendChild(heart);

        heart.addEventListener('animationend', () => heart.remove());
    };

    const initFloatingHearts = () => {
        // Spawn hearts periodically
        setInterval(spawnFloatingHeart, 800);
    };

    // ========================
    // 4. GALLERY - DYNAMIC RENDER
    // ========================
    const initGallery = () => {
        const grid = DOM.galleryGrid;

        images.forEach((src, index) => {
            const item = document.createElement('div');
            item.classList.add('gallery-item', 'fade-in-up');
            item.dataset.index = index;

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Ảnh Bảo Châu ${index + 1}`;
            img.loading = 'lazy';

            img.addEventListener('load', () => {
                setTimeout(() => {
                    item.classList.add('loaded');
                }, index * 200);
            });

            item.appendChild(img);
            grid.appendChild(item);

            // Click to open lightbox
            item.addEventListener('click', () => openLightbox(index));
        });
    };

    // ========================
    // 5. LIGHTBOX
    // ========================
    const openLightbox = (index) => {
        currentLightboxIndex = index;
        DOM.lightboxImg.src = images[index];
        DOM.lightboxCounter.textContent = `${index + 1} / ${images.length}`;
        DOM.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        DOM.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    const lightboxPrev = () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + images.length) % images.length;
        DOM.lightboxImg.src = images[currentLightboxIndex];
        DOM.lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${images.length}`;
        DOM.lightboxImg.style.animation = 'none';
        DOM.lightboxImg.offsetHeight; // reflow
        DOM.lightboxImg.style.animation = 'lightboxZoom 0.4s ease';
    };

    const lightboxNext = () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % images.length;
        DOM.lightboxImg.src = images[currentLightboxIndex];
        DOM.lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${images.length}`;
        DOM.lightboxImg.style.animation = 'none';
        DOM.lightboxImg.offsetHeight;
        DOM.lightboxImg.style.animation = 'lightboxZoom 0.4s ease';
    };

    const initLightbox = () => {
        DOM.lightboxClose.addEventListener('click', closeLightbox);
        DOM.lightboxPrev.addEventListener('click', lightboxPrev);
        DOM.lightboxNext.addEventListener('click', lightboxNext);

        DOM.lightbox.addEventListener('click', (e) => {
            if (e.target === DOM.lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!DOM.lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev();
            if (e.key === 'ArrowRight') lightboxNext();
        });
    };

    // ========================
    // 6. TYPEWRITER EFFECT
    // ========================
    const birthdayMessage = `Gửi Bảo Châu,

Chúc mừng sinh nhật cô gái xinh đẹp và tài năng nhất Xteam! 🎂

Một năm nữa lại trôi qua, và mình thật vui vì được biết bạn. Bạn luôn là người mang đến năng lượng tích cực, sự vui vẻ và ấm áp cho mọi người xung quanh. 🌟

Chúc bạn luôn mạnh khỏe, xinh đẹp, thành công trong mọi điều bạn làm. Hy vọng tuổi mới sẽ mang đến cho bạn thật nhiều niềm vui, hạnh phúc và những điều tuyệt vời nhất! 💖

Mãi là cô gái tuyệt vời nhất! 🌸✨

- From Xteam with love 💕

Đã ký: Trần Kiều My - Kami`;

    const typeWriter = (text, element, speed = 35) => {
        let i = 0;
        const cursor = DOM.typewriterCursor;

        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Blink cursor then hide
                setTimeout(() => {
                    cursor.style.display = 'none';
                }, 3000);
            }
        };

        type();
    };

    // ========================
    // 7. MESSAGE SECTION HEARTS
    // ========================
    const initMessageHearts = () => {
        const hearts = ['💕', '💖', '💗', '🌸', '✨'];
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.classList.add('message-heart');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100}%`;
            heart.style.animationDelay = `${Math.random() * 6}s`;
            heart.style.animationDuration = `${Math.random() * 4 + 4}s`;
            heart.style.fontSize = `${Math.random() * 16 + 16}px`;
            DOM.messageHearts.appendChild(heart);
        }
    };

    // ========================
    // 8. GIFT BOX
    // ========================
    const initGiftBox = () => {
        DOM.giftBox.addEventListener('click', () => {
            if (giftOpened) return;
            giftOpened = true;

            DOM.giftBox.classList.add('opened');

            // Confetti burst
            launchConfetti(200);

            // Play music
            try {
                DOM.birthdayMusic.volume = 0.5;
                DOM.birthdayMusic.play().catch(() => {});
            } catch (e) {}

            // Show gift message after animation
            setTimeout(() => {
                DOM.giftMessage.classList.remove('hidden');
                DOM.giftMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);
        });
    };

    // ========================
    // 9. CONFETTI SYSTEM
    // ========================
    const confettiCtx = DOM.confettiCanvas.getContext('2d');
    const confettiColors = [
        '#ff4d94', '#ff80b5', '#ffb3d1', '#c084fc',
        '#60a5fa', '#ffd700', '#ff6b9d', '#f472b6',
        '#a78bfa', '#fb923c', '#34d399', '#fbbf24'
    ];

    class ConfettiPiece {
        constructor(x, y) {
            this.x = x || Math.random() * window.innerWidth;
            this.y = y || -20;
            this.w = Math.random() * 12 + 6;
            this.h = Math.random() * 8 + 4;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.vx = (Math.random() - 0.5) * 8;
            this.vy = Math.random() * 4 + 2;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.gravity = 0.1;
            this.opacity = 1;
            this.decay = Math.random() * 0.005 + 0.002;
        }

        update() {
            this.x += this.vx;
            this.vy += this.gravity;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            this.opacity -= this.decay;
            this.vx *= 0.99;
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
            ctx.restore();
        }
    }

    const resizeConfettiCanvas = () => {
        DOM.confettiCanvas.width = window.innerWidth;
        DOM.confettiCanvas.height = window.innerHeight;
    };

    const launchConfetti = (count = 150) => {
        for (let i = 0; i < count; i++) {
            const x = Math.random() * window.innerWidth;
            const piece = new ConfettiPiece(x, -20);
            piece.vy = Math.random() * 6 + 3;
            piece.vx = (Math.random() - 0.5) * 12;
            confettiParticles.push(piece);
        }

        if (!confettiActive) {
            confettiActive = true;
            animateConfetti();
        }
    };

    const animateConfetti = () => {
        confettiCtx.clearRect(0, 0, DOM.confettiCanvas.width, DOM.confettiCanvas.height);

        confettiParticles.forEach(p => {
            p.update();
            p.draw(confettiCtx);
        });

        confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < window.innerHeight + 50);

        if (confettiParticles.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            confettiActive = false;
        }
    };

    // ========================
    // 10. PARALLAX
    // ========================
    const initParallax = () => {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            document.querySelectorAll('[data-parallax]').forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.1;
                const rect = el.getBoundingClientRect();
                const offset = (rect.top + scrollY) * speed;
                el.style.transform = `translateY(${scrollY * speed - offset}px)`;
            });
        });
    };

    // ========================
    // 11. SCROLL ANIMATIONS
    // ========================
    const initScrollAnimations = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger typewriter on message section
                    if (entry.target.closest('#message') && !typewriterStarted) {
                        typewriterStarted = true;
                        setTimeout(() => {
                            typeWriter(birthdayMessage, DOM.typewriterText);
                        }, 500);
                    }
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.fade-in-up, .gallery-item, .message-card, .gift-container, .section-header').forEach(el => {
            el.classList.add('fade-in-up');
            observer.observe(el);
        });
    };

    // ========================
    // 12. SMOOTH SCROLL
    // ========================
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };

    // ========================
    // MAIN PAGE EFFECTS INIT
    // ========================
    const initMainPageEffects = () => {
        initGallery();
        initLightbox();
        initMessageHearts();
        initGiftBox();
        initParallax();
        initScrollAnimations();
        initSmoothScroll();

        // Play birthday music on enter
        try {
            DOM.birthdayMusic.volume = 0.5;
            DOM.birthdayMusic.play().catch(() => {});
        } catch (e) {}

        // Small burst of confetti on page enter
        setTimeout(() => launchConfetti(60), 500);
    };

    // ========================
    // INITIALIZATION
    // ========================
    const init = () => {
        // Prevent scroll during intro
        document.body.style.overflow = 'hidden';

        // Setup confetti canvas
        resizeConfettiCanvas();
        window.addEventListener('resize', resizeConfettiCanvas);

        // Init global effects
        initMouseGlow();
        initFloatingHearts();

        // Init intro sequence
        initIntro();
        initExitButton();
        initRetryButton();
        initRealRetry();
        initEnterButton();
    };

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
