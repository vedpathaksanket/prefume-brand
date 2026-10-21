/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Compass, Box, Image as ImageIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Header3DVideoBackground } from './Header3DVideoBackground';
import { ThreePerfumeBottle } from './ThreePerfumeBottle';

interface HeroSectionProps {
  onExploreCollection: () => void;
  onExplorePyramid: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCollection,
  onExplorePyramid,
}) => {
  const [flaconViewMode, setFlaconViewMode] = useState<'3d' | 'editorial'>('3d');
  const [spritzCount, setSpritzCount] = useState(0);

  const handleSpritz = () => {
    setSpritzCount((c) => c + 1);
  };

  return (
    <section className="relative w-full min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden border-b border-white/[0.06]">
      {/* 1. Realistic 3D Background Video & Atmospheric Caustics Engine */}
      <Header3DVideoBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Editorial Headline & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Unboxed Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#d4af37] mb-6 font-medium"
          >
            <span>Maison de Haute Parfumerie</span>
            <span aria-hidden="true">·</span>
            <span>Grasse & Paris</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-[10px] font-mono bg-[#d4af37]/15 px-2 py-0.5 rounded-full border border-[#d4af37]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              3D Flacon Experience
            </span>
          </motion.div>

          {/* Primary Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-light text-white mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Where dreams awaken through{' '}
            <span className="italic font-normal gold-gradient-text">golden silence.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-zinc-300 text-base sm:text-lg max-w-xl font-light leading-relaxed mb-10"
          >
            Aura crafts high-concentration extraits de parfum from wild Cambodian agarwood,
            Grasse centifolia rose, and raw Baltic amber. Designed for connoisseurs seeking
            unmistakable sillage, crystal refraction, and emotional resonance.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExploreCollection}
              className="w-full sm:w-auto liquid-glass-gold rounded-full px-8 py-4 text-sm text-white font-medium flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-[#d4af37]/15"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 text-[#d4af37]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onExplorePyramid}
              className="w-full sm:w-auto liquid-glass rounded-full px-7 py-4 text-sm text-zinc-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <Compass className="w-4 h-4 text-[#d4af37]" />
              <span>Scent Pyramid Engine</span>
            </motion.button>
          </motion.div>

          {/* Provenance Markers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 pt-8 border-t border-white/[0.08] w-full grid grid-cols-3 gap-6 text-xs text-zinc-400"
          >
            <div>
              <p className="text-white text-sm font-serif mb-0.5">30% Concentration</p>
              <p className="text-[11px] text-zinc-500">Pure Extrait de Parfum</p>
            </div>
            <div>
              <p className="text-white text-sm font-serif mb-0.5">6-Month Maceration</p>
              <p className="text-[11px] text-zinc-500">Aged in Limousin oak</p>
            </div>
            <div>
              <p className="text-white text-sm font-serif mb-0.5">14+ Hours Sillage</p>
              <p className="text-[11px] text-zinc-500">Sovereign skin presence</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero 3D Perfume Bottle Presentation with Real-time 3D & View Modes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative flex justify-center items-center"
        >
          <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden liquid-glass-gold p-2 shadow-2xl group">
            {/* Display Mode Switcher (3D WebGL vs Editorial Still) */}
            <div className="absolute top-4 right-4 z-30 flex items-center gap-1 p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
              <button
                onClick={() => setFlaconViewMode('3d')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer ${
                  flaconViewMode === '3d'
                    ? 'bg-[#d4af37] text-black font-semibold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Interactive 3D Flacon Studio"
              >
                <Box className="w-3 h-3" />
                <span>3D Flacon</span>
              </button>

              <button
                onClick={() => setFlaconViewMode('editorial')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer ${
                  flaconViewMode === 'editorial'
                    ? 'bg-[#d4af37] text-black font-semibold shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Atelier Editorial Photo"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Editorial</span>
              </button>
            </div>

            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#090b10] border border-white/[0.04]">
              <AnimatePresence mode="wait">
                {flaconViewMode === '3d' ? (
                  <motion.div
                    key="3d-bottle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full relative"
                  >
                    {/* Interactive 3D Three.js Perfume Bottle */}
                    <ThreePerfumeBottle onSpritz={handleSpritz} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="editorial-photo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full relative"
                  >
                    <motion.img
                      src="/src/assets/images/hero_aura_fragrance_1792573920112.jpg"
                      alt="Aura Signature Flacon on Obsidian Pedestal"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Glass Tag for featured perfume (when in editorial view) */}
              {flaconViewMode === 'editorial' && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="absolute bottom-4 left-4 right-4 liquid-glass rounded-xl p-4 backdrop-blur-xl border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <p className="text-[11px] tracking-widest uppercase text-[#d4af37] font-medium">
                      Signature Creation
                    </p>
                    <p
                      className="text-lg text-white font-medium"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      L’Essence d’Or Flacon
                    </p>
                    <p className="text-xs text-zinc-400">Neroli · Royal Jasmine · Mysore Sandalwood</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono tabular-nums text-white">$280</span>
                    <p className="text-[10px] text-zinc-500">100ml Extrait</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
