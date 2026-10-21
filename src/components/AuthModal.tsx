/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Shield, Heart, Package, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Sign in was cancelled or failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 liquid-glass bg-[#080a0f]/98 rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full liquid-glass text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Maison Seal */}
          <div className="w-12 h-12 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3e5ab] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#d4af37]/10">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
          </div>

          <span className="text-[10px] tracking-[0.25em] uppercase text-[#d4af37] font-mono">
            Client Privileges & Scent Archive
          </span>

          <h3
            className="text-3xl text-white font-light tracking-tight mt-1 mb-2"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Enter Maison Aura
          </h3>

          <p className="text-zinc-400 text-xs leading-relaxed font-light mb-6">
            Sign in securely to preserve your personal olfactory favorites, manage custom discovery
            sets, and track white-glove flacon deliveries.
          </p>

          {/* Benefits list */}
          <div className="text-left space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-xs text-zinc-300 mb-6">
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Personal Scent Vault & Favorites</span>
            </div>
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Saved 3-Vial Custom Discovery Sets</span>
            </div>
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Order History & Courier Dispatch Tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#d4af37] shrink-0" />
              <span>Zero-Trust Google Protected Authentication</span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs mb-4">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full rounded-full py-3.5 px-6 liquid-glass-gold text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer shadow-xl"
          >
            {/* Google G SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </motion.button>

          <p className="text-[10px] text-zinc-500 mt-4">
            Protected by Firebase Authentication & Firestore Security Rules
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
