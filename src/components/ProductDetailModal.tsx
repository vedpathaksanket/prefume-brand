/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, ShoppingBag, Compass, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Perfume, BottleSize } from '../types/perfume';
import { useAuth } from '../context/AuthContext';

interface ProductDetailModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, size: BottleSize, quantity: number) => void;
  onRequireAuth?: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
  onRequireAuth,
}) => {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const [selectedSize, setSelectedSize] = useState<BottleSize>('50ml');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Synchronize size when a new perfume is selected
  React.useEffect(() => {
    if (perfume) {
      setSelectedSize(perfume.defaultSize);
      setQuantity(1);
    }
  }, [perfume]);

  if (!perfume) return null;

  const favorite = isFavorite(perfume.id);
  const price = perfume.prices[selectedSize];
  const sizes: BottleSize[] = ['30ml', '50ml', '100ml'];

  const handleAdd = () => {
    setIsAdded(true);
    onAddToCart(perfume, selectedSize, quantity);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        {/* Animated Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="liquid-glass rounded-3xl max-w-4xl w-full border border-white/10 shadow-2xl overflow-hidden relative my-auto bg-[#0a0d14]/98 z-10"
        >
          {/* Actions: Favorite & Close Buttons */}
          <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
            <button
              onClick={() => {
                if (!user) {
                  if (onRequireAuth) onRequireAuth();
                  return;
                }
                toggleFavorite(perfume);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                favorite
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'liquid-glass text-zinc-400 hover:text-white'
              }`}
              title={favorite ? 'Remove from Scent Vault' : 'Save to Scent Vault'}
              aria-label="Toggle favorite"
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-400' : ''}`} />
            </button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full liquid-glass text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close product modal"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto scrollbar-thin">
            {/* Left Column: Visual Flacon & Provenance */}
            <div className="md:col-span-5 bg-[#07090e] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/[0.08] relative">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden liquid-glass-gold p-1.5 shadow-xl mb-6">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] tracking-widest uppercase font-mono text-[#f3e5ab] border border-[#d4af37]/30">
                  {perfume.concentration}
                </div>
              </div>

              {/* Sillage & Longevity Specifications */}
              <div className="space-y-3 text-xs text-zinc-400 border-t border-white/[0.08] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Longevity</span>
                  <span className="text-white font-mono">{perfume.longevity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Sillage Projection</span>
                  <span className="text-[#d4af37] font-medium">{perfume.sillage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Optimal Seasons</span>
                  <span className="text-zinc-300">{perfume.season}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Contiguous Purchase Module & Scent Architecture */}
            <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Collection */}
                <div className="flex items-center gap-2 text-xs tracking-widest uppercase text-[#d4af37] font-medium mb-1">
                  <span>{perfume.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{perfume.concentration} ({perfume.oilPercentage}% Pure Oil)</span>
                </div>

                {/* Title */}
                <h2
                  className="text-3xl sm:text-4xl text-white font-light tracking-tight mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  {perfume.name}
                </h2>

                <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
                  {perfume.description}
                </p>

                {/* The Full Olfactory Scent Pyramid */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-6 space-y-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white font-medium">
                    <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Olfactory Scent Architecture</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                        <span className="text-amber-300">Head / Top Notes (0–30 mins)</span>
                        <span className="font-mono text-zinc-500">Sparkling volatile</span>
                      </div>
                      <p className="text-white font-light">
                        {perfume.pyramid.top.join(' · ')}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04]">
                      <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                        <span className="text-[#d4af37]">Heart Notes (2–5 hours)</span>
                        <span className="font-mono text-zinc-500">Botanical core</span>
                      </div>
                      <p className="text-white font-light">
                        {perfume.pyramid.heart.join(' · ')}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.04]">
                      <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider mb-1">
                        <span className="text-amber-600">Base / Foundation (6–14+ hours)</span>
                        <span className="font-mono text-zinc-500">Fixative resins</span>
                      </div>
                      <p className="text-white font-light">
                        {perfume.pyramid.base.join(' · ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Accords Bar Breakdown */}
                <div className="mb-6">
                  <span className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                    Main Olfactory Accords
                  </span>
                  <div className="space-y-2">
                    {perfume.accords.map((accord) => (
                      <div key={accord.name} className="flex items-center gap-3 text-xs">
                        <span className="w-32 text-zinc-400 truncate">{accord.name}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${accord.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]"
                          />
                        </div>
                        <span className="font-mono text-[10px] text-zinc-500 w-8 text-right">
                          {accord.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Application Ritual */}
                <div className="p-3.5 rounded-xl bg-white/[0.015] border border-white/[0.04] text-[11px] text-zinc-400 leading-relaxed mb-6">
                  <strong className="text-zinc-200">The Scent Ritual: </strong>
                  {perfume.ritual}
                </div>
              </div>

              {/* Contiguous Purchase Block */}
              <div className="border-t border-white/[0.08] pt-6 space-y-4">
                {/* Bottle Size Selector */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-2 font-medium">
                    Select Bottle Volume
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`py-3 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#d4af37]/20 border-[#d4af37] text-white font-medium shadow-md'
                            : 'liquid-glass border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="block text-sm font-semibold">{sz}</span>
                        <span className="block text-xs font-mono text-[#f3e5ab] mt-0.5">
                          ${perfume.prices[sz]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Add to Bag Row */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center rounded-full liquid-glass border border-white/10 px-3 py-2 text-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-zinc-400 hover:text-white px-2 py-1 cursor-pointer font-mono"
                    >
                      -
                    </button>
                    <span className="px-3 font-mono font-medium text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-zinc-400 hover:text-white px-2 py-1 cursor-pointer font-mono"
                    >
                      +
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdd}
                    disabled={isAdded}
                    className={`flex-1 rounded-full py-4 px-6 text-sm font-medium flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'liquid-glass-gold text-white hover:scale-[1.02]'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                    <span>
                      {isAdded ? 'Added to Bag' : `Add to Bag · $${price * quantity}`}
                    </span>
                  </motion.button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>Complimentary 2-day delivery</span>
                  <span>Includes 2 complimentary samples</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
