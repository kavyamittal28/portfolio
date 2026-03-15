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
            { text: 'KAVYA_OS v1.0', type: 'header', delay: 100 },
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
<span class="term-key">OS</span><span class="term-val">KavyaOS v1.0</span>
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
            addTerminalOutput(`<div class="term-special">Welcome to KavyaOS v1.0</div>`);
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
    const sectionOrder = ['home', 'about', 'experience', 'certifications', 'skills', 'architecture', 'projects', 'blog', 'contact'];

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
        if (el) el.textContent = `${eggsFound.size}/4`;
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

    /* ==========================================================================
       17. Dark/Light Theme Toggle
       ========================================================================== */
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
            if (isDark) {
                document.body.classList.add('light-theme');
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('kavya-theme', 'light');
            } else {
                document.body.classList.add('dark-theme');
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('kavya-theme', 'dark');
            }
            // Update particle colors
            if (particles) {
                const isLight = document.body.classList.contains('light-theme');
                particles.forEach(p => {
                    p.color = Math.random() > 0.5
                        ? (isLight ? 'rgba(0, 144, 170, 0.15)' : 'rgba(0, 240, 255, 0.15)')
                        : (isLight ? 'rgba(123, 0, 204, 0.15)' : 'rgba(157, 0, 255, 0.15)');
                });
            }
        });
    }

    /* ==========================================================================
       18. Certification Stamp Animation
       ========================================================================== */
    const certCards = document.querySelectorAll('.cert-card[data-stamp]');
    const certObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = document.querySelectorAll('.cert-card[data-stamp]');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('stamped'), i * 200);
                });
                certObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });
    certCards.forEach(c => certObserver.observe(c));

    /* ==========================================================================
       19. Architecture Diagram Tooltips
       ========================================================================== */
    const archTooltip = document.getElementById('arch-tooltip');
    const archNodes = document.querySelectorAll('.arch-node[data-tooltip]');

    archNodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            if (!archTooltip) return;
            archTooltip.textContent = node.getAttribute('data-tooltip');
            const rect = node.getBoundingClientRect();
            const containerRect = node.closest('.sys-arch-diagram').getBoundingClientRect();
            archTooltip.style.left = (rect.left - containerRect.left + rect.width / 2) + 'px';
            archTooltip.style.top = (rect.top - containerRect.top - 10) + 'px';
            archTooltip.style.transform = 'translate(-50%, -100%)';
            archTooltip.classList.add('visible');
        });
        node.addEventListener('mouseleave', () => {
            if (archTooltip) archTooltip.classList.remove('visible');
        });
    });

    /* ==========================================================================
       20. Page Transition Effect
       ========================================================================== */
    const transitionOverlay = document.getElementById('page-transition-overlay');

    // Intercept internal page links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
            href.startsWith('http') || link.hasAttribute('download') ||
            href === '#') return;

        // Only intercept .html links
        if (!href.endsWith('.html')) return;

        e.preventDefault();
        if (transitionOverlay) {
            transitionOverlay.classList.add('active');
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        } else {
            window.location.href = href;
        }
    });

    // Fade out overlay on page load
    window.addEventListener('load', () => {
        if (transitionOverlay && transitionOverlay.classList.contains('active')) {
            setTimeout(() => transitionOverlay.classList.remove('active'), 200);
        }
    });

    /* ==========================================================================
       21. Hero Parallax Depth Layers
       ========================================================================== */
    const heroSection = document.getElementById('home');
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const bgCanvas = document.getElementById('bg-canvas');

    if (heroSection && parallaxLayers.length && window.matchMedia('(pointer: fine)').matches) {
        let parallaxRAF = null;
        let mouseX = 0, mouseY = 0;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            // Normalized -1 to 1 from center of hero
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

            if (!parallaxRAF) {
                parallaxRAF = requestAnimationFrame(() => {
                    parallaxLayers.forEach(layer => {
                        const depth = parseFloat(layer.dataset.depth) || 0;
                        const moveX = mouseX * depth * 20;
                        const moveY = mouseY * depth * 15;
                        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    });
                    // Particles layer moves slowest
                    if (bgCanvas) {
                        const moveX = mouseX * 0.1 * 20;
                        const moveY = mouseY * 0.1 * 15;
                        bgCanvas.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    }
                    parallaxRAF = null;
                });
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            parallaxLayers.forEach(layer => {
                layer.style.transform = 'translate(0px, 0px)';
            });
            if (bgCanvas) bgCanvas.style.transform = 'translate(0px, 0px)';
        });

        // Scroll-based vertical parallax
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            if (scrollY < heroHeight) {
                parallaxLayers.forEach(layer => {
                    const depth = parseFloat(layer.dataset.depth) || 0;
                    const offsetY = scrollY * depth * 0.3;
                    layer.style.transform = `translateY(${offsetY}px)`;
                });
                if (bgCanvas) {
                    bgCanvas.style.transform = `translateY(${scrollY * 0.1 * 0.3}px)`;
                }
            }
        });
    }

    /* ==========================================================================
       22. Keyboard Shortcuts System + Cheat Sheet
       ========================================================================== */
    const shortcutsModal = document.getElementById('shortcuts-modal');
    const shortcutsClose = document.getElementById('shortcuts-close');

    function toggleShortcuts(show) {
        if (!shortcutsModal) return;
        if (show === undefined) show = !shortcutsModal.classList.contains('visible');
        shortcutsModal.classList.toggle('visible', show);
    }

    if (shortcutsClose) {
        shortcutsClose.addEventListener('click', () => toggleShortcuts(false));
    }
    if (shortcutsModal) {
        shortcutsModal.addEventListener('click', (e) => {
            if (e.target === shortcutsModal) toggleShortcuts(false);
        });
    }

    // Vim-style double-key navigation
    const sectionMap = {
        'h': 'home', 'a': 'about', 'e': 'experience',
        's': 'skills', 'p': 'projects', 'b': 'blog', 'c': 'contact'
    };

    let pendingKey = null;
    let pendingTimer = null;

    document.addEventListener('keydown', (e) => {
        // Ignore when typing in inputs
        const tag = document.activeElement.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select') {
            // Only allow Escape in inputs
            if (e.key === 'Escape') {
                document.activeElement.blur();
                toggleShortcuts(false);
            }
            return;
        }

        // Escape closes any overlay
        if (e.key === 'Escape') {
            toggleShortcuts(false);
            return;
        }

        // ? opens cheat sheet
        if (e.key === '?') {
            e.preventDefault();
            toggleShortcuts();
            return;
        }

        // t toggles theme
        if (e.key === 't' && !e.ctrlKey && !e.metaKey) {
            const themeToggle = document.getElementById('theme-toggle');
            if (themeToggle) themeToggle.click();
            return;
        }

        // / focuses terminal
        if (e.key === '/') {
            e.preventDefault();
            const termInput = document.getElementById('terminal-input');
            if (termInput) {
                termInput.focus();
                termInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Vim-style g + key navigation
        if (e.key === 'g' && !pendingKey) {
            pendingKey = 'g';
            clearTimeout(pendingTimer);
            pendingTimer = setTimeout(() => { pendingKey = null; }, 500);
            return;
        }

        if (pendingKey === 'g' && sectionMap[e.key]) {
            pendingKey = null;
            clearTimeout(pendingTimer);
            const target = document.getElementById(sectionMap[e.key]);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Reset pending if unrecognized
        pendingKey = null;
    });

    /* ==========================================================================
       23. Ambient Sound Engine (Web Audio API)
       ========================================================================== */
    const SoundEngine = (() => {
        let ctx = null;
        let enabled = false;
        let initialized = false;
        const soundToggle = document.getElementById('sound-toggle');
        const soundIcon = document.getElementById('sound-icon');

        function init() {
            if (initialized) return;
            try {
                ctx = new (window.AudioContext || window.webkitAudioContext)();
                initialized = true;
            } catch (e) { return; }
        }

        function playTone(freq, duration, vol, type) {
            if (!enabled || !ctx) return;
            if (ctx.state === 'suspended') ctx.resume();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(vol || 0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 0.08));
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + (duration || 0.08));
        }

        function hover() { playTone(1200, 0.04, 0.03, 'sine'); }
        function click() { playTone(800, 0.06, 0.06, 'square'); }
        function keypress() { playTone(900 + Math.random() * 300, 0.025, 0.04, 'square'); }
        function enter() { playTone(400, 0.1, 0.08, 'triangle'); }
        function success() {
            playTone(523, 0.1, 0.07, 'sine');
            setTimeout(() => playTone(659, 0.1, 0.07, 'sine'), 100);
            setTimeout(() => playTone(784, 0.15, 0.07, 'sine'), 200);
        }
        function boot(index) {
            playTone(200 + index * 80, 0.05, 0.04, 'square');
        }
        function error() { playTone(200, 0.15, 0.06, 'sawtooth'); }

        function toggle() {
            init();
            enabled = !enabled;
            localStorage.setItem('kavya-sound', enabled ? 'on' : 'off');
            if (soundIcon) {
                soundIcon.className = enabled ? 'fas fa-volume-high' : 'fas fa-volume-xmark';
            }
            if (soundToggle) soundToggle.classList.toggle('active', enabled);
            if (enabled) success();
        }

        // Restore preference
        const pref = localStorage.getItem('kavya-sound');
        if (pref === 'on') {
            init();
            enabled = true;
            if (soundIcon) soundIcon.className = 'fas fa-volume-high';
            if (soundToggle) soundToggle.classList.add('active');
        }

        if (soundToggle) soundToggle.addEventListener('click', toggle);

        // Attach hover sounds to interactive elements
        document.querySelectorAll('a, button, .btn, .tag, .glass-icon, .nav-links a').forEach(el => {
            el.addEventListener('mouseenter', hover);
        });

        // Terminal keypress sounds
        const terminalInput = document.getElementById('terminal-input');
        if (terminalInput) {
            terminalInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') enter();
                else if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'Meta')
                    keypress();
            });
        }

        return { hover, click, keypress, enter, success, boot, error, toggle,
            get enabled() { return enabled; }
        };
    })();

    // Expose for use in terminal commands
    window.SoundEngine = SoundEngine;

    /* ==========================================================================
       24. Visitor Hacker Profile Progression System
       ========================================================================== */
    const VisitorProfile = (() => {
        const STORAGE_KEY = 'kavya-visitor-profile';
        const defaults = {
            sectionsVisited: [], commandsUsed: [], eggsFound: [],
            totalVisits: 0, resumeDownloaded: false,
            blogRead: false, projectsViewed: [], themeToggled: false
        };

        function load() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
            } catch { return { ...defaults }; }
        }

        function save(data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }

        const data = load();
        data.totalVisits++;
        save(data);

        function track(category, value) {
            if (Array.isArray(data[category])) {
                if (!data[category].includes(value)) {
                    data[category].push(value);
                    save(data);
                }
            } else {
                data[category] = value;
                save(data);
            }
        }

        function getScore() {
            return data.sectionsVisited.length +
                   data.commandsUsed.length * 2 +
                   data.eggsFound.length * 5 +
                   data.projectsViewed.length * 2 +
                   (data.resumeDownloaded ? 3 : 0) +
                   (data.blogRead ? 2 : 0) +
                   (data.themeToggled ? 1 : 0) +
                   Math.min(data.totalVisits, 5);
        }

        function getRank() {
            const score = getScore();
            if (score >= 51) return { title: 'System Architect', color: '#ffd700' };
            if (score >= 36) return { title: 'Senior Engineer', color: '#00f0ff' };
            if (score >= 21) return { title: 'Junior Dev', color: '#9d00ff' };
            if (score >= 11) return { title: 'Script Kiddie', color: '#00ff88' };
            return { title: 'Guest', color: '#a0a0b0' };
        }

        function getAsciiCard() {
            const rank = getRank();
            const score = getScore();
            const maxScore = 55;
            const barLen = 20;
            const filled = Math.round((score / maxScore) * barLen);
            const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(barLen - filled);
            const achievements = [
                data.sectionsVisited.length >= 7 ? '\u2713' : '\u2717', 'All Sections',
                data.commandsUsed.length >= 5 ? '\u2713' : '\u2717', '5+ Commands',
                data.eggsFound.length >= 4 ? '\u2713' : '\u2717', 'All Easter Eggs',
                data.resumeDownloaded ? '\u2713' : '\u2717', 'Resume Downloaded',
                data.projectsViewed.length >= 2 ? '\u2713' : '\u2717', 'All Projects Viewed',
                data.totalVisits >= 3 ? '\u2713' : '\u2717', 'Return Visitor'
            ];
            let achieveStr = '';
            for (let i = 0; i < achievements.length; i += 2) {
                const icon = achievements[i] === '\u2713'
                    ? `<span style="color:#00ff88">${achievements[i]}</span>`
                    : `<span style="color:#ff4444">${achievements[i]}</span>`;
                achieveStr += `  ${icon} ${achievements[i+1]}\n`;
            }
            const completedCount = achievements.filter((v, i) => i % 2 === 0 && v === '\u2713').length;
            return `<div style="color:${rank.color}; font-weight:600;">
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  VISITOR PROFILE CARD        \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518</div>
<div class="term-table" style="font-size:0.8rem;">
<span class="term-key">Rank</span><span class="term-val" style="color:${rank.color};font-weight:600">${rank.title}</span>
<span class="term-key">Score</span><span class="term-val">${score}/${maxScore}</span>
<span class="term-key">Progress</span><span class="term-val" style="color:${rank.color}">${bar}</span>
<span class="term-key">Visits</span><span class="term-val">${data.totalVisits}</span>
<span class="term-key">Sections</span><span class="term-val">${data.sectionsVisited.length}/7</span>
<span class="term-key">Commands</span><span class="term-val">${data.commandsUsed.length}</span>
<span class="term-key">Eggs</span><span class="term-val">${data.eggsFound.length}/4</span>
</div>
<div class="term-heading" style="margin-top:0.5rem">Achievements (${completedCount}/6)</div>
<pre style="font-size:0.75rem; line-height:1.6; margin:0;">${achieveStr}</pre>`;
        }

        // Track sections via scroll
        let lastTrackedSection = '';
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.section[id]');
            sections.forEach(section => {
                if (scrollY >= section.offsetTop - 400) {
                    const id = section.getAttribute('id');
                    if (id && id !== lastTrackedSection) {
                        lastTrackedSection = id;
                        track('sectionsVisited', id);
                    }
                }
            });
        });

        // Track theme toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => track('themeToggled', true));
        }

        return { track, getScore, getRank, getAsciiCard, data };
    })();

    window.VisitorProfile = VisitorProfile;

    // Add 'profile' command to terminal
    commands.profile = () => {
        return VisitorProfile.getAsciiCard();
    };

    // Add profile info to help output
    const origHelp = commands.help;
    commands.help = () => {
        return origHelp() + `<span class="term-key">profile</span><span class="term-val">View your hacker profile</span>`;
    };

    // Track command usage by wrapping terminal input handler
    const termInput2 = document.getElementById('terminal-input');
    if (termInput2) {
        termInput2.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = termInput2.value.trim().split(' ')[0].toLowerCase();
                if (cmd) VisitorProfile.track('commandsUsed', cmd);
            }
        }, true);
    }

    // Track resume download
    const origResume = commands.resume;
    commands.resume = () => {
        VisitorProfile.track('resumeDownloaded', true);
        return origResume();
    };

    // Track easter eggs by wrapping eggsFound.add
    const origEggAdd = eggsFound.add.bind(eggsFound);
    eggsFound.add = function(name) {
        VisitorProfile.track('eggsFound', name);
        return origEggAdd(name);
    };

    /* ==========================================================================
       25. Dynamic Geolocation Greeting
       ========================================================================== */
    const GeoGreeting = (() => {
        const CACHE_KEY = 'kavya-visitor-geo';
        const KAVYA_LAT = 28.4595, KAVYA_LON = 77.0266; // Gurugram

        function haversine(lat1, lon1, lat2, lon2) {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon / 2) ** 2;
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        }

        let geoData = null;

        // Try cached first
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) geoData = JSON.parse(cached);
        } catch {}

        function fetchGeo() {
            if (geoData) return Promise.resolve(geoData);
            return fetch('https://ipapi.co/json/')
                .then(r => r.json())
                .then(data => {
                    geoData = { city: data.city, country: data.country_name, lat: data.latitude, lon: data.longitude };
                    sessionStorage.setItem(CACHE_KEY, JSON.stringify(geoData));
                    updateGreeting();
                    return geoData;
                })
                .catch(() => null);
        }

        function updateGreeting() {
            if (!geoData || !geoData.city) return;
            // Update tour's first step if not already started
            if (tourSteps && tourSteps[0]) {
                tourSteps[0].text = `Welcome, visitor from ${geoData.city}! I'm Kavya's AI. Let's explore!`;
            }
            // Update the AI speech if tour hasn't started
            if (speech && !tourActive) {
                speech.innerHTML = `Hi! I'm Kavya's AI. Click me for a tour!`;
            }
        }

        // Fetch on load
        fetchGeo();

        // Ping command for terminal
        commands.ping = () => {
            if (!geoData || !geoData.lat) {
                return `<div class="term-output">PING kavya.dev (${KAVYA_LAT.toFixed(2)}N, ${KAVYA_LON.toFixed(2)}E)</div>
<div class="term-output" style="color:var(--text-muted)">Location unavailable. Try again later.</div>`;
            }
            const dist = haversine(geoData.lat, geoData.lon, KAVYA_LAT, KAVYA_LON);
            const fakePing = Math.max(1, Math.round(dist * 0.015 + Math.random() * 5));
            return `<div class="term-heading">PING kavya.dev</div>
<div class="term-output">From: ${geoData.city}, ${geoData.country} (${geoData.lat.toFixed(2)}, ${geoData.lon.toFixed(2)})</div>
<div class="term-output">To: Gurugram, India (${KAVYA_LAT.toFixed(2)}, ${KAVYA_LON.toFixed(2)})</div>
<div class="term-output" style="margin-top:0.3rem">Distance: <strong style="color:var(--accent-blue)">${Math.round(dist).toLocaleString()} km</strong></div>
<div class="term-output">64 bytes: icmp_seq=1 ttl=64 time=<strong style="color:var(--accent-purple)">${fakePing}ms</strong></div>
<div class="term-output">64 bytes: icmp_seq=2 ttl=64 time=<strong style="color:var(--accent-purple)">${fakePing + Math.round(Math.random() * 3)}ms</strong></div>
<div class="term-output">64 bytes: icmp_seq=3 ttl=64 time=<strong style="color:var(--accent-purple)">${fakePing + Math.round(Math.random() * 3)}ms</strong></div>
<div class="term-success" style="margin-top:0.3rem">--- kavya.dev ping statistics ---</div>
<div class="term-output">3 packets transmitted, 3 received, 0% packet loss</div>`;
        };

        return { fetchGeo, haversine, getData: () => geoData, KAVYA_LAT, KAVYA_LON };
    })();

    window.GeoGreeting = GeoGreeting;

    /* ==========================================================================
       26. Command Palette (Ctrl+K / Cmd+K)
       ========================================================================== */
    const cmdPalette = document.getElementById('command-palette');
    const cmdInput = document.getElementById('cmd-palette-input');
    const cmdResults = document.getElementById('cmd-palette-results');

    if (cmdPalette && cmdInput && cmdResults) {
        const paletteItems = [
            { label: 'Go to Home', icon: 'fa-house', category: 'Navigation', action: () => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to About', icon: 'fa-user', category: 'Navigation', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Experience', icon: 'fa-briefcase', category: 'Navigation', action: () => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Skills', icon: 'fa-code', category: 'Navigation', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Projects', icon: 'fa-diagram-project', category: 'Navigation', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Blog', icon: 'fa-pen-nib', category: 'Navigation', action: () => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Go to Contact', icon: 'fa-envelope', category: 'Navigation', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Toggle Theme', icon: 'fa-circle-half-stroke', category: 'Action', action: () => document.getElementById('theme-toggle')?.click() },
            { label: 'Toggle Sound', icon: 'fa-volume-high', category: 'Action', action: () => document.getElementById('sound-toggle')?.click() },
            { label: 'Download Resume', icon: 'fa-download', category: 'Action', action: () => { commands.resume(); } },
            { label: 'Focus Terminal', icon: 'fa-terminal', category: 'Action', action: () => { const t = document.getElementById('terminal-input'); if (t) { t.focus(); t.scrollIntoView({ behavior: 'smooth', block: 'center' }); } } },
            { label: 'Start Tour', icon: 'fa-compass', category: 'Action', action: () => { if (!tourActive) startTour(); } },
            { label: 'View Hacker Profile', icon: 'fa-id-card', category: 'Terminal', action: () => { const t = document.getElementById('terminal-input'); if (t) { t.value = 'profile'; t.focus(); t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); } } },
            { label: 'Keyboard Shortcuts', icon: 'fa-keyboard', category: 'Action', action: () => toggleShortcuts(true) },
            { label: 'Python', icon: 'fa-code', category: 'Skill', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Flask', icon: 'fa-code', category: 'Skill', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'AWS', icon: 'fa-cloud', category: 'Skill', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'Docker', icon: 'fa-cube', category: 'Skill', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'React', icon: 'fa-code', category: 'Skill', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
            { label: 'SCAI Project', icon: 'fa-microphone', category: 'Project', action: () => { window.location.href = 'project-scai.html'; } },
            { label: 'SalesLens Project', icon: 'fa-chart-line', category: 'Project', action: () => { window.location.href = 'project-saleslens.html'; } },
            { label: 'Toggle Incognito Mode', icon: 'fa-mask', category: 'Action', action: () => { if (commands.incognito) commands.incognito(); } },
            { label: 'View Source Code', icon: 'fa-code', category: 'Action', action: () => { if (typeof showSource === 'function') showSource(); } },
        ];

        let selectedIndex = 0;
        let filteredItems = [...paletteItems];

        function fuzzyMatch(query, text) {
            const q = query.toLowerCase();
            const t = text.toLowerCase();
            let qi = 0;
            for (let ti = 0; ti < t.length && qi < q.length; ti++) {
                if (t[ti] === q[qi]) qi++;
            }
            return qi === q.length;
        }

        function renderResults() {
            cmdResults.innerHTML = '';
            filteredItems.forEach((item, i) => {
                const div = document.createElement('div');
                div.className = 'cmd-palette-item' + (i === selectedIndex ? ' selected' : '');
                div.innerHTML = `<div class="cmd-icon"><i class="fas ${item.icon}"></i></div>
                    <span class="cmd-label">${item.label}</span>
                    <span class="cmd-badge">${item.category}</span>`;
                div.addEventListener('click', () => executeItem(item));
                div.addEventListener('mouseenter', () => {
                    selectedIndex = i;
                    cmdResults.querySelectorAll('.cmd-palette-item').forEach((el, j) => {
                        el.classList.toggle('selected', j === i);
                    });
                });
                cmdResults.appendChild(div);
            });
        }

        function executeItem(item) {
            closePalette();
            item.action();
        }

        function openPalette() {
            cmdPalette.classList.add('visible');
            cmdInput.value = '';
            selectedIndex = 0;
            filteredItems = [...paletteItems];
            renderResults();
            setTimeout(() => cmdInput.focus(), 50);
        }

        function closePalette() {
            cmdPalette.classList.remove('visible');
            cmdInput.blur();
        }

        cmdInput.addEventListener('input', () => {
            const q = cmdInput.value.trim();
            filteredItems = q ? paletteItems.filter(item => fuzzyMatch(q, item.label + ' ' + item.category)) : [...paletteItems];
            selectedIndex = 0;
            renderResults();
        });

        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % filteredItems.length;
                renderResults();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
                renderResults();
            } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
                e.preventDefault();
                executeItem(filteredItems[selectedIndex]);
            } else if (e.key === 'Escape') {
                closePalette();
            }
        });

        cmdPalette.addEventListener('click', (e) => {
            if (e.target === cmdPalette) closePalette();
        });

        // Global Ctrl+K / Cmd+K handler
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                if (cmdPalette.classList.contains('visible')) closePalette();
                else openPalette();
            }
        });
    }

    /* ==========================================================================
       27. Animated SVG Skill Radar Chart
       ========================================================================== */
    const radarSvg = document.getElementById('skill-radar');
    if (radarSvg) {
        const cx = 200, cy = 200, maxR = 140;
        const skills = [
            { label: 'Backend', value: 0.95, techs: 'Flask, Spring Boot, Node.js, REST APIs' },
            { label: 'Cloud', value: 0.8, techs: 'AWS EC2/S3, Docker, Nginx, Jenkins' },
            { label: 'Databases', value: 0.85, techs: 'MySQL, MongoDB, Amazon RDS' },
            { label: 'AI/ML', value: 0.75, techs: 'STT, TTS, LLM, Conversational AI' },
            { label: 'Testing', value: 0.8, techs: 'Playwright, Flutter, API Testing' },
            { label: 'Frontend', value: 0.6, techs: 'React.js, HTML/CSS, TailwindCSS' }
        ];
        const n = skills.length;

        function polarToXY(angle, radius) {
            return {
                x: cx + radius * Math.cos(angle - Math.PI / 2),
                y: cy + radius * Math.sin(angle - Math.PI / 2)
            };
        }

        // Draw grid rings
        const rings = radarSvg.querySelectorAll('.radar-ring');
        rings.forEach(ring => {
            const level = parseFloat(ring.dataset.level);
            const pts = [];
            for (let i = 0; i < n; i++) {
                const angle = (2 * Math.PI / n) * i;
                const p = polarToXY(angle, maxR * level);
                pts.push(`${p.x},${p.y}`);
            }
            ring.setAttribute('points', pts.join(' '));
        });

        // Draw axis lines
        const axesGroup = radarSvg.querySelector('.radar-axes');
        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI / n) * i;
            const p = polarToXY(angle, maxR);
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', cx); line.setAttribute('y1', cy);
            line.setAttribute('x2', p.x); line.setAttribute('y2', p.y);
            axesGroup.appendChild(line);
        }

        // Draw data polygon
        const dataPolygon = document.getElementById('radar-data');
        const pointsGroup = document.getElementById('radar-points');
        const labelsGroup = document.getElementById('radar-labels');
        const radarTooltip = document.getElementById('radar-tooltip');
        const dataPts = [];

        skills.forEach((skill, i) => {
            const angle = (2 * Math.PI / n) * i;
            const p = polarToXY(angle, maxR * skill.value);
            dataPts.push(`${p.x},${p.y}`);

            // Data point circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', p.x);
            circle.setAttribute('cy', p.y);
            circle.setAttribute('data-skill', skill.label);
            circle.setAttribute('data-techs', skill.techs);
            circle.setAttribute('data-value', Math.round(skill.value * 100));

            circle.addEventListener('mouseenter', () => {
                radarTooltip.innerHTML = `<strong style="color:var(--accent-blue)">${skill.label}</strong> — ${Math.round(skill.value * 100)}%<br><span style="color:var(--text-muted)">${skill.techs}</span>`;
                radarTooltip.classList.add('visible');
                const rect = radarSvg.closest('.radar-chart-container').getBoundingClientRect();
                const svgRect = radarSvg.getBoundingClientRect();
                const scaleX = svgRect.width / 400;
                radarTooltip.style.left = (p.x * scaleX - radarTooltip.offsetWidth / 2 + (svgRect.left - rect.left)) + 'px';
                radarTooltip.style.top = (p.y * scaleX - 50 + (svgRect.top - rect.top)) + 'px';
            });
            circle.addEventListener('mouseleave', () => {
                radarTooltip.classList.remove('visible');
            });

            pointsGroup.appendChild(circle);

            // Labels
            const labelP = polarToXY(angle, maxR + 22);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', labelP.x);
            text.setAttribute('y', labelP.y + 4);
            text.textContent = skill.label;
            labelsGroup.appendChild(text);
        });

        dataPolygon.setAttribute('points', dataPts.join(' '));

        // Animate on scroll
        const radarContainer = radarSvg.closest('.radar-chart-container');
        const radarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    dataPolygon.classList.add('animated');
                    pointsGroup.querySelectorAll('circle').forEach((c, i) => {
                        setTimeout(() => c.classList.add('animated'), 300 + i * 100);
                    });
                    radarObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        if (radarContainer) radarObserver.observe(radarContainer);
    }

    /* ==========================================================================
       28. View Source Code Overlay
       ========================================================================== */
    const sourceSnippets = {
        home: { title: 'particles.js — Canvas Particle System', code: `// Particle system with mouse interactivity
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    // Bounce off edges
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    p.x += p.vx;
    p.y += p.vy;

    // Mouse repulsion (150px radius)
    if (mouse.x !== undefined) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        p.x += (dx / dist) * 2;
        p.y += (dy / dist) * 2;
      }
    }

    // Draw connections between nearby particles
    particles.forEach(p2 => {
      const d = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (d < 150) {
        ctx.strokeStyle = \`rgba(0,240,255,\${0.08 * (1 - d/150)})\`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
  });
  requestAnimationFrame(animateParticles);
}` },
        about: { title: 'scramble.js — Text Scramble Effect', code: `// Scramble text characters on reveal
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\\\/[]{}#@$%^&*()+=01';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const length = Math.max(this.el.innerText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = this.el.innerText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    this.frame = 0;
    this.update();
  }
}` },
        skills: { title: 'radar.js — SVG Skill Radar Chart', code: `// Generate radar chart with polar coordinates
const skills = [
  { label: 'Backend',   value: 0.95 },
  { label: 'Cloud',     value: 0.80 },
  { label: 'Databases', value: 0.85 },
  { label: 'AI/ML',     value: 0.75 },
  { label: 'Testing',   value: 0.80 },
  { label: 'Frontend',  value: 0.60 }
];

function polarToXY(angle, radius) {
  return {
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2)
  };
}

// Animate stroke-dashoffset for draw-in
radarObserver = new IntersectionObserver(entries => {
  if (entry.isIntersecting) {
    dataPolygon.classList.add('animated');
    points.forEach((c, i) => {
      setTimeout(() => c.classList.add('animated'), 300 + i * 100);
    });
  }
}, { threshold: 0.3 });` },
        projects: { title: 'terminal.js — Interactive Command System', code: `// Terminal command registry with autocomplete
const commands = {
  help: () => renderTable(commandList),
  about: () => { scrollToSection('about'); return info; },
  skills: () => { scrollToSection('skills'); return techStack; },
  neofetch: () => renderAsciiSystemInfo(),
  'sudo hire kavya': () => {
    terminal.classList.add('terminal-flash');
    registerEgg('terminal');
    return '===== ACCESS GRANTED =====';
  },
  matrix: () => {
    triggerMatrixRain();
    registerEgg('matrix');
  }
};

// Tab autocomplete
input.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const matches = Object.keys(commands)
      .filter(c => c.startsWith(input.value));
    if (matches.length === 1) input.value = matches[0];
  }
});` },
        contact: { title: 'geo.js — Geolocation & Haversine Distance', code: `// Haversine formula for great-circle distance
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// IP-based city lookup for personalized greeting
fetch('https://ipapi.co/json/')
  .then(r => r.json())
  .then(data => {
    geoData = { city: data.city, lat: data.latitude, lon: data.longitude };
    tourSteps[0].text = \`Welcome from \${data.city}!\`;
  });` }
    };

    function highlightSyntax(code) {
        return code
            .replace(/\/\/.*/g, m => `<span class="cmt">${m}</span>`)
            .replace(/\b(const|let|var|function|return|if|else|for|class|new|this|typeof|import|export|from|of|in)\b/g, '<span class="kw">$1</span>')
            .replace(/(\d+\.?\d*)/g, '<span class="num">$1</span>')
            .replace(/(["'`])(?:(?!\1).)*?\1/g, m => `<span class="str">${m}</span>`)
            .replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="fn">$1</span>(');
    }

    let sourceOverlay = null;

    function showSource() {
        // Find current section
        let currentId = 'home';
        document.querySelectorAll('.section[id]').forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 400) currentId = sec.id;
        });

        const snippet = sourceSnippets[currentId] || sourceSnippets.home;

        if (!sourceOverlay) {
            sourceOverlay = document.createElement('div');
            sourceOverlay.className = 'source-overlay';
            sourceOverlay.innerHTML = `<div class="source-panel">
                <div class="source-panel-header">
                    <h3 id="source-title"></h3>
                    <button class="source-panel-close">&times;</button>
                </div>
                <div class="source-code" id="source-code-content"></div>
            </div>`;
            document.body.appendChild(sourceOverlay);

            sourceOverlay.querySelector('.source-panel-close').addEventListener('click', () => {
                sourceOverlay.classList.remove('visible');
            });
            sourceOverlay.addEventListener('click', (e) => {
                if (e.target === sourceOverlay) sourceOverlay.classList.remove('visible');
            });
        }

        sourceOverlay.querySelector('#source-title').textContent = snippet.title;
        sourceOverlay.querySelector('#source-code-content').innerHTML = highlightSyntax(snippet.code);
        sourceOverlay.classList.add('visible');
    }

    // Terminal command
    commands.source = () => {
        setTimeout(showSource, 100);
        return '<div class="term-success">Opening source view for current section...</div>';
    };

    // Also accessible via Ctrl+Shift+S
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'S') {
            e.preventDefault();
            showSource();
        }
    });

    /* ==========================================================================
       29. Live Code Playground in Terminal
       ========================================================================== */

    // --- run: sandboxed JS eval ---
    commands.run = (args) => {
        if (!args || args.length === 0) return '<div class="term-error">Usage: run &lt;javascript code&gt;</div>';
        const code = args.join(' ');

        // Block dangerous patterns
        const blocked = ['document', 'window', 'fetch', 'XMLHttpRequest', 'eval', 'Function', 'import', 'require', 'localStorage', 'sessionStorage', 'cookie'];
        for (const b of blocked) {
            if (code.includes(b)) return `<div class="term-error">SecurityError: access to '${b}' is restricted in sandbox</div>`;
        }

        const logs = [];
        const fakeConsole = { log: (...a) => logs.push(a.map(String).join(' ')), error: (...a) => logs.push('Error: ' + a.map(String).join(' ')) };

        try {
            const fn = new Function('console', '"use strict";\n' + code);
            const result = fn(fakeConsole);
            let output = '';
            if (logs.length) output += logs.map(l => `<div class="term-output">${l}</div>`).join('');
            if (result !== undefined) output += `<div class="term-output" style="color:var(--accent-blue)">${String(result)}</div>`;
            return output || '<div class="term-output" style="color:var(--text-muted)">undefined</div>';
        } catch (e) {
            return `<div class="term-error">${e.name}: ${e.message}</div>`;
        }
    };

    // --- sql: mock database query ---
    const mockDB = {
        skills: [
            { category: 'Languages', items: 'Python, Java, JavaScript, SQL', proficiency: '90%' },
            { category: 'Backend', items: 'Flask, Spring Boot, Node.js', proficiency: '95%' },
            { category: 'Databases', items: 'MySQL, MongoDB, Amazon RDS', proficiency: '85%' },
            { category: 'Cloud', items: 'AWS EC2/S3, Docker, Nginx', proficiency: '80%' },
            { category: 'Testing', items: 'Playwright, Flutter, API Testing', proficiency: '80%' },
            { category: 'Frontend', items: 'React.js, HTML/CSS, TailwindCSS', proficiency: '60%' }
        ],
        experience: [
            { role: 'SDET', company: 'Salescode.ai', location: 'Gurugram', start: '2025-04', status: 'Active' }
        ],
        projects: [
            { name: 'SCAI', type: 'AI Voice Agent', tech: 'Python, Flask, AWS', latency: '<2s' },
            { name: 'SalesLens', type: 'Analytics Dashboard', tech: 'Python, MySQL, React', data_points: '500+' }
        ],
        certifications: [
            { name: 'AWS Cloud Practitioner', year: 2025, provider: 'Amazon' },
            { name: 'Python Advanced', year: 2024, provider: 'HackerRank' },
            { name: 'Docker Essentials', year: 2024, provider: 'Docker' },
            { name: 'AI & Machine Learning', year: 2024, provider: 'Coursera' }
        ]
    };

    function formatTable(rows) {
        if (!rows.length) return '<div class="term-output">(empty set)</div>';
        const keys = Object.keys(rows[0]);
        const widths = keys.map(k => Math.max(k.length, ...rows.map(r => String(r[k]).length)));
        const sep = '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+';
        const header = '|' + keys.map((k, i) => ` ${k.padEnd(widths[i])} `).join('|') + '|';
        const body = rows.map(r => '|' + keys.map((k, i) => ` ${String(r[k]).padEnd(widths[i])} `).join('|') + '|').join('\n');
        return `<pre class="term-output" style="font-size:0.75rem;line-height:1.5">${sep}\n${header}\n${sep}\n${body}\n${sep}</pre>
<div class="term-output" style="color:var(--text-muted)">${rows.length} row(s) in set</div>`;
    }

    commands.sql = (args) => {
        if (!args || args.length === 0) return '<div class="term-error">Usage: sql SELECT * FROM &lt;table&gt;</div>';
        const query = args.join(' ').trim();
        const match = query.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(\w+))?(?:\s+LIMIT\s+(\d+))?$/i);
        if (!match) return `<div class="term-error">Syntax error. Tables: ${Object.keys(mockDB).join(', ')}</div>`;

        const [, columns, table, where, orderBy, limit] = match;
        const data = mockDB[table.toLowerCase()];
        if (!data) return `<div class="term-error">Table '${table}' not found. Available: ${Object.keys(mockDB).join(', ')}</div>`;

        let results = [...data];

        // WHERE clause
        if (where) {
            const wMatch = where.match(/(\w+)\s*=\s*['"]?(.+?)['"]?$/i);
            if (wMatch) {
                results = results.filter(r => String(r[wMatch[1]]).toLowerCase() === wMatch[2].toLowerCase());
            }
        }

        // ORDER BY
        if (orderBy && results.length && results[0][orderBy] !== undefined) {
            results.sort((a, b) => String(a[orderBy]).localeCompare(String(b[orderBy])));
        }

        // LIMIT
        if (limit) results = results.slice(0, parseInt(limit));

        // Column selection
        if (columns.trim() !== '*') {
            const cols = columns.split(',').map(c => c.trim());
            results = results.map(r => {
                const obj = {};
                cols.forEach(c => { if (r[c] !== undefined) obj[c] = r[c]; });
                return obj;
            });
        }

        return `<div class="term-heading" style="margin-bottom:0.3rem">${query}</div>` + formatTable(results);
    };

    // --- python: simple Python-to-JS approximation ---
    commands.python = (args) => {
        if (!args || args.length === 0) return '<div class="term-error">Usage: python &lt;python code&gt;</div>';
        const code = args.join(' ');

        try {
            // Simple Python-to-JS translations
            let jsCode = code
                .replace(/print\((.+?)\)/g, 'console.log($1)')
                .replace(/len\((.+?)\)/g, '$1.length')
                .replace(/range\((\d+)\)/g, 'Array.from({length:$1},(_,i)=>i)')
                .replace(/range\((\d+),\s*(\d+)\)/g, 'Array.from({length:$2-$1},(_,i)=>i+$1)')
                .replace(/True/g, 'true')
                .replace(/False/g, 'false')
                .replace(/None/g, 'null')
                .replace(/#.*/g, '')
                .replace(/\*\*/g, '**');

            // Reuse run command logic
            return commands.run(jsCode.split(' '));
        } catch (e) {
            return `<div class="term-error">${e.message}</div>`;
        }
    };

    // Update help to include new commands
    const origHelp2 = commands.help;
    commands.help = () => {
        return origHelp2()
            .replace('</div>', '') +
`<span class="term-key">profile</span><span class="term-val">View your hacker profile</span>
<span class="term-key">ping</span><span class="term-val">Ping kavya.dev</span>
<span class="term-key">source</span><span class="term-val">View source code</span>
<span class="term-key">run</span><span class="term-val">Run JavaScript code</span>
<span class="term-key">sql</span><span class="term-val">Query mock database</span>
<span class="term-key">python</span><span class="term-val">Run Python (approx.)</span>
<span class="term-key">gravity</span><span class="term-val">Enable gravity (easter egg)</span>
<span class="term-key">incognito</span><span class="term-val">Toggle privacy mode</span>
</div>`;
    };

    /* ==========================================================================
       30. Scroll-Driven Commit Timeline Animation
       ========================================================================== */
    const commitTimeline = document.getElementById('commit-timeline');
    if (commitTimeline) {
        const commitNodes = commitTimeline.querySelectorAll('.commit-node');

        const commitObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animate each commit node
                    commitNodes.forEach((node, i) => {
                        setTimeout(() => node.classList.add('visible'), i * 200);
                    });
                    commitObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        commitObserver.observe(commitTimeline);

        // Horizontal scroll with mouse wheel
        commitTimeline.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                commitTimeline.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }

    /* ==========================================================================
       31. Physics "Gravity" Easter Egg
       ========================================================================== */
    let gravityActive = false;

    function triggerGravity() {
        if (gravityActive) return;
        gravityActive = true;

        const elements = [];
        const selectors = '.glass-card, .section-title, .btn, .cert-card, .skill-category, .commit-card';
        document.querySelectorAll(selectors).forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight + 100) {
                elements.push({
                    el,
                    origTransform: el.style.transform,
                    origTransition: el.style.transition,
                    origPosition: el.style.position,
                    x: 0,
                    y: 0,
                    vy: 0,
                    rotation: (Math.random() - 0.5) * 4,
                    floor: window.innerHeight - rect.bottom + rect.height / 2
                });
            }
        });

        // Disable transitions for physics
        elements.forEach(e => {
            e.el.style.transition = 'none';
        });

        let frame;
        const gravity = 0.8;
        const bounce = 0.5;
        const friction = 0.99;

        function step() {
            let allSettled = true;
            elements.forEach(e => {
                e.vy += gravity;
                e.y += e.vy;
                e.rotation += e.vy * 0.05;

                // Floor collision
                if (e.y >= e.floor) {
                    e.y = e.floor;
                    e.vy = -e.vy * bounce;
                    if (Math.abs(e.vy) < 1) e.vy = 0;
                }

                e.vy *= friction;
                if (Math.abs(e.vy) > 0.5 || e.y < e.floor) allSettled = false;

                e.el.style.transform = `translateY(${e.y}px) rotate(${e.rotation}deg)`;
            });

            if (!allSettled) {
                frame = requestAnimationFrame(step);
            } else {
                // Hold for 2s then restore
                setTimeout(restoreElements, 2000);
            }
        }

        function restoreElements() {
            cancelAnimationFrame(frame);
            elements.forEach(e => {
                e.el.style.transition = 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
                e.el.style.transform = e.origTransform || '';
            });
            setTimeout(() => {
                elements.forEach(e => {
                    e.el.style.transition = e.origTransition || '';
                    e.el.style.position = e.origPosition || '';
                });
                gravityActive = false;
            }, 1200);
        }

        frame = requestAnimationFrame(step);
        if (window.SoundEngine) SoundEngine.error();
    }

    commands.gravity = () => {
        triggerGravity();
        registerEgg('gravity');
        return '<div class="term-success">Gravity enabled... hold on!</div>';
    };

    // Also triggered by typing "gravity" anywhere (hidden)
    let gravityBuffer = '';
    document.addEventListener('keydown', (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        gravityBuffer += e.key.toLowerCase();
        if (gravityBuffer.length > 7) gravityBuffer = gravityBuffer.slice(-7);
        if (gravityBuffer === 'gravity') {
            gravityBuffer = '';
            triggerGravity();
            registerEgg('gravity');
        }
    });

    /* ==========================================================================
       32. "Hiring Mode" Contact Enhancement
       ========================================================================== */
    let hiringMode = sessionStorage.getItem('kavya-hiring-mode') === 'true';

    function activateHiringMode() {
        if (hiringMode) return;
        hiringMode = true;
        sessionStorage.setItem('kavya-hiring-mode', 'true');

        const contactSection = document.getElementById('contact');
        const form = document.getElementById('contactForm');
        if (!contactSection || !form) return;

        // Golden glow on contact section
        contactSection.style.boxShadow = '0 0 60px rgba(255, 215, 0, 0.08)';
        contactSection.style.borderTop = '1px solid rgba(255, 215, 0, 0.15)';

        // Add hiring fields before existing fields
        const firstGroup = form.querySelector('.form-group');
        if (firstGroup && !document.getElementById('company')) {
            const companyGroup = document.createElement('div');
            companyGroup.className = 'form-group';
            companyGroup.innerHTML = `<label for="company">Company Name</label>
                <input type="text" id="company" class="glass-input" placeholder="Your Company" required>`;
            form.insertBefore(companyGroup, firstGroup);

            const roleGroup = document.createElement('div');
            roleGroup.className = 'form-group';
            roleGroup.innerHTML = `<label for="role-type">Role Type</label>
                <select id="role-type" class="glass-input" required>
                    <option value="" disabled selected>Select role type</option>
                    <option value="fulltime">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                </select>`;
            form.insertBefore(roleGroup, firstGroup);
        }

        // Update submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-handshake"></i> Send Hiring Inquiry';
            submitBtn.style.background = 'linear-gradient(135deg, #ffd700, #ff8c00)';
        }
    }

    // Hook into existing sudo hire kavya command
    const origSudoHire = commands['sudo hire kavya'];
    commands['sudo hire kavya'] = () => {
        activateHiringMode();
        return origSudoHire();
    };

    // Restore on load if already activated
    if (hiringMode) {
        // Re-run after DOM fully loaded
        setTimeout(activateHiringMode, 100);
        hiringMode = false; // Reset so activateHiringMode() runs
    }

    /* ==========================================================================
       33. IST Timezone Clock + Availability Status
       ========================================================================== */
    const clockContainer = document.createElement('div');
    clockContainer.className = 'ist-clock';
    clockContainer.id = 'ist-clock';
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        // Insert before the sound toggle
        const soundBtn = document.getElementById('sound-toggle');
        if (soundBtn) navContainer.insertBefore(clockContainer, soundBtn);
        else navContainer.appendChild(clockContainer);
    }

    function updateISTClock() {
        const now = new Date();
        const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const hours = ist.getHours();
        const mins = String(ist.getMinutes()).padStart(2, '0');
        const secs = String(ist.getSeconds()).padStart(2, '0');
        const h12 = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const day = ist.getDay();
        const isWorkHours = hours >= 9 && hours < 19 && day >= 1 && day <= 5;

        clockContainer.innerHTML = `
            <span class="clock-dot ${isWorkHours ? 'online' : 'offline'}"></span>
            <span class="clock-time">${h12}:${mins}:${secs} ${ampm} IST</span>
            <span class="clock-status">${isWorkHours ? 'Available' : 'Offline'}</span>
        `;
    }

    updateISTClock();
    setInterval(updateISTClock, 1000);

    /* ==========================================================================
       34. Animated Favicon
       ========================================================================== */
    const faviconCanvas = document.createElement('canvas');
    faviconCanvas.width = 32;
    faviconCanvas.height = 32;
    const favCtx = faviconCanvas.getContext('2d');

    let faviconLink = document.querySelector('link[rel="icon"]');
    if (!faviconLink) {
        faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        document.head.appendChild(faviconLink);
    }

    function drawFavicon(theme) {
        const isDark = theme !== 'light';
        favCtx.clearRect(0, 0, 32, 32);

        // Background
        favCtx.fillStyle = isDark ? '#07070a' : '#ffffff';
        favCtx.beginPath();
        favCtx.roundRect(0, 0, 32, 32, 6);
        favCtx.fill();

        // Border
        const grad = favCtx.createLinearGradient(0, 0, 32, 32);
        grad.addColorStop(0, '#00f0ff');
        grad.addColorStop(1, '#9d00ff');
        favCtx.strokeStyle = grad;
        favCtx.lineWidth = 2;
        favCtx.beginPath();
        favCtx.roundRect(1, 1, 30, 30, 5);
        favCtx.stroke();

        // KM text
        favCtx.fillStyle = isDark ? '#00f0ff' : '#07070a';
        favCtx.font = 'bold 14px sans-serif';
        favCtx.textAlign = 'center';
        favCtx.textBaseline = 'middle';
        favCtx.fillText('KM', 16, 17);

        faviconLink.href = faviconCanvas.toDataURL();
    }

    // Boot animation frames
    let bootFaviconFrame = 0;
    let bootFaviconInterval = null;

    function startFaviconBoot() {
        bootFaviconInterval = setInterval(() => {
            favCtx.clearRect(0, 0, 32, 32);
            favCtx.fillStyle = '#07070a';
            favCtx.fillRect(0, 0, 32, 32);

            // Spinning arc
            const startAngle = (bootFaviconFrame * 0.3) % (Math.PI * 2);
            favCtx.strokeStyle = '#00f0ff';
            favCtx.lineWidth = 3;
            favCtx.beginPath();
            favCtx.arc(16, 16, 10, startAngle, startAngle + Math.PI * 1.2);
            favCtx.stroke();

            faviconLink.href = faviconCanvas.toDataURL();
            bootFaviconFrame++;
        }, 100);
    }

    function stopFaviconBoot() {
        clearInterval(bootFaviconInterval);
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        drawFavicon(theme);
    }

    // Start boot favicon if boot screen is active
    if (bootScreen && !sessionStorage.getItem('bootDone')) {
        startFaviconBoot();
        // Stop when boot ends (listen for content-hidden removal)
        const bootObserverFav = new MutationObserver(() => {
            if (!bootScreen.style.display || bootScreen.style.display === 'none' || bootScreen.style.opacity === '0') {
                stopFaviconBoot();
                bootObserverFav.disconnect();
            }
        });
        bootObserverFav.observe(bootScreen, { attributes: true, attributeFilter: ['style', 'class'] });
        // Fallback: stop after 5s
        setTimeout(stopFaviconBoot, 5000);
    } else {
        drawFavicon(document.body.classList.contains('light-theme') ? 'light' : 'dark');
    }

    // Update favicon on theme change
    const themeToggleFav = document.getElementById('theme-toggle');
    if (themeToggleFav) {
        themeToggleFav.addEventListener('click', () => {
            setTimeout(() => {
                drawFavicon(document.body.classList.contains('light-theme') ? 'light' : 'dark');
            }, 50);
        });
    }

    // Tab away detection
    const originalTitle = document.title;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.title = '👋 Come back! | ' + originalTitle;
            // Draw a "wave" favicon
            favCtx.clearRect(0, 0, 32, 32);
            favCtx.fillStyle = '#07070a';
            favCtx.fillRect(0, 0, 32, 32);
            favCtx.font = '22px serif';
            favCtx.textAlign = 'center';
            favCtx.textBaseline = 'middle';
            favCtx.fillText('👋', 16, 16);
            faviconLink.href = faviconCanvas.toDataURL();
        } else {
            document.title = originalTitle;
            drawFavicon(document.body.classList.contains('light-theme') ? 'light' : 'dark');
        }
    });

    /* ==========================================================================
       35. Incognito Mode
       ========================================================================== */
    let incognitoMode = localStorage.getItem('kavya-incognito') === 'true';

    function toggleIncognito() {
        incognitoMode = !incognitoMode;
        localStorage.setItem('kavya-incognito', incognitoMode);
        applyIncognito();
        return incognitoMode;
    }

    function applyIncognito() {
        document.body.classList.toggle('incognito-mode', incognitoMode);
        if (incognitoMode) {
            // Disable GA
            window['ga-disable-G-8ZE56CHCJF'] = true;
            window.gtag = function() {};
        } else {
            window['ga-disable-G-8ZE56CHCJF'] = false;
            // Can't fully re-enable GA without reload, but flag is cleared
        }
    }

    if (incognitoMode) applyIncognito();

    commands.incognito = () => {
        const state = toggleIncognito();
        return state
            ? `<div class="term-success"><i class="fas fa-mask"></i> Incognito mode ON — analytics disabled, tracking hidden</div>`
            : `<div class="term-output">Incognito mode OFF — normal mode restored</div>`;
    };

});
