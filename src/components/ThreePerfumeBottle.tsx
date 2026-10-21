/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Rotate3D, Sparkles, Eye, Volume2, VolumeX, Maximize2 } from 'lucide-react';

interface ThreePerfumeBottleProps {
  onSpritz?: () => void;
  className?: string;
}

export const ThreePerfumeBottle: React.FC<ThreePerfumeBottleProps> = ({
  onSpritz,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [isSpritzing, setIsSpritzing] = useState(false);
  const [liquidLevel, setLiquidLevel] = useState(0.85); // 85% full
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeAngle, setActiveAngle] = useState<'front' | 'angled' | 'top'>('front');

  // Three.js internal references for interaction
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bottleGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const spritzParticlesRef = useRef<THREE.Points | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false });
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthesized luxury spritz sound using Web Audio API (zero external assets)
  const playSpritzSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // White noise burst for aerosol mist
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Bandpass filter for aerosol hiss
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      // Delicate golden chime resonance
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
      oscGain.gain.setValueAtTime(0.06, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      whiteNoise.start();
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio playback graceful fallback
    }
  }, [soundEnabled]);

  // Trigger spritz mist effect
  const handleSpritz = useCallback(() => {
    setIsSpritzing(true);
    playSpritzSound();
    if (onSpritz) onSpritz();

    // Trigger spritz particles burst in Three.js
    if (spritzParticlesRef.current) {
      const geo = spritzParticlesRef.current.geometry;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] = (Math.random() - 0.5) * 0.2;
        pos[i + 1] = 1.95; // at nozzle level
        pos[i + 2] = 0.5 + Math.random() * 0.2;
      }
      geo.attributes.position.needsUpdate = true;
      (spritzParticlesRef.current.material as THREE.PointsMaterial).opacity = 0.9;
    }

    // Slightly deplete liquid level for realism
    setLiquidLevel((prev) => Math.max(0.2, prev - 0.02));

    setTimeout(() => {
      setIsSpritzing(false);
    }, 700);
  }, [playSpritzSound, onSpritz]);

  // Set predefined camera angle
  const handleSetAngle = (angle: 'front' | 'angled' | 'top') => {
    setActiveAngle(angle);
    if (!bottleGroupRef.current) return;
    if (angle === 'front') {
      mousePos.current.targetX = 0;
      mousePos.current.targetY = 0;
    } else if (angle === 'angled') {
      mousePos.current.targetX = 0.65;
      mousePos.current.targetY = 0.2;
    } else if (angle === 'top') {
      mousePos.current.targetX = 0.3;
      mousePos.current.targetY = 0.75;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Detect software rendering
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param)).toLowerCase();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return gpu.includes('swiftshader') || gpu.includes('llvmpipe') || gpu.includes('software');
    })();

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.4, 5.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSoftwareGl ? 1 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // Bottle Group
    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);
    bottleGroupRef.current = bottleGroup;

    // --- MATERIALS ---
    // 1. Crystal Glass (Refractive, thick wall)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      metalness: 0.05,
      ior: 1.54, // crystal glass
      thickness: 0.85,
      specularIntensity: 1.0,
      specularColor: 0xfff0d0,
      attenuationColor: 0xffe6b0,
      attenuationDistance: 2.5,
    });

    // 2. Liquid Extrait (Rich warm amber with gold shimmer)
    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xdf9828,
      emissive: 0x482404,
      emissiveIntensity: 0.35,
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.45,
      transparent: true,
      opacity: 0.92,
      ior: 1.39,
    });

    // 3. Polished Haute Gold (Atomizer neck and accents)
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xe6b840,
      metalness: 0.94,
      roughness: 0.18,
      emissive: 0x221703,
      emissiveIntensity: 0.15,
    });

    // 4. Obsidian Cap Material (Dark gloss with gold trim)
    const obsidianMaterial = new THREE.MeshStandardMaterial({
      color: 0x090a0f,
      metalness: 0.85,
      roughness: 0.22,
    });

    // --- PROCEDURAL GEOMETRIES ---
    // A. Crystal Flacon Body (Beveled Luxury Octagonal Shape)
    const bottleShape = new THREE.Shape();
    const width = 1.35;
    const height = 1.85;
    const radius = 0.28;
    // Rounded chamfered rectangle
    bottleShape.moveTo(-width / 2 + radius, -height / 2);
    bottleShape.lineTo(width / 2 - radius, -height / 2);
    bottleShape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    bottleShape.lineTo(width / 2, height / 2 - radius);
    bottleShape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    bottleShape.lineTo(-width / 2 + radius, height / 2);
    bottleShape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    bottleShape.lineTo(-width / 2, -height / 2 + radius);
    bottleShape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.12,
    };

    const glassGeometry = new THREE.ExtrudeGeometry(bottleShape, extrudeSettings);
    glassGeometry.center();
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    bottleGroup.add(glassMesh);

    // B. Inner Liquid Chamber
    const liquidShape = new THREE.Shape();
    const lWidth = width - 0.24;
    const lHeight = height - 0.28;
    const lRadius = 0.18;
    liquidShape.moveTo(-lWidth / 2 + lRadius, -lHeight / 2);
    liquidShape.lineTo(lWidth / 2 - lRadius, -lHeight / 2);
    liquidShape.quadraticCurveTo(lWidth / 2, -lHeight / 2, lWidth / 2, -lHeight / 2 + lRadius);
    liquidShape.lineTo(lWidth / 2, lHeight / 2 - lRadius);
    liquidShape.quadraticCurveTo(lWidth / 2, lHeight / 2, lWidth / 2 - lRadius, lHeight / 2);
    liquidShape.lineTo(-lWidth / 2 + lRadius, lHeight / 2);
    liquidShape.quadraticCurveTo(-lWidth / 2, lHeight / 2, -lWidth / 2, lHeight / 2 - lRadius);
    liquidShape.lineTo(-lWidth / 2, -lHeight / 2 + lRadius);
    liquidShape.quadraticCurveTo(-lWidth / 2, -lHeight / 2, -lWidth / 2 + lRadius, -lHeight / 2);

    const liquidExtrude = {
      depth: 0.58,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    const liquidGeometry = new THREE.ExtrudeGeometry(liquidShape, liquidExtrude);
    liquidGeometry.center();
    const liquidMesh = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquidMesh.position.y = -0.06;
    liquidMesh.position.z = 0;
    liquidMeshRef.current = liquidMesh;
    bottleGroup.add(liquidMesh);

    // C. Golden Atomizer Collar / Neck
    const neckGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.45, 32);
    const neckMesh = new THREE.Mesh(neckGeo, goldMaterial);
    neckMesh.position.y = height / 2 + 0.28;
    bottleGroup.add(neckMesh);

    // Spray nozzle top
    const nozzleGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.22, 32);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, goldMaterial);
    nozzleMesh.position.y = height / 2 + 0.56;
    bottleGroup.add(nozzleMesh);

    // D. Heavy Obsidian Cap with Gold Band
    const capGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.72, 32);
    const capMesh = new THREE.Mesh(capGeo, obsidianMaterial);
    capMesh.position.y = height / 2 + 0.95;
    bottleGroup.add(capMesh);

    // Gold band on cap
    const capRingGeo = new THREE.TorusGeometry(0.49, 0.024, 16, 48);
    capRingGeo.rotateX(Math.PI / 2);
    const capRingMesh = new THREE.Mesh(capRingGeo, goldMaterial);
    capRingMesh.position.y = height / 2 + 0.65;
    bottleGroup.add(capRingMesh);

    // Top gold seal medallion
    const sealGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.04, 32);
    const sealMesh = new THREE.Mesh(sealGeo, goldMaterial);
    sealMesh.position.y = height / 2 + 1.32;
    bottleGroup.add(sealMesh);

    // E. Dip Tube
    const tubeGeo = new THREE.CylinderGeometry(0.024, 0.024, height - 0.3, 16);
    const tubeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      transparent: true,
      roughness: 0.1,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    tubeMesh.position.y = 0.1;
    bottleGroup.add(tubeMesh);

    // F. Golden Label Plate with Procedural High-Res Texture
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512;
    labelCanvas.height = 256;
    const ctx = labelCanvas.getContext('2d');
    if (ctx) {
      // Dark lacquer background with gold border
      ctx.fillStyle = '#080a0f';
      ctx.fillRect(0, 0, 512, 256);

      // Gold border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 6;
      ctx.strokeRect(16, 16, 480, 224);

      // Inner thin border
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(26, 26, 460, 204);

      // Typography
      ctx.fillStyle = '#f3e5ab';
      ctx.textAlign = 'center';
      ctx.font = 'bold 34px "Cormorant Garamond", Georgia, serif';
      ctx.fillText('A U R A', 256, 95);

      ctx.fillStyle = '#d4af37';
      ctx.font = '14px monospace';
      ctx.letterSpacing = '6px';
      ctx.fillText('EXTRAIT DE PARFUM', 256, 140);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
      ctx.fillText('Haute Parfumerie · Paris', 256, 185);
    }
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelGeo = new THREE.PlaneGeometry(0.85, 0.42);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      metalness: 0.8,
      roughness: 0.25,
      bumpScale: 0.05,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.z = extrudeSettings.depth / 2 + 0.13;
    labelMesh.position.y = -0.05;
    bottleGroup.add(labelMesh);

    // --- LIGHTING RIG ---
    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xffecd0, 3.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Gold rim light from opposite side
    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.8);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Blue-violet theatrical backlight for cinematic depth
    const backLight = new THREE.DirectionalLight(0x4060ff, 1.4);
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    // Ambient studio fill
    const ambientLight = new THREE.AmbientLight(0x181824, 1.8);
    scene.add(ambientLight);

    // Point light under flacon to illuminate golden extrait liquid from within
    const innerGlow = new THREE.PointLight(0xffa520, 2.5, 3.5);
    innerGlow.position.set(0, -0.6, 0);
    bottleGroup.add(innerGlow);

    // --- AMBIENT FLOATING SCENT PARTICLES ---
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 4.5;
      particlePos[i + 1] = (Math.random() - 0.5) * 4.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 3;

      particleVel[i] = (Math.random() - 0.5) * 0.003;
      particleVel[i + 1] = 0.003 + Math.random() * 0.006; // upward drift
      particleVel[i + 2] = (Math.random() - 0.5) * 0.003;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xf6d57a,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // --- SPRITZ MIST PARTICLES ---
    const spritzCount = 200;
    const spritzGeo = new THREE.BufferGeometry();
    const spritzPositions = new Float32Array(spritzCount * 3);
    const spritzVelocities = new Float32Array(spritzCount * 3);

    for (let i = 0; i < spritzCount * 3; i += 3) {
      spritzPositions[i] = 0;
      spritzPositions[i + 1] = 1.95;
      spritzPositions[i + 2] = 0.5;

      // Cone spray forward and slightly upward
      const angle = Math.random() * Math.PI * 2;
      const spread = 0.02 + Math.random() * 0.04;
      spritzVelocities[i] = Math.cos(angle) * spread;
      spritzVelocities[i + 1] = 0.02 + Math.random() * 0.03;
      spritzVelocities[i + 2] = 0.05 + Math.random() * 0.08;
    }
    spritzGeo.setAttribute('position', new THREE.BufferAttribute(spritzPositions, 3));

    const spritzMat = new THREE.PointsMaterial({
      color: 0xffdf88,
      size: 0.06,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const spritzParticles = new THREE.Points(spritzGeo, spritzMat);
    scene.add(spritzParticles);
    spritzParticlesRef.current = spritzParticles;

    // --- MOUSE & TOUCH INTERACTION ---
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (e: PointerEvent) => {
      mousePos.current.isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      // Parallax hover drift
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (mousePos.current.isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        mousePos.current.targetX += dx * 0.015;
        mousePos.current.targetY += dy * 0.015;
        lastX = e.clientX;
        lastY = e.clientY;
      } else {
        // Subtle responsive light tracking
        keyLight.position.x = 4 + nx * 2;
        keyLight.position.y = 5 + ny * 2;
      }
    };

    const onPointerUp = () => {
      mousePos.current.isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia rotation
      if (isRotating && !mousePos.current.isDragging) {
        mousePos.current.targetX += delta * 0.45;
      }

      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      if (bottleGroup) {
        bottleGroup.rotation.y = mousePos.current.x;
        bottleGroup.rotation.x = Math.max(-0.4, Math.min(0.4, mousePos.current.y));

        // Floating gentle breathing bob
        bottleGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;
      }

      // Amber liquid pulsation
      if (liquidMeshRef.current) {
        liquidMeshRef.current.scale.y = liquidLevel;
        liquidMeshRef.current.position.y = -0.06 - (1 - liquidLevel) * 0.45;
      }

      // Ambient particle drift
      if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          pos[i + 1] += particleVel[i + 1];
          pos[i] += Math.sin(elapsedTime + i) * 0.001;

          if (pos[i + 1] > 2.5) {
            pos[i + 1] = -2.2;
            pos[i] = (Math.random() - 0.5) * 4;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Spritz mist animation
      if (spritzParticlesRef.current && (spritzParticlesRef.current.material as THREE.PointsMaterial).opacity > 0.01) {
        const mat = spritzParticlesRef.current.material as THREE.PointsMaterial;
        mat.opacity *= 0.94; // fade out

        const pos = spritzParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < spritzCount * 3; i += 3) {
          pos[i] += spritzVelocities[i];
          pos[i + 1] += spritzVelocities[i + 1];
          pos[i + 2] += spritzVelocities[i + 2];
        }
        spritzParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      resizeObserver.disconnect();

      // Dispose Three.js objects
      glassGeometry.dispose();
      liquidGeometry.dispose();
      neckGeo.dispose();
      nozzleGeo.dispose();
      capGeo.dispose();
      capRingGeo.dispose();
      sealGeo.dispose();
      tubeGeo.dispose();
      labelGeo.dispose();
      labelTexture.dispose();
      particleGeo.dispose();
      spritzGeo.dispose();

      glassMaterial.dispose();
      liquidMaterial.dispose();
      goldMaterial.dispose();
      obsidianMaterial.dispose();
      tubeMat.dispose();
      labelMat.dispose();
      particleMat.dispose();
      spritzMat.dispose();

      renderer.dispose();
    };
  }, [isRotating, liquidLevel]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none touch-none overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Interaction Control HUD */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          className={`p-2 rounded-xl backdrop-blur-md border text-xs transition-all cursor-pointer ${
            isRotating
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f3e5ab]'
              : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title={isRotating ? 'Pause 360° auto-rotation' : 'Resume 360° auto-rotation'}
          aria-label="Toggle 3D Rotation"
        >
          <Rotate3D className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSoundEnabled((prev) => !prev)}
          className={`p-2 rounded-xl backdrop-blur-md border text-xs transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#f3e5ab]'
              : 'bg-black/50 border-white/10 text-zinc-400 hover:text-white'
          }`}
          title={soundEnabled ? 'Mute Atelier Mist Sound' : 'Enable Atelier Audio'}
          aria-label="Toggle Audio"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive Camera Preset Buttons */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 z-20">
        {(['front', 'angled', 'top'] as const).map((angle) => (
          <button
            key={angle}
            onClick={() => handleSetAngle(angle)}
            className={`px-2.5 py-1 rounded-lg backdrop-blur-md text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer ${
              activeAngle === angle
                ? 'bg-[#d4af37] text-black font-semibold'
                : 'bg-black/50 border border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {angle}
          </button>
        ))}
      </div>

      {/* Spritz Button & Sillage Metric */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 z-20 pointer-events-auto">
        <button
          onClick={handleSpritz}
          disabled={isSpritzing}
          className="liquid-glass-gold px-4 py-2.5 rounded-full text-xs font-medium text-white flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
        >
          <Sparkles className={`w-3.5 h-3.5 text-[#d4af37] ${isSpritzing ? 'animate-spin' : ''}`} />
          <span>{isSpritzing ? 'Spritzing Extrait...' : 'Spritz 3D Flacon'}</span>
        </button>

        <div className="liquid-glass px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span>360° Real-Time 3D Engine</span>
        </div>
      </div>
    </div>
  );
};
