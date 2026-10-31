'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useDocuMorphStore } from '@/store/useDocuMorphStore';
import { ServiceNodeData, NodeType } from '@/types/documorph';
import {
  RotateCw,
  Zap,
  Maximize2,
  Layers,
  Globe,
  Radio,
  Server,
  Cpu,
  Activity,
  ArrowRight,
} from 'lucide-react';

type LayoutMode = 'tiered' | 'orbital' | 'constellation';

interface Node3DObject {
  mesh: THREE.Group;
  data: ServiceNodeData;
  targetPos: THREE.Vector3;
  currentPos: THREE.Vector3;
  satellites?: THREE.Mesh[];
  rings?: THREE.Mesh[];
}

interface Edge3DObject {
  curve: THREE.QuadraticBezierCurve3;
  line: THREE.Line;
  sourceId: string;
  targetId: string;
}

interface Packet3D {
  curve: THREE.QuadraticBezierCurve3;
  mesh: THREE.Mesh;
  progress: number;
  speed: number;
  color: THREE.Color;
}

const getNodeTheme = (type: NodeType) => {
  switch (type) {
    case 'gateway':
      return { hex: 0x00f0ff, css: '#00f0ff', label: 'Edge Gateway' };
    case 'ai_agent':
      return { hex: 0xff007f, css: '#ff007f', label: 'AI Agent' };
    case 'database':
      return { hex: 0x10b981, css: '#10b981', label: 'Database' };
    case 'queue':
      return { hex: 0xf59e0b, css: '#f59e0b', label: 'Message Queue' };
    case 'cache':
      return { hex: 0x06b6d4, css: '#06b6d4', label: 'Memory Cache' };
    case 'auth':
      return { hex: 0xa855f7, css: '#a855f7', label: 'Auth Gateway' };
    case 'service':
    default:
      return { hex: 0x6366f1, css: '#6366f1', label: 'Microservice' };
  }
};

