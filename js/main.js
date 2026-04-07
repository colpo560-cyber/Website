/* ============================================
   PIERANDREA // CYBERPUNK TERMINAL PORTFOLIO
   Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ─── BOOT SEQUENCE ───────────────────────────────
  const bootScreen = document.getElementById('boot-screen');
  const bootLog = document.getElementById('boot-log');
  const navbar = document.getElementById('navbar');
  const mainContent = document.getElementById('main-content');
  const footer = document.getElementById('footer');

  const bootLines = [
    { text: '[BIOS]    Power-On Self Test...', delay: 100, status: 'ok' },
    { text: '[BIOS]    Memory check: 32GB DDR5...', delay: 200, status: 'ok' },
    { text: '[BOOT]    Loading PIERANDREA.OS v3.1.4...', delay: 300, status: 'ok' },
    { text: '[KERNEL]  Initializing kernel modules...', delay: 250, status: 'ok' },
    { text: '[FS]      Mounting /dev/portfolio...', delay: 200, status: 'ok' },
    { text: '[NET]     Establishing secure connection...', delay: 400, status: 'ok' },
    { text: '[CRYPTO]  Decrypting portfolio data...', delay: 350, status: 'ok' },
    { text: '[AUTH]    Verifying visitor credentials...', delay: 200, status: 'warn', statusText: 'GUEST' },
    { text: '[GPU]     Enabling cyberpunk renderer...', delay: 250, status: 'ok' },
    { text: '[SYS]     Loading experience modules...', delay: 200, status: 'ok' },
    { text: '[SYS]     Loading investment data...', delay: 150, status: 'ok' },
    { text: '[SYS]     Loading skill matrix...', delay: 150, status: 'ok' },
    { text: '[SYS]     Loading blog entries...', delay: 150, status: 'ok' },
    { text: '[RENDER]  Compiling UI shaders...', delay: 300, status: 'ok' },
    { text: '', delay: 100 },
    { text: '> ALL SYSTEMS OPERATIONAL', delay: 100, status: 'info' },
    { text: '> WELCOME, VISITOR.', delay: 200, status: 'info' },
  ];

  let bootTimeout;
  let bootIndex = 0;
  let bootDone = false;

  function addBootLine(line) {
    const el = document.createElement('div');
    el.className = 'boot-line';
    if (line.text === '') {
      el.innerHTML = '&nbsp;';
    } else {
      let statusTag = '';
      if (line.status === 'ok') statusTag = ' <span class="ok">[OK]</span>';
      else if (line.status === 'warn') statusTag = ` <span class="warn">[${line.statusText || 'WARN'}]</span>`;
      else if (line.status === 'fail') statusTag = ' <span class="fail">[FAIL]</span>';
      else if (line.status === 'info') statusTag = '';
      const textClass = line.status === 'info' ? 'info' : 'label';
      el.innerHTML = `<span class="${textClass}">${line.text}</span>${statusTag}`;
    }
    bootLog.appendChild(el);
    bootLog.scrollTop = bootLog.scrollHeight;
  }

  function runBoot() {
    if (bootIndex >= bootLines.length) {
      setTimeout(finishBoot, 600);
      return;
    }
    const line = bootLines[bootIndex];
    addBootLine(line);
    bootIndex++;
    bootTimeout = setTimeout(runBoot, line.delay);
  }

  function finishBoot() {
    if (bootDone) return;
    bootDone = true;
    clearTimeout(bootTimeout);
    bootScreen.classList.add('done');
    navbar.classList.remove('hidden');
    navbar.classList.add('visible');
    mainContent.classList.remove('hidden');
    mainContent.style.opacity = '1';
    footer.classList.remove('hidden');
    footer.classList.add('visible');
    initAfterBoot();
  }

  function skipBoot() {
    if (bootDone) return;
    finishBoot();
  }

  // Skip boot on click or keypress
  document.addEventListener('keydown', skipBoot, { once: true });
  bootScreen.addEventListener('click', skipBoot, { once: true });

  runBoot();

  // ─── MATRIX RAIN ─────────────────────────────────
  const canvas = document.getElementById('matrix-bg');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  let matrixInterval = setInterval(drawMatrix, 50);

  window.addEventListener('resize', function () {
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
  });

  // ─── TYPING EFFECT ───────────────────────────────
  const subtitleEl = document.getElementById('typed-subtitle');
  const subtitles = [
    'Crypto-native Investor | 7+ Years in Web3',
    '$30M+ Deployed | 80+ Projects Funded',
    'Co-Founder @ Nova Horizon | Ex-ICONIUM',
    'Deal Sourcing | Tokenomics | Portfolio Construction',
  ];
  let subIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingStarted = false;

  function typeSubtitle() {
    if (!subtitleEl) return;
    const current = subtitles[subIndex];
    if (!isDeleting) {
      subtitleEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        setTimeout(function () { isDeleting = true; typeSubtitle(); }, 2500);
        return;
      }
      setTimeout(typeSubtitle, 60);
    } else {
      subtitleEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        subIndex = (subIndex + 1) % subtitles.length;
        setTimeout(typeSubtitle, 400);
        return;
      }
      setTimeout(typeSubtitle, 30);
    }
  }

  // ─── UPTIME COUNTER ──────────────────────────────
  const uptimeEl = document.getElementById('uptime');
  const startTime = Date.now();

  function updateUptime() {
    if (!uptimeEl) return;
    const elapsed = Date.now() - startTime;
    const hours = Math.floor(elapsed / 3600000);
    const mins = Math.floor((elapsed % 3600000) / 60000);
    const secs = Math.floor((elapsed % 60000) / 1000);
    uptimeEl.textContent =
      String(hours).padStart(2, '0') + ':' +
      String(mins).padStart(2, '0') + ':' +
      String(secs).padStart(2, '0');
  }
  setInterval(updateUptime, 1000);

  // ─── SCROLL REVEAL ───────────────────────────────
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Animate skill bars
          const skillFills = entry.target.querySelectorAll('.skill-fill');
          skillFills.forEach(function (fill) {
            const width = fill.getAttribute('data-width');
            fill.style.setProperty('--target-width', width + '%');
            setTimeout(function () { fill.classList.add('animated'); }, 200);
          });
          // Animate stat numbers
          const statNums = entry.target.querySelectorAll('.stat-number');
          statNums.forEach(function (num) { animateNumber(num); });
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }

  function animateNumber(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (!target) return;
    let current = 0;
    const increment = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + '+';
    }, 40);
  }

  // ─── NAV ACTIVE TRACKING ─────────────────────────
  function initNavTracking() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // ─── MOBILE MENU ─────────────────────────────────
  function initMobileMenu() {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ─── INTERACTIVE TERMINAL ────────────────────────
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const terminalToggle = document.getElementById('terminal-toggle');
  const terminalClose = document.getElementById('terminal-close');
  const openTerminalBtn = document.getElementById('open-terminal');

  let cmdHistory = [];
  let historyIndex = -1;

  function openTerminal() {
    terminalOverlay.classList.add('open');
    setTimeout(function () { terminalInput.focus(); }, 100);
  }

  function closeTerminal() {
    terminalOverlay.classList.remove('open');
  }

  if (terminalToggle) terminalToggle.addEventListener('click', openTerminal);
  if (openTerminalBtn) openTerminalBtn.addEventListener('click', openTerminal);
  if (terminalClose) terminalClose.addEventListener('click', closeTerminal);

  terminalOverlay.addEventListener('click', function (e) {
    if (e.target === terminalOverlay) closeTerminal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && terminalOverlay.classList.contains('open')) {
      closeTerminal();
    }
    if (e.key === '`' && e.ctrlKey) {
      e.preventDefault();
      if (terminalOverlay.classList.contains('open')) closeTerminal();
      else openTerminal();
    }
  });

  const commands = {
    help: function () {
      return `<span class="highlight-green">Available commands:</span>

  <span class="highlight-cyan">help</span>          Show this help message
  <span class="highlight-cyan">whoami</span>        About Pierandrea
  <span class="highlight-cyan">experience</span>    Work experience
  <span class="highlight-cyan">skills</span>        Technical & other skills
  <span class="highlight-cyan">investments</span>   Investment portfolio
  <span class="highlight-cyan">blog</span>          Blog posts
  <span class="highlight-cyan">contact</span>       Contact information
  <span class="highlight-cyan">ls</span>            List all sections
  <span class="highlight-cyan">neofetch</span>      System information
  <span class="highlight-cyan">date</span>          Current date & time
  <span class="highlight-cyan">theme</span> <span class="highlight-amber">&lt;color&gt;</span>  Change theme (green/cyan/amber/magenta)
  <span class="highlight-cyan">matrix</span>        Toggle matrix rain
  <span class="highlight-cyan">clear</span>         Clear terminal
  <span class="highlight-cyan">exit</span>          Close terminal`;
    },

    whoami: function () {
      return `<span class="highlight-green">Pierandrea Rollo</span>
━━━━━━━━━━━━━━━━━━━━━━━
Crypto-native investment professional with 7+ years
deploying capital across 80+ early-stage Web3 projects.
Track record of managing a $30 mln fund.

<span class="highlight-cyan">Role:</span>      Co-Founder @ Nova Horizon | Ex-ICONIUM
<span class="highlight-cyan">Focus:</span>     DeFi, Infrastructure, App Layer
<span class="highlight-cyan">Education:</span> Bocconi University, ConsenSys Academy
<span class="highlight-cyan">Status:</span>    <span class="highlight-green">ONLINE</span>`;
    },

    experience: function () {
      return `<span class="highlight-green">cat experience.log</span>
━━━━━━━━━━━━━━━━━━━━━━━

<span class="highlight-amber">[2024 - Present]</span> <span class="highlight-cyan">Co-Founder</span>
  @ Nova Horizon
  Crypto-native advisory. $7.5M+ raised for founders.
  100+ VC pipeline. GTM for multiple early-stage projects.

<span class="highlight-amber">[2020 - 2024]</span> <span class="highlight-cyan">Investment Manager</span>
  @ ICONIUM B.V.
  ~$30M deployed, 80+ projects.
  LP relations with Pantera, Blockchain.com Ventures.
  ~$2M yield strategies, zero principal losses.

<span class="highlight-amber">[2018 - 2020]</span> <span class="highlight-cyan">Business Analyst</span>
  @ ICONIUM B.V.
  1,500+ projects screened, 300+ due diligences.
  Built scouting DB & on-chain reporting.`;
    },

    skills: function () {
      return `<span class="highlight-green">./scan_skills.sh</span>
━━━━━━━━━━━━━━━━━━━━━━━

<span class="highlight-cyan">INVESTMENT & ANALYSIS:</span>
  Deal Sourcing & DD
  Portfolio Construction
  Tokenomics / SAFT
  On-chain Analysis
  LP Relations
  Thesis Development

<span class="highlight-magenta">TECHNICAL STACK:</span>
  SQL / PostgreSQL
  Python
  Solidity

<span class="highlight-amber">LANGUAGES:</span>
  Italian [Native] English [Fluent] Spanish [Fluent]`;
    },

    investments: function () {
      return `<span class="highlight-green">ls -la investments/</span>
━━━━━━━━━━━━━━━━━━━━━━━

<span class="highlight-cyan">ICONIUM Fund</span>            <span class="highlight-green">[EXITED]</span>
  ~$30M deployed, 80+ projects

<span class="highlight-cyan">Angel Portfolio</span>         <span class="highlight-green">[ACTIVE]</span>
  MegaETH, Opinion, Superform, Nunchi.Trade, Ethos

<span class="highlight-cyan">Nova Horizon Advisory</span>   <span class="highlight-green">[ACTIVE]</span>
  $7.5M+ raised across seed and private rounds

<span class="highlight-cyan">Yield Strategies</span>        <span class="highlight-green">[ACTIVE]</span>
  ~$2M passive income, zero principal losses`;
    },

    blog: function () {
      return `<span class="highlight-green">ls -lt blog/</span>
━━━━━━━━━━━━━━━━━━━━━━━

<span class="highlight-amber">[2026-04-07]</span> Inside the $282M Drift Hack: A Full On-Chain Breakdown
<span class="highlight-amber">[2026-04-07]</span> Megapot: Community-Run Lottery or Offshore Scratch Card?

  <span class="highlight-cyan">2 posts found. Scroll down to read.</span>`;
    },

    contact: function () {
      return `<span class="highlight-green">cat contact.sh</span>
━━━━━━━━━━━━━━━━━━━━━━━

<span class="highlight-cyan">LinkedIn:</span>  linkedin.com/in/pierandrearollo
<span class="highlight-cyan">Telegram:</span>  @pierandrear
<span class="highlight-cyan">Email:</span>     pierandrearollo@proton.me`;
    },

    ls: function () {
      return `<span class="highlight-cyan">drwxr-xr-x</span>  pierandrea  <span class="highlight-green">about/</span>
<span class="highlight-cyan">drwxr-xr-x</span>  pierandrea  <span class="highlight-green">experience/</span>
<span class="highlight-cyan">drwxr-xr-x</span>  pierandrea  <span class="highlight-green">investments/</span>
<span class="highlight-cyan">drwxr-xr-x</span>  pierandrea  <span class="highlight-green">skills/</span>
<span class="highlight-cyan">drwxr-xr-x</span>  pierandrea  <span class="highlight-green">blog/</span>
<span class="highlight-cyan">-rw-r--r--</span>  pierandrea  <span class="highlight-amber">contact.sh</span>
<span class="highlight-cyan">-rw-r--r--</span>  pierandrea  <span class="highlight-amber">README.md</span>`;
    },

    neofetch: function () {
      return `<span class="highlight-green">
  ██████╗
  ██╔══██╗
  ██████╔╝
  ██╔═══╝
  ██║
  ╚═╝     </span>
        <span class="highlight-cyan">pierandrea</span>@<span class="highlight-cyan">portfolio</span>
        ━━━━━━━━━━━━━━━━━━━━
        <span class="highlight-cyan">OS:</span>      PIERANDREA.OS v3.1.4
        <span class="highlight-cyan">Role:</span>    Investor & Advisor
        <span class="highlight-cyan">Fund:</span>    Nova Horizon (Co-Founder)
        <span class="highlight-cyan">Prev:</span>    ICONIUM B.V. (Sr. Investment Mgr)
        <span class="highlight-cyan">AUM:</span>     $30M+ deployed
        <span class="highlight-cyan">School:</span>  Bocconi / ConsenSys Academy
        <span class="highlight-cyan">Shell:</span>   cyberpunk-terminal
        <span class="highlight-cyan">Theme:</span>   Neon Green [Dark]`;
    },

    date: function () {
      return '<span class="highlight-cyan">' + new Date().toString() + '</span>';
    },

    matrix: function () {
      const currentOpacity = parseFloat(getComputedStyle(canvas).opacity);
      if (currentOpacity > 0.03) {
        canvas.style.opacity = '0';
        return '<span class="highlight-amber">Matrix rain: OFF</span>';
      } else {
        canvas.style.opacity = '0.06';
        return '<span class="highlight-green">Matrix rain: ON</span>';
      }
    },

    clear: function () {
      terminalOutput.innerHTML = '';
      return null;
    },

    exit: function () {
      closeTerminal();
      return null;
    },

    theme: function (args) {
      const color = args[0];
      const themes = {
        green: { primary: '#00ff41', dim: '#00cc33', dark: '#003b10' },
        cyan: { primary: '#00d4ff', dim: '#0099bb', dark: '#003344' },
        amber: { primary: '#ffb800', dim: '#cc9300', dark: '#443200' },
        magenta: { primary: '#ff0080', dim: '#cc0066', dark: '#440022' },
      };
      if (!color || !themes[color]) {
        return `<span class="cmd-error">Usage: theme &lt;green|cyan|amber|magenta&gt;</span>`;
      }
      const t = themes[color];
      document.documentElement.style.setProperty('--green', t.primary);
      document.documentElement.style.setProperty('--green-dim', t.dim);
      document.documentElement.style.setProperty('--green-dark', t.dark);
      return `<span class="highlight-green">Theme changed to ${color}.</span>`;
    },

    'sudo': function () {
      return `<span class="highlight-amber">Nice try. 😎</span>
<span class="cmd-error">Permission denied: you are not in the sudoers file.</span>
<span class="cmd-error">This incident will be reported.</span>`;
    },

    cat: function (args) {
      const target = args[0];
      if (!target) return '<span class="cmd-error">Usage: cat &lt;filename&gt;</span>';
      const map = {
        'whoami': 'whoami', 'whoami.txt': 'whoami',
        'experience': 'experience', 'experience.log': 'experience',
        'skills': 'skills', 'skills.sh': 'skills',
        'investments': 'investments',
        'blog': 'blog',
        'contact': 'contact', 'contact.sh': 'contact',
      };
      if (map[target]) return commands[map[target]]();
      return `<span class="cmd-error">cat: ${target}: No such file or directory</span>`;
    },
  };

  function processCommand(input) {
    const parts = input.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Add command to output
    const cmdDiv = document.createElement('div');
    cmdDiv.className = 'cmd-output';
    cmdDiv.innerHTML = `<div class="cmd-line">pierandrea@portfolio:~$ ${escapeHtml(input)}</div>`;

    if (cmd === '') {
      terminalOutput.appendChild(cmdDiv);
      return;
    }

    let result;
    if (cmd === 'sudo') {
      result = commands.sudo();
    } else if (commands[cmd]) {
      result = commands[cmd](args);
    } else {
      result = `<span class="cmd-error">command not found: ${escapeHtml(cmd)}</span>
<span class="highlight-amber">Type 'help' for available commands.</span>`;
    }

    if (result !== null && result !== undefined) {
      cmdDiv.innerHTML += `<div class="cmd-result">${result}</div>`;
    }
    terminalOutput.appendChild(cmdDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const value = terminalInput.value;
        if (value.trim()) {
          cmdHistory.push(value);
          historyIndex = cmdHistory.length;
        }
        processCommand(value);
        terminalInput.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = cmdHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < cmdHistory.length - 1) {
          historyIndex++;
          terminalInput.value = cmdHistory[historyIndex];
        } else {
          historyIndex = cmdHistory.length;
          terminalInput.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const val = terminalInput.value.trim();
        const cmdNames = Object.keys(commands);
        const matches = cmdNames.filter(function (c) { return c.startsWith(val); });
        if (matches.length === 1) {
          terminalInput.value = matches[0] + ' ';
        }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        commands.clear();
      }
    });
  }

  // ─── INIT AFTER BOOT ─────────────────────────────
  function initAfterBoot() {
    initScrollReveal();
    initNavTracking();
    initMobileMenu();

    if (!typingStarted) {
      typingStarted = true;
      setTimeout(typeSubtitle, 500);
    }
  }

})();
