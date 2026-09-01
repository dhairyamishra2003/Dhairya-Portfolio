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
  • <span class="term-highlight">whoami</span>       - Display engineer identity
  • <span class="term-highlight">role</span>         - Primary engineering specialization
  • <span class="term-highlight">focus</span>        - Core technical focus areas
  • <span class="term-highlight">stack</span>        - Quick technology stack overview
  • <span class="term-highlight">about</span>        - Concise professional introduction
  • <span class="term-highlight">skills</span>       - List all technical skills & ML/AI frameworks
  • <span class="term-highlight">projects</span>     - Display verified AI systems with architecture & repos
  • <span class="term-highlight">experience</span>   - View machine learning internship details
  • <span class="term-highlight">research</span>     - Read about Independent Multi-Agent Research & Experiments
  • <span class="term-highlight">education</span>    - Check academic degree & CGPA
  • <span class="term-highlight">certs</span>        - View certified technical credentials
  • <span class="term-highlight">contact</span>      - Get email, phone, and LinkedIn coordinates
  • <span class="term-highlight">resume</span>       - Open interactive resume viewer
  • <span class="term-highlight">sudo hire</span>    - Fast-track interview / hiring request
  • <span class="term-highlight">clear</span>        - Clear the terminal screen
`,
    whoami: () => `
<span class="term-highlight">Dhairya Mishra</span>
AI Engineer & Generative AI Specialist | Satna, MP, India
`,
    role: () => `
<span class="term-highlight">AI Engineer / GenAI Developer</span>
Specializing in LLMs, RAG systems, Multi-Agent Workflows (LangGraph), and Full-Stack AI.
`,
    focus: () => `
<span class="term-highlight">LLMs • RAG • Agentic AI</span>
Building production-ready autonomous workflows, vector similarity search, and scalable backend platforms.
`,
    stack: () => `
<span class="term-highlight">Python • Java • React • FastAPI • Next.js 15 • LangGraph • Qdrant • PyTorch</span>
`,
    about: () => `
<span class="term-highlight">ABOUT DHAIRYA:</span>
AI Engineer with hands-on experience building Generative AI, LLM, RAG, multi-agent, and machine learning systems. Experienced in Python, LangChain, LangGraph, Qdrant vector retrieval, Computer Vision (CNNs), and full-stack development using React, Next.js, and FastAPI.
`,
    skills: () => `
<span class="term-highlight">[AI / GENERATIVE AI]:</span> LLMs, RAG, Prompt Engineering, Agentic AI, LangGraph, LangChain, Vector Search, Embeddings, Qdrant, Cosine Similarity, PyTorch, CNNs
<span class="term-highlight">[PROGRAMMING]:</span> Python, Java, JavaScript, TypeScript, C++, C, SQL
<span class="term-highlight">[BACKEND]:</span> FastAPI, Node.js, Express.js, Flask, REST APIs, JWT Authentication, Redis, BullMQ, Socket.IO
<span class="term-highlight">[FRONTEND]:</span> React, Next.js 15, HTML5, CSS3, Tailwind CSS, React Flow
<span class="term-highlight">[DATA]:</span> SQL, PostgreSQL, MongoDB, Pandas, NumPy, Data Analytics
<span class="term-highlight">[TOOLS / INFRASTRUCTURE]:</span> Git, GitHub, Docker, CI/CD, Cloud / Deployment, Linux
`,
    projects: () => `
<span class="term-highlight">1. Multi-Agent Research & Recruitment System (AI Recruitment Organization)</span>
   Stack: LangGraph, Python, FastAPI, React, PostgreSQL, Qdrant, Groq API
   Architecture: Input ➔ Planner ➔ Researcher ➔ Critic ➔ Synthesizer
   Repo: <a href="https://github.com/dhairyamishra2003/AGENTICHIREAI" target="_blank" style="color:#00f2fe">github.com/dhairyamishra2003/AGENTICHIREAI</a>

<span class="term-highlight">2. AgentFlow AI (Agentic AI Operations Automation Platform)</span>
   Stack: React Flow, Node.js, PostgreSQL, Redis, BullMQ, Socket.IO
   Architecture: Task Queue ➔ Planner ➔ Executor ➔ Validator ➔ Auto-Recovery
   Repo: <a href="https://github.com/dhairyamishra2003/agentflow-ai" target="_blank" style="color:#00f2fe">github.com/dhairyamishra2003/agentflow-ai</a>

<span class="term-highlight">3. AI-Powered Resume Builder (SDD, LLM & RAG)</span>
   Stack: React 19, Vite, Tailwind CSS, LangGraph, Gemini API, 68-Doc Vector RAG
   Repo: <a href="https://github.com/dhairyamishra2003" target="_blank" style="color:#00f2fe">github.com/dhairyamishra2003</a>

<span class="term-highlight">4. Automated Image Selection & Quality Assessment (FODRIX)</span>
   Stack: Python, PyTorch, CNNs, Computer Vision, Scikit-Learn
   Repo: <a href="https://github.com/dhairyamishra2003" target="_blank" style="color:#00f2fe">github.com/dhairyamishra2003</a>
`,
    experience: () => `
<span class="term-highlight">[ROLE]:</span> Machine Learning Intern
<span class="term-highlight">[COMPANY]:</span> FODRIX (Jan 2026 – May 2026)
<span class="term-highlight">[BULLETS]:</span>
  • Engineered a Convolutional Neural Network (CNN) based deep learning pipeline using PyTorch to evaluate image clarity and aesthetic quality, reducing manual photo filtering time.
  • Developed end-to-end computer vision workflows for automated photo quality scoring and blur artifact detection across high-resolution image batches.
  • Applied Python, loss optimization, and model evaluation metrics (AUC-ROC, Confusion Matrix).
`,
    research: () => `
<span class="term-highlight">[TITLE]:</span> Multi-Agent Collaboration Systems Using Agentic AI for Intelligent Task Automation
<span class="term-highlight">[TYPE]:</span> Independent Research & Architectural Experiments
<span class="term-highlight">[FOCUS]:</span> Autonomous task decomposition, agent memory protocols, fault-tolerant coordination, and decision-making pipelines.
`,
    education: () => `
<span class="term-highlight">[DEGREE]:</span> Bachelor of Technology (B.Tech) – Artificial Intelligence & Data Science
<span class="term-highlight">[INSTITUTE]:</span> AKS University, Satna, Madhya Pradesh (2023–2027)
<span class="term-highlight">[ACADEMICS]:</span> CGPA: 8.37 / 10.0
<span class="term-highlight">[ACADEMY]:</span> CCBP 4.0 Academy – NxtWave (AI, Software Dev & Data Analytics)
`,
    certs: () => `
<span class="term-highlight">[CREDENTIALS]:</span>
  • AI Workflows & Automation Workshop Using Make.com (CCBP 4.0 Academy | 2026)
  • MCP Mega Workshop Project (CCBP 4.0 Academy | 2025)
  • LLMs & Agents (CCBP 4.0 Academy | 2025)
  • Introduction to Generative AI (CCBP 4.0 Academy | 2025)
  • Introduction to Databases (CCBP 4.0 Academy | 2025)
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
        window.location.href = "mailto:dhairyam698@gmail.com?subject=Excited%20to%20Connect%20for%20AI%20Engineer%20Role&body=Hi%20Dhairya,%20we%20reviewed%20your%20portfolio%20and%20would%20love%20to%20schedule%20a%20discussion!";
      }, 1000);
      return `<span style="color:#10b981;font-weight:bold;">[AUTHENTICATED] Elevating privileges... Outstanding candidate match found! Redirecting to mailto client.</span>`;
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
