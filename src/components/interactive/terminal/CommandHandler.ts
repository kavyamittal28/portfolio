import skillsData from '@/data/skills.json';
import projectsData from '@/data/projects.json';
import experienceData from '@/data/experience.json';

interface CommandResult {
  html: string | null;
  action?: string;
}

interface CommandEntry {
  description: string;
  handler: (args: string) => CommandResult;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const termData = {
  about:
    "I'm a Backend-focused Software Engineer passionate about building scalable, AI-driven microservices and production-grade systems. With expertise in Python, Java, and LLM integrations, I thrive on taking full ownership of end-to-end AI workflows.",
  education:
    'B.Tech Computer Science | Chitkara University, Punjab | 2022-Present | CGPA: 9.06',
  phone: '+91-8875484025',
  email: 'kavyamittal1282@gmail.com',
  location: 'Gurugram, India',
};

const skills = skillsData.categories;

const projects = projectsData;

const experiences = experienceData as { role: string; company: string; location: string; date: string; categories: { bullets: string[] }[] }[];

const catMap: Record<string, string> = {
  'about.txt': 'about',
  'skills.json': 'skills',
  'contact.md': 'contact',
  'experience.log': 'experience',
  'resume.pdf': 'resume',
};

function buildTagList(items: string[]): string {
  return items.map((item) => `<span class="term-tag">${escapeHtml(item)}</span>`).join(' ');
}

const commands: Record<string, CommandEntry> = {
  help: {
    description: 'List all available commands',
    handler: () => {
      const rows = Object.entries(commands)
        .map(
          ([cmd, entry]) =>
            `<div class="term-table"><span class="term-key">${cmd}</span><span class="term-val">${entry.description}</span></div>`
        )
        .join('');
      return {
        html: `<div class="term-heading">Available Commands</div>${rows}`,
      };
    },
  },

  about: {
    description: 'Learn about me',
    handler: () => ({
      html: `<div class="term-heading">About Me</div><div class="term-output">${termData.about}</div><div class="term-output" style="margin-top:0.5rem">${termData.education}</div>`,
      action: 'scroll:about',
    }),
  },

  skills: {
    description: 'View my tech stack',
    handler: () => {
      const sections = skills
        .map(
          (cat) =>
            `<div class="term-table"><span class="term-key">${escapeHtml(cat.title)}</span><span class="term-val">${buildTagList(cat.items)}</span></div>`
        )
        .join('');
      return {
        html: `<div class="term-heading">Tech Stack</div>${sections}`,
        action: 'scroll:skills',
      };
    },
  },

  projects: {
    description: 'Browse my projects',
    handler: () => {
      const cards = projects
        .map(
          (p) =>
            `<div class="term-output" style="margin-bottom:0.75rem"><div class="term-heading" style="margin-bottom:0.25rem">${escapeHtml(p.title)}</div><div>${escapeHtml(p.description)}</div><div style="margin-top:0.35rem">${buildTagList(p.tech)}</div></div>`
        )
        .join('');
      return {
        html: `<div class="term-heading">Projects</div>${cards}`,
        action: 'scroll:projects',
      };
    },
  },

  experience: {
    description: 'View my work experience',
    handler: () => {
      const sections = experiences.map((exp) => {
        const allBullets = exp.categories.flatMap((cat) => cat.bullets);
        const bullets = allBullets
          .map((h) => `<div class="term-output">&gt; ${escapeHtml(h)}</div>`)
          .join('');
        return `<div class="term-heading">${escapeHtml(exp.role)}</div><div class="term-table"><span class="term-key">Company</span><span class="term-val">${escapeHtml(exp.company)}</span></div><div class="term-table"><span class="term-key">Location</span><span class="term-val">${escapeHtml(exp.location)}</span></div><div class="term-table"><span class="term-key">Duration</span><span class="term-val">${escapeHtml(exp.date)}</span></div><div style="margin-top:0.5rem">${bullets}</div>`;
      }).join('<div style="margin-top:1rem"></div>');
      return {
        html: sections,
        action: 'scroll:experience',
      };
    },
  },

  contact: {
    description: 'Get my contact info',
    handler: () => ({
      html: `<div class="term-heading">Contact</div><div class="term-table"><span class="term-key">Email</span><span class="term-val">${termData.email}</span></div><div class="term-table"><span class="term-key">Phone</span><span class="term-val">${termData.phone}</span></div><div class="term-table"><span class="term-key">Location</span><span class="term-val">${termData.location}</span></div>`,
      action: 'scroll:contact',
    }),
  },

  resume: {
    description: 'Download my resume',
    handler: () => ({
      html: '<div class="term-success">Initiating resume download...</div>',
      action: 'download:resume',
    }),
  },

  clear: {
    description: 'Clear the terminal',
    handler: () => ({ html: null, action: 'clear' }),
  },

  ls: {
    description: 'List directory contents',
    handler: () => ({
      html: '<div class="term-output">about.txt  skills.json  projects/  experience.log  contact.md  resume.pdf</div>',
    }),
  },

  whoami: {
    description: 'Display current user',
    handler: () => ({
      html: '<div class="term-output">visitor@kavya-os</div>',
    }),
  },

  pwd: {
    description: 'Print working directory',
    handler: () => ({
      html: '<div class="term-output">/home/kavya/portfolio</div>',
    }),
  },

  date: {
    description: 'Show current date and time',
    handler: () => ({
      html: `<div class="term-output">${new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })}</div>`,
    }),
  },

  uname: {
    description: 'Show system information',
    handler: () => ({
      html: '<div class="term-output">KavyaOS 2.0 - Built with React + TypeScript</div>',
    }),
  },

  neofetch: {
    description: 'Display system info with style',
    handler: () => {
      const ascii = [
        ' _  __ __  __ ',
        '| |/ /|  \\/  |',
        '| \' / | \\  / |',
        '|  <  | |\\/| |',
        '| . \\ | |  | |',
        '|_|\\_\\|_|  |_|',
      ];
      const info = [
        '<span class="term-key">OS</span><span class="term-val">KavyaOS 2.0</span>',
        '<span class="term-key">Host</span><span class="term-val">kavya-os @ portfolio</span>',
        '<span class="term-key">Kernel</span><span class="term-val">React 18 + TypeScript</span>',
        '<span class="term-key">Shell</span><span class="term-val">kavya-sh 1.0</span>',
        '<span class="term-key">Theme</span><span class="term-val">Glassmorphism Dark</span>',
        '<span class="term-key">Uptime</span><span class="term-val">Since April 2025</span>',
      ];
      const rows = ascii
        .map(
          (line, i) =>
            `<div class="term-table"><span class="term-ascii">${line}</span>${info[i] ? `<span class="term-val" style="margin-left:1.5rem">${info[i]}</span>` : ''}</div>`
        )
        .join('');
      return { html: `<div class="term-special">${rows}</div>` };
    },
  },

  cat: {
    description: 'Read file contents',
    handler: (args: string) => {
      const filename = args.trim();
      if (!filename) {
        return { html: '<div class="term-error">cat: missing file operand</div>' };
      }
      const mapped = catMap[filename];
      if (mapped && commands[mapped]) {
        return commands[mapped].handler('');
      }
      return {
        html: `<div class="term-error">cat: ${escapeHtml(filename)}: No such file or directory</div>`,
      };
    },
  },

  echo: {
    description: 'Print text to terminal',
    handler: (args: string) => ({
      html: `<div class="term-output">${escapeHtml(args || '')}</div>`,
    }),
  },

  history: {
    description: 'Show command history',
    handler: () => ({
      html: '<div class="term-output">Use Arrow Up/Down to navigate command history.</div>',
    }),
  },
};

// Full-phrase commands that must match the entire input
const phraseCommands: Record<string, CommandEntry> = {
  'sudo hire kavya': {
    description: 'Easter egg',
    handler: () => ({
      html: `<div class="term-success" style="font-size:1.1rem">
  ACCESS GRANTED
</div>
<div class="term-output" style="margin-top:0.5rem">
  Excellent decision. Initiating onboarding sequence...
</div>
<div class="term-output">
  > Loading skills............ done
</div>
<div class="term-output">
  > Deploying work ethic...... done
</div>
<div class="term-output">
  > Brewing coffee............. done
</div>
<div class="term-special" style="margin-top:0.5rem">
  Kavya has been hired successfully. Welcome aboard!
</div>`,
      action: 'egg:terminal',
    }),
  },

  matrix: {
    description: 'Enter the matrix',
    handler: () => ({
      html: `<div class="term-special">Wake up, visitor...</div><div class="term-output">The Matrix has you...</div><div class="term-success">Follow the white rabbit.</div>`,
      action: 'egg:matrix',
    }),
  },
};

export function processCommand(input: string): CommandResult {
  const trimmed = input.trim().toLowerCase();

  if (!trimmed) {
    return { html: null };
  }

  // Check full-phrase commands first
  const phraseMatch = phraseCommands[trimmed];
  if (phraseMatch) {
    return phraseMatch.handler('');
  }

  // Also check if "matrix" is entered as a standalone (since it's in phraseCommands)
  // Split into command and args
  const spaceIndex = trimmed.indexOf(' ');
  const cmd = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
  const args = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1);

  const entry = commands[cmd];
  if (entry) {
    return entry.handler(args);
  }

  return {
    html: `<div class="term-error">Command not found: ${escapeHtml(cmd)}. Type <span class="term-key">help</span> for available commands.</div>`,
  };
}

export function getCommands(): string[] {
  return [
    ...Object.keys(commands),
    'sudo hire kavya',
    'matrix',
  ];
}
