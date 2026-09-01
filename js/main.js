/**
 * Main Application Logic & UI Controllers
 * Dhairya Mishra - AI Engineer Portfolio
 */

// Import and initialize Three.js 3D visualization
import { initializeThreeJS } from './three-scene.js';

// Initialize 3D AI Core when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeThreeJS);
} else {
  initializeThreeJS();
}

// Global Web Audio Synthesizer (No external assets needed)
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
      // Audio autoplay policy fallback
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
  });

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
      title: "Multi-Agent Research & Recruitment System (AI Recruitment Organization)",
      github: "https://github.com/dhairyamishra2003/AGENTICHIREAI",
      content: `
        <div class="case-study-container">
          <div class="cs-section">
            <span class="cs-num">01 — Problem</span>
            <h4>High-Volume Candidate Screening Inefficiency</h4>
            <p>Traditional applicant tracking systems (ATS) rely on rigid keyword matching, rejecting qualified candidates with varied terminology while overwhelming recruiters with unstructured PDFs and manual interview scheduling.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">02 — Solution</span>
            <h4>Autonomous LangGraph Multi-Agent Orchestration</h4>
            <p>An end-to-end intelligent recruitment workflow orchestrated by specialized LLM agents that autonomously parse diverse resume formats, perform semantic vector similarity matching, formulate tailored technical interview questions, and manage candidate communications.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">03 — Architecture</span>
            <h4>System Topology & Inter-Agent Workflow</h4>
            <div class="cs-arch-diagram">
              <span class="cs-node">Input (Job Spec + Resumes)</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Planner Agent</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Resume Parser</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Qdrant Semantic Matcher</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Critic / Evaluator</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Synthesizer & Dispatcher</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">04 — Technology</span>
            <h4>Verified Production Stack</h4>
            <div class="cs-tech-tags">
              <span>LangGraph</span>
              <span>Python</span>
              <span>FastAPI</span>
              <span>Next.js 15</span>
              <span>React Flow</span>
              <span>Qdrant Vector DB</span>
              <span>Groq API</span>
              <span>MongoDB</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">05 — Engineering</span>
            <h4>Key Architectural Decisions</h4>
            <ul class="cs-list">
              <li><strong>Agent Orchestration:</strong> State graph architecture built in LangGraph with state persistence and conditional routing between parsing, scoring, and interviewing nodes.</li>
              <li><strong>Dense Vector Search:</strong> High-throughput embeddings indexed into Qdrant using cosine similarity to capture deep semantic relevance beyond surface-level keyword hits.</li>
              <li><strong>Live Recruiter Telemetry:</strong> Interactive node visualization with React Flow to monitor agent execution status, token usage, and match scores in real time.</li>
              <li><strong>API Architecture:</strong> Async RESTful endpoints in FastAPI with MongoDB persistence for candidate records and interview logs.</li>
            </ul>
          </div>

          <div class="cs-section">
            <span class="cs-num">06 — Results</span>
            <h4>Verifiable Technical Outcomes</h4>
            <div class="cs-results-grid">
              <div class="cs-result-card">
                <span class="res-num">4</span>
                <span class="res-lbl">Specialized AI Agents</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">100%</span>
                <span class="res-lbl">Automated PDF Parsing</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">Sub-sec</span>
                <span class="res-lbl">Qdrant Top-K Retrieval</span>
              </div>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">07 — Links</span>
            <div class="cs-links-row">
              <a href="https://github.com/dhairyamishra2003/AGENTICHIREAI" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <i data-lucide="github"></i> View GitHub Repository
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
            <h4>Agentic AI Fragility & Unhandled Execution Failures</h4>
            <p>Autonomous LLM pipelines often fail in production due to hallucinated tool arguments, rate limits, schema mismatch, or API timeouts, lacking built-in self-healing mechanisms and state persistence.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">02 — Solution</span>
            <h4>Planner-Executor-Validator-Recovery State Machine</h4>
            <p>A resilient multi-agent execution framework combining Redis/BullMQ task queue isolation, deterministic validation guards, automated exponential backoff jitter, and instant dead-letter recovery.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">03 — Architecture</span>
            <h4>Resilient Topology & Fault-Tolerant Loop</h4>
            <div class="cs-arch-diagram">
              <span class="cs-node">User Mission</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Planner Node (DAG)</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Executor (BullMQ)</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Validator (Schema Guard)</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Auto-Recovery Engine</span>
            </div>
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
              <span>Redis</span>
              <span>BullMQ</span>
              <span>Socket.IO</span>
              <span>JWT</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">05 — Engineering</span>
            <h4>Key Architectural Decisions</h4>
            <ul class="cs-list">
              <li><strong>Distributed Queueing:</strong> BullMQ backed by Redis for isolated task execution, worker concurrency control, and job retry backoff.</li>
              <li><strong>Validation Contracts:</strong> Strict JSON Schema checks on all agent tool outputs before committing results to state.</li>
              <li><strong>Self-Healing:</strong> Intercepts 429 / 500 status codes to dynamically route to secondary fallback LLM providers without dropping user session state.</li>
              <li><strong>Real-time Telemetry:</strong> Bidirectional Socket.IO pipelines streaming live state updates to an interactive React Flow canvas.</li>
            </ul>
          </div>

          <div class="cs-section">
            <span class="cs-num">06 — Results</span>
            <h4>Verifiable Technical Outcomes</h4>
            <div class="cs-results-grid">
              <div class="cs-result-card">
                <span class="res-num">4-Node</span>
                <span class="res-lbl">State Machine Topology</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">0 Loss</span>
                <span class="res-lbl">Task Queue Auto-Recovery</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">Live</span>
                <span class="res-lbl">Bidirectional WebSockets</span>
              </div>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">07 — Links</span>
            <div class="cs-links-row">
              <a href="https://github.com/dhairyamishra2003/agentflow-ai" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <i data-lucide="github"></i> View GitHub Repository
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
            <h4>Generic Resumes & Weak Quantifiable Impact</h4>
            <p>Job seekers frequently struggle with vague job descriptions, non-ATS compliant formats, and a lack of quantifiable metric-driven bullets that resonate with hiring benchmarks.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">02 — Solution</span>
            <h4>68-Chunk Vector RAG & 5 Agent Tools</h4>
            <p>An intelligent resume optimization suite powered by LangGraph, Google Gemini embeddings, and a specialized 68-chunk curated tech hiring benchmark knowledge base for real-time ATS scoring and STAR bullet generation.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">03 — Architecture</span>
            <h4>Vector RAG & Agent Tool Workflow</h4>
            <div class="cs-arch-diagram">
              <span class="cs-node">Resume Ingestion</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Gemini Vector Embeddings</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">68 Knowledge Chunks RAG</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">5 Agent Tools</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">ATS & STAR Synthesis</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">04 — Technology</span>
            <h4>Verified Production Stack</h4>
            <div class="cs-tech-tags">
              <span>React 19</span>
              <span>Vite</span>
              <span>Tailwind CSS</span>
              <span>LangGraph</span>
              <span>LangChain</span>
              <span>Gemini API</span>
              <span>MongoDB</span>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">05 — Engineering</span>
            <h4>Key Architectural Decisions</h4>
            <ul class="cs-list">
              <li><strong>Curated Vector Knowledge:</strong> 68 structured benchmark chunks indexed with Gemini vector embeddings and cosine similarity retrieval.</li>
              <li><strong>5 Specialized Agent Tools:</strong> Resume updates, STAR bullet transformation, ATS scoring benchmark, executive summary generation, and knowledge retrieval.</li>
              <li><strong>Schema-Driven Design (SDD):</strong> Structured JSON state schema driving React 19 UI updates and instant live preview rendering.</li>
            </ul>
          </div>

          <div class="cs-section">
            <span class="cs-num">06 — Results</span>
            <h4>Verifiable Technical Outcomes</h4>
            <div class="cs-results-grid">
              <div class="cs-result-card">
                <span class="res-num">68+</span>
                <span class="res-lbl">Vector Knowledge Chunks</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">5</span>
                <span class="res-lbl">Specialized Agent Tools</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">100%</span>
                <span class="res-lbl">STAR Bullet Compliance</span>
              </div>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">07 — Links</span>
            <div class="cs-links-row">
              <a href="https://github.com/dhairyamishra2003" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <i data-lucide="github"></i> View GitHub Profile
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
            <h4>Manual High-Volume Photo Curation Bottleneck</h4>
            <p>Professional photography and image collection pipelines suffer from severe time sinks when manually filtering blurry, low-contrast, or duplicate images across thousands of frames.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">02 — Solution</span>
            <h4>CNN Deep Learning Automated Quality Scoring</h4>
            <p>During the ML internship at FODRIX (Jan 2026 – May 2026), engineered an automated deep learning pipeline utilizing Convolutional Neural Networks (CNNs) in PyTorch to classify image clarity, aesthetic score, and compression artifacts.</p>
          </div>

          <div class="cs-section">
            <span class="cs-num">03 — Architecture</span>
            <h4>Computer Vision & Model Evaluation Pipeline</h4>
            <div class="cs-arch-diagram">
              <span class="cs-node">Image Batch Input</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">PyTorch Transforms</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">CNN Feature Extraction</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Loss Optimization</span>
              <span class="cs-arrow">➔</span>
              <span class="cs-node">Automated Quality Selection</span>
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
            <span class="cs-num">05 — Engineering</span>
            <h4>Key Architectural Decisions</h4>
            <ul class="cs-list">
              <li><strong>Custom CNN Architecture:</strong> Convolutional feature extraction layers tuned for sharpness gradients, edge clarity, and color balance.</li>
              <li><strong>Data Preprocessing & Augmentation:</strong> Normalization, random crops, and balanced batch sampling across edge cases.</li>
              <li><strong>Metric Evaluation:</strong> Rigorous validation with AUC-ROC curve analysis and confusion matrix threshold tuning.</li>
            </ul>
          </div>

          <div class="cs-section">
            <span class="cs-num">06 — Results</span>
            <h4>Verifiable Technical Outcomes</h4>
            <div class="cs-results-grid">
              <div class="cs-result-card">
                <span class="res-num">&gt;70%</span>
                <span class="res-lbl">Reduction in Manual Curation</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">Batch</span>
                <span class="res-lbl">High-Throughput Processing</span>
              </div>
              <div class="cs-result-card">
                <span class="res-num">PyTorch</span>
                <span class="res-lbl">Custom CNN Model</span>
              </div>
            </div>
          </div>

          <div class="cs-section">
            <span class="cs-num">07 — Links</span>
            <div class="cs-links-row">
              <a href="https://github.com/dhairyamishra2003" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                <i data-lucide="github"></i> View GitHub Profile
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

      // Open user's email client as seamless mailto fallback
      setTimeout(() => {
        const mailtoUrl = `mailto:dhairyam698@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;
        window.location.href = mailtoUrl;
      }, 1000);

      contactForm.reset();
    });
  }
});

// Toast Helper
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
