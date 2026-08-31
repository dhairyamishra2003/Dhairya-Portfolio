/**
 * Interactive Developer Terminal CLI
 * Dhairya Mishra Portfolio
 */

(function () {
  const terminalScreen = document.getElementById('terminalScreen');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSubmit = document.getElementById('termSubmitBtn');
  const helpBtn = document.getElementById('termHelpBtn');
  const clearBtn = document.getElementById('termClearBtn');

  const commands = {
    help: () => `
<span class="term-highlight">AVAILABLE COMMANDS:</span>
  • <span class="term-highlight">skills</span>       - List all technical skills & ML/AI frameworks
  • <span class="term-highlight">projects</span>     - Display key AI projects with GitHub repositories
  • <span class="term-highlight">experience</span>   - View industry experience & FODRIX internship details
  • <span class="term-highlight">research</span>     - Read about Independent Multi-Agent Research
  • <span class="term-highlight">education</span>    - Check academic credentials & CGPA
  • <span class="term-highlight">certs</span>        - View certified technical training
  • <span class="term-highlight">contact</span>      - Get email, phone, and LinkedIn coordinates
  • <span class="term-highlight">resume</span>       - Open interactive high-res resume view
  • <span class="term-highlight">sudo hire</span>    - Fast-track interview / hiring request
  • <span class="term-highlight">clear</span>        - Clear the terminal screen
`,
    skills: () => `
<span class="term-highlight">[GENAI & AGENTS]:</span> LangGraph, LangChain, Multi-Agent Systems, RAG, Qdrant, Gemini API, Groq, Cosine Similarity
<span class="term-highlight">[ML & DEEP LEARNING]:</span> PyTorch, Scikit-learn, CNNs, Computer Vision, Model Evaluation, NLP (spaCy, NLTK)
<span class="term-highlight">[FULL-STACK & BACKEND]:</span> React.js, Next.js 15, Node.js, Express.js, Flask, Redis, BullMQ, Socket.IO, PostgreSQL, MongoDB
<span class="term-highlight">[LANGUAGES]:</span> Python, JavaScript, TypeScript, C++, C, Java, HTML, CSS, SQL
<span class="term-highlight">[TOOLS & DEVOPS]:</span> Docker, Kubernetes, CI/CD, Git, GitHub, Linux, Power BI, Tableau
`,
    projects: () => `
<span class="term-highlight">1. AI Recruitment Organization (Multi-Agent Recruitment Platform)</span>
   Tech: Next.js 15, LangGraph, Qdrant, Groq API, React Flow
   Repo: <a href="https://github.com/dhairyamishra2003/AGENTICHIREAI" target="_blank" style="color:#00f2fe">github.com/dhairyamishra2003/AGENTICHIREAI</a>

<span class="term-highlight">2. AgentFlow AI (Agentic AI Operations Automation Platform)</span>
   Tech: React Flow, Node.js, PostgreSQL, Redis, BullMQ, Socket.IO
   Repo: <a href="https://github.com/dhairyamishra2003/agentflow-ai" target="_blank" style="color:#00f2fe">github.com/dhairyamishra2003/agentflow-ai</a>

<span class="term-highlight">3. AI-Powered Resume Builder (SDD, LLM & RAG)</span>
   Tech: React 19, Vite, LangGraph, Gemini API, 68-doc Vector Search

<span class="term-highlight">4. Automated Image Selection & Quality Assessment</span>
   Tech: Python, PyTorch, CNNs, Computer Vision (FODRIX)
`,
    experience: () => `
<span class="term-highlight">[ROLE]:</span> Machine Learning Intern
<span class="term-highlight">[COMPANY]:</span> FODRIX (Jan 2026 – May 2026)
<span class="term-highlight">[DETAILS]:</span>
  • Engineered a CNN-based deep learning system for automated image selection & quality assessment.
  • Developed and evaluated computer vision workflows for real-world image scoring.
  • Applied PyTorch, loss optimization, and feature engineering.
`,
    research: () => `
<span class="term-highlight">[TITLE]:</span> Multi-Agent Collaboration Systems Using Agentic AI for Intelligent Task Automation
<span class="term-highlight">[TYPE]:</span> Independent Research
<span class="term-highlight">[FOCUS]:</span> Autonomous task decomposition, agent memory protocols, fault-tolerant coordination, and decision-making pipelines.
`,
    education: () => `
<span class="term-highlight">[DEGREE]:</span> Bachelor of Technology (B.Tech) – Artificial Intelligence & Data Science
<span class="term-highlight">[INSTITUTE]:</span> AKS University, Satna, Madhya Pradesh (2023–2027)
<span class="term-highlight">[ACADEMIC STANDING]:</span> CGPA: 8.37 / 10.0
<span class="term-highlight">[SPECIALIZATION]:</span> CCBP 4.0 Academy – NxtWave (AI, Software Dev & Data Analytics)
`,
    certs: () => `
<span class="term-highlight">[CREDENTIALS]:</span>
  • AI Workflows & Automation Workshop Using Make.com (CCBP 4.0 Academy | 2026)
  • MCP Mega Workshop Project (CCBP 4.0 Academy | 2025)
  • LLMs & Agents (CCBP 4.0 Academy | 2025)
  • Introduction to Generative AI (CCBP 4.0 Academy | 2025)
  • Research Methodology (Udemy | Apr 2026)
`,
    contact: () => `
<span class="term-highlight">[EMAIL]:</span> <a href="mailto:dhairyam698@gmail.com" style="color:#00f2fe">dhairyam698@gmail.com</a>
<span class="term-highlight">[PHONE]:</span> <a href="tel:+916264516970" style="color:#00f2fe">+91 6264516970</a>
<span class="term-highlight">[LINKEDIN]:</span> <a href="https://linkedin.com/in/dhairya-mishra-" target="_blank" style="color:#00f2fe">linkedin.com/in/dhairya-mishra-</a>
<span class="term-highlight">[GITHUB]:</span> <a href="https://github.com/dhairyamishra2003" target="_blank" style="color:#00f2fe">github.com/dhairyamishra2003</a>
<span class="term-highlight">[LOCATION]:</span> Satna, Madhya Pradesh, India
`,
    resume: () => {
      const resumeModal = document.getElementById('resumeModal');
      if (resumeModal) {
        resumeModal.classList.add('open');
      }
      return `<span class="term-highlight">[SUCCESS]</span> Opening interactive resume viewer overlay...`;
    },
    "sudo hire": () => {
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      if (window.PortfolioSound) {
        window.PortfolioSound.playSuccess();
      }
      setTimeout(() => {
        window.location.href = "mailto:dhairyam698@gmail.com?subject=Excited%20to%20Hire%20You%20as%20AI%20Engineer&body=Hi%20Dhairya,%20we%20reviewed%20your%20portfolio%20and%20would%20love%20to%20schedule%20an%20interview!";
      }, 1000);
      return `<span style="color:#10b981;font-weight:bold;">[AUTHENTICATED] Elevating privileges... Outstanding candidate match found! Redirecting to mailto client for interview schedule.</span>`;
    },
    hire: () => commands["sudo hire"](),
    clear: () => {
      if (terminalScreen) terminalScreen.innerHTML = '';
      return '';
    }
  };

  function processCommand(rawInput) {
    const input = rawInput.trim().toLowerCase();
    if (!input) return;

    // Append user input
    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">dhairya@ai-cluster:~$</span> <span>${escapeHtml(rawInput)}</span>`;
    terminalScreen.appendChild(userLine);

    // Audio click
    if (window.PortfolioSound) {
      window.PortfolioSound.playKeypress();
    }

    let outputHtml = '';
    if (commands[input]) {
      outputHtml = typeof commands[input] === 'function' ? commands[input]() : commands[input];
    } else {
      outputHtml = `<span style="color:#f43f5e">bash: command not found: ${escapeHtml(input)}. Type <span class="term-highlight">help</span> to view valid commands.</span>`;
    }

    if (outputHtml) {
      const outputLine = document.createElement('div');
      outputLine.className = 'term-line output-text';
      outputLine.innerHTML = outputHtml;
      terminalScreen.appendChild(outputLine);
    }

    terminalScreen.scrollTop = terminalScreen.scrollHeight;
    terminalInput.value = '';
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  function initTerminal() {
    if (!terminalInput || !terminalScreen) return;

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        processCommand(terminalInput.value);
      }
    });

    if (terminalSubmit) {
      terminalSubmit.addEventListener('click', () => {
        processCommand(terminalInput.value);
      });
    }

    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        processCommand('help');
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        processCommand('clear');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initTerminal);
})();