export const HologramCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    activeTemplate,
    setSelectedNode,
    setSelectedEndpoint,
  } = useDocuMorphStore();

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('tiered');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<{
    data: ServiceNodeData;
    screenX: number;
    screenY: number;
  } | null>(null);

  const [stats, setStats] = useState({ nodesCount: 0, edgesCount: 0, fps: 60 });

  // Refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const nodesMapRef = useRef<Map<string, Node3DObject>>(new Map());
  const edgesListRef = useRef<Edge3DObject[]>([]);
  const packetsListRef = useRef<Packet3D[]>([]);
  const burstActiveRef = useRef<boolean>(false);

  // Compute Layout Positions in 3D Space
  const computedPositions = useMemo(() => {
    const positions = new Map<string, THREE.Vector3>();
    const nodes = activeTemplate.nodes;
    const total = nodes.length;

    if (layoutMode === 'tiered') {
      const gateways = nodes.filter((n) => n.data.nodeType === 'gateway' || n.data.nodeType === 'auth');
      const services = nodes.filter((n) => n.data.nodeType === 'service' || n.data.nodeType === 'ai_agent');
      const dataNodes = nodes.filter((n) => n.data.nodeType === 'database' || n.data.nodeType === 'queue' || n.data.nodeType === 'cache');

      const positionTier = (tierNodes: typeof nodes, y: number, zOffset: number) => {
        const count = tierNodes.length;
        tierNodes.forEach((node, i) => {
          const x = (i - (count - 1) / 2) * 20;
          positions.set(node.id, new THREE.Vector3(x, y, zOffset + (i % 2 === 0 ? 3 : -3)));
        });
      };

      positionTier(gateways, 14, -8);
      positionTier(services, 0, 0);
      positionTier(dataNodes, -14, 8);
    } else if (layoutMode === 'orbital') {
      const centerNode = nodes.find((n) => n.data.nodeType === 'ai_agent' || n.data.nodeType === 'gateway') || nodes[0];
      if (centerNode) positions.set(centerNode.id, new THREE.Vector3(0, 0, 0));

      const ringNodes = nodes.filter((n) => n.id !== centerNode?.id);
      ringNodes.forEach((node, i) => {
        const angle = (i / ringNodes.length) * Math.PI * 2;
        const radius = 22 + (i % 2) * 6;
        const y = Math.sin(angle * 2) * 5;
        positions.set(node.id, new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius));
      });
    } else {
      // constellation mode
      const phi = Math.PI * (Math.sqrt(5) - 1); // golden ratio
      nodes.forEach((node, i) => {
        const y = 1 - (i / (total - 1 || 1)) * 2;
        const radius = Math.sqrt(1 - y * y) * 24;
        const theta = phi * i;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        positions.set(node.id, new THREE.Vector3(x, y * 18, z));
      });
    }

    return positions;
  }, [activeTemplate.nodes, layoutMode]);

  // Trigger high-velocity data packet burst across all 3D curves
  const triggerPacketBurst = () => {
    burstActiveRef.current = true;
    setTimeout(() => {
      burstActiveRef.current = false;
    }, 4000);
  };

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(52, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 18, 55);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 140;
    controls.minDistance = 10;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x6366f1, 2.5, 120);
    pointLight.position.set(0, 30, 20);
    scene.add(pointLight);

    const secondaryLight = new THREE.PointLight(0xf43f5e, 1.8, 100);
    secondaryLight.position.set(-30, -20, -20);
    scene.add(secondaryLight);

    // Holographic Cybernetic Ground Radar Grid
    const gridHelper = new THREE.PolarGridHelper(45, 16, 8, 64, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -18;
    scene.add(gridHelper);

    // Ambient 3D Starfield Particles
    const starCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 160;
      starCoords[i + 1] = (Math.random() - 0.5) * 160;
      starCoords[i + 2] = (Math.random() - 0.5) * 160;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.7,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Group for nodes & edges
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // Build 3D Node Meshes
    const nodesMap = new Map<string, Node3DObject>();
    activeTemplate.nodes.forEach((node) => {
      const theme = getNodeTheme(node.data.nodeType);
      const nodeGroup = new THREE.Group();

      let coreGeometry: THREE.BufferGeometry;
      switch (node.data.nodeType) {
        case 'gateway':
          coreGeometry = new THREE.OctahedronGeometry(2.4);
          break;
        case 'ai_agent':
          coreGeometry = new THREE.IcosahedronGeometry(2.5, 0);
          break;
        case 'database':
          coreGeometry = new THREE.CylinderGeometry(2.2, 2.2, 3.2, 16);
          break;
        case 'queue':
          coreGeometry = new THREE.TorusGeometry(2.0, 0.7, 12, 24);
          break;
        case 'cache':
          coreGeometry = new THREE.ConeGeometry(2.2, 3.5, 4);
          break;
        case 'auth':
          coreGeometry = new THREE.TorusKnotGeometry(1.6, 0.45, 48, 8);
          break;
        case 'service':
        default:
          coreGeometry = new THREE.BoxGeometry(2.8, 2.8, 2.8);
          break;
      }

      // Emissive core material
      const coreMat = new THREE.MeshStandardMaterial({
        color: theme.hex,
        emissive: theme.hex,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: false,
      });

      const coreMesh = new THREE.Mesh(coreGeometry, coreMat);
      nodeGroup.add(coreMesh);

      // Outer Wireframe Glow Shell
      const wireframeMat = new THREE.MeshBasicMaterial({
        color: theme.hex,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const wireframeMesh = new THREE.Mesh(coreGeometry.clone(), wireframeMat);
      wireframeMesh.scale.setScalar(1.25);
      nodeGroup.add(wireframeMesh);

      // Rotating Gyroscopic Rings
      const rings: THREE.Mesh[] = [];
      const ringGeo = new THREE.RingGeometry(3.4, 3.65, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: theme.hex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
      const ringMesh2 = new THREE.Mesh(ringGeo.clone(), ringMat);
      ringMesh2.rotation.x = Math.PI / 2;
      nodeGroup.add(ringMesh1, ringMesh2);
      rings.push(ringMesh1, ringMesh2);

      // Orbiting Quantum Satellites (for AI Agent or Gateway)
      const satellites: THREE.Mesh[] = [];
      if (node.data.nodeType === 'ai_agent' || node.data.nodeType === 'gateway') {
        const satGeo = new THREE.SphereGeometry(0.45, 12, 12);
        const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let s = 0; s < 3; s++) {
          const sat = new THREE.Mesh(satGeo, satMat);
          nodeGroup.add(sat);
          satellites.push(sat);
        }
      }

      // Initial Position
      const targetPos = computedPositions.get(node.id) || new THREE.Vector3(0, 0, 0);
      nodeGroup.position.copy(targetPos);
      nodeGroup.userData = { id: node.id, data: node.data };

      graphGroup.add(nodeGroup);
      nodesMap.set(node.id, {
        mesh: nodeGroup,
        data: node.data,
        targetPos,
        currentPos: targetPos.clone(),
        satellites,
        rings,
      });
    });
    nodesMapRef.current = nodesMap;

    // Build 3D Arched Edge Connections
    const edgesList: Edge3DObject[] = [];
    const packetsList: Packet3D[] = [];

    activeTemplate.edges.forEach((edge) => {
      const sourceObj = nodesMap.get(edge.source);
      const targetObj = nodesMap.get(edge.target);
      if (!sourceObj || !targetObj) return;

      const start = sourceObj.targetPos;
      const end = targetObj.targetPos;

      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      mid.y += Math.max(4.5, dist * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      graphGroup.add(line);
      edgesList.push({ curve, line, sourceId: edge.source, targetId: edge.target });

      // Luminous Flowing Data Packet
      const packetGeo = new THREE.SphereGeometry(0.45, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        blending: THREE.AdditiveBlending,
      });
      const packetMesh = new THREE.Mesh(packetGeo, packetMat);
      graphGroup.add(packetMesh);

      packetsList.push({
        curve,
        mesh: packetMesh,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.004,
        color: new THREE.Color(0x00f0ff),
      });
    });

    edgesListRef.current = edgesList;
    packetsListRef.current = packetsList;

    setStats({
      nodesCount: nodesMap.size,
      edgesCount: edgesList.length,
      fps: 60,
    });

    // Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(graphGroup.children, true);

      let foundNode: Node3DObject | null = null;
      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent && parent !== graphGroup) {
          if (parent.userData?.id) {
            foundNode = nodesMap.get(parent.userData.id) || null;
            break;
          }
          parent = parent.parent;
        }
        if (foundNode) break;
      }

      if (foundNode) {
        container.style.cursor = 'pointer';
        setHoveredNode({
          data: foundNode.data,
          screenX: e.clientX - rect.left,
          screenY: e.clientY - rect.top,
        });
      } else {
        container.style.cursor = 'grab';
        setHoveredNode(null);
      }
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(graphGroup.children, true);

      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent && parent !== graphGroup) {
          if (parent.userData?.data) {
            setSelectedNode(parent.userData.data);
            if (parent.userData.data.endpoints?.length > 0) {
              setSelectedEndpoint(parent.userData.data.endpoints[0]);
            }
            return;
          }
          parent = parent.parent;
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;
      const burstMultiplier = burstActiveRef.current ? 4.0 : 1.0;

      // Rotate Background Starfield
      starField.rotation.y = elapsedTime * 0.02;

      // Animate Nodes (Breathing, Gyroscopic Spin, Satellites)
      nodesMap.forEach((nodeObj) => {
        // Smooth position interpolation to target layout
        nodeObj.mesh.position.lerp(nodeObj.targetPos, 0.08);

        // Gentle floating pulsation
        nodeObj.mesh.position.y = nodeObj.targetPos.y + Math.sin(elapsedTime * 2 + nodeObj.targetPos.x) * 0.4;

        // Gyroscopic Rings
        if (nodeObj.rings) {
          nodeObj.rings[0].rotation.z = elapsedTime * 1.2;
          nodeObj.rings[1].rotation.y = elapsedTime * 1.5;
        }

        // Satellites
        if (nodeObj.satellites) {
          nodeObj.satellites.forEach((sat, idx) => {
            const angle = elapsedTime * 2.5 + (idx * Math.PI * 2) / 3;
            sat.position.set(Math.cos(angle) * 4.2, Math.sin(angle * 2) * 1.8, Math.sin(angle) * 4.2);
          });
        }
      });

      // Animate Flowing Data Packets
      packetsList.forEach((packet) => {
        packet.progress = (packet.progress + packet.speed * burstMultiplier) % 1;
        const pos = packet.curve.getPointAt(packet.progress);
        packet.mesh.position.copy(pos);

        // Flash packet scale during burst
        if (burstActiveRef.current) {
          packet.mesh.scale.setScalar(1.5 + Math.sin(elapsedTime * 15) * 0.5);
        } else {
          packet.mesh.scale.setScalar(1.0);
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);

      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeTemplate, computedPositions, autoRotate, setSelectedNode, setSelectedEndpoint]);

  // Update OrbitControls AutoRotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 18, 55);
      controlsRef.current.target.set(0, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Cyber HUD Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center space-x-3 pointer-events-auto">
          {/* Hologram Badge */}
          <div className="flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-sky-500/30 shadow-lg shadow-sky-950/50">
            <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide uppercase text-slate-100">
              3D Hologram Constellation
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
              WebGL 60FPS
            </span>
          </div>

          {/* Layout Mode Selector */}
          <div className="flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLayoutMode('tiered')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                layoutMode === 'tiered'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tiered</span>
            </button>
            <button
              onClick={() => setLayoutMode('orbital')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                layoutMode === 'orbital'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Orbital</span>
            </button>
            <button
              onClick={() => setLayoutMode('constellation')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                layoutMode === 'constellation'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Constellation</span>
            </button>
          </div>
        </div>

        {/* Right Action HUD */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Packet Burst Trigger */}
          <button
            onClick={triggerPacketBurst}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-semibold text-xs px-3 py-1.5 rounded-xl shadow-md shadow-rose-950/40 transition active:scale-95 border border-rose-400/30"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Packet Surge</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              autoRotate
                ? 'bg-slate-800 text-sky-400 border-sky-500/40'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>360° Orbit</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 p-2 rounded-xl border border-slate-800 transition"
            title="Reset Camera Position"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating 3D Node Raycast Tooltip HUD */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-30 transition-all duration-75"
          style={{
            left: `${Math.min(hoveredNode.screenX + 16, window.innerWidth - 320)}px`,
            top: `${Math.min(hoveredNode.screenY + 16, window.innerHeight - 200)}px`,
          }}
        >
          <div className="w-72 bg-slate-900/95 backdrop-blur-xl border border-sky-500/40 rounded-xl p-3.5 shadow-2xl shadow-sky-950/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/60">
                {hoveredNode.data.nodeType}
              </span>
              <span className="flex items-center space-x-1 text-[11px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{hoveredNode.data.status}</span>
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-100">{hoveredNode.data.label}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{hoveredNode.data.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 font-mono text-[11px]">
              <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 text-[9px] block uppercase">P95 Latency</span>
                <span className="text-sky-400 font-semibold">{hoveredNode.data.latency}</span>
              </div>
              <div className="bg-slate-950/70 p-1.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-500 text-[9px] block uppercase">Uptime SLA</span>
                <span className="text-emerald-400 font-semibold">{hoveredNode.data.sla}</span>
              </div>
            </div>

            <div className="text-[10px] text-sky-300/80 font-medium flex items-center justify-between pt-1">
              <span>Click to open in Inspector</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 pointer-events-auto">
        <div className="flex items-center space-x-1.5">
          <Server className="w-3.5 h-3.5 text-sky-400" />
          <span>Nodes: <strong className="text-slate-200">{stats.nodesCount}</strong></span>
        </div>
        <div className="h-3 w-[1px] bg-slate-800" />
        <div className="flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Streams: <strong className="text-slate-200">{stats.edgesCount}</strong></span>
        </div>
        <div className="h-3 w-[1px] bg-slate-800" />
        <div className="flex items-center space-x-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>FPS: <strong className="text-slate-200">60</strong></span>
        </div>
      </div>
    </div>
  );
};
