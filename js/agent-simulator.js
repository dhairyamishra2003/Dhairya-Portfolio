/**
 * Multi-Agent Workflow Simulator (LangGraph / AgentFlow Engine)
 * Dhairya Mishra Portfolio
 */

(function () {
  let isExecuting = false;

  const presets = {
    recruitment: {
      goal: "Screen 45 AI engineer applicants, compute semantic similarity via Qdrant, extract STAR bullets, and schedule shortlisting",
      steps: [
        {
          node: "node-planner",
          agent: "Planner Agent",
          status: "Decomposing task: [Parse PDFs] -> [Vector Embedding] -> [Qdrant Top-K Query] -> [Automated Shortlist Matrix]",
          log: "[PLANNER] Task decomposed into 4 sub-graphs. Initializing LangGraph state with candidate pool (N=45)."
        },
        {
          node: "node-executor",
          agent: "Executor Agent",
          status: "Invoking Groq API inference & Qdrant vector retrieval...",
          log: "[EXECUTOR] Vector cosine similarity computed. Identified 12 candidates with match score > 88%."
        },
        {
          node: "node-validator",
          agent: "Validator Agent",
          status: "Validating ATS keyword density & experience threshold...",
          log: "[VALIDATOR] Integrity check passed. Hallucination index: 0.002. Shortlist verified against Job Spec."
        },
        {
          node: "node-recovery",
          agent: "Recovery Agent",
          status: "Queue monitoring active. 0 failed worker jobs in BullMQ.",
          log: "[RECOVERY] All 45 candidate states committed to MongoDB. Dispatched 12 calendar invitations."
        }
      ]
    },
    resume: {
      goal: "Evaluate resume against 68-doc benchmark, score ATS metrics, generate 3 STAR bullets for LangGraph experience",
      steps: [
        {
          node: "node-planner",
          agent: "Planner Agent",
          status: "Formulating ATS gap analysis & prompt engineering chain...",
          log: "[PLANNER] Initializing 5 specialized tools: [ATS Scorer, STAR Generator, Skill Extractor, Doc Retrieval, Summary]."
        },
        {
          node: "node-executor",
          agent: "Executor Agent",
          status: "Executing Gemini embeddings vector search across 68 docs...",
          log: "[EXECUTOR] Retrieved 6 high-density context documents. Synthesized STAR bullet: 'Architected LangGraph multi-agent system improving pipeline throughput by 42%'."
        },
        {
          node: "node-validator",
          agent: "Validator Agent",
          status: "Running action-verb validation & quantifiable metric auditor...",
          log: "[VALIDATOR] ATS Score upgraded from 74/100 to 96/100. STAR format compliance: 100%."
        },
        {
          node: "node-recovery",
          agent: "Recovery Agent",
          status: "State verified & exported.",
          log: "[RECOVERY] JSON schema validated. Generated PDF export buffer ready for download."
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
          agent: "Executor Agent",
          status: "Encountered 429 Rate Limit from upstream LLM provider...",
          log: "[EXECUTOR] Warning: Rate limit on batch 4/10. Emitting error state to LangGraph router."
        },
        {
          node: "node-recovery",
          agent: "Recovery Agent",
          status: "Intercepting error event! Executing exponential backoff retry...",
          log: "[RECOVERY] Intercepted BullMQ failed job. Applying jittered backoff (t=1200ms) + switching to fallback Groq endpoint."
        },
        {
          node: "node-validator",
          agent: "Validator Agent",
          status: "Validating re-indexed vector payload...",
          log: "[VALIDATOR] All 100 batch tasks successfully completed with zero data loss. Self-healing achieved."
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
          log: "[PLANNER] Loading high-resolution image batch (N=200). Normalizing tensor tensors [C x H x W]."
        },
        {
          node: "node-executor",
          agent: "Executor Agent",
          status: "Passing images through CNN feature extraction layers...",
          log: "[EXECUTOR] Forward pass executed on GPU. Extracted clarity, sharpness, and aesthetic feature maps."
        },
        {
          node: "node-validator",
          agent: "Validator Agent",
          status: "Computing confusion matrix, AUC-ROC, and quality thresholds...",
          log: "[VALIDATOR] Model confidence: 94.6%. Filtered out 38 sub-quality blurry frames automatically."
        },
        {
          node: "node-recovery",
          agent: "Recovery Agent",
          status: "Batch processing finished.",
          log: "[RECOVERY] FODRIX CV Pipeline complete. Exported high-quality image dataset & metadata."
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
      btn.addEventListener('click', (e) => {
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
          consoleEl.innerHTML = `<code>[SYSTEM] Terminal logs cleared. Ready for next agent execution.</code>`;
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
    appendLog(`=== STARTING LANGGRAPH MULTI-AGENT STATE MACHINE ===`);
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
