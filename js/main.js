/**
 * Main Application Logic & UI Controllers
 * Dhairya Mishra - AI Engineer Portfolio
 */

// Import and initialize Three.js 3D visualization and agent simulator
import { initializeThreeJS } from './three-scene.js';
import './agent-simulator.js';

// Initialize 3D AI Core when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThreeJS);
} else {
  initializeThreeJS();
}

// Global Web Audio Synthesizer (No external audio files needed)
window.PortfolioSound = (function () {
  let audioCtx = null;
  let isEnabled = true;

  function getContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playBlip(freq = 440, type = 'sine', duration = 0.08) {
    if (!isEnabled) return;
    try {
      const ctx = getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay fallback
    }
  }

  function playKeypress() {
    playBlip(320 + Math.random() * 80, 'triangle', 0.04);
  }

  function playSuccess() {
    if (!isEnabled) return;
    try {
      const ctx = getContext();
      if (!ctx) return;
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - High C
      freqs.forEach((f, idx) => {
        setTimeout(() => {
          playBlip(f, 'sine', 0.18);
        }, idx * 100);
      });
    } catch (e) {}
  }

  function toggle() {
    isEnabled = !isEnabled;
    return isEnabled;
  }

  return {
    playBlip,
    playKeypress,
    playSuccess,
    toggle,
    isEnabled: () => isEnabled
  };
})();

