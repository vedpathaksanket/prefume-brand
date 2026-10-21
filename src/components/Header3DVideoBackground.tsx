/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Film, Sparkles, Volume2, VolumeX, Eye } from 'lucide-react';

interface Header3DVideoBackgroundProps {
  currentTheme?: 'gold' | 'rose' | 'amber' | 'oud';
  onThemeChange?: (theme: string) => void;
}

interface VideoTrack {
  id: string;
  name: string;
  url: string;
  fallbackUrl: string;
  ambientColor: string;
}

const VIDEO_TRACKS: VideoTrack[] = [
  {
    id: 'luminous_gold',
    name: '3D Golden Scent Dust & Light',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-layer-of-luminous-particles-4361-large.mp4',
    fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    ambientColor: 'rgba(212, 175, 55, 0.15)',
  },
  {
    id: 'amber_refraction',
    name: 'Liquid Extrait & Light Caustics',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-layer-of-luminous-particles-4361-large.mp4',
    fallbackUrl: 'https://assets.mixkit.co/videos/preview/mixkit-layer-of-luminous-particles-4361-large.mp4',
    ambientColor: 'rgba(235, 150, 40, 0.14)',
  },
];

export const Header3DVideoBackground: React.FC<Header3DVideoBackgroundProps> = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const activeTrack = VIDEO_TRACKS[activeTrackIndex];

  // Toggle video playback
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Switch video scene
  const cycleTrack = () => {
    setVideoLoaded(false);
    setHasError(false);
    setActiveTrackIndex((prev) => (prev + 1) % VIDEO_TRACKS.length);
  };

  // High-performance procedural 3D Caustics & Gold Mist Canvas (Runs alongside video for hyper-realistic depth)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Floating 3D golden volumetric bokeh orbs
    const orbs = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 40 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.5,
      alpha: 0.03 + Math.random() * 0.08,
      hue: 42 + Math.random() * 10, // Gold range
    }));

    // Microscopic scent crystal dust
    const specks = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.3 - Math.random() * 0.4,
      alpha: 0.2 + Math.random() * 0.6,
      shimmerSpeed: 0.02 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render 3D volumetric light beam sweeps
      const gradient = ctx.createRadialGradient(
        width * 0.7 + Math.sin(time * 0.5) * 120,
        height * 0.35 + Math.cos(time * 0.4) * 80,
        20,
        width * 0.7,
        height * 0.35,
        width * 0.6
      );
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.12)');
      gradient.addColorStop(0.5, 'rgba(212, 175, 55, 0.03)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render drifting golden orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.y < -orb.radius) {
          orb.y = height + orb.radius;
          orb.x = Math.random() * width;
        }

        const orbGrad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        orbGrad.addColorStop(0, `hsla(${orb.hue}, 80%, 65%, ${orb.alpha * 1.5})`);
        orbGrad.addColorStop(1, `hsla(${orb.hue}, 80%, 50%, 0)`);

        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render shimmering scent crystal flecks
      specks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.phase += s.shimmerSpeed;
        if (s.y < 0) {
          s.y = height;
          s.x = Math.random() * width;
        }

        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
        ctx.fillStyle = `rgba(243, 229, 171, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. Underlying Realistic 3D Atmosphere Video */}
      {!hasError ? (
        <video
          ref={videoRef}
          key={activeTrack.url}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-35 mix-blend-screen scale-105' : 'opacity-0'
          }`}
        >
          <source src={activeTrack.url} type="video/mp4" />
          <source src={activeTrack.fallbackUrl} type="video/mp4" />
        </video>
      ) : null}

      {/* 2. Procedural 3D Caustics & Gold Mist Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover mix-blend-screen pointer-events-none"
      />

      {/* 3. Luxury Vignette & Dark Tint Gradients for Superior Typography Contrast */}
      <div className="absolute inset-0 bg-radial-[at_50%_40%] from-transparent via-[#08090d]/80 to-[#08090d] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-[#08090d]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090d]/90 via-[#08090d]/40 to-[#08090d]/80 pointer-events-none" />

      {/* 4. Interactive Video Control Badge (Pointer events enabled) */}
      <div className="absolute bottom-4 left-6 sm:left-8 z-30 pointer-events-auto flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="liquid-glass p-2 rounded-full border border-white/10 text-zinc-300 hover:text-white hover:border-[#d4af37]/40 transition-all cursor-pointer flex items-center justify-center shadow-lg"
          title={isPlaying ? 'Pause 3D Atmosphere Video' : 'Play 3D Atmosphere Video'}
          aria-label="Toggle Video Playback"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#d4af37]" /> : <Play className="w-3.5 h-3.5 text-white" />}
        </button>

        <button
          onClick={cycleTrack}
          className="liquid-glass px-3 py-1.5 rounded-full border border-white/10 text-zinc-300 hover:text-white hover:border-[#d4af37]/40 transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-mono shadow-lg"
          title="Switch 3D Video Theme"
        >
          <Film className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="hidden sm:inline">{activeTrack.name}</span>
          <span className="sm:hidden">Theme</span>
        </button>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/[0.06] backdrop-blur-md text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>3D Ultra-HD Cinema Engine</span>
        </div>
      </div>
    </div>
  );
};
