/**
 * Three.js 3D Interactive AI Core Visualization (ES6 Module)
 * Dhairya Mishra Portfolio
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let neuralGroup, agentGroup, vectorGroup;
let coreMesh, outerParticles, innerWireframe, connectionLines;
let agentNodes = [];
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let currentMode = 'neural';
let isInitialized = false;
let animationFrameId = null;
let clock = null;

function init() {
  if (isInitialized) {
    console.warn('Three.js scene already initialized');
    return;
  }

  const container = document.getElementById('canvas3d-container');
  if (!container) {
    console.warn('Canvas container #canvas3d-container not found');
    return;
  }

  try {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const webglSupported = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('webgl2')));
    if (!webglSupported) {
      console.warn('WebGL not supported, skipping 3D visualization');
      container.innerHTML = '<p style="color: #888; padding: 20px; text-align: center;">3D visualization requires WebGL support</p>';
      return;
    }

    // Scene & Deep Dark Fog
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030306, 0.0025);

    // Camera with container aspect ratio
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 120;

    // Renderer with proper sizing
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.sortObjects = false;
    container.innerHTML = ''; // Clear any error messages
    container.appendChild(renderer.domElement);

    // Orbit Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 50;
    controls.maxDistance = 250;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enablePan = false;
    controls.enableRotate = true;

    // Prevent scroll zoom from scrolling page
    renderer.domElement.addEventListener('wheel', (e) => {
      if (controls.isZooming || e.deltaY !== 0) {
        e.preventDefault();
      }
    }, { passive: false });

    // Balanced Subtle Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0x00f2fe, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f2fe, 1.2, 200);
    pointLight1.position.set(50, 50, 50);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.2, 200);
    pointLight2.position.set(-50, -50, 50);
    scene.add(pointLight2);

    // Groups
    neuralGroup = new THREE.Group();
    agentGroup = new THREE.Group();
    vectorGroup = new THREE.Group();

    scene.add(neuralGroup);
    scene.add(agentGroup);
    scene.add(vectorGroup);

    buildNeuralBrain();
    buildAgentNodes();
    buildVectorCloud();

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    setupModeButtons();
    
    clock = new THREE.Clock();
    isInitialized = true;
    
    animate();
  } catch (error) {
    console.error('Three.js initialization failed:', error);
    container.innerHTML = '<p style="color: #888; padding: 20px; text-align: center;">3D visualization unavailable</p>';
  }
}

// 1. Neural Brain Visualization
function buildNeuralBrain() {
  // Inner Pulsing Core
  const coreGeo = new THREE.IcosahedronGeometry(18, 2);
  const coreMat = new THREE.MeshPhongMaterial({
    color: 0x00f2fe,
    emissive: 0x005577,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  coreMesh = new THREE.Mesh(coreGeo, coreMat);
  neuralGroup.add(coreMesh);

  // Inner Solid Glow Sphere
  const innerGeo = new THREE.SphereGeometry(12, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x7928ca,
    transparent: true,
    opacity: 0.2,
  });
  const innerGlow = new THREE.Mesh(innerGeo, innerMat);
  neuralGroup.add(innerGlow);

  // Outer Floating Particles (Neural Synapses)
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const color1 = new THREE.Color(0x00f2fe);
  const color2 = new THREE.Color(0x8b5cf6);

  for (let i = 0; i < particleCount; i++) {
    const radius = 35 + Math.random() * 25;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    const mixedColor = color1.clone().lerp(color2, Math.random());
    particleColors[i * 3] = mixedColor.r;
    particleColors[i * 3 + 1] = mixedColor.g;
    particleColors[i * 3 + 2] = mixedColor.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });

  outerParticles = new THREE.Points(particleGeo, particleMat);
  neuralGroup.add(outerParticles);

  // Interconnecting Synapse Lines
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x4facfe,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });

  const linePositions = [];
  for (let i = 0; i < 30; i++) {
    const idx1 = Math.floor(Math.random() * particleCount);
    const idx2 = Math.floor(Math.random() * particleCount);

    linePositions.push(
      particlePositions[idx1 * 3], particlePositions[idx1 * 3 + 1], particlePositions[idx1 * 3 + 2],
      particlePositions[idx2 * 3], particlePositions[idx2 * 3 + 1], particlePositions[idx2 * 3 + 2]
    );
  }

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  connectionLines = new THREE.LineSegments(lineGeo, lineMat);
  neuralGroup.add(connectionLines);
}

// 2. Orbiting Multi-Agent Node Clusters
function buildAgentNodes() {
  const agentRoles = [
    { name: 'Planner', color: 0x00f2fe, radius: 55, speed: 0.012, offset: 0 },
    { name: 'Executor', color: 0x8b5cf6, radius: 68, speed: -0.01, offset: Math.PI / 2 },
    { name: 'Validator', color: 0x10b981, radius: 80, speed: 0.008, offset: Math.PI },
    { name: 'Recovery', color: 0xf59e0b, radius: 92, speed: -0.006, offset: (3 * Math.PI) / 2 }
  ];

  agentRoles.forEach(role => {
    const nodeGeo = new THREE.OctahedronGeometry(4, 0);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: role.color,
      emissive: role.color,
      emissiveIntensity: 0.6,
      wireframe: false
    });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);

    // Trailing Orbit Ring
    const ringGeo = new THREE.RingGeometry(role.radius - 0.2, role.radius + 0.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: role.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2 + (role.offset * 0.2);

    agentGroup.add(ringMesh);
    agentGroup.add(nodeMesh);

    agentNodes.push({
      mesh: nodeMesh,
      role: role
    });
  });
}

// 3. Vector Cloud (Representing 68 Knowledge Base Chunks & Embeddings)
function buildVectorCloud() {
  const vectorCount = 68;
  const vGeo = new THREE.BufferGeometry();
  const vPositions = new Float32Array(vectorCount * 3);

  for (let i = 0; i < vectorCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 40 + Math.random() * 35;

    vPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    vPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    vPositions[i * 3 + 2] = r * Math.cos(phi);
  }

  vGeo.setAttribute('position', new THREE.BufferAttribute(vPositions, 3));
  const vMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 3.5,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const vPoints = new THREE.Points(vGeo, vMat);
  vectorGroup.add(vPoints);
}

function setupModeButtons() {
  const buttons = document.querySelectorAll('.scene-mode-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      buttons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const mode = e.target.getAttribute('data-mode');
      setVisualizationMode(mode);
    });
  });
}

function setVisualizationMode(mode) {
  currentMode = mode;
  if (mode === 'neural') {
    neuralGroup.visible = true;
    agentGroup.visible = true;
    vectorGroup.visible = false;
    if (controls) controls.autoRotateSpeed = 0.8;
  } else if (mode === 'agentic') {
    neuralGroup.visible = false;
    agentGroup.visible = true;
    vectorGroup.visible = true;
    if (controls) controls.autoRotateSpeed = 1.4;
  } else if (mode === 'vector') {
    neuralGroup.visible = false;
    agentGroup.visible = false;
    vectorGroup.visible = true;
    if (controls) controls.autoRotateSpeed = 0.4;
  }
}

function onWindowResize() {
  const container = document.getElementById('canvas3d-container');
  if (!container || !renderer) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  windowHalfX = width / 2;
  windowHalfY = height / 2;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 0.05;
  mouseY = (event.clientY - windowHalfY) * 0.05;
}

function animate() {
  if (!isInitialized) return;

  animationFrameId = requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  // Smooth mouse parallax
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;

  if (coreMesh) {
    coreMesh.rotation.x = elapsedTime * 0.2;
    coreMesh.rotation.y = elapsedTime * 0.3;
    const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
    coreMesh.scale.set(scale, scale, scale);
  }

  if (outerParticles) {
    outerParticles.rotation.y = -elapsedTime * 0.08;
    outerParticles.rotation.z = elapsedTime * 0.04;
  }

  if (connectionLines) {
    connectionLines.rotation.y = -elapsedTime * 0.08;
    connectionLines.rotation.z = elapsedTime * 0.04;
  }

  // Orbiting agent nodes
  agentNodes.forEach(item => {
    const angle = elapsedTime * item.role.speed * 20 + item.role.offset;
    item.mesh.position.x = Math.cos(angle) * item.role.radius;
    item.mesh.position.z = Math.sin(angle) * item.role.radius;
    item.mesh.position.y = Math.sin(angle * 2) * 12;
    item.mesh.rotation.x += 0.02;
    item.mesh.rotation.y += 0.03;
  });

  if (vectorGroup) {
    vectorGroup.rotation.y = elapsedTime * 0.05;
  }

  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

function cleanup() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('mousemove', onDocumentMouseMove);
  if (renderer) {
    renderer.dispose();
  }
}

// Export initialization function
export function initializeThreeJS() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

export function disposeThreeJS() {
  cleanup();
  isInitialized = false;
}

export { setVisualizationMode };
