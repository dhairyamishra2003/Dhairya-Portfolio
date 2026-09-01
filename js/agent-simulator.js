/**
 * Multi-Agent Workflow Simulator (LangGraph / AgentFlow Engine)
 * Dhairya Mishra Portfolio
 * Topology: User ➔ Planner Agent ➔ Research Agent ➔ Critic Agent ➔ Synthesizer
 */

(function () {
  let isExecuting = false;

  const presets = {
    recruitment: {
      goal: "Screen 45 AI engineer applicants, compute semantic score via Qdrant, extract STAR bullets, and schedule shortlisting",
      steps: [
        {
          node: "node-planner",
          agent: "Planner Agent",
          status: "Decomposing task: [Parse PDFs] ➔ [Vector Embedding] ➔ [Qdrant Top-K Query] ➔ [Shortlist Matrix]",
          log: "[PLANNER] Mission decomposed into 4 sub-graphs. Initializing LangGraph state with candidate pool (N=45)."
        },
        {
          node: "node-executor",
          agent: "Research Agent",
          status: "Invoking Groq API inference & Qdrant vector retrieval...",
          log: "[RESEARCHER] Dense vector cosine similarity computed. Retrieved 12 candidates matching job spec > 88%."
        },
        {
          node: "node-validator",
          agent: "Critic Agent",
          status: "Validating ATS keyword density & experience threshold...",
          log: "[CRITIC] Integrity check passed. Factuality confidence: 99.8%. Shortlist verified against Job Spec."
        },
        {
          node: "node-recovery",
          agent: "Synthesizer",
          status: "Synthesizing interview schedule & committing states.",
          log: "[SYNTHESIZER] Candidate evaluation matrix generated. Dispatched interview notifications & committed state."
        }
      ]
    },
    resume: {
      goal: "Evaluate resume against 68-chunk hiring benchmark, score ATS metrics, generate STAR bullets for LangGraph experience",
      steps: [
        {
          node: "node-planner",
          agent: "Planner Agent",
          status: "Formulating ATS gap analysis & prompt engineering chain...",
          log: "[PLANNER] Initializing 5 specialized tools: [ATS Scorer, STAR Generator, Skill Extractor, Doc Retrieval, Summary]."
        },
        {
          node: "node-executor",
          agent: "Research Agent",
          status: "Executing Gemini embeddings vector search across 68 docs...",
          log: "[RESEARCHER] Retrieved top 6 benchmark documents. Synthesized STAR bullet: 'Architected LangGraph multi-agent system improving pipeline throughput by 42%'."
        },
        {
          node: "node-validator",
          agent: "Critic Agent",
          status: "Running action-verb validation & quantifiable metric auditor...",
          log: "[CRITIC] ATS Score upgraded from 74/100 to 96/100. STAR format compliance validated at 100%."
        },
        {
          node: "node-recovery",
          agent: "Synthesizer",
          status: "State verified & exported.",
          log: "[SYNTHESIZER] Output schema validated. Produced formatted resume updates and exported JSON payload."
        }
      ]
    },
    recovery: {
      goal: "Simulate network timeout during heavy batch vector indexing and trigger BullMQ auto-retry workflow",
      steps: [
        {
          node: "node-planner",
          agent: "Planner Agent",
          status: "Spawning batch worker processes across Redis cluster...",
          log: "[PLANNER] Dispatching 100 parallel vector embedding tasks to BullMQ queue."
        },
        {
          node: "node-executor",
          agent: "Research Agent",
          status: "Encountered 429 Rate Limit on primary LLM endpoint...",
          log: "[RESEARCHER] Warning: Rate limit on batch 4/10. Emitting error signal to LangGraph router."
        },
        {
          node: "node-validator",
          agent: "Critic Agent",
          status: "Intercepting failure event! Evaluating fallback route...",
          log: "[CRITIC] Intercepted BullMQ failed job. Switching to fallback Groq inference endpoint with jittered backoff."
        },
        {
          node: "node-recovery",
          agent: "Synthesizer",
          status: "Re-indexed vector payload verified.",
          log: "[SYNTHESIZER] All 100 batch tasks successfully completed with zero data loss. Self-healing achieved."
        }
      ]
    },
    cv: {
      goal: "Run CNN deep learning inference pipeline for automated image quality assessment and blur detection",
      steps: [
        {
          node: "node-planner",
          agent: "Planner Agent",
          status: "Setting up PyTorch DataLoader and image preprocessing transforms...",
          log: "[PLANNER] Loading high-resolution image batch (N=200). Normalizing tensor batches [C x H x W]."
        },
        {
          node: "node-executor",
          agent: "Research Agent",
          status: "Passing images through CNN feature extraction layers...",
          log: "[RESEARCHER] Forward pass executed. Extracted clarity, sharpness, and aesthetic feature maps."
        },
        {
          node: "node-validator",
          agent: "Critic Agent",
          status: "Computing confusion matrix, AUC-ROC, and quality thresholds...",
          log: "[CRITIC] Model confidence: 94.6%. Filtered out 38 sub-quality blurry frames automatically."
        },
        {
          node: "node-recovery",
          agent: "Synthesizer",
          status: "Batch processing complete.",
          log: "[SYNTHESIZER] FODRIX CV Pipeline complete. Exported high-quality image dataset & metadata."
        }
      ]
    }
  };

  function initSimulator() {
    const runBtn = document.getElementById('runAgentBtn');
    const goalInput = document.getElementById('agentGoalInput');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const clearBtn = document.getElementById('clearLogBtn');

    if (!runBtn || !goalInput) return;

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const presetKey = btn.getAttribute('data-preset');
        if (presets[presetKey]) {
          goalInput.value = presets[presetKey].goal;
        }
      });
    });

    runBtn.addEventListener('click', () => {
      const activePreset = document.querySelector('.preset-btn.active');
      const presetKey = activePreset ? activePreset.getAttribute('data-preset') : 'recruitment';
      executeWorkflow(presetKey, goalInput.value);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const consoleEl = document.getElementById('agentConsoleOutput');
        if (consoleEl) {
          consoleEl.innerHTML = `<code>[SYSTEM] Terminal logs cleared. Topology: Planner ➔ Research ➔ Critic ➔ Synthesizer.</code>`;
        }
      });
    }
  }

  function appendLog(text) {
    const consoleEl = document.getElementById('agentConsoleOutput');
    if (!consoleEl) return;
    const time = new Date().toLocaleTimeString();
    consoleEl.innerHTML += `\n<code>[${time}] ${text}</code>`;
    consoleEl.scrollTop = consoleEl.scrollHeight;

    // Play subtle synthesized audio beep
    if (window.PortfolioSound) {
      window.PortfolioSound.playBlip(600 + Math.random() * 200);
    }
  }

  async function executeWorkflow(presetKey, userGoal) {
    if (isExecuting) return;
    isExecuting = true;

    const runBtn = document.getElementById('runAgentBtn');
    if (runBtn) {
      runBtn.disabled = true;
      runBtn.innerHTML = `<i data-lucide="loader-2" class="spin-icon"></i> <span>Orchestrating...</span>`;
      if (window.lucide) window.lucide.createIcons();
    }

    const workflow = presets[presetKey] || presets.recruitment;
    appendLog(`=== STARTING MULTI-AGENT STATE MACHINE ===`);
    appendLog(`MISSION: "${userGoal}"`);

    // Reset all nodes
    document.querySelectorAll('.agent-node').forEach(node => {
      node.classList.remove('active-node', 'success-node');
      const status = node.querySelector('.node-status');
      if (status) {
        status.setAttribute('data-state', 'idle');
        status.textContent = 'IDLE';
      }
    });

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];
      const nodeEl = document.getElementById(step.node);

      if (nodeEl) {
        // Highlight active node
        document.querySelectorAll('.agent-node').forEach(n => n.classList.remove('active-node'));
        nodeEl.classList.add('active-node');
        const status = nodeEl.querySelector('.node-status');
        if (status) {
          status.setAttribute('data-state', 'running');
          status.textContent = 'RUNNING';
        }
      }

      appendLog(`${step.log}`);

      // Wait between nodes
      await new Promise(r => setTimeout(r, 1100));

      if (nodeEl) {
        const status = nodeEl.querySelector('.node-status');
        if (status) {
          status.setAttribute('data-state', 'done');
          status.textContent = 'COMPLETED';
        }
        nodeEl.classList.add('success-node');
      }
    }

    appendLog(`=== WORKFLOW TERMINATED WITH SUCCESS (Exit Code 0) ===\n`);

    if (window.confetti) {
      window.confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00f2fe', '#8b5cf6', '#10b981']
      });
    }

    if (window.PortfolioSound) {
      window.PortfolioSound.playSuccess();
    }

    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = `<i data-lucide="zap"></i> <span>Execute Workflow</span>`;
      if (window.lucide) window.lucide.createIcons();
    }

    isExecuting = false;
  }

  document.addEventListener('DOMContentLoaded', initSimulator);
})();
