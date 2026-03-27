import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import { processCommand, getCommands } from './CommandHandler';
import resumePdf from '@/assets/pdf/KAVYA_MITTAL.pdf';

interface OutputLine {
  type: 'command' | 'output';
  html: string;
}

const PROMPT = 'visitor@kavya-os:~$';

const WELCOME_MESSAGE = `<div class="term-special">Welcome to KavyaOS v2.0</div>
<div class="term-output">Type <span class="term-key">help</span> to see available commands, or try <span class="term-key">neofetch</span>.</div>
<div class="term-output" style="opacity:0.6; margin-top:0.25rem">Use Tab to autocomplete. Arrow keys to navigate history.</div>`;

export default function Terminal() {
  const [outputStack, setOutputStack] = useState<OutputLine[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [inputValue, setInputValue] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal body to bottom whenever output changes
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [outputStack]);

  // Show welcome message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setOutputStack([{ type: 'output', html: WELCOME_MESSAGE }]);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    // Small delay so the terminal output renders first
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
  }, []);

  const downloadResume = useCallback(() => {
    const link = document.createElement('a');
    link.href = resumePdf;
    link.download = 'KAVYA_MITTAL.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const flashTerminal = useCallback(() => {
    const terminalEl = bodyRef.current?.closest('.interactive-terminal');
    if (terminalEl) {
      terminalEl.classList.add('terminal-flash');
      setTimeout(() => {
        terminalEl.classList.remove('terminal-flash');
      }, 1000);
    }
  }, []);

  const handleAction = useCallback(
    (action: string) => {
      if (action.startsWith('scroll:')) {
        scrollToSection(action.slice(7));
      } else if (action === 'download:resume') {
        downloadResume();
      } else if (action === 'clear') {
        setOutputStack([]);
      } else if (action === 'egg:terminal') {
        flashTerminal();
      } else if (action === 'egg:matrix') {
        // eslint-disable-next-line no-console
      console.log('[KavyaOS] The Matrix has you...');
      }
    },
    [scrollToSection, downloadResume, flashTerminal]
  );

  const executeCommand = useCallback(
    (raw: string) => {
      const input = raw.trim();

      // Add command line to output
      const commandLine: OutputLine = {
        type: 'command',
        html: `<span class="terminal-prompt">${PROMPT}</span> ${input}`,
      };

      const result = processCommand(input);

      // Build new output entries
      const newLines: OutputLine[] = [commandLine];
      if (result.html) {
        newLines.push({ type: 'output', html: result.html });
      }

      if (result.action === 'clear') {
        setOutputStack([]);
      } else {
        setOutputStack((prev) => [...prev, ...newLines]);
      }

      // Add to command history (skip empty or duplicates of last)
      if (input) {
        setCommandHistory((prev) => {
          if (prev[prev.length - 1] === input) return prev;
          return [...prev, input];
        });
      }

      setHistoryIndex(-1);
      setInputValue('');

      // Handle action
      if (result.action && result.action !== 'clear') {
        handleAction(result.action);
      }
    },
    [handleAction]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(inputValue);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex]);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue('');
        } else {
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex]);
        }
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        const current = inputValue.trim().toLowerCase();
        if (!current) return;

        const allCommands = getCommands();
        const matches = allCommands.filter((cmd) => cmd.startsWith(current));

        if (matches.length === 1) {
          setInputValue(matches[0]);
        } else if (matches.length > 1) {
          // Find longest common prefix
          let prefix = matches[0];
          for (let i = 1; i < matches.length; i++) {
            while (!matches[i].startsWith(prefix)) {
              prefix = prefix.slice(0, -1);
            }
          }
          if (prefix.length > current.length) {
            setInputValue(prefix);
          } else {
            // Show possible completions
            const hint: OutputLine = {
              type: 'output',
              html: `<div class="term-output">${matches.join('  ')}</div>`,
            };
            setOutputStack((prev) => [...prev, hint]);
          }
        }
      }
    },
    [inputValue, commandHistory, historyIndex, executeCommand]
  );

  return (
    <div className="interactive-terminal" id="terminal">
      <div className="terminal-header">
        <div className="terminal-dot red" />
        <div className="terminal-dot yellow" />
        <div className="terminal-dot green" />
        <span className="terminal-title">visitor@kavya-os ~ portfolio</span>
      </div>
      <div className="terminal-body" ref={bodyRef} onClick={focusInput}>
        <div className="terminal-output">
          {outputStack.map((line, i) => (
            <div
              key={i}
              className={`term-line ${line.type === 'command' ? 'term-line-cmd' : ''}`}
              dangerouslySetInnerHTML={{ __html: line.html }}
            />
          ))}
        </div>
        <div className="terminal-input-line">
          <span className="terminal-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="terminal-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>
      </div>
    </div>
  );
}
