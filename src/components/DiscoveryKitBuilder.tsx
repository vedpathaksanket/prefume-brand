/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Check, Plus, Trash2, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Perfume, CartItem } from '../types/perfume';
import { useAuth } from '../context/AuthContext';

interface DiscoveryKitBuilderProps {
  perfumes: Perfume[];
  onAddKitToCart: (kitItem: CartItem) => void;
}

export const DiscoveryKitBuilder: React.FC<DiscoveryKitBuilderProps> = ({
  perfumes,
  onAddKitToCart,
}) => {
  const { user, saveCustomKit } = useAuth();
  const [selectedVials, setSelectedVials] = useState<string[]>([
    perfumes[0].id,
    perfumes[1].id,
    perfumes[2].id,
  ]);
  const [monogram, setMonogram] = useState('AV');
  const [isAdded, setIsAdded] = useState(false);

  const kitPrice = 48;

  const handleSelectPerfumeForSlot = (slotIndex: number, perfumeId: string) => {
    const updated = [...selectedVials];
    updated[slotIndex] = perfumeId;
    setSelectedVials(updated);
  };

  const handleRemoveSlot = (slotIndex: number) => {
    const updated = [...selectedVials];
    updated[slotIndex] = '';
    setSelectedVials(updated);
  };

  const isComplete = selectedVials.filter(Boolean).length === 3;

  const handleAddToCart = () => {
    if (!isComplete) return;

    const vialNames = selectedVials.map(
      (id) => perfumes.find((p) => p.id === id)?.name || ''
    );

    const formattedMonogram = monogram.trim().toUpperCase();

    const kitItem: CartItem = {
      id: `discovery-kit-${Date.now()}`,
      name: 'Custom Discovery Set (3 × 5ml)',
      price: kitPrice,
      quantity: 1,
      image: '/src/assets/images/aura_discovery_kit_1792573922749.jpg',
      isDiscoveryKit: true,
      kitVials: vialNames,
      customMonogram: formattedMonogram,
    };

    if (user) {
      saveCustomKit(vialNames, formattedMonogram).catch((err) =>
        console.error('Error saving discovery set to Firestore:', err)
      );
    }

    onAddKitToCart(kitItem);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <motion.section
      id="discovery-kit"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full py-20 lg:py-28 border-b border-white/[0.06] bg-[#090b10]"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Discovery Box Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden liquid-glass-gold p-2 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0c0e14]">
                <motion.img
                  src="/src/assets/images/aura_discovery_kit_1792573922749.jpg"
                  alt="Aura Bespoke Discovery Set Box"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.7 }}
                />

                {/* Voucher Callout Banner */}
                <div className="absolute top-4 left-4 right-4 liquid-glass rounded-xl p-3 backdrop-blur-xl border border-[#d4af37]/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-white font-medium">$48 Flacon Voucher Included</span>
                  </div>
                  <span className="text-[#f3e5ab] text-[10px] font-mono">100% Redeemable</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl liquid-glass border border-white/[0.06] text-xs text-zinc-400">
              <p className="font-light leading-relaxed">
                <strong className="text-white font-medium">Bespoke Walnut Case:</strong> Handcrafted walnut presentation box with midnight velvet bedding, gold atomizers, and personalized brass monogram embossing.
              </p>
            </div>
          </motion.div>

          {/* Right: The 3-Vial Customizer Module */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#d4af37] font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Olfactory Discovery</span>
            </div>
            <h2
              className="text-3xl sm:text-5xl font-light text-white tracking-tight mb-4"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Curate Your Discovery Set
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed font-light mb-8 max-w-xl">
              Experience the maison in intimate ritual before committing to a flacon. Choose three 5ml
              atomizers of your desired extraits. The entire $48 purchase value is applied as credit
              towards your first 100ml bottle.
            </p>

            {/* The 3 Selected Vial Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[0, 1, 2].map((slotIdx) => {
                const currentId = selectedVials[slotIdx];
                const perfume = perfumes.find((p) => p.id === currentId);

                return (
                  <motion.div
                    key={slotIdx}
                    layout
                    whileHover={{ y: -3 }}
                    className={`rounded-2xl p-4 transition-all relative border flex flex-col justify-between ${
                      perfume
                        ? 'liquid-glass-gold border-[#d4af37]/40 shadow-lg shadow-black/40'
                        : 'liquid-glass border-dashed border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2">
                      <span className="font-mono text-[#d4af37]">Vial 0{slotIdx + 1}</span>
                      <span className="text-zinc-500">5ml Spray</span>
                    </div>

                    {perfume ? (
                      <div>
                        <p className="text-sm font-medium text-white mb-0.5">{perfume.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate mb-3">{perfume.category}</p>
                        <button
                          onClick={() => handleRemoveSlot(slotIdx)}
                          className="text-[10px] text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Change</span>
                        </button>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-xs text-zinc-500 mb-2">Select a fragrance below</p>
                        <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center mx-auto text-zinc-400">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Available Perfumes Selector for Slots */}
            <div className="mb-8">
              <label className="block text-xs uppercase tracking-wider text-zinc-400 mb-3 font-medium">
                Select Flavors & Fragrances to Fill Your Vials
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {perfumes.map((p) => {
                  const isAssigned = selectedVials.includes(p.id);
                  return (
                    <motion.button
                      key={p.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        const emptySlot = selectedVials.findIndex((id) => !id);
                        if (emptySlot !== -1) {
                          handleSelectPerfumeForSlot(emptySlot, p.id);
                        } else {
                          handleSelectPerfumeForSlot(0, p.id);
                        }
                      }}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                        isAssigned
                          ? 'bg-[#d4af37]/15 border-[#d4af37]/60 text-white'
                          : 'liquid-glass border-white/[0.06] hover:border-white/20 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-medium truncate">{p.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate">{p.category}</p>
                      </div>
                      {isAssigned && <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Custom Monogram & Action Row */}
            <div className="p-5 rounded-2xl liquid-glass border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="w-full sm:w-auto">
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1 font-medium">
                  Complimentary Gold Monogram (2-3 Initials)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={monogram}
                  onChange={(e) => setMonogram(e.target.value.toUpperCase())}
                  placeholder="e.g. SV"
                  className="px-4 py-1.5 rounded-lg bg-black/40 border border-white/10 text-sm font-mono text-[#f3e5ab] focus:outline-none focus:border-[#d4af37] tracking-widest uppercase w-28 text-center"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="text-right">
                  <span className="text-2xl font-serif font-medium text-white tabular-nums">${kitPrice}</span>
                  <p className="text-[10px] text-emerald-400">Includes $48 credit voucher</p>
                </div>

                <motion.button
                  whileHover={isComplete ? { scale: 1.03 } : {}}
                  whileTap={isComplete ? { scale: 0.97 } : {}}
                  onClick={handleAddToCart}
                  disabled={!isComplete || isAdded}
                  className={`rounded-full px-7 py-3.5 text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
                    isAdded
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : !isComplete
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'liquid-glass-gold text-white shadow-lg'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                  <span>{isAdded ? 'Added Discovery Box' : 'Add Set to Bag'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
