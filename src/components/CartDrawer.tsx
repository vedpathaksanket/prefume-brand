/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, Sparkles, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types/perfume';
import { useAuth } from '../context/AuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { user, saveOrder } = useAuth();
  const [selectedFreeSample, setSelectedFreeSample] = useState<string>('Obsidian Oud 2ml Sample');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('AUR-82910');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 200;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const newOrderId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrderId(newOrderId);

    if (user) {
      try {
        await saveOrder({
          orderId: newOrderId,
          customerEmail: user.email || '',
          totalAmount: subtotal + (amountToFreeShipping === 0 ? 0 : 15),
          status: 'confirmed',
          itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            size: i.size || (i.isDiscoveryKit ? '3 × 5ml' : '50ml'),
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            category: i.isDiscoveryKit ? 'Discovery Set' : 'Extrait de Parfum',
            isDiscoveryKit: i.isDiscoveryKit,
            kitVials: i.kitVials,
            customMonogram: i.customMonogram,
          })),
          sampleChoice: selectedFreeSample,
          trackingNumber: `AUR-EXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
          shippingAddress: 'White Glove Express Courier, Paris Atelier Dispatch',
        });
      } catch (err) {
        console.error('Failed to save order to Firestore:', err);
      }
    }

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderConfirmed(true);
    }, 1200);
  };

  const handleCloseAndReset = () => {
    if (orderConfirmed) {
      onClearCart();
      setOrderConfirmed(false);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Animated dark overlay backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseAndReset}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-screen max-w-md liquid-glass bg-[#090b10]/98 border-l border-white/[0.08] shadow-2xl flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                <h3
                  className="text-xl font-medium text-white tracking-wide"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Your Fragrance Bag
                </h3>
                <span className="text-xs text-zinc-500 font-mono">
                  ({items.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseAndReset}
                className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {orderConfirmed ? (
              /* Order Confirmed State */
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
                <span className="text-xs uppercase tracking-widest text-[#d4af37] font-mono mb-1">
                  Order #{confirmedOrderId} Confirmed
                </span>
                <h4
                  className="text-2xl text-white font-medium mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Thank You for Choosing Aura
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mb-6">
                  Your artisanal flacons are being hand-packaged in our Paris atelier with signature black
                  grosgrain ribbons and your chosen 2ml complimentary extrait.
                </p>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] w-full text-xs text-left mb-6 space-y-1.5 font-mono text-zinc-400">
                  <div className="flex justify-between">
                    <span>Estimated Delivery:</span>
                    <span className="text-white">2–3 Business Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courier:</span>
                    <span className="text-white">White Glove Express</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Paid:</span>
                    <span className="text-[#f3e5ab]">${subtotal}</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCloseAndReset}
                  className="w-full liquid-glass-gold rounded-full py-3.5 text-xs font-medium text-white cursor-pointer"
                >
                  Continue Exploring Maison
                </motion.button>
              </div>
            ) : (
              <>
                {/* Free Shipping Meter */}
                <div className="px-6 py-3 bg-[#0d1017] border-b border-white/[0.06] text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="text-zinc-400">
                      {amountToFreeShipping === 0 ? (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          You've unlocked Complimentary Express Courier
                        </span>
                      ) : (
                        <>
                          Add <strong className="text-white">${amountToFreeShipping}</strong> for complimentary courier
                        </>
                      )}
                    </span>
                    <span className="font-mono text-zinc-500">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShippingProgress}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <ShoppingBag className="w-12 h-12 text-zinc-600 mb-3 stroke-[1.2]" />
                      <p className="text-base text-zinc-300 font-medium mb-1">Your bag is empty</p>
                      <p className="text-xs text-zinc-500 max-w-xs mb-6">
                        Explore our collection to discover signature extraits de parfum and custom discovery sets.
                      </p>
                      <button
                        onClick={onClose}
                        className="liquid-glass-gold rounded-full px-6 py-2.5 text-xs text-white font-medium hover:scale-105 transition-transform cursor-pointer"
                      >
                        Browse Fragrances
                      </button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={item.id}
                        className="liquid-glass rounded-2xl p-4 border border-white/[0.06] flex gap-4 items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover border border-white/10 bg-[#0e1118]"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                          {item.size && (
                            <p className="text-[11px] text-[#d4af37] font-mono">{item.size} Flacon</p>
                          )}
                          {item.isDiscoveryKit && item.kitVials && (
                            <p className="text-[10px] text-zinc-400 line-clamp-1">
                              {item.kitVials.join(' · ')}
                              {item.customMonogram && ` · Monogram: ${item.customMonogram}`}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-mono text-white tabular-nums">
                              ${item.price}
                            </span>

                            <div className="flex items-center gap-3">
                              {/* Quantity Stepper */}
                              <div className="flex items-center rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-xs">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="text-zinc-400 hover:text-white px-1.5 cursor-pointer font-mono"
                                >
                                  -
                                </button>
                                <span className="px-2 font-mono text-zinc-200">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="text-zinc-400 hover:text-white px-1.5 cursor-pointer font-mono"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(item.id)}
                                className="text-zinc-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {/* Free Sample Gift Box */}
                  {items.length > 0 && (
                    <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-2 text-xs text-white font-medium mb-2">
                        <Gift className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Complimentary Atelier Sample (2ml)</span>
                      </div>
                      <select
                        value={selectedFreeSample}
                        onChange={(e) => setSelectedFreeSample(e.target.value)}
                        className="w-full text-xs rounded-xl bg-black/40 border border-white/10 text-zinc-300 p-2.5 focus:outline-none focus:border-[#d4af37]"
                      >
                        <option value="Obsidian Oud 2ml Sample">Obsidian Oud 2ml Extrait</option>
                        <option value="Celestial Rose 2ml Sample">Celestial Rose 2ml EDP</option>
                        <option value="Amber Velvet 2ml Sample">Amber Velvet 2ml Extrait</option>
                        <option value="Aqua Nocturne 2ml Sample">Aqua Nocturne 2ml EDP</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Checkout Summary Footer */}
                {items.length > 0 && (
                  <div className="p-6 border-t border-white/[0.08] bg-[#07090e] space-y-4">
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-mono text-white tabular-nums">${subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>White Glove Courier</span>
                        <span className="text-emerald-400">
                          {amountToFreeShipping === 0 ? 'Complimentary' : '$15'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Artisanal Gift Packaging</span>
                        <span className="text-zinc-400">Complimentary</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/[0.06] text-sm text-white font-medium">
                        <span>Estimated Total</span>
                        <span className="font-serif text-lg text-[#f3e5ab] tabular-nums">
                          ${subtotal + (amountToFreeShipping === 0 ? 0 : 15)}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full liquid-glass-gold rounded-full py-4 text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                    >
                      {isCheckingOut ? (
                        <span>Securing Order...</span>
                      ) : (
                        <>
                          <span>Proceed to Secure Checkout</span>
                          <ArrowRight className="w-4 h-4 text-[#d4af37]" />
                        </>
                      )}
                    </motion.button>

                    <p className="text-[10px] text-zinc-500 text-center tracking-wide">
                      Encrypted 256-bit checkout · 30-day scent return guarantee
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
