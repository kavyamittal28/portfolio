/* ==========================================================================
   Shared JS - Reusable across all pages
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* Theme Toggle */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    if (themeToggle && themeIcon) {
        const savedTheme = localStorage.getItem('kavya-theme') || 'dark';
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(savedTheme + '-theme');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-theme');
            document.body.classList.remove('dark-theme', 'light-theme');
            document.body.classList.add(isDark ? 'light-theme' : 'dark-theme');
            themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('kavya-theme', isDark ? 'light' : 'dark');
            if (typeof particles !== 'undefined' && particles) {
                const isLight = isDark;
                particles.forEach(p => {
                    p.color = Math.random() > 0.5
                        ? (isLight ? 'rgba(0, 144, 170, 0.15)' : 'rgba(0, 240, 255, 0.15)')
                        : (isLight ? 'rgba(123, 0, 204, 0.15)' : 'rgba(157, 0, 255, 0.15)');
                });
            }
        });
    }

    /* Canvas Particles */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h;
        window.particles = [];
        const particleCount = 50;

        function initCanvas() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
            window.particles = [];
            for (let i = 0; i < particleCount; i++) {
                window.particles.push({
                    x: Math.random() * w, y: Math.random() * h,
                    r: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
                    color: Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.15)' : 'rgba(157, 0, 255, 0.15)'
                });
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < window.particles.length; i++) {
                let p = window.particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx = -p.vx;
                if (p.y < 0 || p.y > h) p.vy = -p.vy;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                for (let j = i + 1; j < window.particles.length; j++) {
                    let p2 = window.particles[j];
                    let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - dist / 150)})`;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initCanvas();
        animateParticles();
        window.addEventListener('resize', initCanvas);
    }

    /* Custom Cursor */
    const customCursor = document.getElementById('custom-cursor');
    if (window.matchMedia('(pointer: fine)').matches && customCursor) {
        document.body.classList.add('custom-cursor');
        customCursor.classList.add('visible');
        let trailDots = [];
        for (let i = 0; i < 10; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail-dot';
            document.body.appendChild(dot);
            trailDots.push(dot);
        }
        let trailIdx = 0, lastTrail = 0;

        document.addEventListener('mousemove', (e) => {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';
            const now = Date.now();
            if (now - lastTrail > 35) {
                const d = trailDots[trailIdx % trailDots.length];
                d.style.left = e.clientX + 'px';
                d.style.top = e.clientY + 'px';
                d.style.opacity = '0.5';
                setTimeout(() => d.style.opacity = '0', 50);
                trailIdx++;
                lastTrail = now;
            }
        });

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .btn, .tag')) customCursor.classList.add('hovering');
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .btn, .tag')) customCursor.classList.remove('hovering');
        });
    }

    /* Scroll Reveal + Text Scramble */
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.originalHTML = el.innerHTML;
            this.originalText = el.textContent;
            this.chars = '!<>-_\\/[]{}#@$%^&*()+=01';
        }
        scramble() {
            const t = this.originalText, l = t.length;
            let iter = 0;
            const iv = setInterval(() => {
                this.el.textContent = t.split('').map((c, i) => {
                    if (c === ' ') return ' ';
                    if (i < iter) return t[i];
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                }).join('');
                if (iter >= l) { clearInterval(iv); this.el.innerHTML = this.originalHTML; }
                iter += 0.5;
            }, 30);
        }
    }

    const revealElements = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('section-title')) {
                    new TextScramble(entry.target).scramble();
                }
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => revealObs.observe(el));

    /* Counter Animations */
    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        const cObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseFloat(el.getAttribute('data-target'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    const isDec = String(target).includes('.');
                    const start = performance.now();
                    function upd(now) {
                        const p = Math.min((now - start) / 1500, 1);
                        const e = 1 - Math.pow(1 - p, 3);
                        el.textContent = (isDec ? (target * e).toFixed(2) : Math.floor(target * e)) + suffix;
                        if (p < 1) requestAnimationFrame(upd);
                        else el.textContent = (isDec ? target.toFixed(2) : target) + suffix;
                    }
                    requestAnimationFrame(upd);
                    cObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        cObs.observe(el);
    });

    /* 3D Card Tilt */
    document.querySelectorAll('.glass-card:not(.interactive-terminal)').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const tX = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -5;
            const tY = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 5;
            card.style.transform = `perspective(1000px) rotateX(${tX}deg) rotateY(${tY}deg) scale3d(1.02,1.02,1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
        });
    });

    /* Page Transition */
    const overlay = document.getElementById('page-transition-overlay');
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.hasAttribute('download') || !href.endsWith('.html')) return;
        e.preventDefault();
        if (overlay) { overlay.classList.add('active'); setTimeout(() => window.location.href = href, 400); }
        else window.location.href = href;
    });

    window.addEventListener('load', () => {
        if (overlay) { overlay.classList.add('active'); setTimeout(() => overlay.classList.remove('active'), 200); }
    });

});
