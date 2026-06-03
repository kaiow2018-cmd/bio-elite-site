/**
 * KAIO ELITE PORTFOLIO - Master Logic & Motion
 * Features: Staggered Reveal, Magnetic Buttons, Bento Deep-Dive
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ENHANCED REVEAL ON SCROLL ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        let delayCounter = 0;
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains('active')) {
                // Apply a staggered "wave" effect for multiple items entering at once
                entry.target.style.transitionDelay = `${delayCounter * 150}ms`;
                entry.target.classList.add('active');
                delayCounter++;
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));


    // --- 1.1 HERO PARALLAX (Buttery Smooth Lerp + Performance Lock) ---
    const heroImage = document.querySelector('.hero-bg img');
    if (heroImage) {
        let currentY = 0;
        let targetY = 0;
        let isLoopActive = true;
        const ease = 0.08;

        function updateParallax() {
            targetY = window.scrollY;
            
            // KILL SWITCH: Stop loop if hero is far off-screen to save CPU
            if (targetY > window.innerHeight * 1.5) {
                isLoopActive = false;
                return;
            }

            // Linear Interpolation (Lerp)
            currentY += (targetY - currentY) * ease;
            const val = currentY * 0.35;
            heroImage.style.transform = `translate3d(0, ${val}px, 0)`;
            
            requestAnimationFrame(updateParallax);
        }

        // Reactivate loop only when user scrolls back up
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight * 1.5 && !isLoopActive) {
                isLoopActive = true;
                requestAnimationFrame(updateParallax);
            }
        }, { passive: true });
        
        requestAnimationFrame(updateParallax);
    }


    // --- 2. MAGNETIC BUTTON EFFECT (Premium Touch) ---
    const magneticBtns = document.querySelectorAll('.btn-premium');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px) scale(1)';
        });
    });


    // --- 3. BENTO INTERACTIVE GLOW & LAZY PREVIEW ---
    const bentoItems = document.querySelectorAll('.bento-item');
    /* Otimização de Performance: Iframes internos desativados para evitar travamento mobile.
       O carregamento agora ocorre apenas no clique para abrir o Modal de Elite. */
    const previewObserver = new IntersectionObserver((entries) => {
        // Observer mantido para futuras animações, mas sem carregar iframes pesados
    }, { threshold: 0.1 });

    bentoItems.forEach(item => {
        previewObserver.observe(item);
        let rafId = null;
        
        item.addEventListener('mousemove', (e) => {
            if (rafId) return; // Wait for next frame
            
            rafId = requestAnimationFrame(() => {
                const rect = item.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                item.style.setProperty('--mouse-x', `${x}px`);
                item.style.setProperty('--mouse-y', `${y}px`);
                item.style.setProperty('--glow-opacity', '1');
                rafId = null;
            });
        });
        
        item.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            item.style.setProperty('--glow-opacity', '0');
            rafId = null;
        });
    });


    // --- 4. PREVIEW MODAL LOGIC (Elite Interaction) ---
    const modal = document.getElementById('project-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const modalLoader = modal.querySelector('.modal-loader');
    const closeBtn = modal.querySelector('.modal-close');

    function openModal(url) {
        if (!url) return;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Block background scroll
        modalLoader.classList.remove('hidden');
        
        // Load URL and hide loader when done
        modalIframe.src = url;
        modalIframe.onload = () => {
            modalLoader.classList.add('hidden');
        };
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        
        // Clear iframe to stop resources/audio
        setTimeout(() => {
            modalIframe.src = '';
        }, 500); 
    }

    // Event listeners for bento items
    bentoItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const demoUrl = item.getAttribute('data-demo');
            if (demoUrl) openModal(demoUrl);
        });
    });

    // Close button click
    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });


    // --- 5. SMOOTH ANCHOR SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 20, // Reduced offset after header removal
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 6. ANIMATED COUNTERS (Social Proof) ---
    const statsGrid = document.querySelector('.stats-grid');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Subtle easing (outQuad)
            const easeProgress = progress * (2 - progress);
            const currentCount = Math.floor(easeProgress * target);
            
            el.textContent = currentCount;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target; // Ensure it ends at target
            }
        }
        
        requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(num => animateCount(num));
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    if (statsGrid) statsObserver.observe(statsGrid);

    // --- 7. FLOW SVG PATH ANIMATION & STEP INTERACTIONS ---
    const flowSection = document.querySelector('#method');
    const drawingPath = document.querySelector('#drawing-path');
    const flowSteps = document.querySelectorAll('.flow-step');

    if (drawingPath) {
        const pathLength = drawingPath.getTotalLength();
        drawingPath.style.strokeDasharray = pathLength;
        drawingPath.style.strokeDashoffset = pathLength;

        const pathObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    drawingPath.style.transition = 'stroke-dashoffset 4s cubic-bezier(0.4, 0, 0.2, 1)';
                    drawingPath.style.strokeDashoffset = '0';
                }
            });
        }, { threshold: 0.1 });

        pathObserver.observe(flowSection);
    }

    // Magnetic interaction for Flow Steps (Subtle)
    flowSteps.forEach(step => {
        step.addEventListener('mousemove', (e) => {
            const rect = step.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const icon = step.querySelector('.step-icon-wrapper');
            if (icon) {
                const ix = (x - rect.width / 2) * 0.05;
                const iy = (y - rect.height / 2) * 0.05;
                icon.style.transform = `translate(${ix}px, ${iy}px)`;
            }
        });

        step.addEventListener('mouseleave', () => {
            const icon = step.querySelector('.step-icon-wrapper');
            if (icon) icon.style.transform = '';
        });
    });
    // --- 7. WHATSAPP VISIBILITY ON SCROLL ---
    const whatsappBtn = document.querySelector('.whatsapp-float');

    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        if (scrollPercent > 0.6) {
            whatsappBtn.classList.add('visible');
        } else {
            whatsappBtn.classList.remove('visible');
        }
    });
});
