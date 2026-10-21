/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenChat,
  onOpenAuth,
  onOpenProfile,
  activeSection,
  onNavigate,
}) => {
  const { user, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'collection', label: 'Collection' },
    { id: 'pyramid', label: 'Olfactory Pyramid' },
    { id: 'discovery-kit', label: 'Discovery Kit' },
    { id: 'maison', label: 'Maison Story' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090d]/85 backdrop-blur-md border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl sm:text-3xl tracking-[0.2em] uppercase font-light text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          <span className="gold-gradient-text font-normal">Aura</span>
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-light text-zinc-400">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 text-sm tracking-wide ${
                  isActive
                    ? 'text-white font-medium border-b border-[#d4af37]'
                    : 'hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            onClick={onOpenChat}
            className="flex items-center gap-1.5 text-xs text-[#d4af37] hover:text-[#f3e5ab] transition-colors cursor-pointer tracking-wider uppercase font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Parfumeur</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Auth/Profile, Cart Drawer Trigger & Mobile Menu) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* User Profile or Sign-In Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="liquid-glass rounded-full px-3 py-1.5 text-xs text-white flex items-center gap-2 hover:border-[#d4af37]/50 cursor-pointer transition-all border border-white/10"
              title="Open Scent Vault & Orders"
              aria-label="User Profile"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover border border-[#d4af37]/40"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#d4af37]/20 text-[#f3e5ab] flex items-center justify-center text-[10px]">
                  <User className="w-3 h-3" />
                </div>
              )}
              <span className="hidden sm:inline text-[11px] font-medium tracking-wide truncate max-w-[100px]">
                {user.displayName?.split(' ')[0] || 'Connoisseur'}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-all border border-white/10"
              title="Sign in with Google"
            >
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden sm:inline text-[11px] uppercase tracking-wider font-medium">
                Sign In
              </span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="liquid-glass-gold rounded-full px-4 py-2 text-xs sm:text-sm text-white flex items-center gap-2 hover:scale-[1.02] cursor-pointer transition-transform whitespace-nowrap shrink-0"
            aria-label={`View shopping cart containing ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline tracking-wider uppercase text-[11px] font-medium">Bag</span>
            <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f5e7b2] flex items-center justify-center text-[10px] font-mono tabular-nums">
              {cartCount}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden liquid-glass rounded-full p-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 bg-[#08090d]/95 border-b border-white/[0.08] backdrop-blur-xl animate-fade-rise">
          <nav className="flex flex-col gap-3">
            {/* Account Status in mobile menu */}
            <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
              {user ? (
                <div
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-8 h-8 rounded-full border border-[#d4af37]/40"
                    />
                  )}
                  <div>
                    <p className="text-sm text-white font-medium">{user.displayName}</p>
                    <p className="text-[10px] text-[#d4af37] font-mono">Scent Vault & Orders</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full liquid-glass-gold rounded-full py-2.5 text-xs text-white font-medium flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Sign In with Google</span>
                </button>
              )}
            </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-left text-zinc-300 hover:text-white py-2 text-base tracking-wide border-b border-white/[0.04] transition-colors"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="text-left text-[#d4af37] py-2 text-base tracking-wide flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consult AI Master Parfumeur</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
