/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ScentPyramidInteractive } from './components/ScentPyramidInteractive';
import { DiscoveryKitBuilder } from './components/DiscoveryKitBuilder';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ParfumeurChatModal } from './components/ParfumeurChatModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileDrawer } from './components/UserProfileDrawer';
import { MaisonStory } from './components/MaisonStory';
import { Footer } from './components/Footer';
import { PERFUMES_DATA } from './data/perfumes';
import { Perfume, FragranceCategory, BottleSize, CartItem } from './types/perfume';
import { Sparkles, Check } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<FragranceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoteFilter, setActiveNoteFilter] = useState<string | null>(null);

  const [selectedPerfumeForModal, setSelectedPerfumeForModal] = useState<Perfume | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'obsidian-oud-100ml',
      perfumeId: 'obsidian-oud',
      name: 'Obsidian Oud',
      size: '100ml',
      price: 320,
      quantity: 1,
      image: '/src/assets/images/aura_obsidian_oud_1792573921525.jpg',
    },
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [activeNavSection, setActiveNavSection] = useState('collection');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories: FragranceCategory[] = [
    'All',
    'Woody & Smoky',
    'Solar & Floral',
    'Spiced Oriental',
    'Aqua & Fresh',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filtered perfumes based on Category, Search query, and Scent Note filter
  const filteredPerfumes = useMemo(() => {
    return PERFUMES_DATA.filter((p) => {
      // Category check
      if (activeCategory !== 'All' && p.category !== activeCategory) {
        return false;
      }

      // Scent Note filter from Pyramid
      if (activeNoteFilter) {
        const lowerNote = activeNoteFilter.toLowerCase();
        const allNotes = [
          ...p.pyramid.top,
          ...p.pyramid.heart,
          ...p.pyramid.base,
        ].map((n) => n.toLowerCase());

        const hasNote = allNotes.some((n) => n.includes(lowerNote) || lowerNote.includes(n));
        if (!hasNote) return false;
      }

      // Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSubtitle = p.subtitle.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesNotes = [
          ...p.pyramid.top,
          ...p.pyramid.heart,
          ...p.pyramid.base,
        ].some((n) => n.toLowerCase());

        if (!matchesName && !matchesSubtitle && !matchesDesc && !matchesCategory && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategory, activeNoteFilter, searchQuery]);

  // Cart operations
  const handleAddToCart = (perfume: Perfume, size: BottleSize, quantity = 1) => {
    const itemKey = `${perfume.id}-${size}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemKey);
      if (existing) {
        return prev.map((i) =>
          i.id === itemKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            perfumeId: perfume.id,
            name: perfume.name,
            size,
            price: perfume.prices[size],
            quantity,
            image: perfume.image,
          },
        ];
      }
    });

    showToast(`Added ${quantity} × ${perfume.name} (${size}) to Bag`);
  };

  const handleAddDiscoveryKit = (kitItem: CartItem) => {
    setCartItems((prev) => [...prev, kitItem]);
    showToast(`Added Custom Discovery Set (3 × 5ml) to Bag`);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveNavSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPerfumeByName = (name: string) => {
    const found = PERFUMES_DATA.find(
      (p) => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase())
    );
    if (found) {
      setSelectedPerfumeForModal(found);
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#08090d] text-[#f4f4f6] flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 liquid-glass-gold rounded-2xl px-5 py-3.5 text-xs text-white shadow-2xl flex items-center gap-3 border border-[#d4af37]/50"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI Parfumeur Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(true)}
          className="liquid-glass-gold rounded-full px-5 py-3 text-xs text-white shadow-2xl flex items-center gap-2.5 border border-[#d4af37]/50 cursor-pointer group"
          title="Consult AI Master Parfumeur"
        >
          <div className="w-6 h-6 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#f3e5ab]">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
          </div>
          <span className="font-medium tracking-wide">Consult Master Parfumeur</span>
        </motion.button>
      </div>

      {/* Top Bar Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileDrawerOpen(true)}
        activeSection={activeNavSection}
        onNavigate={handleNavigate}
      />

      {/* Hero Section */}
      <HeroSection
        onExploreCollection={() => handleNavigate('collection')}
        onExplorePyramid={() => handleNavigate('pyramid')}
      />

      {/* Collection Section */}
      <motion.section
        id="collection"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full py-20 lg:py-28 border-b border-white/[0.06] bg-[#08090d]"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          {/* Section Kicker & Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-[#d4af37] font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Permanent Extraits Collection</span>
              </div>
              <h2
                className="text-3xl sm:text-5xl font-light text-white tracking-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Curated Flavors & Fragrances
              </h2>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-md leading-relaxed">
              Explore our five signature extraits. Each flacon is hand-blended with 30% oil concentration
              and aged in Limousin oak barrels for unmatched sillage and longevity.
            </p>
          </div>

          {/* Category Filter & Scent Note Search */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeNoteFilter={activeNoteFilter}
            onClearNoteFilter={() => setActiveNoteFilter(null)}
          />

          {/* Product Grid with Framer Motion Layout Transitions */}
          {filteredPerfumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center liquid-glass rounded-3xl p-12 border border-white/[0.06]"
            >
              <p className="text-xl text-white font-serif mb-2">No fragrances matched your criteria</p>
              <p className="text-xs text-zinc-400 mb-6">
                Try clearing your search query or reset the active olfactory note filter.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                  setActiveNoteFilter(null);
                }}
                className="liquid-glass-gold rounded-full px-6 py-2.5 text-xs text-white cursor-pointer"
              >
                View Full Collection
              </button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredPerfumes.map((perfume, index) => (
                  <ProductCard
                    key={perfume.id}
                    perfume={perfume}
                    index={index}
                    onOpenDetail={setSelectedPerfumeForModal}
                    onAddToCart={handleAddToCart}
                    onRequireAuth={() => setIsAuthModalOpen(true)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Interactive Scent Pyramid Engine */}
      <ScentPyramidInteractive
        perfumes={PERFUMES_DATA}
        onSelectPerfume={setSelectedPerfumeForModal}
        onFilterByNote={(note) => {
          setActiveNoteFilter(note);
          handleNavigate('collection');
          showToast(`Filtered collection by note: "${note}"`);
        }}
      />

      {/* Discovery Sample Kit Builder */}
      <DiscoveryKitBuilder
        perfumes={PERFUMES_DATA}
        onAddKitToCart={handleAddDiscoveryKit}
      />

      {/* Maison Craftsmanship & Provenance */}
      <MaisonStory />

      {/* Footer */}
      <Footer />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        perfume={selectedPerfumeForModal}
        onClose={() => setSelectedPerfumeForModal(null)}
        onAddToCart={handleAddToCart}
        onRequireAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Gemini AI Master Parfumeur Chatbot Modal */}
      <ParfumeurChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenPerfumeDetailByName={handleOpenPerfumeByName}
      />

      {/* Google Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* User Profile & Scent Vault Drawer */}
      <UserProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        onSelectPerfume={setSelectedPerfumeForModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
