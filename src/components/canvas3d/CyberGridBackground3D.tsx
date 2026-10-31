'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CyberGridBackground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 15, 35);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Dynamic Wave Geometry
    const cols = 45;
    const rows = 45;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(0x38bdf8); // sky
    const color2 = new THREE.Color(0x6366f1); // indigo

    let idx = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = (i - cols / 2) * 2.2;
        const z = (j - rows / 2) * 2.2;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = z;

        const lerpFactor = (i / cols + j / rows) * 0.5;
        const vertexColor = color1.clone().lerp(color2, lerpFactor);
        colors[idx * 3] = vertexColor.r;
        colors[idx * 3 + 1] = vertexColor.g;
        colors[idx * 3 + 2] = vertexColor.b;

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.y = -8;
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = (performance.now() - startTime) * 0.001;
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      let pIdx = 0;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const u = i / cols;
          const v = j / rows;
          // Fluid sine wave + mouse ripple
          const wave = Math.sin(t * 1.5 + u * 8) * 1.2 + Math.cos(t * 1.2 + v * 8) * 1.2;
          array[pIdx * 3 + 1] = wave;
          pIdx++;
        }
      }
      posAttr.needsUpdate = true;

      // Gentle camera parallax
      camera.position.x += (mouseX * 8 - camera.position.x) * 0.03;
      camera.position.y += (15 + mouseY * 4 - camera.position.y) * 0.03;
      camera.lookAt(0, -4, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />;
};
