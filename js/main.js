/**
 * Main Application Logic & UI Controllers
 * Dhairya Mishra - AI Engineer Portfolio
 */

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
  const soundIcon = document.getElementById('soundIcon');
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

  // Resume Modal Open / Close
  const resumeModal = document.getElementById('resumeModal');
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const closeResumeModal = document.getElementById('closeResumeModal');
  const printResumeBtn = document.getElementById('printResumeBtn');

  if (viewResumeBtn && resumeModal) {
    viewResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('open');
      window.PortfolioSound.playBlip(580);
    });
  }
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

  // Project Deep Dive Modal System
  const projectModal = document.getElementById('projectModal');
  const closeProjectModal = document.getElementById('closeProjectModal');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectBody = document.getElementById('modalProjectBody');
  const modalProjectGithub = document.getElementById('modalProjectGithub');

  const projectDetails = {
    recruitment: {
      title: "AI Recruitment Organization — Multi-Agent Architecture",
      github: "https://github.com/dhairyamishra2003/AGENTICHIREAI",
      content: `
        <div style="line-height:1.7;">
          <h4 style="color:#00f2fe; margin-bottom:12px;">System Architecture & LangGraph Design</h4>
          <p style="color:#cbd5e1; margin-bottom:16px;">
            The platform is built on an asynchronous multi-agent pipeline using <strong>Next.js 15</strong>, <strong>LangGraph</strong>, and <strong>Qdrant Vector Database</strong>. 
            It autonomously executes end-to-end recruitment screening by orchestrating specialized agent roles:
          </p>
          <ul style="color:#94a3b8; margin-left:20px; margin-bottom:20px;">
            <li><strong>Parsing Agent:</strong> Ingests diverse resume formats (PDF, DOCX) and normalizes candidate skills, experience, and project metrics into structured schemas.</li>
            <li><strong>Semantic Matching Agent:</strong> Performs dense vector embeddings via Groq high-throughput inference and queries Qdrant with cosine similarity.</li>
            <li><strong>Interview Orchestrator Agent:</strong> Generates tailored technical questions based on candidate skill gaps and job requirements.</li>
            <li><strong>Communication Agent:</strong> Automates personalized feedback and interview scheduling.</li>
          </ul>
          <h4 style="color:#00f2fe; margin-bottom:8px;">Recruiter Dashboard & Telemetry</h4>
          <p style="color:#cbd5e1;">
            Features an interactive node graph built with <strong>React Flow</strong>, enabling recruiters to inspect live agent execution states, token metrics, and candidate match scores in real time.
          </p>
        </div>
      `
    },
    agentflow: {
      title: "AgentFlow AI — Operations Automation Architecture",
      github: "https://github.com/dhairyamishra2003/agentflow-ai",
      content: `
        <div style="line-height:1.7;">
          <h4 style="color:#00f2fe; margin-bottom:12px;">Planner-Executor-Validator-Recovery State Machine</h4>
          <p style="color:#cbd5e1; margin-bottom:16px;">
            AgentFlow AI addresses real-world enterprise AI failure modes through a fault-tolerant multi-agent topology:
          </p>
          <ul style="color:#94a3b8; margin-left:20px; margin-bottom:20px;">
            <li><strong>Planner:</strong> Breaks high-level user missions into Directed Acyclic Graphs (DAGs) of interdependent sub-tasks.</li>
            <li><strong>Executor:</strong> Consumes tasks from <strong>Redis / BullMQ</strong> queues and executes tool calls with isolated sandboxing.</li>
            <li><strong>Validator:</strong> Checks outputs against schema bounds, factuality benchmarks, and execution contracts.</li>
            <li><strong>Recovery Agent:</strong> Automatically intercepts failed workers, applies exponential backoff jitter, switches fallback LLM providers, and triggers dead-letter queues.</li>
          </ul>
          <h4 style="color:#00f2fe; margin-bottom:8px;">Real-Time WebSockets & Telemetry</h4>
          <p style="color:#cbd5e1;">
            Live bidirectional status tracking with <strong>Socket.IO</strong>, <strong>PostgreSQL</strong> relational storage, and <strong>JWT</strong> security.
          </p>
        </div>
      `
    },
    "resume-builder": {
      title: "AI-Powered Resume Builder — SDD & Vector RAG",
      github: "https://github.com/dhairyamishra2003",
      content: `
        <div style="line-height:1.7;">
          <h4 style="color:#00f2fe; margin-bottom:12px;">68-Document Knowledge Base & 5 Agent Tools</h4>
          <p style="color:#cbd5e1; margin-bottom:16px;">
            Built with <strong>React 19</strong>, <strong>Vite</strong>, and <strong>LangGraph</strong>, integrating the <strong>Google Gemini API</strong> for semantic vector embeddings:
          </p>
          <ul style="color:#94a3b8; margin-left:20px; margin-bottom:20px;">
            <li><strong>ATS Scoring Tool:</strong> Benchmarks resumes against top-tier tech industry standards and returns actionable grading.</li>
            <li><strong>STAR Bullet Generator:</strong> Transforms passive descriptions into high-impact Situation-Task-Action-Result bullet points.</li>
            <li><strong>Vector Retrieval Engine:</strong> Queries 68 curated hiring benchmarks using cosine similarity to recommend relevant tech keywords.</li>
          </ul>
        </div>
      `
    },
    fodrix: {
      title: "FODRIX ML Internship — CNN Image Quality Assessment",
      github: "https://github.com/dhairyamishra2003",
      content: `
        <div style="line-height:1.7;">
          <h4 style="color:#00f2fe; margin-bottom:12px;">Computer Vision & Automated Selection</h4>
          <p style="color:#cbd5e1; margin-bottom:16px;">
            During the Machine Learning internship at <strong>FODRIX</strong> (Jan 2026 – May 2026), engineered an automated deep learning pipeline for high-throughput image evaluation:
          </p>
          <ul style="color:#94a3b8; margin-left:20px; margin-bottom:20px;">
            <li><strong>CNN Architecture:</strong> Custom PyTorch convolutional network trained to score clarity, aesthetic balance, and detect compression artifacts.</li>
            <li><strong>Data Preprocessing:</strong> Data augmentation, normalization, and balanced class sampling for robust evaluation.</li>
            <li><strong>Performance Evaluation:</strong> Optimized AUC-ROC metrics and reduced manual photo curation time by over 70%.</li>
          </ul>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalKey = btn.getAttribute('data-modal');
      const data = projectDetails[modalKey];
      if (data && projectModal) {
        modalProjectTitle.textContent = data.title;
        modalProjectBody.innerHTML = data.content;
        modalProjectGithub.href = data.github;
        projectModal.classList.add('open');
        window.PortfolioSound.playBlip(550);
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

      showToast(`Thank you, ${name}! Generating direct message...`);
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
      }, 1200);

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
