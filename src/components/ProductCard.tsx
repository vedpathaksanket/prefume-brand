/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Eye, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Perfume, BottleSize } from '../types/perfume';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  perfume: Perfume;
  index?: number;
  onOpenDetail: (perfume: Perfume) => void;
  onAddToCart: (perfume: Perfume, size: BottleSize) => void;
  onRequireAuth?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  perfume,
  index = 0,
  onOpenDetail,
  onAddToCart,
  onRequireAuth,
}) => {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const [selectedSize, setSelectedSize] = useState<BottleSize>(perfume.defaultSize);
  const [isAdding, setIsAdding] = useState(false);

  const price = perfume.prices[selectedSize];
  const sizes: BottleSize[] = ['30ml', '50ml', '100ml'];
  const favorite = isFavorite(perfume.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart(perfume, selectedSize);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    toggleFavorite(perfume);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.75,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
      onClick={() => onOpenDetail(perfume)}
      className="group liquid-glass rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer border border-white/[0.08] hover:border-[#d4af37]/45 transition-colors duration-300 shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-[#d4af37]/10"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0c0f16]">
        <motion.img
          src={perfume.image}
          alt={perfume.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Bestseller / Concentration marker */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {perfume.isBestseller && (
            <span className="px-2.5 py-1 rounded-full bg-[#08090d]/85 backdrop-blur-md border border-[#d4af37]/40 text-[10px] tracking-widest uppercase font-medium text-[#f3e5ab] flex items-center gap-1 shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-[#d4af37]" />
              Bestseller
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-[#08090d]/85 backdrop-blur-md border border-white/10 text-[10px] tracking-wider uppercase font-medium text-zinc-400">
            {perfume.concentration}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleToggleFav}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
            favorite
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              : 'bg-black/60 border-white/10 text-zinc-400 hover:text-white hover:scale-110'
          }`}
          title={favorite ? 'Remove from Scent Vault' : 'Save to Scent Vault'}
          aria-label={`Favorite ${perfume.name}`}
        >
          <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-400' : ''}`} />
        </button>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(perfume);
            }}
            className="liquid-glass-gold rounded-full px-5 py-2.5 text-xs text-white flex items-center gap-2 shadow-2xl"
          >
            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Inspect Scent Pyramid</span>
          </motion.button>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Longevity Metadata */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5 uppercase tracking-wider">
            <span>{perfume.category}</span>
            <span className="font-mono text-zinc-500">{perfume.longevity}</span>
          </div>

          {/* Fragrance Name */}
          <h3
            className="text-2xl text-white font-medium group-hover:text-[#f3e5ab] transition-colors mb-1 tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {perfume.name}
          </h3>

          {/* Subtitle / Key Note Aura */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {perfume.subtitle}
          </p>

          {/* Signature Notes preview */}
          <div className="py-2.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-zinc-300 mb-5 flex flex-col gap-1">
            <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider">
              <span>Olfactory Heart</span>
              <span className="text-[#d4af37]">{perfume.accords[0].name}</span>
            </div>
            <div className="text-zinc-300 font-light truncate">
              {perfume.pyramid.heart.join(' · ')}
            </div>
          </div>
        </div>

        {/* Bottom Size Selection & Add to Bag */}
        <div>
          {/* Sizing Radio Selector */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(sz);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-[#d4af37] text-[#08090d] font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Price display with tabular nums */}
            <div className="text-right">
              <span className="text-lg font-serif font-medium text-white tabular-nums">
                ${price}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              disabled={isAdding}
              className={`flex-1 rounded-full py-2.5 px-4 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isAdding
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'liquid-glass-gold text-white hover:scale-[1.02]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{isAdding ? 'Added to Bag' : `Add ${selectedSize}`}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(perfume);
              }}
              className="p-2.5 rounded-full liquid-glass text-zinc-400 hover:text-white hover:scale-105 transition-all border border-white/10"
              title="View full olfactory breakdown"
              aria-label={`View full details for ${perfume.name}`}
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
