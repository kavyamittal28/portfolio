document.addEventListener('DOMContentLoaded', () => {

    // Track easter eggs found
    let eggsFound = new Set();

    /* ==========================================================================
       0. Boot Sequence
       ========================================================================== */
    const bootScreen = document.getElementById('boot-screen');
    const bootTerminal = document.getElementById('boot-terminal');
    const bootProgressFill = document.getElementById('boot-progress-fill');
    const bootSkipBtn = document.getElementById('boot-skip');

    let bootComplete = false;
    const bootPromise = new Promise((resolve) => {

        // Check if already booted this session
        if (sessionStorage.getItem('kavya_os_booted')) {
            bootScreen.classList.add('hidden');
            showContent();
            bootComplete = true;
            resolve();
            return;
        }

        document.body.classList.add('booting');

        const bootLines = [
            { text: 'KAVYA_OS v2.0', type: 'header', delay: 100 },
            { text: 'Initializing system...', type: 'system', delay: 400 },
            { text: '<span class="ok">[OK]</span> Loading profile modules', type: 'success', delay: 700 },
            { text: '<span class="ok">[OK]</span> Connecting AWS services', type: 'success', delay: 1000 },
            { text: '<span class="ok">[OK]</span> Starting Python runtime', type: 'success', delay: 1300 },
            { text: '<span class="ok">[OK]</span> Mounting Docker containers', type: 'success', delay: 1600 },
            { text: '<span class="ok">[OK]</span> Deploying microservices', type: 'success', delay: 1900 },
            { text: '<span class="ok">[OK]</span> AI modules online', type: 'success', delay: 2200 },
            { text: 'All systems operational.', type: 'system', delay: 2600 },
            { text: '> Deploying portfolio...', type: 'command', delay: 3000 },
        ];

        const totalDuration = 3400;

        bootLines.forEach((line, i) => {
            setTimeout(() => {
                if (bootComplete) return;
                const div = document.createElement('div');
                div.className = `boot-line boot-line-${line.type}`;
                div.innerHTML = line.text;
                div.style.animationDelay = '0s';
                bootTerminal.appendChild(div);
                // Update progress
                const progress = ((i + 1) / bootLines.length) * 100;
                bootProgressFill.style.width = progress + '%';
            }, line.delay);
        });

        // Dissolve and reveal
        setTimeout(() => {
            if (bootComplete) return;
            dissolveBoot(resolve);
        }, totalDuration);

        // Skip handlers
        function skipBoot() {
            if (bootComplete) return;
            dissolveBoot(resolve);
        }

        bootSkipBtn.addEventListener('click', skipBoot);
        document.addEventListener('keydown', function bootEsc(e) {
            if (e.key === 'Escape') {
                skipBoot();
                document.removeEventListener('keydown', bootEsc);
            }
        });
    });

    function dissolveBoot(resolve) {
        if (bootComplete) return;
        bootComplete = true;

        const lines = bootTerminal.querySelectorAll('.boot-line');
        lines.forEach((line, i) => {
            setTimeout(() => {
                line.classList.add('dissolving');
            }, i * 50);
        });

        setTimeout(() => {
            bootScreen.classList.add('hidden');
            document.body.classList.remove('booting');
            showContent();
            sessionStorage.setItem('kavya_os_booted', 'true');
            if (resolve) resolve();
        }, 600);
    }

    function showContent() {
        document.querySelectorAll('.content-hidden').forEach(el => {
            el.classList.remove('content-hidden');
            el.classList.add('content-visible');
        });
    }

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
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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
       3. Typing Effect in Hero Section (starts after boot)
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

    bootPromise.then(() => {
        setTimeout(typeWriter, 500);
    });

    /* ==========================================================================
       4. Interactive Terminal
       ========================================================================== */
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    let commandHistory = [];
    let historyIndex = -1;

    // Terminal data
    const termData = {
        about: `I'm a Backend-focused Software Engineer passionate about building scalable, AI-driven microservices and production-grade systems. With expertise in Python, Java, and LLM integrations, I thrive on taking full ownership of end-to-end AI workflows.`,
        education: 'B.E. Computer Science | Chitkara University, Punjab | 2022-Present | CGPA: 9.06',
        phone: '+91-8875484025',
        email: 'kavyamittal1282@gmail.com',
        location: 'Gurugram, India'
    };

    // Command registry
    const commands = {
        help: () => {
            return `<div class="term-table">
<span class="term-key">help</span><span class="term-val">Show available commands</span>
<span class="term-key">about</span><span class="term-val">Learn about Kavya</span>
<span class="term-key">skills</span><span class="term-val">View tech stack</span>
<span class="term-key">projects</span><span class="term-val">See featured projects</span>
<span class="term-key">experience</span><span class="term-val">Work history</span>
<span class="term-key">contact</span><span class="term-val">Get in touch</span>
<span class="term-key">resume</span><span class="term-val">Download resume</span>
<span class="term-key">neofetch</span><span class="term-val">System info</span>
<span class="term-key">ls</span><span class="term-val">List files</span>
<span class="term-key">whoami</span><span class="term-val">Current user</span>
<span class="term-key">clear</span><span class="term-val">Clear terminal</span>
</div>`;
        },

        about: () => {
            scrollToSection('about');
            return `<div class="term-heading">About Kavya</div>
<div class="term-output">${termData.about}</div>
<div class="term-output" style="margin-top:0.3rem; color: var(--text-muted); font-style: italic;">(Scrolling to section...)</div>`;
        },

        skills: () => {
            scrollToSection('skills');
            return `<div class="term-heading">Tech Stack</div>
<div class="term-output"><strong style="color:var(--accent-blue)">Languages:</strong> <span class="term-tag">Python</span><span class="term-tag">Java</span><span class="term-tag">JavaScript</span><span class="term-tag">SQL</span></div>
<div class="term-output"><strong style="color:var(--accent-blue)">Backend:</strong> <span class="term-tag">Flask</span><span class="term-tag">Spring Boot</span><span class="term-tag">Node.js</span><span class="term-tag">REST APIs</span><span class="term-tag">Microservices</span></div>
<div class="term-output"><strong style="color:var(--accent-blue)">Databases:</strong> <span class="term-tag">MySQL</span><span class="term-tag">MongoDB</span><span class="term-tag">Amazon RDS</span></div>
<div class="term-output"><strong style="color:var(--accent-blue)">Cloud/DevOps:</strong> <span class="term-tag">AWS</span><span class="term-tag">Docker</span><span class="term-tag">Nginx</span><span class="term-tag">Jenkins</span><span class="term-tag">Linux</span></div>
<div class="term-output"><strong style="color:var(--accent-blue)">Testing:</strong> <span class="term-tag">Playwright</span><span class="term-tag">Flutter</span><span class="term-tag">API Testing</span></div>
<div class="term-output" style="margin-top:0.3rem; color: var(--text-muted); font-style: italic;">(Scrolling to section...)</div>`;
        },

        projects: () => {
            scrollToSection('projects');
            return `<div class="term-heading">Featured Projects</div>
<div class="term-output"><strong style="color:var(--accent-purple)">1. SCAI - AI Voice Calling Agent</strong></div>
<div class="term-output">   Backend APIs for AI-driven voice workflows</div>
<div class="term-output">   Hindi & Mexican Spanish | ~90-95% accuracy</div>
<div class="term-output">   <span class="term-tag">Python</span><span class="term-tag">Flask</span><span class="term-tag">AWS</span><span class="term-tag">Docker</span></div>
<div class="term-output" style="margin-top:0.3rem"><strong style="color:var(--accent-purple)">2. SalesLens - Analytics Dashboard</strong></div>
<div class="term-output">   Real-time analytics with RBAC</div>
<div class="term-output">   Optimized SQL for complex queries</div>
<div class="term-output">   <span class="term-tag">Python</span><span class="term-tag">MySQL</span><span class="term-tag">AWS</span><span class="term-tag">React</span></div>
<div class="term-output" style="margin-top:0.3rem; color: var(--text-muted); font-style: italic;">(Scrolling to section...)</div>`;
        },

        experience: () => {
            scrollToSection('experience');
            return `<div class="term-heading">Work Experience</div>
<div class="term-output"><strong style="color:var(--accent-blue)">Software Development Engineer in Test</strong></div>
<div class="term-output">Salescode.ai | Gurugram | April 2025 - Present</div>
<div class="term-output" style="margin-top:0.2rem">- Built Python microservices with sub-2s latency</div>
<div class="term-output">- Owned end-to-end AI workflows (STT, TTS, conversational AI)</div>
<div class="term-output">- Designed scalable RESTful APIs + SQL optimizations</div>
<div class="term-output">- Deployed on AWS (EC2, S3) with Docker & Nginx</div>
<div class="term-output">- Built Playwright & Flutter automation frameworks</div>
<div class="term-output" style="margin-top:0.3rem; color: var(--text-muted); font-style: italic;">(Scrolling to section...)</div>`;
        },

        contact: () => {
            scrollToSection('contact');
            return `<div class="term-heading">Contact</div>
<div class="term-table">
<span class="term-key">Phone</span><span class="term-val">${termData.phone}</span>
<span class="term-key">Email</span><span class="term-val">${termData.email}</span>
<span class="term-key">Location</span><span class="term-val">${termData.location}</span>
</div>
<div class="term-output" style="margin-top:0.3rem; color: var(--text-muted); font-style: italic;">(Scrolling to section...)</div>`;
        },

        resume: () => {
            const a = document.createElement('a');
            a.href = 'KAVYA_MITTAL.pdf';
            a.download = 'Kavya_Mittal_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            return '<div class="term-success">Downloading resume...</div>';
        },

        clear: () => {
            terminalOutput.innerHTML = '';
            return null;
        },

        ls: () => {
            return '<div class="term-output">about.txt  skills.json  projects/  experience.log  contact.md  resume.pdf</div>';
        },

        whoami: () => '<div class="term-output">visitor@kavya-os</div>',

        pwd: () => '<div class="term-output">/home/kavya/portfolio</div>',

        date: () => '<div class="term-output">' + new Date().toLocaleString() + '</div>',

        uname: () => '<div class="term-output">KavyaOS 2.0 - Built with vanilla HTML/CSS/JS</div>',

        neofetch: () => {
            return `<div style="display:flex; gap:1.5rem; align-items:flex-start;">
<div class="term-ascii" style="color:var(--accent-purple)">
 _  __ __  __
| |/ /|  \\/  |
| ' / | |\\/| |
| . \\ | |  | |
|_|\\_\\|_|  |_|
</div>
<div class="term-table" style="font-size:0.75rem">
<span class="term-key">OS</span><span class="term-val">KavyaOS v2.0</span>
<span class="term-key">Host</span><span class="term-val">kavya@portfolio</span>
<span class="term-key">Shell</span><span class="term-val">bash 5.1</span>
<span class="term-key">Languages</span><span class="term-val">Python, Java, JS, SQL</span>
<span class="term-key">Frameworks</span><span class="term-val">Flask, Spring Boot, Node</span>
<span class="term-key">Cloud</span><span class="term-val">AWS (EC2, S3, RDS)</span>
<span class="term-key">DevOps</span><span class="term-val">Docker, Nginx, Jenkins</span>
<span class="term-key">Uptime</span><span class="term-val">11 months</span>
<span class="term-key">CGPA</span><span class="term-val">9.06</span>
</div></div>`;
        },

        'sudo hire kavya': () => {
            const terminal = document.querySelector('.interactive-terminal');
            terminal.classList.add('terminal-flash');
            setTimeout(() => terminal.classList.remove('terminal-flash'), 300);
            registerEgg('terminal');
            return `<div class="term-success" style="font-size:0.9rem; margin:0.3rem 0">
===== ACCESS GRANTED =====</div>
<div class="term-output">Initiating hiring protocol...</div>
<div class="term-success">[====================] 100%</div>
<div class="term-output" style="margin-top:0.3rem"><strong style="color:#ffd700">Congratulations!</strong> You've made an excellent choice.</div>
<div class="term-output">Contact: <strong style="color:var(--accent-blue)">${termData.email}</strong></div>`;
        },

        matrix: () => {
            triggerMatrixRain();
            registerEgg('matrix');
            return '<div class="term-success">Entering the Matrix...</div>';
        },

        cat: (args) => {
            if (!args || args.length === 0) return '<div class="term-error">cat: missing file operand</div>';
            const fileMap = {
                'about.txt': commands.about,
                'contact.md': commands.contact,
                'skills.json': commands.skills,
                'experience.log': commands.experience,
                'resume.pdf': commands.resume,
            };
            const handler = fileMap[args[0]];
            if (handler) return handler();
            return `<div class="term-error">cat: ${args[0]}: No such file or directory</div>`;
        },
    };

    function scrollToSection(id) {
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }

    function addTerminalOutput(html) {
        if (!html) return;
        const div = document.createElement('div');
        div.className = 'term-line';
        div.innerHTML = html;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function processCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return;

        // Echo the command
        const cmdEcho = document.createElement('div');
        cmdEcho.className = 'term-line term-cmd';
        cmdEcho.innerHTML = `<span class="prompt-echo">visitor@kavya-os:~$</span> ${trimmed}`;
        terminalOutput.appendChild(cmdEcho);

        // Check for full match first (e.g., "sudo hire kavya")
        if (commands[trimmed.toLowerCase()]) {
            const result = commands[trimmed.toLowerCase()]();
            addTerminalOutput(result);
        } else {
            // Parse command and args
            const parts = trimmed.split(/\s+/);
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);

            if (commands[cmd]) {
                const result = commands[cmd](args);
                addTerminalOutput(result);
            } else {
                addTerminalOutput(`<div class="term-error">Command not found: ${cmd}. Type 'help' for available commands.</div>`);
            }
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Terminal input handling
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInput.value;
                if (val.trim()) {
                    commandHistory.push(val);
                    historyIndex = commandHistory.length;
                }
                processCommand(val);
                terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                const partial = terminalInput.value.toLowerCase();
                if (partial) {
                    const match = Object.keys(commands).find(c => c.startsWith(partial) && c !== partial);
                    if (match) terminalInput.value = match;
                }
            }
        });

        // Click terminal body to focus input
        document.querySelector('.terminal-body').addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // Welcome message after boot
    bootPromise.then(() => {
        setTimeout(() => {
            addTerminalOutput(`<div class="term-special">Welcome to KavyaOS v2.0</div>`);
            addTerminalOutput(`<div class="term-output" style="color:var(--text-muted)">Type <strong style="color:var(--accent-blue)">help</strong> to see available commands.</div>`);
        }, 800);
    });

    /* ==========================================================================
       5. Scroll Reveal + Text Scramble
       ========================================================================== */
    class TextScramble {
        constructor(element) {
            this.element = element;
            this.originalHTML = element.innerHTML;
            this.originalText = element.textContent;
            this.chars = '!<>-_\\/[]{}#@$%^&*()+=01';
        }

        scramble() {
            const target = this.originalText;
            const length = target.length;
            let iteration = 0;

            const interval = setInterval(() => {
                this.element.textContent = target
                    .split('')
                    .map((char, index) => {
                        if (char === ' ') return ' ';
                        if (index < iteration) return target[index];
                        return this.chars[Math.floor(Math.random() * this.chars.length)];
                    })
                    .join('');

                if (iteration >= length) {
                    clearInterval(interval);
                    this.element.innerHTML = this.originalHTML;
                }
                iteration += 0.5;
            }, 30);
        }
    }

    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Text scramble for section titles
                if (entry.target.classList.contains('section-title')) {
                    const scrambler = new TextScramble(entry.target);
                    scrambler.scramble();
                }

                observer.unobserve(entry.target);
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
    const particleCount = 70;
    let mouse = { x: undefined, y: undefined, radius: 150 };

    function initCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        particles = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: Math.random() > 0.5 ? 'rgba(0, 240, 255, 0.15)' : 'rgba(157, 0, 255, 0.15)'
            });
        }
    }

    let particlesPaused = false;

    function animateParticles() {
        if (particlesPaused) {
            requestAnimationFrame(animateParticles);
            return;
        }

        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (mouse.x != undefined && mouse.y != undefined) {
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    p.x -= forceDirectionX * force * 2;
                    p.y -= forceDirectionY * force * 2;
                }
            }

            if (p.x < 0 || p.x > w) p.vx = -p.vx;
            if (p.y < 0 || p.y > h) p.vy = -p.vy;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
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

    /* ==========================================================================
       7. Form Submission
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

            window.location.href = `mailto:kavyamittal1282@gmail.com?subject=${subject}&body=${body}`;

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Opening Mail Client... <i class="fas fa-check"></i>';
            btn.style.background = '#27c93f';

            contactForm.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        });
    }

    /* ==========================================================================
       8. Interactive AI Assistant (Guided Tour)
       ========================================================================== */
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    const assistant = document.getElementById('ai-assistant');
    const speech = document.getElementById('ai-speech');
    const tourControls = document.getElementById('tour-controls');
    const btnBack = document.getElementById('tour-back');
    const btnNext = document.getElementById('tour-next');
    const btnSkip = document.getElementById('tour-skip');
    const progressText = document.getElementById('tour-progress');

    let tourActive = false;
    let currentStep = 0;
    let autoProgressTimer = null;

    const tourSteps = [
        { target: '#home .hero-text', text: "Welcome! I am Kavya's AI Assistant. Let's start the tour!", position: 'center' },
        { target: '#about .about-text', text: "Kavya is a Backend & AI Engineer building highly scalable systems.", position: 'center' },
        { target: '#experience .timeline-item', text: "She powers AI voice pipelines at Salescode.ai with sub-2s latency!", position: 'center' },
        { target: '#skills .skills-grid', text: "Her tech stack includes Python, AWS, Docker, and React.", position: 'center' },
        { target: '#projects .projects-grid', text: "Here are her top AI products: SCAI and SalesLens.", position: 'center' },
        { target: '#contact .contact-grid', text: "Want to hire her? Download her resume here!", position: 'center' }
    ];

    assistant.addEventListener('click', (e) => {
        if (e.target.closest('#tour-controls')) return;
        if (!tourActive) startTour();
    });

    function startTour() {
        tourActive = true;
        currentStep = 0;
        document.body.classList.add('tour-active');
        tourControls.classList.add('active');
        runTourStep();
    }

    function runTourStep() {
        clearTimeout(autoProgressTimer);
        const step = tourSteps[currentStep];

        speech.innerHTML = step.text;
        progressText.innerHTML = `${currentStep + 1}/${tourSteps.length}`;

        btnBack.disabled = currentStep === 0;
        btnNext.innerHTML = currentStep === tourSteps.length - 1
            ? '<i class="fas fa-check"></i>'
            : '<i class="fas fa-chevron-right"></i>';

        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

        const targetElement = document.querySelector(step.target);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: step.position });
            targetElement.classList.add('tour-highlight');
        }

        autoProgressTimer = setTimeout(() => {
            if (tourActive && currentStep < tourSteps.length - 1) {
                currentStep++;
                runTourStep();
            } else if (tourActive) {
                endTour();
            }
        }, 5000);
    }

    function endTour() {
        clearTimeout(autoProgressTimer);
        tourActive = false;
        document.body.classList.remove('tour-active');
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

        speech.innerHTML = "Tour complete! Feel free to explore.";
        tourControls.classList.remove('active');

        setTimeout(() => {
            if (!tourActive) speech.style.opacity = '0';
        }, 3000);
    }

    btnNext.addEventListener('click', () => {
        if (currentStep < tourSteps.length - 1) { currentStep++; runTourStep(); }
        else endTour();
    });
    btnBack.addEventListener('click', () => {
        if (currentStep > 0) { currentStep--; runTourStep(); }
    });
    btnSkip.addEventListener('click', endTour);

    setTimeout(() => {
        if (!tourActive) speech.style.opacity = '0';
    }, 5000);

    assistant.addEventListener('mouseenter', () => {
        if (!tourActive && !tourControls.classList.contains('active')) {
            speech.innerHTML = "Click me for a guided tour!";
            speech.style.opacity = '1';
        }
    });
    assistant.addEventListener('mouseleave', () => {
        if (!tourActive && !tourControls.classList.contains('active')) {
            speech.style.opacity = '0';
        }
    });

    /* ==========================================================================
       9. Ripple Effect for Buttons and Tags
       ========================================================================== */
    const rippleElements = document.querySelectorAll('.btn, .tag');
    rippleElements.forEach(element => {
        element.addEventListener('click', function (e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple');
            this.appendChild(ripples);

            setTimeout(() => ripples.remove(), 600);
        });
    });

    /* ==========================================================================
       10. 3D Tilt Effect on Cards
       ========================================================================== */
    const cards = document.querySelectorAll('.glass-card:not(.interactive-terminal)');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = ((y - centerY) / centerY) * -5;
            const tiltY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    /* ==========================================================================
       11. Custom Cursor & Glow Trail
       ========================================================================== */
    const customCursor = document.getElementById('custom-cursor');
    const isFineMouse = window.matchMedia('(pointer: fine)').matches;

    if (isFineMouse && customCursor) {
        document.body.classList.add('custom-cursor');
        customCursor.classList.add('visible');

        let cursorX = 0, cursorY = 0;
        let trailDots = [];
        const TRAIL_COUNT = 12;

        // Create trail dots
        for (let i = 0; i < TRAIL_COUNT; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail-dot';
            document.body.appendChild(dot);
            trailDots.push({ el: dot, x: 0, y: 0 });
        }

        let trailIndex = 0;
        let lastTrailTime = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            customCursor.style.left = cursorX + 'px';
            customCursor.style.top = cursorY + 'px';

            // Update trail
            const now = Date.now();
            if (now - lastTrailTime > 30) {
                const dot = trailDots[trailIndex % TRAIL_COUNT];
                dot.el.style.left = cursorX + 'px';
                dot.el.style.top = cursorY + 'px';
                dot.el.style.opacity = '0.6';
                setTimeout(() => { dot.el.style.opacity = '0'; }, 50);
                trailIndex++;
                lastTrailTime = now;
            }
        });

        // Hover expansion for interactive elements
        const interactiveSelector = 'a, button, .btn, .tag, .glass-icon, .nav-links a, .logo';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) {
                customCursor.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) {
                customCursor.classList.remove('hovering');
            }
        });

        // Magnetic pull on buttons
        document.querySelectorAll('.btn, .tag').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) * 0.15;
                const dy = (e.clientY - cy) * 0.15;
                el.style.transform = `translate(${dx}px, ${dy}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    /* ==========================================================================
       12. Scroll Progress Pipeline
       ========================================================================== */
    const pipeline = document.getElementById('scroll-pipeline');
    const pipelineStages = document.querySelectorAll('.pipeline-stage');
    const pipelineConnectors = document.querySelectorAll('.pipeline-connector');
    const sectionOrder = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];

    function updatePipeline() {
        let currentSectionId = 'home';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 300) {
                currentSectionId = section.getAttribute('id');
            }
        });

        const currentIndex = sectionOrder.indexOf(currentSectionId);

        pipelineStages.forEach((stage, i) => {
            stage.classList.remove('active', 'completed');
            if (i < currentIndex) {
                stage.classList.add('completed');
            } else if (i === currentIndex) {
                stage.classList.add('active');
            }
        });

        pipelineConnectors.forEach((conn, i) => {
            if (i < currentIndex) {
                conn.classList.add('filled');
            } else {
                conn.classList.remove('filled');
            }
        });
    }

    window.addEventListener('scroll', updatePipeline);
    updatePipeline();

    // Pipeline click navigation
    pipelineStages.forEach(stage => {
        stage.addEventListener('click', () => {
            const sectionId = stage.getAttribute('data-section');
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        });
    });

    /* ==========================================================================
       13. Counter Animations
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    function animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const suffix = element.getAttribute('data-suffix') || '';
        const isDecimal = String(target).includes('.');
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            let current = target * eased;

            if (isDecimal) {
                element.textContent = current.toFixed(2) + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = (isDecimal ? target.toFixed(2) : target) + suffix;
            }
        }

        requestAnimationFrame(update);
    }

    /* ==========================================================================
       14. Skill Tag Particle Burst
       ========================================================================== */
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'tag-particle';
                const angle = (i / 8) * Math.PI * 2;
                const dist = 20 + Math.random() * 15;
                particle.style.setProperty('--px', `${Math.cos(angle) * dist}px`);
                particle.style.setProperty('--py', `${Math.sin(angle) * dist}px`);
                particle.style.left = '50%';
                particle.style.top = '50%';
                tag.appendChild(particle);

                requestAnimationFrame(() => particle.classList.add('burst'));
                setTimeout(() => particle.remove(), 600);
            }
        });
    });

    /* ==========================================================================
       15. Timeline Marker Pulse
       ========================================================================== */
    const timelineMarkers = document.querySelectorAll('.timeline-marker');
    const markerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('pulse');
            } else {
                entry.target.classList.remove('pulse');
            }
        });
    }, { threshold: 0.5 });

    timelineMarkers.forEach(m => markerObserver.observe(m));

    /* ==========================================================================
       16. Easter Eggs
       ========================================================================== */

    // --- Easter Egg Tracker ---
    function registerEgg(name) {
        eggsFound.add(name);
        const el = document.getElementById('eggs-found');
        if (el) el.textContent = `${eggsFound.size}/3`;
    }

    // --- 16a. Konami Code ---
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.keyCode === konamiSequence[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiSequence.length) {
                showEasterEggToast();
                registerEgg('konami');
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function showEasterEggToast() {
        const toast = document.getElementById('easter-egg-toast');
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 4000);
    }

    // --- 16b. Matrix Rain ---
    function triggerMatrixRain() {
        const matrixCanvas = document.createElement('canvas');
        matrixCanvas.id = 'matrix-canvas';
        document.body.appendChild(matrixCanvas);

        const mCtx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = Math.floor(matrixCanvas.width / fontSize);
        const drops = Array(columns).fill(1);

        particlesPaused = true;

        function drawMatrix() {
            mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            mCtx.fillStyle = '#00f0ff';
            mCtx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                mCtx.fillStyle = Math.random() > 0.5 ? '#00f0ff' : '#9d00ff';
                mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const matrixInterval = setInterval(drawMatrix, 33);

        function stopMatrix() {
            clearInterval(matrixInterval);
            matrixCanvas.style.opacity = '0';
            setTimeout(() => {
                matrixCanvas.remove();
                particlesPaused = false;
            }, 1000);
            document.removeEventListener('keydown', stopOnKey);
            matrixCanvas.removeEventListener('click', stopMatrix);
        }

        function stopOnKey() { stopMatrix(); }

        // Auto-stop after 5 seconds
        setTimeout(stopMatrix, 5000);
        document.addEventListener('keydown', stopOnKey);
        matrixCanvas.addEventListener('click', stopMatrix);
    }

    // --- 16c. Triple-Click Logo Debug Mode ---
    let logoClicks = 0;
    let logoTimer = null;
    const logo = document.querySelector('.logo');
    const debugPanel = document.getElementById('debug-panel');
    const debugClose = document.getElementById('debug-close');

    if (logo && debugPanel) {
        logo.addEventListener('click', (e) => {
            logoClicks++;
            clearTimeout(logoTimer);

            if (logoClicks >= 3) {
                e.preventDefault();
                debugPanel.classList.toggle('visible');
                registerEgg('debug');
                logoClicks = 0;
            }

            logoTimer = setTimeout(() => { logoClicks = 0; }, 500);
        });

        debugClose.addEventListener('click', () => {
            debugPanel.classList.remove('visible');
        });
    }

});