// DOM Initializations & UI Interactions
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Audio FX Toggle Button
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const state = window.PortfolioSound.toggle();
      const hudText = soundToggleBtn.querySelector('.hud-text');
      if (state) {
        soundToggleBtn.classList.remove('muted');
        if (hudText) hudText.textContent = 'Audio FX: ON';
        showToast('Audio effects enabled');
        window.PortfolioSound.playBlip(600);
      } else {
        soundToggleBtn.classList.add('muted');
        if (hudText) hudText.textContent = 'Audio FX: OFF';
        showToast('Audio effects muted');
      }
    });
  }

  // Navbar Scroll Shadow
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active Section ScrollSpy Indication
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // Mobile Navigation Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Skills Filtering Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetCategory = tab.getAttribute('data-category');

      skillCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (targetCategory === 'all' || cardCat === targetCategory || cardCat === 'all') {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      window.PortfolioSound.playBlip(500);
    });
  });

  // Resume Modal Open / Close (Supports all .open-resume-trigger buttons)
  const resumeModal = document.getElementById('resumeModal');
  const closeResumeModal = document.getElementById('closeResumeModal');
  const printResumeBtn = document.getElementById('printResumeBtn');

  document.querySelectorAll('.open-resume-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (resumeModal) {
        resumeModal.classList.add('open');
        window.PortfolioSound.playBlip(580);
      }
    });
  });

  if (closeResumeModal && resumeModal) {
    closeResumeModal.addEventListener('click', () => {
      resumeModal.classList.remove('open');
    });
  }
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('open');
      }
    });
  }
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Project Case Study Modal System (Strict 01-07 Structure)
  const projectModal = document.getElementById('projectModal');
  const closeProjectModal = document.getElementById('closeProjectModal');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectBody = document.getElementById('modalProjectBody');
  const modalProjectGithub = document.getElementById('modalProjectGithub');

  const projectCaseStudies = {
    recruitment: {
      title: "AI Recruitment Organization — Multi-Agent Recruitment Platform",
      github: "https://github.com/dhairyamishra2003/AGENTICHIREAI",
      content: `
        <div class="case-study-container">
          <div class="cs-section">
            <span class="cs-num">01 — Problem</span>
            <h4>High-Volume Candidate Screening & Manual Review Bottlenecks</h4>
            <p>Traditional candidate screening requires recruiters to manually parse hundreds of unstructured resume PDFs, match technical qualifications against job requirements, draft interview questions, and coordinate candidate communication.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">02 — Solution</span>
            <h4>Multi-Agent Autonomous Recruitment Platform</h4>
            <p>Designed and developed a scalable intelligent automation platform for candidate screening using multi-agent workflows, RAG, semantic search, and vector retrieval.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">03 — Architecture</span>
            <h4>End-to-End Multi-Agent Architecture</h4>
            <div class="cs-arch-diagram">
              <span class="cs-node">Candidate Resume</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Resume Parsing Agent</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Candidate Matching Agent</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Shortlisting Agent</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Interview Agent</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Email Automation</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">04 — Technology</span>
            <h4>Verified Production Stack</h4>
            <div class="cs-tech-tags">
              <span>Next.js 15</span>
              <span>Node.js</span>
              <span>Express.js</span>
              <span>MongoDB</span>
              <span>LangGraph</span>
              <span>LangChain</span>
              <span>Qdrant</span>
              <span>Groq API</span>
              <span>React Flow</span>
              <span>Tailwind CSS</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">05 — Implementation</span>
            <h4>Engineering & Implementation Highlights</h4>
            <ul class="cs-list">
              <li><strong>Specialized AI Agents:</strong> Engineered specialized AI agents for resume parsing, candidate matching, shortlisting, interviewing, and email automation using LangGraph.</li>
              <li><strong>RAG & Vector Retrieval:</strong> Implemented semantic search and dense vector retrieval using Qdrant vector database and Groq API high-throughput LLM inference.</li>
              <li><strong>REST APIs & Backend Services:</strong> Implemented REST APIs and backend services for candidate processing, workflow orchestration, authentication, and real-time execution.</li>
              <li><strong>Recruiter Dashboards:</strong> Developed recruiter dashboards for workflow visualization, analytics, candidate applications, and real-time execution monitoring using React Flow.</li>
            </ul>
          </div>

          <div class="cs-section">
            <span class="cs-num">06 — Results & Capabilities</span>
            <h4>Key Capabilities Delivered</h4>
            <div class="cs-results-grid">
              <div class="cs-result-card">
                <span class="res-num">5</span>
                <span class="res-lbl">Specialized AI Agents</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">Vector</span>
                <span class="res-lbl">Qdrant Semantic Matching</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">Real-Time</span>
                <span class="res-lbl">Execution Monitoring</span>
              </div>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">07 — Links</span>
            <div class="cs-links-row">
              <a href="https://github.com/dhairyamishra2003/AGENTICHIREAI" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <svg class="brand-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>View GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      `
    },
    agentflow: {
      title: "AgentFlow AI — Agentic AI Operations Automation Platform",
      github: "https://github.com/dhairyamishra2003/agentflow-ai",
      content: `
        <div class="case-study-container">
          <div class="cs-section">
            <span class="cs-num">01 — Problem</span>
            <h4>Uncontrolled LLM Failures & Lack of Fault-Tolerant Execution</h4>
            <p>Complex AI agent operations often suffer from unhandled execution failures, schema mismatches, rate limits, and an absence of real-time operator observability in autonomous multi-step pipelines.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">02 — Solution</span>
            <h4>Resilient Operations Automation Platform</h4>
            <p>An Agentic AI platform designed for intelligent workflow execution, validation, recovery, and real-time monitoring.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">03 — Architecture</span>
            <h4>State Machine & Infrastructure Topology</h4>
            <div class="cs-arch-diagram">
              <span class="cs-node">Planner</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Executor</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Validator</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Recovery</span>
            </div>
            <p style="margin-top: 10px; font-size: 0.85rem; color: #a1a1aa;"><strong>Infrastructure:</strong> Redis + BullMQ Queues + Socket.IO Bi-directional Streaming</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">04 — Technology</span>
            <h4>Verified Production Stack</h4>
            <div class="cs-tech-tags">
              <span>React</span>
              <span>React Flow</span>
              <span>Node.js</span>
              <span>Express.js</span>
              <span>PostgreSQL</span>
              <span>MongoDB</span>
              <span>Redis</span>
              <span>BullMQ</span>
              <span>Socket.IO</span>
              <span>JWT</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">05 — Implementation</span>
            <h4>Engineering & Implementation Highlights</h4>
            <ul class="cs-list">
              <li><strong>Planner–Executor–Validator–Recovery Architecture:</strong> Engineered multi-agent state machines with automated retries and fault-tolerant workflow execution.</li>
              <li><strong>Distributed Queueing:</strong> Isolated task execution using Redis and BullMQ queues with dead-letter queue recovery.</li>
              <li><strong>REST APIs & Authentication:</strong> Implemented secure REST APIs, JWT authentication, and backend services for AI-agent execution, orchestration, and real-time status tracking.</li>
              <li><strong>Real-Time Dashboard:</strong> Developed a real-time workflow dashboard using React Flow and Socket.IO for execution monitoring and operator notifications.</li>
            </ul>
          </div>

          <div class="cs-section">
            <span class="cs-num">06 — Results & Capabilities</span>
            <h4>Key Capabilities Delivered</h4>
            <div class="cs-results-grid">
              <div class="cs-result-card">
                <span class="res-num">4-Node</span>
                <span class="res-lbl">State Machine Topology</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">Auto-Retry</span>
                <span class="res-lbl">Fault-Tolerant Execution</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">Live</span>
                <span class="res-lbl">Socket.IO Dashboard</span>
              </div>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">07 — Links</span>
            <div class="cs-links-row">
              <a href="https://github.com/dhairyamishra2003/agentflow-ai" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <svg class="brand-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>View GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      `
    },
    "resume-builder": {
      title: "AI-Powered Resume Builder — Using SDD, LLM & RAG",
      github: "https://github.com/dhairyamishra2003",
      content: `
        <div class="case-study-container">
          <div class="cs-section">
            <span class="cs-num">01 — Problem</span>
            <h4>Generic Resumes & Sub-optimal ATS Keyword Alignment</h4>
            <p>Job applicants often struggle to align experience bullets with ATS benchmark standards, lack structured STAR formatting, and have difficulty identifying skill gaps against targeted role profiles.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">02 — Solution</span>
            <h4>SDD, LLM & Vector RAG Resume Intelligence</h4>
            <p>An AI-powered resume platform using LLMs, RAG, NLP, prompt engineering, and semantic search over curated benchmark knowledge bases.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">03 — Architecture</span>
            <h4>Assistant Flow & Knowledge Retrieval</h4>
            <div class="cs-arch-diagram">
              <span class="cs-node">Resume</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">LLM</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">LangGraph Assistant</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Resume Intelligence</span>
            </div>
            <div class="cs-arch-diagram" style="margin-top: 8px;">
              <span class="cs-node">Gemini Embeddings</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Semantic Search</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Vector Retrieval</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">68-Document Knowledge Base</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">04 — Technology</span>
            <h4>Verified Production Stack</h4>
            <div class="cs-tech-tags">
              <span>React 19</span>
              <span>Vite</span>
              <span>Tailwind CSS</span>
              <span>Node.js</span>
              <span>Express.js</span>
              <span>MongoDB</span>
              <span>LangChain</span>
              <span>LangGraph</span>
              <span>Google Gemini API</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">05 — Implementation</span>
            <h4>Engineering & Implementation Highlights</h4>
            <ul class="cs-list">
              <li><strong>5 Specialized Agent Tools:</strong> 1. Resume Updates, 2. STAR Bullet Generation, 3. ATS Scoring, 4. Summary Generation, and 5. Knowledge-base Search.</li>
              <li><strong>6 Specialized Retrieval Functions:</strong> ATS analysis, bullet generation, summary generation, resume review, job matching, and skill-gap analysis.</li>
              <li><strong>Vector RAG:</strong> Implemented semantic search and vector retrieval using Gemini embeddings and cosine similarity over a 68-document knowledge base.</li>
              <li><strong>Schema-Driven Design (SDD):</strong> Structured state schema ensuring instant React 19 UI updates and formatted resume exports.</li>
            </ul>
          </div>

          <div class="cs-section">
            <span class="cs-num">06 — Results & Capabilities</span>
            <h4>Key Capabilities Delivered</h4>
            <div class="cs-results-grid">
              <div class="cs-result-card">
                <span class="res-num">5</span>
                <span class="res-lbl">Specialized Agent Tools</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">68</span>
                <span class="res-lbl">Document RAG Knowledge Base</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">6</span>
                <span class="res-lbl">Retrieval Functions</span>
              </div>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">07 — Links</span>
            <div class="cs-links-row">
              <a href="https://github.com/dhairyamishra2003" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <svg class="brand-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>View GitHub Profile</span>
              </a>
            </div>
          </div>
        </div>
      `
    },
    fodrix: {
      title: "Automated Image Selection & Quality Assessment (FODRIX ML Internship)",
      github: "https://github.com/dhairyamishra2003",
      content: `
        <div class="case-study-container">
          <div class="cs-section">
            <span class="cs-num">01 — Problem</span>
            <h4>Manual High-Volume Photo Curation & Quality Filtering</h4>
            <p>Manual review and selection of thousands of high-resolution images in real-world workflows is time-intensive and inconsistent across varying blur, clarity, and compression artifacts.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">02 — Solution</span>
            <h4>Deep Learning CNN Quality Assessment Pipeline</h4>
            <p>During the ML internship at FODRIX (Jan 2026 – May 2026), engineered an automated deep learning pipeline utilizing Convolutional Neural Networks (CNNs) in PyTorch to assess image quality and clarity.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">03 — Architecture</span>
            <h4>Computer Vision & Model Evaluation Pipeline</h4>
            <div class="cs-arch-diagram">
              <span class="cs-node">Image Stream</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">PyTorch Preprocessing</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">CNN Feature Scoring</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Loss Optimization</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Quality Filter</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">04 — Technology</span>
            <h4>Verified Production Stack</h4>
            <div class="cs-tech-tags">
              <span>Python</span>
              <span>PyTorch</span>
              <span>CNNs</span>
              <span>Computer Vision</span>
              <span>Model Evaluation</span>
              <span>Scikit-Learn</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">05 — Implementation</span>
            <h4>Engineering & Implementation Highlights</h4>
            <ul class="cs-list">
              <li><strong>Deep Learning Architecture:</strong> Engineered a CNN-based deep learning system for automated image selection and quality assessment.</li>
              <li><strong>Real-World CV Workflows:</strong> Developed and evaluated image-quality assessment workflows for a real-world computer vision problem.</li>
              <li><strong>Model Evaluation:</strong> Applied Python, deep learning, and model evaluation techniques to image-quality assessment workflows.</li>
            </ul>
          </div>

          <div class="cs-section">
            <span class="cs-num">06 — Results & Capabilities</span>
            <h4>Key Capabilities Delivered</h4>
            <div class="cs-results-grid">
              <div class="cs-result-card">
                <span class="res-num">CNN</span>
                <span class="res-lbl">Deep Learning Pipeline</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">PyTorch</span>
                <span class="res-lbl">Batch Preprocessing</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">Automated</span>
                <span class="res-lbl">Quality Assessment</span>
              </div>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">07 — Links</span>
            <div class="cs-links-row">
              <a href="https://github.com/dhairyamishra2003" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <svg class="brand-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>View GitHub Profile</span>
              </a>
            </div>
          </div>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalKey = btn.getAttribute('data-modal');
      const data = projectCaseStudies[modalKey];
      if (data && projectModal) {
        modalProjectTitle.textContent = data.title;
        modalProjectBody.innerHTML = data.content;
        modalProjectGithub.href = data.github;
        projectModal.classList.add('open');
        window.PortfolioSound.playBlip(550);
        if (window.lucide) window.lucide.createIcons();
      }
    });
  });

  if (closeProjectModal && projectModal) {
    closeProjectModal.addEventListener('click', () => {
      projectModal.classList.remove('open');
    });
  }
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('open');
      }
    });
  }

  // Keyboard Navigation: Escape key closes any active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (resumeModal && resumeModal.classList.contains('open')) {
        resumeModal.classList.remove('open');
      }
      if (projectModal && projectModal.classList.contains('open')) {
        projectModal.classList.remove('open');
      }
    }
  });

  // Copy to Clipboard Utility
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = btn.getAttribute('data-copy');
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied to clipboard: ${text}`);
          window.PortfolioSound.playSuccess();
        });
      }
    });
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value;

      showToast(`Thank you, ${name}! Preparing email client...`);
      window.PortfolioSound.playSuccess();

      if (window.confetti) {
        window.confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.7 }
        });
      }

      // Open user's email client as mailto fallback
      setTimeout(() => {
        const mailtoUrl = `mailto:dhairyam698@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        window.location.href = mailtoUrl;
      }, 1000);

      contactForm.reset();
    });
  }
});

// Toast Notification Helper
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const toastMsg = toast.querySelector('.toast-msg');
  if (toastMsg) toastMsg.textContent = msg;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
