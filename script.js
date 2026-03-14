document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Navigation Toggle
       ========================================================================== */
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    /* ==========================================================================
       2. Navbar scroll effect & Active link highlighting
       ========================================================================== */
    const nav = document.querySelector('.glass-nav');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Nav background blur on scroll
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       3. Typing Effect in Hero Section
       ========================================================================== */
    const textElement = document.querySelector('.typing-text');
    const fullText = document.querySelector('.glitch-text').getAttribute('data-text');
    let textIndex = 0;

    function typeWriter() {
        if (textIndex < fullText.length) {
            textElement.innerHTML += fullText.charAt(textIndex);
            textIndex++;
            setTimeout(typeWriter, 150);
        }
    }
    
    // Start initial typing
    setTimeout(typeWriter, 1000);

    /* ==========================================================================
       4. Terminal Animation
       ========================================================================== */
    const terminalBody = document.getElementById('terminal-typing');
    const terminalCommands = [
        "Loading AI modules...",
        "Connecting to AWS EC2...",
        "Starting Python microservices...",
        "Initializing Salescode engine...",
        "Status: System Online_ 🚀",
        "> Kavya.deployPortfolio()"
    ];

    let cmdIndex = 0;
    let charIndex = 0;
    
    function typeTerminal() {
        if (cmdIndex < terminalCommands.length) {
            if (charIndex === 0) {
                terminalBody.innerHTML += '<br><span style="color:#27c93f">></span> ';
            }
            
            if (charIndex < terminalCommands[cmdIndex].length) {
                terminalBody.innerHTML += terminalCommands[cmdIndex].charAt(charIndex);
                charIndex++;
                setTimeout(typeTerminal, 50);
            } else {
                cmdIndex++;
                charIndex = 0;
                setTimeout(typeTerminal, 800);
            }
        }
    }

    setTimeout(typeTerminal, 2500);

    /* ==========================================================================
       5. Scroll Reveal Animation using Intersection Observer
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       6. Interactive Background Particles (Canvas)
       ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let w, h, particles;
    const particleCount = 60; // Adjust for performance
    
    function initCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 1, // radius
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.15)' : 'rgba(157, 0, 255, 0.15)'
            });
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Move particle
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > w) p.vx = -p.vx;
            if (p.y < 0 || p.y > h) p.vy = -p.vy;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Draw lines between close particles
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - dist/150)})`;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }

    initCanvas();
    animateParticles();

    // Re-init canvas on window resize
    window.addEventListener('resize', () => {
        initCanvas();
    });

    /* ==========================================================================
       7. Form Submission Prevention (Demo)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sent Successfully! <i class="fas fa-check"></i>';
            btn.style.background = '#27c93f';
            
            contactForm.reset();
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        });
    }
});
